import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
    try {
        // Check if admin already exists
        const existing = await prisma.user.findUnique({ where: { email: 'admin@safarnama.com' } })

        if (existing) {
            // Update password to make sure it's correct
            const hashed = await bcrypt.hash('admin@safarnama123', 12)
            await prisma.user.update({
                where: { email: 'admin@safarnama.com' },
                data: { password: hashed, role: 'admin' }
            })
            return NextResponse.json({ message: 'Admin password reset', email: 'admin@safarnama.com', password: 'admin@safarnama123' })
        }

        const hashed = await bcrypt.hash('admin@safarnama123', 12)
        await prisma.user.create({
            data: {
                name: 'Safarnama Admin',
                email: 'admin@safarnama.com',
                password: hashed,
                role: 'admin',
                emailVerified: new Date(),
            }
        })

        return NextResponse.json({ message: 'Admin created!', email: 'admin@safarnama.com', password: 'admin@safarnama123' })
    } catch (e: unknown) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}
