import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
    const isLoggedIn = !!req.auth
    const isAdmin = req.auth?.user?.role === 'admin'
    const { pathname } = req.nextUrl

    // Block dangerous dev endpoints permanently in production
    if (process.env.NODE_ENV === 'production') {
        if (pathname.startsWith('/api/debug-auth') || pathname.startsWith('/api/setup')) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
    }

    // Protect /dashboard — any authenticated user
    if (pathname.startsWith('/dashboard') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
    }

    // Protect /admin — authenticated AND admin role required
    if (pathname.startsWith('/admin')) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
        }
        if (!isAdmin) {
            // Logged in but not admin — redirect to home, not login
            return NextResponse.redirect(new URL('/', req.nextUrl))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/api/debug-auth/:path*',
        '/api/setup/:path*',
        // Exclude static files and API routes from general proxy
        '/((?!api|_next/static|_next/image|favicon\\.ico|logo\\.png|3d-guy\\.png|login-character\\.png|contact-hero\\.jpg|atish\\.jpeg|priyanshu\\.jpeg|shivansh\\.jpeg).*)',
    ],
}
