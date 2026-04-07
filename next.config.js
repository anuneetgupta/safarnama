/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
}

module.exports = nextConfig
