import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const trip = await prisma.trip.findUnique({ where: { id } })
        if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
        return NextResponse.json({ trip })
    } catch (e) {
        console.error('[trips/id] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 })
    }
}
