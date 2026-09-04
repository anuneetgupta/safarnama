import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'



const ALLOWED_TYPES = ['info', 'success', 'warning', 'urgent']

export async function GET() {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json({ announcements })
    } catch (e) {
        console.error('[admin/announcements] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const data = await req.json()
        if (!data.title?.trim() || !data.message?.trim()) {
            return NextResponse.json({ error: 'title and message are required' }, { status: 400 })
        }
        if (data.type && !ALLOWED_TYPES.includes(data.type)) {
            return NextResponse.json({ error: `type must be one of: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 })
        }
        const ann = await prisma.announcement.create({ data })
        return NextResponse.json({ ann })
    } catch (e) {
        console.error('[admin/announcements] POST error:', e)
        return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id, ...data } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        if (data.type && !ALLOWED_TYPES.includes(data.type)) {
            return NextResponse.json({ error: `type must be one of: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 })
        }
        const ann = await prisma.announcement.update({ where: { id }, data })
        return NextResponse.json({ ann })
    } catch (e) {
        console.error('[admin/announcements] PATCH error:', e)
        return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        await prisma.announcement.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/announcements] DELETE error:', e)
        return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 })
    }
}
