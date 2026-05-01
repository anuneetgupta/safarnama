'use client'

import { useState, useEffect } from 'react'
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
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

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
        .nav-link:hover {
          color: #f0f4e8;
        }
        .nav-link.active {
          color: #a3e635;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #a3e635;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
          border-radius: 2px;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .nav-link.active::after {
          transform: scaleX(1);
          background: #a3e635;
        }
      `}</style>

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 72,
          background: isScrolled ? 'rgba(2,8,23,0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          borderBottom: isScrolled ? '1px solid rgba(163,230,53,0.15)' : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          className="container"
          style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Safarnama" style={{ height: 40, width: 'auto' }} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop" style={{ alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="nav-actions-desktop" style={{ alignItems: 'center', gap: 12 }}>
            {session?.user ? (
              <>
                <Link href="/dashboard" className="btn btn-sm btn-ghost">Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-sm btn-secondary">
                  Sign Out
                </button>
              </>
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              width: 40,
              height: 40,
              background: 'rgba(163,230,53,0.06)',
              border: '1px solid rgba(163,230,53,0.15)',
              borderRadius: 8,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span style={{
              display: 'block', width: 20, height: 2, borderRadius: 2,
              background: '#a3e635',
              transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              transition: 'transform 0.25s ease',
            }} />
            <span style={{
              display: 'block', width: 20, height: 2, borderRadius: 2,
              background: '#a3e635',
              opacity: mobileMenuOpen ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }} />
            <span style={{
              display: 'block', width: 20, height: 2, borderRadius: 2,
              background: '#a3e635',
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              transition: 'transform 0.25s ease',
            }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 72,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 49,
            background: 'rgba(2,8,23,0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '24px 0 40px',
          }}
        >
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            {/* Nav Links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: pathname === link.href ? '#f0f4e8' : 'rgba(200,220,155,0.7)',
                  background: pathname === link.href ? 'rgba(163,230,53,0.08)' : 'transparent',
                  border: `1px solid ${pathname === link.href ? 'rgba(163,230,53,0.2)' : 'transparent'}`,
                }}
              >
                {link.name}
                <svg width="16" height="16" style={{ opacity: 0.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(163,230,53,0.1)', margin: '12px 0' }} />

            {/* Auth Buttons */}
            {session?.user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/dashboard" style={mobileBtnStyle}>Dashboard</Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ ...mobileBtnStyle, color: '#f87171', borderColor: 'rgba(239,68,68,0.25)', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/auth/login" style={{ ...mobileBtnStyle, color: 'rgba(200,220,155,0.8)', borderColor: 'rgba(163,230,53,0.25)' }}>
                  Sign In
                </Link>
                <Link href="/auth/register" style={{ ...mobileBtnStyle, color: '#050c05', background: '#a3e635', borderColor: '#a3e635', fontWeight: 700 }}>
                  Get Started — Free
                </Link>
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
