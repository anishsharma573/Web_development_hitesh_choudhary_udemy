import { NextResponse } from "next/server";

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/signup';

    const token = request.cookies.get('token')?.value || '';

    // Redirect logged-in users away from public pages like /login or /signup
    if (isPublicPath && token) {
        console.log("Redirecting to '/' because user is already authenticated");
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // Redirect non-authenticated users away from protected paths
    if (!isPublicPath && !token) {
        console.log("Redirecting to '/login' because user is not authenticated");
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Allow access if no conditions above are met
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', // Home
        '/profile', // Profile page
        '/profile/:path*', // Nested profile pages
        '/login', // Login page
        '/signup', // Signup page
    ],
};
