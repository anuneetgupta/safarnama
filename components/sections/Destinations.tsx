'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { DEMO_TRIPS } from '@/lib/data'

export default function Destinations() {
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
          {DEMO_TRIPS.slice(0, 8).map((trip, index) => (
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
                <Image
                  src={trip.image}
                  alt={trip.destination}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
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
                <h3 className="mb-4px line-clamp-2">{trip.destination}</h3>
                <p className="text-14px text-[rgba(226,232,240,0.6)] mb-12px">{trip.description}</p>

                {/* Trip Details */}
                <div className="flex items-center justify-between text-14px mb-16px mt-auto">
                  <span className="text-[rgba(226,232,240,0.5)]">
                    {Math.ceil(
                      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </span>
                  <span className="text-[#a3e635] font-600">₹{trip.price.toLocaleString()}</span>
                </div>

                {/* Availability */}
                <div className="w-full h-4px bg-[rgba(163,230,53,0.1)] rounded-full overflow-hidden mb-16px">
                  <div
                    className="h-full bg-gradient-to-r from-[#a3e635] to-[#84cc16]"
                    style={{
                      width: `${((trip.totalSlots - trip.bookedSlots) / trip.totalSlots) * 100}%`,
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
