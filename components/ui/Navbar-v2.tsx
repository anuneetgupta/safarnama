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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[rgba(2,8,23,0.95)] backdrop-blur-md border-b border-[rgba(163,230,53,0.1)]'
          : 'bg-transparent border-b border-[rgba(163,230,53,0.05)]'
      }`}
      style={{ height: '72px' }}
    >
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.png" alt="Safarnama" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-14px font-500 transition-colors duration-300 ${
                pathname === link.href
                  ? 'text-[#a3e635]'
                  : 'text-[rgba(226,232,240,0.7)] hover:text-[#a3e635]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-16px">
          {session?.user ? (
            <div className="flex items-center gap-16px">
              <Link href="/dashboard" className="btn btn-sm btn-ghost">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-sm btn-secondary"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-16px">
              <Link href="/auth/login" className="btn btn-sm btn-ghost">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-sm btn-primary">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-6px w-24px h-24px justify-center"
          >
            <span
              className={`h-0.5 w-full bg-[#a3e635] transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''
              }`}
            />
            <span
              className={`h-0.5 w-full bg-[#a3e635] transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-0.5 w-full bg-[#a3e635] transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-72px left-0 right-0 bg-[rgba(2,8,23,0.98)] border-b border-[rgba(163,230,53,0.1)] backdrop-blur-md">
          <div className="container py-24px flex flex-col gap-16px">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-16px font-500 transition-colors duration-300 ${
                  pathname === link.href
                    ? 'text-[#a3e635]'
                    : 'text-[rgba(226,232,240,0.7)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
