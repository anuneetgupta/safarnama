const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingRoot: path.join(__dirname),
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            // ImgBB – used by admin app for gallery photo uploads
            { protocol: 'https', hostname: 'i.ibb.co' },
            { protocol: 'https', hostname: 'ibb.co' },
            { protocol: 'https', hostname: 'img.ibb.co' },
            { protocol: 'https', hostname: '**.ibb.co' },
            // Allow any https image URL (for admin-pasted URLs from any CDN)
            { protocol: 'https', hostname: '**' },
        ],
    },
}

module.exports = nextConfig
