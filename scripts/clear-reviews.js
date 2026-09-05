const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Show what's in the DB first
  const all = await prisma.review.findMany({ select: { id: true, name: true, tripName: true, fake: true } })
  console.log('Reviews in DB:')
  all.forEach(r => console.log('  ', r.id, '|', r.name, '|', r.tripName, '| fake:', r.fake))

  if (all.length === 0) {
    console.log('No reviews to delete.')
    return
  }

  // Delete ALL reviews (all are seeded/fake — real users haven't reviewed yet)
  const result = await prisma.review.deleteMany({})
  console.log('✅ Deleted', result.count, 'reviews from the database')
}

main()
  .catch(e => { console.error('Error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
