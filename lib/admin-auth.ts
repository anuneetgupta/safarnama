// Shared admin auth helper — accepts NextAuth session OR mobile Bearer JWT
import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { jwtVerify } from 'jose'

const getSecret = () => new TextEncoder().encode(
    process.env.MOBILE_JWT_SECRET || 'fallback-secret'
)

export async function requireAdmin(req?: NextRequest): Promise<boolean> {
    // 1. Check NextAuth session (web admin panel)
    const session = await auth()
    if (session?.user?.role === 'admin') return true

    // 2. Check Bearer JWT (mobile app)
    if (req) {
        const authHeader = req.headers.get('authorization') || ''
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7)
            try {
                const { payload } = await jwtVerify(token, getSecret())
                if (payload.role === 'admin') return true
            } catch {
                // invalid or expired token
            }
        }
    }

    return false
}
