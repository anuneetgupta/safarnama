'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

/* ─────────────── DATA ─────────────── */
const FAQS = [
    {
        q: 'How do I book a trip?',
        a: 'Browse our trips, click "Book Now", and complete the registration. Our team confirms your slot within 24 hours.',
    },
    {
        q: 'Are trips safe for solo travelers?',
        a: 'Absolutely. All trips are group-based with experienced trip leaders. Solo travelers are always welcome and quickly become part of the group.',
    },
    {
        q: 'What is the cancellation policy?',
        a: 'Full refund up to 7 days before the trip. 50% refund within 3–7 days. No refund within 3 days of departure.',
    },
    {
        q: 'Do you offer student discounts?',
        a: 'Yes! Show your valid student ID at check-in for an additional 5% off on all trips.',
    },
]

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
)
const TwitterIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
)
const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
)
const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

const SOCIALS = [
    { label: 'Instagram', icon: <InstagramIcon />, color: '#f472b6', bg: 'rgba(244,114,182,0.12)', href: '#' },
    { label: '@safarnama_in', icon: <TwitterIcon />, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', href: '#' },
    { label: '@safarnama', icon: <TwitterIcon />, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', href: '#' },
    { label: 'Safarnama Vlogs', icon: <YouTubeIcon />, color: '#f87171', bg: 'rgba(248,113,113,0.12)', href: '#' },
    { label: 'Safarnama Travel', icon: <LinkedInIcon />, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', href: '#' },
]

/* ─────────────── COMPONENT ─────────────── */
export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 900))
        setLoading(false)
        setSent(true)
        setForm({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSent(false), 6000)
    }

    return (
        <main style={{ minHeight: '100vh', background: '#0f1a0c', width: '100%' }}>

            {/* ════════════════ HERO ════════════════ */}
            <section style={{ position: 'relative', minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%' }}>
                {/* bg image */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: "url('/contact-hero.jpg')",
                    backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                {/* overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(10,18,8,0.72) 65%, #0f1a0c 100%)',
                }} />

                <motion.div
                    style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '80px 20px 60px' }}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                >
                    {/* badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a3e635', marginBottom: 20 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a3e635', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                        Get in Touch
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-outfit, Outfit, sans-serif)',
                        fontWeight: 900,
                        fontSize: 'clamp(40px, 6.5vw, 72px)',
                        lineHeight: 1.05,
                        letterSpacing: '-0.03em',
                        color: 'white',
                        margin: '0 0 20px',
                    }}>
                        We&apos;d Love to<br />
                        <span style={{ background: 'linear-gradient(90deg, #a3e635, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Hear From You
                        </span>
                    </h1>

                    <p style={{ fontSize: 16, lineHeight: 1.75, maxWidth: 460, margin: '0 auto', color: 'rgba(210,225,180,0.72)' }}>
                        Questions, partnerships, or just want to say hi — our team is always happy to connect.
                    </p>
                </motion.div>
            </section>

            {/* ════════════════ MAIN CONTENT ════════════════ */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: 1120, padding: '56px 40px 80px' }}>

                    {/* — TWO COLUMNS — */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, marginBottom: 72, alignItems: 'start' }}>

                        {/* ── LEFT: form card ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            style={{
                                borderRadius: 20,
                                border: '1px solid rgba(163,230,53,0.12)',
                                overflow: 'hidden',
                                background: 'rgba(8,14,6,0.9)',
                                boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
                            }}
                        >
                            {/* office strip */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '18px 28px',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                background: 'rgba(163,230,53,0.04)',
                            }}>
                                <span style={{ fontSize: 22, lineHeight: 1 }}>📍</span>
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a3e635', margin: '0 0 3px' }}>Our Office</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 2px' }}>CSJMU, Kanpur</p>
                                    <p style={{ fontSize: 13, color: 'rgba(180,200,140,0.55)', margin: 0 }}>Uttar Pradesh, India</p>
                                </div>
                            </div>

                            {/* form body */}
                            <div style={{ padding: '28px 28px 32px' }}>
                                <h2 style={{ fontFamily: 'var(--font-outfit, Outfit, sans-serif)', fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>
                                    Send Us a Message
                                </h2>
                                <p style={{ fontSize: 14, color: 'rgba(180,200,140,0.55)', margin: '0 0 28px', lineHeight: 1.6 }}>
                                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                                </p>

                                {sent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', marginBottom: 20 }}
                                    >
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="14" height="14" fill="none" stroke="#34d399" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div>
                                            <p style={{ color: '#34d399', fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>Message sent!</p>
                                            <p style={{ color: 'rgba(52,211,153,0.65)', fontSize: 12, margin: 0 }}>We&apos;ll reply within 24 hours.</p>
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                                    {/* Name */}
                                    <FormField label="Your Name">
                                        <input
                                            id="contact-name"
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="Your full name"
                                            required
                                            style={inputStyle}
                                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                                            onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
                                        />
                                    </FormField>

                                    {/* Email */}
                                    <FormField label="Email Address">
                                        <input
                                            id="contact-email"
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="you@email.com"
                                            required
                                            style={inputStyle}
                                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                                            onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
                                        />
                                    </FormField>

                                    {/* Subject */}
                                    <FormField label="Subject">
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                id="contact-subject"
                                                value={form.subject}
                                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                                required
                                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const, paddingRight: 40 }}
                                                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                                                onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
                                            >
                                                <option value="" style={{ background: '#0c1409' }}>Select a topic...</option>
                                                {['General Inquiry', 'Trip Booking', 'Partnership', 'Custom Trip Request', 'Feedback', 'Other'].map(s => (
                                                    <option key={s} value={s} style={{ background: '#0c1409' }}>{s}</option>
                                                ))}
                                            </select>
                                            <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(163,230,53,0.6)' }} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </FormField>

                                    {/* Message */}
                                    <FormField label="Message">
                                        <textarea
                                            id="contact-message"
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            placeholder="Tell us how we can help..."
                                            required
                                            rows={5}
                                            style={{ ...inputStyle, resize: 'none', height: 120 }}
                                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                                            onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
                                        />
                                    </FormField>

                                    <button
                                        id="contact-submit"
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            padding: '14px 24px',
                                            background: loading ? 'rgba(132,204,22,0.4)' : 'linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)',
                                            color: '#0a160a',
                                            fontWeight: 800, fontSize: 15,
                                            borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 20px rgba(132,204,22,0.25)',
                                            transition: 'all 0.2s ease',
                                            letterSpacing: '0.01em',
                                        }}
                                        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(132,204,22,0.4)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(132,204,22,0.25)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
                                    >
                                        {loading ? (
                                            <>
                                                <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Sending...
                                            </>
                                        ) : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                        {/* ── RIGHT: map + socials + badge ── */}
                        <motion.div
                            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.12 }}
                        >
                            {/* Map card */}
                            <div style={{
                                borderRadius: 20, border: '1px solid rgba(163,230,53,0.12)',
                                overflow: 'hidden', background: 'rgba(8,14,6,0.9)',
                                boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
                            }}>
                                <div style={{ padding: '18px 20px 12px' }}>
                                    <h2 style={{ fontFamily: 'var(--font-outfit, Outfit, sans-serif)', fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>
                                        Find Us Here
                                    </h2>
                                </div>
                                <div style={{ margin: '0 12px 12px', borderRadius: 14, overflow: 'hidden', height: 200, border: '1px solid rgba(255,255,255,0.07)' }}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.0!2d80.3319!3d26.4499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c4770b127c46f%3A0x1778302a9fbe7b41!2sChhatrapati%20Shahu%20Ji%20Maharaj%20University!5e0!3m2!1sen!2sin!4v1706000000000"
                                        width="100%" height="100%"
                                        style={{ border: 0, display: 'block' }}
                                        allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>

                            {/* Social links */}
                            <div style={{
                                borderRadius: 20, border: '1px solid rgba(163,230,53,0.12)',
                                background: 'rgba(8,14,6,0.9)',
                                boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
                                overflow: 'hidden',
                            }}>
                                {SOCIALS.map((s, i) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 14,
                                            padding: '13px 20px',
                                            borderBottom: i < SOCIALS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                            textDecoration: 'none',
                                            transition: 'background 0.18s ease',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div style={{
                                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: s.bg, color: s.color,
                                        }}>
                                            {s.icon}
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(230,240,210,0.9)' }}>{s.label}</span>
                                    </a>
                                ))}
                            </div>

                            {/* Fast response */}
                            <div style={{
                                borderRadius: 16, border: '1px solid rgba(163,230,53,0.2)',
                                background: 'rgba(163,230,53,0.05)',
                                padding: '16px 20px',
                                display: 'flex', alignItems: 'center', gap: 14,
                            }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(163,230,53,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="20" height="20" fill="none" stroke="#a3e635" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={{ color: 'white', fontWeight: 600, fontSize: 14, margin: '0 0 3px' }}>Fast Response</p>
                                    <p style={{ color: 'rgba(180,200,140,0.6)', fontSize: 12, margin: 0 }}>Average reply time under 2 hours</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ════════ FAQ ════════ */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 44 }}>
                            <h2 style={{
                                fontFamily: 'var(--font-outfit, Outfit, sans-serif)',
                                fontSize: 'clamp(32px,4vw,48px)', fontWeight: 900,
                                color: 'white', letterSpacing: '-0.03em', margin: '0 0 10px',
                            }}>
                                Common Questions
                            </h2>
                            <p style={{ fontSize: 16, color: 'rgba(180,200,140,0.6)', margin: 0 }}>
                                Quick answers to what we hear most often.
                            </p>
                        </div>

                        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {FAQS.map((faq, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        borderRadius: 16,
                                        border: openFaq === i ? '1px solid rgba(163,230,53,0.15)' : '1px solid rgba(255,255,255,0.07)',
                                        overflow: 'hidden',
                                        background: openFaq === i ? 'rgba(163,230,53,0.04)' : 'rgba(8,14,6,0.7)',
                                        transition: 'border-color 0.25s, background 0.25s',
                                    }}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07 }}
                                >
                                    <button
                                        id={`faq-${i}`}
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '18px 24px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                                        }}
                                    >
                                        <span style={{ color: 'white', fontWeight: 600, fontSize: 15, paddingRight: 24, lineHeight: 1.4 }}>{faq.q}</span>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: openFaq === i ? 'rgba(163,230,53,0.18)' : 'rgba(255,255,255,0.05)',
                                            border: openFaq === i ? '1px solid rgba(163,230,53,0.3)' : '1px solid rgba(255,255,255,0.08)',
                                            transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                                            transition: 'all 0.28s ease',
                                        }}>
                                            <svg width="13" height="13" fill="none" stroke="rgba(180,200,140,0.7)" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                    </button>

                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ padding: '0 24px 20px' }}
                                        >
                                            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />
                                            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(180,200,140,0.65)', margin: 0 }}>{faq.a}</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* spin keyframe */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
                @media (max-width: 900px) {
                    .contact-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </main>
    )
}

/* ─── helpers ─── */
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{
                display: 'block', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                color: 'rgba(163,230,53,0.65)', marginBottom: 8,
            }}>
                {label}
            </label>
            {children}
        </div>
    )
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    color: 'white',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
}

const inputFocusStyle: React.CSSProperties = {
    borderColor: 'rgba(132,204,22,0.55)',
    boxShadow: '0 0 0 3px rgba(132,204,22,0.1)',
    background: 'rgba(132,204,22,0.04)',
}

const inputBlurStyle: React.CSSProperties = {
    borderColor: 'rgba(255,255,255,0.12)',
    boxShadow: 'none',
    background: 'rgba(255,255,255,0.04)',
}
