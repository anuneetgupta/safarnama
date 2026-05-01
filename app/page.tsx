'use client'

import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import TestimonialsSection from '@/components/sections/Testimonials'

/* ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
   TYPES & DATA
ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */
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
    { name: 'Banaras Vibes',    price: '₹3,000',      priceCls: 'lime',  status: 'COMPLETED', badgeCls: 'completed', tag: '🏛️ Culture',   tagColor: '#f59e0b', tagBg: 'rgba(245,158,11,0.13)', date: '15 Jan – 18 Jan 2024', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80' },
    { name: 'Manali Adventure', price: 'Coming Soon',  priceCls: 'muted', status: 'NEXT',      badgeCls: 'next',      tag: '⛰️ Mountain',  tagColor: '#a3e635', tagBg: 'rgba(163,230,53,0.12)', date: '',                     img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
    { name: 'Goa Getaway',      price: 'Booking Open', priceCls: 'lime',  status: 'OPEN',      badgeCls: 'open',      tag: '🏖️ Beach',    tagColor: '#38bdf8', tagBg: 'rgba(56,189,248,0.12)',  date: '',                     img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80' },
    { name: 'Rishikesh Rush',   price: 'TBA',          priceCls: 'muted', status: 'SOON',      badgeCls: 'soon',      tag: '⚡ Adventure', tagColor: '#f87171', tagBg: 'rgba(248,113,113,0.12)', date: '',                     img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
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

/* ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
   HELPERS
ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-50px' })
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    )
}

/* ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
   PAGE
ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */
export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
    const [activeT, setActiveT] = useState(0)
    const [liveTrips, setLiveTrips] = useState<any[]>([])

    // Fetch trips dynamically
    useEffect(() => {
        fetch('/api/admin/trips')
            .then(res => res.json())
            .then(data => {
                if (data.trips) {
                    const mapped = data.trips.map((t: any) => {
                        const price = t.price > 0 ? `₹${t.price.toLocaleString()}` : (t.status === 'coming_soon' ? 'Coming Soon' : 'TBA');
                        const priceCls = t.price > 0 ? 'lime' : 'muted';
                        const status = t.status.replace('_', ' ').toUpperCase();
                        let badgeCls = 'soon';
                        if (t.status === 'completed') badgeCls = 'completed';
                        else if (t.status === 'coming_soon') badgeCls = 'next';
                        else if (t.status === 'booking_open') badgeCls = 'open';
                        
                        let dateStr = '';
                        if (t.startDate && t.endDate) {
                            const sd = new Date(t.startDate);
                            const ed = new Date(t.endDate);
                            dateStr = `${sd.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${ed.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
                        }

                        // Derive tag from category
                        const CAT_TAG: Record<string, { tag: string; tagColor: string; tagBg: string }> = {
                            mountain:  { tag: '⛰️ Mountain',  tagColor: '#a3e635', tagBg: 'rgba(163,230,53,0.12)' },
                            beach:     { tag: '🏖️ Beach',    tagColor: '#38bdf8', tagBg: 'rgba(56,189,248,0.12)' },
                            culture:   { tag: '🏛️ Culture',  tagColor: '#f59e0b', tagBg: 'rgba(245,158,11,0.13)' },
                            adventure: { tag: '⚡ Adventure', tagColor: '#f87171', tagBg: 'rgba(248,113,113,0.12)' },
                        }
                        const catTag = CAT_TAG[(t.category || '').toLowerCase()] || (t.featured ? { tag: '🔥 Popular', tagColor: '#fb923c', tagBg: 'rgba(251,146,60,0.12)' } : { tag: '', tagColor: '', tagBg: '' })

                        return {
                            name: t.name,
                            price,
                            priceCls,
                            status,
                            badgeCls,
                            date: dateStr,
                            img: t.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
                            ...catTag,
                        };
                    });
                    setLiveTrips(mapped);
                }
            })
            .catch(err => console.error('Failed to fetch trips:', err));
    }, []);

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

            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                HERO
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
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

                    {/* ÔöÇÔöÇ Main hero ÔöÇÔöÇ */}
                    <div className="hero-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 60px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

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
                            className="hero-title"
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
                        <motion.div className="hero-cta-row" style={{ display: 'flex', gap: '16px', marginBottom: '36px', flexWrap: 'wrap', justifyContent: 'center' }}
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
                        <motion.div className="hero-tags" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                            {[['🏕️', 'Group Adventures'], ['🗺️', 'Curated Routes'], ['🛡️', 'Safe & Verified']].map(([icon, text]) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.18)', borderRadius: '12px', fontSize: '13px', fontWeight: 500, color: 'rgba(190,215,145,0.88)' }}>
                                    <span>{icon}</span>{text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ÔöÇÔöÇ "READY TO START YOUR JOURNEY?" block at bottom of hero ÔöÇÔöÇ */}
                    <motion.div
                        className="hero-bottom"
                        style={{ textAlign: 'center', padding: '70px 24px 90px', position: 'relative', zIndex: 2, background: 'linear-gradient(to bottom,transparent 0%,rgba(5,4,1,0.6) 100%)' }}
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(36px,6vw,68px)', lineHeight: 1.05, letterSpacing: '0.04em', color: '#fff', marginBottom: '8px' }}>
                            READY TO START YOUR
                        </h2>
                        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(36px,6vw,68px)', lineHeight: 1.05, letterSpacing: '0.04em', color: '#a3e635', marginBottom: '18px' }}>
                            JOURNEY?
                        </h2>
                        <p style={{ fontSize: '15px', color: 'rgba(200,215,160,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
                            Create Your Outdoor Adventure. Explore India With <span style={{ color: '#a3e635' }}>♥</span> Your Tribe.
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

            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                FEATURES ÔÇö "Built for the Student Explorer"
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
            <section style={{ position: 'relative', padding: '80px 0 72px', overflow: 'hidden' }}>
                {/* Forest BG */}
                <div style={forestBgStyle}>
                    <img src={FOREST_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,5,1,0.80)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(163,230,53,0.07) 0%,transparent 60%)' }} />
                </div>

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

                    {/* 3├ù2 grid */}
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
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                HOW IT WORKS ÔÇö with Destination Cards
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
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
                                Handpicked Adventures for Students. Limited slots ÔÇö book early.
                            </p>
                        </div>
                    </Reveal>

                    {/* Destination cards — 4 columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }} className="trips-grid">
                        {(liveTrips.length > 0 ? liveTrips : DESTINATIONS).map((d, i) => {
                            const bs = BADGE_STYLES[d.badgeCls] || BADGE_STYLES.soon;
                            return (
                                <Reveal key={d.name} delay={i * 0.1}>
                                    <motion.div style={{
                                        position: 'relative', borderRadius: '18px', overflow: 'hidden', aspectRatio: '3/4',
                                        border: '1px solid rgba(163,230,53,0.14)',
                                        boxShadow: '0 6px 32px rgba(0,0,0,0.38), 0 1px 0 rgba(163,230,53,0.06) inset',
                                        cursor: 'pointer',
                                    }}
                                        whileHover={{
                                            scale: 1.03,
                                            y: -6,
                                            boxShadow: '0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(163,230,53,0.22)',
                                            borderColor: 'rgba(163,230,53,0.28)',
                                        }}
                                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>

                                        {/* Status badge */}
                                        <div style={{ position: 'absolute', top: '11px', left: '11px', zIndex: 10, padding: '4px 10px', borderRadius: '7px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`, backdropFilter: 'blur(8px)' }}>
                                            {d.status}
                                        </div>

                                        {/* Image with subtle zoom on hover */}
                                        <motion.img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            whileHover={{ scale: 1.08 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} />

                                        {/* Gradient overlay */}
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(3,2,0,0.97) 0%,rgba(3,2,0,0.25) 48%,transparent 100%)' }} />

                                        {/* Bottom info */}
                                        <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', zIndex: 5 }}>
                                            {d.tag && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '20px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', background: d.tagBg, color: d.tagColor, border: `1px solid ${d.tagColor}30`, backdropFilter: 'blur(6px)', marginBottom: '7px' }}>
                                                    {d.tag}
                                                </span>
                                            )}
                                            <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '3px', lineHeight: 1.2, letterSpacing: '-0.01em', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>{d.name}</p>
                                            <p style={{ fontSize: d.priceCls === 'lime' ? '14px' : '12px', fontWeight: d.priceCls === 'lime' ? 800 : 600, color: PRICE_COLORS[d.priceCls], marginBottom: d.date ? '3px' : '8px' }}>{d.price}</p>
                                            {d.date && <p style={{ fontSize: '10px', color: 'rgba(180,200,140,0.5)', marginBottom: '8px' }}>{d.date}</p>}
                                            <a href="/trips" style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                padding: '7px 14px', borderRadius: '9px', fontSize: '11px', fontWeight: 700, textDecoration: 'none',
                                                background: d.badgeCls === 'open' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : d.badgeCls === 'completed' ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg,#a3e635,#65a30d)',
                                                color: d.badgeCls === 'open' ? '#fff' : d.badgeCls === 'completed' ? '#9ca3af' : '#000',
                                                boxShadow: d.badgeCls === 'open' ? '0 3px 12px rgba(59,130,246,0.35)' : d.badgeCls === 'completed' ? 'none' : '0 3px 12px rgba(163,230,53,0.28)',
                                                border: d.badgeCls === 'completed' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                            }}>
                                                {d.badgeCls === 'open' ? 'Book Now' : d.badgeCls === 'completed' ? 'View Details' : 'Notify Me'}
                                                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                                            </a>
                                        </div>
                                    </motion.div>
                                </Reveal>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                TESTIMONIALS ÔÇö "What Travelers Say"
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
            {/* ═══ TESTIMONIALS ═══ */}
            <TestimonialsSection />


            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                FOUNDERS
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
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
                    <div className="founders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '24px', maxWidth: '640px', margin: '0 auto' }}>
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
                        ))}
                    </div>
                </div>
            </section>

            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                CTA ÔÇö "READY TO START YOUR JOURNEY?"
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
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
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                FOOTER
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
            <footer style={{ background: '#040301', borderTop: '1px solid rgba(163,230,53,0.08)', padding: '40px 0 24px' }}>
                <div className="container-main">
                    <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '32px' }}>
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
                    <div className="footer-bottom-bar" style={{ paddingTop: '20px', borderTop: '1px solid rgba(163,230,53,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <p style={{ fontSize: '11.5px', color: 'rgba(180,200,140,0.22)' }}>© 2024 Safarnama. All rights reserved.</p>
                        <p style={{ fontSize: '11.5px', color: 'rgba(180,200,140,0.22)' }}>Made with ❤️ for student travellers across India</p>
                    </div>
                </div>
            </footer>

            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                WHATSAPP FAB
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
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

            {/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
                RESPONSIVE CSS (mobile override)
            ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */}
            <style>{`
                /* ── TABLET (≤900px) ── */
                @media (max-width: 900px) {
                    .features-grid { grid-template-columns: repeat(2,1fr) !important; }
                    .trips-grid    { grid-template-columns: repeat(2,1fr) !important; }
                    .footer-cols   { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
                }

                /* ── MOBILE (≤640px) ── */
                @media (max-width: 640px) {
                    .features-grid  { grid-template-columns: 1fr !important; }
                    .trips-grid     { grid-template-columns: 1fr !important; }
                    .footer-cols    { grid-template-columns: 1fr !important; gap: 22px !important; }
                    .founders-grid  { grid-template-columns: 1fr !important; max-width: 320px !important; }
                    .hero-content   { padding: 88px 16px 40px !important; }
                    .hero-title     { font-size: clamp(58px,15vw,90px) !important; white-space: normal !important; }
                    .hero-cta-row   { gap: 10px !important; }
                    .hero-cta-row a { padding: 13px 24px !important; font-size: 14px !important; width: 100%; text-align: center; justify-content: center; }
                    .hero-tags      { gap: 8px !important; }
                    .hero-bottom    { padding: 40px 16px 56px !important; }
                    .cta-heading    { font-size: clamp(38px,11vw,72px) !important; }
                    .footer-bottom-bar { flex-direction: column; align-items: flex-start !important; gap: 4px !important; }
                    .testimonial-card  { padding: 24px 20px !important; }
                }

                /* ── SMALL PHONE (≤400px) ── */
                @media (max-width: 400px) {
                    .hero-title { font-size: 52px !important; }
                }
            `}</style>
        </main>
    )
}
