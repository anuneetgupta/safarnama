import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
    const session = await auth()
    return (session?.user as { role?: string })?.role === 'admin' ? session : null
}

export async function GET() {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ announcements })
}

export async function POST(req: NextRequest) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const data = await req.json()
    const ann = await prisma.announcement.create({ data })
    return NextResponse.json({ ann })
}

export async function PATCH(req: NextRequest) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id, ...data } = await req.json()
    const ann = await prisma.announcement.update({ where: { id }, data })
    return NextResponse.json({ ann })
}

export async function DELETE(req: NextRequest) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await req.json()
    await prisma.announcement.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
