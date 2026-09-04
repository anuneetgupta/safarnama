import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, subject, message } = body

        // Input validation
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            )
        }
        if (!email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
        }
        if (message.trim().length < 10) {
            return NextResponse.json(
                { error: 'Message must be at least 10 characters.' },
                { status: 400 }
            )
        }

        // Attach userId if logged in
        const session = await auth()
        const userId = session?.user?.id ?? undefined

        await prisma.contactMessage.create({
            data: {
                userId,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                subject: subject?.trim() || null,
                message: message.trim(),
            },
        })

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[contact] Error:', e)
        return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
    }
}
