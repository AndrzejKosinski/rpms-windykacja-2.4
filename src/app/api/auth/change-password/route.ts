import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { decrypt } from '../../../../utils/session';
import { authService } from '@/shared/api/apiClientFactory';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Aktualne hasło jest wymagane'),
  newPassword: z.string().min(8, 'Nowe hasło musi mieć min. 8 znaków'),
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cms_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, message: 'Brak sesji' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie.value);
    if (!session || !session.email) {
      return NextResponse.json({ success: false, message: 'Nieprawidłowa sesja' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Nieprawidłowe dane wejściowe', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { currentPassword, newPassword } = parsed.data;
    
    const appsData = await authService.changePassword({
      email: session.email,
      currentPassword,
      newPassword
    });

    if (appsData.status === 'success') {
      return NextResponse.json({ success: true, message: 'Hasło zostało pomyślnie zmienione' });
    } else {
      return NextResponse.json({ success: false, message: appsData.message || 'Błędne aktualne hasło lub błąd serwera' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Błąd zmiany hasła:', error);
    return NextResponse.json({ success: false, message: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}
