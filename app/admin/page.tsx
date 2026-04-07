'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type User = { id: string; name: string | null; email: string; role: string; college: string | null; phone: string | null; createdAt: string }
type Registration = { id: string; name: string; email: string; phone: string; tripName: string; college: string | null; status: string; createdAt: string }
type Message = { id: string; name: string; email: string; subject: string | null; message: string; read: boolean; createdAt: string }

const TABS = ['Overview', 'Users', 'Registrations', 'Messages']

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [tab, setTab] = useState('Overview')
    const [users, setUsers] = useState<User[]>([])
    const [regs, setRegs] = useState<Registration[]>([])
    const [msgs, setMsgs] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') { router.push('/auth/login'); return }
        if (status === 'authenticated') {
            const role = (session?.user as { role?: string })?.role
            if (role !== 'admin') { router.push('/dashboard'); return }
            fetchAll()
        }
    }, [status])

    const fetchAll = async () => {
        setLoading(true)
        const [u, r, m] = await Promise.all([
            fetch('/api/admin/users').then(r => r.json()),
            fetch('/api/admin/registrations').then(r => r.json()),
            fetch('/api/admin/messages').then(r => r.json()),
        ])
        setUsers(u.users || [])
        setRegs(r.registrations || [])
        setMsgs(m.messages || [])
        setLoading(false)
    }

    const updateRegStatus = async (id: string, status: string) => {
        await fetch('/api/admin/registrations', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
        fetchAll()
    }

    const markRead = async (id: string) => {
        await fetch('/api/admin/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        fetchAll()
    }

    if (status === 'loading' || loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#080f08' }}>
            <div className="text-lime-400 text-lg font-bold animate-pulse">Loading Admin Panel...</div>
        </div>
    )

    const unread = msgs.filter(m => !m.read).length
    const pending = regs.filter(r => r.status === 'pending').length

    return (
        <div className="min-h-screen" style={{ background: '#080f08' }}>
            {/* Header */}
            <div className="border-b sticky top-0 z-40 backdrop-blur-xl" style={{ borderColor: 'rgba(132,204,22,0.1)', background: 'rgba(8,15,8,0.95)' }}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Safarnama" className="h-8 w-auto" />
                        <span className="text-lime-400 font-bold text-sm uppercase tracking-widest">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm" style={{ color: 'rgba(180,200,140,0.6)' }}>{session?.user?.email}</span>
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs px-4 py-2 rounded-lg font-semibold transition-all" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all relative"
                            style={{
                                background: tab === t ? 'rgba(132,204,22,0.15)' : 'rgba(10,18,8,0.8)',
                                border: `1px solid ${tab === t ? 'rgba(132,204,22,0.4)' : 'rgba(132,204,22,0.1)'}`,
                                color: tab === t ? '#a3e635' : 'rgba(180,200,140,0.5)',
                            }}>
                            {t}
                            {t === 'Messages' && unread > 0 && <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">{unread}</span>}
                            {t === 'Registrations' && pending > 0 && <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">{pending}</span>}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {tab === 'Overview' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                        {[
                            { label: 'Total Users', value: users.length, icon: '👥', color: '#a3e635' },
                            { label: 'Registrations', value: regs.length, icon: '✈️', color: '#d4a843' },
                            { label: 'Pending', value: pending, icon: '⏳', color: '#f59e0b' },
                            { label: 'Unread Messages', value: unread, icon: '💬', color: '#f87171' },
                        ].map((s, i) => (
                            <motion.div key={s.label} className="p-6 rounded-2xl" style={{ background: 'rgba(10,18,8,0.8)', border: '1px solid rgba(132,204,22,0.1)' }}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <div className="text-3xl mb-2">{s.icon}</div>
                                <div className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</div>
                                <div className="text-xs" style={{ color: 'rgba(180,200,140,0.5)' }}>{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Users Table */}
                {tab === 'Users' && (
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(132,204,22,0.1)' }}>
                        <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(10,18,8,0.9)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                            <h2 className="text-white font-bold">All Users ({users.length})</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ background: 'rgba(10,18,8,0.7)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                                        {['Name', 'Email', 'Phone', 'College', 'Role', 'Joined'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(132,204,22,0.7)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr key={u.id} style={{ background: i % 2 === 0 ? 'rgba(10,18,8,0.5)' : 'rgba(10,18,8,0.3)', borderBottom: '1px solid rgba(132,204,22,0.05)' }}>
                                            <td className="px-5 py-3 text-white font-medium">{u.name || '—'}</td>
                                            <td className="px-5 py-3" style={{ color: 'rgba(180,200,140,0.7)' }}>{u.email}</td>
                                            <td className="px-5 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{u.phone || '—'}</td>
                                            <td className="px-5 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{u.college || '—'}</td>
                                            <td className="px-5 py-3">
                                                <span className="px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: u.role === 'admin' ? 'rgba(132,204,22,0.15)' : 'rgba(100,100,100,0.2)', color: u.role === 'admin' ? '#a3e635' : 'rgba(180,200,140,0.6)' }}>{u.role}</span>
                                            </td>
                                            <td className="px-5 py-3 text-xs" style={{ color: 'rgba(180,200,140,0.4)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Registrations Table */}
                {tab === 'Registrations' && (
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(132,204,22,0.1)' }}>
                        <div className="px-6 py-4" style={{ background: 'rgba(10,18,8,0.9)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                            <h2 className="text-white font-bold">Trip Registrations ({regs.length})</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ background: 'rgba(10,18,8,0.7)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                                        {['Name', 'Email', 'Phone', 'Trip', 'College', 'Status', 'Date', 'Action'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(132,204,22,0.7)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {regs.map((r, i) => (
                                        <tr key={r.id} style={{ background: i % 2 === 0 ? 'rgba(10,18,8,0.5)' : 'rgba(10,18,8,0.3)', borderBottom: '1px solid rgba(132,204,22,0.05)' }}>
                                            <td className="px-5 py-3 text-white font-medium">{r.name}</td>
                                            <td className="px-5 py-3" style={{ color: 'rgba(180,200,140,0.7)' }}>{r.email}</td>
                                            <td className="px-5 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{r.phone}</td>
                                            <td className="px-5 py-3 text-lime-400 font-semibold">{r.tripName}</td>
                                            <td className="px-5 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{r.college || '—'}</td>
                                            <td className="px-5 py-3">
                                                <span className="px-2 py-1 rounded-full text-[10px] font-bold" style={{
                                                    background: r.status === 'confirmed' ? 'rgba(132,204,22,0.15)' : r.status === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                                    color: r.status === 'confirmed' ? '#a3e635' : r.status === 'cancelled' ? '#f87171' : '#f59e0b'
                                                }}>{r.status}</span>
                                            </td>
                                            <td className="px-5 py-3 text-xs" style={{ color: 'rgba(180,200,140,0.4)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-1">
                                                    {r.status !== 'confirmed' && <button onClick={() => updateRegStatus(r.id, 'confirmed')} className="px-2 py-1 rounded text-[10px] font-bold" style={{ background: 'rgba(132,204,22,0.15)', color: '#a3e635' }}>✓ Confirm</button>}
                                                    {r.status !== 'cancelled' && <button onClick={() => updateRegStatus(r.id, 'cancelled')} className="px-2 py-1 rounded text-[10px] font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>✗ Cancel</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Messages Table */}
                {tab === 'Messages' && (
                    <div className="space-y-4">
                        <h2 className="text-white font-bold text-lg">Contact Messages ({msgs.length})</h2>
                        {msgs.map((m, i) => (
                            <motion.div key={m.id} className="p-6 rounded-2xl" style={{ background: m.read ? 'rgba(10,18,8,0.5)' : 'rgba(10,18,8,0.9)', border: `1px solid ${m.read ? 'rgba(132,204,22,0.06)' : 'rgba(132,204,22,0.2)'}` }}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-white font-bold">{m.name}</span>
                                            <span className="text-xs" style={{ color: 'rgba(180,200,140,0.5)' }}>{m.email}</span>
                                            {!m.read && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-500 text-black">NEW</span>}
                                            <span className="text-xs ml-auto" style={{ color: 'rgba(180,200,140,0.4)' }}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</span>
                                        </div>
                                        {m.subject && <p className="text-sm font-semibold mb-1" style={{ color: '#a3e635' }}>{m.subject}</p>}
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(180,200,140,0.7)' }}>{m.message}</p>
                                    </div>
                                    {!m.read && (
                                        <button onClick={() => markRead(m.id)} className="text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)', color: '#a3e635' }}>
                                            Mark Read
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
