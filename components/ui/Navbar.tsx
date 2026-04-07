'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Trips', href: '/trips' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Reviews', href: '/blog' },
    { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMobileMenuOpen(false)
        setUserMenuOpen(false)
    }, [pathname])

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    isScrolled
                        ? 'bg-[#050c05]/90 backdrop-blur-2xl border-b border-lime-400/[0.08] shadow-[0_1px_40px_rgba(0,0,0,0.6)]'
                        : 'bg-transparent border-b border-lime-400/[0.05]'
                }`}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="container-main">
                    <div className="flex items-center justify-between h-[80px]">

                        {/* Logo */}
                        <Link href="/" className="flex items-center group">
                            <img src="/logo.png" alt="Safarnama" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-lg text-[15px] font-semibold transition-all duration-200 tracking-wide ${
                                        pathname === link.href
                                            ? 'text-lime-400 bg-lime-400/[0.08]'
                                            : 'text-lime-200/60 hover:text-lime-300 hover:bg-lime-400/[0.05]'
                                    }`}
                                >
                                    {link.name}
                                    {pathname === link.href && (
                                        <motion.div layoutId="nav-indicator" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-lime-400" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {session?.user ? (
                                <div className="relative hidden md:block">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] transition-all"
                                    >
                                        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                                            {session.user.image ? (
                                                <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {session.user.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-white text-sm font-medium">{session.user.name?.split(' ')[0]}</span>
                                        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                className="absolute right-0 top-full mt-2 w-52 bg-[#0a1628] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden z-50"
                                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <div className="px-4 py-3 border-b border-white/[0.07]">
                                                    <p className="text-white text-sm font-semibold truncate">{session.user.name}</p>
                                                    <p className="text-slate-500 text-xs truncate">{session.user.email}</p>
                                                </div>
                                                <div className="p-1.5">
                                                    <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] text-sm transition-all">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                                        Dashboard
                                                    </Link>
                                                    {(session.user as { role?: string })?.role === 'admin' && (
                                                        <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-lime-400 hover:text-lime-300 hover:bg-lime-400/10 text-sm transition-all">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => signOut({ callbackUrl: '/' })}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all"
                                                    >
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
                                    <Link href="/auth/login" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2">
                                        Sign in
                                    </Link>
                                    <Link href="/auth/register" className="hidden md:inline-flex btn-primary text-sm px-5 py-2.5">
                                        Get Started
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </>
                            )}

                            {/* Mobile toggle */}
                            <button
                                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.1] transition-all"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <motion.div animate={mobileMenuOpen ? 'open' : 'closed'} className="w-4 h-3.5 flex flex-col justify-between">
                                    <motion.span variants={{ open: { rotate: 45, y: 6 }, closed: { rotate: 0, y: 0 } }} className="block h-0.5 w-full bg-current rounded-full origin-center transition-all" />
                                    <motion.span variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } }} className="block h-0.5 w-full bg-current rounded-full" />
                                    <motion.span variants={{ open: { rotate: -45, y: -6 }, closed: { rotate: 0, y: 0 } }} className="block h-0.5 w-full bg-current rounded-full origin-center transition-all" />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div className="fixed inset-0 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="absolute inset-0 bg-[#020817]/95 backdrop-blur-2xl" onClick={() => setMobileMenuOpen(false)} />
                        <motion.nav className="absolute top-[80px] left-0 right-0 p-6 flex flex-col gap-2" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                            {NAV_LINKS.map((link, i) => (
                                <motion.div key={link.name} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                    <Link href={link.href} className={`flex items-center justify-between px-5 py-4 rounded-xl text-base font-medium transition-all ${pathname === link.href ? 'bg-[var(--accent)]/10 text-white border border-[var(--accent)]/20' : 'text-slate-300 hover:bg-white/[0.05] hover:text-white border border-transparent'}`}>
                                        {link.name}
                                        <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="h-px bg-white/[0.06] my-2" />
                            {session?.user ? (
                                <div className="flex flex-col gap-2">
                                    <Link href="/dashboard" className="btn-secondary w-full justify-center py-3.5">Dashboard</Link>
                                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full py-3.5 rounded-xl text-red-400 border border-red-500/20 bg-red-500/5 font-semibold text-sm">Sign Out</button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 pt-1">
                                    <Link href="/auth/login" className="btn-secondary w-full justify-center py-3.5">Sign in</Link>
                                    <Link href="/auth/register" className="btn-primary w-full justify-center py-3.5">Get Started</Link>
                                </div>
                            )}
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
