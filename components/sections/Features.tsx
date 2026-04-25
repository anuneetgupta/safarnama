'use client'

import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: '🏕️',
    title: 'Group Travel Made Easy',
    description: 'Book as a group, split costs, coordinate everything in one place. No stress, just adventure.',
  },
  {
    icon: '🛡️',
    title: 'Safe & Verified Trips',
    description: 'Every trip vetted by our team. Experienced leaders, verified stays, 24/7 support.',
  },
  {
    icon: '💰',
    title: 'Student-Friendly Pricing',
    description: 'Exclusive deals and EMI options designed for student budgets. Starting ₹3,000.',
  },
  {
    icon: '🗺️',
    title: 'Curated Itineraries',
    description: 'Handcrafted routes covering the best of each destination — no planning needed.',
  },
  {
    icon: '👥',
    title: 'Meet Your Tribe',
    description: 'Travel with like-minded students. Come as strangers, leave as lifelong friends.',
  },
  {
    icon: '📱',
    title: 'Real-Time Updates',
    description: 'Live trip tracking, instant notifications, and a dedicated WhatsApp group for every trip.',
  },
]

export default function Features() {
  return (
    <section className="section bg-[#020817]">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-64px"
        >
          <div className="badge mb-16px justify-center">
            <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
            Why Choose Safarnama
          </div>
          <h2 className="mb-16px">
            Built for the <span className="text-[#a3e635]">Student Explorer</span>
          </h2>
          <p className="max-w-lg mx-auto">
            Everything you need for the perfect group trip — in one platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              {/* Icon */}
              <div className="text-40px mb-16px">{feature.icon}</div>

              {/* Title */}
              <h3 className="mb-12px">{feature.title}</h3>

              {/* Description */}
              <p className="text-14px">{feature.description}</p>

              {/* Divider */}
              <div className="h-px bg-[rgba(163,230,53,0.1)] mt-16px" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
