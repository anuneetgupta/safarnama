'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Trips', href: '/trips' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Reviews', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userFullName = session?.user?.name ?? 'Traveler'
  const userName     = userFullName.split(' ')[0]
  const userEmail    = session?.user?.email ?? ''
  const userAvatar   = session?.user?.image ?? null
  const initials     = userFullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-actions-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-actions-desktop { display: none; }
          .nav-hamburger { display: flex; }
        }
        .nav-link {
          position: relative;
          color: rgba(226,232,240,0.7);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s ease;
          padding: 8px 0;
        }
        .nav-link:hover { color: #f0f4e8; }
        .nav-link.active { color: #a3e635; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 2px;
          background: #a3e635;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
          border-radius: 2px;
        }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }
        .nav-link.active::after { transform: scaleX(1); background: #a3e635; }

        /* Profile dropdown animation */
        @keyframes navFadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-dropdown {
          animation: navFadeDown 0.15s ease;
        }
        .nav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(180,200,140,0.7);
          font-size: 13px;
          font-weight: 600;
          transition: all 0.15s;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .nav-dropdown-item:hover {
          background: rgba(132,204,22,0.07);
          color: #a3e635;
        }
        .nav-dropdown-item.danger { color: #f87171; }
        .nav-dropdown-item.danger:hover { background: rgba(239,68,68,0.08); color: #f87171; }
      `}</style>

      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          height: 72,
          background: isScrolled ? 'rgba(2,8,23,0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          borderBottom: isScrolled ? '1px solid rgba(163,230,53,0.15)' : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Safarnama" style={{ height: 40, width: 'auto' }} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop" style={{ alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.name} href={link.href} className={`nav-link ${pathname === link.href ? 'active' : ''}`}>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="nav-actions-desktop" style={{ alignItems: 'center', gap: 12 }}>
            {session?.user ? (
              /* ── Profile dropdown ── */
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '7px 13px 7px 7px',
                    background: profileOpen ? 'rgba(163,230,53,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${profileOpen ? 'rgba(163,230,53,0.35)' : 'rgba(163,230,53,0.18)'}`,
                    borderRadius: 50,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  {/* Avatar */}
                  <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {userAvatar
                      ? <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#a3e635,#d4a843)', fontWeight: 800, fontSize: 11, color: '#050c05' }}>{initials}</div>
                    }
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(240,244,232,0.9)' }}>{userName}</span>
                  <svg width="13" height="13" fill="none" stroke="rgba(163,230,53,0.6)" strokeWidth="2.5" viewBox="0 0 24 24"
                    style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="nav-dropdown" style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    minWidth: 228,
                    background: 'rgba(5,12,5,0.98)',
                    border: '1px solid rgba(132,204,22,0.2)',
                    borderRadius: 16,
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    overflow: 'hidden',
                    zIndex: 200,
                  }}>
                    {/* Header */}
                    <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(132,204,22,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(163,230,53,0.25)', flexShrink: 0 }}>
                        {userAvatar
                          ? <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#a3e635,#d4a843)', fontWeight: 800, fontSize: 13, color: '#050c05' }}>{initials}</div>
                        }
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: 'white', fontWeight: 700, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userFullName}</p>
                        <p style={{ color: 'rgba(180,200,140,0.4)', fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: '6px' }}>
                      <Link href="/dashboard" className="nav-dropdown-item" onClick={() => setProfileOpen(false)}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Dashboard
                      </Link>
                      <Link href="/dashboard/profile" className="nav-dropdown-item" onClick={() => setProfileOpen(false)}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        My Profile
                      </Link>
                      <Link href="/trips" className="nav-dropdown-item" onClick={() => setProfileOpen(false)}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                        Browse Trips
                      </Link>
                    </div>

                    {/* Sign out */}
                    <div style={{ padding: '6px', borderTop: '1px solid rgba(132,204,22,0.07)' }}>
                      <button className="nav-dropdown-item danger" onClick={() => { setProfileOpen(false); signOut({ callbackUrl: '/' }) }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-sm btn-ghost">Sign In</Link>
                <Link href="/auth/register" className="btn btn-sm btn-primary">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
              width: 40, height: 40,
              background: 'rgba(163,230,53,0.06)',
              border: '1px solid rgba(163,230,53,0.15)',
              borderRadius: 8, cursor: 'pointer', padding: 0,
            }}
          >
            <span style={{ display: 'block', width: 20, height: 2, borderRadius: 2, background: '#a3e635', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transition: 'transform 0.25s ease' }} />
            <span style={{ display: 'block', width: 20, height: 2, borderRadius: 2, background: '#a3e635', opacity: mobileMenuOpen ? 0 : 1, transition: 'opacity 0.2s ease' }} />
            <span style={{ display: 'block', width: 20, height: 2, borderRadius: 2, background: '#a3e635', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transition: 'transform 0.25s ease' }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, bottom: 0,
          zIndex: 49,
          background: 'rgba(2,8,23,0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
          padding: '24px 0 40px',
        }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.name} href={link.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 12,
                fontSize: 16, fontWeight: 500, textDecoration: 'none',
                color: pathname === link.href ? '#f0f4e8' : 'rgba(200,220,155,0.7)',
                background: pathname === link.href ? 'rgba(163,230,53,0.08)' : 'transparent',
                border: `1px solid ${pathname === link.href ? 'rgba(163,230,53,0.2)' : 'transparent'}`,
              }}>
                {link.name}
                <svg width="16" height="16" style={{ opacity: 0.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}

            <div style={{ height: 1, background: 'rgba(163,230,53,0.1)', margin: '12px 0' }} />

            {session?.user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Mobile user info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(163,230,53,0.05)', border: '1px solid rgba(163,230,53,0.12)', borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {userAvatar
                      ? <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#a3e635,#d4a843)', fontWeight: 800, fontSize: 14, color: '#050c05' }}>{initials}</div>
                    }
                  </div>
                  <div>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{userFullName}</p>
                    <p style={{ color: 'rgba(180,200,140,0.4)', fontSize: 12 }}>{userEmail}</p>
                  </div>
                </div>
                <Link href="/dashboard" style={mobileBtnStyle}>Dashboard</Link>
                <Link href="/dashboard/profile" style={mobileBtnStyle}>My Profile</Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ ...mobileBtnStyle, color: '#f87171', borderColor: 'rgba(239,68,68,0.25)', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/auth/login" style={{ ...mobileBtnStyle, color: 'rgba(200,220,155,0.8)', borderColor: 'rgba(163,230,53,0.25)' }}>Sign In</Link>
                <Link href="/auth/register" style={{ ...mobileBtnStyle, color: '#050c05', background: '#a3e635', borderColor: '#a3e635', fontWeight: 700 }}>Get Started — Free</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const mobileBtnStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  padding: '14px 20px',
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 600,
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f0f4e8',
  background: 'rgba(255,255,255,0.05)',
  width: '100%',
  textDecoration: 'none',
}
