const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer) }))
}

async function createAdmin() {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('  Safarnama Admin User Setup')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

        // Use env var for non-interactive mode, otherwise prompt
        const email = process.env.ADMIN_EMAIL || await prompt('Admin email: ')
        const password = process.env.ADMIN_PASSWORD || await prompt('Admin password (min 8 chars): ')
        const name = process.env.ADMIN_NAME || await prompt('Admin display name [Safarnama Admin]: ') || 'Safarnama Admin'

        if (!email.includes('@')) {
            console.error('❌ Invalid email address. Please use a real email (e.g. admin@yourdomain.com).')
            process.exit(1)
        }
        if (password.length < 8) {
            console.error('❌ Password must be at least 8 characters.')
            process.exit(1)
        }

        const existing = await prisma.user.findUnique({ where: { email } })

        if (existing) {
            if (existing.role === 'admin') {
                console.log(`✅ Admin user already exists: ${email}`)
                console.log('   To reset the password, delete the user and run this script again.')
            } else {
                // Promote existing user to admin
                await prisma.user.update({
                    where: { email },
                    data: { role: 'admin', emailVerified: new Date() },
                })
                console.log(`✅ User ${email} promoted to admin.`)
            }
            return
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'admin',
                emailVerified: new Date(),
            },
        })

        console.log('✅ Admin user created successfully!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`   Email: ${email}`)
        console.log('   Password: [hidden — use what you entered]')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('You can now login at: /auth/login')
    } catch (error) {
        console.error('❌ Error creating admin user:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
