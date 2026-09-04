import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/user/profile — fetch current user's full profile
export async function GET() {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                college: true,
                city: true,
                instagram: true,
                facebook: true,
                bio: true,
                interests: true,
                role: true,
                createdAt: true,
                emailVerified: true,
            },
        })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
        return NextResponse.json({ user })
    } catch (e) {
        console.error('[profile GET]', e)
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }
}

// PUT /api/user/profile — update current user's profile
export async function PUT(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
        const body = await req.json()
        const { name, phone, college, city, instagram, facebook, bio, interests } = body

        // Basic validation
        if (name !== undefined && !name?.trim()) {
            return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
        }
        if (interests !== undefined && !Array.isArray(interests)) {
            return NextResponse.json({ error: 'Interests must be an array' }, { status: 400 })
        }

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(name        !== undefined && { name: name.trim() }),
                ...(phone       !== undefined && { phone: phone?.trim() || null }),
                ...(college     !== undefined && { college: college?.trim() || null }),
                ...(city        !== undefined && { city: city?.trim() || null }),
                ...(instagram   !== undefined && { instagram: instagram?.trim() || null }),
                ...(facebook    !== undefined && { facebook: facebook?.trim() || null }),
                ...(bio         !== undefined && { bio: bio?.trim() || null }),
                ...(interests   !== undefined && { interests }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                college: true,
                city: true,
                instagram: true,
                facebook: true,
                bio: true,
                interests: true,
            },
        })
        return NextResponse.json({ user: updated })
    } catch (e) {
        console.error('[profile PUT]', e)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}
