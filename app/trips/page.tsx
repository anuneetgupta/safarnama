'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import TripCard from '@/components/home/TripCard'
import { DEMO_TRIPS } from '@/lib/data'

const FILTERS = [
    { label: 'All', value: 'All', icon: '🗺️' },
    { label: 'Mountain', value: 'Mountain', icon: '🏔️' },
    { label: 'Beach', value: 'Beach', icon: '🏖️' },
    { label: 'Culture', value: 'Culture', icon: '🏛️' },
    { label: 'Adventure', value: 'Adventure', icon: '⚡' },
]

const SORT_OPTIONS = ['Upcoming', 'Price: Low to High', 'Price: High to Low', 'Availability']

export default function TripsPage() {
    const [activeFilter, setActiveFilter] = useState('All')
    const [sortBy, setSortBy] = useState('Upcoming')

    const filteredTrips = DEMO_TRIPS.filter(trip => {
        if (activeFilter === 'All') return true
        if (activeFilter === 'Mountain') return trip.destination.includes('Manali') || trip.destination.includes('Rishikesh')
        if (activeFilter === 'Beach') return trip.destination.includes('Goa')
        if (activeFilter === 'Culture') return trip.destination.includes('Banaras') || trip.destination.includes('Jaipur') || trip.destination.includes('Udaipur')
        if (activeFilter === 'Adventure') return trip.destination.includes('Rishikesh') || trip.destination.includes('Manali')
        return true
    }).sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.price - b.price
        if (sortBy === 'Price: High to Low') return b.price - a.price
        if (sortBy === 'Availability') return (a.totalSlots - a.bookedSlots) - (b.totalSlots - b.bookedSlots)
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })

    return (
        <main className="min-h-screen bg-[#020817]">

            {/* ── PAGE HERO ── */}
            <section className="relative min-h-[560px] flex items-center pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#020817] to-[#020817]" />
                <div className="absolute inset-0 grid-pattern opacity-60" />
                <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-sky-600/8 rounded-full blur-[140px]" />
                <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-teal-500/6 rounded-full blur-[100px]" />

                <div className="container-main relative z-10">
                    <div className="max-w-[640px]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-full mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                Browse Destinations
                            </div>

                            <h1 className="text-[56px] md:text-[72px] font-[var(--font-outfit)] font-extrabold text-white leading-[1.0] tracking-[-0.03em] mb-6">
                                Find Your<br />
                                <span className="bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                                    Next Trip
                                </span>
                            </h1>

                            <p className="text-[17px] text-slate-400 leading-[1.75] mb-10 max-w-[500px]">
                                Curated group adventures across India. Mountains, beaches, heritage cities — all at student-friendly prices.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: '✈️', text: '80+ Destinations' },
                                    { icon: '👥', text: 'Group Travel' },
                                    { icon: '💰', text: 'Student Pricing' },
                                    { icon: '🛡️', text: 'Verified Safe' },
                                ].map((b) => (
                                    <div key={b.text} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-slate-300 font-medium">
                                        <span className="text-base">{b.icon}</span>
                                        {b.text}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── STICKY FILTER BAR ── */}
            <div className="sticky top-[80px] z-30 bg-[#020817]/95 backdrop-blur-2xl border-y border-white/[0.06]">
                <div className="container-main">
                    <div className="flex items-center justify-between gap-4 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setActiveFilter(f.value)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                                        activeFilter === f.value
                                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                                            : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.07]'
                                    }`}
                                >
                                    <span>{f.icon}</span>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-[13px] text-slate-300 bg-[#0f172a] border border-white/[0.08] rounded-lg px-4 py-2 outline-none cursor-pointer hover:border-white/[0.15] transition-colors min-w-[170px]"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o} value={o} className="bg-[#0f172a]">{o}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── TRIPS GRID ── */}
            <section className="container-main py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-white font-bold text-xl">
                            {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} available
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                            {activeFilter === 'All' ? 'Showing all destinations' : `Filtered: ${activeFilter}`}
                        </p>
                    </div>
                    {activeFilter !== 'All' && (
                        <button
                            onClick={() => setActiveFilter('All')}
                            className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-white border border-white/[0.07] hover:border-white/[0.15] px-3 py-2 rounded-lg transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear
                        </button>
                    )}
                </div>

                {filteredTrips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                        {filteredTrips.map((trip, i) => (
                            <TripCard key={trip.id} {...trip} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="text-6xl mb-5">🗺️</div>
                        <p className="text-white font-bold text-2xl mb-3">No trips found</p>
                        <p className="text-slate-500 text-base mb-8">Try a different filter or check back soon.</p>
                        <button onClick={() => setActiveFilter('All')} className="btn-primary px-8 py-3.5">
                            View all trips
                        </button>
                    </div>
                )}

                {/* Bottom CTA banner */}
                {filteredTrips.length > 0 && (
                    <motion.div
                        className="mt-24 relative rounded-3xl overflow-hidden"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-[#0a1628] to-teal-600/15" />
                        <div className="absolute inset-0 border border-white/[0.08] rounded-3xl" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-sky-500/10 rounded-full blur-[80px]" />

                        <div className="relative z-10 px-10 py-16 md:px-20 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <p className="text-sky-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-3">Custom Trips</p>
                                <h3 className="text-3xl md:text-4xl font-[var(--font-outfit)] font-extrabold text-white mb-3 leading-tight">
                                    Don&apos;t see your<br />dream destination?
                                </h3>
                                <p className="text-slate-400 text-base leading-relaxed max-w-[380px]">
                                    Tell us where you want to go and we&apos;ll plan a custom group trip just for you.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <a href="/contact" className="btn-primary px-8 py-4 text-base whitespace-nowrap">
                                    Request a Trip
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </section>
        </main>
    )
}
