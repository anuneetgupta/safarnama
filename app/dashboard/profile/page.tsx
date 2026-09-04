'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const INTERESTS = [
    { id: 'mountain',  label: 'Mountains',   icon: '⛰️',  color: '#3b82f6' },
    { id: 'beach',     label: 'Beaches',      icon: '🏖️',  color: '#10b981' },
    { id: 'culture',   label: 'Culture',      icon: '🏛️',  color: '#f59e0b' },
    { id: 'adventure', label: 'Adventure',    icon: '⚡',  color: '#ef4444' },
    { id: 'wildlife',  label: 'Wildlife',     icon: '🦁',  color: '#84cc16' },
    { id: 'trekking',  label: 'Trekking',     icon: '🥾',  color: '#8b5cf6' },
    { id: 'camping',   label: 'Camping',      icon: '⛺',  color: '#06b6d4' },
    { id: 'food',      label: 'Food Tours',   icon: '🍛',  color: '#f97316' },
    { id: 'spiritual', label: 'Spiritual',    icon: '🕉️',  color: '#a855f7' },
    { id: 'roadtrip',  label: 'Road Trips',   icon: '🚗',  color: '#eab308' },
    { id: 'snow',      label: 'Snow & Ski',   icon: '❄️',  color: '#60a5fa' },
    { id: 'backpack',  label: 'Backpacking',  icon: '🎒',  color: '#22c55e' },
]

const RANKS = [
    { min: 0,  label: 'Day Tripper',  color: '#64748b', bg: '#f1f5f9', emoji: '🌱' },
    { min: 1,  label: 'Explorer',     color: '#16a34a', bg: '#dcfce7', emoji: '🧭' },
    { min: 3,  label: 'Adventurer',   color: '#d97706', bg: '#fef3c7', emoji: '⛺' },
    { min: 5,  label: 'Wanderer',     color: '#ea580c', bg: '#ffedd5', emoji: '🗺️' },
    { min: 10, label: 'Trailblazer',  color: '#7c3aed', bg: '#ede9fe', emoji: '🏔️' },
    { min: 20, label: 'Nomad Legend', color: '#db2777', bg: '#fce7f3', emoji: '🌍' },
]

function getRank(trips: number) {
    return [...RANKS].reverse().find(r => trips >= r.min) ?? RANKS[0]
}

type Profile = {
    id: string; name: string | null; email: string; image: string | null
    phone: string | null; college: string | null; city: string | null
    instagram: string | null; facebook: string | null
    bio: string | null; interests: string[]; role: string
    createdAt: string; emailVerified: string | null
}

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [profile, setProfile]   = useState<Profile | null>(null)
    const [trips, setTrips]       = useState(0)
    const [loading, setLoading]   = useState(true)
    const [saving, setSaving]     = useState(false)
    const [saved, setSaved]       = useState(false)
    const [error, setError]       = useState('')
    const [tab, setTab]           = useState<'id'|'edit'>('id')
    const saveTimerRef            = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [form, setForm] = useState({
        name: '', phone: '', college: '', city: '',
        instagram: '', facebook: '', bio: '', interests: [] as string[],
    })

    useEffect(() => { if (status === 'unauthenticated') router.replace('/auth/login') }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        Promise.all([
            fetch('/api/user/profile').then(r => r.json()),
            fetch('/api/user/registrations').then(r => r.json()),
        ]).then(([{ user }, { registrations }]) => {
            setProfile(user)
            setTrips(registrations?.length ?? 0)
            setForm({ name: user.name||'', phone: user.phone||'', college: user.college||'', city: user.city||'', instagram: user.instagram||'', facebook: user.facebook||'', bio: user.bio||'', interests: user.interests||[] })
        }).catch(() => setError('Failed to load profile')).finally(() => setLoading(false))
    }, [status])

    const toggleInterest = (id: string) => setForm(f => ({
        ...f, interests: f.interests.includes(id) ? f.interests.filter(i => i !== id) : [...f.interests, id]
    }))

    const handleSave = async () => {
        setSaving(true); setError('')
        try {
            const res = await fetch('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Update failed')
            setProfile(p => p ? { ...p, ...data.user } : p)
            setSaved(true)
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
            saveTimerRef.current = setTimeout(() => setSaved(false), 3000)
        } catch (e: any) { setError(e.message) } finally { setSaving(false) }
    }

    const initials    = (profile?.name || session?.user?.name || 'T').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    const rank        = getRank(trips)
    const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''
    const memberId    = profile?.id?.slice(-8).toUpperCase() ?? '--------'
    const completionFields = ['name','phone','college','city','bio','instagram']
    const completion  = profile ? Math.round(completionFields.filter(f => (profile as any)[f]).length / completionFields.length * 100) : 0

    if (status === 'loading' || loading) return (
        <div style={{ minHeight: 'calc(100vh - 72px)', background: 'linear-gradient(180deg,#bfdbfe 0%,#e0f2fe 60%,#f0f9ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(59,130,246,0.2)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    )
    if (!session) return null

    return (
        <>
        <style>{`
        * { box-sizing: border-box; }

        /* ── FULL PAGE ── */
        .tp-root {
            min-height: calc(100vh - 72px);
            font-family: var(--font-inter, 'Inter', sans-serif);
            overflow-x: hidden;
            position: relative;
            background-image: url('/profile-sky-bg.jpg');
            background-size: cover;
            background-position: center top;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }
        /* Light overlay — white fade at bottom so cards pop */
        .tp-root::after {
            content: '';
            position: fixed; inset: 0;
            background: linear-gradient(
                180deg,
                rgba(255,255,255,0.08) 0%,
                rgba(240,249,255,0.35) 40%,
                rgba(224,242,254,0.65) 75%,
                rgba(248,250,252,0.85) 100%
            );
            pointer-events: none;
            z-index: 0;
        }
        .tp-root > * { position: relative; z-index: 1; }

        /* ── HERO ── */
        .tp-hero {
            padding: 52px 0 44px;
            position: relative;
        }
        .tp-hero-inner {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 28px;
        }

        /* Back link */
        .tp-back {
            display: inline-flex; align-items: center; gap: 6px;
            font-size: 13px; font-weight: 700;
            color: rgba(255,255,255,0.75);
            text-decoration: none;
            margin-bottom: 28px;
            padding: 6px 14px;
            border-radius: 100px;
            background: rgba(255,255,255,0.22);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.35);
            transition: all 0.2s;
            text-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .tp-back:hover { background: rgba(255,255,255,0.35); color: white; }

        /* ── AVATAR ── */
        .tp-avatar-wrap {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-bottom: 14px;
        }
        .tp-avatar {
            width: 116px; height: 116px;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid white;
            box-shadow: 0 8px 32px rgba(59,130,246,0.25), 0 2px 8px rgba(0,0,0,0.15);
        }
        .tp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .tp-avatar-fb {
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
            font-weight: 900; font-size: 38px; color: white;
            font-family: var(--font-outfit, 'Outfit', sans-serif);
        }
        .tp-rank-badge {
            padding: 5px 14px; border-radius: 100px;
            font-size: 11px; font-weight: 800; letter-spacing: 0.05em;
            border: 1.5px solid; display: inline-block;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* ── NAME ── */
        .tp-name {
            font-size: 38px; font-weight: 900; line-height: 1.1;
            font-family: var(--font-outfit, 'Outfit', sans-serif);
            letter-spacing: -0.5px; margin: 0;
            color: white;
            text-shadow: 0 2px 16px rgba(0,60,120,0.35), 0 1px 3px rgba(0,0,0,0.25);
        }
        .tp-name span {
            background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 1px 6px rgba(59,130,246,0.4));
        }
        .tp-sub {
            font-size: 13.5px; color: rgba(255,255,255,0.8);
            margin-top: 6px;
            display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
            text-shadow: 0 1px 6px rgba(0,0,0,0.2);
        }
        .tp-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.5); }
        .tp-verified {
            display: inline-flex; align-items: center; gap: 5px;
            font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
            color: #16a34a;
            background: rgba(255,255,255,0.9);
            border: 1.5px solid rgba(22,163,74,0.35);
            padding: 4px 12px; border-radius: 100px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* ── STATS STRIP ── */
        .tp-stats {
            display: flex; margin-top: 28px;
            background: rgba(255,255,255,0.75);
            border: 1px solid rgba(255,255,255,0.9);
            border-radius: 18px; overflow: hidden;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(59,130,246,0.15), 0 2px 8px rgba(0,0,0,0.08);
        }
        .tp-stat {
            flex: 1; padding: 18px 16px; text-align: center;
            border-right: 1px solid rgba(0,0,0,0.07);
            transition: background 0.2s;
        }
        .tp-stat:last-child { border-right: none; }
        .tp-stat:hover { background: rgba(59,130,246,0.06); }
        .tp-stat-num {
            font-size: 26px; font-weight: 900; line-height: 1;
            font-family: var(--font-outfit, 'Outfit', sans-serif);
        }
        .tp-stat-lbl {
            font-size: 10px; color: #64748b; margin-top: 4px;
            font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em;
        }

        /* ── TABS ── */
        .tp-tabs {
            display: flex; gap: 4px; margin-top: 24px;
            background: rgba(255,255,255,0.7);
            border: 1px solid rgba(255,255,255,0.9);
            border-radius: 14px; padding: 5px; width: fit-content;
            backdrop-filter: blur(16px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .tp-tab {
            padding: 9px 22px; border-radius: 10px;
            border: 1px solid transparent; background: transparent;
            color: #64748b; font-size: 13px; font-weight: 700;
            cursor: pointer; transition: all 0.2s;
            font-family: inherit; letter-spacing: 0.02em;
        }
        .tp-tab.on {
            background: white; color: #1d4ed8;
            border-color: rgba(59,130,246,0.2);
            box-shadow: 0 2px 12px rgba(59,130,246,0.2);
        }
        .tp-tab:not(.on):hover { color: #374151; background: rgba(255,255,255,0.5); }

        /* ── CONTENT AREA ── */
        .tp-content { max-width: 1100px; margin: 0 auto; padding: 32px 28px 80px; }

        /* ── COMPLETION CARD ── */
        .tp-prog {
            background: rgba(255,255,255,0.88);
            border: 1px solid rgba(59,130,246,0.12);
            border-radius: 16px; padding: 20px 24px; margin-bottom: 20px;
            backdrop-filter: blur(16px);
            box-shadow: 0 4px 20px rgba(59,130,246,0.08);
        }
        .tp-prog-bar {
            height: 6px; background: #e2e8f0; border-radius: 100px;
            overflow: hidden; margin: 10px 0 6px;
        }
        .tp-prog-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #06b6d4);
            border-radius: 100px; transition: width 0.7s ease;
        }

        /* ── PASSPORT CARD ── */
        .tp-passport {
            background: rgba(255,255,255,0.95);
            border: 1px solid rgba(59,130,246,0.12);
            border-radius: 22px; overflow: hidden; position: relative;
            box-shadow: 0 16px 60px rgba(59,130,246,0.12), 0 4px 16px rgba(0,0,0,0.06);
            backdrop-filter: blur(20px);
        }
        .tp-passport-stripe {
            height: 54px;
            background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 50%, #06b6d4 100%);
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 24px;
        }
        .tp-pp-logo {
            font-size: 11px; font-weight: 900; letter-spacing: 0.2em;
            color: white; text-transform: uppercase;
            text-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .tp-pp-type {
            font-size: 10px; font-weight: 700;
            color: rgba(255,255,255,0.65); letter-spacing: 0.15em;
        }
        .tp-passport-body {
            padding: 26px 28px 22px;
            display: grid; grid-template-columns: auto 1fr; gap: 26px; align-items: start;
        }
        .tp-pp-avatar {
            width: 96px; height: 96px; border-radius: 12px; overflow: hidden;
            border: 3px solid #e0f2fe; flex-shrink: 0;
            box-shadow: 0 4px 16px rgba(59,130,246,0.2);
        }
        .tp-pp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .tp-pp-avatar-fb {
            width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
            font-weight: 900; font-size: 30px; color: white;
            font-family: var(--font-outfit, 'Outfit', sans-serif);
        }
        .tp-pp-name {
            font-size: 24px; font-weight: 900; color: #0f172a;
            font-family: var(--font-outfit, 'Outfit', sans-serif);
            letter-spacing: 0.04em; text-transform: uppercase; line-height: 1.1;
        }
        .tp-pp-bio {
            font-size: 13px; color: #64748b; margin-top: 6px;
            font-style: italic; line-height: 1.6; max-width: 500px;
        }
        .tp-pp-fields {
            display: grid; grid-template-columns: repeat(3, 1fr);
            gap: 14px; margin-top: 16px;
        }
        .tp-pp-field label {
            font-size: 9px; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8;
        }
        .tp-pp-field p {
            font-size: 13px; color: #0f172a; margin-top: 3px; font-weight: 600;
        }
        .tp-stamps {
            display: flex; flex-wrap: wrap; gap: 8px;
            margin-top: 18px; padding-top: 16px;
            border-top: 1px solid #f1f5f9;
        }
        .tp-stamp {
            padding: 5px 13px; border-radius: 100px;
            font-size: 12px; font-weight: 700;
            border: 1.5px solid; display: flex; align-items: center; gap: 5px;
            transition: transform 0.15s, box-shadow 0.15s;
        }
        .tp-stamp:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .tp-passport-footer {
            padding: 12px 28px;
            background: linear-gradient(90deg, #f0f9ff, #e0f2fe);
            border-top: 1px solid #bae6fd;
            display: flex; justify-content: space-between; align-items: center;
            font-family: 'Courier New', monospace; font-size: 10px;
            color: #94a3b8; letter-spacing: 0.1em;
        }

        /* ── EDIT FORM ── */
        .tp-form {
            background: rgba(255,255,255,0.92);
            border: 1px solid rgba(59,130,246,0.12);
            border-radius: 22px; padding: 28px;
            backdrop-filter: blur(20px);
            box-shadow: 0 16px 60px rgba(59,130,246,0.1);
        }
        .tp-form-section {
            font-size: 10px; font-weight: 800; text-transform: uppercase;
            letter-spacing: 0.14em; color: #3b82f6;
            margin: 24px 0 12px; padding-bottom: 8px;
            border-bottom: 2px solid #eff6ff;
        }
        .tp-form-section:first-child { margin-top: 0; }
        .tp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .tp-field { display: flex; flex-direction: column; gap: 5px; }
        .tp-label { font-size: 12px; font-weight: 600; color: #475569; }
        .tp-input {
            background: #f8fafc; border: 1.5px solid #e2e8f0;
            border-radius: 11px; padding: 11px 14px;
            color: #0f172a; font-size: 13.5px;
            font-family: inherit; outline: none;
            transition: border-color 0.2s, background 0.2s; width: 100%;
        }
        .tp-input::placeholder { color: #cbd5e1; }
        .tp-input:focus { border-color: #3b82f6; background: #eff6ff; }
        .tp-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .tp-textarea { min-height: 88px; resize: vertical; }
        .tp-interests-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
            gap: 9px;
        }
        .tp-int-btn {
            display: flex; align-items: center; gap: 7px;
            padding: 9px 13px; border-radius: 11px;
            border: 1.5px solid #e2e8f0; background: #f8fafc;
            color: #475569; font-size: 12.5px; font-weight: 700;
            cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .tp-int-btn:hover { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
        .tp-int-btn.sel { background: #eff6ff; border-color: #93c5fd; color: #1d4ed8; }
        .tp-save-row {
            display: flex; align-items: center; justify-content: space-between;
            margin-top: 22px; padding-top: 18px;
            border-top: 1px solid #f1f5f9; gap: 12px; flex-wrap: wrap;
        }
        .tp-btn-save {
            display: flex; align-items: center; gap: 8px;
            padding: 12px 28px;
            background: linear-gradient(135deg, #3b82f6, #0ea5e9);
            color: white; font-weight: 800; font-size: 13.5px;
            border-radius: 12px; border: none; cursor: pointer;
            font-family: inherit; transition: all 0.2s;
            box-shadow: 0 4px 18px rgba(59,130,246,0.35);
        }
        .tp-btn-save:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 24px rgba(59,130,246,0.5);
        }
        .tp-btn-save:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
            .tp-hero-inner { padding: 0 16px; }
            .tp-name { font-size: 28px; }
            .tp-stats { flex-direction: column; }
            .tp-stat { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.06); }
            .tp-stat:last-child { border-bottom: none; }
            .tp-passport-body { grid-template-columns: 1fr; gap: 16px; }
            .tp-pp-fields { grid-template-columns: 1fr 1fr; }
            .tp-content { padding: 24px 16px 60px; }
            .tp-grid2 { grid-template-columns: 1fr; }
            .tp-interests-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        `}</style>

        <div className="tp-root">
            {/* ── HERO ── */}
            <div className="tp-hero">
                <div className="tp-hero-inner">
                    {/* Back */}
                    <Link href="/dashboard" className="tp-back">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Dashboard
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Avatar */}
                        <div className="tp-avatar-wrap">
                            <div className="tp-avatar">
                                {profile?.image
                                    ? <img src={profile.image} alt="Profile" />
                                    : <div className="tp-avatar-fb">{initials}</div>}
                            </div>
                            <div className="tp-rank-badge"
                                style={{ color: rank.color, background: rank.bg, borderColor: rank.color + '44' }}>
                                {rank.emoji} {rank.label}
                            </div>
                        </div>

                        {/* Name */}
                        <h1 className="tp-name">
                            {profile?.name
                                ? <><span>{profile.name.split(' ')[0]}</span>{' '}{profile.name.split(' ').slice(1).join(' ')}</>
                                : <span>Your Name</span>}
                        </h1>
                        <div className="tp-sub">
                            {profile?.college && <span>{profile.college}</span>}
                            {profile?.college && profile?.city && <div className="tp-dot"/>}
                            {profile?.city && <span>📍 {profile.city}</span>}
                            <div className="tp-dot"/>
                            <div className="tp-verified">
                                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Verified Traveler
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div className="tp-stats" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className="tp-stat">
                            <div className="tp-stat-num" style={{ color: '#3b82f6' }}>{trips}</div>
                            <div className="tp-stat-lbl">Trips</div>
                        </div>
                        <div className="tp-stat">
                            <div className="tp-stat-num" style={{ color: '#f59e0b' }}>{profile?.interests?.length ?? 0}</div>
                            <div className="tp-stat-lbl">Interests</div>
                        </div>
                        <div className="tp-stat">
                            <div className="tp-stat-num" style={{ color: '#0ea5e9', fontSize: 16, paddingTop: 4 }}>{memberSince || '—'}</div>
                            <div className="tp-stat-lbl">Member Since</div>
                        </div>
                        <div className="tp-stat">
                            <div className="tp-stat-num" style={{ fontSize: 22 }}>{rank.emoji}</div>
                            <div className="tp-stat-lbl" style={{ color: rank.color }}>{rank.label}</div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div className="tp-tabs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                        <button className={`tp-tab ${tab === 'id' ? 'on' : ''}`} onClick={() => setTab('id')}>🪪 Traveler ID</button>
                        <button className={`tp-tab ${tab === 'edit' ? 'on' : ''}`} onClick={() => setTab('edit')}>✏️ Edit Profile</button>
                    </motion.div>
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="tp-content">
                <AnimatePresence mode="wait">

                    {tab === 'id' && (
                        <motion.div key="id" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

                            {/* Completion */}
                            <div className="tp-prog">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ color: '#0f172a', fontWeight: 700, fontSize: 13.5 }}>Profile Strength</p>
                                    <p style={{ fontWeight: 900, fontSize: 16, color: completion >= 80 ? '#16a34a' : completion >= 40 ? '#d97706' : '#dc2626' }}>
                                        {completion}%
                                    </p>
                                </div>
                                <div className="tp-prog-bar">
                                    <div className="tp-prog-fill" style={{ width: `${completion}%` }}/>
                                </div>
                                {completion < 100 && (
                                    <p style={{ fontSize: 12, color: '#64748b' }}>
                                        {completion < 40 ? '👋 Start building your traveler identity!' : '✨ Almost there — a few more details to go!'}
                                        {' '}
                                        <button onClick={() => setTab('edit')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 700, fontSize: 12, padding: 0, fontFamily: 'inherit' }}>
                                            Complete now →
                                        </button>
                                    </p>
                                )}
                            </div>

                            {/* Passport */}
                            <div className="tp-passport">
                                <div className="tp-passport-stripe">
                                    <span className="tp-pp-logo">🌿 Safarnama</span>
                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.12em' }}>TRAVELER IDENTITY DOCUMENT</span>
                                    <span className="tp-pp-type">TYPE · T</span>
                                </div>

                                <div className="tp-passport-body">
                                    <div>
                                        <div className="tp-pp-avatar">
                                            {profile?.image
                                                ? <img src={profile.image} alt=""/>
                                                : <div className="tp-pp-avatar-fb">{initials}</div>}
                                        </div>
                                        <div style={{ textAlign: 'center', marginTop: 8 }}>
                                            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}>PHOTO</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="tp-pp-name">{profile?.name || 'YOUR NAME'}</div>
                                        {profile?.bio && <p className="tp-pp-bio">"{profile.bio}"</p>}

                                        <div className="tp-pp-fields">
                                            <div className="tp-pp-field"><label>College</label><p>{profile?.college || '—'}</p></div>
                                            <div className="tp-pp-field"><label>City</label><p>{profile?.city || '—'}</p></div>
                                            <div className="tp-pp-field"><label>Phone</label><p>{profile?.phone || '—'}</p></div>
                                            <div className="tp-pp-field"><label>Member Since</label><p>{memberSince}</p></div>
                                            <div className="tp-pp-field"><label>Rank</label><p style={{ color: rank.color }}>{rank.emoji} {rank.label}</p></div>
                                            <div className="tp-pp-field"><label>Instagram</label><p style={{ color: '#3b82f6' }}>{profile?.instagram ? '@'+profile.instagram.replace('@','') : '—'}</p></div>
                                        </div>

                                        {(profile?.interests?.length ?? 0) > 0 && (
                                            <div className="tp-stamps">
                                                {(profile?.interests ?? []).map(id => {
                                                    const item = INTERESTS.find(i => i.id === id)
                                                    return item ? (
                                                        <span key={id} className="tp-stamp"
                                                            style={{ color: item.color, borderColor: item.color+'33', background: item.color+'0f' }}>
                                                            {item.icon} {item.label}
                                                        </span>
                                                    ) : null
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="tp-passport-footer">
                                    <span>SAFARNAMA&lt;&lt;{(profile?.name||'').replace(/\s+/g,'<').toUpperCase()||'UNKNOWN'}</span>
                                    <span>ID#{memberId}</span>
                                    <span>INDIA&lt;&lt;SAF{memberId.slice(0,6)}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {tab === 'edit' && (
                        <motion.div key="edit" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <div className="tp-form">
                                <p className="tp-form-section">Basic Info</p>
                                <div className="tp-grid2">
                                    <div className="tp-field"><label className="tp-label">Full Name *</label><input className="tp-input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Your full name"/></div>
                                    <div className="tp-field"><label className="tp-label">Email</label><input className="tp-input" value={profile?.email||''} disabled/></div>
                                    <div className="tp-field"><label className="tp-label">Phone Number</label><input className="tp-input" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} placeholder="+91 99999 99999"/></div>
                                    <div className="tp-field"><label className="tp-label">Home City</label><input className="tp-input" value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))} placeholder="e.g. Delhi, Mumbai"/></div>
                                    <div className="tp-field" style={{ gridColumn:'1/-1' }}><label className="tp-label">College / Institute</label><input className="tp-input" value={form.college} onChange={e => setForm(f=>({...f,college:e.target.value}))} placeholder="e.g. IIT Delhi, Delhi University"/></div>
                                </div>

                                <p className="tp-form-section">About Me</p>
                                <div className="tp-field">
                                    <label className="tp-label">Traveler Bio</label>
                                    <textarea className="tp-input tp-textarea" value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} placeholder="What's your travel vibe? Mountains or beaches? Solo or squad?" maxLength={280}/>
                                    <span style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>{form.bio.length}/280</span>
                                </div>

                                <p className="tp-form-section">Travel Interests</p>
                                <div className="tp-interests-grid">
                                    {INTERESTS.map(item => (
                                        <button key={item.id} type="button"
                                            className={`tp-int-btn ${form.interests.includes(item.id) ? 'sel' : ''}`}
                                            style={form.interests.includes(item.id) ? { borderColor: item.color+'55', color: item.color, background: item.color+'11' } : {}}
                                            onClick={() => toggleInterest(item.id)}>
                                            <span style={{ fontSize: 15 }}>{item.icon}</span>{item.label}
                                        </button>
                                    ))}
                                </div>

                                <p className="tp-form-section">Social Links</p>
                                <div className="tp-grid2">
                                    <div className="tp-field"><label className="tp-label">Instagram</label><input className="tp-input" value={form.instagram} onChange={e => setForm(f=>({...f,instagram:e.target.value}))} placeholder="@yourhandle"/></div>
                                    <div className="tp-field"><label className="tp-label">Facebook</label><input className="tp-input" value={form.facebook} onChange={e => setForm(f=>({...f,facebook:e.target.value}))} placeholder="your.name"/></div>
                                </div>

                                <div className="tp-save-row">
                                    <div>
                                        {error && <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>⚠ {error}</p>}
                                        {saved && <p style={{ color: '#16a34a', fontSize: 13, fontWeight: 700 }}>✓ Profile saved!</p>}
                                    </div>
                                    <button className="tp-btn-save" onClick={handleSave} disabled={saving}>
                                        {saving
                                            ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>Saving...</>
                                            : <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Save Profile</>
                                        }
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
        </>
    )
}
