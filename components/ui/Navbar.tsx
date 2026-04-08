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
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropOpen, setDropOpen] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()
    const isAdmin = (session?.user as { role?: string })?.role === 'admin'

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 24)
        window.addEventListener('scroll', fn, { passive: true })
        return () => window.removeEventListener('scroll', fn)
    }, [])

    useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [pathname])

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-50"
                style={{
                    height: '72px',
                    background: scrolled ? 'rgba(8,15,8,0.92)' : 'rgba(8,15,8,0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${scrolled ? 'rgba(132,204,22,0.10)' : 'rgba(132,204,22,0.06)'}`,
                    boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
                    transition: 'all 0.3s ease',
                }}
                initial={{ y: -72, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="container-main h-full flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center flex-shrink-0">
                        <img src="/logo.png" alt="Safarnama" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
                    </Link>

                    {/* Desktop Nav — centered */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(link => (
                            <Link key={link.name} href={link.href}
                                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    color: pathname === link.href ? '#f0f4e8' : 'rgba(200,220,160,0.65)',
                                    background: pathname === link.href ? 'rgba(132,204,22,0.08)' : 'transparent',
                                }}
                                onMouseEnter={e => { if (pathname !== link.href) (e.currentTarget as HTMLElement).style.color = '#f0f4e8' }}
                                onMouseLeave={e => { if (pathname !== link.href) (e.currentTarget as HTMLElement).style.color = 'rgba(200,220,160,0.65)' }}
                            >
                                {link.name}
                                {pathname === link.href && (
                                    <motion.div layoutId="nav-dot"
                                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                        style={{ background: '#a3e635' }} />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {session?.user ? (
                            <div className="relative">
                                <button onClick={() => setDropOpen(!dropOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                                    style={{ background: 'rgba(132,204,22,0.06)', border: '1px solid rgba(132,204,22,0.12)' }}>
                                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #84cc16, #d4a843)' }}>
                                        {session.user.image
                                            ? <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                            : <span className="text-xs font-bold text-black">{session.user.name?.charAt(0).toUpperCase()}</span>
                                        }
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: '#f0f4e8' }}>
                                        {session.user.name?.split(' ')[0]}
                                    </span>
                                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                                        style={{ color: 'rgba(200,220,160,0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {dropOpen && (
                                        <motion.div
                                            className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden"
                                            style={{ background: '#0d150b', border: '1px solid rgba(132,204,22,0.12)', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}
                                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                                                <p className="text-sm font-semibold" style={{ color: '#f0f4e8' }}>{session.user.name}</p>
                                                <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(180,200,140,0.5)' }}>{session.user.email}</p>
                                            </div>
                                            <div className="p-1.5 flex flex-col gap-0.5">
                                                <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                                                    style={{ color: 'rgba(200,220,160,0.8)' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(132,204,22,0.06)'; (e.currentTarget as HTMLElement).style.color = '#f0f4e8' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(200,220,160,0.8)' }}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                                    Dashboard
                                                </Link>
                                                {isAdmin && (
                                                    <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                                                        style={{ color: '#a3e635' }}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(132,204,22,0.08)' }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <button onClick={() => signOut({ callbackUrl: '/' })}
                                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-all duration-200"
                                                    style={{ color: '#f87171' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link href="/auth/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
                                    style={{ color: 'rgba(200,220,160,0.7)' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f0f4e8'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(200,220,160,0.7)'}>
                                    Sign in
                                </Link>
                                <Link href="/auth/register" className="btn btn-primary btn-sm">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
                        style={{ background: 'rgba(132,204,22,0.06)', border: '1px solid rgba(132,204,22,0.10)' }}
                        onClick={() => setMenuOpen(!menuOpen)}>
                        <div className="w-5 flex flex-col gap-1.5">
                            <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block h-0.5 w-full rounded-full" style={{ background: '#f0f4e8' }} />
                            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-full rounded-full" style={{ background: '#f0f4e8' }} />
                            <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block h-0.5 w-full rounded-full" style={{ background: '#f0f4e8' }} />
                        </div>
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="absolute inset-0" style={{ background: 'rgba(8,15,8,0.96)', backdropFilter: 'blur(20px)' }}
                            onClick={() => setMenuOpen(false)} />
                        <motion.nav className="absolute top-[72px] left-0 right-0 p-6 flex flex-col gap-2"
                            initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
                            transition={{ duration: 0.2 }}>
                            {NAV_LINKS.map((link, i) => (
                                <motion.div key={link.name} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                    <Link href={link.href} className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200"
                                        style={{
                                            background: pathname === link.href ? 'rgba(132,204,22,0.08)' : 'transparent',
                                            border: `1px solid ${pathname === link.href ? 'rgba(132,204,22,0.20)' : 'transparent'}`,
                                            color: pathname === link.href ? '#f0f4e8' : 'rgba(200,220,160,0.7)',
                                        }}>
                                        {link.name}
                                        <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="h-px my-2" style={{ background: 'rgba(132,204,22,0.08)' }} />
                            {session?.user ? (
                                <div className="flex flex-col gap-2">
                                    <Link href="/dashboard" className="btn btn-secondary w-full justify-center">Dashboard</Link>
                                    {isAdmin && <Link href="/admin" className="btn btn-secondary w-full justify-center" style={{ color: '#a3e635', borderColor: 'rgba(132,204,22,0.3)' }}>Admin Panel</Link>}
                                    <button onClick={() => signOut({ callbackUrl: '/' })} className="btn w-full justify-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>Sign Out</button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link href="/auth/login" className="btn btn-secondary w-full justify-center">Sign in</Link>
                                    <Link href="/auth/register" className="btn btn-primary w-full justify-center">Get Started</Link>
                                </div>
                            )}
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
