import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email?.trim()) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

        // Always return success to prevent email enumeration attacks.
        // Do not reveal whether the email exists.
        if (!user) return NextResponse.json({ success: true })

        // Delete any existing tokens for this email before creating a new one
        await prisma.passwordResetToken.deleteMany({ where: { email: normalizedEmail } })

        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        await prisma.passwordResetToken.create({ data: { email: normalizedEmail, token, expires } })

        const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
        const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

        await sendPasswordResetEmail(normalizedEmail, resetUrl)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[forgot-password] Error:', error)
        // Still return success to prevent enumeration — the email error is logged server-side
        return NextResponse.json({ success: true })
    }
}
