import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { encrypt } from '../../../../utils/session';
import { authService } from '@/shared/api/apiClientFactory';
import { rateLimit, getClientIp } from '../../../../utils/rateLimit';

const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
  name: z.string().optional(),
  role: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // 0. Sprawdzenie Rate Limitu na podstawie IP (5 prób na 15 minut)
    const ip = getClientIp(request);
    const rateLimitResult = rateLimit(`login_${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za 15 minut.' }, 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
    }
    const { email, password, name, role } = parsed.data;
    
    const adminPassword = process.env.CMS_ADMIN_PASSWORD;
    const isIframeDev = process.env.ALLOW_IFRAME_AUTH === 'true';

    // BEZPIECZEŃSTWO: Upewnij się, że hasło na produkcję/AI Studio nie jest puste
    if (!adminPassword) {
      console.error('CRITICAL ERROR: Brak CMS_ADMIN_PASSWORD w zmiennych środowiskowych (Secrets). Zdefiniuj je, aby uzyskać dostęp administratora.');
      return NextResponse.json({ success: false, message: 'Błąd konfiguracji serwera (Brak ENV)' }, { status: 500 });
    }

    // 1. Logowanie Administratora
    if (email === 'admin@admin.pl' && password === adminPassword) {
      const userObj = { email, name: name || 'Administrator', role: role || 'System Admin' };
      const sessionToken = await encrypt(userObj);
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'cms_session', 
        value: sessionToken, 
        httpOnly: true, 
        secure: true, 
        sameSite: isIframeDev ? 'none' : 'strict', 
        path: '/',
        maxAge: 60 * 60 * 24 // 24 godziny
      });
      return NextResponse.json({ success: true, user: userObj });
    }

    // 2. Bezpieczne logowanie zwykłych użytkowników (Weryfikacja po stronie serwera)
    if (email && password && email !== 'admin@admin.pl') {
      let isValidUser = false;
      let finalName = name || 'User';
      let finalRole = role || 'Konto Aktywne';

      // PRAWDZIWA WERYFIKACJA POPRZEZ APPSCRIPT (Zablokuje fejkowe maile)
      let finalEmailVerified = true; // default to true for older accounts or demo
      try {
        const appsData = await authService.loginUser({ email, password });
        
        if (appsData.status === 'success') {
          isValidUser = true;
          finalName = appsData.user?.name || finalName;
          finalRole = appsData.user?.role || finalRole;
          if (appsData.user?.emailVerified !== undefined) {
            finalEmailVerified = appsData.user?.emailVerified;
          }
        } else {
          console.warn(`[AUTH] Odmowa AppScript dla ${email}: ${appsData.message}`);
        }
      } catch (e) {
        console.error("[AUTH] Błąd komunikacji z AppScript.", e);
      }

      // Hardcodowany fallback Dema, jako ostatnia instancja bezpieczeństwa
      if (!isValidUser && email === 'demo@rpms.pl' && password === process.env.DEMO_PASSWORD && process.env.DEMO_PASSWORD) {
         isValidUser = true;
      }

      if (isValidUser) {
        const userObj = { email, name: finalName, role: finalRole, emailVerified: finalEmailVerified };
        const sessionToken = await encrypt(userObj);
        
        const cookieStore = await cookies();
        cookieStore.set({
          name: 'cms_session', 
          value: sessionToken, 
          httpOnly: true, 
          secure: true, 
          sameSite: isIframeDev ? 'none' : 'strict', 
          path: '/',
          maxAge: 60 * 60 * 24 // 24 godziny
        });
        return NextResponse.json({ success: true, user: userObj });
      }

      return NextResponse.json({ success: false, message: 'Nieprawidłowe dane logowania. Sprawdź e-mail oraz hasło i spróbuj ponownie.' }, { status: 401 });
    }

    return NextResponse.json({ success: false, message: 'Wymagane poprawne dane logowania' }, { status: 400 });
  } catch (error: any) {
    console.error('Krytyczny błąd logowania:', error);
    return NextResponse.json({ success: false, message: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}