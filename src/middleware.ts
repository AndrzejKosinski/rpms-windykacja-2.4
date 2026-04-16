import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './utils/session';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('cms_session');

  // Protect /panel routes
  if (request.nextUrl.pathname.startsWith('/panel')) {
    if (!session || !session.value) {
      // Redirect to home page if no session cookie
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Verify JWT signature
    const user = await decrypt(session.value);
    if (!user) {
      // Redirect to home page if session is invalid or expired
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*'],
};
