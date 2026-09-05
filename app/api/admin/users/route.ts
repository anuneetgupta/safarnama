import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    if (!await requireAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, college: true, phone: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json({ users })
    } catch (e) {
        console.error('[admin/users] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id, role } = await req.json()
        if (!id || !role) return NextResponse.json({ error: 'id and role required' }, { status: 400 })
        if (!['user', 'admin'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
        await prisma.user.update({ where: { id }, data: { role } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/users] PATCH error:', e)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}
