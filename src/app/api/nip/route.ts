import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '../../../utils/rateLimit';

export async function GET(request: Request) {
  // Rate limiting: 10 requests per minute per IP
  const ip = getClientIp(request);
  const rateLimitResult = rateLimit(`nip_${ip}`, { limit: 10, windowMs: 60 * 1000 });
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Zbyt wiele zapytań. Spróbuj ponownie za chwilę.' }, 
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

  const { searchParams } = new URL(request.url);
  const nip = searchParams.get('nip');

  if (!nip || nip.length !== 10) {
    return NextResponse.json({ error: 'Invalid NIP' }, { status: 400 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const mfUrl = `https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${today}`;
    
    const response = await fetch(mfUrl);
    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
      }
    });
  } catch (error) {
    console.error('Error fetching NIP data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
