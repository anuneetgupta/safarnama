'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
    end: number
    suffix?: string
    prefix?: string
    duration?: number
}

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: Props) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (!inView) return
        let start = 0
        const step = end / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= end) { setCount(end); clearInterval(timer) }
            else setCount(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [inView, end, duration])

    return (
        <span ref={ref}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    )
}
