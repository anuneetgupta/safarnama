import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Very basic email format check (covers the vast majority of valid emails)
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, phone, college, instagram, facebook } = await req.json()

        // Required fields
        if (!name?.trim() || !email?.trim() || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })
        }

        // Email format
        if (!isValidEmail(email.trim())) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
        }

        // Password strength
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
        }

        const hashed = await bcrypt.hash(password, 12)

        await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                password: hashed,
                phone: phone?.trim() || null,
                college: college?.trim() || null,
                instagram: instagram?.trim() || null,
                facebook: facebook?.trim() || null,
                emailVerified: new Date(),
                role: 'user',
            },
        })

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[register] Error:', e)
        return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
    }
}
