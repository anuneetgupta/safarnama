import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json()
        if (!token || !password) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

        const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })
        if (!resetToken || resetToken.expires < new Date()) {
            return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
        }

        const hashed = await bcrypt.hash(password, 12)

        // Update the credentials account password
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email },
            include: { accounts: true },
        })

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const credAccount = user.accounts.find(a => a.provider === 'credentials')
        if (credAccount) {
            await prisma.account.update({
                where: { id: credAccount.id },
                data: { access_token: hashed },
            })
        }

        // Delete the used token
        await prisma.passwordResetToken.delete({ where: { token } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }
}
