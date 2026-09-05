import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json({ messages })
    } catch (e) {
        console.error('[admin/messages] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        await prisma.contactMessage.update({ where: { id }, data: { read: true } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/messages] PATCH error:', e)
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        await prisma.contactMessage.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/messages] DELETE error:', e)
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
    }
}
