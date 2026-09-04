'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import TripRegistrationModal from '@/components/ui/TripRegistrationModal'

type ItineraryDay = { day: number; title: string; desc: string }

type Trip = {
    id: string; name: string; destination: string; description: string
    price: number; status: string; startDate: string | null; endDate: string | null
    totalSlots: number; bookedSlots: number; imageUrl: string | null
    featured: boolean; category: string | null; duration: number | null
    difficulty: string | null; meetingPoint: string | null
    itinerary: string | null; inclusions: string | null; exclusions: string | null
    highlights: string | null; whatToBring: string | null; createdAt: string
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
    completed:       { label: 'Completed',       color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' },
    coming_soon:     { label: 'Coming Soon',     color: '#a3e635', bg: 'rgba(163,230,53,0.12)'  },
    booking_open:    { label: 'Booking Open',    color: '#a3e635', bg: 'rgba(163,230,53,0.12)'  },
    yet_to_announce: { label: 'Yet to Announce', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
}

const DIFFICULTY_CFG: Record<string, { label: string; color: string }> = {
    easy:     { label: '🟢 Easy',     color: '#22c55e' },
    moderate: { label: '🟡 Moderate', color: '#eab308' },
    hard:     { label: '🔴 Hard',     color: '#ef4444' },
    expert:   { label: '💀 Expert',   color: '#a855f7' },
}

function parseJson<T>(str: string | null, fallback: T): T {
    if (!str) return fallback
    try { return JSON.parse(str) } catch { return fallback }
}

export default function TripDetailPage() {
    const params = useParams()
    const [trip, setTrip]       = useState<Trip | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetch(`/api/trips/${params.id}`)
            .then(r => r.json())
            .then(({ trip, error }) => {
                if (error || !trip) setNotFound(true)
                else setTrip(trip)
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [params.id])

    if (loading) return (
        <div style={{ minHeight: 'calc(100vh - 72px)', background: '#060d06', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(163,230,53,0.12)', borderTopColor: '#a3e635', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    )
    if (notFound || !trip) return (
        <div style={{ minHeight: 'calc(100vh - 72px)', background: '#060d06', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ fontSize: 64 }}>🗺️</div>
            <h1 style={{ color: 'white', fontWeight: 800, fontSize: 24 }}>Trip Not Found</h1>
            <Link href="/trips" style={{ color: '#a3e635', fontWeight: 700 }}>← Browse All Trips</Link>
        </div>
    )

    const imgUrl = trip.imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200'
    const status = STATUS_CFG[trip.status] ?? STATUS_CFG.yet_to_announce
    const diff   = trip.difficulty ? DIFFICULTY_CFG[trip.difficulty] : null
    const slotsLeft = trip.totalSlots - trip.bookedSlots
    const pct = trip.totalSlots > 0 ? Math.min(100, Math.round((trip.bookedSlots / trip.totalSlots) * 100)) : 0
    const itinerary: ItineraryDay[] = parseJson(trip.itinerary, [])
    const inclusions: string[]  = parseJson(trip.inclusions, [])
    const exclusions: string[]  = parseJson(trip.exclusions, [])
    const highlights: string[]  = parseJson(trip.highlights, [])
    const whatToBring: string[] = parseJson(trip.whatToBring, [])
    const canBook = trip.status === 'booking_open' && slotsLeft > 0

    const startFmt = trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null
    const endFmt   = trip.endDate   ? new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null

    return (
        <>
        <style>{`
        .td-root { min-height: calc(100vh - 72px); background: #060d06; font-family: var(--font-inter,'Inter',sans-serif); }
        .td-hero { position: relative; height: 480px; overflow: hidden; }
        .td-hero-img { width: 100%; height: 100%; object-fit: cover; }
        .td-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,13,6,1) 0%, rgba(6,13,6,0.6) 40%, rgba(6,13,6,0.2) 100%); }
        .td-hero-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px; max-width: 1100px; margin: 0 auto; }
        .td-back { display: inline-flex; align-items: center; gap: 6px; color: rgba(180,200,140,0.6); text-decoration: none; font-size: 12.5px; font-weight: 600; margin-bottom: 20px; transition: color 0.15s; }
        .td-back:hover { color: #a3e635; }
        .td-body { max-width: 1100px; margin: 0 auto; padding: 40px 40px 80px; display: grid; grid-template-columns: 1fr 360px; gap: 40px; }
        .td-main { display: flex; flex-direction: column; gap: 32px; }
        .td-sidebar { display: flex; flex-direction: column; gap: 16px; }

        /* Book card */
        .td-book-card { background: rgba(10,18,8,0.9); border: 1px solid rgba(132,204,22,0.15); border-radius: 20px; padding: 24px; position: sticky; top: 90px; }
        .td-price { font-size: 36px; font-weight: 900; color: #a3e635; font-family: var(--font-outfit,'Outfit',sans-serif); line-height: 1; }
        .td-price-sub { font-size: 12px; color: rgba(180,200,140,0.4); margin-top: 2px; }
        .td-slots-bar { height: 6px; background: rgba(132,204,22,0.1); border-radius: 100px; overflow: hidden; margin: 14px 0 6px; }
        .td-slots-fill { height: 100%; background: linear-gradient(90deg, #a3e635, #84cc16); border-radius: 100px; transition: width 0.5s; }
        .td-book-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; font-family: inherit; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .td-book-btn.active { background: linear-gradient(135deg,#a3e635,#84cc16); color: #050c05; box-shadow: 0 4px 20px rgba(163,230,53,0.35); }
        .td-book-btn.active:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(163,230,53,0.5); }
        .td-book-btn.disabled { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.3); cursor: not-allowed; }

        /* Sections */
        .td-section { background: rgba(10,18,8,0.7); border: 1px solid rgba(132,204,22,0.08); border-radius: 18px; padding: 24px; }
        .td-section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(163,230,53,0.6); margin-bottom: 16px; }
        .td-highlight-item { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(132,204,22,0.06); }
        .td-highlight-item:last-child { border-bottom: none; }
        .td-check { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 10px; }

        /* Itinerary */
        .td-day { display: flex; gap: 16px; margin-bottom: 20px; }
        .td-day-num { width: 36px; height: 36px; border-radius: 50%; background: rgba(163,230,53,0.1); border: 1px solid rgba(163,230,53,0.2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #a3e635; flex-shrink: 0; }
        .td-day-content { padding-top: 6px; }
        .td-day-title { font-size: 14px; font-weight: 700; color: white; }
        .td-day-desc { font-size: 13px; color: rgba(180,200,140,0.55); margin-top: 4px; line-height: 1.55; }

        /* Meta info badges */
        .td-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .td-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; border: 1px solid; }

        @media (max-width: 768px) {
            .td-body { grid-template-columns: 1fr; padding: 24px 16px 60px; }
            .td-book-card { position: static; }
            .td-hero { height: 320px; }
            .td-hero-content { padding: 24px 16px; }
        }
        `}</style>

        <div className="td-root">
            {/* Hero */}
            <div className="td-hero">
                <img src={imgUrl} alt={trip.name} className="td-hero-img" />
                <div className="td-hero-overlay" />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '28px 40px', maxWidth: 1180, margin: '0 auto' }}>
                    <Link href="/trips" className="td-back">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                        All Trips
                    </Link>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px 36px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                            <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: status.bg, color: status.color, border: `1px solid ${status.color}44` }}>
                                ● {status.label}
                            </span>
                            {trip.featured && <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'rgba(212,168,67,0.2)', color: '#d4a843', border: '1px solid rgba(212,168,67,0.3)' }}>⭐ Featured</span>}
                            {diff && <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'rgba(0,0,0,0.3)', color: diff.color, border: `1px solid ${diff.color}44` }}>{diff.label}</span>}
                        </div>
                        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: 42, fontWeight: 900, color: 'white', fontFamily: "var(--font-outfit,'Outfit',sans-serif)", lineHeight: 1.1, letterSpacing: '-0.5px', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                            {trip.name}
                        </motion.h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                            <span style={{ color: 'rgba(180,200,140,0.7)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                {trip.destination}
                            </span>
                            {startFmt && <span style={{ color: 'rgba(180,200,140,0.5)', fontSize: 13 }}>📅 {startFmt}{endFmt ? ` → ${endFmt}` : ''}</span>}
                            {trip.duration && <span style={{ color: 'rgba(180,200,140,0.5)', fontSize: 13 }}>⏱ {trip.duration} Day{trip.duration > 1 ? 's' : ''}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="td-body">
                {/* Main content */}
                <div className="td-main">
                    {/* Description */}
                    <div className="td-section">
                        <p className="td-section-title">About This Trip</p>
                        <p style={{ color: 'rgba(200,220,155,0.75)', fontSize: 15, lineHeight: 1.75 }}>{trip.description}</p>
                    </div>

                    {/* Highlights */}
                    {highlights.length > 0 && (
                        <div className="td-section">
                            <p className="td-section-title">✨ Trip Highlights</p>
                            {highlights.map((h, i) => (
                                <div key={i} className="td-highlight-item">
                                    <div className="td-check" style={{ background: 'rgba(163,230,53,0.12)', color: '#a3e635' }}>✓</div>
                                    <span style={{ color: 'rgba(200,220,155,0.8)', fontSize: 14 }}>{h}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Inclusions / Exclusions */}
                    {(inclusions.length > 0 || exclusions.length > 0) && (
                        <div className="td-section">
                            <p className="td-section-title">What's Included</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                {inclusions.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#a3e635', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✅ Included</p>
                                        {inclusions.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                                                <span style={{ color: '#a3e635', fontSize: 12, marginTop: 2 }}>●</span>
                                                <span style={{ color: 'rgba(200,220,155,0.75)', fontSize: 13 }}>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {exclusions.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#f87171', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>❌ Not Included</p>
                                        {exclusions.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                                                <span style={{ color: '#f87171', fontSize: 12, marginTop: 2 }}>●</span>
                                                <span style={{ color: 'rgba(200,220,155,0.5)', fontSize: 13 }}>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Itinerary */}
                    {itinerary.length > 0 && (
                        <div className="td-section">
                            <p className="td-section-title">📅 Day-by-Day Itinerary</p>
                            {itinerary.map((day) => (
                                <div key={day.day} className="td-day">
                                    <div className="td-day-num">{day.day}</div>
                                    <div className="td-day-content">
                                        <div className="td-day-title">{day.title}</div>
                                        <div className="td-day-desc">{day.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Meeting point */}
                    {trip.meetingPoint && (
                        <div className="td-section">
                            <p className="td-section-title">📍 Meeting Point</p>
                            <p style={{ color: 'rgba(200,220,155,0.75)', fontSize: 14 }}>{trip.meetingPoint}</p>
                        </div>
                    )}

                    {/* What to bring */}
                    {whatToBring.length > 0 && (
                        <div className="td-section">
                            <p className="td-section-title">🎒 What to Bring</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
                                {whatToBring.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(132,204,22,0.05)' }}>
                                        <span style={{ color: '#d4a843', fontSize: 12 }}>◆</span>
                                        <span style={{ color: 'rgba(200,220,155,0.7)', fontSize: 13 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="td-sidebar">
                    <div className="td-book-card">
                        <div className="td-price">₹{trip.price > 0 ? trip.price.toLocaleString('en-IN') : 'TBA'}</div>
                        <div className="td-price-sub">per person · all inclusive</div>

                        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {startFmt && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: 'rgba(180,200,140,0.4)' }}>Start Date</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{startFmt}</span>
                                </div>
                            )}
                            {endFmt && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: 'rgba(180,200,140,0.4)' }}>End Date</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{endFmt}</span>
                                </div>
                            )}
                            {trip.duration && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: 'rgba(180,200,140,0.4)' }}>Duration</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{trip.duration} Days</span>
                                </div>
                            )}
                            {diff && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: 'rgba(180,200,140,0.4)' }}>Difficulty</span>
                                    <span style={{ color: diff.color, fontWeight: 700 }}>{diff.label}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ height: 1, background: 'rgba(132,204,22,0.08)', margin: '16px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                            <span style={{ color: 'rgba(180,200,140,0.4)' }}>{trip.bookedSlots} booked</span>
                            <span style={{ color: canBook ? '#a3e635' : '#9ca3af', fontWeight: 700 }}>
                                {canBook ? `${slotsLeft} left` : trip.status === 'completed' ? 'Completed' : 'Unavailable'}
                            </span>
                        </div>
                        <div className="td-slots-bar">
                            <div className="td-slots-fill" style={{ width: `${pct}%`, background: pct >= 80 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#a3e635,#84cc16)' }} />
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(180,200,140,0.3)', marginBottom: 16 }}>{trip.totalSlots} total slots</div>

                        <button
                            className={`td-book-btn ${canBook ? 'active' : 'disabled'}`}
                            onClick={() => canBook && setShowModal(true)}
                            disabled={!canBook}
                        >
                            {canBook ? '🎒 Book This Trip' : trip.status === 'completed' ? 'Trip Completed' : trip.status === 'coming_soon' ? '🔔 Coming Soon' : 'Unavailable'}
                        </button>

                        {canBook && (
                            <p style={{ fontSize: 11, color: 'rgba(180,200,140,0.3)', textAlign: 'center', marginTop: 10 }}>
                                No payment now — our team will contact you
                            </p>
                        )}
                    </div>

                    {/* Quick info card */}
                    <div className="td-section">
                        <p className="td-section-title">Quick Info</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(200,220,155,0.65)' }}>
                                <span>📍</span> {trip.destination}
                            </div>
                            {trip.category && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(200,220,155,0.65)' }}>
                                    <span>🏷️</span> {trip.category.charAt(0).toUpperCase() + trip.category.slice(1)}
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(200,220,155,0.65)' }}>
                                <span>👥</span> Max {trip.totalSlots} travellers
                            </div>
                            {inclusions.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(200,220,155,0.65)' }}>
                                    <span>✅</span> {inclusions.length} inclusions
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {showModal && (
            <TripRegistrationModal
                trip={{ destination: trip.destination, price: trip.price, status: trip.status }}
                onClose={() => setShowModal(false)}
            />
        )}
        </>
    )
}
