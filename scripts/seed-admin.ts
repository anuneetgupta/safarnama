// Seed/upsert the admin account with password credentials
// Run: npx tsx scripts/seed-admin.ts
import { prisma } from '../lib/prisma'

async function main() {
    const email   = process.env.ADMIN_EMAIL    || 'admin@safarnama.crazy'
    const name    = process.env.ADMIN_NAME     || 'Safarnama Admin'
    // Pre-hashed password: crazy.safarnama@sangharsh2safalta
    const pwHash  = '$2b$12$0Xxww6VZViFlubor8agY5Ox20h5by41uV33ojPbk2zt9dDVVsYlsC'

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
        await prisma.user.update({
            where: { email },
            data:  { name, password: pwHash, role: 'admin' }
        })
        console.log(`✅ Admin account updated: ${email}`)
    } else {
        await prisma.user.create({
            data: { email, name, password: pwHash, role: 'admin' }
        })
        console.log(`✅ Admin account created: ${email}`)
    }
}

main().catch(console.error).finally(() => prisma.$disconnect())
