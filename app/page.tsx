'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import TripCard from '@/components/home/TripCard'
import TestimonialScroller from '@/components/home/TestimonialScroller'
import { DEMO_TRIPS } from '@/lib/data'

const STATS = [
    { value: '12K+', label: 'Happy Travelers', icon: '😊' },
    { value: '80+', label: 'Destinations', icon: '📍' },
    { value: '4.9★', label: 'Average Rating', icon: '⭐' },
    { value: '200+', label: 'Trips Completed', icon: '✈️' },
]

const FEATURES = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Group Travel Made Easy',
        desc: 'Book as a group, split costs, and coordinate everything in one place.',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Safe & Verified Trips',
        desc: 'Every trip is vetted by our team. Travel with confidence and peace of mind.',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Student-Friendly Pricing',
        desc: 'Exclusive deals and EMI options designed for student budgets.',
    },
]

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

    return (
        <main className="min-h-screen bg-[#020817]">

            {/* ── HERO ── */}
            <section ref={heroRef} className="relative flex items-center overflow-hidden" style={{ minHeight: 'calc(100vh - 80px)' }}>
                {/* Background layers */}
                <div className="absolute inset-0 grid-pattern" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020817] via-transparent to-[#020817]" />

                {/* Ambient orbs */}
                <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/8 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/8 rounded-full blur-[100px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-600/5 rounded-full blur-[80px]" />
                </motion.div>

                <motion.div style={{ opacity: heroOpacity }} className="container-main relative z-10 pt-16 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left */}
                        <div>
                            <motion.div
                                className="section-tag mb-6 w-fit"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                                India&apos;s #1 Student Travel Platform
                            </motion.div>

                            <motion.h1
                                className="text-5xl md:text-6xl lg:text-[64px] font-[var(--font-outfit)] font-extrabold text-white leading-[1.08] tracking-tight mb-6"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.6 }}
                            >
                                Explore India
                                <br />
                                <span className="text-gradient-brand">With Your Tribe</span>
                            </motion.h1>

                            <motion.p
                                className="text-lg text-slate-400 leading-relaxed mb-8 max-w-[480px]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                Curated group trips for students and young explorers. Budget-friendly, safe, and unforgettable.
                            </motion.p>

                            <motion.div
                                className="flex flex-wrap gap-3 mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65, duration: 0.6 }}
                            >
                                <a href="#trips" className="btn-primary px-7 py-3.5 text-[0.95rem]">
                                    Browse Trips
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                                <a href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU?mode=gi_t" target="_blank" rel="noopener noreferrer" className="btn-secondary px-7 py-3.5 text-[0.95rem]">
                                    Join for Free
                                </a>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div
                                className="flex flex-wrap items-center gap-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            >
                                {['IIT Students', 'DU Students', 'BITS Students'].map((badge) => (
                                    <div key={badge} className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {badge}
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right — image collage */}
                        <motion.div
                            className="hidden lg:block relative h-[520px]"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Main card */}
                            <div className="absolute top-0 right-0 w-[300px] h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=700" alt="Varanasi" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white font-semibold text-sm">Banaras Vibes</p>
                                    <p className="text-white/60 text-xs mt-0.5">Varanasi, UP</p>
                                </div>
                            </div>

                            {/* Secondary card */}
                            <motion.div
                                className="absolute bottom-0 left-0 w-[220px] h-[260px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <img src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500" alt="Manali" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-white font-semibold text-sm">Manali Adventure</p>
                                    <p className="text-white/60 text-xs mt-0.5">Himachal Pradesh</p>
                                </div>
                            </motion.div>

                            {/* Floating stat card */}
                            <motion.div
                                className="absolute top-[45%] left-[30%] glass-card px-4 py-3 shadow-xl border border-white/10 z-20"
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <span className="text-sm">🎉</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-semibold">Just booked!</p>
                                        <p className="text-slate-400 text-[10px]">Goa Getaway · 2 slots left</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Rating pill */}
                            <motion.div
                                className="absolute top-6 left-6 glass-card px-3.5 py-2 flex items-center gap-2 border border-white/10 z-20"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            >
                                <span className="text-amber-400 text-sm">★</span>
                                <span className="text-white text-xs font-bold">4.9</span>
                                <span className="text-slate-500 text-[10px]">12K+ reviews</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">Scroll</span>
                    <motion.div
                        className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent"
                        animate={{ scaleY: [0, 1, 0], originY: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>
            </section>

            {/* ── STATS ── */}
            <section className="py-16 border-y border-white/[0.05] bg-[#0a1628]/40">
                <div className="container-main">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-extrabold text-white font-[var(--font-outfit)] tracking-tight">{stat.value}</div>
                                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TRIPS ── */}
            <section id="trips" className="py-28">
                <div className="container-main">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                        <div>
                            <motion.div
                                className="section-tag w-fit mb-4"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                Featured Trips
                            </motion.div>
                            <motion.h2
                                className="section-title"
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                Upcoming Adventures
                            </motion.h2>
                            <motion.p
                                className="section-subtitle"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Handpicked destinations for students and young explorers. Limited slots — book early.
                            </motion.p>
                        </div>
                        <motion.a
                            href="/trips"
                            className="btn-secondary whitespace-nowrap self-start md:self-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            View all trips
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </motion.a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DEMO_TRIPS.slice(0, 6).map((trip, index) => (
                            <TripCard key={trip.id} {...trip} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <div className="section-divider" />

            {/* ── WHY SAFARNAMA ── */}
            <section className="py-28 bg-[#0a1628]/30">
                <div className="container-main">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.div
                                className="section-tag w-fit mb-4"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />
                                Why Choose Us
                            </motion.div>
                            <motion.h2
                                className="section-title mb-4"
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                Built for the<br />
                                <span className="text-gradient-brand">Student Explorer</span>
                            </motion.h2>
                            <motion.p
                                className="section-subtitle mb-10"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                We understand student life — tight budgets, packed schedules, and the need for real adventure. Safarnama is designed around you.
                            </motion.p>
                            <motion.div
                                className="flex flex-col gap-5"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                {FEATURES.map((f, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-light)] flex-shrink-0">
                                            {f.icon}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
                                            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right — image grid */}
                        <motion.div
                            className="grid grid-cols-2 gap-4"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="space-y-4">
                                <div className="h-48 rounded-2xl overflow-hidden border border-white/[0.07]">
                                    <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500" alt="Jaipur" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="h-32 rounded-2xl overflow-hidden border border-white/[0.07]">
                                    <img src="https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=500" alt="Udaipur" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="h-32 rounded-2xl overflow-hidden border border-white/[0.07]">
                                    <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500" alt="Goa" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="h-48 rounded-2xl overflow-hidden border border-white/[0.07]">
                                    <img src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500" alt="Manali" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="section-divider" />

            {/* ── TESTIMONIALS ── */}
            <TestimonialScroller />

            <div className="section-divider" />

            {/* ── MEET THE TEAM ── */}
            <section className="py-28 bg-[#0a1628]/30">
                <div className="container-main">
                    <div className="text-center mb-16">
                        <motion.div
                            className="section-tag w-fit mx-auto mb-4"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />
                            Our Team
                        </motion.div>
                        <motion.h2
                            className="section-title mb-4"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Meet the <span className="text-gradient-brand">Founders</span>
                        </motion.h2>
                        <motion.p
                            className="section-subtitle max-w-[560px] mx-auto"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            The passionate team behind Safarnama, dedicated to making student travel accessible and unforgettable.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
                        {[
                            { name: 'Shivansh Tripathi', role: 'CEO & Founder', image: '/shivansh.jpeg' },
                            { name: 'Atish', role: 'Co-founder & CMO', image: '/atish.jpeg' },
                            { name: 'Priyanshu Singh', role: 'CMAO', image: '/priyanshu.jpeg' },
                        ].map((member, i) => (
                            <motion.div
                                key={member.name}
                                className="group relative"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                            >
                                <div className="glass-card p-6 flex flex-col items-center text-center hover:border-[var(--accent)]/30 transition-all duration-500">
                                    {/* Photo */}
                                    <div className="relative w-44 h-44 mb-5 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[var(--accent)]/40 transition-all duration-500 flex-shrink-0">
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Name & Role */}
                                    <h3 className="text-white font-bold text-lg mb-1.5 font-[var(--font-outfit)] w-full text-center">
                                        {member.name}
                                    </h3>
                                    <p className="text-[var(--accent-light)] text-sm font-medium mb-3 w-full text-center">
                                        {member.role}
                                    </p>

                                    {/* Decorative line */}
                                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent group-hover:w-20 transition-all duration-500" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="section-divider" />

            {/* ── CTA ── */}
            <section className="py-28 relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/6 rounded-full blur-[80px]" />
                <div className="container-main relative z-10">
                    <motion.div
                        className="max-w-[600px] mx-auto text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="section-tag w-fit mx-auto mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)] animate-pulse" />
                            Limited Slots Available
                        </div>
                        <h2 className="text-4xl md:text-5xl font-[var(--font-outfit)] font-extrabold text-white tracking-tight mb-5">
                            Ready to Start<br />Your Journey?
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Join thousands of students who&apos;ve already discovered the joy of group travel. Your next adventure is one click away.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href="/auth/register" className="btn-primary px-8 py-4 text-base">
                                Create Free Account
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                            <a href="/trips" className="btn-secondary px-8 py-4 text-base">
                                Browse Trips
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/[0.06] bg-[#020817]">
                <div className="container-main py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                        <div className="md:col-span-2">
                            <div className="mb-4">
                                <img src="/logo.png" alt="Safarnama" className="h-16 w-auto object-contain" />
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
                                India&apos;s leading student travel platform. Curated group trips, budget-friendly pricing, and unforgettable memories.
                            </p>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold mb-4">Quick Links</p>
                            <div className="flex flex-col gap-2.5">
                                {[['Home', '/'], ['Trips', '/trips'], ['Gallery', '/gallery'], ['Reviews', '/blog'], ['Contact', '/contact']].map(([name, href]) => (
                                    <a key={name} href={href} className="text-slate-500 hover:text-white text-sm transition-colors">{name}</a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold mb-4">Account</p>
                            <div className="flex flex-col gap-2.5">
                                {[['Sign In', '/auth/login'], ['Register', '/auth/register'], ['Dashboard', '/dashboard']].map(([name, href]) => (
                                    <a key={name} href={href} className="text-slate-500 hover:text-white text-sm transition-colors">{name}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-slate-600 text-xs">© 2026 Safarnama. All rights reserved.</p>
                        <p className="text-slate-600 text-xs">Made with ❤️ for student travelers across India</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
