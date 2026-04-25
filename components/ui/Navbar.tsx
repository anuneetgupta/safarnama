'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const NAV_LINKS = [
    { name: 'Home',    href: '/' },
    { name: 'Trips',   href: '/trips' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Reviews', href: '/blog' },
    { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled]   = useState(false)
    const [menuOpen, setMenuOpen]   = useState(false)
    const [dropOpen, setDropOpen]   = useState(false)
    const pathname                  = usePathname()
    const { data: session }         = useSession()
    const isAdmin = (session?.user as { role?: string })?.role === 'admin'

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', fn, { passive: true })
        return () => window.removeEventListener('scroll', fn)
    }, [])

    useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [pathname])

    return (
        <>
            {/* ─── Full-Width Professional Navbar ─── */}
            <motion.header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    height: 76,
                    background: scrolled
                        ? 'rgba(6, 12, 5, 0.98)'
                        : 'rgba(6, 12, 5, 0.85)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderBottom: scrolled ? '1px solid rgba(163,230,53,0.15)' : '1px solid rgba(163,230,53,0.06)',
                    boxShadow: scrolled
                        ? '0 8px 32px rgba(0,0,0,0.5)'
                        : 'none',
                    transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                }}
                initial={{ y: -90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
                <div style={{ height: '100%', padding: '0 24px' }} className="max-w-[1536px] mx-auto w-full flex items-center justify-between">
                    
                    {/* ── Left Side (Logo) ── */}
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: 220 }}>
                        <Link
                            href="/"
                            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
                        >
                            {/* circular logo */}
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                                border: '2px solid rgba(163,230,53,0.22)',
                                background: '#0d160b',
                            }}>
                                <img
                                    src="/logo.png"
                                    alt="Safarnama"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <span style={{
                                fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
                                fontSize: 17,
                                fontWeight: 800,
                                color: '#f0f4e8',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                            }}>
                                Safarnama
                            </span>
                        </Link>
                    </div>

                    {/* ── Center Desktop Nav links ── */}
                    <nav style={{ gap: 8 }} className="hidden md:flex items-center justify-center flex-1">
                        {NAV_LINKS.map(link => {
                            const active = pathname === link.href
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    style={{
                                        position: 'relative',
                                        padding: '8px 18px',
                                        fontSize: 15,
                                        fontWeight: active ? 600 : 500,
                                        color: active ? '#f0f4e8' : 'rgba(200,220,155,0.7)',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s ease',
                                        borderRadius: 6,
                                    }}
                                    onMouseEnter={e => {
                                        if (!active) (e.currentTarget as HTMLElement).style.color = '#f0f4e8'
                                    }}
                                    onMouseLeave={e => {
                                        if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(200,220,155,0.7)'
                                    }}
                                >
                                    {link.name}
                                    {/* lime underline for active */}
                                    {active && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '60%',
                                                height: 3,
                                                borderRadius: '3px 3px 0 0',
                                                background: '#a3e635',
                                                display: 'block',
                                            }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* ── Right Actions ── */}
                    <div style={{ gap: 14, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 220 }} className="hidden md:flex shrink-0">
                        {session?.user ? (
                            /* ── Logged-in user dropdown ── */
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setDropOpen(!dropOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '6px 16px 6px 8px',
                                        borderRadius: 9999,
                                        background: 'rgba(163,230,53,0.08)',
                                        border: '1px solid rgba(163,230,53,0.2)',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.14)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.08)')}
                                >
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%', overflow: 'hidden',
                                        background: 'linear-gradient(135deg,#84cc16,#d4a843)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        {session.user.image
                                            ? <img src={session.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{session.user.name?.charAt(0).toUpperCase()}</span>
                                        }
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f4e8' }}>{session.user.name?.split(' ')[0]}</span>
                                    <svg
                                        style={{ color: 'rgba(200,220,155,0.6)', transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                        width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {dropOpen && (
                                        <motion.div
                                            style={{
                                                position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                                                width: 220, borderRadius: 14, overflow: 'hidden',
                                                background: '#0a1308',
                                                border: '1px solid rgba(163,230,53,0.15)',
                                                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                                            }}
                                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(163,230,53,0.1)' }}>
                                                <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f4e8', margin: 0 }}>{session.user.name}</p>
                                                <p style={{ fontSize: 12, marginTop: 4, color: 'rgba(180,200,140,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.email}</p>
                                            </div>
                                            <div style={{ padding: '6px' }}>
                                                <DropItem href="/dashboard" icon="🏠">Dashboard</DropItem>
                                                {isAdmin && <DropItem href="/admin" icon="🛡" color="#a3e635">Admin Panel</DropItem>}
                                                <button
                                                    onClick={() => signOut({ callbackUrl: '/' })}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 10,
                                                        padding: '10px 14px', borderRadius: 8, width: '100%',
                                                        fontSize: 14, fontWeight: 500, color: '#f87171',
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        textAlign: 'left', transition: 'background 0.15s',
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                                >
                                                    <span>🚪</span> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                {/* Login — text+icon style, no border */}
                                <Link
                                    href="/auth/login"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '8px 12px',
                                        fontSize: 15, fontWeight: 500,
                                        color: 'rgba(200,220,155,0.75)',
                                        textDecoration: 'none',
                                        borderRadius: 8,
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f0f4e8'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(200,220,155,0.75)'}
                                >
                                    {/* Search / person icon */}
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    Login
                                </Link>

                                {/* Sign Up — outline pill button */}
                                <Link
                                    href="/auth/register"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '10px 22px',
                                        fontSize: 15, fontWeight: 600,
                                        color: '#c8e87a',
                                        textDecoration: 'none',
                                        borderRadius: 9999,
                                        border: '1.5px solid rgba(163,230,53,0.5)',
                                        background: 'transparent',
                                        transition: 'all 0.2s ease',
                                        letterSpacing: '0.01em',
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLElement
                                        el.style.background = 'rgba(163,230,53,0.1)'
                                        el.style.borderColor = 'rgba(163,230,53,0.8)'
                                        el.style.color = '#d4f570'
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLElement
                                        el.style.background = 'transparent'
                                        el.style.borderColor = 'rgba(163,230,53,0.5)'
                                        el.style.color = '#c8e87a'
                                    }}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ── Mobile hamburger ── */}
                    <button
                        className="md:hidden flex items-center justify-center shrink-0"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            width: 44, height: 44, borderRadius: '50%',
                            background: 'rgba(163,230,53,0.06)',
                            border: '1px solid rgba(163,230,53,0.15)',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ width: 20, display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <motion.span animate={menuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                                style={{ display: 'block', height: 2, width: '100%', borderRadius: 2, background: '#f0f4e8' }} />
                            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                                style={{ display: 'block', height: 2, width: '100%', borderRadius: 2, background: '#f0f4e8' }} />
                            <motion.span animate={menuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                                style={{ display: 'block', height: 2, width: '100%', borderRadius: 2, background: '#f0f4e8' }} />
                        </div>
                    </button>
                </div>
            </motion.header>

            {/* ── Mobile full-screen menu ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <div
                            style={{ position: 'absolute', inset: 0, background: 'rgba(6,12,5,0.98)', backdropFilter: 'blur(20px)' }}
                            onClick={() => setMenuOpen(false)}
                        />
                        <motion.nav
                            style={{ position: 'absolute', top: 100, left: 0, right: 0, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}
                            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {NAV_LINKS.map((link, i) => (
                                <motion.div key={link.name} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                    <Link
                                        href={link.href}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '16px 20px', borderRadius: 16,
                                            fontSize: 17, fontWeight: 500,
                                            color: pathname === link.href ? '#f0f4e8' : 'rgba(200,220,155,0.7)',
                                            background: pathname === link.href ? 'rgba(163,230,53,0.08)' : 'transparent',
                                            border: `1px solid ${pathname === link.href ? 'rgba(163,230,53,0.2)' : 'transparent'}`,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {link.name}
                                        <svg width="18" height="18" style={{ opacity: 0.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            ))}

                            <div style={{ height: 1, background: 'rgba(163,230,53,0.1)', margin: '12px 0' }} />

                            {session?.user ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <Link href="/dashboard" style={mobileBtn}>Dashboard</Link>
                                    {isAdmin && <Link href="/admin" style={{ ...mobileBtn, color: '#a3e635', borderColor: 'rgba(163,230,53,0.3)' }}>Admin Panel</Link>}
                                    <button onClick={() => signOut({ callbackUrl: '/' })} style={{ ...mobileBtn, color: '#f87171', borderColor: 'rgba(239,68,68,0.25)', background: 'none', cursor: 'pointer' }}>
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
                                    <Link href="/auth/login"
                                        style={{ ...mobileBtn, color: 'rgba(200,220,155,0.8)', borderColor: 'rgba(163,230,53,0.25)', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                                        Login
                                    </Link>
                                    <Link href="/auth/register"
                                        style={{ ...mobileBtn, color: '#0a1308', background: '#a3e635', borderColor: '#a3e635', fontWeight: 700, textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function DropItem({ href, icon, color = 'rgba(200,220,155,0.8)', children }: { href: string; icon: string; color?: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 8,
                fontSize: 14, fontWeight: 500, color,
                textDecoration: 'none', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(163,230,53,0.08)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
        >
            <span>{icon}</span>{children}
        </Link>
    )
}

const mobileBtn: React.CSSProperties = {
    padding: '14px 20px',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0f4e8',
    background: 'rgba(255,255,255,0.05)',
    width: '100%',
    textAlign: 'center' as const,
}
