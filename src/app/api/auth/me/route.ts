import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '../../../../utils/session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cms_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const userObj = await decrypt(sessionCookie.value);
    
    if (!userObj) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: userObj });
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
