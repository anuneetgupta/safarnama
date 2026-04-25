import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEMO_TRIPS } from '@/lib/data'

export async function GET() {
    try {
        const dbTrips = await prisma.trip.findMany({ orderBy: { createdAt: 'asc' } })

        // If no trips in DB yet, fall back to demo data
        if (dbTrips.length === 0) {
            return NextResponse.json({ trips: DEMO_TRIPS.map(t => ({
                id: t.id, name: t.destination, destination: t.destination,
                description: t.description, price: t.price, status: t.status,
                startDate: t.startDate, endDate: t.endDate,
                totalSlots: t.totalSlots, bookedSlots: t.bookedSlots,
                imageUrl: t.image, featured: false,
            })) })
        }

        return NextResponse.json({ trips: dbTrips })
    } catch {
        // On any DB error, return demo data
        return NextResponse.json({ trips: DEMO_TRIPS.map(t => ({
            id: t.id, name: t.destination, destination: t.destination,
            description: t.description, price: t.price, status: t.status,
            startDate: t.startDate, endDate: t.endDate,
            totalSlots: t.totalSlots, bookedSlots: t.bookedSlots,
            imageUrl: t.image, featured: false,
        })) })
    }
}
