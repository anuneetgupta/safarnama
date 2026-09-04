'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Trip = {
  id: string
  name: string
  destination: string
  description: string
  price: number
  status: string
  startDate: string | null
  endDate: string | null
  totalSlots: number
  bookedSlots: number
  imageUrl: string | null
  featured: boolean
}

export default function Destinations() {
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    fetch('/api/trips')
      .then(r => r.json())
      .then(d => setTrips((d.trips || []).slice(0, 8)))
      .catch(() => setTrips([]))
  }, [])

  return (
    <section className="section bg-[#0a0f1a]">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-64px"
        >
          <div className="badge badge-secondary mb-16px justify-center">
            <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
            Popular Destinations
          </div>
          <h2 className="mb-16px">
            Explore Our <span className="text-[#a3e635]">Best Trips</span>
          </h2>
          <p className="max-w-lg mx-auto">
            Handpicked adventures across India. Limited slots — book early.
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-4 mb-64px">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card overflow-hidden flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative w-full h-240px overflow-hidden rounded-12px mb-16px">
                {trip.imageUrl ? (
                  <Image
                    src={trip.imageUrl}
                    alt={trip.destination}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-[rgba(163,230,53,0.08)] flex items-center justify-center text-4xl">
                    🏔️
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-12px right-12px">
                  <span
                    className="badge text-12px font-600"
                    style={{
                      background:
                        trip.status === 'booking_open'
                          ? 'rgba(163, 230, 53, 0.2)'
                          : 'rgba(14, 165, 233, 0.2)',
                      color:
                        trip.status === 'booking_open' ? '#a3e635' : '#0ea5e9',
                      border:
                        trip.status === 'booking_open'
                          ? '1px solid rgba(163, 230, 53, 0.4)'
                          : '1px solid rgba(14, 165, 233, 0.4)',
                    }}
                  >
                    {trip.status === 'booking_open' ? 'BOOKING OPEN' : 'COMING SOON'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="mb-4px line-clamp-2">{trip.name || trip.destination}</h3>
                <p className="text-14px text-[rgba(226,232,240,0.6)] mb-12px">{trip.description}</p>

                {/* Trip Details */}
                <div className="flex items-center justify-between text-14px mb-16px mt-auto">
                  <span className="text-[rgba(226,232,240,0.5)]">
                    {trip.startDate && trip.endDate
                      ? `${Math.ceil(
                          (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : 'TBA'}
                  </span>
                  <span className="text-[#a3e635] font-600">₹{trip.price.toLocaleString()}</span>
                </div>

                {/* Availability */}
                <div className="w-full h-4px bg-[rgba(163,230,53,0.1)] rounded-full overflow-hidden mb-16px">
                  <div
                    className="h-full bg-gradient-to-r from-[#a3e635] to-[#84cc16]"
                    style={{
                      width: `${trip.totalSlots > 0 ? ((trip.totalSlots - trip.bookedSlots) / trip.totalSlots) * 100 : 100}%`,
                    }}
                  />
                </div>

                {/* CTA Button */}
                <button className="btn btn-primary w-full">
                  {trip.status === 'booking_open' ? 'Book Now' : 'Notify Me'}
                </button>
              </div>
            </motion.div>
          ))}

          {/* Loading skeleton if no trips yet */}
          {trips.length === 0 && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="w-full h-240px bg-[rgba(255,255,255,0.05)] rounded-12px mb-16px" />
              <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded mb-8px" />
              <div className="h-3 bg-[rgba(255,255,255,0.03)] rounded w-2/3" />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <a href="/trips" className="btn btn-lg btn-secondary">
            View All Destinations
          </a>
        </div>
      </div>
    </section>
  )
}
