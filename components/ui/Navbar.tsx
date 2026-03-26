'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

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
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    isScrolled
                        ? 'bg-[#020817]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.4)]'
                        : 'bg-[#0a1628] border-b border-white/[0.06]'
                }`}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="container-main">
                    <div className="flex items-center justify-between h-[80px]">

                        {/* Logo */}
                        <Link href="/" className="flex items-center group">
                            <img
                                src="/logo.png"
                                alt="Safarnama"
                                className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-12 py-3 rounded-lg text-[16px] font-semibold transition-all duration-200 tracking-widest ${
                                        pathname === link.href
                                            ? 'text-white bg-white/[0.08]'
                                            : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                                    }`}
                                >
                                    {link.name}
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/auth/login"
                                className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/auth/register"
                                className="hidden md:inline-flex btn-primary text-sm px-5 py-2.5"
                            >
                                Get Started
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>

                            {/* Mobile toggle */}
                            <button
                                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.1] transition-all"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <motion.div
                                    animate={mobileMenuOpen ? 'open' : 'closed'}
                                    className="w-4 h-3.5 flex flex-col justify-between"
                                >
                                    <motion.span
                                        variants={{ open: { rotate: 45, y: 6 }, closed: { rotate: 0, y: 0 } }}
                                        className="block h-0.5 w-full bg-current rounded-full origin-center transition-all"
                                    />
                                    <motion.span
                                        variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } }}
                                        className="block h-0.5 w-full bg-current rounded-full"
                                    />
                                    <motion.span
                                        variants={{ open: { rotate: -45, y: -6 }, closed: { rotate: 0, y: 0 } }}
                                        className="block h-0.5 w-full bg-current rounded-full origin-center transition-all"
                                    />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-[#020817]/95 backdrop-blur-2xl" onClick={() => setMobileMenuOpen(false)} />
                        <motion.nav
                            className="absolute top-[80px] left-0 right-0 p-6 flex flex-col gap-2"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {NAV_LINKS.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={`flex items-center justify-between px-5 py-4 rounded-xl text-base font-medium transition-all ${
                                            pathname === link.href
                                                ? 'bg-[var(--accent)]/10 text-white border border-[var(--accent)]/20'
                                                : 'text-slate-300 hover:bg-white/[0.05] hover:text-white border border-transparent'
                                        }`}
                                    >
                                        {link.name}
                                        <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="h-px bg-white/[0.06] my-2" />
                            <div className="flex flex-col gap-3 pt-1">
                                <Link href="/auth/login" className="btn-secondary w-full justify-center py-3.5">Sign in</Link>
                                <Link href="/auth/register" className="btn-primary w-full justify-center py-3.5">
                                    Get Started
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
