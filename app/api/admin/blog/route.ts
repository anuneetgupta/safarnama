import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'



export async function GET(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json({ posts })
    } catch (e) {
        console.error('[admin/blog] GET error:', e)
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const data = await req.json()
        if (!data.title?.trim() || !data.content?.trim()) {
            return NextResponse.json({ error: 'title and content are required' }, { status: 400 })
        }
        const post = await prisma.blogPost.create({ data })
        return NextResponse.json({ post })
    } catch (e) {
        console.error('[admin/blog] POST error:', e)
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id, ...data } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        const post = await prisma.blogPost.update({ where: { id }, data })
        return NextResponse.json({ post })
    } catch (e) {
        console.error('[admin/blog] PATCH error:', e)
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
        await prisma.blogPost.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[admin/blog] DELETE error:', e)
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
    }
}
