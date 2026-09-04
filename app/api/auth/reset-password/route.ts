import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
        }

        const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })
        if (!resetToken || resetToken.expires < new Date()) {
            return NextResponse.json(
                { error: 'Reset link has expired. Please request a new one.' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({ where: { email: resetToken.email } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const hashed = await bcrypt.hash(password, 12)

        // Correctly update the user's password field (not Account.access_token)
        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashed },
        })

        // Delete the used token to prevent reuse
        await prisma.passwordResetToken.delete({ where: { token } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }
}
