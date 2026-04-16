import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { decrypt } from '../../../../utils/session';
import { settingsService } from '@/shared/api/apiClientFactory';

const companyDetailsSchema = z.object({
  nip: z.string().length(10, 'NIP musi składać się z 10 cyfr').regex(/^\d+$/, 'NIP może zawierać tylko cyfry'),
  companyName: z.string().min(1, 'Nazwa firmy jest wymagana'),
  address: z.string().min(1, 'Adres jest wymagany'),
  iban: z.string()
    .transform(val => val.replace(/\s/g, ''))
    .refine(val => /^PL\d{26}$/.test(val), {
      message: 'Nieprawidłowy format numeru konta IBAN (wymagane PL + 26 cyfr)'
    }),
  billingEmail: z.string().email('Nieprawidłowy adres e-mail')
});

export async function GET(request: Request) {
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

    const appsData = await settingsService.getCompanyData({ email: session.email });

    if (appsData.status === 'success') {
      return NextResponse.json({ success: true, data: appsData.data });
    } else {
      return NextResponse.json({ success: false, message: appsData.message || 'Błąd pobierania danych' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Błąd pobierania danych firmy:', error);
    return NextResponse.json({ success: false, message: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}

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
    const parsed = companyDetailsSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Nieprawidłowe dane wejściowe', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const appsData = await settingsService.updateCompanyData({
      email: session.email,
      data: parsed.data
    });

    if (appsData.status === 'success') {
      return NextResponse.json({ success: true, message: 'Dane zostały pomyślnie zaktualizowane' });
    } else {
      return NextResponse.json({ success: false, message: appsData.message || 'Błąd aktualizacji danych' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Błąd aktualizacji danych firmy:', error);
    return NextResponse.json({ success: false, message: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}
