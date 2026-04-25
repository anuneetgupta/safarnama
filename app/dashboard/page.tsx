'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

type Registration = {
    id: string
    tripName: string
    status: string
    createdAt: string
    trip: {
        id: string
        imageUrl: string | null
        startDate: string | null
        endDate: string | null
        price: number
        status: string
    } | null
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
    pending:   { label: 'Pending',   cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    confirmed: { label: 'Confirmed', cls: 'bg-lime-500/15 text-lime-400 border-lime-500/25' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
}

function fmtDate(d: string | null) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loadingRegs, setLoadingRegs] = useState(true)

    const userName     = session?.user?.name?.split(' ')[0] ?? 'Traveler'
    const userFullName = session?.user?.name ?? 'Traveler'
    const userEmail    = session?.user?.email ?? ''
    const userAvatar   = session?.user?.image ?? null

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/user/registrations')
                .then(r => r.json())
                .then(d => setRegistrations(d.registrations ?? []))
                .catch(() => setRegistrations([]))
                .finally(() => setLoadingRegs(false))
        }
    }, [status])

    // ── Loading ────────────────────────────────────────────────────────────────
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d150b' }}>
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-8 h-8 animate-spin" style={{ color: '#a3e635' }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm" style={{ color: 'rgba(180,200,140,0.5)' }}>Loading your profile...</p>
                </div>
            </div>
        )
    }

    // ── Unauthenticated ────────────────────────────────────────────────────────
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d150b' }}>
                <div className="text-center">
                    <p className="mb-4" style={{ color: 'rgba(180,200,140,0.5)' }}>You need to sign in to view your dashboard.</p>
                    <Link href="/auth/login" className="btn-primary px-6 py-3">Sign In</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative" style={{ background: '#0d150b' }}>
            {/* Background grid */}
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full blur-[160px]" style={{ background: 'rgba(132,204,22,0.04)' }} />

            <div className="container-main relative z-10 pt-10 pb-16">

                {/* ── Top bar ────────────────────────────────────────────────── */}
                <motion.div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <p className="text-sm mb-1" style={{ color: 'rgba(180,200,140,0.4)' }}>Welcome back 👋</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                            Hello,{' '}
                            <span style={{ background: 'linear-gradient(135deg,#a3e635,#d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {userName}
                            </span>
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/trips"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg,#a3e635,#84cc16)', boxShadow: '0 4px 16px rgba(163,230,53,0.25)' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Book a Trip
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Profile Card ──────────────────────────────────────── */}
                    <motion.div
                        className="rounded-2xl p-7"
                        style={{ background: 'rgba(10,18,8,0.85)', border: '1px solid rgba(132,204,22,0.12)', backdropFilter: 'blur(16px)' }}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2" style={{ borderColor: 'rgba(163,230,53,0.3)' }}>
                                    {userAvatar ? (
                                        <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-black font-bold text-2xl"
                                            style={{ background: 'linear-gradient(135deg,#a3e635,#d4a843)' }}>
                                            {userFullName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2" style={{ background: '#a3e635', borderColor: '#0d150b' }} />
                            </div>
                            <h2 className="text-white font-bold text-lg mb-1">{userFullName}</h2>
                            <p className="text-sm mb-3" style={{ color: 'rgba(180,200,140,0.5)' }}>{userEmail}</p>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                                style={{ color: '#a3e635', background: 'rgba(163,230,53,0.08)', borderColor: 'rgba(163,230,53,0.2)' }}>
                                ✓ Verified Member
                            </span>

                            {/* Stats */}
                            <div className="w-full mt-6 pt-5 grid grid-cols-2 gap-3" style={{ borderTop: '1px solid rgba(132,204,22,0.1)' }}>
                                <div className="text-center">
                                    <p className="text-xl font-extrabold text-white">{registrations.length}</p>
                                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(180,200,140,0.45)' }}>Trips Booked</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-extrabold" style={{ color: '#a3e635' }}>
                                        {registrations.filter(r => r.status === 'confirmed').length}
                                    </p>
                                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(180,200,140,0.45)' }}>Confirmed</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── My Trips ───────────────────────────────────────────── */}
                    <motion.div
                        className="lg:col-span-2 rounded-2xl p-7"
                        style={{ background: 'rgba(10,18,8,0.85)', border: '1px solid rgba(132,204,22,0.12)', backdropFilter: 'blur(16px)' }}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-bold text-base">My Trips</h2>
                            <Link href="/trips" className="text-xs font-semibold transition-colors hover:text-lime-300"
                                style={{ color: 'rgba(163,230,53,0.6)' }}>
                                Browse more →
                            </Link>
                        </div>

                        {loadingRegs ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(132,204,22,0.05)' }} />
                                ))}
                            </div>
                        ) : registrations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                                    style={{ background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.15)' }}>
                                    <svg className="w-7 h-7" style={{ color: '#a3e635' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                    </svg>
                                </div>
                                <p className="text-white font-semibold mb-1">No trips booked yet</p>
                                <p className="text-sm mb-5" style={{ color: 'rgba(180,200,140,0.4)' }}>
                                    Your registered trips will appear here once confirmed.
                                </p>
                                <Link href="/trips"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:-translate-y-0.5"
                                    style={{ background: 'linear-gradient(135deg,#a3e635,#84cc16)', boxShadow: '0 4px 16px rgba(163,230,53,0.25)' }}
                                >
                                    Browse Trips →
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {registrations.map((reg, i) => {
                                    const st = STATUS_STYLES[reg.status] ?? STATUS_STYLES.pending
                                    return (
                                        <motion.div
                                            key={reg.id}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            className="flex items-center gap-4 p-4 rounded-xl"
                                            style={{ background: 'rgba(132,204,22,0.04)', border: '1px solid rgba(132,204,22,0.08)' }}
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'rgba(132,204,22,0.1)' }}>
                                                {reg.trip?.imageUrl
                                                    ? <img src={reg.trip.imageUrl} alt={reg.tripName} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center text-xl">✈️</div>
                                                }
                                            </div>
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-semibold text-sm truncate">{reg.tripName}</p>
                                                {reg.trip?.startDate && (
                                                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(180,200,140,0.45)' }}>
                                                        {fmtDate(reg.trip.startDate)} – {fmtDate(reg.trip.endDate)}
                                                    </p>
                                                )}
                                                <p className="text-[11px]" style={{ color: 'rgba(180,200,140,0.35)' }}>
                                                    Registered {fmtDate(reg.createdAt)}
                                                </p>
                                            </div>
                                            {/* Status */}
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border flex-shrink-0 ${st.cls}`}>
                                                {st.label}
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* ── Quick Links ────────────────────────────────────────── */}
                    <motion.div
                        className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    >
                        {[
                            { label: 'Browse Trips', href: '/trips', icon: '✈️', color: 'rgba(163,230,53,0.06)', border: 'rgba(163,230,53,0.12)', hover: 'rgba(163,230,53,0.2)' },
                            { label: 'Gallery',      href: '/gallery', icon: '📸', color: 'rgba(212,168,67,0.06)', border: 'rgba(212,168,67,0.12)', hover: 'rgba(212,168,67,0.2)' },
                            { label: 'Reviews',      href: '/blog', icon: '⭐', color: 'rgba(163,230,53,0.06)', border: 'rgba(163,230,53,0.12)', hover: 'rgba(163,230,53,0.2)' },
                            { label: 'Contact Us',   href: '/contact', icon: '💬', color: 'rgba(212,168,67,0.06)', border: 'rgba(212,168,67,0.12)', hover: 'rgba(212,168,67,0.2)' },
                        ].map(item => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1"
                                style={{ background: item.color, border: `1px solid ${item.border}`, backdropFilter: 'blur(8px)' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = item.hover)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = item.border)}
                            >
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <p className="text-white text-sm font-semibold">{item.label}</p>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
