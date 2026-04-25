'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type Photo = {
    id: string
    url: string
    caption: string | null
    tripName: string
    category: string | null
}

const FALLBACK: Photo[] = [
    { id: 'f1', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', caption: 'Beach van life vibes', tripName: 'Goa Getaway', category: 'beach' },
    { id: 'f2', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', caption: 'Taj Mahal at golden hour', tripName: 'Jaipur Royale', category: 'culture' },
    { id: 'f3', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', caption: 'Snow-capped Himalayas', tripName: 'Manali Adventure', category: 'mountain' },
    { id: 'f4', url: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800', caption: 'Gateway of India at sunset', tripName: 'Jaipur Royale', category: 'culture' },
    { id: 'f5', url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', caption: 'Amber Fort grandeur', tripName: 'Udaipur Dreams', category: 'culture' },
    { id: 'f6', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', caption: 'Valley views from the top', tripName: 'Manali Adventure', category: 'mountain' },
    { id: 'f7', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption: 'Camping under the stars', tripName: 'Manali Adventure', category: 'mountain' },
    { id: 'f8', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Misty mountain range', tripName: 'Rishikesh Rush', category: 'adventure' },
    { id: 'f9', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', caption: 'Mountain peak adventure', tripName: 'Rishikesh Rush', category: 'adventure' },
]

// Match reference image tab labels exactly
const TABS = [
    { label: 'All',             value: 'all' },
    { label: 'Banaras Vibes',   value: 'Banaras Vibes' },
    { label: 'Manali Adventure',value: 'Manali Adventure' },
    { label: 'Beaches',         value: 'beach' },
    { label: 'Culture',         value: 'culture' },
    { label: 'Adventure',       value: 'adventure' },
]

const TAB_ICONS: Record<string, JSX.Element> = {
    all:              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg>,
    'Banaras Vibes':  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 18L9 6l4 7 3-4 5 9H3z"/></svg>,
    'Manali Adventure':<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 18L9 6l4 7 3-4 5 9H3z"/></svg>,
    beach:            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02l.707.707"/></svg>,
    culture:          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 21V10m4 11V10m4 11V10"/></svg>,
    adventure:        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
}

export default function GalleryPage() {
    const [photos, setPhotos]     = useState<Photo[]>([])
    const [loading, setLoading]   = useState(true)
    const [active, setActive]     = useState('all')
    const [lightbox, setLightbox] = useState<Photo | null>(null)

    useEffect(() => {
        fetch('/api/gallery')
            .then(r => r.json())
            .then(d => setPhotos(d.photos?.length > 0 ? d.photos : FALLBACK))
            .catch(() => setPhotos(FALLBACK))
            .finally(() => setLoading(false))
    }, [])

    const filtered = active === 'all'
        ? photos
        : photos.filter(p => p.tripName === active || p.category === active)

    return (
        <main className="min-h-screen" style={{ background: '#0d150b' }}>

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pt-28 pb-10">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0e1a0c, #0d150b)' }} />
                <div className="absolute inset-0 grid-pattern opacity-30" />

                <div className="relative z-10 text-center px-4">
                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] mb-6 px-4 py-2 rounded-full"
                            style={{ color: '#a3e635', background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.18)' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                            Trip Memories
                        </div>

                        {/* Title — "Our" white, "Gallery" gold (matches reference) */}
                        <h1 className="font-extrabold leading-[1.1] tracking-[-0.02em] mb-5 text-white"
                            style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(48px,6vw,72px)' }}>
                            Our{' '}
                            <span style={{ color: '#d4a843' }}>Gallery</span>
                        </h1>

                        <p className="text-[16px] leading-[1.75] max-w-[420px] mx-auto mb-8" style={{ color: 'rgba(180,200,140,0.55)' }}>
                            Real moments from real trips. Every photo tells a story of adventure, friendship, and discovery.
                        </p>

                        {/* Mountain divider — matches reference */}
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(132,204,22,0.3))' }} />
                            <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                                <path d="M2 22L16 3L30 22H2Z" stroke="#a3e635" strokeWidth="1.5" fill="none" opacity="0.6"/>
                                <path d="M11 22L16 15L21 22H11Z" fill="#a3e635" opacity="0.35"/>
                            </svg>
                            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(132,204,22,0.3))' }} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FILTER TABS ────────────────────────────────────────────── */}
            <div className="container-main pb-2">
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {TABS.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setActive(tab.value)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200"
                            style={active === tab.value
                                ? { background: '#a3e635', color: '#000', boxShadow: '0 4px 14px rgba(163,230,53,0.3)' }
                                : { background: 'transparent', color: 'rgba(180,200,140,0.6)', border: '1px solid rgba(132,204,22,0.15)' }}>
                            {TAB_ICONS[tab.value]}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── UNIFORM 3-COL GRID (matches reference) ─────────────── */}
                {loading ? (
                    <div className="grid grid-cols-3 gap-3">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="rounded-2xl animate-pulse" style={{ height: '220px', background: 'rgba(132,204,22,0.06)', border: '1px solid rgba(132,204,22,0.08)' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📷</div>
                        <p className="text-white font-bold text-xl mb-2">No photos yet</p>
                        <p className="text-sm" style={{ color: 'rgba(180,200,140,0.4)' }}>Photos from this category will appear here soon.</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-3 gap-3">
                        <AnimatePresence>
                            {filtered.map((photo, i) => (
                                <motion.div
                                    key={photo.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.94 }}
                                    transition={{ duration: 0.3, delay: i * 0.03 }}
                                    className="group relative rounded-2xl overflow-hidden cursor-pointer"
                                    style={{ height: '220px', border: '1px solid rgba(132,204,22,0.08)' }}
                                    onClick={() => setLightbox(photo)}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.caption ?? photo.tripName}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#a3e635' }}>{photo.tripName}</p>
                                        {photo.caption && <p className="text-white text-xs font-medium mt-0.5 line-clamp-1">{photo.caption}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ── SHARE CTA ──────────────────────────────────────────── */}
                <motion.div
                    className="mt-12 relative rounded-2xl overflow-hidden text-center py-10 px-6"
                    style={{ background: 'rgba(10,18,8,0.9)', border: '1px solid rgba(132,204,22,0.12)' }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                >
                    {/* Decorative SVGs — matches reference */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-10">
                        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                            <path d="M12 78L28 35L40 60L55 10L72 48L85 28V78H12Z" stroke="#a3e635" strokeWidth="1.5"/>
                            <circle cx="20" cy="65" r="6" stroke="#a3e635" strokeWidth="1"/>
                        </svg>
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
                        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                            <rect x="18" y="28" width="54" height="42" rx="4" stroke="#a3e635" strokeWidth="1.5"/>
                            <circle cx="45" cy="49" r="11" stroke="#a3e635" strokeWidth="1.5"/>
                            <rect x="30" y="20" width="14" height="10" rx="2" stroke="#a3e635" strokeWidth="1"/>
                        </svg>
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)' }}>
                        <svg className="w-6 h-6" fill="none" stroke="#a3e635" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>

                    <h3 className="font-extrabold text-white text-2xl mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Went on a Safarnama trip?
                    </h3>
                    <p className="text-sm mb-6 max-w-[320px] mx-auto" style={{ color: 'rgba(180,200,140,0.5)' }}>
                        Share your photos with us on WhatsApp and we&apos;ll feature them here.
                    </p>

                    <a href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU"
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}>
                        Share Your Photos
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                    </a>
                </motion.div>

                {/* Bottom padding */}
                <div className="pb-12" />
            </div>

            {/* ── LIGHTBOX ──────────────────────────────────────────────── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(14px)' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div
                            className="relative max-w-4xl w-full"
                            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '70vh' }}>
                                <Image src={lightbox.url} alt={lightbox.caption ?? ''} fill className="object-contain" />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a3e635' }}>{lightbox.tripName}</p>
                                    {lightbox.caption && <p className="text-white font-medium mt-0.5">{lightbox.caption}</p>}
                                </div>
                                <button onClick={() => setLightbox(null)}
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
