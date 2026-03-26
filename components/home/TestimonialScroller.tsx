'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Testimonial {
    id: string
    name: string
    college: string
    avatar: string
    content: string
    rating: number
    tripName: string
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        college: 'Delhi University',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        content: 'Honestly the best trip I\'ve ever been on. The whole experience was seamless — from booking to the actual trip. Made friends I\'ll keep for life.',
        rating: 5,
        tripName: 'Banaras Vibes',
    },
    {
        id: '2',
        name: 'Arjun Patel',
        college: 'IIT Bombay',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        content: 'Sunrise at the ghats, late-night chai, and the most incredible group of people. Safarnama nailed every detail. Already booked my next trip.',
        rating: 5,
        tripName: 'Banaras Vibes',
    },
    {
        id: '3',
        name: 'Sneha Reddy',
        college: 'BITS Pilani',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        content: 'As a solo traveler, I was nervous. But the community vibe made it feel like I was with old friends from day one. 10/10 would recommend.',
        rating: 5,
        tripName: 'Goa Getaway',
    },
    {
        id: '4',
        name: 'Rahul Verma',
        college: 'NIT Trichy',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        content: 'The Manali trip was everything I hoped for and more. Snow, bonfires, and zero stress because the team handled everything perfectly.',
        rating: 5,
        tripName: 'Manali Adventure',
    },
]

export default function TestimonialScroller() {
    const [current, setCurrent] = useState(0)
    const [paused, setPaused] = useState(false)

    const next = useCallback(() => setCurrent((p) => (p + 1) % TESTIMONIALS.length), [])
    const prev = useCallback(() => setCurrent((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), [])

    useEffect(() => {
        if (paused) return
        const t = setInterval(next, 5000)
        return () => clearInterval(t)
    }, [paused, next])

    const handleSelect = (i: number) => {
        setCurrent(i)
        setPaused(true)
        setTimeout(() => setPaused(false), 8000)
    }

    return (
        <section className="py-24">
            <div className="container-main">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — heading + avatars */}
                    <div>
                        <motion.div
                            className="section-tag w-fit mb-4"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />
                            Traveler Stories
                        </motion.div>
                        <motion.h2
                            className="section-title mb-4"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            What Our Tribe<br />
                            <span className="text-gradient-brand">Is Saying</span>
                        </motion.h2>
                        <motion.p
                            className="section-subtitle mb-10"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Real stories from real travelers. No filters, just honest experiences.
                        </motion.p>

                        {/* Avatar selector */}
                        <div className="flex gap-3 flex-wrap">
                            {TESTIMONIALS.map((t, i) => (
                                <button
                                    key={t.id}
                                    onClick={() => handleSelect(i)}
                                    className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-300 ${
                                        current === i
                                            ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[#020817] scale-110'
                                            : 'opacity-50 hover:opacity-80 hover:scale-105'
                                    }`}
                                >
                                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Progress dots */}
                        <div className="flex gap-2 mt-8">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(i)}
                                    className={`h-1 rounded-full transition-all duration-400 ${
                                        current === i ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-white/20 hover:bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right — testimonial card */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                className="glass-card p-8 md:p-10 border border-white/[0.08]"
                                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {/* Quote icon */}
                                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-6">
                                    <svg className="w-5 h-5 text-[var(--accent-light)]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-5">
                                    {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                                        <motion.svg
                                            key={i}
                                            className="w-4 h-4 text-amber-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.06, duration: 0.3 }}
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </motion.svg>
                                    ))}
                                </div>

                                <p className="text-slate-300 text-[1.05rem] leading-relaxed mb-8">
                                    &ldquo;{TESTIMONIALS[current].content}&rdquo;
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--accent)]/40 relative flex-shrink-0">
                                            <Image src={TESTIMONIALS[current].avatar} alt={TESTIMONIALS[current].name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-semibold">{TESTIMONIALS[current].name}</p>
                                            <p className="text-slate-500 text-xs">{TESTIMONIALS[current].college}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[var(--accent-light)] text-xs font-medium">{TESTIMONIALS[current].tripName}</p>
                                        <p className="text-slate-600 text-[10px] mt-0.5">Verified Traveler</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Nav arrows */}
                        <div className="flex gap-2 mt-4 justify-end">
                            <button
                                onClick={() => { prev(); setPaused(true); setTimeout(() => setPaused(false), 8000) }}
                                className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => { next(); setPaused(true); setTimeout(() => setPaused(false), 8000) }}
                                className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
