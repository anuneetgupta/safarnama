import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return NextResponse.json({ step: 'user_not_found', email })
        if (!user.password) return NextResponse.json({ step: 'no_password', user: { id: user.id, email: user.email, role: user.role } })
        const valid = await bcrypt.compare(password, user.password)
        return NextResponse.json({ step: valid ? 'success' : 'wrong_password', user: { id: user.id, email: user.email, role: user.role, hasPassword: !!user.password } })
    } catch (e) {
        return NextResponse.json({ step: 'error', error: String(e) }, { status: 500 })
    }
}
