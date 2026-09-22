'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Glassmorphism floating navbar.
 * Smoothly transitions dimensions and backdrop on scroll via `.scrolled` class.
 * Secret admin access: 7 rapid taps anywhere on the navbar or logo → /admin/login
 */
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [secretFeedback, setSecretFeedback] = useState(false);

  const tapCount = useRef(0);
  const lastTapTime = useRef(0);
  const singleClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const registerTap = (e: React.MouseEvent | React.TouchEvent, isLogo = false) => {
    // If clicking on an actual navigation link, allow normal navigation
    const target = e.target as HTMLElement;
    if (target.closest('.nav-links a')) return;

    if (isLogo) {
      e.preventDefault();
    }

    const now = Date.now();
    if (now - lastTapTime.current < 900) {
      tapCount.current += 1;
    } else {
      tapCount.current = 1;
    }
    lastTapTime.current = now;

    if (singleClickTimer.current) {
      clearTimeout(singleClickTimer.current);
      singleClickTimer.current = null;
    }

    // Secret admin portal triggered!
    if (tapCount.current >= 7) {
      tapCount.current = 0;
      setSecretFeedback(true);
      window.location.href = '/admin/login';
      return;
    }

    // If single logo tap and no subsequent taps within 450ms, navigate home
    if (isLogo && tapCount.current === 1) {
      singleClickTimer.current = setTimeout(() => {
        if (pathname !== '/') {
          router.push('/');
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        tapCount.current = 0;
      }, 450);
    }
  };

  return (
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
      >
        <Image src="/logo.png" alt="QCFI Logo" width={34} height={34} priority />
        <span>QCFI RAURKELA</span>
      </a>

      <ul className="nav-links">
        <li><a href="/#about">About</a></li>
        <li><Link href="/quality-concepts">Quality Concepts</Link></li>
        <li><Link href="/events">Events</Link></li>
        <li><Link href="/magazine">Magazines</Link></li>
        <li><Link href="/quiz">Quiz</Link></li>
      </ul>
    </header>
  );
}
