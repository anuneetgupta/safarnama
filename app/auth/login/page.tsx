'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newErrors = { email: '', password: '' }
        if (!email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email'
        if (!password.trim()) newErrors.password = 'Password is required'
        else if (password.length < 6) newErrors.password = 'Minimum 6 characters'
        setErrors(newErrors)
        if (!newErrors.email && !newErrors.password) {
            setLoading(true)
            await new Promise(r => setTimeout(r, 800))
            router.push('/dashboard')
        }
    }

    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: '/dashboard' })
    }

    return (
        <div className="min-h-screen bg-[#020817] flex">
            
            {/* Left Side — Animated Panel */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col bg-[#020817]">
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px]" />
                <div className="relative z-10 flex flex-col h-full p-12 justify-between">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Link href="/"><img src="/logo.png" alt="Safarnama" className="h-12 w-auto object-contain" /></Link>
                    </motion.div>
                    <div className="flex flex-col gap-8">
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-full mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                India&apos;s #1 Student Travel Platform
                            </div>
                            <h2 className="text-5xl font-[var(--font-outfit)] font-extrabold text-white leading-[1.1] tracking-tight mb-3">
                                Your Journey<br />
                                <span className="bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">Starts Here</span>
                            </h2>
                            <p className="text-slate-300 text-base leading-relaxed max-w-[380px]">
                                Curated group trips for students across India. Budget-friendly, safe, and unforgettable.
                            </p>
                        </motion.div>
                        <motion.div className="flex gap-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            {[{ value: '12K+', label: 'Travelers' }, { value: '80+', label: 'Destinations' }, { value: '4.9★', label: 'Rating' }].map(s => (
                                <div key={s.label} className="text-center">
                                    <p className="text-2xl font-extrabold text-white font-[var(--font-outfit)]">{s.value}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                        <motion.div className="glass-card border border-white/[0.1] p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                            <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">&ldquo;Best trip of my life! Safarnama made everything so easy. The Ganga Aarti was unforgettable.&rdquo;</p>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">R</div>
                                <div>
                                    <p className="text-white text-xs font-semibold">Riya Sharma</p>
                                    <p className="text-slate-500 text-[10px]">IIT Delhi · Banaras Trip</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div className="flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                        {['IIT Students', 'DU Students', 'BITS Students', 'CSJMU Kanpur'].map(b => (
                            <div key={b} className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-full">
                                <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                {b}
                            </div>
                        ))}
                    </motion.div>
                </div>
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#020817] to-transparent pointer-events-none" />
            </div>

            {/* Right Side — Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    className="w-full max-w-[460px]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Mobile Logo */}
                    <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
                            </svg>
                        </div>
                        <span className="text-white font-bold text-lg">SAFARNAMA</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-[var(--font-outfit)] font-extrabold text-white mb-2">
                            Welcome back
                        </h1>
                        <p className="text-slate-400 text-[15px]">
                            New to Safarnama?{' '}
                            <Link href="/auth/register" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3 mb-8">
                        {[
                            {
                                provider: 'google',
                                label: 'Continue with Google',
                                icon: (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                ),
                                bg: 'bg-white hover:bg-gray-50',
                                text: 'text-gray-700',
                            },
                            {
                                provider: 'facebook',
                                label: 'Continue with Facebook',
                                icon: (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                ),
                                bg: 'bg-[#1877F2] hover:bg-[#166fe5]',
                                text: 'text-white',
                            },
                            {
                                provider: 'twitter',
                                label: 'Continue with X',
                                icon: (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                ),
                                bg: 'bg-black hover:bg-gray-900',
                                text: 'text-white',
                            },
                        ].map(({ provider, label, icon, bg, text }) => (
                            <button
                                key={provider}
                                type="button"
                                onClick={() => handleSocialLogin(provider)}
                                className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-[15px] transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${bg} ${text}`}
                            >
                                {icon}
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/[0.08]" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#020817] px-4 text-xs text-slate-500 uppercase tracking-wider">Or with email</span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }) }}
                                className={`w-full px-4 py-3.5 bg-white/[0.04] border rounded-xl text-white text-[15px] placeholder-slate-600 outline-none transition-all ${
                                    errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-sky-500/50 focus:bg-white/[0.06]'
                                }`}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-slate-300 text-sm font-medium">Password</label>
                                <a href="#" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">Forgot?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }) }}
                                    className={`w-full px-4 py-3.5 pr-12 bg-white/[0.04] border rounded-xl text-white text-[15px] placeholder-slate-600 outline-none transition-all ${
                                        errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-sky-500/50 focus:bg-white/[0.06]'
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-2">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-[15px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-xs mt-8 leading-relaxed">
                        By continuing, you agree to Safarnama&apos;s{' '}
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
