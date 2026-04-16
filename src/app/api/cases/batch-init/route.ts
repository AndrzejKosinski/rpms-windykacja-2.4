import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/utils/session';
import { debtCaseService } from '@/shared/api/apiClientFactory';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, userName, items, isManual } = body;

    // Opcjonalna weryfikacja sesji dla powracających użytkowników
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cms_session');
    
    let isAuthenticated = false;
    if (sessionCookie) {
      const session = await decrypt(sessionCookie.value);
      if (session && session.email === userEmail) {
        isAuthenticated = true;
      }
    }

    // Wywołanie Apps Script z poziomu serwera (Backend-to-Backend)
    // Przekazujemy flagę skipEmail: true, aby GAS nie wysyłał powiadomienia
    const result = await debtCaseService.batchInitDebt({
      userEmail,
      userName,
      password: isAuthenticated ? "VERIFIED_BY_NEXTJS" : "", 
      items,
      skipEmail: true
    });

    if (result.status === 'success') {
      // Wyślij e-mail z poziomu Next.js używając istniejącego endpointu /api/contact
      try {
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const baseUrl = `${protocol}://${host}`;
        
        await fetch(`${baseUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'leadDebt',
            data: {
              email: userEmail,
              name: userName,
              CASE_DETAILS: items.map((i: any) => `${i.debtorName} - ${i.amount} PLN`).join('\n')
            }
          })
        });
      } catch (emailError) {
        console.error('Błąd wysyłania e-maila po dodaniu sprawy:', emailError);
        // Nie przerywamy procesu, sprawa została dodana
      }

      return NextResponse.json(result);
    } else {
      return NextResponse.json({ success: false, message: result.message || 'Błąd Apps Script' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Błąd w /api/cases/batch-init:', error);
    return NextResponse.json({ success: false, message: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}
