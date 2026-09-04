import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const trips = await prisma.trip.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json({ trips })
    } catch (e) {
        console.error('[admin/trips] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const data = await req.json()
        if (!data.name || !data.destination || !data.description) {
            return NextResponse.json({ error: 'name, destination, and description are required' }, { status: 400 })
        }
        const trip = await prisma.trip.create({ data })
        return NextResponse.json({ trip })
    } catch (e) {
        console.error('[admin/trips] POST error:', e)
        return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id, ...data } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        const trip = await prisma.trip.update({ where: { id }, data })
        return NextResponse.json({ trip })
    } catch (e) {
        console.error('[admin/trips] PATCH error:', e)
        return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        await prisma.trip.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/trips] DELETE error:', e)
        return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 })
    }
}
