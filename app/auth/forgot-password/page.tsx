'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) { setError('Email is required'); return }
        setLoading(true)
        setError('')
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
        setLoading(false)
        if (res.ok) setSent(true)
        else setError('Something went wrong. Please try again.')
    }

    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4">
            <div className="absolute inset-0 grid-pattern opacity-40" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-sky-500/8 rounded-full blur-[100px]" />

            <motion.div
                className="relative z-10 w-full max-w-[440px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <Link href="/">
                        <img src="/logo.png" alt="Safarnama" className="h-12 w-auto object-contain mx-auto mb-6" />
                    </Link>
                    <h1 className="text-2xl font-[var(--font-outfit)] font-extrabold text-white mb-2">Forgot your password?</h1>
                    <p className="text-slate-400 text-sm">Enter your email and we'll send you a reset link.</p>
                </div>

                <div className="glass-card border border-white/[0.08] p-8">
                    {sent ? (
                        <motion.div className="text-center py-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Check your inbox</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                If an account exists for <span className="text-white font-medium">{email}</span>, you'll receive a reset link shortly.
                            </p>
                            <Link href="/auth/login" className="btn-primary text-sm px-6 py-2.5 inline-flex">
                                Back to Sign In
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError('') }}
                                    className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[15px] placeholder-slate-600 outline-none focus:border-sky-500/50 focus:bg-white/[0.06] transition-all"
                                    placeholder="you@example.com"
                                    autoFocus
                                />
                                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-[15px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : 'Send Reset Link'}
                            </button>
                            <p className="text-center text-slate-500 text-sm">
                                Remember your password?{' '}
                                <Link href="/auth/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">Sign in</Link>
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
