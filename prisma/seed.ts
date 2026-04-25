import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Safarnama database...\n')

    // ── Admin User ────────────────────────────────────────────────────────────
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
    console.log(`✅ Admin: ${admin.email}  /  password: admin@safarnama123`)

    // ── Trips ─────────────────────────────────────────────────────────────────
    const trips = [
        {
            name: 'Banaras Vibes',
            destination: 'Banaras Vibes',
            description: 'Experience the spiritual energy of Varanasi with sunrise boat rides, temple visits, and unforgettable Ganga Aarti.',
            price: 3000,
            status: 'completed',
            startDate: '2026-01-15',
            endDate: '2026-01-18',
            totalSlots: 30,
            bookedSlots: 30,
            imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
            featured: true,
            category: 'culture',
        },
        {
            name: 'Manali Adventure',
            destination: 'Manali Adventure',
            description: 'Snow-capped mountains, thrilling activities, and cozy bonfires. Adventure awaits in the Himalayas!',
            price: 0,
            status: 'coming_soon',
            startDate: '2026-06-10',
            endDate: '2026-06-15',
            totalSlots: 35,
            bookedSlots: 0,
            imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
            featured: true,
            category: 'mountain',
        },
        {
            name: 'Goa Getaway',
            destination: 'Goa Getaway',
            description: 'Beach parties, water sports, and endless fun under the sun. The ultimate college trip experience!',
            price: 5500,
            status: 'booking_open',
            startDate: '2026-08-10',
            endDate: '2026-08-14',
            totalSlots: 40,
            bookedSlots: 12,
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
            featured: true,
            category: 'beach',
        },
        {
            name: 'Rishikesh Rush',
            destination: 'Rishikesh Rush',
            description: 'White water rafting, camping by the Ganges, and spiritual vibes. The perfect blend of adventure and peace.',
            price: 0,
            status: 'yet_to_announce',
            startDate: '2026-09-05',
            endDate: '2026-09-08',
            totalSlots: 30,
            bookedSlots: 0,
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            featured: false,
            category: 'adventure',
        },
        {
            name: 'Jaipur Royale',
            destination: 'Jaipur Royale',
            description: 'Explore the Pink City with palace tours, cultural experiences, and vibrant markets. History meets modernity!',
            price: 0,
            status: 'yet_to_announce',
            startDate: '2026-10-12',
            endDate: '2026-10-15',
            totalSlots: 25,
            bookedSlots: 0,
            imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
            featured: false,
            category: 'culture',
        },
        {
            name: 'Udaipur Dreams',
            destination: 'Udaipur Dreams',
            description: 'Lake views, royal palaces, and romantic sunsets. Experience the Venice of the East in all its glory.',
            price: 0,
            status: 'yet_to_announce',
            startDate: '2026-11-18',
            endDate: '2026-11-21',
            totalSlots: 20,
            bookedSlots: 0,
            imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
            featured: false,
            category: 'culture',
        },
    ]

    const tripCount = await prisma.trip.count()
    if (tripCount === 0) {
        await prisma.trip.createMany({ data: trips })
        console.log(`✅ Seeded ${trips.length} trips`)
    } else {
        console.log(`ℹ️  Trips already exist (${tripCount}), skipping trip seed`)
    }

    // ── Gallery Photos ────────────────────────────────────────────────────────
    const photos = [
        // Banaras Vibes
        { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Ganga Aarti at Dashashwamedh Ghat', tripName: 'Banaras Vibes', category: 'culture' },
        { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', caption: 'Sunrise boat ride on the Ganges', tripName: 'Banaras Vibes', category: 'culture' },
        { url: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800', caption: 'Street food trail in Varanasi', tripName: 'Banaras Vibes', category: 'culture' },
        // Manali Adventure
        { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', caption: 'Snow-capped Himalayas', tripName: 'Manali Adventure', category: 'mountain' },
        { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption: 'Camping under the stars', tripName: 'Manali Adventure', category: 'mountain' },
        { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', caption: 'Valley views from the top', tripName: 'Manali Adventure', category: 'mountain' },
        // Beaches
        { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', caption: 'Beach van life vibes', tripName: 'Goa Getaway', category: 'beach' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', caption: 'Sunset at Goa beach', tripName: 'Goa Getaway', category: 'beach' },
        // Culture
        { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', caption: 'Taj Mahal at golden hour', tripName: 'Jaipur Royale', category: 'culture' },
        { url: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800', caption: 'Gateway of India at sunset', tripName: 'Jaipur Royale', category: 'culture' },
        { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', caption: 'Amber Fort grandeur', tripName: 'Udaipur Dreams', category: 'culture' },
        // Adventure
        { url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', caption: 'Mountain peak adventure', tripName: 'Rishikesh Rush', category: 'adventure' },
        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Misty mountain range', tripName: 'Rishikesh Rush', category: 'adventure' },
        { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption: 'Green rolling hills', tripName: 'Rishikesh Rush', category: 'adventure' },
    ]

    // Clear existing and re-seed (so photos stay fresh)
    await prisma.galleryPhoto.deleteMany({})
    await prisma.galleryPhoto.createMany({ data: photos })
    console.log(`✅ Seeded ${photos.length} gallery photos`)

    // ── Blog Posts ────────────────────────────────────────────────────────────
    const posts = [
        {
            title: 'Our First Trip: Banaras Vibes — A Journey to Remember',
            content: `We kicked off Safarnama's journey with 30 students from across India, all converging on the spiritual capital of the country. The Ganga Aarti on Day 1 set the tone — magical doesn't begin to describe it.

The boat rides at sunrise, the labyrinthine lanes of the old city, the chai at every corner — Banaras has a way of slowing time. We stayed in a heritage guesthouse just steps from the ghats, and every evening was spent watching the river turn golden.

The trip was an experiment. Could we build something that college students could actually afford, actually trust, and actually love? The answer from 30 strangers who became friends: an overwhelming yes.

Banaras Vibes was completely sold out within 72 hours of announcement. The ₹3,000 price point for 3 nights 4 days included accommodation, most meals, a boat ride, and the Aarti experience. We broke even on Day 2 of the trip.

If you missed it, don't worry — we're planning to run it again. Stay tuned.`,
            author: 'Shivansh Tripathi',
            tripName: 'Banaras Vibes',
            imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
            published: true,
        },
        {
            title: 'Why We Started Safarnama: The Story Behind the Platform',
            content: `College trips are broken. Either they're the generic "Goa trip" where nothing is organized, or they're overpriced packages that drain your semester budget.

We were students too. Shivansh was on a tight budget, Atish was tired of last-minute planning chaos, and we both wanted to meet people who actually wanted to explore India — not just party.

So we built Safarnama.

The name means "travelogue" in Urdu/Hindi — the journal of your journey. We wanted every trip to feel like a chapter in a story worth telling.

Our model is simple: we handle everything. You just show up. We've negotiated group rates with stays, we've designed itineraries that aren't tourist traps, and we keep groups small enough that you actually make friends.

We're just getting started. Manali, Goa, Rishikesh, Jaipur, Udaipur — the map of India is our playground, and we want to explore it with you.`,
            author: 'Atish',
            tripName: null,
            imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
            published: true,
        },
    ]

    for (const post of posts) {
        const existing = await prisma.blogPost.findFirst({ where: { title: post.title } })
        if (!existing) {
            await prisma.blogPost.create({ data: post })
        }
    }
    console.log(`✅ Seeded ${posts.length} blog posts`)

    console.log('\n🎉 Seeding complete!')
    console.log('   Admin login: admin@safarnama.com / admin@safarnama123')
}

main().catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
}).finally(() => prisma.$disconnect())
