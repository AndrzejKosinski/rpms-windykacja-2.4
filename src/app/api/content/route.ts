import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { fetchContentFromCMS, saveContentToCMS, initializeCMSInCloud } from '../../../services/cmsRepository';
import { decrypt } from '../../../utils/session';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') === 'index' ? 'index' : 'full';
    
    const data = await fetchContentFromCMS(view);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Route Error (GET /api/content):', error);
    return NextResponse.json(
      { error: 'Failed to fetch content from CMS', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Security check: Verify HttpOnly cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cms_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized. Missing cms_session cookie.' }, { status: 401 });
    }

    const userObj = await decrypt(sessionCookie.value);
    
    if (!userObj) {
      return NextResponse.json({ error: 'Unauthorized. Invalid session.' }, { status: 401 });
    }
    
    // Optional: Check if user is an admin
    if (userObj.role !== 'System Admin' && userObj.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    
    if (body.action === 'UPDATE_CMS') {
      const result = await saveContentToCMS(body.data);
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true, result });
    } else if (body.action === 'INITIALIZE_CMS') {
      const result = await initializeCMSInCloud(body.data);
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Route Error (POST /api/content):', error);
    return NextResponse.json(
      { error: 'Failed to save content to CMS', details: error.message },
      { status: 500 }
    );
  }
}
