'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pending:   { label: 'Pending',   color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
    confirmed: { label: 'Confirmed', color: '#a3e635', bg: 'rgba(163,230,53,0.1)',  border: 'rgba(163,230,53,0.25)' },
    cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
}

function fmtDate(d: string | null) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const QUICK_LINKS = [
    {
        label: 'Browse Trips', href: '/trips',
        desc: 'Explore upcoming adventures',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
        ),
        accent: '#a3e635',
    },
    {
        label: 'My Profile', href: '/dashboard/profile',
        desc: 'Edit your traveler ID',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        ),
        accent: '#c084fc',
    },
    {
        label: 'Gallery', href: '/gallery',
        desc: 'See trip memories',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
        ),
        accent: '#d4a843',
    },
    {
        label: 'Reviews', href: '/blog',
        desc: 'Read traveler stories',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
        ),
        accent: '#38bdf8',
    },
    {
        label: 'Contact Us', href: '/contact',
        desc: 'Get in touch with us',
        icon: (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012.77 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
        ),
        accent: '#f97316',
    },
]

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loadingRegs, setLoadingRegs] = useState(true)
    const [profileOpen, setProfileOpen] = useState(false)
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const userName     = session?.user?.name?.split(' ')[0] ?? 'Traveler'
    const userFullName = session?.user?.name ?? 'Traveler'
    const userEmail    = session?.user?.email ?? ''
    const userAvatar   = session?.user?.image ?? null
    const initials     = userFullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

    // Close dropdown on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    useEffect(() => {
        if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
            router.replace('/admin')
        }
    }, [status, session, router])

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/user/registrations')
                .then(r => r.json())
                .then(d => setRegistrations(d.registrations ?? []))
                .catch(() => setRegistrations([]))
                .finally(() => setLoadingRegs(false))
        }
    }, [status])

    if (status === 'loading') {
        return (
            <div style={{ minHeight: 'calc(100vh - 72px)', background: '#080f08', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid rgba(163,230,53,0.15)', borderTopColor: '#a3e635', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: 'rgba(180,200,140,0.45)', fontSize: 14 }}>Loading your profile...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!session) {
        return (
            <div style={{ minHeight: 'calc(100vh - 72px)', background: '#080f08', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'rgba(180,200,140,0.5)', marginBottom: 16 }}>Please sign in to view your dashboard.</p>
                    <Link href="/auth/login" style={{ background: 'linear-gradient(135deg,#a3e635,#84cc16)', color: '#050c05', fontWeight: 700, padding: '12px 28px', borderRadius: 12, textDecoration: 'none' }}>Sign In</Link>
                </div>
            </div>
        )
    }

    const confirmedCount = registrations.filter(r => r.status === 'confirmed').length
    const pendingCount   = registrations.filter(r => r.status === 'pending').length

    return (
        <>
            <style>{`
                .db-wrap {
                    min-height: calc(100vh - 72px);
                    background: #080f08;
                    font-family: var(--font-inter, 'Inter', sans-serif);
                    position: relative;
                    overflow-x: hidden;
                }
                .db-bg-glow {
                    position: absolute;
                    top: -100px;
                    right: -200px;
                    width: 700px;
                    height: 700px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(132,204,22,0.05) 0%, transparent 65%);
                    pointer-events: none;
                }
                .db-bg-glow2 {
                    position: absolute;
                    bottom: 0;
                    left: -200px;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 65%);
                    pointer-events: none;
                }

                /* HERO HEADER */
                .db-hero {
                    position: relative;
                    padding: 48px 0 36px;
                    border-bottom: 1px solid rgba(132,204,22,0.07);
                    margin-bottom: 40px;
                }
                .db-hero-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    flex-wrap: wrap;
                }
                .db-hero-left { display: flex; align-items: center; gap: 24px; }
                .db-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid rgba(163,230,53,0.35);
                    flex-shrink: 0;
                    position: relative;
                }
                .db-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .db-avatar-fallback {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #a3e635, #d4a843);
                    font-weight: 800;
                    font-size: 24px;
                    color: #050c05;
                    font-family: var(--font-outfit, 'Outfit', sans-serif);
                }
                .db-online-dot {
                    position: absolute;
                    bottom: 3px;
                    right: 3px;
                    width: 13px;
                    height: 13px;
                    background: #a3e635;
                    border-radius: 50%;
                    border: 2px solid #080f08;
                }
                .db-greeting { color: rgba(180,200,140,0.45); font-size: 13px; margin-bottom: 6px; }
                .db-name {
                    font-size: 32px;
                    font-weight: 800;
                    color: white;
                    font-family: var(--font-outfit, 'Outfit', sans-serif);
                    letter-spacing: -0.3px;
                    line-height: 1.1;
                }
                .db-name span {
                    background: linear-gradient(135deg, #a3e635, #d4a843);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .db-email { font-size: 13px; color: rgba(180,200,140,0.38); margin-top: 4px; }
                .db-verified {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #a3e635;
                    background: rgba(163,230,53,0.08);
                    border: 1px solid rgba(163,230,53,0.2);
                    padding: 3px 10px;
                    border-radius: 100px;
                    margin-top: 8px;
                }
                .db-hero-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
                .db-btn-primary {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 11px 22px;
                    background: linear-gradient(135deg, #a3e635, #84cc16);
                    color: #050c05;
                    font-weight: 700;
                    font-size: 13.5px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                    box-shadow: 0 4px 18px rgba(163,230,53,0.25);
                }
                .db-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(163,230,53,0.4); }
                .db-btn-ghost {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 11px 22px;
                    background: rgba(239,68,68,0.07);
                    color: #f87171;
                    font-weight: 600;
                    font-size: 13.5px;
                    border-radius: 12px;
                    border: 1px solid rgba(239,68,68,0.18);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .db-btn-ghost:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); transform: translateY(-1px); }

                /* STATS BAR */
                .db-stats-bar {
                    max-width: 1200px;
                    margin: 0 auto 36px;
                    padding: 0 32px;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }
                .db-stat-card {
                    background: rgba(10,18,8,0.7);
                    border: 1px solid rgba(132,204,22,0.1);
                    border-radius: 16px;
                    padding: 20px 24px;
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    transition: border-color 0.2s;
                }
                .db-stat-card:hover { border-color: rgba(132,204,22,0.22); }
                .db-stat-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .db-stat-num {
                    font-size: 28px;
                    font-weight: 800;
                    color: white;
                    font-family: var(--font-outfit, 'Outfit', sans-serif);
                    line-height: 1;
                }
                .db-stat-lbl { font-size: 12px; color: rgba(180,200,140,0.45); margin-top: 3px; }

                /* MAIN CONTENT */
                .db-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 32px 60px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .db-section-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .db-section-link {
                    font-size: 12px;
                    font-weight: 600;
                    color: rgba(163,230,53,0.6);
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .db-section-link:hover { color: #a3e635; }

                /* TRIP CARD */
                .db-panel {
                    background: rgba(10,18,8,0.8);
                    border: 1px solid rgba(132,204,22,0.1);
                    border-radius: 20px;
                    padding: 24px;
                    backdrop-filter: blur(16px);
                }
                .db-trip-item {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px;
                    border-radius: 14px;
                    background: rgba(132,204,22,0.03);
                    border: 1px solid rgba(132,204,22,0.07);
                    margin-bottom: 10px;
                    transition: border-color 0.2s, background 0.2s;
                }
                .db-trip-item:hover { background: rgba(132,204,22,0.06); border-color: rgba(132,204,22,0.15); }
                .db-trip-thumb {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    overflow: hidden;
                    flex-shrink: 0;
                    background: rgba(132,204,22,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                .db-status-badge {
                    font-size: 10px;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 100px;
                    border: 1px solid;
                    white-space: nowrap;
                    flex-shrink: 0;
                    letter-spacing: 0.04em;
                }

                /* EMPTY STATE */
                .db-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    text-align: center;
                }
                .db-empty-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 18px;
                    background: rgba(132,204,22,0.07);
                    border: 1px solid rgba(132,204,22,0.14);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                    color: rgba(163,230,53,0.6);
                }

                /* QUICK LINKS */
                .db-quick-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .db-quick-card {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 16px;
                    border-radius: 14px;
                    background: rgba(10,18,8,0.6);
                    border: 1px solid rgba(132,204,22,0.09);
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .db-quick-card:hover { transform: translateY(-2px); background: rgba(10,18,8,0.9); }
                .db-quick-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                /* RESPONSIVE */
                @media (max-width: 900px) {
                    .db-main { grid-template-columns: 1fr; }
                    .db-stats-bar { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 600px) {
                    .db-hero-inner { flex-direction: column; align-items: flex-start; }
                    .db-hero-inner { padding: 0 20px; }
                    .db-name { font-size: 26px; }
                    .db-stats-bar { grid-template-columns: 1fr; padding: 0 20px; }
                    .db-main { padding: 0 20px 48px; }
                    .db-quick-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="db-wrap">
                <div className="db-bg-glow" />
                <div className="db-bg-glow2" />

                {/* ── HERO HEADER ── */}
                <motion.div className="db-hero" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="db-hero-inner">
                        <div className="db-hero-left">
                            {/* Avatar */}
                            <div className="db-avatar">
                                {userAvatar
                                    ? <img src={userAvatar} alt="Profile" />
                                    : <div className="db-avatar-fallback">{initials}</div>
                                }
                                <div className="db-online-dot" />
                            </div>

                            {/* Name & info */}
                            <div>
                                <p className="db-greeting">Welcome back 👋</p>
                                <h1 className="db-name">Hello, <span>{userName}</span></h1>
                                <p className="db-email">{userEmail}</p>
                                <div className="db-verified">
                                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Verified Member
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="db-hero-actions">
                            <Link href="/trips" className="db-btn-primary">
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Book a Trip
                            </Link>

                            {/* Profile dropdown */}
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setProfileOpen(o => !o)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '8px 14px 8px 8px',
                                        background: profileOpen ? 'rgba(163,230,53,0.1)' : 'rgba(10,18,8,0.7)',
                                        border: `1px solid ${profileOpen ? 'rgba(163,230,53,0.3)' : 'rgba(132,204,22,0.15)'}`,
                                        borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    {/* Mini avatar */}
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(163,230,53,0.3)', flexShrink: 0 }}>
                                        {userAvatar
                                            ? <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#a3e635,#d4a843)', fontWeight: 800, fontSize: 12, color: '#050c05', fontFamily: 'var(--font-outfit,Outfit,sans-serif)' }}>{initials}</div>
                                        }
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{userName}</span>
                                    <svg width="14" height="14" fill="none" stroke="rgba(180,200,140,0.5)" strokeWidth="2.5" viewBox="0 0 24 24"
                                        style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {/* Dropdown menu */}
                                {profileOpen && (
                                    <div style={{
                                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                        minWidth: 220,
                                        background: 'rgba(8,15,8,0.97)',
                                        border: '1px solid rgba(132,204,22,0.18)',
                                        borderRadius: 14,
                                        backdropFilter: 'blur(20px)',
                                        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                                        overflow: 'hidden',
                                        zIndex: 100,
                                        animation: 'fadeDown 0.15s ease',
                                    }}>
                                        {/* User info header */}
                                        <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                                            <p style={{ color: 'white', fontWeight: 700, fontSize: 13.5 }}>{userFullName}</p>
                                            <p style={{ color: 'rgba(180,200,140,0.4)', fontSize: 11.5, marginTop: 2 }}>{userEmail}</p>
                                        </div>

                                        {/* Menu items */}
                                        <div style={{ padding: '6px' }}>
                                            <Link href="/dashboard"
                                                onClick={() => setProfileOpen(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: 'rgba(180,200,140,0.7)', fontSize: 13, fontWeight: 600, transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(132,204,22,0.07)'; e.currentTarget.style.color = '#a3e635' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(180,200,140,0.7)' }}
                                            >
                                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                                Dashboard
                                            </Link>
                                            <Link href="/dashboard/profile"
                                                onClick={() => setProfileOpen(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: 'rgba(180,200,140,0.7)', fontSize: 13, fontWeight: 600, transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(132,204,22,0.07)'; e.currentTarget.style.color = '#a3e635' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(180,200,140,0.7)' }}
                                            >
                                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                My Profile
                                            </Link>
                                            <Link href="/trips"
                                                onClick={() => setProfileOpen(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: 'rgba(180,200,140,0.7)', fontSize: 13, fontWeight: 600, transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(132,204,22,0.07)'; e.currentTarget.style.color = '#a3e635' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(180,200,140,0.7)' }}
                                            >
                                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                                                Browse Trips
                                            </Link>
                                        </div>

                                        {/* Sign out */}
                                        <div style={{ padding: '6px', borderTop: '1px solid rgba(132,204,22,0.08)' }}>
                                            <button
                                                onClick={() => { setProfileOpen(false); signOut({ callbackUrl: '/' }) }}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── STATS BAR ── */}
                <motion.div className="db-stats-bar" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="db-stat-card">
                        <div className="db-stat-icon" style={{ background: 'rgba(163,230,53,0.1)' }}>
                            <svg width="20" height="20" fill="none" stroke="#a3e635" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <div>
                            <div className="db-stat-num">{registrations.length}</div>
                            <div className="db-stat-lbl">Trips Registered</div>
                        </div>
                    </div>
                    <div className="db-stat-card">
                        <div className="db-stat-icon" style={{ background: 'rgba(163,230,53,0.1)' }}>
                            <svg width="20" height="20" fill="none" stroke="#a3e635" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="db-stat-num" style={{ color: '#a3e635' }}>{confirmedCount}</div>
                            <div className="db-stat-lbl">Confirmed</div>
                        </div>
                    </div>
                    <div className="db-stat-card">
                        <div className="db-stat-icon" style={{ background: 'rgba(251,191,36,0.1)' }}>
                            <svg width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="1.8" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div>
                            <div className="db-stat-num" style={{ color: '#fbbf24' }}>{pendingCount}</div>
                            <div className="db-stat-lbl">Pending</div>
                        </div>
                    </div>
                </motion.div>

                {/* ── MAIN GRID ── */}
                <div className="db-main">

                    {/* My Trips */}
                    <motion.div className="db-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <div className="db-section-title">
                            My Trips
                            <Link href="/trips" className="db-section-link">Browse all →</Link>
                        </div>

                        {loadingRegs ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} style={{ height: 70, borderRadius: 14, background: 'rgba(132,204,22,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                ))}
                            </div>
                        ) : registrations.length === 0 ? (
                            <div className="db-empty">
                                <div className="db-empty-icon">
                                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                    </svg>
                                </div>
                                <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>No trips booked yet</p>
                                <p style={{ color: 'rgba(180,200,140,0.4)', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>Your registered trips will appear here once you sign up for an adventure.</p>
                                <Link href="/trips" className="db-btn-primary" style={{ fontSize: 13 }}>
                                    Explore Trips
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <div>
                                {registrations.map((reg, i) => {
                                    const st = STATUS_STYLES[reg.status] ?? STATUS_STYLES.pending
                                    return (
                                        <motion.div
                                            key={reg.id}
                                            className="db-trip-item"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.07 }}
                                        >
                                            <div className="db-trip-thumb">
                                                {reg.trip?.imageUrl
                                                    ? <img src={reg.trip.imageUrl} alt={reg.tripName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <svg width="22" height="22" fill="none" stroke="rgba(163,230,53,0.5)" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                                }
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ color: 'white', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.tripName}</p>
                                                {reg.trip?.startDate && (
                                                    <p style={{ color: 'rgba(180,200,140,0.45)', fontSize: 11, marginTop: 2 }}>
                                                        {fmtDate(reg.trip.startDate)} — {fmtDate(reg.trip.endDate)}
                                                    </p>
                                                )}
                                                <p style={{ color: 'rgba(180,200,140,0.3)', fontSize: 11 }}>Registered {fmtDate(reg.createdAt)}</p>
                                            </div>
                                            <span className="db-status-badge" style={{ color: st.color, background: st.bg, borderColor: st.border }}>
                                                {st.label}
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div className="db-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="db-section-title">Explore</div>
                        <div className="db-quick-grid">
                            {QUICK_LINKS.map((item, i) => (
                                <motion.div key={item.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22 + i * 0.06 }}>
                                    <Link
                                        href={item.href}
                                        className="db-quick-card"
                                        style={{ borderColor: `rgba(${item.accent === '#a3e635' ? '132,204,22' : item.accent === '#d4a843' ? '212,168,67' : item.accent === '#38bdf8' ? '56,189,248' : '192,132,252'},0.1)` }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = item.accent + '55'
                                            e.currentTarget.style.boxShadow = `0 4px 20px ${item.accent}18`
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'rgba(132,204,22,0.09)'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    >
                                        <div className="db-quick-icon" style={{ background: item.accent + '14', color: item.accent }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p style={{ color: 'white', fontWeight: 700, fontSize: 13.5 }}>{item.label}</p>
                                            <p style={{ color: 'rgba(180,200,140,0.4)', fontSize: 11.5, marginTop: 2 }}>{item.desc}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Banner */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                            style={{
                                marginTop: 20,
                                borderRadius: 16,
                                padding: '20px 22px',
                                background: 'linear-gradient(135deg, rgba(132,204,22,0.08) 0%, rgba(212,168,67,0.06) 100%)',
                                border: '1px solid rgba(132,204,22,0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 12,
                                flexWrap: 'wrap',
                            }}
                        >
                            <div>
                                <p style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Ready for your next adventure?</p>
                                <p style={{ color: 'rgba(180,200,140,0.45)', fontSize: 12 }}>New trips are added every month. Don't miss out!</p>
                            </div>
                            <Link href="/trips" className="db-btn-primary" style={{ fontSize: 12.5, padding: '9px 18px', whiteSpace: 'nowrap' }}>
                                View All Trips
                            </Link>
                        </motion.div>
                    </motion.div>

                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    )
}
