'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GALLERY = [
    {
        trip: 'Banaras Vibes',
        photos: [
            { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Ganga Aarti at Dashashwamedh Ghat' },
            { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', caption: 'Sunrise boat ride on the Ganges' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'The ghats at golden hour' },
            { url: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800', caption: 'Street food trail in Varanasi' },
            { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', caption: 'Temple visit with the squad' },
            { url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800', caption: 'Group bonfire by the river' },
        ],
    },
    {
        trip: 'Manali Adventure',
        photos: [
            { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', caption: 'Snow-capped Himalayas' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Rohtang Pass adventure' },
            { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption: 'Camping under the stars' },
            { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', caption: 'Valley views from the top' },
        ],
    },
]

const ALL_PHOTOS = [
    ...GALLERY[0].photos.map(p => ({ ...p, trip: 'Banaras Vibes' })),
    ...GALLERY[1].photos.map(p => ({ ...p, trip: 'Manali Adventure' })),
]

export default function GalleryPage() {
    const [activeTrip, setActiveTrip] = useState('All')
    const [lightbox, setLightbox] = useState<{ url: string; caption: string; trip: string } | null>(null)

    const trips = ['All', ...GALLERY.map(g => g.trip)]
    const filtered = activeTrip === 'All' ? ALL_PHOTOS : ALL_PHOTOS.filter(p => p.trip === activeTrip)

    return (
        <main className="min-h-screen bg-[#020817]">

            {/* Hero */}
            <section className="relative min-h-[420px] flex items-center pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#020817] to-[#020817]" />
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-500/8 rounded-full blur-[120px]" />

                <div className="container-main relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                            Trip Memories
                        </div>
                        <h1 className="text-[56px] md:text-[68px] font-[var(--font-outfit)] font-extrabold text-white leading-[1.0] tracking-[-0.03em] mb-5">
                            Our <span className="bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">Gallery</span>
                        </h1>
                        <p className="text-[17px] text-slate-400 leading-[1.75] max-w-[480px] mx-auto">
                            Real moments from real trips. Every photo tells a story of adventure, friendship, and discovery.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter tabs */}
            <section className="container-main pb-8">
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    {trips.map((trip) => (
                        <button
                            key={trip}
                            onClick={() => setActiveTrip(trip)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                                activeTrip === trip
                                    ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/25'
                                    : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
                            }`}
                        >
                            {trip}
                        </button>
                    ))}
                </div>

                {/* Masonry grid */}
                <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    <AnimatePresence>
                        {filtered.map((photo, i) => (
                            <motion.div
                                key={photo.url + i}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-white/[0.07] cursor-pointer"
                                onClick={() => setLightbox(photo)}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption}
                                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">{photo.trip}</span>
                                    <p className="text-white text-sm font-medium mt-0.5">{photo.caption}</p>
                                </div>
                                {/* Zoom icon */}
                                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Upload CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] max-w-md mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                            <svg className="w-7 h-7 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-semibold mb-1">Went on a Safarnama trip?</p>
                            <p className="text-slate-500 text-sm">Share your photos with us on WhatsApp and we&apos;ll feature them here.</p>
                        </div>
                        <a
                            href="https://chat.whatsapp.com/LCYyIzi0cCcFmcrQ9vpTjU?mode=gi_t"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm px-6 py-2.5"
                        >
                            Share Your Photos
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div
                            className="relative max-w-4xl w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={lightbox.url} alt={lightbox.caption} className="w-full rounded-2xl" />
                            <div className="mt-3 flex items-center justify-between">
                                <div>
                                    <span className="text-sky-400 text-xs font-bold uppercase tracking-wider">{lightbox.trip}</span>
                                    <p className="text-white font-medium mt-0.5">{lightbox.caption}</p>
                                </div>
                                <button onClick={() => setLightbox(null)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
