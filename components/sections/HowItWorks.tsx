'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Browse Trips',
    description: 'Explore our curated destinations and find your perfect adventure.',
  },
  {
    number: '02',
    title: 'Register & Pay',
    description: 'Quick registration, secure payment, instant confirmation.',
  },
  {
    number: '03',
    title: 'Pack & Go',
    description: 'We handle everything. You just show up and explore.',
  },
]

export default function HowItWorks() {
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
          <h2 className="mb-16px">
            How It <span className="text-[#a3e635]">Works</span>
          </h2>
          <p className="max-w-lg mx-auto">
            Three simple steps to your next adventure
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-3 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-24px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#a3e635] to-transparent" />

          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Circle */}
              <div className="flex justify-center mb-24px">
                <div
                  className="w-64px h-64px rounded-full flex items-center justify-center text-32px font-800 relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                    color: '#000',
                  }}
                >
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="card text-center">
                <h3 className="mb-12px">{step.title}</h3>
                <p className="text-14px">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
