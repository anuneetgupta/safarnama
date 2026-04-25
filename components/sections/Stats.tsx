'use client'

import { motion } from 'framer-motion'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

const STATS = [
  { icon: '🧭', end: 12000, suffix: '+', label: 'Happy Travelers' },
  { icon: '🏔️', end: 80, suffix: '+', label: 'Destinations' },
  { icon: '⭐', end: 49, suffix: '★', prefix: '4.', label: 'Average Rating' },
  { icon: '✈️', end: 200, suffix: '+', label: 'Trips Completed' },
]

export default function Stats() {
  return (
    <section
      className="py-48px"
      style={{
        background: 'rgba(10, 15, 26, 0.9)',
        borderTop: '1px solid rgba(163, 230, 53, 0.1)',
        borderBottom: '1px solid rgba(163, 230, 53, 0.1)',
      }}
    >
      <div className="container">
        <div className="grid grid-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                className="text-40px mb-12px"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {stat.icon}
              </motion.div>

              {/* Number */}
              <div className="text-40px font-800 text-[#a3e635] mb-8px">
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>

              {/* Label */}
              <p className="text-14px text-[rgba(226,232,240,0.6)]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
