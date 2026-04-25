'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// ── TYPES ──────────────────────────────────────────────────────
type User = { id: string; name: string | null; email: string; role: string; college: string | null; phone: string | null; createdAt: string }
type Reg  = { id: string; name: string; email: string; phone: string; tripName: string; college: string | null; status: string; createdAt: string }
type Msg  = { id: string; name: string; email: string; subject: string | null; message: string; read: boolean; createdAt: string }
type Trip = { id: string; name: string; destination: string; description: string; price: number; status: string; startDate: string | null; endDate: string | null; totalSlots: number; bookedSlots: number; imageUrl: string | null; featured: boolean }
type Post = { id: string; title: string; content: string; author: string; tripName: string | null; imageUrl: string | null; published: boolean; createdAt: string }
type Photo = { id: string; url: string; caption: string | null; tripName: string; createdAt: string }
type Ann  = { id: string; title: string; message: string; type: string; active: boolean; createdAt: string }

const TABS = ['Overview', 'Trips', 'Registrations', 'Users', 'Blog', 'Gallery', 'Announcements', 'Messages']

const api = (url: string, opts?: RequestInit) => fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts }).then(r => r.json())

// ── MODAL ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl z-10"
                style={{ background: '#0a150a', border: '1px solid rgba(132,204,22,0.2)' }}
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(132,204,22,0.1)' }}>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            </motion.div>
        </div>
    )
}

// ── INPUT HELPERS ──────────────────────────────────────────────
const inp = "w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
const inpStyle = { background: 'rgba(132,204,22,0.05)', border: '1px solid rgba(132,204,22,0.15)' }
const focusStyle = { border: '1px solid rgba(132,204,22,0.5)' }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="mb-4"><label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(132,204,22,0.7)' }}>{label}</label>{children}</div>
}

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [tab, setTab] = useState('Overview')
    const [users, setUsers] = useState<User[]>([])
    const [regs, setRegs] = useState<Reg[]>([])
    const [msgs, setMsgs] = useState<Msg[]>([])
    const [trips, setTrips] = useState<Trip[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [photos, setPhotos] = useState<Photo[]>([])
    const [anns, setAnns] = useState<Ann[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState<string | null>(null)
    const [editing, setEditing] = useState<Record<string, unknown> | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') { router.push('/auth/login'); return }
        if (status === 'authenticated') {
            if ((session?.user as { role?: string })?.role !== 'admin') { router.push('/dashboard'); return }
            fetchAll()
        }
    }, [status])

    const fetchAll = useCallback(async () => {
        setLoading(true)
        const [u, r, m, t, p, g, a] = await Promise.all([
            api('/api/admin/users'), api('/api/admin/registrations'), api('/api/admin/messages'),
            api('/api/admin/trips'), api('/api/admin/blog'), api('/api/admin/gallery'), api('/api/admin/announcements'),
        ])
        setUsers(u.users || []); setRegs(r.registrations || []); setMsgs(m.messages || [])
        setTrips(t.trips || []); setPosts(p.posts || []); setPhotos(g.photos || []); setAnns(a.announcements || [])
        setLoading(false)
    }, [])

    if (status === 'loading' || loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#080f08' }}>
            <div className="text-lime-400 text-lg font-bold animate-pulse">Loading Admin Panel...</div>
        </div>
    )

    const unread = msgs.filter(m => !m.read).length
    const pending = regs.filter(r => r.status === 'pending').length

    const btnStyle = (active: boolean) => ({
        background: active ? 'rgba(132,204,22,0.15)' : 'rgba(10,18,8,0.8)',
        border: `1px solid ${active ? 'rgba(132,204,22,0.4)' : 'rgba(132,204,22,0.1)'}`,
        color: active ? '#a3e635' : 'rgba(180,200,140,0.5)',
    })

    return (
        <div className="min-h-screen" style={{ background: '#080f08' }}>
            {/* Header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl" style={{ borderBottom: '1px solid rgba(132,204,22,0.1)', background: 'rgba(8,15,8,0.95)' }}>
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Safarnama" className="h-8 w-auto" />
                        <span className="text-lime-400 font-bold text-sm uppercase tracking-widest">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs" style={{ color: 'rgba(180,200,140,0.5)' }}>{session?.user?.email}</span>
                        <a href="/" className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)', color: '#a3e635' }}>View Site</a>
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>Sign Out</button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all relative" style={btnStyle(tab === t)}>
                            {t}
                            {t === 'Messages' && unread > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">{unread}</span>}
                            {t === 'Registrations' && pending > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">{pending}</span>}
                        </button>
                    ))}
                </div>

                {/* ── OVERVIEW ── */}
                {tab === 'Overview' && (
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                            {[
                                { label: 'Total Users', value: users.length, icon: '👥', color: '#a3e635' },
                                { label: 'Active Trips', value: trips.filter(t => t.status !== 'completed').length, icon: '✈️', color: '#fbbf24' },
                                { label: 'Pending Regs', value: pending, icon: '⏳', color: '#f59e0b' },
                                { label: 'Unread Msgs', value: unread, icon: '💬', color: '#f87171' },
                                { label: 'Blog Posts', value: posts.length, icon: '📝', color: '#a3e635' },
                                { label: 'Gallery Photos', value: photos.length, icon: '🖼️', color: '#fbbf24' },
                                { label: 'Announcements', value: anns.filter(a => a.active).length, icon: '📢', color: '#f87171' },
                                { label: 'Total Registrations', value: regs.length, icon: '📋', color: '#a3e635' },
                            ].map((s, i) => (
                                <motion.div key={s.label} className="p-5 rounded-2xl" style={{ background: 'rgba(10,18,8,0.8)', border: '1px solid rgba(132,204,22,0.1)' }}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                    <div className="text-2xl mb-2">{s.icon}</div>
                                    <div className="text-2xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</div>
                                    <div className="text-xs" style={{ color: 'rgba(180,200,140,0.5)' }}>{s.label}</div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Active announcements preview */}
                        {anns.filter(a => a.active).length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-white font-bold mb-3">Active Announcements</h3>
                                {anns.filter(a => a.active).map(a => (
                                    <div key={a.id} className="p-4 rounded-xl mb-2 flex items-start gap-3" style={{ background: a.type === 'urgent' ? 'rgba(239,68,68,0.1)' : a.type === 'success' ? 'rgba(132,204,22,0.1)' : 'rgba(132,204,22,0.06)', border: `1px solid ${a.type === 'urgent' ? 'rgba(239,68,68,0.3)' : 'rgba(132,204,22,0.2)'}` }}>
                                        <span className="text-lg">{a.type === 'urgent' ? '🚨' : a.type === 'success' ? '✅' : a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                                        <div><p className="text-white font-semibold text-sm">{a.title}</p><p className="text-xs mt-0.5" style={{ color: 'rgba(180,200,140,0.6)' }}>{a.message}</p></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TRIPS ── */}
                {tab === 'Trips' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-bold text-xl">Trips ({trips.length})</h2>
                            <button onClick={() => { setEditing(null); setModal('trip') }} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)', color: '#a3e635' }}>+ Add Trip</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {trips.map(trip => (
                                <div key={trip.id} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,18,8,0.8)', border: '1px solid rgba(132,204,22,0.1)' }}>
                                    {trip.imageUrl && <img src={trip.imageUrl} alt={trip.name} className="w-full h-40 object-cover" />}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-white font-bold">{trip.name}</h3>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: trip.status === 'booking_open' ? 'rgba(132,204,22,0.2)' : trip.status === 'coming_soon' ? 'rgba(251,191,36,0.2)' : 'rgba(100,100,100,0.2)', color: trip.status === 'booking_open' ? '#a3e635' : trip.status === 'coming_soon' ? '#fbbf24' : '#888' }}>{trip.status}</span>
                                        </div>
                                        <p className="text-xs mb-3" style={{ color: 'rgba(180,200,140,0.5)' }}>{trip.destination}</p>
                                        <div className="flex items-center justify-between text-xs mb-4">
                                            <span style={{ color: '#a3e635' }}>{trip.price > 0 ? `₹${trip.price.toLocaleString()}` : 'TBA'}</span>
                                            <span style={{ color: 'rgba(180,200,140,0.5)' }}>{trip.bookedSlots}/{trip.totalSlots} slots</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditing(trip as unknown as Record<string, unknown>); setModal('trip') }} className="flex-1 py-2 rounded-lg text-xs font-semibold" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)', color: '#a3e635' }}>Edit</button>
                                            <button onClick={async () => { if (confirm('Delete this trip?')) { await api('/api/admin/trips', { method: 'DELETE', body: JSON.stringify({ id: trip.id }) }); fetchAll() } }} className="flex-1 py-2 rounded-lg text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── REGISTRATIONS ── */}
                {tab === 'Registrations' && (
                    <div>
                        {/* Per-trip summary cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {Array.from(new Set(regs.map(r => r.tripName))).map(tripName => {
                                const tripRegs = regs.filter(r => r.tripName === tripName)
                                const confirmed = tripRegs.filter(r => r.status === 'confirmed').length
                                return (
                                    <div key={tripName} className="p-4 rounded-xl" style={{ background: 'rgba(10,18,8,0.8)', border: '1px solid rgba(132,204,22,0.12)' }}>
                                        <p className="text-lime-400 font-bold text-sm mb-1 truncate">{tripName}</p>
                                        <p className="text-white text-2xl font-extrabold">{tripRegs.length}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'rgba(180,200,140,0.5)' }}>{confirmed} confirmed · {tripRegs.filter(r => r.status === 'pending').length} pending</p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(132,204,22,0.1)' }}>
                            <div className="px-6 py-4" style={{ background: 'rgba(10,18,8,0.9)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                                <h2 className="text-white font-bold">All Registrations ({regs.length})</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr style={{ background: 'rgba(10,18,8,0.7)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                                        {['Name','Email','Phone','Trip','College','City','Gender','Age','Status','Date','Action'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(132,204,22,0.7)' }}>{h}</th>)}
                                    </tr></thead>
                                    <tbody>{regs.map((r, i) => (
                                        <tr key={r.id} style={{ background: i%2===0?'rgba(10,18,8,0.5)':'rgba(10,18,8,0.3)', borderBottom: '1px solid rgba(132,204,22,0.05)' }}>
                                            <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                                            <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.7)' }}>{r.email}</td>
                                            <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{r.phone}</td>
                                            <td className="px-4 py-3 text-lime-400 font-semibold">{r.tripName}</td>
                                            <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{r.college||'—'}</td>
                                            <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{(r as unknown as Record<string,string>).city||'—'}</td>
                                            <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{(r as unknown as Record<string,string>).gender||'—'}</td>
                                            <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{(r as unknown as Record<string,string>).age||'—'}</td>
                                            <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: r.status==='confirmed'?'rgba(132,204,22,0.15)':r.status==='cancelled'?'rgba(239,68,68,0.15)':'rgba(245,158,11,0.15)', color: r.status==='confirmed'?'#a3e635':r.status==='cancelled'?'#f87171':'#f59e0b' }}>{r.status}</span></td>
                                            <td className="px-4 py-3 text-xs" style={{ color: 'rgba(180,200,140,0.4)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td className="px-4 py-3"><div className="flex gap-1">
                                                {r.status!=='confirmed'&&<button onClick={async()=>{await api('/api/admin/registrations',{method:'PATCH',body:JSON.stringify({id:r.id,status:'confirmed'})});fetchAll()}} className="px-2 py-1 rounded text-[10px] font-bold" style={{background:'rgba(132,204,22,0.15)',color:'#a3e635'}}>✓ Confirm</button>}
                                                {r.status!=='cancelled'&&<button onClick={async()=>{await api('/api/admin/registrations',{method:'PATCH',body:JSON.stringify({id:r.id,status:'cancelled'})});fetchAll()}} className="px-2 py-1 rounded text-[10px] font-bold" style={{background:'rgba(239,68,68,0.15)',color:'#f87171'}}>✗ Cancel</button>}
                                            </div></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── USERS ── */}
                {tab === 'Users' && (
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(132,204,22,0.1)' }}>
                        <div className="px-6 py-4" style={{ background: 'rgba(10,18,8,0.9)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                            <h2 className="text-white font-bold">All Users ({users.length})</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr style={{ background: 'rgba(10,18,8,0.7)', borderBottom: '1px solid rgba(132,204,22,0.08)' }}>
                                    {['Name','Email','Phone','College','Role','Joined'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(132,204,22,0.7)' }}>{h}</th>)}
                                </tr></thead>
                                <tbody>{users.map((u, i) => (
                                    <tr key={u.id} style={{ background: i%2===0?'rgba(10,18,8,0.5)':'rgba(10,18,8,0.3)', borderBottom: '1px solid rgba(132,204,22,0.05)' }}>
                                        <td className="px-4 py-3 text-white font-medium">{u.name||'—'}</td>
                                        <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.7)' }}>{u.email}</td>
                                        <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{u.phone||'—'}</td>
                                        <td className="px-4 py-3" style={{ color: 'rgba(180,200,140,0.6)' }}>{u.college||'—'}</td>
                                        <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: u.role==='admin'?'rgba(132,204,22,0.15)':'rgba(100,100,100,0.2)', color: u.role==='admin'?'#a3e635':'rgba(180,200,140,0.6)' }}>{u.role}</span></td>
                                        <td className="px-4 py-3 text-xs" style={{ color: 'rgba(180,200,140,0.4)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── BLOG ── */}
                {tab === 'Blog' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-bold text-xl">Blog Posts ({posts.length})</h2>
                            <button onClick={() => { setEditing(null); setModal('blog') }} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)', color: '#a3e635' }}>+ New Post</button>
                        </div>
                        <div className="space-y-4">
                            {posts.map(post => (
                                <div key={post.id} className="p-6 rounded-2xl" style={{ background: 'rgba(10,18,8,0.8)', border: '1px solid rgba(132,204,22,0.1)' }}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-white font-bold">{post.title}</h3>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: post.published?'rgba(132,204,22,0.15)':'rgba(100,100,100,0.2)', color: post.published?'#a3e635':'#888' }}>{post.published?'Published':'Draft'}</span>
                                            </div>
                                            <p className="text-xs mb-2" style={{ color: 'rgba(180,200,140,0.5)' }}>By {post.author} {post.tripName&&`· ${post.tripName}`} · {new Date(post.createdAt).toLocaleDateString('en-IN')}</p>
                                            <p className="text-sm" style={{ color: 'rgba(180,200,140,0.7)' }}>{post.content.slice(0,150)}...</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button onClick={() => { setEditing(post as unknown as Record<string, unknown>); setModal('blog') }} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)', color: '#a3e635' }}>Edit</button>
                                            <button onClick={async () => { if (confirm('Delete?')) { await api('/api/admin/blog', { method: 'DELETE', body: JSON.stringify({ id: post.id }) }); fetchAll() } }} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── GALLERY ── */}
                {tab === 'Gallery' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-bold text-xl">Gallery Photos ({photos.length})</h2>
                            <button onClick={() => { setEditing(null); setModal('photo') }} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)', color: '#a3e635' }}>+ Add Photo</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map(photo => (
                                <div key={photo.id} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                    <img src={photo.url} alt={photo.caption||''} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <p className="text-white text-xs font-semibold text-center px-2">{photo.caption}</p>
                                        <p className="text-lime-400 text-[10px]">{photo.tripName}</p>
                                        <button onClick={async () => { if (confirm('Delete?')) { await api('/api/admin/gallery', { method: 'DELETE', body: JSON.stringify({ id: photo.id }) }); fetchAll() } }} className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(239,68,68,0.8)', color: 'white' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── ANNOUNCEMENTS ── */}
                {tab === 'Announcements' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-bold text-xl">Announcements ({anns.length})</h2>
                            <button onClick={() => { setEditing(null); setModal('ann') }} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)', color: '#a3e635' }}>+ New Announcement</button>
                        </div>
                        <div className="space-y-4">
                            {anns.map(a => (
                                <div key={a.id} className="p-5 rounded-2xl flex items-start justify-between gap-4" style={{ background: 'rgba(10,18,8,0.8)', border: `1px solid ${a.type==='urgent'?'rgba(239,68,68,0.3)':a.type==='success'?'rgba(132,204,22,0.2)':'rgba(132,204,22,0.1)'}` }}>
                                    <div className="flex items-start gap-3 flex-1">
                                        <span className="text-xl">{a.type==='urgent'?'🚨':a.type==='success'?'✅':a.type==='warning'?'⚠️':'ℹ️'}</span>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-white font-bold">{a.title}</h3>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: a.active?'rgba(132,204,22,0.15)':'rgba(100,100,100,0.2)', color: a.active?'#a3e635':'#888' }}>{a.active?'Active':'Inactive'}</span>
                                            </div>
                                            <p className="text-sm" style={{ color: 'rgba(180,200,140,0.7)' }}>{a.message}</p>
                                            <p className="text-xs mt-1" style={{ color: 'rgba(180,200,140,0.4)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={async () => { await api('/api/admin/announcements', { method: 'PATCH', body: JSON.stringify({ id: a.id, active: !a.active }) }); fetchAll() }} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)', color: '#a3e635' }}>{a.active?'Deactivate':'Activate'}</button>
                                        <button onClick={async () => { if (confirm('Delete?')) { await api('/api/admin/announcements', { method: 'DELETE', body: JSON.stringify({ id: a.id }) }); fetchAll() } }} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── MESSAGES ── */}
                {tab === 'Messages' && (
                    <div className="space-y-4">
                        <h2 className="text-white font-bold text-xl mb-6">Contact Messages ({msgs.length})</h2>
                        {msgs.map((m, i) => (
                            <motion.div key={m.id} className="p-6 rounded-2xl" style={{ background: m.read?'rgba(10,18,8,0.5)':'rgba(10,18,8,0.9)', border: `1px solid ${m.read?'rgba(132,204,22,0.06)':'rgba(132,204,22,0.2)'}` }}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className="text-white font-bold">{m.name}</span>
                                            <span className="text-xs" style={{ color: 'rgba(180,200,140,0.5)' }}>{m.email}</span>
                                            {!m.read && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-500 text-black">NEW</span>}
                                            <span className="text-xs ml-auto" style={{ color: 'rgba(180,200,140,0.4)' }}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</span>
                                        </div>
                                        {m.subject && <p className="text-sm font-semibold mb-1" style={{ color: '#a3e635' }}>{m.subject}</p>}
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(180,200,140,0.7)' }}>{m.message}</p>
                                    </div>
                                    {!m.read && <button onClick={async () => { await api('/api/admin/messages', { method: 'PATCH', body: JSON.stringify({ id: m.id }) }); fetchAll() }} className="text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)', color: '#a3e635' }}>Mark Read</button>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── MODALS ── */}
            <AnimatePresence>
                {modal === 'trip' && <TripModal editing={editing} onClose={() => setModal(null)} onSave={fetchAll} />}
                {modal === 'blog' && <BlogModal editing={editing} onClose={() => setModal(null)} onSave={fetchAll} />}
                {modal === 'photo' && <PhotoModal onClose={() => setModal(null)} onSave={fetchAll} />}
                {modal === 'ann' && <AnnModal onClose={() => setModal(null)} onSave={fetchAll} />}
            </AnimatePresence>
        </div>
    )
}

// ── TRIP MODAL ─────────────────────────────────────────────────
function TripModal({ editing, onClose, onSave }: { editing: Record<string, unknown> | null; onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({
        name: (editing?.name as string) || '', destination: (editing?.destination as string) || '',
        description: (editing?.description as string) || '', price: String(editing?.price || 0),
        status: (editing?.status as string) || 'yet_to_announce', startDate: (editing?.startDate as string) || '',
        endDate: (editing?.endDate as string) || '', totalSlots: String(editing?.totalSlots || 30),
        bookedSlots: String(editing?.bookedSlots || 0), imageUrl: (editing?.imageUrl as string) || '',
        featured: Boolean(editing?.featured),
    })
    const [saving, setSaving] = useState(false)

    const save = async () => {
        setSaving(true)
        const data = { ...form, price: parseInt(form.price) || 0, totalSlots: parseInt(form.totalSlots) || 30, bookedSlots: parseInt(form.bookedSlots) || 0 }
        if (editing?.id) await fetch('/api/admin/trips', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...data }) })
        else await fetch('/api/admin/trips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        setSaving(false); onSave(); onClose()
    }

    const s = { ...inpStyle } as React.CSSProperties
    return (
        <Modal title={editing ? 'Edit Trip' : 'Add New Trip'} onClose={onClose}>
            <Field label="Trip Name"><input className={inp} style={s} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Banaras Vibes" /></Field>
            <Field label="Destination"><input className={inp} style={s} value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Varanasi, UP" /></Field>
            <Field label="Description"><textarea className={inp} style={s} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Trip description..." /></Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Price (₹)"><input className={inp} style={s} type="text" inputMode="numeric" value={form.price} onChange={e => setForm({ ...form, price: e.target.value.replace(/[^0-9]/g, '') })} placeholder="e.g. 3000" /></Field>
                <Field label="Status">
                    <select className={inp} style={{ ...s, background: '#0a150a' }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        {['yet_to_announce', 'coming_soon', 'booking_open', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Start Date"><input className={inp} style={s} type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></Field>
                <Field label="End Date"><input className={inp} style={s} type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Total Slots"><input className={inp} style={s} type="text" inputMode="numeric" value={form.totalSlots} onChange={e => setForm({ ...form, totalSlots: e.target.value.replace(/[^0-9]/g, '') })} /></Field>
                <Field label="Booked Slots"><input className={inp} style={s} type="text" inputMode="numeric" value={form.bookedSlots} onChange={e => setForm({ ...form, bookedSlots: e.target.value.replace(/[^0-9]/g, '') })} /></Field>
            </div>
            <Field label="Image URL"><input className={inp} style={s} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></Field>
            <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured" className="text-sm" style={{ color: 'rgba(180,200,140,0.7)' }}>Featured on homepage</label>
            </div>
            <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: 'linear-gradient(135deg,#84cc16,#65a30d)', color: '#080f08' }}>
                {saving ? 'Saving...' : editing ? 'Update Trip' : 'Create Trip'}
            </button>
        </Modal>
    )
}

// ── BLOG MODAL ─────────────────────────────────────────────────
function BlogModal({ editing, onClose, onSave }: { editing: Record<string, unknown> | null; onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({
        title: (editing?.title as string) || '', content: (editing?.content as string) || '',
        author: (editing?.author as string) || 'Safarnama Team', tripName: (editing?.tripName as string) || '',
        imageUrl: (editing?.imageUrl as string) || '', published: editing ? Boolean(editing.published) : true,
    })
    const [saving, setSaving] = useState(false)
    const s = { ...inpStyle } as React.CSSProperties

    const save = async () => {
        setSaving(true)
        if (editing?.id) await fetch('/api/admin/blog', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...form }) })
        else await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false); onSave(); onClose()
    }

    return (
        <Modal title={editing ? 'Edit Blog Post' : 'New Blog Post'} onClose={onClose}>
            <Field label="Title"><input className={inp} style={s} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title..." /></Field>
            <Field label="Content"><textarea className={inp} style={s} rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your blog post..." /></Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Author"><input className={inp} style={s} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></Field>
                <Field label="Related Trip"><input className={inp} style={s} value={form.tripName} onChange={e => setForm({ ...form, tripName: e.target.value })} placeholder="e.g. Banaras Vibes" /></Field>
            </div>
            <Field label="Cover Image URL"><input className={inp} style={s} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></Field>
            <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                <label htmlFor="pub" className="text-sm" style={{ color: 'rgba(180,200,140,0.7)' }}>Published (visible to users)</label>
            </div>
            <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: 'linear-gradient(135deg,#84cc16,#65a30d)', color: '#080f08' }}>
                {saving ? 'Saving...' : editing ? 'Update Post' : 'Publish Post'}
            </button>
        </Modal>
    )
}

// ── PHOTO MODAL ────────────────────────────────────────────────
function PhotoModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({ url: '', caption: '', tripName: '' })
    const [saving, setSaving] = useState(false)
    const s = { ...inpStyle } as React.CSSProperties

    const save = async () => {
        if (!form.url || !form.tripName) return
        setSaving(true)
        await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false); onSave(); onClose()
    }

    return (
        <Modal title="Add Gallery Photo" onClose={onClose}>
            <Field label="Photo URL"><input className={inp} style={s} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://images.unsplash.com/..." /></Field>
            {form.url && <img src={form.url} alt="preview" className="w-full h-40 object-cover rounded-xl mb-4" onError={e => (e.currentTarget.style.display = 'none')} />}
            <Field label="Caption"><input className={inp} style={s} value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Photo caption..." /></Field>
            <Field label="Trip Name *"><input className={inp} style={s} value={form.tripName} onChange={e => setForm({ ...form, tripName: e.target.value })} placeholder="e.g. Banaras Vibes" /></Field>
            <button onClick={save} disabled={saving || !form.url || !form.tripName} className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#84cc16,#65a30d)', color: '#080f08' }}>
                {saving ? 'Adding...' : 'Add Photo'}
            </button>
        </Modal>
    )
}

// ── ANNOUNCEMENT MODAL ─────────────────────────────────────────
function AnnModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({ title: '', message: '', type: 'info', active: true })
    const [saving, setSaving] = useState(false)
    const s = { ...inpStyle } as React.CSSProperties

    const save = async () => {
        if (!form.title || !form.message) return
        setSaving(true)
        await fetch('/api/admin/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false); onSave(); onClose()
    }

    return (
        <Modal title="New Announcement" onClose={onClose}>
            <Field label="Title"><input className={inp} style={s} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title..." /></Field>
            <Field label="Message"><textarea className={inp} style={s} rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Announcement message..." /></Field>
            <Field label="Type">
                <select className={inp} style={{ ...s, background: '#0a150a' }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="info">ℹ️ Info</option>
                    <option value="success">✅ Success</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="urgent">🚨 Urgent</option>
                </select>
            </Field>
            <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                <label htmlFor="active" className="text-sm" style={{ color: 'rgba(180,200,140,0.7)' }}>Active immediately</label>
            </div>
            <button onClick={save} disabled={saving || !form.title || !form.message} className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#84cc16,#65a30d)', color: '#080f08' }}>
                {saving ? 'Publishing...' : 'Publish Announcement'}
            </button>
        </Modal>
    )
}
