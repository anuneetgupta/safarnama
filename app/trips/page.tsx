'use client'

import { motion, useInView } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
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
    { label: 'All',       value: 'all',       icon: '⊞' },
    { label: 'Mountain',  value: 'mountain',  icon: '⛰️' },
    { label: 'Beach',     value: 'beach',     icon: '🌊' },
    { label: 'Culture',   value: 'culture',   icon: '🏛️' },
    { label: 'Adventure', value: 'adventure', icon: '⚡' },
]

const SORT_OPTIONS = ['Upcoming', 'Price: Low to High', 'Price: High to Low', 'Availability']

const STATUS_CFG: Record<TripStatus, { label: string; badge: string; dot: string; textColor: string }> = {
    completed:       { label: 'COMPLETED',       badge: 'rgba(40,40,40,0.90)',   dot: '#6b7280', textColor: '#9ca3af' },
    coming_soon:     { label: 'COMING SOON',     badge: 'rgba(163,230,53,0.15)', dot: '#a3e635', textColor: '#a3e635' },
    booking_open:    { label: 'BOOKING OPEN',    badge: 'rgba(163,230,53,0.15)', dot: '#a3e635', textColor: '#a3e635' },
    yet_to_announce: { label: 'YET TO ANNOUNCE', badge: 'rgba(30,30,30,0.90)',   dot: '#6b7280', textColor: '#6b7280' },
}

const CATEGORY_TAGS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    mountain:  { label: '\u26F0\uFE0F Mountain',  color: '#a3e635', bg: 'rgba(163,230,53,0.12)' },
    beach:     { label: '\uD83C\uDFD6\uFE0F Beach',     color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
    culture:   { label: '\uD83C\uDFDB\uFE0F Culture',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    adventure: { label: '\u26A1 Adventure', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    popular:   { label: '\uD83D\uDD25 Popular',   color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
}

function FilterBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
    const [hov, setHov] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={active ? {
                background: 'linear-gradient(135deg,#a3e635,#84cc16)',
                color: '#080f08', borderRadius: 999, padding: '9px 20px',
                fontSize: 13, fontWeight: 700, border: 'none',
                boxShadow: '0 4px 20px rgba(163,230,53,0.38)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            } : {
                background: hov ? 'rgba(132,204,22,0.10)' : 'rgba(132,204,22,0.05)',
                color: hov ? 'rgba(200,230,150,0.90)' : 'rgba(180,200,140,0.65)',
                borderRadius: 999, padding: '9px 20px',
                fontSize: 13, fontWeight: 600,
                border: `1px solid ${hov ? 'rgba(132,204,22,0.25)' : 'rgba(132,204,22,0.14)'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                backdropFilter: 'blur(8px)', transition: 'all 0.2s ease',
            }}
        >
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
        </button>
    )
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const

/* ── Trip Card ── */
function TripCard({ trip, index }: { trip: DBTrip; index: number }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [hovered, setHovered]     = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })
    const status         = trip.status as TripStatus
    const cfg            = STATUS_CFG[status]
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
    const slotsLeft = trip.totalSlots - trip.bookedSlots
    const pct = trip.totalSlots > 0 ? Math.min(100, Math.round((trip.bookedSlots / trip.totalSlots) * 100)) : 0

    const catKey = (trip.category || '').toLowerCase()
    const displayTag = CATEGORY_TAGS_MAP[catKey] || (trip.featured ? CATEGORY_TAGS_MAP.popular : null)

    return (
        <>
            <motion.article
                ref={ref}
                className="group relative flex flex-col overflow-hidden"
                style={{
                    borderRadius: 22,
                    background: 'rgba(6,10,5,0.65)',
                    border: `1px solid ${hovered ? 'rgba(163,230,53,0.30)' : 'rgba(132,204,22,0.10)'}`,
                    boxShadow: hovered
                        ? '0 0 0 1px rgba(163,230,53,0.14), 0 20px 60px rgba(0,0,0,0.55)'
                        : '0 8px 40px rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                }}
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
                transition={{ delay: index * 0.07, duration: 0.55, ease: EASE }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: 248, borderRadius: '22px 22px 0 0' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <Image src={img} alt={trip.name} fill
                            className={`object-cover ${isCompleted ? 'grayscale-[40%] brightness-75' : ''}`}
                            style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                            sizes="(max-width:768px)100vw,(max-width:1024px)50vw,33vw"
                        />
                    </div>
                    {/* Gradient vignette */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,12,3,0.92) 0%, rgba(5,12,3,0.28) 42%, transparent 70%)' }} />
                    {/* Top badges row */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                            color: cfg.textColor, background: cfg.badge,
                            border: `1px solid ${cfg.textColor}30`,
                            padding: '4px 10px', borderRadius: 8, backdropFilter: 'blur(12px)',
                        }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                            {cfg.label}
                        </span>
                        <div className="flex items-center gap-2">
                            {trip.featured && <span className="text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md" style={{ background: 'rgba(212,168,67,0.9)', color: '#000' }}>★ FEATURED</span>}
                            {!isYetToAnnounce && <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md text-white backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>{days}D · {nights}N</span>}
                        </div>
                    </div>
                    {/* Name + location overlaid on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                        {displayTag && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                                style={{ background: displayTag.bg, color: displayTag.color, border: `1px solid ${displayTag.color}30`, backdropFilter: 'blur(8px)' }}>
                                {displayTag.label}
                            </span>
                        )}
                        <h3 className="text-white font-extrabold capitalize tracking-tight leading-tight"
                            style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(17px,2vw,21px)', textShadow: '0 2px 16px rgba(0,0,0,0.9)', letterSpacing: '-0.01em' }}>
                            {trip.name}
                        </h3>
                        {trip.destination && (
                            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'rgba(163,230,53,0.7)' }}>
                                <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                {trip.destination}
                            </p>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 px-5 py-5 gap-3.5">
                    <p className="text-[13px] leading-[1.72] line-clamp-2" style={{ color: 'rgba(200,220,160,0.65)' }}>
                        {trip.description}
                    </p>
                    {!isYetToAnnounce && (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(180,200,140,0.42)' }}>
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {fmtD(start)} – {fmtD(end)}
                        </div>
                    )}
                    {isBookingOpen && trip.totalSlots > 0 && (
                        <div>
                            <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(180,200,140,0.4)' }}>
                                <span>{slotsLeft > 0 ? `${slotsLeft} spots left` : 'Fully booked'}</span>
                                <span style={{ color: pct > 80 ? '#f87171' : '#a3e635' }}>{pct}% filled</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 80 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#a3e635,#65a30d)' }} />
                            </div>
                        </div>
                    )}

                    {/* Thin accent rule */}
                    <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(132,204,22,0.12), transparent)', marginTop: 'auto' }} />

                    <div className="flex items-center justify-between pt-2">
                        <div>
                            {isBookingOpen && <>
                                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(163,230,53,0.55)', marginBottom: 3 }}>Per Person</p>
                                <p style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, fontFamily: 'var(--font-outfit)' }}>
                                    {trip.price > 0 ? formatCurrency(trip.price) : 'Free'}
                                </p>
                            </>}
                            {isComingSoon && <>
                                <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(180,200,140,0.35)', marginBottom: 3 }}>Price</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#a3e635' }}>Announcing Soon</p>
                            </>}
                            {isCompleted && <>
                                <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(180,200,140,0.3)', marginBottom: 3 }}>Was</p>
                                <p style={{ fontSize: 18, fontWeight: 800, color: '#4b5563', textDecoration: 'line-through' }}>{formatCurrency(trip.price)}</p>
                            </>}
                            {isYetToAnnounce && <>
                                <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(180,200,140,0.3)', marginBottom: 3 }}>Details</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#6b7280' }}>TBA</p>
                            </>}
                        </div>
                        {isBookingOpen && (
                            <button onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2 text-sm font-bold active:scale-95"
                                style={{
                                    padding: '11px 22px',
                                    borderRadius: 12,
                                    background: 'linear-gradient(135deg,#a3e635,#65a30d)',
                                    color: '#050e02',
                                    boxShadow: '0 4px 20px rgba(163,230,53,0.32)',
                                    letterSpacing: '0.01em',
                                    fontFamily: 'var(--font-outfit)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    cursor: 'pointer',
                                    border: 'none',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(163,230,53,0.52)'
                                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(163,230,53,0.32)'
                                    ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                                }}>
                                Book Now
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                            </button>
                        )}
                        {isComingSoon && (
                            <button onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2 text-sm font-bold active:scale-95"
                                style={{
                                    padding: '11px 20px',
                                    borderRadius: 12,
                                    background: 'rgba(163,230,53,0.08)',
                                    color: '#a3e635',
                                    border: '1px solid rgba(163,230,53,0.28)',
                                    letterSpacing: '0.01em',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(163,230,53,0.15)'
                                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(163,230,53,0.18)'
                                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(163,230,53,0.08)'
                                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
                                    ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                                }}>
                                🔔 Notify Me
                            </button>
                        )}
                        {isCompleted && <span className="text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5" style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Trip Done</span>}
                        {isYetToAnnounce && <span className="text-xs font-semibold px-4 py-2 rounded-xl" style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>Stay Tuned</span>}
                    </div>
                </div>
            </motion.article>

            {modalOpen && (
                <TripRegistrationModal
                    trip={{ destination: trip.name, price: trip.price, status: trip.status }}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    )
}


/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */
export default function TripsPage() {
    const [trips, setTrips]           = useState<DBTrip[]>([])
    const [loading, setLoading]       = useState(true)
    const [activeFilter, setActiveFilter] = useState('all')
    const [sortBy, setSortBy]         = useState('Upcoming')

    const statsRef = useRef<HTMLDivElement>(null)
    const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

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

    const openCount  = trips.filter(t => t.status === 'booking_open').length
    const totalCount = trips.length

    return (
        <main className="min-h-screen" style={{ background: '#080f08' }}>

            {/* ════════════════ HERO ════════════════ */}
            <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 140, paddingBottom: 80, minHeight: 460 }}>
                {/* Background travel photo */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.06 }} animate={{ scale: 1 }}
                    transition={{ duration: 1.8, ease: EASE }}
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 40%',
                    }}
                />

                {/* Layer 1: dark scrim */}
                <div className="absolute inset-0" style={{ background: 'rgba(4,10,3,0.62)' }} />

                {/* Layer 2: lime radial glow */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(132,204,22,0.10) 0%, transparent 65%)' }} />

                {/* Layer 3: bottom fade to match page bg */}
                <div className="absolute bottom-0 left-0 right-0" style={{ height: 160, background: 'linear-gradient(to bottom, transparent 0%, #080f08 100%)' }} />

                {/* Layer 4: subtle grid */}
                <div className="absolute inset-0 grid-pattern opacity-10" />

                <div className="relative z-10 text-center px-4">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
                            style={{ background: 'rgba(163,230,53,0.07)', border: '1px solid rgba(163,230,53,0.18)', color: '#a3e635', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                            Explore Destinations
                        </div>

                        {/* Headline */}
                        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(48px,7vw,80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#f0f4e8', marginBottom: 20 }}>
                            Discover Your{' '}
                            <span style={{ background: 'linear-gradient(135deg,#a3e635,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Next Adventure
                            </span>
                        </h1>

                        <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(180,200,140,0.55)', maxWidth: 480, margin: '0 auto 32px' }}>
                            Curated group adventures across India. Mountains, beaches, heritage cities — all at student-friendly prices.
                        </p>

                        {/* Decorative divider */}
                        <div className="flex items-center justify-center gap-4">
                            <div style={{ height: 1, width: 80, background: 'linear-gradient(to right,transparent,rgba(132,204,22,0.3))' }} />
                            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                                <path d="M2 20L14 2L26 20H2Z" stroke="#a3e635" strokeWidth="1.5" opacity="0.6"/>
                                <path d="M10 20L14 14L18 20H10Z" fill="#a3e635" opacity="0.4"/>
                            </svg>
                            <div style={{ height: 1, width: 80, background: 'linear-gradient(to left,transparent,rgba(132,204,22,0.3))' }} />
                        </div>

                    </motion.div>
                </div>
            </section>

            {/* ════════════════ STATS STRIP ════════════════ */}
            <div ref={statsRef} className="container-main" style={{ marginBottom: 48 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="stats-grid">
                    {[
                        { icon: '🗺️', value: `${totalCount || '—'}`,   label: 'Total Trips'     },
                        { icon: '🎯', value: `${openCount || '—'}`,    label: 'Open for Booking' },
                        { icon: '👥', value: 'Group',                   label: 'Travel Style'     },
                        { icon: '💰', value: 'Student',                 label: 'Friendly Pricing' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={statsInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                            style={{
                                textAlign: 'center', borderRadius: 18, padding: '24px 16px',
                                background: 'rgba(6,10,5,0.7)', border: '1px solid rgba(132,204,22,0.10)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                            <p style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#a3e635', fontFamily: 'var(--font-outfit)', lineHeight: 1.1 }}>
                                {s.value}
                            </p>
                            <p style={{ fontSize: 12, color: 'rgba(180,200,140,0.4)', marginTop: 5, letterSpacing: '0.04em' }}>
                                {s.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ════════════════ FILTER TABS ════════════════ */}
            <div className="container-main">
                <motion.div
                    className="flex flex-wrap gap-2 justify-center items-center"
                    style={{ marginBottom: 16 }}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {FILTERS.map(f => (
                        <FilterBtn
                            key={f.value}
                            active={activeFilter === f.value}
                            onClick={() => setActiveFilter(f.value)}
                            icon={f.icon}
                            label={f.label}
                        />
                    ))}

                    {/* Sort dropdown */}
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        style={{
                            background: 'rgba(132,204,22,0.05)', color: 'rgba(180,200,140,0.65)',
                            borderRadius: 999, padding: '8px 18px', fontSize: 13, fontWeight: 600,
                            border: '1px solid rgba(132,204,22,0.14)', cursor: 'pointer',
                            outline: 'none', minWidth: 170, marginLeft: 8,
                        }}>
                        {SORT_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#080f08' }}>{o}</option>)}
                    </select>
                </motion.div>

                {/* Count indicator */}
                <motion.div
                    className="text-center"
                    style={{ marginBottom: 40 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                >
                    <p style={{ fontSize: 14, color: 'rgba(180,200,140,0.4)' }}>
                        {loading ? 'Loading trips…' : (
                            <>
                                <span style={{ color: '#a3e635', fontWeight: 700 }}>{filtered.length} {filtered.length === 1 ? 'trip' : 'trips'}</span>
                                {' '}available
                                {activeFilter !== 'all' && (
                                    <>
                                        {' '}in <span style={{ color: 'rgba(200,220,160,0.7)', fontWeight: 600 }}>{activeFilter}</span>
                                        {' · '}
                                        <button onClick={() => setActiveFilter('all')}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a3e635', fontSize: 13, fontWeight: 600, padding: 0, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                                            Clear filter
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </p>
                </motion.div>
            </div>

            {/* ════════════════ TRIPS GRID ════════════════ */}
            <div className="container-main" style={{ paddingBottom: 80 }}>
                {loading ? (
                    <div className="grid grid-cols-3 gap-5 trips-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl animate-pulse" style={{ height: 440, background: 'rgba(132,204,22,0.04)', border: '1px solid rgba(132,204,22,0.07)' }} />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-3 gap-6 trips-grid">
                        {filtered.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} />)}
                    </div>
                ) : (
                    <div className="text-center py-28">
                        <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
                        <p style={{ color: '#f0f4e8', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No trips found</p>
                        <p style={{ color: 'rgba(180,200,140,0.4)', fontSize: 14, marginBottom: 28 }}>Try a different filter or check back soon.</p>
                        <button onClick={() => setActiveFilter('all')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 28px', borderRadius: 14,
                                background: 'linear-gradient(135deg,#a3e635,#65a30d)',
                                color: '#080f08', fontWeight: 700, fontSize: 14,
                                border: 'none', cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(163,230,53,0.30)',
                            }}>
                            View all trips
                        </button>
                    </div>
                )}

                {/* ════════════════ CTA BANNER ════════════════ */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ marginTop: 64 }}
                    >
                        <div style={{
                            position: 'relative', overflow: 'hidden', borderRadius: 24, padding: '56px 40px',
                            background: 'rgba(6,10,5,0.80)', border: '1px solid rgba(163,230,53,0.14)',
                            backdropFilter: 'blur(24px)', textAlign: 'center',
                        }}>
                            {/* Glow */}
                            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(132,204,22,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

                            {/* Mountain silhouette */}
                            <svg className="absolute right-4 bottom-0 opacity-[0.05]" width="240" height="140" viewBox="0 0 240 140" fill="none">
                                <path d="M0 140L50 70L85 100L130 20L180 80L210 45L240 65V140H0Z" fill="#a3e635"/>
                            </svg>

                            {/* Backpack icon */}
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <svg viewBox="0 0 80 80" fill="none" style={{ width: 28, height: 28 }}>
                                    <rect x="24" y="30" width="32" height="36" rx="4" stroke="#a3e635" strokeWidth="2"/>
                                    <path d="M32 30V24a8 8 0 0116 0v6" stroke="#a3e635" strokeWidth="2"/>
                                    <circle cx="40" cy="50" r="4" fill="#a3e635"/>
                                    <path d="M40 54v6" stroke="#a3e635" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>

                            <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 26, fontWeight: 800, color: '#f0f4e8', marginBottom: 10, position: 'relative' }}>
                                Don&apos;t see your dream destination?
                            </h3>
                            <p style={{ fontSize: 15, color: 'rgba(180,200,140,0.5)', maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.6, position: 'relative' }}>
                                Tell us where you want to go and we&apos;ll plan a custom trip just for you and your group.
                            </p>

                            <a
                                href="/contact"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 10,
                                    padding: '14px 32px', borderRadius: 14,
                                    background: 'linear-gradient(135deg,#a3e635,#65a30d)',
                                    color: '#050e02', fontWeight: 700, fontSize: 15,
                                    textDecoration: 'none', position: 'relative',
                                    boxShadow: '0 6px 24px rgba(163,230,53,0.32)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    fontFamily: 'var(--font-outfit)',
                                }}
                                onMouseEnter={e => {
                                    ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'
                                    ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 32px rgba(163,230,53,0.50)'
                                }}
                                onMouseLeave={e => {
                                    ;(e.currentTarget as HTMLAnchorElement).style.transform = 'none'
                                    ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 24px rgba(163,230,53,0.32)'
                                }}
                            >
                                Request a Trip
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                </svg>
                            </a>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Responsive overrides */}
            <style>{`
                @media (max-width: 1024px) {
                    .trips-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 768px) {
                    .trips-grid { grid-template-columns: 1fr !important; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 480px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
                }
            `}</style>
        </main>
    )
}
