import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json()

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
        }

        const msg = await prisma.contactMessage.create({
            data: {
                name: name.trim(),
                email: email.trim(),
                subject: subject?.trim() || 'General Inquiry',
                message: message.trim(),
            },
        })

        return NextResponse.json({ success: true, id: msg.id })
    } catch (e) {
        console.error('[api/messages] POST error:', e)
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }
}
