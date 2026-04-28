'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    LayoutDashboard, Map, Users, Image as ImageIcon, 
    MessageSquare, FileText, Bell, Calendar, LogOut, ExternalLink, Menu, X 
} from 'lucide-react'

// ── TYPES ──────────────────────────────────────────────────────
type User = { id: string; name: string | null; email: string; role: string; college: string | null; phone: string | null; createdAt: string }
type Reg  = { id: string; name: string; email: string; phone: string; tripName: string; college: string | null; status: string; createdAt: string }
type Msg  = { id: string; name: string; email: string; subject: string | null; message: string; read: boolean; createdAt: string }
type Trip = { id: string; name: string; destination: string; description: string; price: number; status: string; startDate: string | null; endDate: string | null; totalSlots: number; bookedSlots: number; imageUrl: string | null; featured: boolean }
type Post = { id: string; title: string; content: string; author: string; tripName: string | null; imageUrl: string | null; published: boolean; createdAt: string }
type Photo = { id: string; url: string; caption: string | null; tripName: string; createdAt: string }
type Ann  = { id: string; title: string; message: string; type: string; active: boolean; createdAt: string }

const TABS = [
    { id: 'Overview', icon: LayoutDashboard },
    { id: 'Trips', icon: Map },
    { id: 'Registrations', icon: Calendar },
    { id: 'Users', icon: Users },
    { id: 'Blog', icon: FileText },
    { id: 'Gallery', icon: ImageIcon },
    { id: 'Announcements', icon: Bell },
    { id: 'Messages', icon: MessageSquare }
]

const api = (url: string, opts?: RequestInit) => fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts }).then(r => r.json())

// ── MODAL ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl z-10 bg-[#0d1a0d]"
                style={{ border: '1px solid rgba(132,204,22,0.2)' }}
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-lime-500/10">
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">{children}</div>
            </motion.div>
        </div>
    )
}

// ── INPUT HELPERS ──────────────────────────────────────────────
const inp = "w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none transition-all focus:ring-2 focus:ring-lime-500/50"
const inpStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(132,204,22,0.15)' }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="mb-4"><label className="block text-xs font-bold uppercase tracking-wider mb-2 text-lime-400/80">{label}</label>{children}</div>
}

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [tab, setTab] = useState('Overview')
    const [isSidebarOpen, setSidebarOpen] = useState(true)
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
    }, [status, router, session])

    const fetchAll = useCallback(async () => {
        setLoading(true)
        try {
            const [u, r, m, t, p, g, a] = await Promise.all([
                api('/api/admin/users'), api('/api/admin/registrations'), api('/api/admin/messages'),
                api('/api/admin/trips'), api('/api/admin/blog'), api('/api/admin/gallery'), api('/api/admin/announcements'),
            ])
            setUsers(u.users || []); setRegs(r.registrations || []); setMsgs(m.messages || [])
            setTrips(t.trips || []); setPosts(p.posts || []); setPhotos(g.photos || []); setAnns(a.announcements || [])
        } catch (error) {
            console.error("Failed to fetch admin data", error)
        }
        setLoading(false)
    }, [])

    if (status === 'loading' || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#080f08]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-lime-500/20 border-t-lime-500 rounded-full animate-spin" />
                <div className="text-lime-400 text-sm font-bold tracking-widest uppercase">Loading Workspace...</div>
            </div>
        </div>
    )

    const unread = msgs.filter(m => !m.read).length
    const pending = regs.filter(r => r.status === 'pending').length

    return (
        <div className="min-h-screen flex bg-[#080f08] overflow-hidden">
            {/* ── SIDEBAR ── */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex-shrink-0 h-screen bg-[#0d1a0d] border-r border-lime-500/10 flex flex-col relative z-20"
                    >
                        <div className="p-6 flex items-center gap-3 border-b border-lime-500/10">
                            <img src="/logo.png" alt="Safarnama" className="h-8 w-auto" />
                            <div>
                                <h1 className="text-white font-bold tracking-wider text-sm">SAFARNAMA</h1>
                                <p className="text-lime-500/60 text-[10px] uppercase font-bold tracking-widest">Admin Portal</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                            {TABS.map(t => {
                                const Icon = t.icon
                                const isActive = tab === t.id
                                return (
                                    <button 
                                        key={t.id} 
                                        onClick={() => setTab(t.id)} 
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-lime-500/10 text-lime-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} className={isActive ? "text-lime-400" : "text-slate-400"} />
                                            <span className="font-semibold text-sm">{t.id}</span>
                                        </div>
                                        {t.id === 'Messages' && unread > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">{unread}</span>}
                                        {t.id === 'Registrations' && pending > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">{pending}</span>}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="p-4 border-t border-lime-500/10">
                            <div className="bg-black/30 rounded-xl p-4 mb-2 border border-white/5">
                                <p className="text-white text-sm font-semibold truncate">{session?.user?.name || 'Admin User'}</p>
                                <p className="text-lime-500/60 text-xs truncate">{session?.user?.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <a href="/" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors">
                                    <ExternalLink size={14} /> Site
                                </a>
                                <button onClick={() => signOut({ callbackUrl: '/' })} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors">
                                    <LogOut size={14} /> Exit
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-[#080f08]/80 backdrop-blur-md border-b border-lime-500/10 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white transition-colors">
                            <Menu size={20} />
                        </button>
                        <h2 className="text-white font-bold text-lg">{tab}</h2>
                    </div>
                    
                    <div>
                        {tab === 'Trips' && <button onClick={() => { setEditing(null); setModal('trip') }} className="px-4 py-2 rounded-lg text-sm font-bold bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-[0_0_15px_rgba(132,204,22,0.3)]">+ New Trip</button>}
                        {tab === 'Blog' && <button onClick={() => { setEditing(null); setModal('blog') }} className="px-4 py-2 rounded-lg text-sm font-bold bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-[0_0_15px_rgba(132,204,22,0.3)]">+ New Post</button>}
                        {tab === 'Gallery' && <button onClick={() => { setEditing(null); setModal('photo') }} className="px-4 py-2 rounded-lg text-sm font-bold bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-[0_0_15px_rgba(132,204,22,0.3)]">+ Add Photo</button>}
                        {tab === 'Announcements' && <button onClick={() => { setEditing(null); setModal('ann') }} className="px-4 py-2 rounded-lg text-sm font-bold bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-[0_0_15px_rgba(132,204,22,0.3)]">+ New Announcement</button>}
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* ── OVERVIEW ── */}
                        {tab === 'Overview' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
                                        { label: 'Active Trips', value: trips.filter(t => t.status !== 'completed').length, icon: Map, color: 'text-lime-400', bg: 'bg-lime-400/10', border: 'border-lime-400/20' },
                                        { label: 'Pending Regs', value: pending, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
                                        { label: 'Unread Msgs', value: unread, icon: MessageSquare, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
                                    ].map((s, i) => {
                                        const Icon = s.icon
                                        return (
                                            <motion.div key={s.label} className={`p-5 rounded-2xl bg-[#0d1a0d] border ${s.border}`}
                                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.bg}`}>
                                                    <Icon size={20} className={s.color} />
                                                </div>
                                                <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                                                <div className="text-sm font-medium text-slate-400">{s.label}</div>
                                            </motion.div>
                                        )
                                    })}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Recent Announcements */}
                                    <div className="bg-[#0d1a0d] border border-lime-500/10 rounded-2xl p-6">
                                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Bell size={18} className="text-lime-400" /> Active Announcements</h3>
                                        {anns.filter(a => a.active).length > 0 ? (
                                            <div className="space-y-3">
                                                {anns.filter(a => a.active).slice(0, 3).map(a => (
                                                    <div key={a.id} className="p-4 rounded-xl flex items-start gap-3 bg-black/40 border border-white/5">
                                                        <span className="text-xl">{a.type === 'urgent' ? '🚨' : a.type === 'success' ? '✅' : a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                                                        <div><p className="text-white font-semibold text-sm">{a.title}</p><p className="text-xs mt-1 text-slate-400">{a.message}</p></div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-slate-500 text-sm">No active announcements</div>
                                        )}
                                    </div>

                                    {/* Quick Trip Stats */}
                                    <div className="bg-[#0d1a0d] border border-lime-500/10 rounded-2xl p-6">
                                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Map size={18} className="text-lime-400" /> Trip Occupancy</h3>
                                        <div className="space-y-4">
                                            {trips.filter(t => t.status === 'booking_open' || t.status === 'coming_soon').map(trip => {
                                                const percentage = trip.totalSlots > 0 ? Math.min(100, Math.round((trip.bookedSlots / trip.totalSlots) * 100)) : 0;
                                                return (
                                                    <div key={trip.id}>
                                                        <div className="flex justify-between text-sm mb-1.5">
                                                            <span className="text-white font-medium">{trip.name}</span>
                                                            <span className="text-lime-400 text-xs font-bold">{trip.bookedSlots} / {trip.totalSlots}</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-lime-500 rounded-full" style={{ width: `${percentage}%` }} />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {trips.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">No active trips</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TRIPS ── */}
                        {tab === 'Trips' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {trips.map(trip => {
                                    const percentage = trip.totalSlots > 0 ? Math.min(100, Math.round((trip.bookedSlots / trip.totalSlots) * 100)) : 0;
                                    return (
                                        <div key={trip.id} className="rounded-2xl overflow-hidden bg-[#0d1a0d] border border-lime-500/10 group flex flex-col">
                                            <div className="relative h-48 overflow-hidden">
                                                {trip.imageUrl ? <img src={trip.imageUrl} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-black/50 flex items-center justify-center text-slate-500">No Image</div>}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0d] to-transparent opacity-80" />
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${trip.status === 'booking_open' ? 'bg-lime-500/80 text-black' : trip.status === 'coming_soon' ? 'bg-amber-500/80 text-black' : 'bg-black/60 text-white'}`}>
                                                        {trip.status.replace('_', ' ')}
                                                    </span>
                                                    {trip.featured && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/80 text-white shadow-lg backdrop-blur-md">Featured</span>}
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-white font-bold text-lg mb-1">{trip.name}</h3>
                                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{trip.description}</p>
                                                
                                                <div className="mt-auto space-y-4">
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-1.5 text-slate-300">
                                                            <span>Booked: {trip.bookedSlots}/{trip.totalSlots}</span>
                                                            <span>{percentage}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-lime-500 rounded-full" style={{ width: `${percentage}%` }} />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between py-3 border-t border-white/5">
                                                        <div>
                                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Price</div>
                                                            <div className="text-lime-400 font-bold">{trip.price > 0 ? `₹${trip.price.toLocaleString()}` : 'TBA'}</div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditing(trip as unknown as Record<string, unknown>); setModal('trip') }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition-colors">Edit</button>
                                                            <button onClick={async () => { if (confirm('Delete this trip?')) { await api('/api/admin/trips', { method: 'DELETE', body: JSON.stringify({ id: trip.id }) }); fetchAll() } }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* ── REGISTRATIONS ── */}
                        {tab === 'Registrations' && (
                            <div className="space-y-6">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {Array.from(new Set(regs.map(r => r.tripName))).map(tripName => {
                                        const tripRegs = regs.filter(r => r.tripName === tripName)
                                        const confirmed = tripRegs.filter(r => r.status === 'confirmed').length
                                        return (
                                            <div key={tripName} className="p-5 rounded-2xl bg-[#0d1a0d] border border-lime-500/10">
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 truncate">{tripName}</p>
                                                <p className="text-white text-3xl font-bold mb-2">{tripRegs.length}</p>
                                                <div className="flex gap-3 text-xs font-medium">
                                                    <span className="text-lime-400">{confirmed} confirmed</span>
                                                    <span className="text-amber-400">{tripRegs.length - confirmed} pending</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Table */}
                                <div className="rounded-2xl overflow-hidden bg-[#0d1a0d] border border-lime-500/10">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-lime-500/70 uppercase bg-black/40">
                                                <tr>
                                                    <th className="px-6 py-4 font-bold tracking-wider">User</th>
                                                    <th className="px-6 py-4 font-bold tracking-wider">Trip</th>
                                                    <th className="px-6 py-4 font-bold tracking-wider">Contact</th>
                                                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {regs.map((r) => (
                                                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="text-white font-semibold">{r.name}</div>
                                                            <div className="text-slate-500 text-xs mt-0.5">{r.college || 'No college'}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-slate-300 font-medium text-xs">
                                                                <Map size={12} className="text-lime-500" />
                                                                {r.tripName}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-slate-300">{r.phone}</div>
                                                            <div className="text-slate-500 text-xs mt-0.5">{r.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${r.status === 'confirmed' ? 'bg-lime-500/10 text-lime-400' : r.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                                {r.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                {r.status !== 'confirmed' && <button onClick={async () => { await api('/api/admin/registrations', { method: 'PATCH', body: JSON.stringify({ id: r.id, status: 'confirmed' }) }); fetchAll() }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 transition-colors">Confirm</button>}
                                                                {r.status !== 'cancelled' && <button onClick={async () => { await api('/api/admin/registrations', { method: 'PATCH', body: JSON.stringify({ id: r.id, status: 'cancelled' }) }); fetchAll() }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">Cancel</button>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {regs.length === 0 && <div className="text-center py-12 text-slate-500">No registrations found.</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── USERS ── */}
                        {tab === 'Users' && (
                            <div className="rounded-2xl overflow-hidden bg-[#0d1a0d] border border-lime-500/10">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-lime-500/70 uppercase bg-black/40">
                                            <tr>
                                                <th className="px-6 py-4 font-bold tracking-wider">User</th>
                                                <th className="px-6 py-4 font-bold tracking-wider">Contact</th>
                                                <th className="px-6 py-4 font-bold tracking-wider">College</th>
                                                <th className="px-6 py-4 font-bold tracking-wider">Role</th>
                                                <th className="px-6 py-4 font-bold tracking-wider">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map((u) => (
                                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold text-xs">
                                                                {(u.name || u.email).charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="text-white font-semibold">{u.name || 'Unknown'}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-slate-300">{u.email}</div>
                                                        {u.phone && <div className="text-slate-500 text-xs mt-0.5">{u.phone}</div>}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400">{u.college || '—'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20' : 'bg-white/5 text-slate-400'}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── BLOG ── */}
                        {tab === 'Blog' && (
                            <div className="space-y-4">
                                {posts.map(post => (
                                    <div key={post.id} className="p-6 rounded-2xl bg-[#0d1a0d] border border-lime-500/10 flex flex-col md:flex-row gap-6">
                                        {post.imageUrl && (
                                            <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden relative">
                                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/20" />
                                            </div>
                                        )}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <h3 className="text-white font-bold text-lg mb-1">{post.title}</h3>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                                        <span className="flex items-center gap-1"><Users size={12} /> {post.author}</span>
                                                        {post.tripName && <span className="flex items-center gap-1"><Map size={12} /> {post.tripName}</span>}
                                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${post.published ? 'bg-lime-500/10 text-lime-400' : 'bg-white/5 text-slate-400'}`}>
                                                    {post.published ? 'Published' : 'Draft'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 mt-2 line-clamp-2">{post.content}</p>
                                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 justify-end">
                                                <button onClick={() => { setEditing(post as unknown as Record<string, unknown>); setModal('blog') }} className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition-colors">Edit Post</button>
                                                <button onClick={async () => { if (confirm('Delete?')) { await api('/api/admin/blog', { method: 'DELETE', body: JSON.stringify({ id: post.id }) }); fetchAll() } }} className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {posts.length === 0 && <div className="text-center py-12 text-slate-500">No blog posts found.</div>}
                            </div>
                        )}

                        {/* ── GALLERY ── */}
                        {tab === 'Gallery' && (
                            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                                {photos.map(photo => (
                                    <div key={photo.id} className="relative group rounded-xl overflow-hidden break-inside-avoid bg-black/20 border border-white/5">
                                        <img src={photo.url} alt={photo.caption || ''} className="w-full h-auto" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            {photo.caption && <p className="text-white text-sm font-semibold mb-1">{photo.caption}</p>}
                                            <p className="text-lime-400 text-[10px] uppercase tracking-wider font-bold mb-3">{photo.tripName}</p>
                                            <button onClick={async () => { if (confirm('Delete?')) { await api('/api/admin/gallery', { method: 'DELETE', body: JSON.stringify({ id: photo.id }) }); fetchAll() } }} className="w-full py-1.5 rounded-lg text-xs font-bold bg-red-500 hover:bg-red-600 text-white transition-colors">
                                                Delete Photo
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {photos.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No photos in gallery.</div>}
                            </div>
                        )}

                        {/* ── ANNOUNCEMENTS ── */}
                        {tab === 'Announcements' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {anns.map(a => (
                                    <div key={a.id} className={`p-6 rounded-2xl border ${a.type === 'urgent' ? 'bg-red-500/5 border-red-500/20' : a.type === 'success' ? 'bg-lime-500/5 border-lime-500/20' : 'bg-[#0d1a0d] border-lime-500/10'} flex flex-col`}>
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{a.type === 'urgent' ? '🚨' : a.type === 'success' ? '✅' : a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                                                <h3 className="text-white font-bold text-lg">{a.title}</h3>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${a.active ? 'bg-lime-500/10 text-lime-400' : 'bg-white/5 text-slate-400'}`}>
                                                {a.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-300 mb-6 flex-1">{a.message}</p>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                            <span className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            <div className="flex gap-2">
                                                <button onClick={async () => { await api('/api/admin/announcements', { method: 'PATCH', body: JSON.stringify({ id: a.id, active: !a.active }) }); fetchAll() }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition-colors">{a.active ? 'Deactivate' : 'Activate'}</button>
                                                <button onClick={async () => { if (confirm('Delete?')) { await api('/api/admin/announcements', { method: 'DELETE', body: JSON.stringify({ id: a.id }) }); fetchAll() } }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {anns.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No announcements found.</div>}
                            </div>
                        )}

                        {/* ── MESSAGES ── */}
                        {tab === 'Messages' && (
                            <div className="space-y-4 max-w-4xl">
                                {msgs.map((m) => (
                                    <div key={m.id} className={`p-6 rounded-2xl border transition-colors ${m.read ? 'bg-[#0d1a0d]/50 border-white/5' : 'bg-[#0d1a0d] border-lime-500/30 shadow-[0_0_15px_rgba(132,204,22,0.05)]'}`}>
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-white font-bold text-lg">{m.name}</h3>
                                                    {!m.read && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lime-500 text-black">New</span>}
                                                </div>
                                                <div className="text-sm text-lime-500/80">{m.email}</div>
                                            </div>
                                            <div className="text-xs text-slate-500 text-right">
                                                {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                        {m.subject && <div className="text-sm font-bold text-slate-300 mb-2 border-b border-white/5 pb-2">{m.subject}</div>}
                                        <p className="text-sm text-slate-300 whitespace-pre-wrap mb-4">{m.message}</p>
                                        {!m.read && (
                                            <div className="flex justify-end pt-4 border-t border-white/5">
                                                <button onClick={async () => { await api('/api/admin/messages', { method: 'PATCH', body: JSON.stringify({ id: m.id }) }); fetchAll() }} className="px-4 py-2 rounded-lg text-xs font-bold bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 transition-colors flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-lime-400"></span> Mark as Read
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {msgs.length === 0 && <div className="text-center py-12 text-slate-500">No messages found.</div>}
                            </div>
                        )}

                    </div>
                </main>
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

    return (
        <Modal title={editing ? 'Edit Trip' : 'Create New Trip'} onClose={onClose}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Trip Name"><input className={inp} style={inpStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Banaras Vibes" /></Field>
                <Field label="Destination"><input className={inp} style={inpStyle} value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Varanasi, UP" /></Field>
                <div className="md:col-span-2">
                    <Field label="Description"><textarea className={inp} style={inpStyle} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Write a compelling trip description..." /></Field>
                </div>
                <Field label="Price (₹)"><input className={inp} style={inpStyle} type="text" inputMode="numeric" value={form.price} onChange={e => setForm({ ...form, price: e.target.value.replace(/[^0-9]/g, '') })} placeholder="3000" /></Field>
                <Field label="Status">
                    <select className={inp} style={{ ...inpStyle, backgroundColor: '#0d1a0d' }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="yet_to_announce">Yet to Announce</option>
                        <option value="coming_soon">Coming Soon</option>
                        <option value="booking_open">Booking Open</option>
                        <option value="completed">Completed</option>
                    </select>
                </Field>
                <Field label="Start Date"><input className={inp} style={{ ...inpStyle, colorScheme: 'dark' }} type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></Field>
                <Field label="End Date"><input className={inp} style={{ ...inpStyle, colorScheme: 'dark' }} type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></Field>
                <Field label="Total Slots"><input className={inp} style={inpStyle} type="text" inputMode="numeric" value={form.totalSlots} onChange={e => setForm({ ...form, totalSlots: e.target.value.replace(/[^0-9]/g, '') })} /></Field>
                <Field label="Booked Slots"><input className={inp} style={inpStyle} type="text" inputMode="numeric" value={form.bookedSlots} onChange={e => setForm({ ...form, bookedSlots: e.target.value.replace(/[^0-9]/g, '') })} /></Field>
                <div className="md:col-span-2">
                    <Field label="Image URL"><input className={inp} style={inpStyle} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></Field>
                </div>
                <div className="md:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 mt-2">
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-lime-500 bg-transparent border-white/20 rounded" />
                    <label htmlFor="featured" className="text-sm font-semibold text-white cursor-pointer select-none">Feature this trip on the homepage</label>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/5">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={save} disabled={saving} className="px-8 py-2.5 rounded-xl font-bold text-sm bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-[0_0_20px_rgba(132,204,22,0.3)] disabled:opacity-50">
                    {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Trip'}
                </button>
            </div>
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

    const save = async () => {
        setSaving(true)
        if (editing?.id) await fetch('/api/admin/blog', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...form }) })
        else await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false); onSave(); onClose()
    }

    return (
        <Modal title={editing ? 'Edit Blog Post' : 'Create Blog Post'} onClose={onClose}>
            <div className="space-y-4">
                <Field label="Post Title"><input className={inp} style={inpStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Engaging title..." /></Field>
                <Field label="Content"><textarea className={inp} style={inpStyle} rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write the post content here..." /></Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Author"><input className={inp} style={inpStyle} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></Field>
                    <Field label="Related Trip (Optional)"><input className={inp} style={inpStyle} value={form.tripName} onChange={e => setForm({ ...form, tripName: e.target.value })} placeholder="e.g. Manali Adventure" /></Field>
                </div>
                <Field label="Cover Image URL"><input className={inp} style={inpStyle} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></Field>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 mt-2">
                    <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-lime-500 bg-transparent border-white/20 rounded" />
                    <label htmlFor="pub" className="text-sm font-semibold text-white cursor-pointer select-none">Publish immediately (visible to public)</label>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/5">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={save} disabled={saving} className="px-8 py-2.5 rounded-xl font-bold text-sm bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-[0_0_20px_rgba(132,204,22,0.3)] disabled:opacity-50">
                    {saving ? 'Saving...' : editing ? 'Save Post' : 'Publish Post'}
                </button>
            </div>
        </Modal>
    )
}

// ── PHOTO MODAL ────────────────────────────────────────────────
function PhotoModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({ url: '', caption: '', tripName: '' })
    const [saving, setSaving] = useState(false)

    const save = async () => {
        if (!form.url || !form.tripName) return
        setSaving(true)
        await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false); onSave(); onClose()
    }

    return (
        <Modal title="Add Photo to Gallery" onClose={onClose}>
            <div className="space-y-4">
                <Field label="Photo URL *"><input className={inp} style={inpStyle} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></Field>
                {form.url && (
                    <div className="rounded-xl overflow-hidden border border-white/10 h-48 bg-black/50">
                        <img src={form.url} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                )}
                <Field label="Trip Name *"><input className={inp} style={inpStyle} value={form.tripName} onChange={e => setForm({ ...form, tripName: e.target.value })} placeholder="e.g. Banaras Vibes" /></Field>
                <Field label="Caption (Optional)"><input className={inp} style={inpStyle} value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Brief description..." /></Field>
            </div>
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/5">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={save} disabled={saving || !form.url || !form.tripName} className="px-8 py-2.5 rounded-xl font-bold text-sm bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-[0_0_20px_rgba(132,204,22,0.3)] disabled:opacity-50">
                    {saving ? 'Adding...' : 'Add Photo'}
                </button>
            </div>
        </Modal>
    )
}

// ── ANNOUNCEMENT MODAL ─────────────────────────────────────────
function AnnModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({ title: '', message: '', type: 'info', active: true })
    const [saving, setSaving] = useState(false)

    const save = async () => {
        if (!form.title || !form.message) return
        setSaving(true)
        await fetch('/api/admin/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false); onSave(); onClose()
    }

    return (
        <Modal title="Create Announcement" onClose={onClose}>
            <div className="space-y-4">
                <Field label="Title *"><input className={inp} style={inpStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Headline..." /></Field>
                <Field label="Message *"><textarea className={inp} style={inpStyle} rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Detailed message..." /></Field>
                <Field label="Announcement Type">
                    <select className={inp} style={{ ...inpStyle, backgroundColor: '#0d1a0d' }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="info">ℹ️ Informational</option>
                        <option value="success">✅ Success / Milestone</option>
                        <option value="warning">⚠️ Warning / Changes</option>
                        <option value="urgent">🚨 Urgent / Alert</option>
                    </select>
                </Field>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 mt-2">
                    <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-lime-500 bg-transparent border-white/20 rounded" />
                    <label htmlFor="active" className="text-sm font-semibold text-white cursor-pointer select-none">Set active immediately</label>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/5">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={save} disabled={saving || !form.title || !form.message} className="px-8 py-2.5 rounded-xl font-bold text-sm bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-[0_0_20px_rgba(132,204,22,0.3)] disabled:opacity-50">
                    {saving ? 'Publishing...' : 'Publish Announcement'}
                </button>
            </div>
        </Modal>
    )
}
