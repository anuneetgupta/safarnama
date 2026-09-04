import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'



export async function GET() {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const photos = await prisma.galleryPhoto.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json({ photos })
    } catch (e) {
        console.error('[admin/gallery] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch gallery photos' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const data = await req.json()
        if (!data.url?.trim() || !data.tripName?.trim()) {
            return NextResponse.json({ error: 'url and tripName are required' }, { status: 400 })
        }
        const photo = await prisma.galleryPhoto.create({ data })
        return NextResponse.json({ photo })
    } catch (e) {
        console.error('[admin/gallery] POST error:', e)
        return NextResponse.json({ error: 'Failed to create gallery photo' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id, ...data } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        const photo = await prisma.galleryPhoto.update({ where: { id }, data })
        return NextResponse.json({ photo })
    } catch (e) {
        console.error('[admin/gallery] PATCH error:', e)
        return NextResponse.json({ error: 'Failed to update gallery photo' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        await prisma.galleryPhoto.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/gallery] DELETE error:', e)
        return NextResponse.json({ error: 'Failed to delete gallery photo' }, { status: 500 })
    }
}
