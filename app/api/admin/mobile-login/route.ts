import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const getSecret = () => new TextEncoder().encode(
    process.env.MOBILE_JWT_SECRET || 'fallback-secret'
)

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        })

        if (!user || !user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Not an admin account' }, { status: 403 })
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Sign a JWT valid for 30 days
        const token = await new SignJWT({
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d')
            .sign(getSecret())

        return NextResponse.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (e) {
        console.error('[mobile-login] error:', e)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
