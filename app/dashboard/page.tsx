'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function DashboardPage() {
    const { data: session, status } = useSession()

    const userName = session?.user?.name?.split(' ')[0] ?? 'Traveler'
    const userFullName = session?.user?.name ?? 'Traveler'
    const userEmail = session?.user?.email ?? ''
    const userAvatar = session?.user?.image ?? null

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#020817] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-8 h-8 animate-spin text-sky-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-slate-400 text-sm">Loading your profile...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[#020817] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">You need to sign in to view your dashboard.</p>
                    <Link href="/auth/login" className="btn-primary px-6 py-3">Sign In</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020817]">
            <div className="absolute inset-0 grid-pattern opacity-50" />

            <div className="container-main relative z-10 pt-10 pb-16">

                {/* Top bar */}
                <motion.div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <p className="text-slate-500 text-sm mb-1">Welcome back 👋</p>
                        <h1 className="text-2xl md:text-3xl font-[var(--font-outfit)] font-extrabold text-white">
                            Hello, <span className="text-gradient-brand">{userName}</span>
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/trips" className="btn-primary text-sm px-5 py-2.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Book a Trip
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="btn-secondary text-sm px-5 py-2.5 text-red-400 border-red-500/20 hover:bg-red-500/10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Profile card */}
                    <motion.div
                        className="glass-card border border-white/[0.08] p-7"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--accent)]/40">
                                    {userAvatar ? (
                                        <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--teal)] flex items-center justify-center text-white font-bold text-2xl">
                                            {userFullName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a1628]" />
                            </div>
                            <h2 className="text-white font-bold text-lg mb-1">{userFullName}</h2>
                            <p className="text-slate-400 text-sm mb-1">{userEmail}</p>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full mt-1">
                                ✓ Verified via Google
                            </span>
                        </div>
                    </motion.div>

                    {/* My Trips placeholder */}
                    <motion.div
                        className="lg:col-span-2 glass-card border border-white/[0.08] p-7"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <h2 className="text-white font-semibold text-base mb-6">My Trips</h2>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                </svg>
                            </div>
                            <p className="text-white font-semibold mb-1">No trips booked yet</p>
                            <p className="text-slate-500 text-sm mb-5">Your booked trips will appear here once confirmed by our team.</p>
                            <Link href="/trips" className="btn-primary text-sm px-6 py-2.5">
                                Browse Trips
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Quick links */}
                    <motion.div
                        className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {[
                            { label: 'Browse Trips', href: '/trips', icon: '✈️', color: 'border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40' },
                            { label: 'Gallery', href: '/gallery', icon: '📸', color: 'border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40' },
                            { label: 'Reviews', href: '/blog', icon: '⭐', color: 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40' },
                            { label: 'Contact Us', href: '/contact', icon: '💬', color: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40' },
                        ].map((item) => (
                            <Link key={item.label} href={item.href} className={`glass-card border p-5 text-center hover:-translate-y-1 transition-all duration-300 ${item.color}`}>
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
