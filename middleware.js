// middleware.js (create this in your root directory, same level as app/)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the authentication token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Define protected routes
  const protectedPaths = ['/dashboard', '/matches', '/my-posts','/post-found', 'post-lost' ];
  
  // Check if current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // If trying to access protected route without token, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/auth', request.url);
    // Optional: Add redirect parameter to return after login
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If logged in and trying to access login page, redirect to dashboard
  if (token && request.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};