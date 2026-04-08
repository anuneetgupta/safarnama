'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import TripCard from '@/components/home/TripCard'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { DEMO_TRIPS } from '@/lib/data'

const Scene3D = dynamic(() => import('@/components/ui/Scene3D'), { ssr: false })

// â”€â”€ SCROLL REVEAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { useInView } from 'framer-motion'
function Reveal({ children, delay = 0, y = 32 }: { children: React.ReactNode; delay?: number; y?: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    )
}

// â”€â”€ MAGNETIC BUTTON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MagBtn({ children, href, className, target }: { children: React.ReactNode; href: string; className?: string; target?: string }) {
    const ref = useRef<HTMLAnchorElement>(null)
    const [pos, setPos] = useState({ x: 0, y: 0 })
    return (
        <motion.a ref={ref} href={href} target={target} rel={target ? 'noopener noreferrer' : undefined}
            className={className}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onMouseMove={e => {
                const r = ref.current!.getBoundingClientRect()
                setPos({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3 })
            }}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            whileTap={{ scale: 0.97 }}>
            {children}
        </motion.a>
    )
}

const STATS = [
    { end: 12000, suffix: '+', label: 'Happy Travelers', icon: 'ðŸ§­' },
    { end: 80,    suffix: '+', label: 'Destinations',    icon: 'ðŸ”ï¸' },
    { end: 49,    suffix: 'â˜…', prefix: '4.', label: 'Avg Rating', icon: 'â­' },
    { end: 200,   suffix: '+', label: 'Trips Done',      icon: 'âœˆï¸' },
]

const FEATURES = [
    { icon: 'ðŸ•ï¸', title: 'Group Travel Made Easy',    desc: 'Book as a group, split costs, coordinate everything in one place. No stress, just adventure.' },
    { icon: 'ðŸ›¡ï¸', title: 'Safe & Verified Trips',     desc: 'Every trip vetted by our team. Experienced leaders, verified stays, 24/7 support.' },
    { icon: 'ðŸ’°', title: 'Student-Friendly Pricing',  desc: 'Exclusive deals and EMI options designed for student budgets. Starting â‚¹3,000.' },
    { icon: 'ðŸ—ºï¸', title: 'Curated Itineraries',       desc: 'Handcrafted routes covering the best of each destination â€” no planning needed.' },
    { icon: 'ðŸ‘¥', title: 'Meet Your Tribe',            desc: 'Travel with like-minded students. Come as strangers, leave as lifelong friends.' },
    { icon: 'ðŸ“±', title: 'Real-Time Updates',          desc: 'Live trip tracking, instant notifications, and a dedicated WhatsApp group for every trip.' },
]

const HOW = [
    { num: '01', title: 'Browse Trips',    desc: 'Explore our curated destinations and find your perfect adventure.' },
    { num: '02', title: 'Register & Pay', desc: 'Quick registration, secure payment, instant confirmation.' },
    { num: '03', title: 'Pack & Go',       desc: 'We handle everything. You just show up and explore.' },
]

const DESTINATIONS = [
    { name: 'Banaras Vibes',    place: 'Varanasi, UP',       price: 'â‚¹3,000',      status: 'Completed',     img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',    color: '#a3e635' },
    { name: 'Manali Adventure', place: 'Himachal Pradesh',   price: 'Coming Soon', status: 'Next',          img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', color: '#fbbf24' },
    { name: 'Goa Getaway',      place: 'Goa, India',         price: 'Booking Open',status: 'Open',          img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',    color: '#a3e635' },
    { name: 'Rishikesh Rush',   place: 'Uttarakhand',        price: 'TBA',         status: 'Soon',          img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', color: '#fbbf24' },
]

const TESTIMONIALS = [
    { name: 'Riya Sharma',  college: 'IIT Delhi',       text: 'Best trip of my life. The Ganga Aarti was magical. Safarnama handled everything perfectly!', avatar: 'R', trip: 'Banaras Vibes' },
    { name: 'Arjun Mehta',  college: 'DU North Campus', text: 'At â‚¹3,000 for 3 nights, I expected nothing. Got everything. Will book Manali for sure!',    avatar: 'A', trip: 'Banaras Vibes' },
    { name: 'Priya Verma',  college: 'BITS Pilani',     text: 'As a solo female traveler, I felt completely safe. The group was amazing. 10/10!',           avatar: 'P', trip: 'Banaras Vibes' },
    { name: 'Karan Singh',  college: 'CSJMU Kanpur',    text: 'Went alone, came back with 20 new friends. That is the Safarnama magic.',                    avatar: 'K', trip: 'Banaras Vibes' },
]

export default function HomePage() {
    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

    return (
        <main className="bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-[#0a1628] to-[#0a0a0a]" />}>
                        <Scene3D />
                    </Suspense>
                <motion.div style={{ opacity: heroOpacity, minHeight: "calc(100vh - 80px)" }} className="relative z-[3] flex flex-col justify-center container-main pt-[100px] pb-20 lg:pt-20">

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Student Travel Community Â· Since 2024
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6">
                        <span className="block text-white">Your Next</span>
                        <span className="block bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                            Adventure
                        </span>
                        <span className="block text-white">Awaits ðŸ”ï¸</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Safarnama crafts unforgettable group trips for students. Explore India&apos;s most iconic destinations â€” starting at just <span className="text-teal-400 font-semibold">â‚¹3,000</span>.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center">
                        <MagBtn href="/trips"
                            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-2xl text-lg hover:shadow-[0_0_40px_rgba(20,184,166,0.4)] transition-shadow">
                            Explore Trips â†’
                        </MagBtn>
                        <MagBtn href="/contact"
                            className="px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-2xl text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
                            Contact Us
                        </MagBtn>
                    </motion.div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                        className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-3 bg-white/40 rounded-full" />
                    </motion.div>
                </div>
            </section>

            {/* â”€â”€ STATS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-20 border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.1}>
                            <div className="text-center">
                                <div className="text-3xl mb-2">{s.icon}</div>
                                <div className="text-4xl font-black text-white">
                                    {s.prefix ?? ''}<AnimatedCounter end={s.end} />{s.suffix}
                                </div>
                                <div className="text-white/50 text-sm mt-1">{s.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* â”€â”€ FEATURED TRIPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-16">
                            <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase">Destinations</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">Where Will You Go?</h2>
                        </div>
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DEMO_TRIPS.slice(0, 6).map((trip, i) => (
                            <Reveal key={trip.id} delay={i * 0.08}>
                                <TripCard {...trip} index={i} />
                            </Reveal>
                        ))}
                    </div>
                    <Reveal delay={0.3}>
                        <div className="text-center mt-12">
                            <Link href="/trips"
                                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-2xl hover:bg-white/5 transition-colors font-semibold">
                                View All Trips â†’
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* â”€â”€ HOW IT WORKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-24 px-6 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-16">
                            <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase">Process</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">How It Works</h2>
                        </div>
                    </Reveal>
                    <div className="grid md:grid-cols-3 gap-8">
                        {HOW.map((h, i) => (
                            <Reveal key={h.num} delay={i * 0.15}>
                                <div className="text-center p-8 rounded-3xl border border-white/10 bg-white/[0.03] hover:border-teal-500/30 transition-colors">
                                    <div className="text-6xl font-black text-white/5 mb-4">{h.num}</div>
                                    <h3 className="text-xl font-bold text-white mb-2">{h.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{h.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€ FEATURES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-16">
                            <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase">Why Us</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">The Safarnama Edge</h2>
                        </div>
                    </Reveal>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.08}>
                                <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] hover:border-teal-500/30 hover:bg-white/[0.05] transition-all group">
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                                    <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€ DESTINATION CARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-24 px-6 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-16">
                            <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase">Our Trips</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">Season One</h2>
                        </div>
                    </Reveal>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {DESTINATIONS.map((d, i) => (
                            <Reveal key={d.name} delay={i * 0.1}>
                                <div className="relative overflow-hidden rounded-3xl aspect-[3/4] group cursor-pointer">
                                    <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-bold mb-2"
                                            style={{ background: d.color + '22', color: d.color, border: `1px solid ${d.color}44` }}>
                                            {d.status}
                                        </span>
                                        <h3 className="text-white font-bold text-lg leading-tight">{d.name}</h3>
                                        <p className="text-white/60 text-sm">{d.place}</p>
                                        <p className="font-bold mt-1" style={{ color: d.color }}>{d.price}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€ TESTIMONIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-16">
                            <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase">Stories</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">Traveler Love</h2>
                        </div>
                    </Reveal>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <Reveal key={t.name} delay={i * 0.1}>
                                <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] hover:border-teal-500/20 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold text-sm">{t.name}</div>
                                            <div className="text-white/40 text-xs">{t.college}</div>
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                                    <span className="text-xs text-teal-400/70">ðŸ“ {t.trip}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <Reveal>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Ready for Your<br />
                            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Next Chapter?</span>
                        </h2>
                        <p className="text-white/50 text-lg mb-10">Join thousands of students who chose adventure over routine.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <MagBtn href="/trips"
                                className="px-10 py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-2xl text-lg hover:shadow-[0_0_60px_rgba(20,184,166,0.4)] transition-shadow">
                                Book Your Trip â†’
                            </MagBtn>
                            <MagBtn href="https://wa.me/918090151999" target="_blank"
                                className="px-10 py-5 bg-white/5 border border-white/20 text-white font-semibold rounded-2xl text-lg hover:bg-white/10 transition-colors">
                                WhatsApp Us ðŸ’¬
                            </MagBtn>
                        </div>
                    </Reveal>
                </div>
            </section>

        </main>
    )
}

