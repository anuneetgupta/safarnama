'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

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
        <main className="min-h-screen bg-[#020817]">

            {/* ── HERO ── */}
            <section className="relative min-h-[560px] flex items-center pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#020817] to-[#020817]" />
                <div className="absolute inset-0 grid-pattern opacity-60" />
                <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-teal-500/8 rounded-full blur-[140px]" />
                <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-sky-500/6 rounded-full blur-[100px]" />

                <div className="container-main relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                            Get in Touch
                        </div>

                        <h1 className="text-[56px] md:text-[72px] font-[var(--font-outfit)] font-extrabold text-white leading-[1.0] tracking-[-0.03em] mb-6">
                            We&apos;d Love to<br />
                            <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
                                Hear From You
                            </span>
                        </h1>

                        <p className="text-[17px] text-slate-400 leading-[1.75] max-w-[480px] mx-auto">
                            Questions, partnerships, or just want to say hi — our team is always happy to connect.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTACT INFO CARDS ── */}
            <section className="container-main pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
                    {[
                        {
                            icon: '📍',
                            label: 'Our Office',
                            line1: 'CSJMU, Kanpur',
                            line2: 'Uttar Pradesh, India',
                            accent: 'sky',
                        },
                        {
                            icon: '📞',
                            label: 'Call Us',
                            line1: '+91 94561 71734',
                            line2: 'Mon – Sat, 10am – 7pm',
                            href: 'tel:+919456171734',
                            accent: 'emerald',
                        },
                        {
                            icon: '✉️',
                            label: 'Email Us',
                            line1: 'hello@safarnama.com',
                            line2: 'Reply within 24 hours',
                            href: 'mailto:hello@safarnama.com',
                            accent: 'orange',
                        },
                        {
                            icon: '💬',
                            label: 'Live Chat',
                            line1: 'Chat with our team',
                            line2: 'Available 9am – 9pm',
                            href: 'https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU?mode=gi_t',
                            accent: 'purple',
                        },
                    ].map((card, i) => {
                        const colors: Record<string, string> = {
                            sky: 'border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40',
                            emerald: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40',
                            orange: 'border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40',
                            purple: 'border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40',
                        }
                        const textColors: Record<string, string> = {
                            sky: 'text-sky-400',
                            emerald: 'text-emerald-400',
                            orange: 'text-orange-400',
                            purple: 'text-purple-400',
                        }
                        return (
                            <motion.div
                                key={i}
                                className={`rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${colors[card.accent]}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <div className="text-3xl mb-5">{card.icon}</div>
                                <p className={`text-xs font-bold uppercase tracking-[0.12em] mb-3 ${textColors[card.accent]}`}>
                                    {card.label}
                                </p>
                                {card.href ? (
                                    <a href={card.href} className={`font-bold text-[15px] block mb-1 hover:text-white transition-colors ${textColors[card.accent]}`}>
                                        {card.line1}
                                    </a>
                                ) : (
                                    <p className="font-bold text-[15px] text-white mb-1">{card.line1}</p>
                                )}
                                <p className="text-slate-500 text-sm">{card.line2}</p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* ── FORM + SIDEBAR ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 mb-24">

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-[var(--font-outfit)] font-extrabold text-white mb-2">
                            Send us a message
                        </h2>
                        <p className="text-slate-400 text-base mb-8">
                            Fill out the form below and we&apos;ll get back to you within 24 hours.
                        </p>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 p-8 md:p-10">
                            {sent && (
                                <motion.div
                                    className="mb-7 flex items-start gap-4 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/25"
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-emerald-400 font-semibold text-sm">Message sent!</p>
                                        <p className="text-emerald-400/70 text-xs mt-0.5">We&apos;ll reply within 24 hours.</p>
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mb-2.5">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[15px] placeholder-slate-600 outline-none focus:border-sky-500/50 focus:bg-white/[0.06] transition-all"
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mb-2.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[15px] placeholder-slate-600 outline-none focus:border-sky-500/50 focus:bg-white/[0.06] transition-all"
                                            placeholder="you@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mb-2.5">
                                        Subject
                                    </label>
                                    <select
                                        value={form.subject}
                                        onChange={e => setForm({ ...form, subject: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-[#0f172a] border border-white/[0.08] rounded-xl text-[15px] text-slate-300 outline-none focus:border-sky-500/50 transition-all cursor-pointer"
                                        required
                                    >
                                        <option value="" className="bg-[#0f172a]">Select a topic...</option>
                                        {['General Inquiry', 'Trip Booking', 'Partnership', 'Custom Trip Request', 'Feedback', 'Other'].map(s => (
                                            <option key={s} value={s} className="bg-[#0f172a]">{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mb-2.5">
                                        Message
                                    </label>
                                    <textarea
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[15px] placeholder-slate-600 outline-none focus:border-sky-500/50 focus:bg-white/[0.06] transition-all resize-none h-36"
                                        placeholder="Tell us how we can help..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-[15px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        className="flex flex-col gap-6"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h2 className="text-3xl font-[var(--font-outfit)] font-extrabold text-white mb-2">
                            Find us here
                        </h2>
                        <p className="text-slate-400 text-base -mt-4">
                            Visit our office or connect on social media.
                        </p>

                        {/* Map */}
                        <div className="rounded-2xl overflow-hidden border border-white/[0.08] h-[240px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.0!2d80.3319!3d26.4499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c4770b127c46f%3A0x1778302a9fbe7b41!2sChhatrapati%20Shahu%20Ji%20Maharaj%20University!5e0!3m2!1sen!2sin!4v1706000000000"
                                width="100%" height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.35) brightness(0.7)' }}
                                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Social */}
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 p-6">
                            <p className="text-white font-bold text-sm mb-5">Follow our journey</p>
                            <div className="space-y-3">
                                {[
                                    { platform: 'Instagram', handle: '@safarnama_in', color: 'text-pink-400', dot: 'bg-pink-400' },
                                    { platform: 'Twitter / X', handle: '@safarnama', color: 'text-sky-400', dot: 'bg-sky-400' },
                                    { platform: 'YouTube', handle: 'Safarnama Vlogs', color: 'text-red-400', dot: 'bg-red-400' },
                                    { platform: 'LinkedIn', handle: 'Safarnama Travel', color: 'text-blue-400', dot: 'bg-blue-400' },
                                ].map((s) => (
                                    <a
                                        key={s.platform}
                                        href="#"
                                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12] transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                                            <span className="text-white text-sm font-medium">{s.platform}</span>
                                        </div>
                                        <span className={`text-xs font-medium ${s.color}`}>{s.handle}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Response time badge */}
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Fast Response</p>
                                <p className="text-slate-400 text-xs mt-0.5">Average reply time under 2 hours</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── FAQ ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-full mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            FAQ
                        </div>
                        <h2 className="text-4xl md:text-5xl font-[var(--font-outfit)] font-extrabold text-white tracking-tight mb-4">
                            Common Questions
                        </h2>
                        <p className="text-slate-400 text-[17px] max-w-[420px] mx-auto leading-relaxed">
                            Quick answers to what we hear most often.
                        </p>
                    </div>

                    <div className="max-w-[720px] mx-auto space-y-3">
                        {FAQS.map((faq, i) => (
                            <motion.div
                                key={i}
                                className="rounded-2xl border border-white/[0.07] bg-[#0a1628]/40 overflow-hidden"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                            >
                                <button
                                    className="w-full flex items-center justify-between px-7 py-5 text-left hover:bg-white/[0.02] transition-colors"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className="text-white font-semibold text-[15px] pr-6">{faq.q}</span>
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 border ${
                                        openFaq === i
                                            ? 'bg-sky-500/20 border-sky-500/30 rotate-45'
                                            : 'bg-white/[0.04] border-white/[0.08]'
                                    }`}>
                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                </button>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="px-7 pb-6"
                                    >
                                        <div className="h-px bg-white/[0.05] mb-5" />
                                        <p className="text-slate-400 text-[15px] leading-[1.75]">{faq.a}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </main>
    )
}
