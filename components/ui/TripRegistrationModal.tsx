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
        try {
            await fetch('/api/trip-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, destination: trip.destination }),
            })
            setSubmitted(true)
        } catch {
            // still show success to user
            setSubmitted(true)
        }
        setLoading(false)
    }

    const inp = "w-full px-4 py-3 rounded-xl text-white text-sm placeholder-slate-600 outline-none transition-all"
    const inpStyle = { background: 'rgba(132,204,22,0.05)', border: '1px solid rgba(132,204,22,0.15)' }

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
                <motion.div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
                    style={{ background: '#0a150a', border: '1px solid rgba(132,204,22,0.2)' }}
                    initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 20 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>

                    {/* Header */}
                    <div className="relative p-6 border-b" style={{ borderColor: 'rgba(132,204,22,0.1)', background: 'linear-gradient(to right,rgba(132,204,22,0.08),rgba(212,168,67,0.05))' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 inline-block ${isComingSoon ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-lime-500/20 text-lime-400 border border-lime-500/30'}`}>
                                    {isComingSoon ? 'Notify Me' : 'Book Now'}
                                </span>
                                <h2 className="text-white font-extrabold text-xl">{trip.destination}</h2>
                                {!isComingSoon && trip.price > 0 && <p className="text-lime-400 font-bold text-sm mt-0.5">₹{trip.price.toLocaleString()} per person</p>}
                                {isComingSoon && <p className="text-slate-400 text-sm mt-0.5">Be the first to know when this trip opens!</p>}
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.06)' }}>✕</button>
                        </div>

                        {/* Step indicator */}
                        {!isComingSoon && !submitted && (
                            <div className="flex items-center gap-2 mt-4">
                                {[1, 2].map(s => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                            style={{ background: step >= s ? '#84cc16' : 'rgba(255,255,255,0.08)', color: step >= s ? '#080f08' : '#666' }}>{s}</div>
                                        {s < 2 && <div className="h-px w-8 transition-all" style={{ background: step > s ? '#84cc16' : 'rgba(255,255,255,0.08)' }} />}
                                    </div>
                                ))}
                                <span className="text-slate-500 text-xs ml-1">{step === 1 ? 'Personal Info' : 'Trip Details'}</span>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {submitted ? (
                            <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)' }}>
                                    <svg className="w-8 h-8 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">{isComingSoon ? "You're on the list!" : 'Registration Received!'}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    {isComingSoon
                                        ? `We'll notify you on ${form.phone} as soon as ${trip.destination} opens for booking.`
                                        : `Thanks ${form.name}! Our team will contact you on ${form.phone} within 24 hours to confirm your slot.`}
                                </p>
                                <a href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU?mode=gi_t" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-6 py-2.5 inline-flex">Join WhatsApp Group</a>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {(isComingSoon || step === 1) && (
                                    <motion.div className="space-y-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(132,204,22,0.7)' }}>Full Name *</label>
                                                <input required value={form.name} onChange={e => update('name', e.target.value)} className={inp} style={inpStyle} placeholder="Your name" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(132,204,22,0.7)' }}>Phone *</label>
                                                <input required type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className={inp} style={inpStyle} placeholder="+91 XXXXX XXXXX" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(132,204,22,0.7)' }}>Email *</label>
                                            <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inp} style={inpStyle} placeholder="you@example.com" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(132,204,22,0.7)' }}>College</label>
                                                <input value={form.college} onChange={e => update('college', e.target.value)} className={inp} style={inpStyle} placeholder="e.g. CSJMU" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(132,204,22,0.7)' }}>City</label>
                                                <input value={form.city} onChange={e => update('city', e.target.value)} className={inp} style={inpStyle} placeholder="Your city" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {!isComingSoon && step === 2 && (
                                    <motion.div className="space-y-4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(132,204,22,0.7)' }}>Gender</label>
                                                <select value={form.gender} onChange={e => update('gender', e.target.value)} className={inp} style={{ ...inpStyle, background: '#0a1208' }}>
                                                    <option value="">Select</option>
                                                    <option>Male</option><option>Female</option><option>Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(132,204,22,0.7)' }}>Age</label>
                                                <input type="text" inputMode="numeric" value={form.age} onChange={e => update('age', e.target.value.replace(/[^0-9]/g, ''))} className={inp} style={inpStyle} placeholder="Your age" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(132,204,22,0.7)' }}>Special Requirements</label>
                                            <textarea value={form.message} onChange={e => update('message', e.target.value)} rows={3} className={inp} style={inpStyle} placeholder="Dietary needs, medical info, questions..." />
                                        </div>
                                        <div className="p-4 rounded-xl" style={{ background: 'rgba(132,204,22,0.05)', border: '1px solid rgba(132,204,22,0.15)' }}>
                                            <p className="text-lime-400 text-xs font-semibold mb-1">Payment Info</p>
                                            <p className="text-slate-400 text-xs leading-relaxed">Our team will contact you within 24 hours with payment details. No advance payment required right now.</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    {!isComingSoon && step === 2 && (
                                        <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 justify-center text-sm">← Back</button>
                                    )}
                                    {!isComingSoon && step === 1 ? (
                                        <button type="button" onClick={() => { if (form.name && form.phone && form.email) setStep(2) }}
                                            className="btn-primary flex-1 py-3 justify-center text-sm">Next →</button>
                                    ) : (
                                        <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 justify-center text-sm disabled:opacity-50">
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
