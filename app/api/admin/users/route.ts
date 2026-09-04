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
