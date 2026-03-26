'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const UPCOMING_TRIP = {
    destination: 'Banaras Vibes',
    date: '15 Mar – 18 Mar 2026',
    daysLeft: 12,
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
    groupSize: 30,
    yourGroup: 4,
    price: 8999,
}

const STATS = [
    { label: 'Trips Taken', value: '4', icon: '✈️', color: 'text-[var(--accent-light)]', bg: 'bg-[var(--accent)]/10 border-[var(--accent)]/20' },
    { label: 'Cities Visited', value: '7', icon: '📍', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Friends Made', value: '38', icon: '👥', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Memories', value: '∞', icon: '📸', color: 'text-[var(--orange)]', bg: 'bg-[var(--orange)]/10 border-[var(--orange)]/20' },
]

const ACTIVITIES = [
    { text: 'Booked "Banaras Vibes"', time: '2 days ago', icon: '🎉', color: 'bg-emerald-500/10 border-emerald-500/20' },
    { text: 'Profile setup completed', time: '1 week ago', icon: '✅', color: 'bg-[var(--accent)]/10 border-[var(--accent)]/20' },
    { text: 'Joined Manali waitlist', time: '2 weeks ago', icon: '⏳', color: 'bg-amber-500/10 border-amber-500/20' },
    { text: 'Completed Goa trip', time: '1 month ago', icon: '🏖️', color: 'bg-purple-500/10 border-purple-500/20' },
]

const SUGGESTED = [
    { name: 'Rishikesh Rush', date: 'Jun 5–8', price: 9999, slots: 2, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400' },
    { name: 'Jaipur Royale', date: 'Jul 12–15', price: 10999, slots: 13, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400' },
]

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'profile'>('overview')
    const { data: session } = useSession()

    const userName = session?.user?.name?.split(' ')[0] ?? 'Traveler'
    const userFullName = session?.user?.name ?? 'Traveler'
    const userEmail = session?.user?.email ?? ''
    const userAvatar = session?.user?.image ?? null

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
                        <p className="text-slate-500 text-sm mb-1">Good morning 👋</p>
                        <h1 className="text-2xl md:text-3xl font-[var(--font-outfit)] font-extrabold text-white">
                            Welcome back, <span className="text-gradient-brand">{userName}</span>
                        </h1>
                    </div>
                    <Link href="/trips" className="btn-primary text-sm px-5 py-2.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Book New Trip
                    </Link>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
                    {(['overview', 'trips', 'profile'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                                activeTab === tab
                                    ? 'bg-white/[0.08] text-white'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className={`glass-card border p-5 ${s.bg}`}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                        >
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <div className={`text-2xl font-extrabold font-[var(--font-outfit)] ${s.color}`}>{s.value}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main — 2/3 */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Upcoming trip */}
                        <motion.div
                            className="glass-card border border-white/[0.08] overflow-hidden"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                                <h2 className="text-white font-semibold text-sm">Upcoming Trip</h2>
                                <span className="text-[var(--accent-light)] text-xs font-medium bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2.5 py-1 rounded-lg">
                                    {UPCOMING_TRIP.daysLeft} days away
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                                    <img src={UPCOMING_TRIP.image} alt={UPCOMING_TRIP.destination} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1628]/60" />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                            {UPCOMING_TRIP.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-white font-bold text-xl mb-1">{UPCOMING_TRIP.destination}</h3>
                                        <p className="text-[var(--accent-light)] text-sm mb-4">{UPCOMING_TRIP.date}</p>
                                        <div className="grid grid-cols-2 gap-3 mb-5">
                                            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                                                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Group Size</p>
                                                <p className="text-white font-bold">{UPCOMING_TRIP.groupSize} travelers</p>
                                            </div>
                                            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                                                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Your Squad</p>
                                                <p className="text-white font-bold">{UPCOMING_TRIP.yourGroup} friends</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn-secondary text-sm py-2.5 w-full justify-center">
                                        View Trip Details
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Suggested trips */}
                        <motion.div
                            className="glass-card border border-white/[0.08]"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                                <h2 className="text-white font-semibold text-sm">Suggested for You</h2>
                                <Link href="/trips" className="text-[var(--accent-light)] text-xs hover:text-white transition-colors">View all →</Link>
                            </div>
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SUGGESTED.map((trip, i) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors cursor-pointer group">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={trip.image} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{trip.name}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">{trip.date}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-[var(--accent-light)] text-xs font-bold">₹{trip.price.toLocaleString()}</p>
                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${trip.slots <= 5 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                    {trip.slots} left
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar — 1/3 */}
                    <div className="space-y-5">
                        {/* Profile card */}
                        <motion.div
                            className="glass-card border border-white/[0.08] p-5"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--accent)]/40">
                                        {userAvatar ? (
                                            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--teal)] flex items-center justify-center text-white font-bold text-lg">
                                                {userFullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a1628]" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{userFullName}</p>
                                    <p className="text-slate-500 text-xs">{userEmail}</p>
                                </div>
                                <div className="ml-auto">
                                    <span className="text-[10px] font-bold text-[var(--accent-light)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2 py-1 rounded-lg">VIP</span>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                {[
                                    { label: 'Member since', value: 'Jan 2026' },
                                    { label: 'Total spent', value: '₹42,997' },
                                    { label: 'Loyalty points', value: '1,240 pts' },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">{item.label}</span>
                                        <span className="text-white font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-secondary w-full text-xs py-2.5 mt-4 justify-center">
                                Edit Profile
                            </button>
                        </motion.div>

                        {/* Activity feed */}
                        <motion.div
                            className="glass-card border border-white/[0.08] p-5"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <h3 className="text-white font-semibold text-sm mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {ACTIVITIES.map((a, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm flex-shrink-0 ${a.color}`}>
                                            {a.icon}
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-medium leading-snug">{a.text}</p>
                                            <p className="text-slate-600 text-[10px] mt-0.5">{a.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
