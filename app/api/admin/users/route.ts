import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, college: true, phone: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ users })
}
