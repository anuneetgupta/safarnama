'use client'

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
            {children}
        </motion.div>
    )
}

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
            <section className="py-16 relative overflow-hidden" style={{ background: 'rgba(10,18,8,0.9)', borderTop: '1px solid rgba(132,204,22,0.08)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                <div className="absolute inset-0 grid-pattern opacity-40" />
                <div className="container-main relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                </div>
            </section>

            {/* ══ FEATURES — 3D GLASS CARDS ═════════════════════ */}
            <section className="py-28 relative overflow-hidden" style={{ background: '#0d150b' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(132,204,22,0.06) 0%, transparent 70%)' }} />
                <div className="container-main relative z-10">
                    <div className="text-center mb-20">
                        <Reveal><div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.2)', color: '#a3e635' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />Why Safarnama
                        </div></Reveal>
                        <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Built for the <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Student Explorer</span>
                        </h2></Reveal>
                        <Reveal delay={0.2}><p className="text-base max-w-md mx-auto" style={{ color: 'rgba(180,200,140,0.6)' }}>Everything you need for the perfect group trip — in one platform.</p></Reveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <section className="py-28 relative overflow-hidden" style={{ background: '#111a0f' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,168,67,0.05) 0%, transparent 70%)' }} />
                <div className="container-main relative z-10">
                    <div className="text-center mb-20">
                        <Reveal><h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            How It <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Works</span>
                        </h2></Reveal>
                        <Reveal delay={0.1}><p className="text-base" style={{ color: 'rgba(180,200,140,0.6)' }}>Three simple steps to your next adventure</p></Reveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
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
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ DESTINATIONS — TILT CARDS ═════════════════════ */}
            <section id="trips" className="py-28 relative overflow-hidden" style={{ background: '#0d150b' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(132,204,22,0.04) 0%, transparent 60%)' }} />
                <div className="container-main relative z-10">
                    <div className="text-center mb-20">
                        <Reveal><h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Our <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Destinations</span>
                        </h2></Reveal>
                        <Reveal delay={0.1}><p className="text-base" style={{ color: 'rgba(180,200,140,0.6)' }}>Handpicked adventures for students. Limited slots — book early.</p></Reveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DEMO_TRIPS.slice(0, 6).map((trip, i) => (
                            <TripCard key={trip.id} {...trip} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIALS — SMOOTH SLIDER ══════════════════ */}
            <section className="py-28 relative overflow-hidden" style={{ background: '#111a0f' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(212,168,67,0.05) 0%, transparent 60%)' }} />
                <div className="container-main relative z-10">
                    <div className="text-center mb-16">
                        <Reveal><h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            What Travelers <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Say</span>
                        </h2></Reveal>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative overflow-hidden rounded-3xl p-10" style={{ background: 'rgba(10,18,8,0.8)', border: '1px solid rgba(132,204,22,0.12)', backdropFilter: 'blur(20px)' }}>
                            <motion.div key={activeTestimonial} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>
                                <div className="flex gap-0.5 mb-6">
                                    {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xl">★</span>)}
                                </div>
                                <p className="text-xl text-white leading-relaxed mb-8 font-medium">&ldquo;{TESTIMONIALS[activeTestimonial].text}&rdquo;</p>
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
                        <div className="flex justify-center gap-3 mt-6">
                            {TESTIMONIALS.map((_, i) => (
                                <motion.button key={i} onClick={() => setActiveTestimonial(i)}
                                    className="rounded-full transition-all duration-300"
                                    style={{ width: i === activeTestimonial ? '32px' : '10px', height: '10px', background: i === activeTestimonial ? '#a3e635' : 'rgba(132,204,22,0.25)' }}
                                    whileHover={{ scale: 1.2 }} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ TEAM ══════════════════════════════════════════ */}
            <section className="py-28 relative overflow-hidden" style={{ background: '#0d150b' }}>
                <div className="container-main relative z-10">
                    <div className="text-center mb-16">
                        <Reveal><h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Meet the <span style={{ background: 'linear-gradient(135deg, #a3e635, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Founders</span>
                        </h2></Reveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[700px] mx-auto">
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
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA BANNER ════════════════════════════════════ */}
            <section className="py-32 relative overflow-hidden" style={{ background: '#080f08' }}>
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&q=60" alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #080f08 0%, rgba(8,15,8,0.4) 40%, #080f08 100%)' }} />
                </div>
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px]" style={{ background: 'rgba(132,204,22,0.07)' }} />
                <div className="container-main relative z-10 text-center">
                    <Reveal>
                        <h2 className="font-[var(--font-bebas)] text-white mb-6 leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.04em', textShadow: '0 0 80px rgba(132,204,22,0.2)' }}>
                            READY TO START<br />YOUR JOURNEY?
                        </h2>
                        <p className="text-lg mb-12 max-w-[480px] mx-auto" style={{ color: 'rgba(180,200,140,0.6)' }}>
                            Join thousands of students who&apos;ve already discovered the joy of group travel.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <MagneticBtn href="/auth/register" className="btn-primary px-12 py-5 text-lg font-bold">
                                Create Free Account ✦
                            </MagneticBtn>
                            <MagneticBtn href="/trips" className="btn-secondary px-12 py-5 text-lg font-bold">
                                Browse Trips
                            </MagneticBtn>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══ FOOTER ════════════════════════════════════════ */}
            <footer style={{ borderTop: '1px solid rgba(132,204,22,0.08)', background: '#050c05' }}>
                <div className="container-main py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                        <div className="md:col-span-2">
                            <img src="/logo.png" alt="Safarnama" className="h-10 w-auto object-contain mb-4" />
                            <p className="text-sm leading-relaxed max-w-[280px]" style={{ color: 'rgba(180,200,140,0.4)' }}>
                                India&apos;s leading student travel platform. Curated group trips, budget-friendly pricing, unforgettable memories.
                            </p>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Navigate</p>
                            <div className="flex flex-col gap-2.5">
                                {[['Home','/'],['Trips','/trips'],['Gallery','/gallery'],['Reviews','/blog'],['Contact','/contact']].map(([n,h]) => (
                                    <a key={n} href={h} className="text-sm transition-colors hover:text-lime-400" style={{ color: 'rgba(180,200,140,0.4)' }}>{n}</a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Account</p>
                            <div className="flex flex-col gap-2.5">
                                {[['Sign In','/auth/login'],['Register','/auth/register'],['Dashboard','/dashboard']].map(([n,h]) => (
                                    <a key={n} href={h} className="text-sm transition-colors hover:text-lime-400" style={{ color: 'rgba(180,200,140,0.4)' }}>{n}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderTop: '1px solid rgba(132,204,22,0.06)' }}>
                        <p className="text-xs" style={{ color: 'rgba(180,200,140,0.25)' }}>© 2026 Safarnama. All rights reserved.</p>
                        <p className="text-xs" style={{ color: 'rgba(180,200,140,0.25)' }}>Made with ❤️ for student travelers across India</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
