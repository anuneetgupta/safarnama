'use client'

import { useEffect, useState } from 'react'

type Announcement = { id: string; title: string; message: string; type: string }

const TYPE_STYLES: Record<string, { bg: string; border: string; icon: string; color: string }> = {
    info:    { bg: 'rgba(14,165,233,0.08)',  border: 'rgba(14,165,233,0.25)',  icon: 'ℹ️',  color: '#38bdf8' },
    success: { bg: 'rgba(163,230,53,0.08)',  border: 'rgba(163,230,53,0.25)',  icon: '✅',  color: '#a3e635' },
    warning: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  icon: '⚠️',  color: '#f59e0b' },
    urgent:  { bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.30)',   icon: '🚨',  color: '#f87171' },
}

export default function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [current, setCurrent] = useState(0)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        fetch('/api/announcements')
            .then(r => r.json())
            .then(d => setAnnouncements(d.announcements || []))
            .catch(() => {})
    }, [])

    // Rotate through multiple announcements every 5s
    useEffect(() => {
        if (announcements.length <= 1) return
        const t = setInterval(() => setCurrent(c => (c + 1) % announcements.length), 5000)
        return () => clearInterval(t)
    }, [announcements.length])

    if (!announcements.length || dismissed) return null

    const ann = announcements[current]
    const style = TYPE_STYLES[ann.type] || TYPE_STYLES.info

    return (
        <div style={{
            width: '100%',
            background: style.bg,
            borderBottom: `1px solid ${style.border}`,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{style.icon}</span>
                <div style={{ minWidth: 0 }}>
                    <span style={{ color: style.color, fontWeight: 700, fontSize: 13, marginRight: 6 }}>
                        {ann.title}
                    </span>
                    <span style={{ color: 'rgba(226,232,240,0.7)', fontSize: 13 }}>
                        {ann.message}
                    </span>
                </div>
            </div>

            {/* Dot indicators for multiple announcements */}
            {announcements.length > 1 && (
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    {announcements.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: i === current ? style.color : 'rgba(255,255,255,0.2)',
                            border: 'none', cursor: 'pointer', padding: 0,
                        }} />
                    ))}
                </div>
            )}

            <button onClick={() => setDismissed(true)} style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
                cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px', flexShrink: 0,
            }}>×</button>
        </div>
    )
}
