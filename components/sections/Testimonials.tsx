'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const REVIEWS = [
  {
    name: 'Riya Sharma',
    location: 'IIT Delhi, Delhi',
    trip: 'Banaras Vibes',
    text: 'This journey changed my life completely. The Ganga Aarti at dawn was something I will never forget. Safarnama handled everything so perfectly — I just had to show up!',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    location: 'DU North Campus, Delhi',
    trip: 'Banaras Vibes',
    text: 'At ₹3,000 for 3 nights I expected nothing, yet got everything — great accommodation, amazing food, a brilliant group. Will 100% book Manali next!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    rating: 5,
  },
  {
    name: 'Priya Verma',
    location: 'BITS Pilani, Rajasthan',
    trip: 'Banaras Vibes',
    text: 'As a solo female traveler I felt completely safe the entire time. The group was amazing, the itinerary was perfect. Genuinely a 10/10 experience.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80',
    rating: 5,
  },
  {
    name: 'Karan Singh',
    location: 'CSJMU, Kanpur',
    trip: 'Manali Adventure',
    text: "Went alone, came back with 20 new friends. That's the Safarnama magic — they don't just sell trips, they build communities.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    rating: 5,
  },
  {
    name: 'Sneha Patel',
    location: 'NIT Surat, Gujarat',
    trip: 'Goa Getaway',
    text: 'Best budget trip ever. The beach vibes, the sunsets, the people — Safarnama curated every moment beautifully. Already planning my next trip!',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80',
    rating: 5,
  },
]

const FOREST_BG = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&q=72'

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < rating ? '#f59e0b' : 'rgba(245,158,11,0.2)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ review, delay }: { review: typeof REVIEWS[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: '0 0 calc(33.333% - 14px)',
        borderRadius: 20,
        padding: '28px 26px',
        background: 'rgba(5,4,1,0.55)',
        border: '1px solid rgba(163,230,53,0.12)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 0,
      }}
      whileHover={{
        borderColor: 'rgba(163,230,53,0.32)',
        boxShadow: '0 16px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(163,230,53,0.14)',
        y: -6,
      }}
    >
      {/* Quote mark */}
      <div style={{ fontSize: 40, lineHeight: 1, color: 'rgba(163,230,53,0.18)', fontFamily: 'Georgia,serif', marginBottom: 4, userSelect: 'none' }}>"</div>

      {/* Stars */}
      <StarRating rating={review.rating} />

      {/* Review text */}
      <p style={{
        fontSize: 14,
        lineHeight: 1.7,
        color: 'rgba(240,244,232,0.82)',
        flex: 1,
        marginBottom: 24,
      }}>
        {review.text}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(163,230,53,0.15), transparent)', marginBottom: 20 }} />

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(163,230,53,0.28)', flexShrink: 0 }}>
          <Image src={review.avatar} alt={review.name} fill style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#f0f4e8', marginBottom: 2 }}>{review.name}</p>
          <p style={{ fontSize: 11, color: 'rgba(163,230,53,0.6)', fontWeight: 500 }}>📍 {review.location}</p>
          <p style={{ fontSize: 11, color: 'rgba(180,200,140,0.4)', marginTop: 1 }}>Trip: {review.trip}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = REVIEWS.length
  // Max offset: show groups of 3, slide by 1
  const maxIndex = total - 3

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, maxIndex)), [maxIndex])
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setCurrent(c => (c >= maxIndex ? 0 : c + 1))
    }, 3500)
    return () => clearInterval(id)
  }, [paused, maxIndex])

  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', padding: '96px 0', overflow: 'hidden' }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src={FOREST_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 45%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,1,0.82)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(163,230,53,0.05) 0%, transparent 65%)' }} />
      </div>

      <div className="container-main" style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          {/* Trust badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
            padding: '7px 18px', borderRadius: 999,
            background: 'rgba(163,230,53,0.07)', border: '1px solid rgba(163,230,53,0.18)',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a3e635',
          }}>
            <span style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </span>
            Trusted by 1,000+ Spiritual Travelers
          </div>

          <h2 style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 'clamp(28px,4vw,46px)',
            fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 12,
          }}>
            What Travelers <span style={{ color: '#a3e635' }}>Say About Us</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(180,200,140,0.5)', maxWidth: 440, margin: '0 auto' }}>
            Real stories from real students. No filters, no scripts — just honest travel memories.
          </p>
        </motion.div>

        {/* ── Carousel ── */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev arrow */}
          <button
            onClick={prev}
            disabled={current === 0}
            style={{
              position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: current === 0 ? 'not-allowed' : 'pointer',
              opacity: current === 0 ? 0.3 : 1,
              transition: 'opacity 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { if (current > 0) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(163,230,53,0.15)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)' }}
          >
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            disabled={current >= maxIndex}
            style={{
              position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: current >= maxIndex ? 'not-allowed' : 'pointer',
              opacity: current >= maxIndex ? 0.3 : 1,
              transition: 'opacity 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { if (current < maxIndex) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(163,230,53,0.15)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)' }}
          >
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Slide viewport */}
          <div style={{ overflow: 'hidden' }}>
            <motion.div
              style={{ display: 'flex', gap: 20 }}
              animate={{ x: `calc(-${current} * (100% / 3 + 7px))` }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {REVIEWS.map((review, i) => (
                <TestimonialCard key={review.name} review={review} delay={i * 0.06} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Dot indicators ── */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                height: 6, borderRadius: 3,
                background: i === current ? '#a3e635' : 'rgba(163,230,53,0.2)',
                border: 'none', cursor: 'pointer', outline: 'none', padding: 0,
              }}
              animate={{ width: i === current ? 28 : 6 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* ── Bottom stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'flex', justifyContent: 'center', gap: 48,
            marginTop: 52, paddingTop: 36,
            borderTop: '1px solid rgba(163,230,53,0.08)',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '1,000+', label: 'Happy Travelers' },
            { value: '4.9★',   label: 'Average Rating'  },
            { value: '12+',    label: 'Trips Completed'  },
            { value: '100%',   label: 'Would Recommend' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#a3e635', fontFamily: "'Outfit',sans-serif", lineHeight: 1.1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(180,200,140,0.45)', marginTop: 4, letterSpacing: '0.05em' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
