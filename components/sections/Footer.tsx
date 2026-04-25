'use client'

import Link from 'next/link'

const FOOTER_LINKS = {
  product: [
    { name: 'Home', href: '/' },
    { name: 'Trips', href: '/trips' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Reviews', href: '/blog' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '#' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Cookies', href: '#' },
    { name: 'License', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'rgba(163, 230, 53, 0.1)',
        background: '#050c05',
      }}
    >
      <div className="container py-64px">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-48px mb-48px">
          {/* Brand */}
          <div>
            <img src="/logo.png" alt="Safarnama" className="h-10 w-auto mb-16px" />
            <p className="text-14px text-[rgba(226,232,240,0.5)]">
              India's leading student travel platform. Curated group trips, budget-friendly pricing, unforgettable memories.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-14px font-600 text-[#a3e635] mb-16px uppercase tracking-wide">
              Product
            </h4>
            <div className="flex flex-col gap-12px">
              {FOOTER_LINKS.product.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-14px text-[rgba(226,232,240,0.5)] hover:text-[#a3e635] transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-14px font-600 text-[#a3e635] mb-16px uppercase tracking-wide">
              Company
            </h4>
            <div className="flex flex-col gap-12px">
              {FOOTER_LINKS.company.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-14px text-[rgba(226,232,240,0.5)] hover:text-[#a3e635] transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-14px font-600 text-[#a3e635] mb-16px uppercase tracking-wide">
              Legal
            </h4>
            <div className="flex flex-col gap-12px">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-14px text-[rgba(226,232,240,0.5)] hover:text-[#a3e635] transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          className="pt-24px flex flex-col md:flex-row justify-between items-center gap-16px"
          style={{ borderTop: '1px solid rgba(163, 230, 53, 0.08)' }}
        >
          <p className="text-12px text-[rgba(226,232,240,0.3)]">
            © 2026 Safarnama. All rights reserved.
          </p>
          <div className="flex items-center gap-16px">
            <p className="text-12px text-[rgba(226,232,240,0.3)]">
              Made with ❤️ for student travelers across India
            </p>
            <Link
              href="/admin"
              className="text-10px text-[rgba(163,230,53,0.3)] hover:text-[rgba(163,230,53,0.6)] transition-colors duration-300"
              title="Admin Access"
            >
              •
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
