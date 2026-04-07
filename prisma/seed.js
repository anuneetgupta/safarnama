const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
    datasourceUrl: undefined,
})

async function main() {
    const hashed = await bcrypt.hash('admin@safarnama123', 12)
    const admin = await prisma.user.upsert({
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
    console.log('Admin created:', admin.email)
}

main().catch(console.error).finally(() => prisma.$disconnect())
