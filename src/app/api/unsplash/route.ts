import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '../../../utils/session';
import { logError, ErrorContext, ErrorSeverity } from '../../../utils/errorLogger';

export async function GET(request: Request) {
  try {
    // 1. Security check: Verify session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cms_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await decrypt(sessionCookie.value);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get query params
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const perPage = searchParams.get('per_page') || '12';

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    // 3. Fetch from Unsplash using private key
    // We try UNSPLASH_ACCESS_KEY first, then fallback to NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    const accessKey = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      await logError({
        message: 'Unsplash API key not configured on server',
        context: ErrorContext.UNSPLASH,
        severity: ErrorSeverity.CRITICAL
      });
      return NextResponse.json({ error: 'Unsplash API key not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&client_id=${accessKey}`,
      {
        headers: {
          'Accept-Version': 'v1'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      await logError({
        message: 'Unsplash API returned an error',
        context: ErrorContext.UNSPLASH,
        severity: ErrorSeverity.ERROR,
        metadata: { status: response.status, errorData }
      });
      return NextResponse.json({ error: 'Unsplash API error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    await logError({
      message: 'Unexpected error in Unsplash proxy',
      context: ErrorContext.UNSPLASH,
      severity: ErrorSeverity.ERROR,
      error
    });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
