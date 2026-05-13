import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from './modules/auth/auth.service';

const protectedRoutes = ['/dashboard', '/api/protected'];
const authRoutes = ['/']; // Routes that should redirect to dashboard if logged in

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  const sessionCookie = request.cookies.get('session')?.value;
  const session = sessionCookie ? await AuthService.decryptSession(sessionCookie) : null;

  // 1. If trying to access protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. If trying to access login/home with session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
