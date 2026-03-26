'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    trip: { destination: string; price: number; status: string } | null
    onClose: () => void
}

export default function TripRegistrationModal({ trip, onClose }: Props) {
    const [step, setStep] = useState(1)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', phone: '', college: '', city: '', gender: '', age: '', message: '',
    })

    if (!trip) return null

    const isComingSoon = trip.status === 'coming_soon'

    const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setLoading(false)
        setSubmitted(true)
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-lg bg-[#0a1628] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl"
                    initial={{ scale: 0.92, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Header */}
                    <div className="relative p-6 border-b border-white/[0.07] bg-gradient-to-r from-sky-500/10 to-teal-500/10">
                        <div className="flex items-start justify-between">
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 inline-block ${
                                    isComingSoon ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                    {isComingSoon ? 'Notify Me' : 'Book Now'}
                                </span>
                                <h2 className="text-white font-extrabold text-xl font-[var(--font-outfit)]">{trip.destination}</h2>
                                {!isComingSoon && trip.price > 0 && (
                                    <p className="text-sky-400 font-bold text-sm mt-0.5">₹{trip.price.toLocaleString()} per person</p>
                                )}
                                {isComingSoon && (
                                    <p className="text-slate-400 text-sm mt-0.5">Be the first to know when this trip opens!</p>
                                )}
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.12] transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Step indicator — only for book now */}
                        {!isComingSoon && !submitted && (
                            <div className="flex items-center gap-2 mt-4">
                                {[1, 2].map(s => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            step >= s ? 'bg-sky-500 text-white' : 'bg-white/[0.08] text-slate-500'
                                        }`}>{s}</div>
                                        {s < 2 && <div className={`h-px w-8 transition-all ${step > s ? 'bg-sky-500' : 'bg-white/[0.08]'}`} />}
                                    </div>
                                ))}
                                <span className="text-slate-500 text-xs ml-1">{step === 1 ? 'Personal Info' : 'Trip Details'}</span>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {submitted ? (
                            <motion.div
                                className="text-center py-8"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">
                                    {isComingSoon ? 'You\'re on the list!' : 'Registration Received!'}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    {isComingSoon
                                        ? `We'll notify you on ${form.phone} as soon as ${trip.destination} opens for booking.`
                                        : `Thanks ${form.name}! Our team will contact you on ${form.phone} within 24 hours to confirm your slot.`
                                    }
                                </p>
                                <a
                                    href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU?mode=gi_t"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary text-sm px-6 py-2.5 inline-flex"
                                >
                                    Join WhatsApp Group
                                </a>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Step 1 — always shown for notify, step 1 for book */}
                                {(isComingSoon || step === 1) && (
                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">Full Name *</label>
                                                <input
                                                    required
                                                    value={form.name}
                                                    onChange={e => update('name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-sky-500/50 transition-all"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">Phone *</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    value={form.phone}
                                                    onChange={e => update('phone', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-sky-500/50 transition-all"
                                                    placeholder="+91 XXXXX XXXXX"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">Email *</label>
                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={e => update('email', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-sky-500/50 transition-all"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">College / University</label>
                                                <input
                                                    value={form.college}
                                                    onChange={e => update('college', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-sky-500/50 transition-all"
                                                    placeholder="e.g. CSJMU"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">City</label>
                                                <input
                                                    value={form.city}
                                                    onChange={e => update('city', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-sky-500/50 transition-all"
                                                    placeholder="Your city"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2 — only for book now */}
                                {!isComingSoon && step === 2 && (
                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">Gender</label>
                                                <select
                                                    value={form.gender}
                                                    onChange={e => update('gender', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/[0.08] rounded-xl text-slate-300 text-sm outline-none focus:border-sky-500/50 transition-all"
                                                >
                                                    <option value="">Select</option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">Age</label>
                                                <input
                                                    type="number"
                                                    min="16"
                                                    max="35"
                                                    value={form.age}
                                                    onChange={e => update('age', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-sky-500/50 transition-all"
                                                    placeholder="Your age"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">Any special requirements?</label>
                                            <textarea
                                                value={form.message}
                                                onChange={e => update('message', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-sky-500/50 transition-all resize-none"
                                                placeholder="Dietary needs, medical info, questions..."
                                            />
                                        </div>
                                        <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
                                            <p className="text-sky-400 text-xs font-semibold mb-1">Payment Info</p>
                                            <p className="text-slate-400 text-xs leading-relaxed">Our team will contact you within 24 hours with payment details. No advance payment required right now.</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    {!isComingSoon && step === 2 && (
                                        <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 justify-center text-sm">
                                            ← Back
                                        </button>
                                    )}
                                    {!isComingSoon && step === 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => { if (form.name && form.phone && form.email) setStep(2) }}
                                            className="btn-primary flex-1 py-3 justify-center text-sm"
                                        >
                                            Next →
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary flex-1 py-3 justify-center text-sm disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            ) : isComingSoon ? 'Notify Me 🔔' : 'Submit Registration ✓'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
