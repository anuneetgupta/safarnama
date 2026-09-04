import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/reviews — public, returns published reviews
export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json({ reviews })
    } catch {
        return NextResponse.json({ reviews: [] })
    }
}

// POST /api/reviews — requires login
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Please sign in to leave a review' }, { status: 401 })
        }

        const { tripName, rating, title, review, college, location } = await req.json()
        if (!tripName?.trim() || !title?.trim() || !review?.trim()) {
            return NextResponse.json({ error: 'Trip, title and review are required' }, { status: 400 })
        }
        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
        }

        // Get user info
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })

        const newReview = await prisma.review.create({
            data: {
                name: session.user.name || 'Anonymous',
                email: session.user.email,
                avatar: session.user.image || null,
                college: college?.trim() || user?.college || null,
                location: location?.trim() || null,
                tripName: tripName.trim(),
                rating: Number(rating),
                title: title.trim(),
                review: review.trim(),
                userId: user?.id || null,
                published: false, // Admin must approve
                verified: false,
                fake: false,
            },
        })

        return NextResponse.json({ success: true, id: newReview.id, message: 'Review submitted! It will appear after admin approval.' })
    } catch (e) {
        console.error('[api/reviews] POST error:', e)
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }
}
