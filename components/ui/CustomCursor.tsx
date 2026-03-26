'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
    const planeRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    useEffect(() => {
        let ringX = 0, ringY = 0
        let curX = 0, curY = 0
        let prevX = 0, prevY = 0
        let angle = 0
        let animId: number

        const onMove = (e: MouseEvent) => {
            prevX = curX
            prevY = curY
            curX = e.clientX
            curY = e.clientY

            // Calculate angle from movement direction
            const dx = curX - prevX
            const dy = curY - prevY
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45
            }
        }

        const onDown = () => setIsClicking(true)
        const onUp = () => setIsClicking(false)

        const onOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement
            if (t.closest('a, button, [role="button"], input, textarea, select, label')) {
                setIsHovering(true)
            }
        }
        const onOut = (e: MouseEvent) => {
            const t = e.target as HTMLElement
            if (t.closest('a, button, [role="button"], input, textarea, select, label')) {
                setIsHovering(false)
            }
        }

        const animate = () => {
            ringX += (curX - ringX) * 0.1
            ringY += (curY - ringY) * 0.1

            if (planeRef.current) {
                planeRef.current.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) rotate(${angle}deg)`
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
            }
            animId = requestAnimationFrame(animate)
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mousedown', onDown)
        document.addEventListener('mouseup', onUp)
        document.addEventListener('mouseover', onOver)
        document.addEventListener('mouseout', onOut)
        animId = requestAnimationFrame(animate)

        return () => {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mousedown', onDown)
            document.removeEventListener('mouseup', onUp)
            document.removeEventListener('mouseover', onOver)
            document.removeEventListener('mouseout', onOut)
            cancelAnimationFrame(animId)
        }
    }, [])

    return (
        <>
            {/* Airplane cursor */}
            <div
                ref={planeRef}
                className="fixed top-0 left-0 z-[9999] pointer-events-none"
                style={{ willChange: 'transform' }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="transition-all duration-150"
                    style={{
                        width: isHovering ? '28px' : isClicking ? '18px' : '22px',
                        height: isHovering ? '28px' : isClicking ? '18px' : '22px',
                        color: isHovering ? '#38bdf8' : '#0ea5e9',
                        filter: isHovering
                            ? 'drop-shadow(0 0 8px rgba(56,189,248,0.9))'
                            : 'drop-shadow(0 0 4px rgba(14,165,233,0.6))',
                    }}
                >
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
            </div>

            {/* Trailing ring */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 z-[9998] pointer-events-none"
                style={{ willChange: 'transform' }}
            >
                <div
                    className="rounded-full border transition-all duration-200"
                    style={{
                        width: isHovering ? '52px' : isClicking ? '24px' : '38px',
                        height: isHovering ? '52px' : isClicking ? '24px' : '38px',
                        marginLeft: isHovering ? '-26px' : isClicking ? '-12px' : '-19px',
                        marginTop: isHovering ? '-26px' : isClicking ? '-12px' : '-19px',
                        borderColor: isHovering ? 'rgba(56,189,248,0.6)' : 'rgba(14,165,233,0.25)',
                        backgroundColor: isHovering ? 'rgba(56,189,248,0.06)' : 'transparent',
                    }}
                />
            </div>
        </>
    )
}
