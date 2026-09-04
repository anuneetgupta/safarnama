import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
    const session = await auth()
    if (!session || session.user?.role !== 'admin') return null
    return session
}

export async function GET() {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const registrations = await prisma.tripRegistration.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json({ registrations })
    } catch (e) {
        console.error('[admin/registrations] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id, status } = await req.json()
        if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
        const allowed = ['pending', 'confirmed', 'cancelled']
        if (!allowed.includes(status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
        }
        await prisma.tripRegistration.update({ where: { id }, data: { status } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/registrations] PATCH error:', e)
        return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
    }
}
