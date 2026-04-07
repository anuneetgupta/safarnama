'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
    children: React.ReactNode
    className?: string
    intensity?: number
}

export default function TiltCard({ children, className = '', intensity = 15 }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const [glare, setGlare] = useState({ x: 50, y: 50 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setTilt({
            x: (y - 0.5) * -intensity,
            y: (x - 0.5) * intensity,
        })
        setGlare({ x: x * 100, y: y * 100 })
    }

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 })
        setIsHovered(false)
    }

    return (
        <motion.div
            ref={ref}
            className={`relative ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
                transition: isHovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
                transformStyle: 'preserve-3d',
            }}
        >
            {children}
            {/* Glare effect */}
            {isHovered && (
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                    style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
                    }}
                />
            )}
        </motion.div>
    )
}
