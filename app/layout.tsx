import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Safarnama - Your Digital Gateway to High-Energy Travel',
    description: 'Join the tribe. Explore destinations. Create memories.',
}

import Navbar from '@/components/ui/Navbar'
import Providers from '@/components/ui/Providers'
import CustomCursor from '@/components/ui/CustomCursor'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="antialiased" style={{ cursor: 'none' }}>
                <Providers>
                    <CustomCursor />
                    <Navbar />
                    {/* Spacer to push content below fixed navbar */}
                    <div style={{ height: '80px' }} />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
