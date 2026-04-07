import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, phone, college, instagram, facebook } = await req.json()
        if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })

        const hashed = await bcrypt.hash(password, 12)
        await prisma.user.create({
            data: { name, email, password: hashed, phone, college, instagram, facebook, emailVerified: new Date(), role: 'user' },
        })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }
}
