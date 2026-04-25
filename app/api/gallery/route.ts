import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const photos = await prisma.galleryPhoto.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json({ photos })
    } catch {
        return NextResponse.json({ photos: [] }, { status: 500 })
    }
}
