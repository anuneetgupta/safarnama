'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    trip: { destination: string; price: number; status: string } | null
    onClose: () => void
}

const FIELD_STYLE: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#f1f5f9',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(163,230,53,0.12)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
}

function FocusInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    const [focused, setFocused] = useState(false)
    return (
        <input
            {...props}
            style={{
                ...FIELD_STYLE,
                borderColor: focused ? 'rgba(163,230,53,0.5)' : 'rgba(163,230,53,0.12)',
                boxShadow: focused ? '0 0 0 3px rgba(163,230,53,0.08)' : 'none',
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    )
}

function FocusSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    const [focused, setFocused] = useState(false)
    return (
        <select
            {...props}
            style={{
                ...FIELD_STYLE,
                background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                borderColor: focused ? 'rgba(163,230,53,0.5)' : 'rgba(163,230,53,0.12)',
                boxShadow: focused ? '0 0 0 3px rgba(163,230,53,0.08)' : 'none',
                cursor: 'pointer',
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            {children}
        </select>
    )
}

function FocusTextarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const [focused, setFocused] = useState(false)
    return (
        <textarea
            {...props}
            style={{
                ...FIELD_STYLE,
                resize: 'vertical',
                minHeight: '80px',
                borderColor: focused ? 'rgba(163,230,53,0.5)' : 'rgba(163,230,53,0.12)',
                boxShadow: focused ? '0 0 0 3px rgba(163,230,53,0.08)' : 'none',
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    )
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'rgba(163,230,53,0.65)',
            marginBottom: '6px',
        }}>
            {children}
        </label>
    )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <Label>{label}</Label>
            {children}
        </div>
    )
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
            setSubmitted(true)
        }
        setLoading(false)
    }

    return (
        <AnimatePresence>
            <motion.div
                style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                {/* Overlay */}
                <div
                    onClick={onClose}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
                />

                {/* Modal */}
                <motion.div
                    style={{
                        position: 'relative', width: '100%', maxWidth: '480px',
                        background: 'linear-gradient(145deg, #0d1a0d, #0a1208)',
                        border: '1px solid rgba(163,230,53,0.15)',
                        borderRadius: '20px',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(163,230,53,0.08)',
                        overflow: 'hidden',
                        fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                    initial={{ scale: 0.93, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.93, opacity: 0, y: 24 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '22px 24px 18px',
                        borderBottom: '1px solid rgba(163,230,53,0.08)',
                        background: 'linear-gradient(to right, rgba(163,230,53,0.07), rgba(212,168,67,0.04))',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                            <div>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.1em', marginBottom: '8px',
                                    padding: '4px 10px', borderRadius: '999px',
                                    background: isComingSoon ? 'rgba(251,191,36,0.12)' : 'rgba(163,230,53,0.12)',
                                    color: isComingSoon ? '#fbbf24' : '#a3e635',
                                    border: `1px solid ${isComingSoon ? 'rgba(251,191,36,0.2)' : 'rgba(163,230,53,0.2)'}`,
                                }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                                    {isComingSoon ? 'Notify Me' : 'Book Now'}
                                </div>
                                <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em', margin: 0 }}>
                                    {trip.destination}
                                </h2>
                                {!isComingSoon && trip.price > 0 && (
                                    <p style={{ color: '#a3e635', fontWeight: 700, fontSize: '14px', marginTop: '4px' }}>
                                        ₹{trip.price.toLocaleString()} <span style={{ fontWeight: 400, color: 'rgba(163,230,53,0.5)', fontSize: '12px' }}>per person</span>
                                    </p>
                                )}
                                {isComingSoon && (
                                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Be the first to know when this trip opens!</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#94a3b8', cursor: 'pointer', fontSize: '16px',
                                    transition: 'all 150ms ease',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#f1f5f9' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8' }}
                            >✕</button>
                        </div>

                        {/* Step indicator */}
                        {!isComingSoon && !submitted && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                                {[1, 2].map(s => (
                                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '26px', height: '26px', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '11px', fontWeight: 700,
                                            background: step >= s ? '#a3e635' : 'rgba(255,255,255,0.07)',
                                            color: step >= s ? '#000' : '#64748b',
                                            transition: 'all 220ms ease',
                                        }}>{step > s ? '✓' : s}</div>
                                        {s < 2 && <div style={{ height: '1px', width: '40px', background: step > s ? '#a3e635' : 'rgba(255,255,255,0.08)', transition: 'background 220ms ease' }} />}
                                    </div>
                                ))}
                                <span style={{ fontSize: '12px', color: '#475569', marginLeft: '4px' }}>
                                    {step === 1 ? 'Personal Info' : 'Trip Details'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: '22px 24px', maxHeight: '65vh', overflowY: 'auto' }}>
                        {submitted ? (
                            <motion.div
                                style={{ textAlign: 'center', padding: '24px 0' }}
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            >
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.25)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 16px', fontSize: '28px',
                                }}>✓</div>
                                <h3 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '20px', marginBottom: '10px' }}>
                                    {isComingSoon ? "You're on the list!" : 'Registration Received!'}
                                </h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px' }}>
                                    {isComingSoon
                                        ? `We'll notify you on ${form.phone} as soon as ${trip.destination} opens for booking.`
                                        : `Thanks ${form.name}! Our team will contact you on ${form.phone} within 24 hours to confirm your slot.`
                                    }
                                </p>
                                <a
                                    href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU?mode=gi_t"
                                    target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '12px 24px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        color: '#fff', fontWeight: 700, fontSize: '14px',
                                        textDecoration: 'none',
                                        boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
                                        transition: 'transform 150ms ease',
                                    }}
                                >
                                    💬 Join WhatsApp Group
                                </a>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <AnimatePresence mode="wait">
                                    {(isComingSoon || step === 1) && (
                                        <motion.div key="step1" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                                                <FormField label="Full Name *">
                                                    <FocusInput required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" />
                                                </FormField>
                                                <FormField label="Phone *">
                                                    <FocusInput required type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                                                </FormField>
                                            </div>
                                            <FormField label="Email *">
                                                <FocusInput required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
                                            </FormField>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                                                <FormField label="College">
                                                    <FocusInput value={form.college} onChange={e => update('college', e.target.value)} placeholder="e.g. CSJMU" />
                                                </FormField>
                                                <FormField label="City">
                                                    <FocusInput value={form.city} onChange={e => update('city', e.target.value)} placeholder="Your city" />
                                                </FormField>
                                            </div>
                                        </motion.div>
                                    )}

                                    {!isComingSoon && step === 2 && (
                                        <motion.div key="step2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                                                <FormField label="Gender">
                                                    <FocusSelect value={form.gender} onChange={e => update('gender', e.target.value)}>
                                                        <option value="">Select gender</option>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </FocusSelect>
                                                </FormField>
                                                <FormField label="Age">
                                                    <FocusInput type="text" inputMode="numeric" value={form.age} onChange={e => update('age', e.target.value.replace(/[^0-9]/g, ''))} placeholder="Your age" />
                                                </FormField>
                                            </div>
                                            <FormField label="Special Requirements">
                                                <FocusTextarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="Dietary needs, medical info, questions..." />
                                            </FormField>
                                            <div style={{
                                                padding: '14px', borderRadius: '10px', marginBottom: '4px',
                                                background: 'rgba(163,230,53,0.05)',
                                                border: '1px solid rgba(163,230,53,0.12)',
                                            }}>
                                                <p style={{ color: '#a3e635', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>💳 Payment Info</p>
                                                <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.6 }}>
                                                    Our team will contact you within 24 hours with payment details. No advance required now.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Buttons */}
                                <div style={{ display: 'flex', gap: '10px', paddingTop: '8px', marginTop: '4px' }}>
                                    {!isComingSoon && step === 2 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            style={{
                                                flex: 1, padding: '13px', borderRadius: '10px',
                                                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                color: '#94a3b8', transition: 'all 150ms ease',
                                            }}
                                        >← Back</button>
                                    )}
                                    {!isComingSoon && step === 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => { if (form.name && form.phone && form.email) setStep(2) }}
                                            style={{
                                                flex: 1, padding: '13px', borderRadius: '10px',
                                                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                                                background: 'linear-gradient(135deg, #a3e635, #65a30d)',
                                                color: '#000', border: 'none',
                                                boxShadow: '0 4px 20px rgba(163,230,53,0.3)',
                                                transition: 'all 150ms ease',
                                            }}
                                        >Continue →</button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                flex: 1, padding: '13px', borderRadius: '10px',
                                                fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                                background: loading ? 'rgba(163,230,53,0.4)' : 'linear-gradient(135deg, #a3e635, #65a30d)',
                                                color: '#000', border: 'none',
                                                boxShadow: loading ? 'none' : '0 4px 20px rgba(163,230,53,0.3)',
                                                transition: 'all 150ms ease',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            }}
                                        >
                                            {loading
                                                ? <><svg style={{ width: '16px', height: '16px', animation: 'spin 0.7s linear infinite' }} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Submitting...</>
                                                : isComingSoon ? '🔔 Notify Me' : '✓ Submit Registration'
                                            }
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
