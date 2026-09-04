import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Basic input validation
        const { name, email, phone, destination } = body
        if (!name?.trim() || !email?.trim() || !phone?.trim() || !destination?.trim()) {
            return NextResponse.json(
                { error: 'Name, email, phone, and destination are required.' },
                { status: 400 }
            )
        }
        if (!email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
        }

        // Attach userId if the user is logged in — makes registrations visible in their dashboard
        const session = await auth()
        const userId = session?.user?.id ?? undefined

        const reg = await prisma.tripRegistration.create({
            data: {
                userId,
                name: body.name.trim(),
                email: body.email.trim().toLowerCase(),
                phone: body.phone.trim(),
                college: body.college?.trim() || null,
                city: body.city?.trim() || null,
                gender: body.gender || null,
                age: body.age || null,
                tripName: body.destination.trim(),
                message: body.message?.trim() || null,
                status: 'pending',
            },
        })

        return NextResponse.json({ success: true, id: reg.id })
    } catch (e) {
        console.error('[trip-register] Error:', e)
        return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
    }
}
