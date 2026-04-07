import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const reg = await prisma.tripRegistration.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                college: body.college,
                city: body.city,
                gender: body.gender,
                age: body.age,
                tripName: body.destination,
                message: body.message,
                status: 'pending',
            },
        })
        return NextResponse.json({ success: true, id: reg.id })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }
}
