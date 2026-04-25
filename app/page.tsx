'use client'

<<<<<<< HEAD
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

/* ──────────────────────────────────────────
   TYPES & DATA
────────────────────────────────────────── */
const FOREST_BG = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&q=72'
const HERO_BG   = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85'

const FEATURES = [
    { icon: '🏕️', title: 'Group Travel Made Easy',    desc: 'Book as a group, split costs, coordinate everything in one place.' },
    { icon: '🛡️', title: 'Safe & Verified Trips',     desc: 'Every trip vetted by our team. Experienced leaders, verified stays, 24/7 support.' },
    { icon: '💰', title: 'Student-Friendly Pricing',  desc: 'Exclusive deals, EMI starting ₹3,000, and flexible payment options.' },
    { icon: '🗺️', title: 'Curated Itineraries',       desc: 'Handpicked routes covering the best of each destination — no planning needed.' },
    { icon: '👥', title: 'Meet Your Tribe',            desc: 'Travel with like-minded students. Come as strangers, leave as friends.' },
    { icon: '📱', title: 'Real-Time Updates',          desc: 'Live trip tracking, instant notifications, WhatsApp group for every trip.' },
]

const DESTINATIONS = [
    { name: 'Banaras Vibes',    price: '₹3,000',      priceCls: 'lime',  status: 'COMPLETED', badgeCls: 'completed', date: '15 Jan – 18 Jan 2024', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80' },
    { name: 'Manali Adventure', price: 'Coming Soon',  priceCls: 'muted', status: 'NEXT',      badgeCls: 'next',      date: '',                     img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
    { name: 'Goa Getaway',      price: 'Booking Open', priceCls: 'lime',  status: 'OPEN',      badgeCls: 'open',      date: '',                     img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80' },
    { name: 'Rishikesh Rush',   price: 'TBA',          priceCls: 'muted', status: 'SOON',      badgeCls: 'soon',      date: '',                     img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
]

const TESTIMONIALS = [
    { name: 'Riya Sharma',  college: 'IIT Delhi',      trip: 'Banaras Vibes', text: 'Best trip of my life. The Ganga Aarti was magical. Safarnama handled everything perfectly!', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
    { name: 'Arjun Mehta',  college: 'DU North Campus', trip: 'Banaras Vibes', text: 'At ₹3,000 for 3 nights, I expected nothing. Got everything. Will book Manali for sure!',     avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    { name: 'Priya Verma',  college: 'BITS Pilani',    trip: 'Banaras Vibes', text: 'As a solo female traveler, I felt completely safe. The group was amazing. 10/10!',             avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
    { name: 'Karan Singh',  college: 'CSJMU Kanpur',   trip: 'Banaras Vibes', text: 'Went alone, came back with 20 new friends. That is the Safarnama magic.',                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
]

const BADGE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    completed: { bg: 'rgba(20,35,3,0.88)', color: '#a3e635', border: 'rgba(163,230,53,0.45)' },
    next:      { bg: 'rgba(35,25,3,0.88)', color: '#fbbf24', border: 'rgba(251,191,36,0.45)' },
    open:      { bg: 'rgba(20,35,3,0.88)', color: '#a3e635', border: 'rgba(163,230,53,0.40)' },
    soon:      { bg: 'rgba(35,25,3,0.88)', color: '#fbbf24', border: 'rgba(251,191,36,0.40)' },
}

const PRICE_COLORS: Record<string, string> = {
    lime:  '#a3e635',
    muted: 'rgba(200,215,160,0.65)',
}

/* ──────────────────────────────────────────
   HELPERS
────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-50px' })
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
=======
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import TripCard from '@/components/home/TripCard'
import AnimatedTitle from '@/components/ui/AnimatedTitle'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { DEMO_TRIPS } from '@/lib/data'


// ── MAGNETIC BUTTON ────────────────────────────────────────────
function MagneticBtn({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    const ref = useRef<HTMLAnchorElement>(null)
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const handleMove = (e: React.MouseEvent) => {
        const r = ref.current!.getBoundingClientRect()
        setPos({ x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35 })
    }
    return (
        <motion.a ref={ref} href={href} className={className}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onMouseMove={handleMove}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            whileTap={{ scale: 0.95 }}
        >{children}</motion.a>
    )
}

// ── SCROLL REVEAL ──────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'scale' }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    const variants = {
        up:    { hidden: { y: 60, opacity: 0 },    visible: { y: 0, opacity: 1 } },
        left:  { hidden: { x: -60, opacity: 0 },   visible: { x: 0, opacity: 1 } },
        right: { hidden: { x: 60, opacity: 0 },    visible: { x: 0, opacity: 1 } },
        scale: { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
    }
    return (
        <motion.div ref={ref} variants={variants[direction]}
            initial="hidden" animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
>>>>>>> 11800fe86b49fb8a43b65e6a6402cc6621bbebf2
            {children}
        </motion.div>
    )
}

<<<<<<< HEAD
/* ──────────────────────────────────────────
   PAGE
────────────────────────────────────────── */
export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
    const [activeT, setActiveT] = useState(0)

    // Auto-advance testimonials
    useEffect(() => {
        const id = setInterval(() => setActiveT(p => (p + 1) % TESTIMONIALS.length), 5000)
        return () => clearInterval(id)
    }, [])

    /* shared overlay layers */
    const darkOverlay    = { position: 'absolute' as const, inset: 0, background: 'rgba(6,5,1,0.80)' }
    const forestBgStyle  = { position: 'absolute' as const, inset: 0 }

    return (
        <main style={{ background: '#0c0900', overflowX: 'hidden' }}>

            {/* ═══════════════════════════════════
                HERO
            ═══════════════════════════════════ */}
            <section ref={heroRef} style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>

                {/* Parallax BG */}
                <motion.div style={{ ...forestBgStyle, zIndex: 0, y: heroY }}>
                    <img src={HERO_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(5,4,1,0.4) 0%,rgba(5,4,1,0.08) 35%,rgba(5,4,1,0.15) 60%,rgba(5,4,1,0.78) 80%,rgba(5,4,1,0.97) 100%)' }} />
                </motion.div>

                {/* Scan line */}
                <motion.div style={{ position: 'absolute', left: 0, right: 0, height: '1px', zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(to right,transparent,rgba(163,230,53,0.38),transparent)' }}
                    animate={{ y: ['-100vh', '100vh'] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 5 }} />

                {/* Content wrapper fades on scroll */}
                <motion.div style={{ opacity: heroOpacity, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                    {/* ── Main hero ── */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 60px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

                        {/* Badge */}
                        <motion.div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
                            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <motion.div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#a3e635' }}
                                animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#a3e635' }}>
                                India&apos;s #1 Student Travel Platform
                            </span>
                        </motion.div>

                        {/* SAFARNAMA */}
                        <motion.h1
                            style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(80px,12vw,148px)', lineHeight: 0.9, letterSpacing: '0.04em', color: '#fff', textShadow: '0 0 80px rgba(132,204,22,0.2),0 4px 40px rgba(0,0,0,0.9)', marginBottom: '20px', whiteSpace: 'nowrap' }}
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                            SAFAR<span style={{ color: '#a3e635' }}>NA</span>MA
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p style={{ fontSize: '17px', color: 'rgba(210,225,175,0.75)', marginBottom: '40px', lineHeight: 1.6 }}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                            Create Your Outdoor Adventure. Explore India With Your Tribe.
                        </motion.p>

                        {/* Buttons */}
                        <motion.div style={{ display: 'flex', gap: '16px', marginBottom: '36px', flexWrap: 'wrap', justifyContent: 'center' }}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                            <a href="#trips" style={{ padding: '16px 40px', background: 'linear-gradient(135deg,#84cc16 0%,#5a9c1a 100%)', color: '#fff', fontWeight: 700, fontSize: '16px', borderRadius: '10px', textDecoration: 'none', boxShadow: '0 4px 24px rgba(132,204,22,0.38)', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'transform 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                                Explore Trips &rarr;
                            </a>
                            <a href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU" target="_blank" rel="noopener noreferrer"
                                style={{ padding: '16px 40px', background: 'rgba(12,9,3,0.72)', color: 'rgba(240,244,232,0.92)', fontWeight: 700, fontSize: '16px', borderRadius: '10px', textDecoration: 'none', border: '1px solid rgba(200,220,160,0.25)', backdropFilter: 'blur(8px)', display: 'inline-flex', alignItems: 'center', transition: 'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(22,16,4,0.85)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(12,9,3,0.72)')}>
                                Join Community
                            </a>
                        </motion.div>

                        {/* Tags */}
                        <motion.div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                            {[['🏕️', 'Group Adventures'], ['🗺️', 'Curated Routes'], ['🛡️', 'Safe & Verified']].map(([icon, text]) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.18)', borderRadius: '12px', fontSize: '13px', fontWeight: 500, color: 'rgba(190,215,145,0.88)' }}>
                                    <span>{icon}</span>{text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── "READY TO START YOUR JOURNEY?" block at bottom of hero ── */}
                    <motion.div
                        style={{ textAlign: 'center', padding: '70px 24px 90px', position: 'relative', zIndex: 2, background: 'linear-gradient(to bottom,transparent 0%,rgba(5,4,1,0.6) 100%)' }}
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(36px,6vw,68px)', lineHeight: 1.05, letterSpacing: '0.04em', color: '#fff', marginBottom: '8px' }}>
                            READY TO START YOUR
                        </h2>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(36px,6vw,68px)', lineHeight: 1.05, letterSpacing: '0.04em', color: '#a3e635', marginBottom: '18px' }}>
                            JOURNEY?
                        </h2>
                        <p style={{ fontSize: '15px', color: 'rgba(200,215,160,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
                            Create Your Outdoor Adventure. Explore India With <span style={{ color: '#a3e635' }}>✦</span> Your Tribe.
                        </p>
                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="#trips" style={{ padding: '15px 36px', background: 'linear-gradient(135deg,#84cc16 0%,#5a9c1a 100%)', color: '#fff', fontWeight: 700, fontSize: '15px', borderRadius: '9px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(132,204,22,0.35)', transition: 'transform 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                                Explore Trips &rarr;
                            </a>
                            <a href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU" target="_blank" rel="noopener noreferrer"
                                style={{ padding: '15px 36px', background: 'rgba(12,9,3,0.65)', color: 'rgba(240,244,232,0.9)', fontWeight: 600, fontSize: '15px', borderRadius: '9px', border: '1px solid rgba(200,220,160,0.22)', textDecoration: 'none', backdropFilter: 'blur(6px)', transition: 'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(22,16,4,0.82)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(12,9,3,0.65)')}>
                                Join Community
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════
                FEATURES — "Built for the Student Explorer"
            ═══════════════════════════════════ */}
            <section style={{ position: 'relative', padding: '80px 0 72px', overflow: 'hidden' }}>
                {/* Forest BG */}
                <div style={forestBgStyle}>
                    <img src={FOREST_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,5,1,0.80)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(163,230,53,0.07) 0%,transparent 60%)' }} />
=======
// ── GLASS CARD ─────────────────────────────────────────────────
function GlassCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const [glow, setGlow] = useState({ x: 50, y: 50 })
    const [hov, setHov] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const handleMove = (e: React.MouseEvent) => {
        const r = ref.current!.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        setTilt({ x: (y - 0.5) * -18, y: (x - 0.5) * 18 })
        setGlow({ x: x * 100, y: y * 100 })
    }
    return (
        <Reveal delay={delay} direction="scale">
            <div ref={ref} className={`relative overflow-hidden rounded-2xl ${className}`}
                style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hov ? 1.03 : 1})`,
                    transition: hov ? 'transform 0.1s ease' : 'transform 0.5s ease',
                    background: 'rgba(10,18,8,0.7)',
                    border: '1px solid rgba(132,204,22,0.15)',
                    backdropFilter: 'blur(20px)',
                }}
                onMouseMove={handleMove}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHov(false) }}
            >
                {hov && <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(132,204,22,0.1) 0%, transparent 60%)` }} />}
                {children}
            </div>
        </Reveal>
    )
}

const FEATURES = [
    { icon: '🏕️', title: 'Group Travel Made Easy', desc: 'Book as a group, split costs, coordinate everything in one place. No stress, just adventure.' },
    { icon: '🛡️', title: 'Safe & Verified Trips', desc: 'Every trip vetted by our team. Experienced leaders, verified stays, 24/7 support.' },
    { icon: '💰', title: 'Student-Friendly Pricing', desc: 'Exclusive deals and EMI options designed for student budgets. Starting ₹3,000.' },
    { icon: '🗺️', title: 'Curated Itineraries', desc: 'Handcrafted routes covering the best of each destination — no planning needed.' },
    { icon: '👥', title: 'Meet Your Tribe', desc: 'Travel with like-minded students. Come as strangers, leave as lifelong friends.' },
    { icon: '📱', title: 'Real-Time Updates', desc: 'Live trip tracking, instant notifications, and a dedicated WhatsApp group for every trip.' },
]

const HOW_STEPS = [
    { num: '01', title: 'Browse Trips', desc: 'Explore our curated destinations and find your perfect adventure.' },
    { num: '02', title: 'Register & Pay', desc: 'Quick registration, secure payment, instant confirmation.' },
    { num: '03', title: 'Pack & Go', desc: 'We handle everything. You just show up and explore.' },
]

const DESTINATIONS = [
    { name: 'Banaras Vibes', place: 'Varanasi, UP', price: '₹3,000', status: 'Completed', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', color: '#84cc16' },
    { name: 'Manali Adventure', place: 'Himachal Pradesh', price: 'Coming Soon', status: 'Next', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', color: '#d4a843' },
    { name: 'Goa Getaway', place: 'Goa, India', price: 'Booking Open', status: 'Open', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80', color: '#a3e635' },
    { name: 'Rishikesh Rush', place: 'Uttarakhand', price: 'TBA', status: 'Soon', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', color: '#f0c060' },
]

const TESTIMONIALS = [
    { name: 'Riya Sharma', college: 'IIT Delhi', text: 'Best trip of my life. The Ganga Aarti was magical. Safarnama handled everything perfectly!', rating: 5, avatar: 'R', trip: 'Banaras Vibes' },
    { name: 'Arjun Mehta', college: 'DU North Campus', text: 'At ₹3,000 for 3 nights, I expected nothing. Got everything. Will book Manali for sure!', rating: 5, avatar: 'A', trip: 'Banaras Vibes' },
    { name: 'Priya Verma', college: 'BITS Pilani', text: 'As a solo female traveler, I felt completely safe. The group was amazing. 10/10!', rating: 5, avatar: 'P', trip: 'Banaras Vibes' },
    { name: 'Karan Singh', college: 'CSJMU Kanpur', text: 'Went alone, came back with 20 new friends. That is the Safarnama magic.', rating: 5, avatar: 'K', trip: 'Banaras Vibes' },
]

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
    const springY = useSpring(heroY, { stiffness: 100, damping: 30 })
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    return (
        <main style={{ background: '#080f08', overflowX: 'hidden' }}>

            {/* ══ HERO ══════════════════════════════════════════ */}
            <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 'calc(100vh - 80px)' }}>

                {/* Parallax background photo */}
                <motion.div style={{ y: springY, scale: heroScale }} className="absolute inset-0 z-[1]">
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,15,8,0.85) 0%, rgba(8,15,8,0.4) 50%, rgba(8,15,8,0.7) 100%)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,15,8,0.3) 0%, transparent 30%, rgba(8,15,8,0.95) 100%)' }} />
                </motion.div>

                {/* Animated scan line */}
                <motion.div className="absolute left-0 right-0 h-px z-[3] pointer-events-none"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(132,204,22,0.3), transparent)' }}
                    animate={{ y: ['-100vh', '100vh'] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 5 }} />

                {/* Hero content */}
                <motion.div style={{ opacity: heroOpacity }} className="relative z-[3] flex flex-col justify-center container-main pt-[100px] pb-20 lg:pt-20" style={{ minHeight: 'calc(100vh - 80px)' }}>

                    {/* Badge */}
                    <motion.div className="flex items-center gap-2 mb-8 w-fit"
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <motion.div className="w-2 h-2 rounded-full bg-lime-400"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }} />
                        <span className="text-lime-400 text-xs font-bold uppercase tracking-[0.25em]">India&apos;s #1 Student Travel Platform</span>
                    </motion.div>

                    {/* Mega title — char by char */}
                    <div className="mb-6" style={{ overflow: 'hidden' }}>
                        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 9vw, 9rem)', lineHeight: 0.88, letterSpacing: '0.04em', textShadow: '0 0 100px rgba(132,204,22,0.25), 0 4px 40px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>
                            <AnimatedTitle text="SAFARNAMA" delay={0.3} stagger={0.07} />
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <motion.p className="text-lg mb-10 max-w-[520px] leading-relaxed"
                        style={{ color: 'rgba(200,220,160,0.75)', letterSpacing: '0.03em' }}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                        Create Your Outdoor Adventure. Explore India With Your Tribe.
                    </motion.p>

                    {/* CTA buttons — magnetic */}
                    <motion.div className="flex flex-wrap gap-4 mb-14"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
                        <MagneticBtn href="#trips" className="btn-primary px-9 py-4 text-base font-bold">
                            Explore Trips ✦
                        </MagneticBtn>
                        <MagneticBtn href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU?mode=gi_t"
                            className="btn-secondary px-9 py-4 text-base font-bold">
                            Join Community
                        </MagneticBtn>
                    </motion.div>

                    {/* Feature pills grid */}
                    <motion.div className="grid grid-cols-2 gap-3 max-w-[380px]"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                        {[
                            { icon: '🏕️', text: 'Group Adventures' },
                            { icon: '🗺️', text: 'Curated Routes' },
                            { icon: '🛡️', text: 'Safe & Verified' },
                            { icon: '⭐', text: '1000+ Trips Done' },
                        ].map((item, i) => (
                            <motion.div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                                style={{ background: 'rgba(132,204,22,0.07)', border: '1px solid rgba(132,204,22,0.15)' }}
                                whileHover={{ scale: 1.05, borderColor: 'rgba(132,204,22,0.4)' }}>
                                <span>{item.icon}</span>
                                <span className="text-xs font-semibold" style={{ color: 'rgba(180,210,140,0.8)' }}>{item.text}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[3]"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                    <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: 'rgba(132,204,22,0.5)' }}>Scroll</span>
                    <motion.div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(132,204,22,0.6), transparent)' }}
                        animate={{ scaleY: [0, 1, 0], originY: 0 }} transition={{ duration: 1.5, repeat: Infinity }} />
                </motion.div>
            </section>

            {/* ══ ANIMATED STATS ════════════════════════════════ */}
            <section className="py-24 relative overflow-hidden" style={{ background: 'rgba(10,18,8,0.9)', borderTop: '1px solid rgba(132,204,22,0.08)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                <div className="absolute inset-0 grid-pattern opacity-40" />
                <div className="container-main relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { end: 12000, suffix: '+', label: 'Happy Travelers', icon: '🧭' },
                            { end: 80, suffix: '+', label: 'Destinations', icon: '🏔️' },
                            { end: 49, suffix: '★', prefix: '4.', label: 'Average Rating', icon: '⭐' },
                            { end: 200, suffix: '+', label: 'Trips Completed', icon: '✈️' },
                        ].map((s, i) => (
                            <Reveal key={s.label} delay={i * 0.1}>
                                <div className="text-center group">
                                    <motion.div className="text-3xl mb-2" whileHover={{ scale: 1.3, rotate: 10 }} transition={{ type: 'spring' }}>{s.icon}</motion.div>
                                    <div className="text-3xl font-extrabold text-white font-[var(--font-outfit)]">
                                        <AnimatedCounter end={s.end} suffix={s.suffix} prefix={s.prefix} />
                                    </div>
                                    <div className="text-sm mt-1" style={{ color: 'rgba(180,200,140,0.5)' }}>{s.label}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
>>>>>>> 11800fe86b49fb8a43b65e6a6402cc6621bbebf2
                </div>

<<<<<<< HEAD
                <div className="container-main" style={{ position: 'relative', zIndex: 2 }}>
                    {/* Heading */}
                    <Reveal>
                        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                                Built for the <span style={{ color: '#a3e635' }}>Student Explorer</span>
                            </h2>
                            <div style={{ width: '80px', height: '2px', background: 'linear-gradient(to right,transparent,#d4a843,transparent)', margin: '14px auto 0' }} />
                        </div>
                    </Reveal>

                    {/* 3×2 grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px' }} className="features-grid">
                        {FEATURES.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.08}>
                                <motion.div style={{ padding: '24px 22px', borderRadius: '16px', background: 'rgba(5,4,1,0.55)', border: '1px solid rgba(163,230,53,0.14)', backdropFilter: 'blur(18px)', height: '100%' }}
                                    whileHover={{ y: -5, borderColor: 'rgba(163,230,53,0.32)', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}
                                    transition={{ duration: 0.3 }}>
                                    <motion.div style={{ fontSize: '28px', marginBottom: '12px', lineHeight: 1 }} whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: 'spring' }}>{f.icon}</motion.div>
                                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>{f.title}</h3>
                                    <p style={{ fontSize: '13px', color: 'rgba(180,200,140,0.58)', lineHeight: 1.65 }}>{f.desc}</p>
                                </motion.div>
=======
            {/* ══ FEATURES — 3D GLASS CARDS ═════════════════════ */}
            <section className="py-32 relative overflow-hidden" style={{ background: '#0d150b' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(132,204,22,0.06) 0%, transparent 70%)' }} />
                <div className="container-main relative z-10">
                    <div className="text-center mb-24">
                        <Reveal><div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.2)', color: '#a3e635' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />Why Safarnama
                        </div></Reveal>
                        <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Built for the <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Student Explorer</span>
                        </h2></Reveal>
                        <Reveal delay={0.2}><p className="text-base max-w-md mx-auto" style={{ color: 'rgba(180,200,140,0.6)' }}>Everything you need for the perfect group trip — in one platform.</p></Reveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.map((f, i) => (
                            <GlassCard key={f.title} delay={i * 0.08} className="p-7">
                                <motion.div className="text-4xl mb-4" whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: 'spring' }}>{f.icon}</motion.div>
                                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(180,200,140,0.6)' }}>{f.desc}</p>
                                <div className="mt-4 h-px" style={{ background: 'linear-gradient(to right, rgba(132,204,22,0.3), transparent)' }} />
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ HOW IT WORKS — ANIMATED FLOW ══════════════════ */}
            <section className="py-32 relative overflow-hidden" style={{ background: '#111a0f' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,168,67,0.05) 0%, transparent 70%)' }} />
                <div className="container-main relative z-10">
                    <div className="text-center mb-24">
                        <Reveal><h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            How It <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Works</span>
                        </h2></Reveal>
                        <Reveal delay={0.1}><p className="text-base" style={{ color: 'rgba(180,200,140,0.6)' }}>Three simple steps to your next adventure</p></Reveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px" style={{ background: 'linear-gradient(to right, rgba(132,204,22,0.4), rgba(212,168,67,0.4))' }}>
                            <motion.div className="h-full" style={{ background: 'linear-gradient(to right, #a3e635, #d4a843)', transformOrigin: 'left' }}
                                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }} />
                        </div>
                        {HOW_STEPS.map((s, i) => (
                            <Reveal key={s.num} delay={i * 0.2} direction="up">
                                <div className="text-center p-8 rounded-2xl relative group" style={{ background: 'rgba(10,18,8,0.6)', border: '1px solid rgba(132,204,22,0.1)' }}>
                                    <motion.div className="text-5xl font-[var(--font-bebas)] mb-4 block"
                                        style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                                        whileHover={{ scale: 1.1 }}>{s.num}</motion.div>
                                    <h3 className="text-white font-bold text-xl mb-3">{s.title}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(180,200,140,0.6)' }}>{s.desc}</p>
                                    <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(132,204,22,0.06), transparent 70%)' }} />
                                </div>
>>>>>>> 11800fe86b49fb8a43b65e6a6402cc6621bbebf2
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* ═══════════════════════════════════
                HOW IT WORKS — with Destination Cards
            ═══════════════════════════════════ */}
            <section id="trips" style={{ position: 'relative', padding: '72px 0 80px', overflow: 'hidden' }}>
                <div style={forestBgStyle}>
                    <img src={FOREST_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,1,0.86)' }} />
                </div>

                <div className="container-main" style={{ position: 'relative', zIndex: 2 }}>
                    <Reveal>
                        <div style={{ textAlign: 'center', marginBottom: '0' }}>
                            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, color: '#fff' }}>
                                How It <span style={{ color: '#a3e635' }}>Works</span>
                            </h2>
                            <div style={{ width: '60px', height: '1.5px', background: 'linear-gradient(to right,transparent,rgba(212,168,67,0.5),transparent)', margin: '14px auto 10px' }} />
                            <p style={{ fontSize: '14px', color: 'rgba(200,210,160,0.52)', marginBottom: '48px', letterSpacing: '0.01em' }}>
                                Handpicked Adventures for Students. Limited slots — book early.
                            </p>
                        </div>
                    </Reveal>

                    {/* Destination cards — 4 columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }} className="trips-grid">
                        {DESTINATIONS.map((d, i) => {
                            const bs = BADGE_STYLES[d.badgeCls]
                            return (
                                <Reveal key={d.name} delay={i * 0.1}>
                                    <motion.div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '3/4', border: '1px solid rgba(163,230,53,0.12)', cursor: 'pointer' }}
                                        whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                                        transition={{ type: 'spring', stiffness: 280 }}>

                                        {/* Status badge — top-left */}
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, padding: '4px 9px', borderRadius: '6px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', background: bs.bg, color: bs.color, border: `1px solid ${bs.border}` }}>
                                            {d.status}
                                        </div>

                                        {/* Image */}
                                        <motion.img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            whileHover={{ scale: 1.1 }} transition={{ duration: 0.7 }} />

                                        {/* Gradient overlay */}
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(3,2,0,0.97) 0%,rgba(3,2,0,0.35) 45%,transparent 100%)' }} />

                                        {/* Bottom info */}
                                        <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', zIndex: 5 }}>
                                            {/* Second badge */}
                                            <div style={{ marginBottom: '6px' }}>
                                                <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', background: bs.bg.replace('0.88', '0.75'), color: bs.color, border: `1px solid ${bs.border.replace('0.45', '0.35')}` }}>
                                                    {d.status}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px', lineHeight: 1.25 }}>{d.name}</p>
                                            <p style={{ fontSize: d.priceCls === 'lime' ? '15px' : '13px', fontWeight: d.priceCls === 'lime' ? 800 : 600, color: PRICE_COLORS[d.priceCls], marginBottom: d.date ? '3px' : 0 }}>{d.price}</p>
                                            {d.date && <p style={{ fontSize: '11px', color: 'rgba(180,200,140,0.5)' }}>{d.date}</p>}
                                        </div>
                                    </motion.div>
                                </Reveal>
                            )
                        })}
=======
            {/* ══ DESTINATIONS — TILT CARDS ═════════════════════ */}
            <section id="trips" className="py-32 relative overflow-hidden" style={{ background: '#0d150b' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(132,204,22,0.04) 0%, transparent 60%)' }} />
                <div className="container-main relative z-10">
                    <div className="text-center mb-24">
                        <Reveal><h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Our <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Destinations</span>
                        </h2></Reveal>
                        <Reveal delay={0.1}><p className="text-base" style={{ color: 'rgba(180,200,140,0.6)' }}>Handpicked adventures for students. Limited slots — book early.</p></Reveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
                        {DESTINATIONS.map((d, i) => (
                            <Reveal key={d.name} delay={i * 0.1} direction="scale">
                                <motion.div className="relative rounded-2xl overflow-hidden group cursor-pointer"
                                    style={{ aspectRatio: '3/4', border: `1px solid ${d.color}22` }}
                                    whileHover={{ y: -10, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,15,8,0.95) 0%, rgba(8,15,8,0.2) 50%, transparent 100%)' }} />
                                    <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ background: `radial-gradient(circle at 50% 80%, ${d.color}20, transparent 70%)` }} />
                                    <div className="absolute bottom-5 left-5 right-5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full mb-2 inline-block"
                                            style={{ background: `${d.color}22`, color: d.color, border: `1px solid ${d.color}44` }}>{d.status}</span>
                                        <p className="text-white font-bold text-base">{d.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'rgba(180,200,140,0.6)' }}>{d.place}</p>
                                        <p className="font-bold text-sm mt-1" style={{ color: d.color }}>{d.price}</p>
                                    </div>
                                </motion.div>
                            </Reveal>
                        ))}
>>>>>>> 11800fe86b49fb8a43b65e6a6402cc6621bbebf2
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {DEMO_TRIPS.slice(0, 6).map((trip, i) => (
                            <TripCard key={trip.id} {...trip} index={i} />
                        ))}
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* ═══════════════════════════════════
                TESTIMONIALS — "What Travelers Say"
            ═══════════════════════════════════ */}
            <section style={{ position: 'relative', padding: '80px 0', overflow: 'hidden' }}>
                <div style={forestBgStyle}>
                    <img src={FOREST_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 45%' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,1,0.80)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(163,230,53,0.04) 0%,transparent 65%)' }} />
                </div>

                <div className="container-main" style={{ position: 'relative', zIndex: 2 }}>
                    <Reveal>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#fff' }}>
                                What Travelers <span style={{ color: '#a3e635' }}>Say</span>
                            </h2>
                        </div>
                    </Reveal>

                    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                        {/* Card */}
                        <div style={{ padding: '32px 36px', borderRadius: '18px', background: 'rgba(5,4,1,0.68)', border: '1px solid rgba(212,168,67,0.28)', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(212,168,67,0.07)' }}>
                            <AnimatePresence mode="wait">
                                <motion.div key={activeT}
                                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                                    transition={{ duration: 0.35 }}>
                                    {/* Stars */}
                                    <div style={{ fontSize: '18px', color: '#f59e0b', letterSpacing: '2px', marginBottom: '18px' }}>★★★★★</div>
                                    {/* Quote */}
                                    <p style={{ fontSize: '17px', color: '#fff', fontWeight: 500, lineHeight: 1.65, marginBottom: '26px' }}>
                                        &ldquo;{TESTIMONIALS[activeT].text}&rdquo;
                                    </p>
                                    {/* Author row */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={TESTIMONIALS[activeT].avatar} alt={TESTIMONIALS[activeT].name}
                                                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(163,230,53,0.3)', flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{TESTIMONIALS[activeT].name}</p>
                                                <p style={{ fontSize: '12px', color: 'rgba(180,200,140,0.5)' }}>{TESTIMONIALS[activeT].college} - {TESTIMONIALS[activeT].trip}</p>
                                            </div>
                                        </div>
                                        {/* Play button */}
                                        <motion.button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                                            whileHover={{ scale: 1.12, background: 'rgba(163,230,53,0.22)' }}>
                                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                                                <path d="M1 1l10 6L1 13V1z" fill="#a3e635" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Dots */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                            {TESTIMONIALS.map((_, i) => (
                                <motion.button key={i} onClick={() => setActiveT(i)}
                                    style={{ height: '8px', borderRadius: '4px', background: i === activeT ? '#a3e635' : 'rgba(163,230,53,0.22)', border: 'none', cursor: 'pointer', outline: 'none' }}
                                    animate={{ width: i === activeT ? 28 : 8 }}
                                    transition={{ duration: 0.3 }} />
=======
            {/* ══ TESTIMONIALS — SMOOTH SLIDER ══════════════════ */}
            <section className="py-32 relative overflow-hidden" style={{ background: '#111a0f' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(212,168,67,0.05) 0%, transparent 60%)' }} />
                <div className="container-main relative z-10">
                    <div className="text-center mb-20">
                        <Reveal><h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            What Travelers <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Say</span>
                        </h2></Reveal>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative overflow-hidden rounded-3xl p-12" style={{ background: 'rgba(10,18,8,0.8)', border: '1px solid rgba(132,204,22,0.12)', backdropFilter: 'blur(20px)' }}>
                            <motion.div key={activeTestimonial} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>
                                <div className="flex gap-0.5 mb-8">
                                    {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xl">★</span>)}
                                </div>
                                <p className="text-xl text-white leading-relaxed mb-10 font-medium">&ldquo;{TESTIMONIALS[activeTestimonial].text}&rdquo;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #84cc16, #d4a843)' }}>
                                        {TESTIMONIALS[activeTestimonial].avatar}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{TESTIMONIALS[activeTestimonial].name}</p>
                                        <p className="text-sm" style={{ color: 'rgba(180,200,140,0.5)' }}>{TESTIMONIALS[activeTestimonial].college} · {TESTIMONIALS[activeTestimonial].trip}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        <div className="flex justify-center gap-3 mt-8">
                            {TESTIMONIALS.map((_, i) => (
                                <motion.button key={i} onClick={() => setActiveTestimonial(i)}
                                    className="rounded-full transition-all duration-300"
                                    style={{ width: i === activeTestimonial ? '32px' : '10px', height: '10px', background: i === activeTestimonial ? '#a3e635' : 'rgba(132,204,22,0.25)' }}
                                    whileHover={{ scale: 1.2 }} />
>>>>>>> 11800fe86b49fb8a43b65e6a6402cc6621bbebf2
                            ))}
                        </div>
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* ═══════════════════════════════════
                FOUNDERS
            ═══════════════════════════════════ */}
            <section style={{ position: 'relative', padding: '80px 0', overflow: 'hidden' }}>
                <div style={forestBgStyle}>
                    <img src={FOREST_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 80%' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,1,0.80)' }} />
                </div>

                <div className="container-main" style={{ position: 'relative', zIndex: 2 }}>
                    {/* Heading with decorative lines */}
                    <Reveal>
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '10px' }}>
                                <div style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(to right,transparent,rgba(212,168,67,0.55))' }} />
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d4a843' }} />
                                <div style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(to left,transparent,rgba(212,168,67,0.55))' }} />
                            </div>
                            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#fff' }}>
                                Meet the <span style={{ color: '#a3e635' }}>Founders</span>
                            </h2>
                        </div>
                    </Reveal>

                    {/* Founder cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '24px', maxWidth: '640px', margin: '0 auto' }}>
                        {[
                            { name: 'Shivansh Tripathi', role: 'CEO & Founder', image: '/shivansh.jpeg', fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
                            { name: 'Atish',             role: 'Co-founder & CMO', image: '/atish.jpeg',    fallback: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80' },
                        ].map((m, i) => (
                            <Reveal key={m.name} delay={i * 0.15}>
                                <motion.div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(212,168,67,0.35)', boxShadow: '0 0 40px rgba(212,168,67,0.08)', cursor: 'pointer' }}
                                    whileHover={{ y: -6, boxShadow: '0 15px 50px rgba(212,168,67,0.16)', borderColor: 'rgba(212,168,67,0.52)' }}>
                                    {/* Photo */}
                                    <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                                        <motion.img src={m.image} alt={m.name}
                                            onError={(e) => { (e.target as HTMLImageElement).src = m.fallback }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                                            whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,3,0,0.92) 0%,rgba(4,3,0,0.2) 50%,transparent 100%)' }} />
                                    </div>
                                    {/* Name overlay */}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', textAlign: 'center', zIndex: 2 }}>
                                        <p style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '4px', fontFamily: "'Outfit',sans-serif" }}>{m.name}</p>
                                        <p style={{ fontSize: '13px', color: 'rgba(205,215,170,0.65)' }}>{m.role}</p>
                                    </div>
                                </motion.div>
                            </Reveal>
=======
            {/* ══ TEAM ══════════════════════════════════════════ */}
            <section className="py-32 relative overflow-hidden" style={{ background: '#0d150b' }}>
                <div className="container-main relative z-10">
                    <div className="text-center mb-20">
                        <Reveal><h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Meet the <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Founders</span>
                        </h2></Reveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[700px] mx-auto">
                        {[
                            { name: 'Shivansh Tripathi', role: 'CEO & Founder', image: '/shivansh.jpeg' },
                            { name: 'Atish', role: 'Co-founder & CMO', image: '/atish.jpeg' },
                        ].map((m, i) => (
                            <GlassCard key={m.name} delay={i * 0.15} className="p-8 flex flex-col items-center text-center">
                                <div className="relative w-full mb-6 rounded-xl overflow-hidden" style={{ height: '260px', border: '2px solid rgba(132,204,22,0.2)' }}>
                                    <img src={m.image} alt={m.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,15,8,0.6), transparent 60%)' }} />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{m.name}</h3>
                                <p className="text-sm font-semibold" style={{ color: '#a3e635' }}>{m.role}</p>
                            </GlassCard>
>>>>>>> 11800fe86b49fb8a43b65e6a6402cc6621bbebf2
                        ))}
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* ═══════════════════════════════════
                CTA — "READY TO START YOUR JOURNEY?"
            ═══════════════════════════════════ */}
            <section style={{ position: 'relative', padding: '100px 0 80px', overflow: 'hidden', textAlign: 'center' }}>
                <div style={forestBgStyle}>
                    <img src={FOREST_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 85%' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(5,4,1,0.78) 0%,rgba(5,4,1,0.60) 40%,rgba(5,4,1,0.82) 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%,rgba(163,230,53,0.06) 0%,transparent 55%)' }} />
                </div>

                <div className="container-main" style={{ position: 'relative', zIndex: 2 }}>
                    <Reveal>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(52px,8vw,112px)', lineHeight: 0.96, letterSpacing: '0.04em', color: '#fff', marginBottom: '20px' }}>
                            READY TO START<br />YOUR JOURNEY?
                        </h2>
                        <p style={{ fontSize: '15px', color: 'rgba(180,200,140,0.6)', marginBottom: '36px', lineHeight: 1.6 }}>
                            Join thousands of students who&apos;ve already discovered the joy of group travel.
                        </p>
                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="/auth/register"
                                style={{ padding: '16px 44px', background: 'linear-gradient(135deg,#84cc16 0%,#5a9c1a 100%)', color: '#fff', fontWeight: 700, fontSize: '16px', borderRadius: '10px', textDecoration: 'none', boxShadow: '0 4px 24px rgba(132,204,22,0.32)', display: 'inline-flex', alignItems: 'center', transition: 'transform 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                                Create Free Account
                            </a>
                            <a href="#trips"
                                style={{ padding: '16px 44px', background: 'rgba(14,10,3,0.65)', color: 'rgba(240,244,232,0.9)', fontWeight: 600, fontSize: '16px', borderRadius: '10px', border: '1px solid rgba(200,220,160,0.25)', textDecoration: 'none', backdropFilter: 'blur(6px)', display: 'inline-flex', alignItems: 'center', transition: 'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(22,16,4,0.82)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(14,10,3,0.65)')}>
                                Browse Trips
                            </a>
=======
            {/* ══ CTA BANNER ════════════════════════════════════ */}
            <section className="py-40 relative overflow-hidden" style={{ background: '#080f08' }}>
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&q=60" alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #080f08 0%, rgba(8,15,8,0.4) 40%, #080f08 100%)' }} />
                </div>
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px]" style={{ background: 'rgba(132,204,22,0.07)' }} />
                <div className="container-main relative z-10 text-center">
                    <Reveal>
                        <h2 className="font-[var(--font-bebas)] text-white mb-8 leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.04em', textShadow: '0 0 80px rgba(132,204,22,0.2)' }}>
                            READY TO START<br />YOUR JOURNEY?
                        </h2>
                        <p className="text-lg mb-14 max-w-[480px] mx-auto" style={{ color: 'rgba(180,200,140,0.6)' }}>
                            Join thousands of students who&apos;ve already discovered the joy of group travel.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <MagneticBtn href="/auth/register" className="btn-primary px-12 py-5 text-lg font-bold">
                                Create Free Account ✦
                            </MagneticBtn>
                            <MagneticBtn href="/trips" className="btn-secondary px-12 py-5 text-lg font-bold">
                                Browse Trips
                            </MagneticBtn>
>>>>>>> 11800fe86b49fb8a43b65e6a6402cc6621bbebf2
                        </div>
                    </Reveal>
                </div>
            </section>

<<<<<<< HEAD
            {/* ═══════════════════════════════════
                FOOTER
            ═══════════════════════════════════ */}
            <footer style={{ background: '#040301', borderTop: '1px solid rgba(163,230,53,0.08)', padding: '40px 0 24px' }}>
                <div className="container-main">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '32px' }}>
                        {/* Brand */}
                        <div>
                            <img src="/logo.png" alt="Safarnama" style={{ height: '36px', width: 'auto', objectFit: 'contain', marginBottom: '12px' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                            <p style={{ fontSize: '13px', color: 'rgba(180,200,140,0.36)', lineHeight: 1.65, maxWidth: '240px' }}>
                                India&apos;s leading student travel platform. Curated group trips, budget-friendly pricing, unforgettable memories.
                            </p>
                        </div>
                        {/* Navigate */}
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,215,160,0.55)', marginBottom: '14px' }}>Navigate</p>
                            {[['Home', '/'], ['Trips', '/trips'], ['Gallery', '/gallery'], ['Reviews', '/blog']].map(([n, h]) => (
                                <div key={n} style={{ marginBottom: '9px' }}>
                                    <a href={h} style={{ fontSize: '13px', color: 'rgba(180,200,140,0.38)', transition: 'color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#a3e635')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(180,200,140,0.38)')}>
                                        {n}
                                    </a>
                                </div>
                            ))}
                        </div>
                        {/* Account */}
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,215,160,0.55)', marginBottom: '14px' }}>Account</p>
                            {[['Sign In', '/auth/login'], ['Register', '/auth/register'], ['Dashboard', '/dashboard']].map(([n, h]) => (
                                <div key={n} style={{ marginBottom: '9px' }}>
                                    <a href={h} style={{ fontSize: '13px', color: 'rgba(180,200,140,0.38)', transition: 'color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#a3e635')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(180,200,140,0.38)')}>
                                        {n}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Bottom bar */}
                    <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(163,230,53,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <p style={{ fontSize: '11.5px', color: 'rgba(180,200,140,0.22)' }}>© 2024 Safarnama. All rights reserved.</p>
                        <p style={{ fontSize: '11.5px', color: 'rgba(180,200,140,0.22)' }}>Made with ❤️ for student travellers across India</p>
                    </div>
                </div>
            </footer>

            {/* ═══════════════════════════════════
                WHATSAPP FAB
            ═══════════════════════════════════ */}
            <motion.a
                href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU"
                target="_blank" rel="noopener noreferrer"
                style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900, width: '54px', height: '54px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.42)', textDecoration: 'none' }}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2 }}
                whileHover={{ scale: 1.1, boxShadow: '0 8px 28px rgba(37,211,102,0.55)' }}
                whileTap={{ scale: 0.95 }}>
                <svg viewBox="0 0 32 32" width="26" height="26" fill="white">
                    <path d="M16.002 3C9.374 3 4 8.373 4 15c0 2.385.67 4.614 1.832 6.514L4 29l7.698-1.814A12.93 12.93 0 0016.002 28C22.628 28 28 22.627 28 16S22.628 3 16.002 3zm0 23.5a10.93 10.93 0 01-5.546-1.508l-.396-.236-4.57 1.077 1.1-4.457-.258-.41A10.93 10.93 0 015.5 15c0-5.799 4.703-10.5 10.502-10.5C21.8 4.5 26.5 9.202 26.5 15S21.8 26.5 16.002 26.5zm5.934-7.824c-.326-.163-1.927-.951-2.226-1.059-.298-.108-.515-.163-.733.163-.217.326-.842 1.059-1.032 1.277-.19.217-.38.244-.706.081-.326-.163-1.376-.507-2.622-1.618-.968-.864-1.622-1.931-1.813-2.257-.19-.326-.02-.502.143-.664.147-.146.326-.38.49-.57.163-.19.217-.326.326-.543.108-.217.054-.407-.027-.57-.082-.163-.733-1.766-1.003-2.42-.265-.651-.54-.563-.733-.574-.19-.01-.407-.012-.624-.012-.217 0-.57.081-.869.407-.298.326-1.14 1.114-1.14 2.716s1.168 3.151 1.33 3.368c.163.218 2.297 3.51 5.567 4.921.778.336 1.385.537 1.859.687.78.249 1.492.214 2.054.13.627-.093 1.927-.788 2.199-1.549.271-.762.271-1.415.19-1.549-.081-.135-.298-.217-.624-.38z" />
                </svg>
            </motion.a>

            {/* ═══════════════════════════════════
                RESPONSIVE CSS (mobile override)
            ═══════════════════════════════════ */}
            <style>{`
                @media (max-width: 900px) {
                    .features-grid { grid-template-columns: repeat(2,1fr) !important; }
                    .trips-grid    { grid-template-columns: repeat(2,1fr) !important; }
                }
                @media (max-width: 580px) {
                    .features-grid { grid-template-columns: 1fr !important; }
                    .trips-grid    { grid-template-columns: 1fr !important; }
                }
            `}</style>
=======
            {/* ══ FOOTER ════════════════════════════════════════ */}
            <footer style={{ borderTop: '1px solid rgba(132,204,22,0.08)', background: '#050c05' }}>
                <div className="container-main py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <img src="/logo.png" alt="Safarnama" className="h-10 w-auto object-contain mb-6" />
                            <p className="text-sm leading-relaxed max-w-[280px]" style={{ color: 'rgba(180,200,140,0.4)' }}>
                                India&apos;s leading student travel platform. Curated group trips, budget-friendly pricing, unforgettable memories.
                            </p>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold mb-6 uppercase tracking-wider">Navigate</p>
                            <div className="flex flex-col gap-3">
                                {[['Home','/'],['Trips','/trips'],['Gallery','/gallery'],['Reviews','/blog'],['Contact','/contact']].map(([n,h]) => (
                                    <a key={n} href={h} className="text-sm transition-colors hover:text-lime-400" style={{ color: 'rgba(180,200,140,0.4)' }}>{n}</a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold mb-6 uppercase tracking-wider">Account</p>
                            <div className="flex flex-col gap-3">
                                {[['Sign In','/auth/login'],['Register','/auth/register'],['Dashboard','/dashboard']].map(([n,h]) => (
                                    <a key={n} href={h} className="text-sm transition-colors hover:text-lime-400" style={{ color: 'rgba(180,200,140,0.4)' }}>{n}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(132,204,22,0.06)' }}>
                        <p className="text-xs" style={{ color: 'rgba(180,200,140,0.25)' }}>© 2026 Safarnama. All rights reserved.</p>
                        <p className="text-xs" style={{ color: 'rgba(180,200,140,0.25)' }}>Made with ❤️ for student travelers across India</p>
                    </div>
                </div>
            </footer>
>>>>>>> 11800fe86b49fb8a43b65e6a6402cc6621bbebf2
        </main>
    )
}
