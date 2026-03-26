'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormData {
    name: string
    email: string
    phone: string
    college: string
    instagram: string
    facebook: string
    emergencyName: string
    emergencyPhone: string
    emergencyRelation: string
}

const INITIAL: FormData = {
    name: '', email: '', phone: '', college: '',
    instagram: '', facebook: '',
    emergencyName: '', emergencyPhone: '', emergencyRelation: '',
}

const STEPS = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Social' },
    { num: 3, label: 'Emergency' },
]

export default function MultiStepRegistration() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [form, setForm] = useState<FormData>(INITIAL)
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const [loading, setLoading] = useState(false)

    const update = (field: keyof FormData, value: string) => {
        setForm(p => ({ ...p, [field]: value }))
        if (errors[field]) setErrors(p => ({ ...p, [field]: '' }))
    }

    const validate = (s: number) => {
        const e: Partial<FormData> = {}
        if (s === 1) {
            if (!form.name.trim()) e.name = 'Name is required'
            if (!form.email.trim()) e.email = 'Email is required'
            else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
            if (!form.phone.trim()) e.phone = 'Phone is required'
            else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number'
            if (!form.college.trim()) e.college = 'College name is required'
        }
        if (s === 3) {
            if (!form.emergencyName.trim()) e.emergencyName = 'Name is required'
            if (!form.emergencyPhone.trim()) e.emergencyPhone = 'Phone is required'
            else if (!/^\d{10}$/.test(form.emergencyPhone)) e.emergencyPhone = 'Enter a valid 10-digit number'
            if (!form.emergencyRelation.trim()) e.emergencyRelation = 'Relation is required'
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const next = () => { if (validate(step) && step < 3) setStep(s => s + 1) }
    const back = () => { if (step > 1) setStep(s => s - 1) }

    const submit = async () => {
        if (!validate(step)) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 900))
        router.push('/dashboard')
    }

    const inputClass = (field: keyof FormData) =>
        `form-input ${errors[field] ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`

    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4 py-16">
            <div className="absolute inset-0 grid-pattern" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-teal-500/5 rounded-full blur-[80px]" />

            <div className="relative z-10 w-full max-w-[560px]">
                {/* Header */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 text-slate-500 hover:text-white transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to home
                    </Link>
                    <h1 className="text-3xl font-[var(--font-outfit)] font-extrabold text-white mb-2">
                        Join Safarnama
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Already a member?{' '}
                        <Link href="/auth/login" className="text-[var(--accent-light)] hover:text-white transition-colors font-medium">
                            Sign in
                        </Link>
                    </p>
                </motion.div>

                {/* Step indicator */}
                <div className="flex items-center mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s.num} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-1.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                    step > s.num
                                        ? 'bg-[var(--accent)] text-white'
                                        : step === s.num
                                        ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent)]/20'
                                        : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'
                                }`}>
                                    {step > s.num ? (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : s.num}
                                </div>
                                <span className={`text-[10px] font-medium whitespace-nowrap ${step === s.num ? 'text-[var(--accent-light)]' : 'text-slate-600'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-px mx-3 mb-4 transition-all duration-500 ${step > s.num ? 'bg-[var(--accent)]' : 'bg-white/[0.08]'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form card */}
                <div className="glass-card border border-white/[0.08] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="p-8"
                        >
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-white mb-1">Tell us about yourself</h2>
                                        <p className="text-slate-500 text-sm">Basic info to set up your account</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Full Name *</label>
                                            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className={inputClass('name')} placeholder="Your full name" />
                                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Email *</label>
                                            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inputClass('email')} placeholder="you@college.edu" />
                                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Phone *</label>
                                            <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass('phone')} placeholder="10-digit number" maxLength={10} />
                                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">College *</label>
                                            <input type="text" value={form.college} onChange={e => update('college', e.target.value)} className={inputClass('college')} placeholder="Your college" />
                                            {errors.college && <p className="text-red-400 text-xs mt-1">{errors.college}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-white mb-1">Connect with the community</h2>
                                        <p className="text-slate-500 text-sm">Optional — share your social handles</p>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Instagram</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
                                            <input type="text" value={form.instagram} onChange={e => update('instagram', e.target.value)} className="form-input pl-8" placeholder="your_handle" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Facebook</label>
                                        <input type="text" value={form.facebook} onChange={e => update('facebook', e.target.value)} className="form-input" placeholder="facebook.com/yourprofile" />
                                    </div>
                                    <div className="mt-4 p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10">
                                        <p className="text-slate-400 text-xs leading-relaxed">
                                            Your social handles help fellow travelers connect with you before and after trips. This is completely optional.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-white mb-1">Emergency contact</h2>
                                        <p className="text-slate-500 text-sm">Required for your safety during trips</p>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Contact Name *</label>
                                        <input type="text" value={form.emergencyName} onChange={e => update('emergencyName', e.target.value)} className={inputClass('emergencyName')} placeholder="Full name" />
                                        {errors.emergencyName && <p className="text-red-400 text-xs mt-1">{errors.emergencyName}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Phone *</label>
                                            <input type="tel" value={form.emergencyPhone} onChange={e => update('emergencyPhone', e.target.value)} className={inputClass('emergencyPhone')} placeholder="10-digit" maxLength={10} />
                                            {errors.emergencyPhone && <p className="text-red-400 text-xs mt-1">{errors.emergencyPhone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Relation *</label>
                                            <select value={form.emergencyRelation} onChange={e => update('emergencyRelation', e.target.value)} className={`form-input cursor-pointer bg-[#0a1628] ${errors.emergencyRelation ? 'border-red-500/50' : ''}`}>
                                                <option value="" className="bg-[#0a1628]">Select</option>
                                                {['Parent', 'Sibling', 'Guardian', 'Friend', 'Spouse'].map(r => (
                                                    <option key={r} value={r} className="bg-[#0a1628]">{r}</option>
                                                ))}
                                            </select>
                                            {errors.emergencyRelation && <p className="text-red-400 text-xs mt-1">{errors.emergencyRelation}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer nav */}
                    <div className="px-8 pb-8 flex justify-between items-center">
                        <button
                            onClick={back}
                            disabled={step === 1}
                            className="btn-secondary text-sm px-5 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <span className="text-slate-600 text-xs">{step} of 3</span>
                        <button
                            onClick={step === 3 ? submit : next}
                            disabled={loading}
                            className="btn-primary text-sm px-5 py-2.5 disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating...
                                </span>
                            ) : step === 3 ? (
                                <>
                                    Create Account
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    Continue
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
