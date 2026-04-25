'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import TripRegistrationModal from '@/components/ui/TripRegistrationModal'
import { formatCurrency } from '@/lib/utils'

type TripStatus = 'completed' | 'coming_soon' | 'booking_open' | 'yet_to_announce'

type DBTrip = {
    id: string; name: string; destination: string; description: string
    price: number; status: string; startDate: string | null; endDate: string | null
    totalSlots: number; bookedSlots: number; imageUrl: string | null
    featured: boolean; category: string | null
}

const FILTERS = [
    { label: 'All',       value: 'all',       icon: <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg> },
    { label: 'Mountain',  value: 'mountain',  icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 18L9 6l4 7 3-4 5 9H3z"/></svg> },
    { label: 'Beach',     value: 'beach',     icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02l.707.707M1 12h1m18 0h1"/></svg> },
    { label: 'Culture',   value: 'culture',   icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 21V10m4 11V10m4 11V10"/></svg> },
    { label: 'Adventure', value: 'adventure', icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
]

const SORT_OPTIONS = ['Upcoming', 'Price: Low to High', 'Price: High to Low', 'Availability']

const STATUS_CFG: Record<TripStatus, { label: string; badge: string }> = {
    completed:       { label: 'COMPLETED',       badge: 'bg-stone-700/90 text-stone-300' },
    coming_soon:     { label: 'COMING SOON',     badge: 'bg-lime-500/90 text-black' },
    booking_open:    { label: 'BOOKING OPEN',    badge: 'bg-lime-500/90 text-black' },
    yet_to_announce: { label: 'YET TO ANNOUNCE', badge: 'bg-stone-800/90 text-stone-400' },
}

function TripCard({ trip, index }: { trip: DBTrip; index: number }) {
    const [modalOpen, setModalOpen] = useState(false)
    const status = trip.status as TripStatus
    const cfg = STATUS_CFG[status]
    const isBookingOpen  = status === 'booking_open'
    const isComingSoon   = status === 'coming_soon'
    const isCompleted    = status === 'completed'
    const isYetToAnnounce = status === 'yet_to_announce'

    const start = new Date(trip.startDate || '2026-01-01')
    const end   = new Date(trip.endDate   || '2026-01-03')
    const days   = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))
    const nights = Math.max(0, days - 1)
    const fmtD  = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    const img   = trip.imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'

    return (
        <>
            <motion.div
                className="group relative flex flex-col rounded-2xl overflow-hidden"
                style={{ background: '#0a1509', border: '1px solid rgba(132,204,22,0.12)' }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
            >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                    <Image src={img} alt={trip.name} fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isCompleted ? 'grayscale-[40%]' : ''}`}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 35%, rgba(10,21,9,0.95) 100%)' }} />

                    {/* Status badge */}
                    <div className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-md backdrop-blur-md ${cfg.badge}`}>
                        {cfg.label}
                    </div>

                    {/* Duration */}
                    {!isYetToAnnounce && (
                        <div className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-md text-white"
                            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                            {days}D / {nights}N
                        </div>
                    )}

                    {/* Name on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-3 pt-6">
                        <h3 className="text-white font-extrabold text-xl capitalize tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {trip.name}
                        </h3>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 px-5 py-4">
                    <p className="text-sm leading-relaxed mb-3 line-clamp-1" style={{ color: 'rgba(180,200,140,0.5)' }}>
                        {trip.description}
                    </p>

                    {!isYetToAnnounce && (
                        <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'rgba(180,200,140,0.45)' }}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {fmtD(start)} – {fmtD(end)}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '1px solid rgba(132,204,22,0.08)' }}>
                        <div>
                            {isBookingOpen && <>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#a3e635' }}>Booking Open</p>
                                <p className="text-2xl font-extrabold text-white">{trip.price > 0 ? formatCurrency(trip.price) : 'Register Free'}</p>
                            </>}
                            {isComingSoon && <>
                                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(180,200,140,0.4)' }}>Price</p>
                                <p className="text-base font-bold" style={{ color: '#a3e635' }}>Announcing Soon</p>
                            </>}
                            {isCompleted && <>
                                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(180,200,140,0.35)' }}>Was</p>
                                <p className="text-xl font-extrabold text-slate-400">{formatCurrency(trip.price)}</p>
                            </>}
                            {isYetToAnnounce && <>
                                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(180,200,140,0.35)' }}>Details</p>
                                <p className="text-base font-bold text-slate-500">To Be Announced</p>
                            </>}
                        </div>

                        {/* CTAs — Book Now is BLUE per reference */}
                        {isBookingOpen && (
                            <button onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 4px 16px rgba(59,130,246,0.35)' }}>
                                Book Now →
                            </button>
                        )}
                        {isComingSoon && (
                            <button onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg,#a3e635,#65a30d)', color: '#000' }}>
                                Notify Me 🔔
                            </button>
                        )}
                        {isCompleted && <span className="text-xs font-semibold px-4 py-2 rounded-xl" style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>Trip Done ✓</span>}
                        {isYetToAnnounce && <span className="text-xs font-semibold px-4 py-2 rounded-xl" style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>Stay Tuned</span>}
                    </div>
                </div>
            </motion.div>

            {modalOpen && (
                <TripRegistrationModal
                    trip={{ destination: trip.name, price: trip.price, status: trip.status }}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    )
}

export default function TripsPage() {
    const [trips, setTrips]           = useState<DBTrip[]>([])
    const [loading, setLoading]       = useState(true)
    const [activeFilter, setActiveFilter] = useState('all')
    const [sortBy, setSortBy]         = useState('Upcoming')

    useEffect(() => {
        fetch('/api/trips').then(r => r.json()).then(d => {
            setTrips(d.trips || [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const filtered = trips.filter(t => {
        if (activeFilter === 'all') return true
        return (t.category || '').toLowerCase() === activeFilter
    }).sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.price - b.price
        if (sortBy === 'Price: High to Low') return b.price - a.price
        if (sortBy === 'Availability') return (a.totalSlots - a.bookedSlots) - (b.totalSlots - b.bookedSlots)
        return new Date(a.startDate || '2099').getTime() - new Date(b.startDate || '2099').getTime()
    })

    const AVATARS = [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60',
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=60',
    ]

    return (
        <main className="min-h-screen" style={{ background: '#0d150b' }}>

            {/* ── HERO ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pt-28 pb-16">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0e1a0c, #0d150b)' }} />
                <div className="absolute inset-0 grid-pattern opacity-30" />

                <div className="container-main relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        {/* Left */}
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] mb-6 px-4 py-2 rounded-full"
                                style={{ color: '#a3e635', background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                                Browse Destinations
                            </div>

                            <h1 className="font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-5"
                                style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(44px,5.5vw,68px)' }}>
                                Find Your<br />
                                <span style={{ background: 'linear-gradient(135deg,#a3e635,#d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Next Trip
                                </span>
                            </h1>

                            <p className="text-[16px] leading-[1.75] mb-8 max-w-[440px]" style={{ color: 'rgba(180,200,140,0.6)' }}>
                                Curated group adventures across India. Mountains, beaches, heritage cities — all at student-friendly prices.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: '✈️', text: `${trips.length || '2'}+ Trips` },
                                    { icon: '👥', text: 'Group Travel' },
                                    { icon: '💰', text: 'Student Pricing' },
                                    { icon: '🛡️', text: 'Verified Safe' },
                                ].map(b => (
                                    <div key={b.text} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium"
                                        style={{ background: 'rgba(132,204,22,0.06)', border: '1px solid rgba(132,204,22,0.12)', color: 'rgba(180,200,140,0.7)' }}>
                                        <span>{b.icon}</span>{b.text}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — hero image card */}
                        <motion.div className="hidden lg:block" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
                            <div className="relative rounded-2xl overflow-hidden" style={{ height: '300px', border: '1px solid rgba(132,204,22,0.15)' }}>
                                <Image src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000" alt="Mountain" fill className="object-cover" />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(13,21,11,0.55))' }} />

                                {/* Pin */}
                                <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#a3e635', boxShadow: '0 0 20px rgba(163,230,53,0.5)' }}>
                                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                </div>

                                {/* Dashed path */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none" preserveAspectRatio="none">
                                    <path d="M340 28 Q280 76 220 115 Q160 155 120 195" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5"/>
                                </svg>

                                {/* Students badge */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md"
                                    style={{ background: 'rgba(13,21,11,0.85)', border: '1px solid rgba(132,204,22,0.2)' }}>
                                    <div className="flex -space-x-2">
                                        {AVATARS.map((url, i) => (
                                            <div key={i} className="w-7 h-7 rounded-full overflow-hidden border-2" style={{ borderColor: '#0d150b' }}>
                                                <Image src={url} alt="student" width={28} height={28} className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm leading-none">10K+</p>
                                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(180,200,140,0.6)' }}>Students Traveled</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FILTER BAR ─────────────────────────────────────────── */}
            <div className="sticky top-[72px] z-30 backdrop-blur-2xl border-y"
                style={{ background: 'rgba(13,21,11,0.97)', borderColor: 'rgba(132,204,22,0.1)' }}>
                <div className="container-main">
                    <div className="flex items-center justify-between gap-4 py-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                            {FILTERS.map(f => (
                                <button key={f.value} onClick={() => setActiveFilter(f.value)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200"
                                    style={activeFilter === f.value
                                        ? { background: '#a3e635', color: '#000', boxShadow: '0 4px 16px rgba(163,230,53,0.25)' }
                                        : { background: 'transparent', color: 'rgba(180,200,140,0.6)', border: '1px solid rgba(132,204,22,0.12)' }}>
                                    {f.icon}{f.label}
                                </button>
                            ))}
                        </div>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="text-[13px] border rounded-lg px-4 py-2 outline-none cursor-pointer min-w-[160px]"
                            style={{ background: '#0a1208', color: 'rgba(180,200,140,0.7)', borderColor: 'rgba(132,204,22,0.15)' }}>
                            {SORT_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#0a1208' }}>{o}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── TRIPS GRID ─────────────────────────────────────────── */}
            <section className="container-main py-10">
                {/* Count row */}
                <div className="flex items-center justify-between mb-7">
                    <div>
                        <p className="font-bold text-xl">
                            <span style={{ color: '#a3e635' }}>{loading ? '—' : filtered.length} {filtered.length === 1 ? 'trip' : 'trips'}</span>
                            {' '}<span className="text-white">available</span>
                        </p>
                        <p className="text-sm mt-0.5" style={{ color: 'rgba(180,200,140,0.4)' }}>
                            {activeFilter === 'all' ? 'Showing all destinations' : `Filtered: ${activeFilter}`}
                        </p>
                    </div>
                    {activeFilter !== 'all' && (
                        <button onClick={() => setActiveFilter('all')}
                            className="flex items-center gap-2 text-[13px] border px-3 py-2 rounded-lg transition-all hover:text-lime-300"
                            style={{ color: 'rgba(180,200,140,0.4)', borderColor: 'rgba(132,204,22,0.1)' }}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Clear
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl animate-pulse" style={{ height: '360px', background: 'rgba(132,204,22,0.05)', border: '1px solid rgba(132,204,22,0.08)' }} />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filtered.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} />)}
                    </div>
                ) : (
                    <div className="text-center py-28">
                        <div className="text-6xl mb-5">🗺️</div>
                        <p className="text-white font-bold text-2xl mb-3">No trips found</p>
                        <p className="text-base mb-8" style={{ color: 'rgba(180,200,140,0.4)' }}>Try a different filter or check back soon.</p>
                        <button onClick={() => setActiveFilter('all')} className="btn-primary px-8 py-3.5">View all trips</button>
                    </div>
                )}

                {/* ── CTA BANNER ─────────────────────────────────────── */}
                {!loading && (
                    <motion.div
                        className="mt-14 relative rounded-2xl overflow-hidden"
                        style={{ background: 'rgba(10,18,8,0.9)', border: '1px solid rgba(132,204,22,0.15)' }}
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    >
                        {/* Mountain silhouette */}
                        <svg className="absolute right-4 bottom-0 opacity-[0.07]" width="220" height="130" viewBox="0 0 220 130" fill="none">
                            <path d="M0 130L45 65L78 95L120 18L165 75L195 42L220 62V130H0Z" fill="#a3e635"/>
                        </svg>

                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 px-10 py-9">
                            {/* Backpack icon */}
                            <div className="w-20 h-20 flex-shrink-0">
                                <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                                    <rect x="24" y="30" width="32" height="36" rx="4" stroke="#a3e635" strokeWidth="2"/>
                                    <path d="M32 30V24a8 8 0 0116 0v6" stroke="#a3e635" strokeWidth="2"/>
                                    <circle cx="40" cy="50" r="4" fill="#a3e635"/>
                                    <path d="M40 54v6" stroke="#a3e635" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: '#a3e635' }}>Custom Trips</p>
                                <h3 className="font-extrabold text-white text-2xl leading-tight mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    Don&apos;t see your<br />dream destination?
                                </h3>
                                <p className="text-sm" style={{ color: 'rgba(180,200,140,0.5)' }}>
                                    Tell us where you want to go and we&apos;ll plan it for you.
                                </p>
                            </div>
                            <a href="/contact"
                                className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 4px 20px rgba(59,130,246,0.35)' }}>
                                Request a Trip →
                            </a>
                        </div>
                    </motion.div>
                )}
            </section>
        </main>
    )
}
