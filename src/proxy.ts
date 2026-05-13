import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from './modules/auth/auth.service';

const protectedRoutes = ['/dashboard', '/api/protected'];
const authRoutes = ['/']; // Routes that should redirect to dashboard if logged in

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session')?.value;
  
  let session = null;
  if (sessionToken) {
    session = await AuthService.decryptSession(sessionToken);
  }

  // 1. Redirect to dashboard if logged in and accessing login page
  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Redirect to login if NOT logged in and accessing dashboard
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Config to specify which paths proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
