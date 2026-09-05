'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'


const STATS = [
  { value: '1,000+', label: 'Happy Travelers', icon: '😊' },
  { value: '4.9★', label: 'Average Rating', icon: '⭐' },
  { value: '12+', label: 'Trips Completed', icon: '🗺️' },
  { value: '100%', label: 'Would Recommend', icon: '👍' },
]

/* ── Star Rating display ── */
function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < n ? '#f59e0b' : 'rgba(245,158,11,0.15)'}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

/* ── Review Card ── */
function ReviewCard({ r, i }: { r: any; i: number }) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const SHORT = 160
  const isLong = (r.review || '').length > SHORT
  const accent = '#a3e635'

  const formattedDate = r.createdAt
    ? new Date(r.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recent'

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
        borderColor: `${accent}40`,
        boxShadow: `0 16px 56px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20`,
        y: -5,
      }}
    >
      {/* Accent glow top-left */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `${accent}08`,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* Big quote mark */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          fontSize: 72,
          lineHeight: 1,
          color: `${accent}10`,
          fontFamily: 'Georgia,serif',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        "
      </div>

      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              position: 'relative',
              width: 48,
              height: 48,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              border: `2px solid ${accent}40`,
              background: '#122012',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {r.avatar ? (
              <Image src={r.avatar} alt={r.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: 18, fontWeight: 700, color: '#a3e635' }}>
                {(r.name || 'T')[0].toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f4e8' }}>{r.name}</p>
              {r.verified && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 9,
                    fontWeight: 700,
                    color: '#a3e635',
                    background: 'rgba(163,230,53,0.08)',
                    border: '1px solid rgba(163,230,53,0.2)',
                    padding: '2px 7px',
                    borderRadius: 999,
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            {(r.college || r.location) && (
              <p style={{ fontSize: 11, color: 'rgba(180,200,140,0.45)', marginTop: 2 }}>
                {r.college ? r.college : ''}
                {r.college && r.location ? ' · ' : ''}
                {r.location ? `📍 ${r.location}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Rating + trip tag */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <Stars n={r.rating} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: accent,
              background: `${accent}12`,
              border: `1px solid ${accent}28`,
              padding: '3px 9px',
              borderRadius: 999,
            }}
          >
            ✈️ {r.tripName}
          </span>
        </div>
      </div>

      {/* Thin accent rule */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${accent}30, transparent)`,
          marginBottom: 14,
        }}
      />

      {/* Review title */}
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#f0f4e8',
          marginBottom: 10,
          lineHeight: 1.35,
        }}
      >
        &ldquo;{r.title}&rdquo;
      </h3>

      {/* Review text */}
      <p
        style={{
          fontSize: 13.5,
          lineHeight: 1.72,
          color: 'rgba(200,220,160,0.65)',
          marginBottom: 10,
        }}
      >
        {expanded || !isLong ? r.review : (r.review || '').slice(0, SHORT) + '…'}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: 12,
            fontWeight: 600,
            color: accent,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {expanded ? 'Show less ↑' : 'Read full review ↓'}
        </button>
      )}

      {/* Photos */}
      {r.photos && r.photos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {r.photos.map((p: string, pi: number) => (
            <div
              key={pi}
              style={{
                width: 80,
                height: 64,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid rgba(163,230,53,0.10)',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <Image
                src={p}
                alt="Trip photo"
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLImageElement).style.transform = 'scale(1.12)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 18,
          paddingTop: 14,
          borderTop: '1px solid rgba(132,204,22,0.06)',
        }}
      >
        <span style={{ fontSize: 11, color: 'rgba(180,200,140,0.35)' }}>📅 {formattedDate}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(163,230,53,0.5)' }}>
          Trip: {r.tripName}
        </span>
      </div>
    </motion.div>
  )
}

/* ── Page ── */
export default function ReviewsPage() {
  const { data: session } = useSession()
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  const [reviews, setReviews] = useState<any[]>([])
  const [trips, setTrips] = useState<string[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)

  // Review modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Form fields
  const [tripName, setTripName] = useState('')
  const [customTrip, setCustomTrip] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [college, setCollege] = useState('')
  const [location, setLocation] = useState('')

  // Fetch reviews & trips
  useEffect(() => {
    async function loadData() {
      try {
        const [revRes, tripRes] = await Promise.all([
          fetch('/api/reviews').then(r => r.json()).catch(() => ({ reviews: [] })),
          fetch('/api/trips').then(r => r.json()).catch(() => []),
        ])

        if (revRes.reviews && revRes.reviews.length > 0) {
          setReviews(revRes.reviews)
        }

        if (Array.isArray(tripRes)) {
          const names = tripRes.map((t: any) => t.name).filter(Boolean)
          setTrips(names)
          if (names.length > 0) setTripName(names[0])
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
      } finally {
        setLoadingReviews(false)
      }
    }
    loadData()
  }, [])

  const handleOpenReviewModal = () => {
    if (!session) {
      setIsAuthPromptOpen(true)
    } else {
      setSubmitSuccess(false)
      setSubmitError(null)
      setIsModalOpen(true)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedTrip = tripName === 'Other' ? customTrip.trim() : tripName.trim()

    if (!selectedTrip) {
      setSubmitError('Please select or specify a trip')
      return
    }
    if (!title.trim() || !reviewText.trim()) {
      setSubmitError('Please provide a title and your review')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripName: selectedTrip,
          rating,
          title: title.trim(),
          review: reviewText.trim(),
          college: college.trim() || undefined,
          location: location.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      setSubmitSuccess(true)
      // reset form
      setTitle('')
      setReviewText('')
      setCollege('')
      setLocation('')
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: '#080f08' }}>
      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 140,
          paddingBottom: 72,
        }}
      >
        {/* bg photo */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(3,8,2,0.70)' }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(132,204,22,0.10) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 160, background: 'linear-gradient(to bottom, transparent, #080f08)' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 22,
                padding: '7px 18px',
                borderRadius: 999,
                background: 'rgba(163,230,53,0.08)',
                border: '1px solid rgba(163,230,53,0.2)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#a3e635',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#a3e635',
                  display: 'inline-block',
                }}
              />
              Traveler Stories & Reviews
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: 'clamp(44px,7vw,76px)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                color: '#f0f4e8',
                marginBottom: 18,
              }}
            >
              Real{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#a3e635,#fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Traveler Reviews
              </span>
            </h1>

            <p
              style={{
                fontSize: 17,
                lineHeight: 1.75,
                color: 'rgba(180,200,140,0.65)',
                maxWidth: 520,
                margin: '0 auto 28px',
              }}
            >
              Honest memories from travelers who experienced Safarnama journeys. No filters, no scripts — authentic group vibes.
            </p>

            {/* Actions: Rating Badge + Write Review Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 20px',
                  borderRadius: 999,
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}
              >
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f4e8' }}>4.9 / 5</span>
                <span style={{ fontSize: 13, color: 'rgba(180,200,140,0.5)' }}>
                  ({reviews.length}+ reviews)
                </span>
              </div>

              <button
                onClick={handleOpenReviewModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 24px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #a3e635, #65a30d)',
                  color: '#050c05',
                  fontWeight: 700,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(163,230,53,0.35)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(163,230,53,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(163,230,53,0.35)'
                }}
              >
                <span>✍️</span> Write a Review
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div ref={statsRef} className="container-main" style={{ marginBottom: 64 }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}
          className="stats-grid"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                textAlign: 'center',
                borderRadius: 18,
                padding: '24px 16px',
                background: 'rgba(6,10,5,0.7)',
                border: '1px solid rgba(132,204,22,0.10)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <p
                style={{
                  fontSize: 'clamp(22px,3vw,30px)',
                  fontWeight: 800,
                  color: '#a3e635',
                  fontFamily: 'var(--font-outfit)',
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: 'rgba(180,200,140,0.4)',
                  marginTop: 5,
                  letterSpacing: '0.04em',
                }}
              >
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
          <h2
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: 'clamp(24px,3.5vw,36px)',
              fontWeight: 700,
              color: '#f0f4e8',
              marginBottom: 8,
            }}
          >
            Traveler <span style={{ color: '#a3e635' }}>Experiences</span>
          </h2>
          <div
            style={{
              height: 2,
              width: 60,
              background: 'linear-gradient(90deg, transparent, #a3e635, transparent)',
              margin: '0 auto',
            }}
          />
        </motion.div>

        {/* 2-col grid */}
        {loadingReviews ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }} className="reviews-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ borderRadius: 22, height: 260, background: 'rgba(6,10,5,0.65)', border: '1px solid rgba(132,204,22,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '72px 24px', borderRadius: 22, background: 'rgba(6,10,5,0.65)', border: '1px solid rgba(132,204,22,0.08)' }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>✍️</div>
            <p style={{ color: '#f0f4e8', fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-outfit)' }}>No reviews yet</p>
            <p style={{ color: 'rgba(180,200,140,0.45)', fontSize: 14, marginBottom: 28 }}>Be the first to share your Safarnama experience!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }} className="reviews-grid">
            {reviews.map((r, i) => (
              <ReviewCard key={r.id || i} r={r} i={i} />
            ))}
          </div>
        )}

        {/* ── SUBMIT REVIEW CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: 64 }}
        >
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 24,
              padding: '56px 40px',
              background: 'rgba(6,10,5,0.80)',
              border: '1px solid rgba(163,230,53,0.14)',
              backdropFilter: 'blur(24px)',
              textAlign: 'center',
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(132,204,22,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'rgba(163,230,53,0.08)',
                border: '1px solid rgba(163,230,53,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <span style={{ fontSize: 26 }}>⭐</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: 26,
                fontWeight: 800,
                color: '#f0f4e8',
                marginBottom: 10,
              }}
            >
              Traveled with Safarnama?
            </h3>
            <p
              style={{
                fontSize: 15,
                color: 'rgba(180,200,140,0.55)',
                maxWidth: 420,
                margin: '0 auto 28px',
                lineHeight: 1.6,
              }}
            >
              Share your honest feedback, photos and memories. Your story helps fellow students take the leap!
            </p>

            <button
              onClick={handleOpenReviewModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                borderRadius: 14,
                background: 'linear-gradient(135deg,#a3e635,#65a30d)',
                color: '#080f08',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(163,230,53,0.30)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 32px rgba(163,230,53,0.42)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(163,230,53,0.30)'
              }}
            >
              <span>✍️</span> Leave Your Review
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── AUTH PROMPT MODAL (When user tries to review without signing in) ── */}
      <AnimatePresence>
        {isAuthPromptOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'rgba(10,18,8,0.98)',
                border: '1px solid rgba(163,230,53,0.2)',
                borderRadius: 24,
                padding: '36px 32px',
                maxWidth: 440,
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(163,230,53,0.1)',
                  border: '1px solid rgba(163,230,53,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: 24,
                }}
              >
                🔐
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 8,
                }}
              >
                Sign In to Leave a Review
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'rgba(180,200,140,0.6)',
                  marginBottom: 24,
                }}
              >
                To maintain verified, authentic reviews from real travelers, we require you to be signed in to your Safarnama account.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link
                  href="/auth/login?callbackUrl=/blog"
                  style={{
                    display: 'block',
                    padding: '14px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #a3e635, #65a30d)',
                    color: '#050c05',
                    fontWeight: 800,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  Sign In with Account / Google →
                </Link>
                <button
                  onClick={() => setIsAuthPromptOpen(false)}
                  style={{
                    padding: '12px',
                    borderRadius: 12,
                    background: 'transparent',
                    color: 'rgba(180,200,140,0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── WRITE REVIEW MODAL (Logged in) ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                background: 'rgba(10,18,8,0.98)',
                border: '1px solid rgba(163,230,53,0.25)',
                borderRadius: 24,
                padding: '32px 28px',
                maxWidth: 520,
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                ✕
              </button>

              {submitSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 8px' }}>
                  <div
                    style={{
                      fontSize: 48,
                      marginBottom: 16,
                      display: 'inline-block',
                      animation: 'bounce 1s infinite',
                    }}
                  >
                    🎉
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: 24,
                      fontWeight: 800,
                      color: '#a3e635',
                      marginBottom: 10,
                    }}
                  >
                    Review Submitted!
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'rgba(180,200,140,0.7)',
                      lineHeight: 1.6,
                      marginBottom: 24,
                    }}
                  >
                    Thank you for sharing your experience! Your review is pending approval from our team and will appear publicly once verified.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: '12px 28px',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #a3e635, #65a30d)',
                      color: '#050c05',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  {/* Header */}
                  <div style={{ marginBottom: 20 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-outfit)',
                        fontSize: 22,
                        fontWeight: 800,
                        color: '#f0f4e8',
                        marginBottom: 4,
                      }}
                    >
                      Share Your Experience
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(180,200,140,0.5)' }}>
                      Posting as <span style={{ color: '#a3e635', fontWeight: 600 }}>{session?.user?.name || session?.user?.email}</span>
                    </p>
                  </div>

                  {submitError && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#f87171',
                        fontSize: 13,
                        marginBottom: 16,
                      }}
                    >
                      ⚠️ {submitError}
                    </div>
                  )}

                  {/* Trip Selection */}
                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'rgba(163,230,53,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: 6,
                      }}
                    >
                      Which Trip did you join? *
                    </label>
                    <select
                      value={tripName}
                      onChange={e => setTripName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(132,204,22,0.18)',
                        color: '#fff',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    >
                      {trips.map(t => (
                        <option key={t} value={t} style={{ background: '#0a1208', color: '#fff' }}>
                          {t}
                        </option>
                      ))}
                      <option value="Other" style={{ background: '#0a1208', color: '#fff' }}>
                        + Other Destination
                      </option>
                    </select>

                    {tripName === 'Other' && (
                      <input
                        type="text"
                        placeholder="Enter trip name (e.g. Kedarnath Trek)"
                        value={customTrip}
                        onChange={e => setCustomTrip(e.target.value)}
                        style={{
                          width: '100%',
                          marginTop: 8,
                          padding: '11px 14px',
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(132,204,22,0.18)',
                          color: '#fff',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    )}
                  </div>

                  {/* Rating Selector */}
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'rgba(163,230,53,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: 6,
                      }}
                    >
                      Your Rating *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(star => {
                        const filled = (hoverRating || rating) >= star
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 2,
                            }}
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill={filled ? '#f59e0b' : 'rgba(245,158,11,0.2)'}
                              style={{ transition: 'transform 0.15s' }}
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        )
                      })}
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#f59e0b',
                          marginLeft: 8,
                        }}
                      >
                        {rating === 5
                          ? '5.0 — Excellent!'
                          : rating === 4
                          ? '4.0 — Great!'
                          : rating === 3
                          ? '3.0 — Good'
                          : rating === 2
                          ? '2.0 — Fair'
                          : '1.0 — Poor'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'rgba(163,230,53,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: 6,
                      }}
                    >
                      Review Headline *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Unforgettable Ganga Aarti & amazing group!"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(132,204,22,0.18)',
                        color: '#fff',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* College & Location (Row) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'rgba(163,230,53,0.6)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: 6,
                        }}
                      >
                        College / University
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. IIT Delhi"
                        value={college}
                        onChange={e => setCollege(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(132,204,22,0.18)',
                          color: '#fff',
                          fontSize: 13,
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'rgba(163,230,53,0.6)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: 6,
                        }}
                      >
                        City / State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New Delhi"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(132,204,22,0.18)',
                          color: '#fff',
                          fontSize: 13,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'rgba(163,230,53,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: 6,
                      }}
                    >
                      Your Story / Review *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about the stays, itinerary, leaders, moments you loved most..."
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(132,204,22,0.18)',
                        color: '#fff',
                        fontSize: 14,
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Submit button */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #a3e635, #65a30d)',
                        color: '#050c05',
                        fontWeight: 800,
                        fontSize: 14,
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                    >
                      {isSubmitting ? 'Submitting Review...' : '🚀 Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(180,200,140,0.6)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
