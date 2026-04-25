import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
    const session = await auth()
    return (session?.user as { role?: string })?.role === 'admin' ? session : null
}

export async function GET() {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ posts })
}

export async function POST(req: NextRequest) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const data = await req.json()
    const post = await prisma.blogPost.create({ data })
    return NextResponse.json({ post })
}

export async function PATCH(req: NextRequest) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id, ...data } = await req.json()
    const post = await prisma.blogPost.update({ where: { id }, data })
    return NextResponse.json({ post })
}

export async function DELETE(req: NextRequest) {
    if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await req.json()
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
