'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const REVIEWS = [
    {
        id: '1',
        name: 'Riya Sharma',
        college: 'IIT Delhi',
        trip: 'Banaras Vibes',
        rating: 5,
        date: 'Jan 2026',
        avatar: 'R',
        color: 'from-sky-500 to-teal-500',
        title: 'Most spiritual experience of my life!',
        review: 'I had zero expectations going in, but Banaras completely blew my mind. The Ganga Aarti at night was something I will never forget. Safarnama handled everything — transport, stay, food — perfectly. The group was amazing and we all became friends by day 2. Highly recommend to every student!',
        photos: [
            'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400',
            'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400',
        ],
        verified: true,
    },
    {
        id: '2',
        name: 'Arjun Mehta',
        college: 'DU North Campus',
        trip: 'Banaras Vibes',
        rating: 5,
        date: 'Jan 2026',
        avatar: 'A',
        color: 'from-orange-500 to-pink-500',
        title: 'Budget-friendly and absolutely worth it!',
        review: 'At just ₹3,000 for 3 nights, I honestly did not expect much. But Safarnama delivered way beyond expectations. Clean accommodation, great food, and an itinerary that covered everything important. The sunrise boat ride on the Ganges was the highlight. Will definitely book the Manali trip next!',
        photos: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        ],
        verified: true,
    },
    {
        id: '3',
        name: 'Priya Verma',
        college: 'BITS Pilani',
        trip: 'Banaras Vibes',
        rating: 5,
        date: 'Jan 2026',
        avatar: 'P',
        color: 'from-purple-500 to-sky-500',
        title: 'Safe, fun, and perfectly organized',
        review: 'As a solo female traveler, safety was my top concern. Safarnama made me feel completely secure throughout the trip. The trip leader was always available, the group was respectful, and the entire experience was seamless. The street food tour in Varanasi was an absolute highlight. 10/10!',
        photos: [
            'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400',
            'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400',
        ],
        verified: true,
    },
    {
        id: '4',
        name: 'Karan Singh',
        college: 'CSJMU Kanpur',
        trip: 'Banaras Vibes',
        rating: 5,
        date: 'Jan 2026',
        avatar: 'K',
        color: 'from-emerald-500 to-teal-500',
        title: 'Made 20 new friends in 3 days!',
        review: 'I went alone and came back with a whole friend group. That is the magic of Safarnama. The team creates an environment where everyone feels welcome. Banaras itself is incredible — the energy, the culture, the food. Already waiting for the Manali trip announcement!',
        photos: [],
        verified: true,
    },
]

const STATS = [
    { value: '200+', label: 'Happy Travelers', icon: '😊' },
    { value: '4.9/5', label: 'Average Rating', icon: '⭐' },
    { value: '100%', label: 'Would Recommend', icon: '👍' },
]

export default function BlogPage() {
    const [expanded, setExpanded] = useState<string | null>(null)

    return (
        <main className="min-h-screen bg-[#020817]">

            {/* Hero */}
            <section className="relative min-h-[420px] flex items-center pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#020817] to-[#020817]" />
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <div className="absolute -top-40 right-1/4 w-[500px] h-[400px] bg-teal-500/8 rounded-full blur-[120px]" />

                <div className="container-main relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                            Traveler Stories
                        </div>
                        <h1 className="text-[56px] md:text-[68px] font-[var(--font-outfit)] font-extrabold text-white leading-[1.0] tracking-[-0.03em] mb-5">
                            Real <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">Reviews</span>
                        </h1>
                        <p className="text-[17px] text-slate-400 leading-[1.75] max-w-[480px] mx-auto">
                            Honest stories from students who&apos;ve traveled with us. No filters, just real experiences.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="container-main pb-24">

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-3 gap-6 mb-16 max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center glass-card p-5 border border-white/[0.07]">
                            <div className="text-2xl mb-1">{s.icon}</div>
                            <p className="text-xl font-extrabold text-white font-[var(--font-outfit)]">{s.value}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Review cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                    {REVIEWS.map((r, i) => (
                        <motion.div
                            key={r.id}
                            className="glass-card border border-white/[0.08] p-7 hover:border-white/[0.15] transition-all duration-300"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                                        {r.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-white font-semibold text-sm">{r.name}</p>
                                            {r.verified && (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-semibold">
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 text-xs">{r.college} · {r.date}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex gap-0.5">
                                        {[...Array(r.rating)].map((_, i) => (
                                            <span key={i} className="text-amber-400 text-sm">★</span>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md font-semibold">
                                        {r.trip}
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-white font-bold text-base mb-3">&ldquo;{r.title}&rdquo;</h3>

                            {/* Review text */}
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {expanded === r.id ? r.review : r.review.slice(0, 140) + '...'}
                            </p>
                            <button
                                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                                className="text-sky-400 text-xs font-semibold mt-2 hover:text-sky-300 transition-colors"
                            >
                                {expanded === r.id ? 'Show less ↑' : 'Read more ↓'}
                            </button>

                            {/* Photos */}
                            {r.photos.length > 0 && (
                                <div className="flex gap-2 mt-4">
                                    {r.photos.map((p, pi) => (
                                        <div key={pi} className="w-20 h-16 rounded-lg overflow-hidden border border-white/[0.08] flex-shrink-0">
                                            <img src={p} alt="Trip photo" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Submit review CTA */}
                <motion.div
                    className="max-w-2xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="glass-card border border-teal-500/20 p-10">
                        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-extrabold text-2xl font-[var(--font-outfit)] mb-2">
                            Traveled with us?
                        </h3>
                        <p className="text-slate-400 text-base mb-6 max-w-md mx-auto">
                            Share your experience and help other students discover the joy of group travel. Your story matters!
                        </p>
                        <a
                            href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU?mode=gi_t"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary px-8 py-3.5 text-base inline-flex"
                        >
                            Share Your Story
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>
                </motion.div>
            </section>
        </main>
    )
}
