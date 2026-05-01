'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'

/* ── DATA ── */
const REVIEWS = [
  {
    id: '1',
    name: 'Riya Sharma',
    college: 'IIT Delhi',
    location: 'New Delhi',
    trip: 'Banaras Vibes',
    tripTag: '🕌 Culture',
    rating: 5,
    date: 'January 2026',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80',
    title: 'Most spiritual experience of my life!',
    review: 'I had zero expectations going in, but Banaras completely blew my mind. The Ganga Aarti at night was something I will never forget. Safarnama handled everything — transport, stay, food — perfectly. The group was amazing and we all became friends by day 2. Highly recommend to every student!',
    photos: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=80',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80',
    ],
    verified: true,
    accent: '#a3e635',
  },
  {
    id: '2',
    name: 'Arjun Mehta',
    college: 'DU North Campus',
    location: 'Delhi',
    trip: 'Banaras Vibes',
    tripTag: '🕌 Culture',
    rating: 5,
    date: 'January 2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    title: 'Budget-friendly and absolutely worth it!',
    review: 'At just ₹3,000 for 3 nights, I honestly did not expect much. But Safarnama delivered way beyond expectations. Clean accommodation, great food, and an itinerary that covered everything important. The sunrise boat ride on the Ganges was the highlight. Will definitely book the Manali trip next!',
    photos: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'],
    verified: true,
    accent: '#fbbf24',
  },
  {
    id: '3',
    name: 'Priya Verma',
    college: 'BITS Pilani',
    location: 'Rajasthan',
    trip: 'Banaras Vibes',
    tripTag: '🕌 Culture',
    rating: 5,
    date: 'January 2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80',
    title: 'Safe, fun, and perfectly organized',
    review: 'As a solo female traveler, safety was my top concern. Safarnama made me feel completely secure throughout the trip. The trip leader was always available, the group was respectful, and the entire experience was seamless. The street food tour in Varanasi was an absolute highlight. 10/10!',
    photos: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80',
      'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400&q=80',
    ],
    verified: true,
    accent: '#a3e635',
  },
  {
    id: '4',
    name: 'Karan Singh',
    college: 'CSJMU Kanpur',
    location: 'Uttar Pradesh',
    trip: 'Banaras Vibes',
    tripTag: '🕌 Culture',
    rating: 5,
    date: 'January 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    title: 'Made 20 new friends in 3 days!',
    review: 'I went alone and came back with a whole friend group. That is the magic of Safarnama. The team creates an environment where everyone feels welcome. Banaras itself is incredible — the energy, the culture, the food. Already waiting for the Manali trip announcement!',
    photos: [],
    verified: true,
    accent: '#fbbf24',
  },
  {
    id: '5',
    name: 'Sneha Patel',
    college: 'NIT Surat',
    location: 'Gujarat',
    trip: 'Goa Getaway',
    tripTag: '🏖️ Beach',
    rating: 5,
    date: 'February 2026',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80',
    title: 'Best beach trip ever on a student budget!',
    review: 'Never thought I could afford Goa as a student. Safarnama made it happen at an unbelievable price. The sunsets, the beach parties, the food — every moment was curated beautifully. The WhatsApp group before the trip kept everyone connected and excited. Absolutely will travel with them again!',
    photos: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80'],
    verified: true,
    accent: '#38bdf8',
  },
]

const STATS = [
  { value: '1,000+', label: 'Happy Travelers',   icon: '😊' },
  { value: '4.9★',   label: 'Average Rating',     icon: '⭐' },
  { value: '12+',    label: 'Trips Completed',    icon: '🗺️' },
  { value: '100%',   label: 'Would Recommend',    icon: '👍' },
]

/* ── Star Rating ── */
function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i < n ? '#f59e0b' : 'rgba(245,158,11,0.15)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

/* ── Review Card ── */
function ReviewCard({ r, i }: { r: typeof REVIEWS[0]; i: number }) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const SHORT = 160
  const isLong = r.review.length > SHORT

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 22,
        padding: '28px 26px',
        background: 'rgba(6,10,5,0.65)',
        border: `1px solid rgba(132,204,22,0.10)`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        borderColor: `${r.accent}40`,
        boxShadow: `0 16px 56px rgba(0,0,0,0.5), 0 0 0 1px ${r.accent}20`,
        y: -5,
      }}
    >
      {/* Accent glow top-left */}
      <div style={{
        position: 'absolute', top: -40, left: -40, width: 120, height: 120,
        borderRadius: '50%', background: `${r.accent}08`, filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      {/* Big quote mark */}
      <div style={{
        position: 'absolute', top: 16, right: 20,
        fontSize: 72, lineHeight: 1, color: `${r.accent}10`,
        fontFamily: 'Georgia,serif', userSelect: 'none', pointerEvents: 'none',
      }}>"</div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${r.accent}40` }}>
            <Image src={r.avatar} alt={r.name} fill style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f4e8' }}>{r.name}</p>
              {r.verified && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 9, fontWeight: 700, color: '#a3e635',
                  background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)',
                  padding: '2px 7px', borderRadius: 999,
                }}>
                  <svg width="8" height="8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(180,200,140,0.45)', marginTop: 2 }}>
              {r.college} · 📍 {r.location}
            </p>
          </div>
        </div>

        {/* Rating + trip tag */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <Stars n={r.rating} />
          <span style={{
            fontSize: 10, fontWeight: 700, color: r.accent,
            background: `${r.accent}12`, border: `1px solid ${r.accent}28`,
            padding: '3px 9px', borderRadius: 999,
          }}>
            {r.tripTag}
          </span>
        </div>
      </div>

      {/* Thin accent rule */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${r.accent}30, transparent)`, marginBottom: 14 }} />

      {/* Review title */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f4e8', marginBottom: 10, lineHeight: 1.35 }}>
        &ldquo;{r.title}&rdquo;
      </h3>

      {/* Review text */}
      <p style={{ fontSize: 13.5, lineHeight: 1.72, color: 'rgba(200,220,160,0.65)', marginBottom: 10 }}>
        {expanded || !isLong ? r.review : r.review.slice(0, SHORT) + '…'}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 12, fontWeight: 600, color: r.accent,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}
        >
          {expanded ? 'Show less ↑' : 'Read full review ↓'}
        </button>
      )}

      {/* Photos */}
      {r.photos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {r.photos.map((p, pi) => (
            <div key={pi} style={{ width: 80, height: 64, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(163,230,53,0.10)', flexShrink: 0, position: 'relative' }}>
              <Image src={p} alt="Trip photo" fill style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(132,204,22,0.06)' }}>
        <span style={{ fontSize: 11, color: 'rgba(180,200,140,0.35)' }}>📅 {r.date}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(163,230,53,0.5)' }}>Trip: {r.trip}</span>
      </div>
    </motion.div>
  )
}

/* ── Page ── */
export default function ReviewsPage() {
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  return (
    <main className="min-h-screen" style={{ background: '#080f08' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 140, paddingBottom: 72 }}>
        {/* bg photo */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }} animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1600&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(3,8,2,0.70)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(132,204,22,0.10) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 160, background: 'linear-gradient(to bottom, transparent, #080f08)' }} />
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22,
              padding: '7px 18px', borderRadius: 999,
              background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a3e635',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a3e635', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Traveler Stories
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'var(--font-outfit)', fontSize: 'clamp(48px,7vw,80px)',
              fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.025em',
              color: '#f0f4e8', marginBottom: 18,
            }}>
              Real{' '}
              <span style={{ background: 'linear-gradient(135deg,#a3e635,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Reviews
              </span>
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(180,200,140,0.55)', maxWidth: 480, margin: '0 auto 28px' }}>
              Honest stories from students who&apos;ve traveled with us. No filters — just real, unscripted experiences.
            </p>

            {/* Star summary */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f4e8' }}>4.9</span>
              <span style={{ fontSize: 13, color: 'rgba(180,200,140,0.5)' }}>from 1,000+ travelers</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div ref={statsRef} className="container-main" style={{ marginBottom: 64 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="stats-grid">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                textAlign: 'center', borderRadius: 18, padding: '24px 16px',
                background: 'rgba(6,10,5,0.7)', border: '1px solid rgba(132,204,22,0.10)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <p style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#a3e635', fontFamily: 'var(--font-outfit)', lineHeight: 1.1 }}>
                {s.value}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(180,200,140,0.4)', marginTop: 5, letterSpacing: '0.04em' }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── REVIEW CARDS ── */}
      <div className="container-main" style={{ paddingBottom: 80 }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: 700, color: '#f0f4e8', marginBottom: 8 }}>
            What Our <span style={{ color: '#a3e635' }}>Travelers Say</span>
          </h2>
          <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg, transparent, #d4a843, transparent)', margin: '0 auto' }} />
        </motion.div>

        {/* 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }} className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={r.id} r={r} i={i} />
          ))}
        </div>

        {/* ── SUBMIT REVIEW CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: 64 }}
        >
          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: 24, padding: '56px 40px',
            background: 'rgba(6,10,5,0.80)', border: '1px solid rgba(163,230,53,0.14)',
            backdropFilter: 'blur(24px)', textAlign: 'center',
          }}>
            {/* Glow */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(132,204,22,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Decorative quotes */}
            <div style={{ position: 'absolute', top: 20, left: 30, fontSize: 80, color: 'rgba(163,230,53,0.06)', fontFamily: 'Georgia,serif', lineHeight: 1, pointerEvents: 'none' }}>"</div>
            <div style={{ position: 'absolute', bottom: 10, right: 30, fontSize: 80, color: 'rgba(212,168,67,0.06)', fontFamily: 'Georgia,serif', lineHeight: 1, transform: 'rotate(180deg)', pointerEvents: 'none' }}>"</div>

            {/* Icon */}
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="26" height="26" fill="none" stroke="#a3e635" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>

            <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 26, fontWeight: 800, color: '#f0f4e8', marginBottom: 10 }}>
              Traveled with Safarnama?
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(180,200,140,0.5)', maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Share your story and help other students discover the joy of group travel. Your experience matters!
            </p>

            <a
              href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 30px', borderRadius: 14,
                background: 'linear-gradient(135deg,#a3e635,#65a30d)',
                color: '#080f08', fontWeight: 700, fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(163,230,53,0.30)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 32px rgba(163,230,53,0.42)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 24px rgba(163,230,53,0.30)' }}
            >
              Share Your Story
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .stats-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
        }
      `}</style>
    </main>
  )
}
