'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
    const planeRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    // Only show cursor on fine-pointer devices (mouse), not touch
    const [isPointerFine, setIsPointerFine] = useState(false)

    useEffect(() => {
        // Check if the primary pointer is fine (mouse vs touch)
        const mq = window.matchMedia('(pointer: fine)')
        setIsPointerFine(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    useEffect(() => {
        if (!isPointerFine) return

        let mouseX = window.innerWidth / 2
        let mouseY = window.innerHeight / 2
        let ringX = mouseX
        let ringY = mouseY
        let angle = -45
        let prevX = mouseX
        let prevY = mouseY
        let hovering = false
        let clicking = false
        let rafId: number

        const onMove = (e: MouseEvent) => {
            const dx = e.clientX - prevX
            const dy = e.clientY - prevY
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45
            }
            prevX = mouseX
            prevY = mouseY
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const onDown = () => { clicking = true }
        const onUp = () => { clicking = false }

        const onOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement
            hovering = !!t.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]')
        }

        const tick = () => {
            ringX += (mouseX - ringX) * 0.12
            ringY += (mouseY - ringY) * 0.12

            const planeSize = hovering ? 26 : clicking ? 16 : 20
            const ringSize = hovering ? 50 : clicking ? 26 : 36

            if (planeRef.current) {
                planeRef.current.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%) rotate(${angle}deg)`
                planeRef.current.style.width = `${planeSize}px`
                planeRef.current.style.height = `${planeSize}px`
            }

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`
                ringRef.current.style.width = `${ringSize}px`
                ringRef.current.style.height = `${ringSize}px`
                ringRef.current.style.borderColor = hovering ? 'rgba(163,230,53,0.7)' : 'rgba(132,204,22,0.3)'
                ringRef.current.style.backgroundColor = hovering ? 'rgba(132,204,22,0.06)' : 'transparent'
            }

            rafId = requestAnimationFrame(tick)
        }

        document.addEventListener('mousemove', onMove, { passive: true })
        document.addEventListener('mousedown', onDown, { passive: true })
        document.addEventListener('mouseup', onUp, { passive: true })
        document.addEventListener('mouseover', onOver, { passive: true })

        rafId = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(rafId)
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mousedown', onDown)
            document.removeEventListener('mouseup', onUp)
            document.removeEventListener('mouseover', onOver)
        }
    }, [isPointerFine])

    // Don't render cursor elements on touch devices
    if (!isPointerFine) return null

    return (
        <>
            {/* Airplane cursor */}
            <div ref={planeRef} className="fixed top-0 left-0 z-[9999] pointer-events-none" style={{ willChange: 'transform', transition: 'width 0.15s, height 0.15s' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"
                    style={{ color: '#a3e635', filter: 'drop-shadow(0 0 6px rgba(132,204,22,0.7))' }}>
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
            </div>

            {/* Trailing ring */}
            <div ref={ringRef} className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
                style={{ willChange: 'transform', border: '1.5px solid rgba(132,204,22,0.3)', transition: 'width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s' }} />
        </>
    )
}
