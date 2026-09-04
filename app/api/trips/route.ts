import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const dbTrips = await prisma.trip.findMany({ orderBy: { createdAt: 'asc' } })
        return NextResponse.json({ trips: dbTrips })
    } catch {
        return NextResponse.json({ trips: [] })
    }
}
