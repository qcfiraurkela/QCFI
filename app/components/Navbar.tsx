'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Glassmorphism floating navbar with responsive mobile drawer.
 * Supports touch devices, keyboard navigation, and secret admin access.
 */
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [secretFeedback, setSecretFeedback] = useState(false);

  const tapCount = useRef(0);
  const lastTapTime = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const registerTap = (e: React.MouseEvent | React.TouchEvent, isLogo = false) => {
    const target = e.target as HTMLElement;
    if (target.closest('.nav-links a') || target.closest('.mobile-nav-link') || target.closest('.hamburger-btn')) {
      return;
    }

    if (isLogo) e.preventDefault();

    const now = Date.now();
    if (now - lastTapTime.current < 900) {
      tapCount.current += 1;
    } else {
      tapCount.current = 1;
    }
    lastTapTime.current = now;

    // Secret admin portal triggered!
    if (tapCount.current >= 7) {
      tapCount.current = 0;
      setSecretFeedback(true);
      window.location.href = '/admin/login';
      return;
    }

    // Single logo click → scroll to top / go home
    if (isLogo) {
      if (pathname !== '/') {
        router.push('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'About', href: '/#about' },
    { label: 'Quality Concepts', href: '/quality-concepts' },
    { label: 'Events', href: '/events' },
    { label: 'Magazines', href: '/magazine' },
    { label: 'Quiz', href: '/quiz' },
  ];

  return (
    <>
      <header
        id="navbar"
        className={`glass-nav ${scrolled ? 'scrolled' : ''} ${secretFeedback ? 'secret-pulse' : ''}`}
        onClick={(e) => registerTap(e, false)}
      >
        <a
          href="/"
          className={`nav-logo ${secretFeedback ? 'secret-pulse' : ''}`}
          id="qcfi-logo"
          onClick={(e) => registerTap(e, true)}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
          title="QCFI Raurkela"
          aria-label="QCFI Raurkela Home"
        >
          <Image src="/logo.png" alt="QCFI Logo" width={34} height={34} priority />
          <span>QCFI RAURKELA</span>
        </a>

        {/* Desktop navigation links */}
        <ul className="nav-links desktop-nav" aria-label="Main Navigation">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={pathname === item.href ? 'active-link' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-menu-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav
        className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <Image src="/logo.png" alt="QCFI Logo" width={30} height={30} />
            <span>QCFI RAURKELA</span>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="mobile-nav-list">
          {navItems.map((item, idx) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mobile-link-num">0{idx + 1}</span>
                <span className="mobile-link-label">{item.label}</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mobile-drawer-footer">
          <span className="text-micro" style={{ color: 'var(--accent)' }}>Institutional Chapter</span>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
            Raurkela, Odisha, India
          </p>
        </div>
      </nav>
    </>
  );
}