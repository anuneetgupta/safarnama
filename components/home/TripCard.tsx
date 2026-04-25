'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import TripRegistrationModal from '@/components/ui/TripRegistrationModal'

type TripStatus = 'completed' | 'coming_soon' | 'yet_to_announce' | 'booking_open'

interface TripCardProps {
    id: string
    destination: string
    description: string
    startDate: string
    endDate: string
    price: number
    totalSlots: number
    bookedSlots: number
    image: string
    index: number
    status: TripStatus
}

const STATUS_CONFIG: Record<TripStatus, { label: string; badge: string; border: string; overlay: string }> = {
    completed:       { label: 'COMPLETED',       badge: 'bg-stone-700/90 text-stone-300',                    border: 'border-stone-600/20',                        overlay: 'bg-black/50' },
    coming_soon:     { label: 'COMING SOON',     badge: 'bg-lime-500/90 text-black font-bold animate-pulse', border: 'border-lime-500/30 hover:border-lime-500/60', overlay: '' },
    booking_open:    { label: 'BOOKING OPEN',    badge: 'bg-amber-500/90 text-black font-bold animate-pulse',border: 'border-amber-500/30 hover:border-amber-500/60',overlay: '' },
    yet_to_announce: { label: 'YET TO ANNOUNCE', badge: 'bg-stone-800/90 text-stone-500',                   border: 'border-stone-700/20',                        overlay: 'bg-black/30' },
}

export default function TripCard({ destination, description, startDate, endDate, price, totalSlots, bookedSlots, image, index, status }: TripCardProps) {
    const [modalOpen, setModalOpen] = useState(false)
    const cfg = STATUS_CONFIG[status]
    const isCompleted     = status === 'completed'
    const isComingSoon    = status === 'coming_soon'
    const isBookingOpen   = status === 'booking_open'
    const isYetToAnnounce = status === 'yet_to_announce'

    const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))

    return (
        <>
            <motion.div
                className={`group relative flex flex-col rounded-2xl overflow-hidden border bg-[#0a150a]/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_8px_60px_rgba(0,0,0,0.7)] hover:-translate-y-1 ${cfg.border}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                    <Image src={image} alt={destination} fill className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isCompleted || isYetToAnnounce ? 'grayscale-[40%]' : ''}`} />
                    <div className={`absolute inset-0 bg-gradient-to-t from-[#0a150a] via-[#0a150a]/20 to-transparent ${cfg.overlay}`} />
                    {!isYetToAnnounce && (
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                            {duration}D / {duration - 1}N
                        </div>
                    )}
                    <div className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md ${cfg.badge}`}>{cfg.label}</div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                    <h3 className={`font-bold text-[1.05rem] mb-1.5 transition-colors duration-200 ${isCompleted ? 'text-slate-400' : 'text-white group-hover:text-lime-300'}`}>{destination}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{description}</p>

                    {!isYetToAnnounce && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span>{new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="mb-4">
                            <div className="flex justify-between text-[11px] text-slate-600 mb-1.5"><span>{bookedSlots} booked</span><span>{totalSlots} total</span></div>
                            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden"><div className="h-full w-full rounded-full bg-gradient-to-r from-slate-500 to-slate-400" /></div>
                        </div>
                    )}

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                        <div>
                            {isCompleted    && <><p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Was</p><p className="text-xl font-extrabold text-slate-400">{formatCurrency(price)}</p></>}
                            {isComingSoon   && <><p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Price</p><p className="text-base font-bold text-lime-400">Announcing Soon</p></>}
                            {isYetToAnnounce&& <><p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Details</p><p className="text-base font-bold text-slate-500">To Be Announced</p></>}
                            {isBookingOpen  && <><p className="text-[10px] text-lime-500 uppercase tracking-wider mb-0.5">Booking Open</p><p className="text-xl font-extrabold text-white">{price > 0 ? formatCurrency(price) : 'Register Now'}</p></>}
                        </div>

                        {isCompleted     && <span className="text-xs font-semibold text-slate-500 bg-slate-700/50 border border-slate-600/30 px-4 py-2 rounded-xl">Trip Done ✓</span>}
                        {isComingSoon    && <button onClick={() => setModalOpen(true)} className="btn-primary text-sm px-5 py-2.5">Notify Me 🔔</button>}
                        {isBookingOpen   && <button onClick={() => setModalOpen(true)} className="btn-primary text-sm px-5 py-2.5">Book Now →</button>}
                        {isYetToAnnounce && <span className="text-xs font-semibold text-slate-600 bg-white/[0.04] border border-white/[0.06] px-4 py-2 rounded-xl">Stay Tuned</span>}
                    </div>
                </div>
            </motion.div>

            {/* Our own registration form — no third party */}
            {modalOpen && (
                <TripRegistrationModal
                    trip={{ destination, price, status }}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    )
}
