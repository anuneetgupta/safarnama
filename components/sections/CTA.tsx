'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section
      className="section relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020817 0%, #0a0f1a 100%)' }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(163, 230, 53, 0.1)' }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Heading */}
          <h2 className="mb-24px">
            Ready to Start
            <br />
            Your <span className="text-[#a3e635]">Journey?</span>
          </h2>

          {/* Description */}
          <p className="max-w-lg mx-auto mb-32px">
            Join thousands of students who've already discovered the joy of group travel.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-16px justify-center">
            <Link href="/auth/register" className="btn btn-lg btn-primary">
              Create Free Account
            </Link>
            <Link href="/trips" className="btn btn-lg btn-secondary">
              Browse Trips
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
