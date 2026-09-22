import Link from 'next/link';

/**
 * Fixed top-left glassmorphism back button — used on all sub-pages.
 */
export default function EliteBackBtn({ href = '/', label = 'Back to Hub' }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="elite-back-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, transition: 'transform 0.4s' }}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      {label}
    </Link>
  );
}
