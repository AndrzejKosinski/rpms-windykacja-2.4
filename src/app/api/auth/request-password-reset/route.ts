import { NextResponse } from 'next/server';
import { callAppsScript } from '@/shared/api/appsScriptClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Call GAS to initiate password reset
    const appsData = await callAppsScript('REQUEST_PASSWORD_RESET', body);
    
    if (appsData.status === 'success' && appsData.resetToken) {
      // 2. Send password reset email via our internal contact API
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const host = request.headers.get('host');
      const baseUrl = `${protocol}://${host}`;
      
      const resetUrl = `${baseUrl}/auth/reset-password?token=${appsData.resetToken}`;
      
      try {
        await fetch(`${baseUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'passwordReset',
            data: {
              USER_EMAIL: body.email,
              USER_NAME: appsData.userName || body.email.split('@')[0],
              RESET_URL: resetUrl
            }
          })
        });
      } catch (emailErr) {
        console.error('Błąd wysyłki e-maila resetującego hasło:', emailErr);
      }
    }
    
    // We return success even if email fails, or if user doesn't exist (security)
    return NextResponse.json(appsData);
  } catch (error: any) {
    console.error('Błąd resetowania hasła:', error);
    return NextResponse.json({ status: 'error', message: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}
