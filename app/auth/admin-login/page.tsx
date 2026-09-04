'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!email.trim() || !password.trim()) {
            setError('Email and password are required.')
            return
        }

        setLoading(true)
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })
        setLoading(false)

        if (result?.error) {
            setError('Invalid credentials. Access denied.')
            return
        }

        // Verify that the logged-in user is actually an admin
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        const role = session?.user?.role

        if (role === 'admin') {
            router.push('/admin')
        } else {
            // Sign out and deny access if the user is not an admin
            await fetch('/api/auth/signout', { method: 'POST' })
            setError('Access denied. This portal is for administrators only.')
        }
    }

    return (
        <>
            <style>{`
                .al-wrap {
                    min-height: calc(100vh - 72px);
                    background: #04080a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 16px;
                    position: relative;
                    overflow: hidden;
                    font-family: var(--font-inter, 'Inter', sans-serif);
                }

                /* Subtle grid */
                .al-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
                    background-size: 44px 44px;
                    pointer-events: none;
                    z-index: 0;
                }

                /* Glow */
                .al-glow {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 500px;
                    height: 300px;
                    background: radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* CARD */
                .al-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 420px;
                    background: rgba(8, 10, 18, 0.9);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(99,102,241,0.15);
                    border-radius: 20px;
                    padding: 48px 40px 40px;
                    box-shadow:
                        0 0 0 1px rgba(99,102,241,0.05),
                        0 24px 80px rgba(0,0,0,0.8),
                        0 0 60px rgba(99,102,241,0.04) inset;
                }

                /* Shield icon */
                .al-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    background: rgba(99,102,241,0.1);
                    border: 1px solid rgba(99,102,241,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    color: #818cf8;
                }

                .al-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #818cf8;
                    background: rgba(99,102,241,0.08);
                    border: 1px solid rgba(99,102,241,0.18);
                    padding: 4px 12px;
                    border-radius: 100px;
                    margin-bottom: 16px;
                }
                .al-badge-dot {
                    width: 5px; height: 5px;
                    border-radius: 50%;
                    background: #818cf8;
                    animation: al-pulse 2s infinite;
                }
                @keyframes al-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.4); }
                }

                .al-heading {
                    font-size: 28px;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -0.3px;
                    line-height: 1.15;
                    margin-bottom: 6px;
                    font-family: var(--font-outfit, 'Outfit', sans-serif);
                }
                .al-sub {
                    font-size: 13px;
                    color: rgba(148,163,184,0.55);
                    margin-bottom: 32px;
                }

                /* FIELD */
                .al-field { margin-bottom: 16px; }
                .al-label {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    color: rgba(148,163,184,0.6);
                    margin-bottom: 7px;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }
                .al-input {
                    width: 100%;
                    padding: 13px 18px;
                    border: 1.5px solid rgba(99,102,241,0.15);
                    border-radius: 10px;
                    font-size: 14px;
                    color: #e2e8f0;
                    background: rgba(99,102,241,0.04);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-family: inherit;
                    box-sizing: border-box;
                }
                .al-input::placeholder { color: rgba(148,163,184,0.25); }
                .al-input:focus {
                    border-color: rgba(99,102,241,0.5);
                    background: rgba(99,102,241,0.07);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
                }

                /* PASSWORD */
                .al-pw { position: relative; }
                .al-pw .al-input { padding-right: 46px; }
                .al-eye {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: rgba(99,102,241,0.4);
                    display: flex;
                    align-items: center;
                    padding: 0;
                    transition: color 0.15s;
                }
                .al-eye:hover { color: rgba(99,102,241,0.8); }

                /* ERROR */
                .al-error {
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-size: 12.5px;
                    color: #f87171;
                    margin-bottom: 18px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* BUTTON */
                .al-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    letter-spacing: 0.2px;
                    transition: all 0.2s;
                    font-family: inherit;
                    margin-top: 8px;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .al-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
                    box-shadow: 0 6px 28px rgba(99,102,241,0.45);
                    transform: translateY(-1px);
                }
                .al-btn:active:not(:disabled) { transform: translateY(0); }
                .al-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* BACK LINK */
                .al-back {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 28px;
                    font-size: 12.5px;
                    color: rgba(148,163,184,0.4);
                    text-decoration: none;
                    justify-content: center;
                    transition: color 0.15s;
                }
                .al-back:hover { color: rgba(148,163,184,0.7); }

                /* Security notice */
                .al-notice {
                    margin-top: 20px;
                    padding: 10px 14px;
                    background: rgba(99,102,241,0.05);
                    border: 1px solid rgba(99,102,241,0.1);
                    border-radius: 8px;
                    font-size: 11px;
                    color: rgba(148,163,184,0.4);
                    text-align: center;
                    line-height: 1.5;
                }
            `}</style>

            <div className="al-wrap">
                <div className="al-grid" />
                <div className="al-glow" />

                <div className="al-card">
                    {/* Shield Icon */}
                    <div className="al-icon">
                        <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <polyline points="9 12 11 14 15 10" />
                        </svg>
                    </div>

                    <div className="al-badge">
                        <span className="al-badge-dot" />
                        Admin Portal
                    </div>

                    <h1 className="al-heading">Administrator<br />Access</h1>
                    <p className="al-sub">Restricted to authorized personnel only</p>

                    {/* Error */}
                    {error && (
                        <div className="al-error">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="al-field">
                            <label className="al-label">Admin Email</label>
                            <input
                                id="admin-email"
                                type="email"
                                className="al-input"
                                placeholder="admin@yourdomain.com"
                                value={email}
                                autoComplete="username"
                                onChange={(e) => { setEmail(e.target.value); setError('') }}
                            />
                        </div>

                        <div className="al-field">
                            <label className="al-label">Password</label>
                            <div className="al-pw">
                                <input
                                    id="admin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="al-input"
                                    placeholder="••••••••••"
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                                />
                                <button
                                    type="button"
                                    className="al-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="al-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Access Admin Panel
                                </>
                            )}
                        </button>
                    </form>

                    <div className="al-notice">
                        🔒 All access attempts are logged and monitored.
                    </div>

                    <Link href="/" className="al-back">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Safarnama
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    )
}
