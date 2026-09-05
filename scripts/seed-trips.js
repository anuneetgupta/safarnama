/**
 * Seed script — adds 3 sample past trips + registrations for the given user email.
 * Usage:  node scripts/seed-trips.js [userEmail]
 * Example: node scripts/seed-trips.js mauryaman2005@gmail.com
 */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const SAMPLE_TRIPS = [
    {
        name: 'Banaras Vibes',
        destination: 'Varanasi, Uttar Pradesh',
        description: 'Experience the spiritual heart of India — Ganga Aarti, ancient ghats, and timeless culture. An unforgettable group trip through the streets of Banaras.',
        price: 3000,
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-01-18',
        totalSlots: 30,
        bookedSlots: 28,
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
        featured: true,
        category: 'culture',
    },
    {
        name: 'Rishikesh Rush',
        destination: 'Rishikesh, Uttarakhand',
        description: 'River rafting, bungee jumping, camping by the Ganges. The adventure capital of India awaits your tribe.',
        price: 4500,
        status: 'completed',
        startDate: '2024-03-08',
        endDate: '2024-03-11',
        totalSlots: 25,
        bookedSlots: 22,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        featured: false,
        category: 'adventure',
    },
    {
        name: 'Manali Adventure',
        destination: 'Manali, Himachal Pradesh',
        description: 'Snow-capped peaks, Rohtang Pass, Solang Valley and beyond. The ultimate Himalayan escape for thrill-seekers.',
        price: 6000,
        status: 'coming_soon',
        startDate: null,
        endDate: null,
        totalSlots: 30,
        bookedSlots: 0,
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
        featured: true,
        category: 'mountain',
    },
]

async function main() {
    const userEmail = process.argv[2]

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  Safarnama — Seed Trips')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Upsert trips
    const tripRecords = []
    for (const t of SAMPLE_TRIPS) {
        const existing = await prisma.trip.findFirst({ where: { name: t.name } })
        if (existing) {
            console.log(`⚠  Trip already exists: ${t.name}`)
            tripRecords.push(existing)
        } else {
            const trip = await prisma.trip.create({ data: t })
            console.log(`✅ Created trip: ${t.name}`)
            tripRecords.push(trip)
        }
    }

    // If user email provided, create 2 sample registrations (past trips)
    if (userEmail) {
        const user = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase() } })
        if (!user) {
            console.log(`❌ User not found: ${userEmail}`)
        } else {
            const pastTrips = tripRecords.filter(t => t.status === 'completed').slice(0, 2)
            for (const trip of pastTrips) {
                const exists = await prisma.tripRegistration.findFirst({
                    where: { userId: user.id, tripId: trip.id }
                })
                if (exists) {
                    console.log(`⚠  Registration already exists for: ${trip.name}`)
                } else {
                    await prisma.tripRegistration.create({
                        data: {
                            userId: user.id,
                            tripId: trip.id,
                            name: user.name || 'Traveler',
                            email: user.email,
                            phone: user.phone || '9999999999',
                            college: user.college || 'Safarnama University',
                            tripName: trip.name,
                            status: 'confirmed',
                        }
                    })
                    console.log(`✅ Created registration: ${trip.name} for ${userEmail}`)
                }
            }
        }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  Done!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
