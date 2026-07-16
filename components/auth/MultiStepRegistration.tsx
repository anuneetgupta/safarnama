'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

interface FormData {
    name: string
    email: string
    password: string
    confirmPassword: string
    phone: string
    college: string
    instagram: string
    facebook: string
    emergencyName: string
    emergencyPhone: string
    emergencyRelation: string
}

const INITIAL: FormData = {
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', college: '',
    instagram: '', facebook: '',
    emergencyName: '', emergencyPhone: '', emergencyRelation: '',
}

const STEPS = [
    {
        num: 1,
        label: 'Basic Info',
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        description: 'Your personal details & credentials',
    },
    {
        num: 2,
        label: 'Connect',
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        description: 'Link your social handles (optional)',
    },
    {
        num: 3,
        label: 'Safety',
        icon: (
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        description: 'Emergency contact for your safety',
    },
]

const SIDE_FEATURES = [
    { icon: '🏔️', text: 'Curated student trips' },
    { icon: '🤝', text: 'Verified travel community' },
    { icon: '🛡️', text: 'Safety-first approach' },
    { icon: '💸', text: 'Budget-friendly adventures' },
]

export default function MultiStepRegistration() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [form, setForm] = useState<FormData>(INITIAL)
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

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
            if (!form.password.trim()) e.password = 'Password is required'
            else if (form.password.length < 6) e.password = 'Minimum 6 characters'
            if (!form.confirmPassword.trim()) e.confirmPassword = 'Please confirm your password'
            else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
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
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) {
                setErrors({ email: data.error || 'Registration failed' })
                setStep(1)
                setLoading(false)
                return
            }
            await signIn('credentials', {
                email: form.email,
                password: form.password,
                callbackUrl: '/dashboard',
                redirect: true,
            })
        } catch {
            setErrors({ email: 'Something went wrong. Please try again.' })
            setStep(1)
            setLoading(false)
        }
    }

    const inputClass = (field: keyof FormData) =>
        `reg-input${errors[field] ? ' reg-input--error' : ''}`

    const EyeIcon = ({ visible }: { visible: boolean }) => (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {visible
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
            }
        </svg>
    )

    return (
        <>
            <style>{`
                .reg-page {
                    min-height: 100vh;
                    display: flex;
                    background: var(--bg-base);
                    font-family: var(--font-sans);
                }

                /* ── LEFT PANEL ─────────────────────────────── */
                .reg-side {
                    display: none;
                    position: relative;
                    width: 420px;
                    flex-shrink: 0;
                    background: linear-gradient(160deg, #0d1f0a 0%, #061205 60%, #080f08 100%);
                    overflow: hidden;
                    padding: 48px 40px;
                    flex-direction: column;
                    justify-content: space-between;
                }
                @media (min-width: 1024px) {
                    .reg-side { display: flex; }
                }

                .reg-side-noise {
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
                    pointer-events: none;
                }
                .reg-side-glow {
                    position: absolute;
                    width: 340px;
                    height: 340px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(132,204,22,0.12) 0%, transparent 70%);
                    top: -80px;
                    right: -80px;
                    pointer-events: none;
                }
                .reg-side-glow2 {
                    position: absolute;
                    width: 260px;
                    height: 260px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%);
                    bottom: 60px;
                    left: -60px;
                    pointer-events: none;
                }

                .reg-side-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                    z-index: 1;
                }
                .reg-side-brand-dot {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, var(--green-500), var(--green-600));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }
                .reg-side-brand-name {
                    font-family: var(--font-display);
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: -0.01em;
                }

                .reg-side-center {
                    position: relative;
                    z-index: 1;
                }
                .reg-side-tagline {
                    font-family: var(--font-display);
                    font-size: 32px;
                    font-weight: 800;
                    line-height: 1.15;
                    letter-spacing: -0.02em;
                    color: var(--text-primary);
                    margin-bottom: 12px;
                }
                .reg-side-tagline span {
                    background: linear-gradient(135deg, var(--green-400), var(--gold-400));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .reg-side-sub {
                    font-size: 14px;
                    line-height: 1.6;
                    color: var(--text-muted);
                    margin-bottom: 32px;
                    max-width: 300px;
                }
                .reg-features {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }
                .reg-feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 14px;
                    background: rgba(132,204,22,0.04);
                    border: 1px solid rgba(132,204,22,0.08);
                    border-radius: 10px;
                }
                .reg-feature-icon {
                    font-size: 18px;
                    flex-shrink: 0;
                }
                .reg-feature-text {
                    font-size: 13px;
                    color: rgba(200,220,160,0.75);
                    font-weight: 500;
                }

                .reg-side-footer {
                    position: relative;
                    z-index: 1;
                }
                .reg-side-quote {
                    font-size: 12px;
                    color: var(--text-muted);
                    font-style: italic;
                    border-left: 2px solid rgba(132,204,22,0.25);
                    padding-left: 12px;
                }

                /* ── RIGHT PANEL ────────────────────────────── */
                .reg-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    position: relative;
                    overflow: hidden;
                }
                .reg-main-noise {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(132,204,22,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(132,204,22,0.025) 1px, transparent 1px);
                    background-size: 48px 48px;
                    pointer-events: none;
                }
                .reg-main-glow {
                    position: absolute;
                    width: 500px;
                    height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(132,204,22,0.04) 0%, transparent 70%);
                    top: -100px;
                    right: -100px;
                    pointer-events: none;
                }

                .reg-wrap {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 520px;
                }

                /* ── TOP NAV ────────────────────────────────── */
                .reg-topnav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 36px;
                }
                .reg-back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: var(--text-muted);
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .reg-back-link:hover { color: var(--text-primary); }
                .reg-signin-link {
                    font-size: 13px;
                    color: var(--text-muted);
                }
                .reg-signin-link a {
                    color: var(--green-400);
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .reg-signin-link a:hover { color: var(--text-primary); }

                /* ── HEADING ────────────────────────────────── */
                .reg-heading {
                    margin-bottom: 28px;
                }
                .reg-title {
                    font-family: var(--font-display);
                    font-size: 28px;
                    font-weight: 800;
                    color: var(--text-primary);
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                    margin: 0 0 6px;
                }
                .reg-subtitle {
                    font-size: 14px;
                    color: var(--text-muted);
                    margin: 0;
                }

                /* ── STEP INDICATORS ────────────────────────── */
                .reg-steps {
                    display: flex;
                    align-items: flex-start;
                    gap: 0;
                    margin-bottom: 28px;
                }
                .reg-step-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    flex: 1;
                }
                .reg-step-top {
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                .reg-step-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 1;
                }
                .reg-step-circle--done {
                    background: var(--green-500);
                    box-shadow: 0 0 0 4px rgba(132,204,22,0.15);
                }
                .reg-step-circle--active {
                    background: linear-gradient(135deg, var(--green-500), var(--green-600));
                    box-shadow: 0 0 0 4px rgba(132,204,22,0.2), 0 4px 12px rgba(132,204,22,0.3);
                }
                .reg-step-circle--inactive {
                    background: rgba(132,204,22,0.05);
                    border: 1px solid rgba(132,204,22,0.12);
                }
                .reg-step-connector {
                    flex: 1;
                    height: 2px;
                    margin-top: 17px;
                    transition: background 0.4s ease;
                    align-self: flex-start;
                }
                .reg-step-connector--done { background: var(--green-500); }
                .reg-step-connector--inactive { background: rgba(132,204,22,0.1); }
                .reg-step-labels {
                    margin-top: 8px;
                    text-align: center;
                    width: 100%;
                }
                .reg-step-label {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    transition: color 0.2s;
                }
                .reg-step-label--active { color: var(--green-400); }
                .reg-step-label--done { color: rgba(132,204,22,0.6); }
                .reg-step-label--inactive { color: rgba(180,200,140,0.3); }

                /* ── FORM CARD ──────────────────────────────── */
                .reg-card {
                    background: rgba(10,18,8,0.7);
                    border: 1px solid rgba(132,204,22,0.1);
                    border-radius: 16px;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(132,204,22,0.06);
                }

                .reg-card-body {
                    padding: 28px 28px 0;
                }
                @media (min-width: 480px) {
                    .reg-card-body { padding: 32px 32px 0; }
                }

                .reg-step-header {
                    margin-bottom: 22px;
                    padding-bottom: 18px;
                    border-bottom: 1px solid rgba(132,204,22,0.06);
                }
                .reg-step-title {
                    font-family: var(--font-display);
                    font-size: 17px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0 0 4px;
                }
                .reg-step-desc {
                    font-size: 13px;
                    color: var(--text-muted);
                    margin: 0;
                }

                .reg-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .reg-fields-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                }

                .reg-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .reg-label {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: rgba(200,220,160,0.55);
                }
                .reg-label span {
                    color: rgba(239,68,68,0.7);
                    margin-left: 2px;
                }

                /* Input */
                .reg-input {
                    width: 100%;
                    height: 44px;
                    padding: 0 14px;
                    background: rgba(8,15,8,0.6);
                    border: 1px solid rgba(132,204,22,0.1);
                    border-radius: 10px;
                    color: var(--text-primary);
                    font-size: 14px;
                    font-family: var(--font-sans);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                }
                .reg-input::placeholder { color: rgba(180,200,140,0.3); }
                .reg-input:focus {
                    border-color: rgba(132,204,22,0.4);
                    background: rgba(8,15,8,0.9);
                    box-shadow: 0 0 0 3px rgba(132,204,22,0.08);
                }
                .reg-input--error {
                    border-color: rgba(239,68,68,0.4) !important;
                    box-shadow: 0 0 0 3px rgba(239,68,68,0.06);
                }
                .reg-input-wrap {
                    position: relative;
                }
                .reg-input-wrap .reg-input {
                    padding-right: 40px;
                }
                .reg-input-prefix {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(180,200,140,0.4);
                    font-size: 14px;
                    pointer-events: none;
                }
                .reg-input-prefix + .reg-input { padding-left: 28px; }
                .reg-eye-btn {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: rgba(180,200,140,0.4);
                    display: flex;
                    align-items: center;
                    padding: 2px;
                    transition: color 0.2s;
                }
                .reg-eye-btn:hover { color: rgba(200,220,160,0.75); }
                .reg-error {
                    font-size: 11px;
                    color: rgba(239,68,68,0.85);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-top: 2px;
                }

                /* Select */
                .reg-select {
                    width: 100%;
                    height: 44px;
                    padding: 0 14px;
                    background: rgba(8,15,8,0.6);
                    border: 1px solid rgba(132,204,22,0.1);
                    border-radius: 10px;
                    color: var(--text-primary);
                    font-size: 14px;
                    font-family: var(--font-sans);
                    outline: none;
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(180,200,140,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 14px center;
                    padding-right: 36px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .reg-select:focus {
                    border-color: rgba(132,204,22,0.4);
                    box-shadow: 0 0 0 3px rgba(132,204,22,0.08);
                }
                .reg-select--error {
                    border-color: rgba(239,68,68,0.4) !important;
                }
                .reg-select option { background: #0a1208; }

                /* Info box */
                .reg-info-box {
                    padding: 12px 14px;
                    background: rgba(132,204,22,0.04);
                    border: 1px solid rgba(132,204,22,0.08);
                    border-radius: 10px;
                    font-size: 12px;
                    color: rgba(200,220,160,0.6);
                    line-height: 1.55;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                }
                .reg-info-icon { flex-shrink: 0; margin-top: 1px; color: rgba(132,204,22,0.5); }

                /* ── FOOTER NAV ─────────────────────────────── */
                .reg-card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 28px 28px;
                    margin-top: 20px;
                    border-top: 1px solid rgba(132,204,22,0.06);
                }
                @media (min-width: 480px) {
                    .reg-card-footer { padding: 20px 32px 32px; }
                }

                .reg-progress {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .reg-progress-dots {
                    display: flex;
                    gap: 5px;
                }
                .reg-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    transition: all 0.3s;
                }
                .reg-dot--active {
                    width: 20px;
                    border-radius: 3px;
                    background: var(--green-500);
                }
                .reg-dot--done { background: rgba(132,204,22,0.5); }
                .reg-dot--inactive { background: rgba(132,204,22,0.15); }
                .reg-progress-text {
                    font-size: 10px;
                    color: var(--text-muted);
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                .reg-btn-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    height: 40px;
                    padding: 0 16px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-muted);
                    background: transparent;
                    border: 1px solid rgba(132,204,22,0.1);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: var(--font-sans);
                }
                .reg-btn-back:hover:not(:disabled) {
                    color: var(--text-primary);
                    border-color: rgba(132,204,22,0.25);
                    background: rgba(132,204,22,0.04);
                }
                .reg-btn-back:disabled { opacity: 0.3; cursor: not-allowed; }

                .reg-btn-next {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    height: 40px;
                    padding: 0 20px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #080f08;
                    background: linear-gradient(135deg, var(--green-500), var(--green-600));
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-family: var(--font-sans);
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(132,204,22,0.25);
                }
                .reg-btn-next:hover:not(:disabled) {
                    background: linear-gradient(135deg, var(--green-400), var(--green-500));
                    box-shadow: 0 6px 20px rgba(132,204,22,0.35);
                    transform: translateY(-1px);
                }
                .reg-btn-next:active { transform: translateY(0); }
                .reg-btn-next:disabled { opacity: 0.6; cursor: not-allowed; }

                .reg-spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(8,15,8,0.3);
                    border-top-color: #080f08;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    flex-shrink: 0;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <div className="reg-page">
                {/* ── LEFT PANEL ─────────────────────────────────── */}
                <aside className="reg-side">
                    <div className="reg-side-noise" />
                    <div className="reg-side-glow" />
                    <div className="reg-side-glow2" />

                    {/* Brand */}
                    <div className="reg-side-brand">
                        <div className="reg-side-brand-dot">🏕️</div>
                        <span className="reg-side-brand-name">Safarnama</span>
                    </div>

                    {/* Center content */}
                    <div className="reg-side-center">
                        <h2 className="reg-side-tagline">
                            Your next<br />adventure<br /><span>starts here.</span>
                        </h2>
                        <p className="reg-side-sub">
                            Join thousands of students exploring India together — safely, affordably, and unforgettably.
                        </p>
                        <div className="reg-features">
                            {SIDE_FEATURES.map(f => (
                                <div key={f.text} className="reg-feature-item">
                                    <span className="reg-feature-icon">{f.icon}</span>
                                    <span className="reg-feature-text">{f.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer quote */}
                    <div className="reg-side-footer">
                        <p className="reg-side-quote">
                            "Travel is the only thing you buy that makes you richer."
                        </p>
                    </div>
                </aside>

                {/* ── RIGHT PANEL ────────────────────────────────── */}
                <main className="reg-main">
                    <div className="reg-main-noise" />
                    <div className="reg-main-glow" />

                    <div className="reg-wrap">
                        {/* Top navigation */}
                        <div className="reg-topnav">
                            <Link href="/" className="reg-back-link">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to home
                            </Link>
                            <span className="reg-signin-link">
                                Have an account? <Link href="/auth/login">Sign in</Link>
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="reg-heading">
                            <h1 className="reg-title">Create your account</h1>
                            <p className="reg-subtitle">Fill in a few details to get started — it only takes 2 minutes.</p>
                        </div>

                        {/* Step indicators */}
                        <div className="reg-steps">
                            {STEPS.map((s, i) => (
                                <div key={s.num} className="reg-step-item">
                                    <div className="reg-step-top">
                                        <motion.div
                                            className={`reg-step-circle ${step > s.num ? 'reg-step-circle--done' : step === s.num ? 'reg-step-circle--active' : 'reg-step-circle--inactive'}`}
                                            animate={{ scale: step === s.num ? 1.05 : 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {step > s.num ? (
                                                <svg width="14" height="14" fill="none" stroke="#080f08" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span style={{ color: step === s.num ? '#080f08' : 'rgba(180,200,140,0.4)' }}>
                                                    {s.icon}
                                                </span>
                                            )}
                                        </motion.div>
                                        {i < STEPS.length - 1 && (
                                            <div className={`reg-step-connector ${step > s.num ? 'reg-step-connector--done' : 'reg-step-connector--inactive'}`} />
                                        )}
                                    </div>
                                    <div className="reg-step-labels">
                                        <span className={`reg-step-label ${step === s.num ? 'reg-step-label--active' : step > s.num ? 'reg-step-label--done' : 'reg-step-label--inactive'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form card */}
                        <div className="reg-card">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    className="reg-card-body"
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {/* Step header */}
                                    <div className="reg-step-header">
                                        <h2 className="reg-step-title">{STEPS[step - 1].description.split('(')[0].trim()}</h2>
                                        <p className="reg-step-desc">{STEPS[step - 1].description}</p>
                                    </div>

                                    {/* ── STEP 1: Basic Info ── */}
                                    {step === 1 && (
                                        <div className="reg-fields">
                                            <div className="reg-field">
                                                <label className="reg-label">Full Name <span>*</span></label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={e => update('name', e.target.value)}
                                                    className={inputClass('name')}
                                                    placeholder="Your full name"
                                                    autoComplete="name"
                                                />
                                                {errors.name && <span className="reg-error">⚠ {errors.name}</span>}
                                            </div>

                                            <div className="reg-field">
                                                <label className="reg-label">Email <span>*</span></label>
                                                <input
                                                    type="email"
                                                    value={form.email}
                                                    onChange={e => update('email', e.target.value)}
                                                    className={inputClass('email')}
                                                    placeholder="you@college.edu"
                                                    autoComplete="email"
                                                />
                                                {errors.email && <span className="reg-error">⚠ {errors.email}</span>}
                                            </div>

                                            <div className="reg-fields-row">
                                                <div className="reg-field">
                                                    <label className="reg-label">Phone <span>*</span></label>
                                                    <input
                                                        type="tel"
                                                        value={form.phone}
                                                        onChange={e => update('phone', e.target.value)}
                                                        className={inputClass('phone')}
                                                        placeholder="10-digit number"
                                                        maxLength={10}
                                                    />
                                                    {errors.phone && <span className="reg-error">⚠ {errors.phone}</span>}
                                                </div>
                                                <div className="reg-field">
                                                    <label className="reg-label">College <span>*</span></label>
                                                    <input
                                                        type="text"
                                                        value={form.college}
                                                        onChange={e => update('college', e.target.value)}
                                                        className={inputClass('college')}
                                                        placeholder="Your college"
                                                    />
                                                    {errors.college && <span className="reg-error">⚠ {errors.college}</span>}
                                                </div>
                                            </div>

                                            <div className="reg-field">
                                                <label className="reg-label">Password <span>*</span></label>
                                                <div className="reg-input-wrap">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={form.password}
                                                        onChange={e => update('password', e.target.value)}
                                                        className={inputClass('password')}
                                                        placeholder="Min. 6 characters"
                                                        autoComplete="new-password"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="reg-eye-btn">
                                                        <EyeIcon visible={showPassword} />
                                                    </button>
                                                </div>
                                                {errors.password && <span className="reg-error">⚠ {errors.password}</span>}
                                            </div>

                                            <div className="reg-field">
                                                <label className="reg-label">Confirm Password <span>*</span></label>
                                                <div className="reg-input-wrap">
                                                    <input
                                                        type={showConfirm ? 'text' : 'password'}
                                                        value={form.confirmPassword}
                                                        onChange={e => update('confirmPassword', e.target.value)}
                                                        className={inputClass('confirmPassword')}
                                                        placeholder="Re-enter password"
                                                        autoComplete="new-password"
                                                    />
                                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="reg-eye-btn">
                                                        <EyeIcon visible={showConfirm} />
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && <span className="reg-error">⚠ {errors.confirmPassword}</span>}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── STEP 2: Social ── */}
                                    {step === 2 && (
                                        <div className="reg-fields">
                                            <div className="reg-info-box">
                                                <span className="reg-info-icon">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </span>
                                                <span>
                                                    Social handles help fellow travelers connect with you before and after trips. This step is completely optional — skip it anytime.
                                                </span>
                                            </div>
                                            <div className="reg-field">
                                                <label className="reg-label">Instagram</label>
                                                <div className="reg-input-wrap" style={{ position: 'relative' }}>
                                                    <span className="reg-input-prefix" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>@</span>
                                                    <input
                                                        type="text"
                                                        value={form.instagram}
                                                        onChange={e => update('instagram', e.target.value)}
                                                        className="reg-input"
                                                        placeholder="your_handle"
                                                        style={{ paddingLeft: 28 }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="reg-field">
                                                <label className="reg-label">Facebook</label>
                                                <input
                                                    type="text"
                                                    value={form.facebook}
                                                    onChange={e => update('facebook', e.target.value)}
                                                    className="reg-input"
                                                    placeholder="facebook.com/yourprofile"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* ── STEP 3: Emergency ── */}
                                    {step === 3 && (
                                        <div className="reg-fields">
                                            <div className="reg-info-box">
                                                <span className="reg-info-icon">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                </span>
                                                <span>
                                                    This information is kept confidential and only used in genuine emergencies during your trips.
                                                </span>
                                            </div>
                                            <div className="reg-field">
                                                <label className="reg-label">Contact Name <span>*</span></label>
                                                <input
                                                    type="text"
                                                    value={form.emergencyName}
                                                    onChange={e => update('emergencyName', e.target.value)}
                                                    className={inputClass('emergencyName')}
                                                    placeholder="Full name"
                                                />
                                                {errors.emergencyName && <span className="reg-error">⚠ {errors.emergencyName}</span>}
                                            </div>
                                            <div className="reg-fields-row">
                                                <div className="reg-field">
                                                    <label className="reg-label">Phone <span>*</span></label>
                                                    <input
                                                        type="tel"
                                                        value={form.emergencyPhone}
                                                        onChange={e => update('emergencyPhone', e.target.value)}
                                                        className={inputClass('emergencyPhone')}
                                                        placeholder="10-digit"
                                                        maxLength={10}
                                                    />
                                                    {errors.emergencyPhone && <span className="reg-error">⚠ {errors.emergencyPhone}</span>}
                                                </div>
                                                <div className="reg-field">
                                                    <label className="reg-label">Relation <span>*</span></label>
                                                    <select
                                                        value={form.emergencyRelation}
                                                        onChange={e => update('emergencyRelation', e.target.value)}
                                                        className={`reg-select${errors.emergencyRelation ? ' reg-select--error' : ''}`}
                                                    >
                                                        <option value="">Select</option>
                                                        {['Parent', 'Sibling', 'Guardian', 'Friend', 'Spouse'].map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                    {errors.emergencyRelation && <span className="reg-error">⚠ {errors.emergencyRelation}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Footer */}
                            <div className="reg-card-footer">
                                <button
                                    suppressHydrationWarning
                                    onClick={back}
                                    disabled={step === 1}
                                    className="reg-btn-back"
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>

                                {/* Progress dots */}
                                <div className="reg-progress">
                                    <div className="reg-progress-dots">
                                        {[1, 2, 3].map(n => (
                                            <div
                                                key={n}
                                                className={`reg-dot ${step === n ? 'reg-dot--active' : step > n ? 'reg-dot--done' : 'reg-dot--inactive'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="reg-progress-text">Step {step} of 3</span>
                                </div>

                                <button
                                    suppressHydrationWarning
                                    onClick={step === 3 ? submit : next}
                                    disabled={loading}
                                    className="reg-btn-next"
                                >
                                    {loading ? (
                                        <>
                                            <span className="reg-spinner" />
                                            Creating…
                                        </>
                                    ) : step === 3 ? (
                                        <>
                                            Create Account
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
