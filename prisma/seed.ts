import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashed = await bcrypt.hash('admin@safarnama123', 12)
    await prisma.user.upsert({
        where: { email: 'admin@safarnama.com' },
        update: {},
        create: {
            name: 'Safarnama Admin',
            email: 'admin@safarnama.com',
            password: hashed,
            role: 'admin',
            emailVerified: new Date(),
        },
    })
    console.log('✅ Admin seeded: admin@safarnama.com / admin@safarnama123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
