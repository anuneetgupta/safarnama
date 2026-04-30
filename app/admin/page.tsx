'use client'
import './admin.css'

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
        <div className="adm-modal-overlay">
            <div className="absolute inset-0" onClick={onClose} />
            <motion.div className="adm-modal" style={{display:'flex',flexDirection:'column',maxHeight:'90vh'}}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: [0.22,1,0.36,1] }}>
                <div className="adm-modal-head">
                    <h3 className="adm-modal-title">{title}</h3>
                    <button onClick={onClose} className="adm-modal-close"><X size={18} /></button>
                </div>
                <div className="adm-modal-body" style={{flex:1}}>{children}</div>
            </motion.div>
        </div>
    )
}

// ── INPUT HELPERS ──────────────────────────────────────────────
const inp = "adm-input"
const inpStyle = {}

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
    return (
        <div className="adm-field" style={span2 ? {gridColumn:'1/-1'} : {}}>
            <label>{label}</label>
            {children}
        </div>
    )
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
        <div className="adm-loading">
            <div className="adm-spinner" />
            <div className="adm-loading-label">Loading Workspace...</div>
        </div>
    )

    const unread = msgs.filter(m => !m.read).length
    const pending = regs.filter(r => r.status === 'pending').length

    return (
        <div className="adm-root">
            {/* SIDEBAR */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="adm-sidebar"
                    >
                        <div className="adm-logo">
                            <div className="adm-logo-icon">
                                <img src="/logo.png" alt="Safarnama" style={{height:'22px',width:'auto'}} />
                            </div>
                            <div className="adm-logo-text">
                                <h1>SAFARNAMA</h1>
                                <span>Admin Portal</span>
                            </div>
                        </div>

                        <nav className="adm-nav">
                            {TABS.map(t => {
                                const Icon = t.icon
                                const isActive = tab === t.id
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setTab(t.id)}
                                        className={`adm-nav-item${isActive ? ' active' : ''}`}
                                    >
                                        <div className="adm-nav-inner">
                                            <Icon size={17} className="adm-nav-icon" />
                                            <span>{t.id}</span>
                                        </div>
                                        {t.id === 'Messages' && unread > 0 && <span className="adm-badge adm-badge-red">{unread}</span>}
                                        {t.id === 'Registrations' && pending > 0 && <span className="adm-badge adm-badge-amber">{pending}</span>}
                                    </button>
                                )
                            })}
                        </nav>

                        <div className="adm-sidebar-footer">
                            <div className="adm-user-block">
                                <div className="adm-user-avatar">{(session?.user?.name || session?.user?.email || 'A').charAt(0).toUpperCase()}</div>
                                <div style={{overflow:'hidden'}}>
                                    <div className="adm-user-name">{session?.user?.name || 'Admin User'}</div>
                                    <div className="adm-user-role">Admin</div>
                                </div>
                            </div>
                            <div className="adm-footer-btns">
                                <a href="/" className="adm-btn-site"><ExternalLink size={13} /> Site</a>
                                <button onClick={() => signOut({ callbackUrl: '/' })} className="adm-btn-exit"><LogOut size={13} /> Exit</button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* MAIN */}
            <div className="adm-body">
                <header className="adm-header">
                    <div className="adm-header-left">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="adm-menu-btn">
                            <Menu size={19} />
                        </button>
                        <h2 className="adm-page-title">{tab}</h2>
                    </div>
                    <div>
                        {tab === 'Trips' && <button onClick={() => { setEditing(null); setModal('trip') }} className="adm-btn adm-btn-primary">+ New Trip</button>}
                        {tab === 'Blog' && <button onClick={() => { setEditing(null); setModal('blog') }} className="adm-btn adm-btn-primary">+ New Post</button>}
                        {tab === 'Gallery' && <button onClick={() => { setEditing(null); setModal('photo') }} className="adm-btn adm-btn-primary">+ Add Photo</button>}
                        {tab === 'Announcements' && <button onClick={() => { setEditing(null); setModal('ann') }} className="adm-btn adm-btn-primary">+ Announcement</button>}
                    </div>
                </header>

                <main className="adm-main">
                    <div className="adm-inner">
                        
                        {/* ── OVERVIEW ── */}
                        {tab === 'Overview' && (
                            <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
                                <div className="adm-stat-grid">
                                    {[
                                        { label: 'Total Users', value: users.length, icon: Users, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
                                        { label: 'Active Trips', value: trips.filter(t => t.status !== 'completed').length, icon: Map, color: '#a3e635', bg: 'rgba(163,230,53,0.1)', border: 'rgba(163,230,53,0.2)' },
                                        { label: 'Pending Regs', value: pending, icon: Calendar, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
                                        { label: 'Unread Msgs', value: unread, icon: MessageSquare, color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
                                    ].map((s, i) => {
                                        const Icon = s.icon
                                        return (
                                            <motion.div key={s.label} className="adm-stat-card"
                                                style={{borderColor: s.border}}
                                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                                                <div className="adm-stat-icon" style={{background: s.bg}}>
                                                    <Icon size={19} style={{color: s.color}} />
                                                </div>
                                                <div className="adm-stat-value">{s.value}</div>
                                                <div className="adm-stat-label">{s.label}</div>
                                            </motion.div>
                                        )
                                    })}
                                </div>

                                <div className="adm-grid-2">
                                    <div className="adm-card">
                                        <div className="adm-card-header">
                                            <div className="adm-card-title"><Bell size={16} style={{color:'#a3e635'}} /> Active Announcements</div>
                                        </div>
                                        <div className="adm-card-body" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                                            {anns.filter(a => a.active).length > 0 ? anns.filter(a => a.active).slice(0, 3).map(a => (
                                                <div key={a.id} className="adm-ann-item">
                                                    <span style={{fontSize:'18px'}}>{a.type === 'urgent' ? '🚨' : a.type === 'success' ? '✅' : a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                                                    <div>
                                                        <p style={{fontWeight:600,fontSize:'13px',color:'var(--text)'}}>{a.title}</p>
                                                        <p style={{fontSize:'12px',color:'var(--text2)',marginTop:'3px'}}>{a.message}</p>
                                                    </div>
                                                </div>
                                            )) : <div className="adm-empty" style={{padding:'32px 0'}}>No active announcements</div>}
                                        </div>
                                    </div>
                                    <div className="adm-card">
                                        <div className="adm-card-header">
                                            <div className="adm-card-title"><Map size={16} style={{color:'#a3e635'}} /> Trip Occupancy</div>
                                        </div>
                                        <div className="adm-card-body" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                                            {trips.filter(t => t.status === 'booking_open' || t.status === 'coming_soon').map(trip => {
                                                const pct = trip.totalSlots > 0 ? Math.min(100, Math.round((trip.bookedSlots / trip.totalSlots) * 100)) : 0
                                                return (
                                                    <div key={trip.id}>
                                                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',marginBottom:'8px'}}>
                                                            <span style={{fontWeight:600,color:'var(--text)'}}>{trip.name}</span>
                                                            <span style={{color:'#a3e635',fontWeight:700,fontSize:'12px'}}>{trip.bookedSlots}/{trip.totalSlots}</span>
                                                        </div>
                                                        <div className="adm-progress"><div className="adm-progress-fill" style={{width:`${pct}%`}} /></div>
                                                    </div>
                                                )
                                            })}
                                            {trips.length === 0 && <div className="adm-empty" style={{padding:'32px 0'}}>No active trips</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TRIPS ── */}
                        {tab === 'Trips' && (
                            <div className="adm-grid-3">
                                {trips.map(trip => {
                                    const pct = trip.totalSlots > 0 ? Math.min(100, Math.round((trip.bookedSlots / trip.totalSlots) * 100)) : 0
                                    return (
                                        <div key={trip.id} className="adm-trip-card group">
                                            {/* Image */}
                                            <div style={{position:'relative',height:'180px',overflow:'hidden',flexShrink:0}}>
                                                {trip.imageUrl
                                                    ? <img src={trip.imageUrl} alt={trip.name} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s ease'}} className="group-hover:scale-105" />
                                                    : <div style={{width:'100%',height:'100%',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',fontSize:'13px'}}>No Image</div>
                                                }
                                                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(17,24,39,0.95) 0%,transparent 60%)'}} />
                                                {/* Status badge */}
                                                <div style={{position:'absolute',top:'12px',left:'12px',display:'flex',gap:'6px'}}>
                                                    <span className={`adm-status ${trip.status==='booking_open'?'adm-status-green':trip.status==='coming_soon'?'adm-status-amber':trip.status==='completed'?'adm-status-grey':'adm-status-blue'}`}>
                                                        {trip.status.replace(/_/g,' ')}
                                                    </span>
                                                    {trip.featured && <span className="adm-status adm-status-blue">★ Featured</span>}
                                                </div>
                                                {/* Price on image */}
                                                <div style={{position:'absolute',bottom:'12px',left:'14px'}}>
                                                    <div style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'rgba(163,230,53,0.6)',marginBottom:'2px'}}>Price</div>
                                                    <div style={{fontSize:'18px',fontWeight:800,color:'#a3e635',letterSpacing:'-0.02em'}}>{trip.price > 0 ? `₹${trip.price.toLocaleString()}` : 'TBA'}</div>
                                                </div>
                                            </div>
                                            {/* Body */}
                                            <div style={{padding:'16px',flex:1,display:'flex',flexDirection:'column',gap:'12px'}}>
                                                <div>
                                                    <h3 style={{fontWeight:700,fontSize:'15px',color:'var(--text)',marginBottom:'4px'}}>{trip.name}</h3>
                                                    <p style={{fontSize:'12px',color:'var(--text3)',lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{trip.description}</p>
                                                </div>
                                                {/* Occupancy */}
                                                <div>
                                                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',marginBottom:'6px'}}>
                                                        <span style={{color:'var(--text3)'}}>Slots: {trip.bookedSlots}/{trip.totalSlots}</span>
                                                        <span style={{color:'#a3e635',fontWeight:700}}>{pct}%</span>
                                                    </div>
                                                    <div className="adm-progress"><div className="adm-progress-fill" style={{width:`${pct}%`}} /></div>
                                                </div>
                                                {/* Actions */}
                                                <div style={{display:'flex',gap:'8px',marginTop:'auto',paddingTop:'12px',borderTop:'1px solid var(--border)'}}>
                                                    <button
                                                        onClick={() => { setEditing(trip as unknown as Record<string, unknown>); setModal('trip') }}
                                                        className="adm-btn adm-btn-ghost adm-btn-sm"
                                                        style={{flex:1,justifyContent:'center'}}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={async () => { if (confirm('Delete this trip?')) { await api('/api/admin/trips', { method: 'DELETE', body: JSON.stringify({ id: trip.id }) }); fetchAll() } }}
                                                        className="adm-btn adm-btn-danger adm-btn-sm"
                                                        style={{flex:1,justifyContent:'center'}}
                                                    >
                                                        🗑 Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {trips.length === 0 && <div className="adm-empty" style={{gridColumn:'1/-1'}}>No trips yet. Create your first trip!</div>}
                            </div>
                        )}

                        {/* ── REGISTRATIONS ── */}
                        {tab === 'Registrations' && (
                            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                                <div className="adm-stat-grid">
                                    {Array.from(new Set(regs.map(r => r.tripName))).map(tripName => {
                                        const tripRegs = regs.filter(r => r.tripName === tripName)
                                        const confirmed = tripRegs.filter(r => r.status === 'confirmed').length
                                        return (
                                            <div key={tripName} className="adm-stat-card">
                                                <div style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text3)',marginBottom:'8px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tripName}</div>
                                                <div className="adm-stat-value">{tripRegs.length}</div>
                                                <div style={{display:'flex',gap:'12px',fontSize:'12px',fontWeight:600,marginTop:'6px'}}>
                                                    <span style={{color:'#a3e635'}}>{confirmed} confirmed</span>
                                                    <span style={{color:'#fbbf24'}}>{tripRegs.length - confirmed} pending</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="adm-card">
                                    <div className="adm-table-wrap">
                                        <table className="adm-table">
                                            <thead><tr>
                                                <th>User</th><th>Trip</th><th>Contact</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th>
                                            </tr></thead>
                                            <tbody>
                                                {regs.map(r => (
                                                    <tr key={r.id}>
                                                        <td><strong>{r.name}</strong><div style={{fontSize:'11px',color:'var(--text3)',marginTop:'2px'}}>{r.college || 'No college'}</div></td>
                                                        <td><span style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'3px 10px',borderRadius:'6px',background:'rgba(255,255,255,0.05)',fontSize:'12px',color:'var(--text2)'}}><Map size={11} style={{color:'#a3e635'}} />{r.tripName}</span></td>
                                                        <td><div style={{color:'var(--text2)'}}>{r.phone}</div><div style={{fontSize:'11px',color:'var(--text3)',marginTop:'2px'}}>{r.email}</div></td>
                                                        <td><span className={`adm-status ${r.status==='confirmed'?'adm-status-green':r.status==='cancelled'?'adm-status-red':'adm-status-amber'}`}>{r.status}</span></td>
                                                        <td style={{textAlign:'right'}}>
                                                            <div style={{display:'flex',justifyContent:'flex-end',gap:'8px'}}>
                                                                {r.status !== 'confirmed' && <button onClick={async()=>{await api('/api/admin/registrations',{method:'PATCH',body:JSON.stringify({id:r.id,status:'confirmed'})});fetchAll()}} className="adm-btn adm-btn-confirm adm-btn-xs">Confirm</button>}
                                                                {r.status !== 'cancelled' && <button onClick={async()=>{await api('/api/admin/registrations',{method:'PATCH',body:JSON.stringify({id:r.id,status:'cancelled'})});fetchAll()}} className="adm-btn adm-btn-danger adm-btn-xs">Cancel</button>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {regs.length === 0 && <div className="adm-empty">No registrations found.</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── USERS ── */}
                        {tab === 'Users' && (
                            <div className="adm-card">
                                <div className="adm-table-wrap">
                                    <table className="adm-table">
                                        <thead><tr>
                                            <th>User</th><th>Contact</th><th>College</th><th>Role</th><th>Joined</th>
                                        </tr></thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id}>
                                                    <td>
                                                        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                                                            <div className="adm-avatar">{(u.name||u.email).charAt(0).toUpperCase()}</div>
                                                            <strong>{u.name || 'Unknown'}</strong>
                                                        </div>
                                                    </td>
                                                    <td><div style={{color:'var(--text2)'}}>{u.email}</div>{u.phone&&<div style={{fontSize:'11px',color:'var(--text3)',marginTop:'2px'}}>{u.phone}</div>}</td>
                                                    <td>{u.college || '—'}</td>
                                                    <td><span className={`adm-status ${u.role==='admin'?'adm-status-green':'adm-status-grey'}`}>{u.role}</span></td>
                                                    <td style={{fontSize:'12px',color:'var(--text3)'}}>{new Date(u.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {users.length === 0 && <div className="adm-empty">No users found.</div>}
                                </div>
                            </div>
                        )}

                        {/* ── BLOG ── */}
                        {tab === 'Blog' && (
                            <div className="adm-grid-3">
                                {posts.map(post => (
                                    <div key={post.id} className="adm-trip-card group" style={{display:'flex',flexDirection:'column'}}>
                                        {/* Cover image */}
                                        <div style={{position:'relative',height:'160px',overflow:'hidden',flexShrink:0}}>
                                            {post.imageUrl
                                                ? <img src={post.imageUrl} alt={post.title} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s ease'}} className="group-hover:scale-105" />
                                                : <div style={{width:'100%',height:'100%',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px'}}>
                                                    <FileText size={28} style={{color:'rgba(163,230,53,0.25)'}} />
                                                    <span style={{fontSize:'12px',color:'var(--text3)'}}>No Cover Image</span>
                                                  </div>
                                            }
                                            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(17,24,39,0.9) 0%,transparent 55%)'}} />
                                            {/* Published badge */}
                                            <div style={{position:'absolute',top:'10px',left:'10px'}}>
                                                <span className={`adm-status ${post.published?'adm-status-green':'adm-status-grey'}`}>
                                                    {post.published ? '🌐 Published' : '📄 Draft'}
                                                </span>
                                            </div>
                                            {/* Trip tag */}
                                            {post.tripName && (
                                                <div style={{position:'absolute',top:'10px',right:'10px'}}>
                                                    <span className="adm-status adm-status-blue"><Map size={9} /> {post.tripName}</span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Body */}
                                        <div style={{padding:'16px',flex:1,display:'flex',flexDirection:'column',gap:'10px'}}>
                                            <h3 style={{fontWeight:700,fontSize:'15px',color:'var(--text)',lineHeight:1.35}}>{post.title}</h3>
                                            <p style={{fontSize:'12px',color:'var(--text3)',lineHeight:1.55,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',flex:1}}>
                                                {post.content}
                                            </p>
                                            {/* Meta */}
                                            <div style={{display:'flex',alignItems:'center',gap:'12px',fontSize:'11px',color:'var(--text3)',paddingTop:'10px',borderTop:'1px solid var(--border)',marginTop:'auto'}}>
                                                <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Users size={11} style={{color:'#a3e635'}} />{post.author}</span>
                                                <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Calendar size={11} />{new Date(post.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                                            </div>
                                            {/* Actions */}
                                            <div style={{display:'flex',gap:'8px'}}>
                                                <button
                                                    onClick={() => { setEditing(post as unknown as Record<string,unknown>); setModal('blog') }}
                                                    className="adm-btn adm-btn-ghost adm-btn-sm"
                                                    style={{flex:1,justifyContent:'center'}}
                                                >✏️ Edit</button>
                                                <button
                                                    onClick={async () => { if (confirm('Delete post?')) { await api('/api/admin/blog',{method:'DELETE',body:JSON.stringify({id:post.id})}); fetchAll() } }}
                                                    className="adm-btn adm-btn-danger adm-btn-sm"
                                                    style={{flex:1,justifyContent:'center'}}
                                                >🗑 Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {posts.length === 0 && <div className="adm-empty" style={{gridColumn:'1/-1'}}>No blog posts yet. Create your first post!</div>}
                            </div>
                        )}

                        {/* ── GALLERY ── */}
                        {tab === 'Gallery' && (
                            <div style={{display:'flex',flexDirection:'column',gap:'32px'}}>
                                {/* Group by trip */}
                                {Array.from(new Set(photos.map(p => p.tripName))).map(tripName => {
                                    const tripPhotos = photos.filter(p => p.tripName === tripName)
                                    return (
                                        <div key={tripName}>
                                            {/* Trip group header */}
                                            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px'}}>
                                                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                                    <div style={{width:'4px',height:'20px',background:'#a3e635',borderRadius:'2px'}} />
                                                    <h3 style={{fontWeight:700,fontSize:'15px',color:'var(--text)'}}>{tripName}</h3>
                                                </div>
                                                <span style={{fontSize:'11px',color:'var(--text3)',background:'rgba(255,255,255,0.05)',padding:'2px 10px',borderRadius:'999px',border:'1px solid var(--border)'}}>
                                                    {tripPhotos.length} photo{tripPhotos.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            {/* Photo grid */}
                                            <div style={{columns:'1',columnGap:'12px'}} className="adm-gallery-grid">
                                                {tripPhotos.map(photo => (
                                                    <div key={photo.id} className="adm-gallery-item group">
                                                        <img src={photo.url} alt={photo.caption || tripName} className="adm-gallery-img" onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400' }} />
                                                        {/* Hover overlay */}
                                                        <div className="adm-gallery-overlay">
                                                            {photo.caption && <p className="adm-gallery-caption">{photo.caption}</p>}
                                                            <p style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#a3e635',marginBottom:'10px'}}>{tripName}</p>
                                                            <div style={{display:'flex',gap:'8px'}}>
                                                                <button
                                                                    onClick={() => { setEditing(photo as unknown as Record<string,unknown>); setModal('photo-edit') }}
                                                                    className="adm-btn adm-btn-ghost adm-btn-xs"
                                                                    style={{flex:1,justifyContent:'center',background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)'}}
                                                                >✏️ Edit</button>
                                                                <button
                                                                    onClick={async () => { if (confirm('Delete photo?')) { await api('/api/admin/gallery',{method:'DELETE',body:JSON.stringify({id:photo.id})}); fetchAll() } }}
                                                                    className="adm-btn adm-btn-danger adm-btn-xs"
                                                                    style={{flex:1,justifyContent:'center'}}
                                                                >🗑 Del</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                                {photos.length === 0 && <div className="adm-empty">No photos in gallery. Add your first photo!</div>}
                            </div>
                        )}

                        {/* ── ANNOUNCEMENTS ── */}
                        {tab === 'Announcements' && (
                            <div className="adm-grid-2">
                                {anns.map(a => {
                                    const typeColor = a.type==='urgent'?{bg:'rgba(239,68,68,0.06)',border:'rgba(239,68,68,0.2)',icon:'🚨'}:a.type==='success'?{bg:'rgba(163,230,53,0.06)',border:'rgba(163,230,53,0.2)',icon:'✅'}:a.type==='warning'?{bg:'rgba(251,191,36,0.06)',border:'rgba(251,191,36,0.18)',icon:'⚠️'}:{bg:'rgba(96,165,250,0.06)',border:'rgba(96,165,250,0.18)',icon:'ℹ️'}
                                    return (
                                        <div key={a.id} className="adm-card" style={{borderColor:typeColor.border,background:`linear-gradient(135deg, ${typeColor.bg}, var(--surface))`}}>
                                            <div className="adm-card-header" style={{gap:'12px'}}>
                                                <div style={{display:'flex',alignItems:'center',gap:'10px',flex:1}}>
                                                    <span style={{fontSize:'22px',lineHeight:1}}>{typeColor.icon}</span>
                                                    <h3 style={{fontWeight:700,fontSize:'14px',color:'var(--text)'}}>{a.title}</h3>
                                                </div>
                                                <span className={`adm-status ${a.active?'adm-status-green':'adm-status-grey'}`}>{a.active?'● Active':'○ Inactive'}</span>
                                            </div>
                                            <div className="adm-card-body">
                                                <p style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.6}}>{a.message}</p>
                                                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'14px',borderTop:'1px solid var(--border)',marginTop:'14px'}}>
                                                    <span style={{fontSize:'11px',color:'var(--text3)'}}>{new Date(a.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                                                    <div style={{display:'flex',gap:'8px'}}>
                                                        <button onClick={async()=>{await api('/api/admin/announcements',{method:'PATCH',body:JSON.stringify({id:a.id,active:!a.active})});fetchAll()}} className={`adm-btn adm-btn-xs ${a.active?'adm-btn-ghost':'adm-btn-confirm'}`}>{a.active?'Deactivate':'Activate'}</button>
                                                        <button onClick={async()=>{if(confirm('Delete announcement?')){await api('/api/admin/announcements',{method:'DELETE',body:JSON.stringify({id:a.id})});fetchAll()}}} className="adm-btn adm-btn-danger adm-btn-xs">🗑 Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {anns.length === 0 && <div className="adm-empty" style={{gridColumn:'1/-1'}}>No announcements yet.</div>}
                            </div>
                        )}

                        {/* ── MESSAGES ── */}
                        {tab === 'Messages' && (
                            <div style={{display:'flex',flexDirection:'column',gap:'12px',maxWidth:'760px'}}>
                                {msgs.map(m => (
                                    <div key={m.id} className="adm-card" style={!m.read?{borderColor:'rgba(163,230,53,0.25)',boxShadow:'0 0 20px rgba(163,230,53,0.04)'}:{opacity:0.7}}>
                                        <div className="adm-card-header">
                                            <div style={{display:'flex',alignItems:'center',gap:'12px',flex:1}}>
                                                <div className="adm-avatar" style={{width:'36px',height:'36px',fontSize:'14px',background:'rgba(163,230,53,0.12)',color:'#a3e635'}}>{m.name.charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                                        <span style={{fontWeight:700,fontSize:'14px',color:'var(--text)'}}>{m.name}</span>
                                                        {!m.read && <span className="adm-status adm-status-green" style={{animation:'pulse 2s infinite'}}>● New</span>}
                                                    </div>
                                                    <div style={{fontSize:'12px',color:'#a3e635',marginTop:'1px'}}>{m.email}</div>
                                                </div>
                                            </div>
                                            <span style={{fontSize:'11px',color:'var(--text3)',flexShrink:0}}>{new Date(m.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                                        </div>
                                        <div className="adm-card-body">
                                            {m.subject && <div style={{fontWeight:700,fontSize:'13px',color:'var(--text2)',marginBottom:'8px',paddingBottom:'8px',borderBottom:'1px solid var(--border)'}}>{m.subject}</div>}
                                            <p style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.65,whiteSpace:'pre-wrap'}}>{m.message}</p>
                                            {!m.read && (
                                                <div style={{display:'flex',justifyContent:'flex-end',paddingTop:'12px',marginTop:'12px',borderTop:'1px solid var(--border)'}}>
                                                    <button onClick={async()=>{await api('/api/admin/messages',{method:'PATCH',body:JSON.stringify({id:m.id})});fetchAll()}} className="adm-btn adm-btn-confirm adm-btn-sm">✓ Mark as Read</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {msgs.length === 0 && <div className="adm-empty">No messages found.</div>}
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
                {modal === 'photo-edit' && editing && <PhotoEditModal photo={editing as unknown as {id:string;url:string;caption:string|null;tripName:string}} onClose={() => { setModal(null); setEditing(null) }} onSave={fetchAll} />}
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
        <Modal title={editing ? '✏️ Edit Trip' : '✈️ Create New Trip'} onClose={onClose}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
                <Field label="Trip Name *"><input className={inp} value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Banaras Vibes" /></Field>
                <Field label="Destination *"><input className={inp} value={form.destination} onChange={e => setForm({...form,destination:e.target.value})} placeholder="e.g. Varanasi, UP" /></Field>
                <Field label="Description" span2><textarea className="adm-textarea" value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Write a compelling trip description..." /></Field>
                <Field label="Price (₹)"><input className={inp} type="text" inputMode="numeric" value={form.price} onChange={e => setForm({...form,price:e.target.value.replace(/[^0-9]/g,'')})} placeholder="3000" /></Field>
                <Field label="Status">
                    <select className="adm-select" value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                        <option value="yet_to_announce">Yet to Announce</option>
                        <option value="coming_soon">Coming Soon</option>
                        <option value="booking_open">Booking Open</option>
                        <option value="completed">Completed</option>
                    </select>
                </Field>
                <Field label="Start Date"><input className={inp} style={{colorScheme:'dark'}} type="date" value={form.startDate} onChange={e => setForm({...form,startDate:e.target.value})} /></Field>
                <Field label="End Date"><input className={inp} style={{colorScheme:'dark'}} type="date" value={form.endDate} onChange={e => setForm({...form,endDate:e.target.value})} /></Field>
                <Field label="Total Slots"><input className={inp} type="text" inputMode="numeric" value={form.totalSlots} onChange={e => setForm({...form,totalSlots:e.target.value.replace(/[^0-9]/g,'')})} /></Field>
                <Field label="Booked Slots"><input className={inp} type="text" inputMode="numeric" value={form.bookedSlots} onChange={e => setForm({...form,bookedSlots:e.target.value.replace(/[^0-9]/g,'')})} /></Field>
                <Field label="Image URL" span2><input className={inp} value={form.imageUrl} onChange={e => setForm({...form,imageUrl:e.target.value})} placeholder="https://..." /></Field>
                <div style={{gridColumn:'1/-1'}} className="adm-checkbox-row">
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form,featured:e.target.checked})} />
                    <label htmlFor="featured">⭐ Feature this trip on the homepage</label>
                </div>
            </div>
            <div className="adm-modal-footer">
                <button onClick={onClose} className="adm-btn adm-btn-ghost">Cancel</button>
                <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary" style={{minWidth:'130px'}}>
                    {saving ? '⏳ Saving...' : editing ? '✓ Save Changes' : '✈️ Create Trip'}
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
        <Modal title={editing ? '✏️ Edit Blog Post' : '📝 Create Blog Post'} onClose={onClose}>
            <Field label="Post Title *"><input className={inp} value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Engaging title..." /></Field>
            <Field label="Content *"><textarea className="adm-textarea" style={{minHeight:'140px'}} value={form.content} onChange={e => setForm({...form,content:e.target.value})} placeholder="Write the post content here..." /></Field>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
                <Field label="Author"><input className={inp} value={form.author} onChange={e => setForm({...form,author:e.target.value})} /></Field>
                <Field label="Related Trip (Optional)"><input className={inp} value={form.tripName} onChange={e => setForm({...form,tripName:e.target.value})} placeholder="e.g. Manali Adventure" /></Field>
            </div>
            <Field label="Cover Image URL"><input className={inp} value={form.imageUrl} onChange={e => setForm({...form,imageUrl:e.target.value})} placeholder="https://..." /></Field>
            <div className="adm-checkbox-row">
                <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm({...form,published:e.target.checked})} />
                <label htmlFor="pub">🌐 Publish immediately (visible to public)</label>
            </div>
            <div className="adm-modal-footer">
                <button onClick={onClose} className="adm-btn adm-btn-ghost">Cancel</button>
                <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary" style={{minWidth:'130px'}}>
                    {saving ? '⏳ Saving...' : editing ? '✓ Save Post' : '📢 Publish Post'}
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
        <Modal title="🖼 Add Photo to Gallery" onClose={onClose}>
            <Field label="Photo URL *"><input className={inp} value={form.url} onChange={e => setForm({...form,url:e.target.value})} placeholder="https://..." /></Field>
            {form.url && (
                <div style={{borderRadius:'10px',overflow:'hidden',border:'1px solid var(--border)',height:'160px',marginBottom:'16px',background:'rgba(0,0,0,0.3)'}}>
                    <img src={form.url} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e => (e.currentTarget.style.display='none')} />
                </div>
            )}
            <Field label="Trip Name *"><input className={inp} value={form.tripName} onChange={e => setForm({...form,tripName:e.target.value})} placeholder="e.g. Banaras Vibes" /></Field>
            <Field label="Caption (Optional)"><input className={inp} value={form.caption} onChange={e => setForm({...form,caption:e.target.value})} placeholder="Brief description..." /></Field>
            <div className="adm-modal-footer">
                <button onClick={onClose} className="adm-btn adm-btn-ghost">Cancel</button>
                <button onClick={save} disabled={saving || !form.url || !form.tripName} className="adm-btn adm-btn-primary" style={{minWidth:'120px'}}>
                    {saving ? '⏳ Adding...' : '📸 Add Photo'}
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
        <Modal title="📢 Create Announcement" onClose={onClose}>
            <Field label="Title *"><input className={inp} value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Headline..." /></Field>
            <Field label="Message *"><textarea className="adm-textarea" value={form.message} onChange={e => setForm({...form,message:e.target.value})} placeholder="Detailed message..." /></Field>
            <Field label="Announcement Type">
                <select className="adm-select" value={form.type} onChange={e => setForm({...form,type:e.target.value})}>
                    <option value="info">ℹ️ Informational</option>
                    <option value="success">✅ Success / Milestone</option>
                    <option value="warning">⚠️ Warning / Changes</option>
                    <option value="urgent">🚨 Urgent / Alert</option>
                </select>
            </Field>
            <div className="adm-checkbox-row">
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({...form,active:e.target.checked})} />
                <label htmlFor="active">⚡ Set active immediately</label>
            </div>
            <div className="adm-modal-footer">
                <button onClick={onClose} className="adm-btn adm-btn-ghost">Cancel</button>
                <button onClick={save} disabled={saving || !form.title || !form.message} className="adm-btn adm-btn-primary" style={{minWidth:'160px'}}>
                    {saving ? '⏳ Publishing...' : '📢 Publish Announcement'}
                </button>
            </div>
        </Modal>
    )
}

// ── PHOTO EDIT MODAL ───────────────────────────────────────────
function PhotoEditModal({ photo, onClose, onSave }: { photo: {id:string;url:string;caption:string|null;tripName:string}; onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({ caption: photo.caption || '', tripName: photo.tripName, url: photo.url })
    const [saving, setSaving] = useState(false)

    const save = async () => {
        setSaving(true)
        await fetch('/api/admin/gallery', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: photo.id, ...form }) })
        setSaving(false); onSave(); onClose()
    }

    return (
        <Modal title="✏️ Edit Photo" onClose={onClose}>
            <div style={{borderRadius:'10px',overflow:'hidden',border:'1px solid var(--border)',height:'180px',marginBottom:'16px',background:'rgba(0,0,0,0.3)'}}>
                <img src={form.url} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e => (e.currentTarget.style.display='none')} />
            </div>
            <Field label="Image URL"><input className={inp} value={form.url} onChange={e => setForm({...form,url:e.target.value})} placeholder="https://..." /></Field>
            <Field label="Trip Name *"><input className={inp} value={form.tripName} onChange={e => setForm({...form,tripName:e.target.value})} placeholder="e.g. Banaras Vibes" /></Field>
            <Field label="Caption (Optional)"><input className={inp} value={form.caption} onChange={e => setForm({...form,caption:e.target.value})} placeholder="Add a caption..." /></Field>
            <div className="adm-modal-footer">
                <button onClick={onClose} className="adm-btn adm-btn-ghost">Cancel</button>
                <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary" style={{minWidth:'120px'}}>
                    {saving ? '⏳ Saving...' : '✓ Save Changes'}
                </button>
            </div>
        </Modal>
    )
}
