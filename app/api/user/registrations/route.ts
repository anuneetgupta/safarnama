import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const registrations = await prisma.tripRegistration.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                tripName: true,
                status: true,
                createdAt: true,
                trip: {
                    select: {
                        id: true,
                        imageUrl: true,
                        startDate: true,
                        endDate: true,
                        price: true,
                        status: true,
                    },
                },
            },
        })
        return NextResponse.json({ registrations })
    } catch {
        return NextResponse.json({ registrations: [] }, { status: 500 })
    }
}
