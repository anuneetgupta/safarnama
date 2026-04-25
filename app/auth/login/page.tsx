'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'

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
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })
            setLoading(false)
            if (result?.error) {
                setErrors({ email: '', password: 'Invalid email or password' })
            } else {
                const res = await fetch('/api/auth/session')
                const session = await res.json()
                const role = session?.user?.role
                router.push(role === 'admin' ? '/admin' : '/dashboard')
            }
        }
    }

    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: '/dashboard' })
    }

    return (
        <>
            <style>{`
                .login-wrap {
                    min-height: calc(100vh - 80px);
                    background: #080f08;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 16px;
                    position: relative;
                    overflow: hidden;
                    font-family: var(--font-inter, 'Inter', sans-serif);
                }

                /* Same mountain background as home hero */
                .login-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }
                .login-bg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center top;
                }
                .login-bg-overlay1 {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(8,15,8,0.92) 0%, rgba(8,15,8,0.55) 55%, rgba(8,15,8,0.85) 100%);
                }
                .login-bg-overlay2 {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, rgba(8,15,8,0.4) 0%, transparent 30%, rgba(8,15,8,0.9) 100%);
                }

                /* Grid pattern overlay */
                .login-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(132,204,22,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(132,204,22,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    z-index: 1;
                    pointer-events: none;
                }

                /* Glow orb */
                .login-glow {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    height: 400px;
                    background: radial-gradient(ellipse, rgba(132,204,22,0.06) 0%, transparent 65%);
                    z-index: 1;
                    pointer-events: none;
                }

                /* SPLIT CARD */
                .login-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 960px;
                    min-height: 540px;
                    display: flex;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(132,204,22,0.12);
                    box-shadow: 0 0 0 1px rgba(132,204,22,0.04), 0 24px 80px rgba(0,0,0,0.7);
                }

                /* LEFT: form */
                .lc-form {
                    width: 44%;
                    min-width: 300px;
                    flex-shrink: 0;
                    background: rgba(8,15,8,0.88);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border-right: 1px solid rgba(132,204,22,0.1);
                    padding: 52px 48px 44px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                /* RIGHT: visual */
                .lc-visual {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    background: rgba(5,10,5,0.3);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                }
                .lc-visual::before {
                    content: '';
                    position: absolute;
                    top: 10%;
                    right: 5%;
                    width: 260px;
                    height: 260px;
                    background: radial-gradient(circle, rgba(132,204,22,0.08) 0%, transparent 65%);
                    pointer-events: none;
                }

                /* Right panel text content */
                .lc-visual-body {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 48px 40px;
                }

                /* LOGO */
                .lc-logo { margin-bottom: 8px; }
                .lc-logo img { height: 36px; width: auto; object-fit: contain; }

                /* HEADING */
                .lc-heading {
                    font-size: 36px;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -0.4px;
                    line-height: 1.1;
                    margin-bottom: 28px;
                    font-family: var(--font-outfit, 'Outfit', sans-serif);
                }

                /* FIELD */
                .lc-field { margin-bottom: 16px; }
                .lc-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: rgba(180,200,140,0.7);
                    margin-bottom: 7px;
                    letter-spacing: 0.3px;
                    text-transform: uppercase;
                }
                .lc-input {
                    width: 100%;
                    padding: 13px 20px;
                    border: 1.5px solid rgba(132,204,22,0.15);
                    border-radius: 50px;
                    font-size: 14px;
                    color: #e2e8f0;
                    background: rgba(132,204,22,0.04);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    font-family: inherit;
                }
                .lc-input::placeholder { color: rgba(148,163,184,0.3); }
                .lc-input:focus {
                    border-color: rgba(132,204,22,0.5);
                    background: rgba(132,204,22,0.06);
                    box-shadow: 0 0 0 3px rgba(132,204,22,0.07);
                }
                .lc-input.err { border-color: rgba(239,68,68,0.5); }
                .lc-err {
                    color: #f87171;
                    font-size: 11px;
                    margin-top: 5px;
                    margin-left: 16px;
                }

                /* PASSWORD */
                .lc-pw { position: relative; }
                .lc-pw .lc-input { padding-right: 48px; }
                .lc-eye {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: rgba(132,204,22,0.4);
                    display: flex;
                    align-items: center;
                    padding: 0;
                    transition: color 0.15s;
                }
                .lc-eye:hover { color: rgba(132,204,22,0.8); }

                /* FORGOT */
                .lc-forgot {
                    display: inline-block;
                    font-size: 12px;
                    color: #84cc16;
                    text-decoration: none;
                    margin-top: 9px;
                    margin-bottom: 22px;
                    font-weight: 500;
                    transition: color 0.15s;
                }
                .lc-forgot:hover { color: #a3e635; }

                /* SIGN IN BTN */
                .lc-btn {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
                    color: #050c05;
                    border: none;
                    border-radius: 50px;
                    font-size: 15.5px;
                    font-weight: 800;
                    cursor: pointer;
                    letter-spacing: 0.3px;
                    transition: all 0.2s;
                    font-family: inherit;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 24px rgba(132,204,22,0.25);
                }
                .lc-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #a3e635 0%, #84cc16 100%);
                    box-shadow: 0 6px 32px rgba(132,204,22,0.4);
                    transform: translateY(-1px);
                }
                .lc-btn:active:not(:disabled) { transform: translateY(0); }
                .lc-btn:disabled { opacity: 0.55; cursor: not-allowed; }

                /* DIVIDER */
                .lc-divider {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 18px;
                }
                .lc-div-line { flex: 1; height: 1px; background: rgba(132,204,22,0.1); }
                .lc-div-txt {
                    font-size: 11px;
                    color: rgba(132,204,22,0.35);
                    white-space: nowrap;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                /* SOCIAL */
                .lc-social { display: flex; justify-content: center; gap: 12px; margin-bottom: 24px; }
                .lc-soc-btn {
                    width: 76px;
                    height: 46px;
                    border-radius: 50px;
                    border: 1.5px solid rgba(132,204,22,0.15);
                    background: rgba(132,204,22,0.04);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
                    padding: 0;
                }
                .lc-soc-btn:hover {
                    border-color: rgba(132,204,22,0.4);
                    background: rgba(132,204,22,0.08);
                    box-shadow: 0 2px 12px rgba(132,204,22,0.1);
                }

                /* REGISTER */
                .lc-register { text-align: center; font-size: 12.5px; color: rgba(180,200,140,0.45); }
                .lc-register a { color: #a3e635; font-weight: 700; text-decoration: none; }
                .lc-register a:hover { color: #d4a843; }

                /* Right side content */
                .lc-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #a3e635;
                    background: rgba(132,204,22,0.08);
                    border: 1px solid rgba(132,204,22,0.2);
                    padding: 5px 14px;
                    border-radius: 100px;
                    margin-bottom: 20px;
                    width: fit-content;
                }
                .lc-badge-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #a3e635;
                    animation: pulse-dot 2s infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.7; }
                }
                .lc-right-title {
                    font-size: 42px;
                    font-weight: 800;
                    color: white;
                    line-height: 1.05;
                    letter-spacing: -0.5px;
                    margin-bottom: 16px;
                    font-family: var(--font-outfit, 'Outfit', sans-serif);
                }
                .lc-right-title span {
                    background: linear-gradient(135deg, #a3e635, #d4a843);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .lc-right-sub {
                    font-size: 14px;
                    color: rgba(200,220,160,0.6);
                    line-height: 1.7;
                    max-width: 280px;
                    margin-bottom: 28px;
                }
                .lc-stats { display: flex; gap: 24px; margin-bottom: 28px; }
                .lc-stat-val {
                    font-size: 22px;
                    font-weight: 800;
                    color: white;
                    font-family: var(--font-outfit, 'Outfit', sans-serif);
                }
                .lc-stat-lbl { font-size: 11px; color: rgba(180,200,140,0.45); margin-top: 2px; }

                .lc-testimonial {
                    background: rgba(10,18,8,0.7);
                    border: 1px solid rgba(132,204,22,0.12);
                    border-radius: 14px;
                    padding: 18px 20px;
                    backdrop-filter: blur(12px);
                }
                .lc-stars { color: #fbbf24; font-size: 13px; margin-bottom: 8px; }
                .lc-quote { font-size: 12.5px; color: rgba(200,220,160,0.7); line-height: 1.6; margin-bottom: 12px; }
                .lc-avatar {
                    width: 30px; height: 30px; border-radius: 50%;
                    background: linear-gradient(135deg, #84cc16, #d4a843);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 800; color: #050c05;
                    flex-shrink: 0;
                }
                .lc-author-name { font-size: 12px; font-weight: 700; color: white; }
                .lc-author-sub { font-size: 10px; color: rgba(180,200,140,0.4); }

                /* RESPONSIVE */
                @media (max-width: 700px) {
                    .login-card { flex-direction: column; min-height: unset; }
                    .lc-form { width: 100%; padding: 36px 24px; border-right: none; }
                    .lc-visual { display: none; }
                }
            `}</style>

            <div className="login-wrap">

                {/* Background — same mountain photo as home */}
                <div className="login-bg">
                    <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85"
                        alt=""
                    />
                    <div className="login-bg-overlay1" />
                    <div className="login-bg-overlay2" />
                </div>
                <div className="login-grid" />
                <div className="login-glow" />

                {/* CARD */}
                <div className="login-card">

                    {/* ── LEFT: Login Form ── */}
                    <div className="lc-form">

                        <div className="lc-logo">
                            <Link href="/">
                                <img src="/logo.png" alt="Safarnama" />
                            </Link>
                        </div>

                        <h1 className="lc-heading">Login</h1>

                        <form onSubmit={handleSubmit} noValidate>

                            <div className="lc-field">
                                <label className="lc-label">Email</label>
                                <input
                                    type="email"
                                    className={`lc-input${errors.email ? ' err' : ''}`}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }) }}
                                />
                                {errors.email && <p className="lc-err">{errors.email}</p>}
                            </div>

                            <div className="lc-field">
                                <label className="lc-label">Password</label>
                                <div className="lc-pw">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`lc-input${errors.password ? ' err' : ''}`}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }) }}
                                    />
                                    <button type="button" className="lc-eye" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="lc-err">{errors.password}</p>}
                            </div>

                            <Link href="/auth/forgot-password" className="lc-forgot">Forgot Password?</Link>

                            <button type="submit" className="lc-btn" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className="lc-divider">
                                <div className="lc-div-line" />
                                <span className="lc-div-txt">Or continue with</span>
                                <div className="lc-div-line" />
                            </div>

                            <div className="lc-social">
                                <button type="button" className="lc-soc-btn" onClick={() => handleSocialLogin('google')} aria-label="Google">
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                </button>
                                <button type="button" className="lc-soc-btn" onClick={() => handleSocialLogin('x')} aria-label="X">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </button>
                                <button type="button" className="lc-soc-btn" onClick={() => handleSocialLogin('facebook')} aria-label="Facebook">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </button>
                            </div>
                        </form>

                        <p className="lc-register">
                            Don&apos;t have an account yet?{' '}
                            <Link href="/auth/register">Register for free</Link>
                        </p>
                    </div>

                    {/* ── RIGHT: Visual Panel ── */}
                    <div className="lc-visual">
                        <div className="lc-visual-body">

                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
                                >
                                    {/* Additional ambient glow behind the character */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(132,204,22,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }} />
                                    <img src="/3d-guy.png" alt="Student traveler" style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
                                </motion.div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}
