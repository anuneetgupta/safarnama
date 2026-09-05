import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// GET — all reviews (published + pending)
export async function GET(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json({ reviews })
    } catch (e) {
        console.error('[admin/reviews] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
}

// POST — admin adds a fake review
export async function POST(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const body = await req.json()
        const review = await prisma.review.create({
            data: {
                name: body.name,
                email: body.email || null,
                college: body.college || null,
                location: body.location || null,
                avatar: body.avatar || null,
                tripName: body.tripName,
                rating: Number(body.rating) || 5,
                title: body.title,
                review: body.review,
                published: true,
                verified: body.verified ?? true,
                fake: true,
            },
        })
        return NextResponse.json({ success: true, review })
    } catch (e) {
        console.error('[admin/reviews] POST error:', e)
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
    }
}

// PATCH — approve / toggle verified / update
export async function PATCH(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id, ...data } = await req.json()
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
        const review = await prisma.review.update({ where: { id }, data })
        return NextResponse.json({ success: true, review })
    } catch (e) {
        console.error('[admin/reviews] PATCH error:', e)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }
}

// DELETE — single review or bulk-delete all seeded reviews
export async function DELETE(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const body = await req.json()

        // Bulk delete: remove ALL reviews (wipes seeded fake data)
        if (body.deleteAll === true) {
            const { count } = await prisma.review.deleteMany({})
            return NextResponse.json({ success: true, deleted: count })
        }

        // Single delete by id
        if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
        await prisma.review.delete({ where: { id: body.id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/reviews] DELETE error:', e)
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }
}
