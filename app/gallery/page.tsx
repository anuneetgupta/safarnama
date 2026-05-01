'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'

type Photo = {
  id: string
  url: string
  caption: string | null
  tripName: string
  category: string | null
}

const FALLBACK: Photo[] = [
  { id:'f1', url:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', caption:'Beach van life vibes',       tripName:'Goa Getaway',      category:'beach'     },
  { id:'f2', url:'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', caption:'Taj Mahal at golden hour',  tripName:'Jaipur Royale',    category:'culture'   },
  { id:'f3', url:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', caption:'Snow-capped Himalayas', tripName:'Manali Adventure', category:'mountain'  },
  { id:'f4', url:'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800', caption:'Gateway of India',      tripName:'Jaipur Royale',    category:'culture'   },
  { id:'f5', url:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', caption:'Amber Fort grandeur',   tripName:'Udaipur Dreams',   category:'culture'   },
  { id:'f6', url:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', caption:'Valley views from top', tripName:'Manali Adventure', category:'mountain'  },
  { id:'f7', url:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption:'Camping under stars',   tripName:'Manali Adventure', category:'mountain'  },
  { id:'f8', url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption:'Misty mountain range',  tripName:'Rishikesh Rush',   category:'adventure' },
  { id:'f9', url:'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', caption:'Mountain peak adventure', tripName:'Rishikesh Rush',   category:'adventure' },
]

const TABS = [
  { label:'All',              value:'all',              icon:'⊞' },
  { label:'Banaras Vibes',    value:'Banaras Vibes',    icon:'🕌' },
  { label:'Manali Adventure', value:'Manali Adventure', icon:'⛰️' },
  { label:'Beaches',          value:'beach',            icon:'🌊' },
  { label:'Culture',          value:'culture',          icon:'🏛️' },
  { label:'Adventure',        value:'adventure',        icon:'⚡' },
]

const EASE = [0.25, 0.46, 0.45, 0.94] as const

/* ── GalleryCard ── */
function GalleryCard({ photo, index, onClick }: { photo:Photo; index:number; onClick:()=>void }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once:true, margin:'-40px' })

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity:0, y:36 }}
      animate={inView ? { opacity:1, y:0 } : { opacity:0, y:36 }}
      exit={{ opacity:0, scale:0.93 }}
      transition={{ duration:0.55, delay:index*0.05, ease:EASE }}
      className="group relative overflow-hidden cursor-pointer"
      style={{
        borderRadius:20,
        height:300,
        border:'1px solid rgba(132,204,22,0.10)',
        boxShadow:'0 4px 24px rgba(0,0,0,0.4)',
        transition:'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease',
      }}
      onMouseEnter={e=>{
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor='rgba(163,230,53,0.45)'
        el.style.boxShadow='0 0 0 1px rgba(163,230,53,0.18), 0 12px 48px rgba(0,0,0,0.6)'
        el.style.transform='translateY(-4px)'
      }}
      onMouseLeave={e=>{
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor='rgba(132,204,22,0.10)'
        el.style.boxShadow='0 4px 24px rgba(0,0,0,0.4)'
        el.style.transform='translateY(0)'
      }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius:20 }}>
        <Image
          src={photo.url}
          alt={photo.caption ?? photo.tripName}
          fill
          className="object-cover group-hover:scale-[1.1]"
          style={{ transition:'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        />
      </div>

      {/* Always-on subtle vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:'linear-gradient(to top, rgba(5,12,3,0.5) 0%, transparent 50%)', borderRadius:20 }} />

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ background:'linear-gradient(to top, rgba(4,10,2,0.92) 0%, rgba(4,10,2,0.5) 38%, transparent 72%)', transition:'opacity 0.4s ease', borderRadius:20 }} />

      {/* Category badge — top right, slides down on hover */}
      {photo.category && (
        <div
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
          style={{
            transform:'translateY(-8px)',
            transition:'opacity 0.3s ease 0.08s, transform 0.3s ease 0.08s',
            background:'rgba(163,230,53,0.12)',
            border:'1px solid rgba(163,230,53,0.32)',
            backdropFilter:'blur(8px)',
            borderRadius:999,
            padding:'4px 11px',
            fontSize:10,
            fontWeight:700,
            letterSpacing:'0.12em',
            textTransform:'uppercase',
            color:'#a3e635',
          }}
        >
          <span className="group-hover:[transform:translateY(0)]">{photo.category}</span>
        </div>
      )}

      {/* Caption panel — slides up on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0"
        style={{ padding:'18px 16px 16px', transition:'opacity 0.38s ease 0.06s, transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94) 0.06s' }}
      >
        {/* Lime accent rule */}
        <div style={{ width:30, height:2, background:'linear-gradient(90deg,#a3e635,#84cc16)', borderRadius:2, marginBottom:8 }} />
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#a3e635', marginBottom:4 }}>
          {photo.tripName}
        </p>
        {photo.caption && (
          <p style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.88)', lineHeight:1.45 }} className="line-clamp-2">
            {photo.caption}
          </p>
        )}
        <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:5, color:'rgba(255,255,255,0.38)', fontSize:10 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
          Click to expand
        </div>
      </div>
    </motion.div>
  )
}

/* ── Lightbox ── */
function Lightbox({ photos, index, onClose, onPrev, onNext }:{
  photos:Photo[]; index:number; onClose:()=>void; onPrev:()=>void; onNext:()=>void
}) {
  const photo = photos[index]
  useEffect(()=>{
    const fn=(e:KeyboardEvent)=>{
      if(e.key==='Escape') onClose()
      if(e.key==='ArrowRight') onNext()
      if(e.key==='ArrowLeft') onPrev()
    }
    window.addEventListener('keydown',fn)
    return ()=>window.removeEventListener('keydown',fn)
  },[onClose,onNext,onPrev])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background:'rgba(2,8,2,0.95)', backdropFilter:'blur(20px)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
    >
      {/* Prev */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full"
        style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)' }}
        onClick={e=>{ e.stopPropagation(); onPrev() }}
      >
        <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Next */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full"
        style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)' }}
        onClick={e=>{ e.stopPropagation(); onNext() }}
      >
        <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      {/* Close */}
      <button
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full"
        style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)' }}
        onClick={onClose}
      >
        <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          className="relative max-w-4xl w-full mx-4"
          initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
          transition={{ duration:0.3, ease:EASE }}
          onClick={e=>e.stopPropagation()}
        >
          <div className="relative w-full overflow-hidden" style={{ height:'70vh', borderRadius:20, border:'1px solid rgba(132,204,22,0.15)' }}>
            <Image src={photo.url} alt={photo.caption??''} fill className="object-contain" />
          </div>
          {/* Info bar */}
          <div className="flex items-center justify-between mt-4 px-1">
            <div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#a3e635' }}>{photo.tripName}</p>
              {photo.caption && <p className="text-white font-medium mt-1" style={{ fontSize:15 }}>{photo.caption}</p>}
            </div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>{index+1} / {photos.length}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Page ── */
export default function GalleryPage() {
  const [photos, setPhotos]   = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive]   = useState('all')
  const [lbIndex, setLbIndex] = useState<number|null>(null)

  useEffect(()=>{
    fetch('/api/gallery')
      .then(r=>r.json())
      .then(d=>setPhotos(d.photos?.length>0?d.photos:FALLBACK))
      .catch(()=>setPhotos(FALLBACK))
      .finally(()=>setLoading(false))
  },[])

  const filtered = active==='all' ? photos : photos.filter(p=>p.tripName===active||p.category===active)

  const openLb  = useCallback((i:number)=>setLbIndex(i),[])
  const closeLb = useCallback(()=>setLbIndex(null),[])
  const prevLb  = useCallback(()=>setLbIndex(i=>i!==null?(i-1+filtered.length)%filtered.length:null),[filtered.length])
  const nextLb  = useCallback(()=>setLbIndex(i=>i!==null?(i+1)%filtered.length:null),[filtered.length])

  return (
    <main className="min-h-screen" style={{ background:'#080f08' }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ paddingTop:140, paddingBottom:80, minHeight:440 }}>
        {/* ── Background travel photo ── */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale:1.06 }} animate={{ scale:1 }}
          transition={{ duration:1.8, ease:[0.25,0.46,0.45,0.94] }}
          style={{
            backgroundImage:`url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')`,
            backgroundSize:'cover',
            backgroundPosition:'center 40%',
          }}
        />

        {/* Layer 1: strong dark scrim so text is legible */}
        <div className="absolute inset-0" style={{ background:'rgba(4,10,3,0.62)' }} />

        {/* Layer 2: lime-tinted radial glow from top center */}
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(132,204,22,0.10) 0%, transparent 65%)' }} />

        {/* Layer 3: bottom fade → matches page bg so section blends seamlessly */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height:160, background:'linear-gradient(to bottom, transparent 0%, #080f08 100%)' }} />

        {/* Layer 4: subtle grid on top */}
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>

            {/* eyebrow badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
              style={{ background:'rgba(163,230,53,0.07)', border:'1px solid rgba(163,230,53,0.18)', color:'#a3e635', fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              Trip Memories
            </div>

            {/* headline */}
            <h1 style={{ fontFamily:'var(--font-outfit)', fontSize:'clamp(52px,7vw,80px)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.025em', color:'#f0f4e8', marginBottom:20 }}>
              Our{' '}
              <span style={{ background:'linear-gradient(135deg,#d4a843,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Gallery
              </span>
            </h1>

            <p style={{ fontSize:17, lineHeight:1.75, color:'rgba(180,200,140,0.55)', maxWidth:420, margin:'0 auto 32px' }}>
              Real moments from real trips. Every photo tells a story of adventure, friendship, and discovery.
            </p>

            {/* decorative divider */}
            <div className="flex items-center justify-center gap-4">
              <div style={{ height:1, width:80, background:'linear-gradient(to right,transparent,rgba(132,204,22,0.3))' }} />
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                <path d="M2 20L14 2L26 20H2Z" stroke="#a3e635" strokeWidth="1.5" opacity="0.6"/>
                <path d="M10 20L14 14L18 20H10Z" fill="#a3e635" opacity="0.4"/>
              </svg>
              <div style={{ height:1, width:80, background:'linear-gradient(to left,transparent,rgba(132,204,22,0.3))' }} />
            </div>

          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="container-main" style={{ paddingBottom:80 }}>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center"
          style={{ marginBottom:40 }}
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.2 }}
        >
          {TABS.map(tab=>(
            <button
              key={tab.value}
              onClick={()=>setActive(tab.value)}
              style={active===tab.value
                ? { background:'linear-gradient(135deg,#a3e635,#84cc16)', color:'#080f08', borderRadius:999, padding:'8px 18px', fontSize:13, fontWeight:700, border:'none', boxShadow:'0 4px 20px rgba(163,230,53,0.35)', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }
                : { background:'rgba(132,204,22,0.05)', color:'rgba(180,200,140,0.65)', borderRadius:999, padding:'8px 18px', fontSize:13, fontWeight:600, border:'1px solid rgba(132,204,22,0.14)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, backdropFilter:'blur(8px)', transition:'all 0.2s ease' }}
            >
              <span style={{ fontSize:14 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-5">
            {[...Array(9)].map((_,i)=>(
              <div key={i} className="rounded-2xl animate-pulse" style={{ height:300, background:'rgba(132,204,22,0.05)', border:'1px solid rgba(132,204,22,0.08)' }} />
            ))}
          </div>
        ) : filtered.length===0 ? (
          <div className="text-center py-24">
            <div style={{ fontSize:56, marginBottom:16 }}>📷</div>
            <p style={{ color:'#f0f4e8', fontSize:20, fontWeight:700, marginBottom:8 }}>No photos yet</p>
            <p style={{ color:'rgba(180,200,140,0.4)', fontSize:14 }}>Photos from this category will appear here soon.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((photo,i)=>(
                <GalleryCard key={photo.id} photo={photo} index={i} onClick={()=>openLb(i)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Share CTA ── */}
        <motion.div
          className="relative overflow-hidden text-center"
          style={{ marginTop:64, borderRadius:24, padding:'52px 32px', background:'rgba(8,15,8,0.9)', border:'1px solid rgba(132,204,22,0.12)' }}
          initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.55 }}
        >
          {/* Glow bg */}
          <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(132,204,22,0.05) 0%, transparent 70%)' }} />

          {/* Camera icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-5"
            style={{ background:'rgba(163,230,53,0.08)', border:'1px solid rgba(163,230,53,0.2)' }}>
            <svg className="w-7 h-7" fill="none" stroke="#a3e635" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>

          <h3 style={{ fontFamily:'var(--font-outfit)', fontSize:26, fontWeight:800, color:'#f0f4e8', marginBottom:10 }}>
            Went on a Safarnama trip?
          </h3>
          <p style={{ fontSize:15, color:'rgba(180,200,140,0.5)', maxWidth:320, margin:'0 auto 28px' }}>
            Share your photos with us on WhatsApp and we&apos;ll feature them here.
          </p>

          <a
            href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-bold text-white"
            style={{ background:'linear-gradient(135deg,#25d366,#128c7e)', borderRadius:14, padding:'14px 28px', fontSize:14, boxShadow:'0 6px 24px rgba(37,211,102,0.35)', textDecoration:'none', transition:'transform 0.2s ease, box-shadow 0.2s ease' }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLAnchorElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow='0 10px 32px rgba(37,211,102,0.45)' }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLAnchorElement).style.transform='none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow='0 6px 24px rgba(37,211,102,0.35)' }}
          >
            Share Your Photos
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
        </motion.div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lbIndex!==null && (
          <Lightbox
            photos={filtered}
            index={lbIndex}
            onClose={closeLb}
            onPrev={prevLb}
            onNext={nextLb}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
