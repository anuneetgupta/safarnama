import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const registrations = await prisma.tripRegistration.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ registrations })
}

export async function PATCH(req: NextRequest) {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id, status } = await req.json()
    await prisma.tripRegistration.update({ where: { id }, data: { status } })
    return NextResponse.json({ success: true })
}
