'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020817 0%, #0a0f1a 100%)' }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(163, 230, 53, 0.1)' }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-64px items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="badge mb-24px">
              <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
              India's #1 Student Travel Platform
            </div>

            {/* Heading */}
            <h1 className="mb-24px">
              Your Journey
              <br />
              <span className="bg-gradient-to-r from-[#a3e635] to-[#0ea5e9] bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>

            {/* Description */}
            <p className="mb-32px max-w-md">
              Curated group trips for students across India. Budget-friendly, safe, and unforgettable experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-16px">
              <Link href="/trips" className="btn btn-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Explore Trips
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Get in Touch
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-12px mt-48px max-w-sm">
              {[
                { icon: '🏕️', text: 'Group Adventures' },
                { icon: '🗺️', text: 'Curated Routes' },
                { icon: '🛡️', text: 'Safe & Verified' },
                { icon: '⭐', text: '1000+ Trips Done' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-8px px-16px py-12px rounded-12px"
                  style={{ background: 'rgba(163, 230, 53, 0.08)', border: '1px solid rgba(163, 230, 53, 0.15)' }}
                >
                  <span className="text-18px">{item.icon}</span>
                  <span className="text-14px font-500 text-[rgba(226,232,240,0.8)]">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-24px"
          >
            {[
              { value: '12K+', label: 'Happy Travelers' },
              { value: '80+', label: 'Destinations' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '200+', label: 'Trips Completed' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card flex flex-col items-center justify-center py-32px"
              >
                <div className="text-40px font-800 text-[#a3e635] mb-8px">{stat.value}</div>
                <div className="text-14px text-[rgba(226,232,240,0.6)] text-center">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
