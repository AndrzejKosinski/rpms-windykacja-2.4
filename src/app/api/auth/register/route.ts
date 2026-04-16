import { NextResponse } from 'next/server';
import { callAppsScript } from '@/shared/api/appsScriptClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Call GAS to register the user
    const appsData = await callAppsScript('REGISTER_USER', body);
    
    if (appsData.status === 'success' && appsData.activationToken) {
      // 2. Send activation email via our internal contact API
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const host = request.headers.get('host');
      const baseUrl = `${protocol}://${host}`;
      
      const activationUrl = `${baseUrl}/auth/verify?token=${appsData.activationToken}`;
      
      try {
        await fetch(`${baseUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'accountActivation',
            data: {
              USER_EMAIL: body.email,
              USER_NAME: body.name || body.email.split('@')[0],
              ACTIVATION_URL: activationUrl
            }
          })
        });
      } catch (emailErr) {
        console.error('Błąd wysyłki e-maila aktywacyjnego:', emailErr);
        // We don't fail the registration if email fails, but we log it
      }
    }
    
    return NextResponse.json(appsData);
  } catch (error: any) {
    console.error('Błąd rejestracji:', error);
    return NextResponse.json({ status: 'error', message: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}
