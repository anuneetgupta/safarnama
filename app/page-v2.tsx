'use client'

import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Features from '@/components/sections/Features'
import HowItWorks from '@/components/sections/HowItWorks'
import Destinations from '@/components/sections/Destinations'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main style={{ background: '#020817', overflowX: 'hidden' }}>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Destinations />
      <CTA />
      <Footer />
    </main>
  )
}
