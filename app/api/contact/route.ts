import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json()
        await prisma.contactMessage.create({ data: { name, email, subject, message } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }
}
