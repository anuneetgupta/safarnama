'use client'

import { motion } from 'framer-motion'

interface Props {
    text: string
    className?: string
    delay?: number
    stagger?: number
}

export default function AnimatedTitle({ text, className = '', delay = 0, stagger = 0.04 }: Props) {
    const chars = text.split('')
    return (
        <span className={`inline-block ${className}`} aria-label={text}>
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: '110%', opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{
                        delay: delay + i * stagger,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: 'bottom center', display: char === ' ' ? 'inline' : 'inline-block' }}
                    whileHover={{
                        y: -8,
                        color: '#a3e635',
                        transition: { duration: 0.15 }
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    )
}
