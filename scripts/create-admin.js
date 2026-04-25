const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Set DATABASE_URL directly
process.env.DATABASE_URL = 'file:./prisma/dev.db'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin' }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      console.log('Email: admin')
      console.log('Password: admin@safarnama.26')
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin@safarnama.26', 10)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email/Username: admin')
    console.log('Password: admin@safarnama.26')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('You can now login at: http://localhost:3000/auth/login')
    console.log('Or access admin panel at: http://localhost:3000/admin')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
