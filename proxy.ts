import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Protect dashboard and admin routes
    const isProtected =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin')

    if (isProtected && !isLoggedIn) {
        return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        // Exclude static files and API routes from proxy
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|3d-guy.png).*)',
    ],
}
