import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ messages })
}

export async function PATCH(req: NextRequest) {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await req.json()
    await prisma.contactMessage.update({ where: { id }, data: { read: true } })
    return NextResponse.json({ success: true })
}
