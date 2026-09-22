import Link from 'next/link';
import Image from 'next/image';

/**
 * Cinematic dark footer — identical to original index.html footer.
 * Server component (no client state needed).
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        <div className="footer-grid">
          {/* Column 1 — Brand */}
          <div>
            <a href="/" className="footer-logo-link"
              style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.2)', background: '#fff',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 0 15px rgba(255,255,255,0.1)',
              }}>
                <Image src="/logo.png" alt="QCFI Logo" width={50} height={50} style={{ borderRadius: '50%' }} />
              </div>
              QCFI Raurkela
            </a>

            <p className="text-body footer-desc"
              style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 300, marginBottom: '2rem' }}>
              Advancing industrial excellence and human resource potential through
              standardized quality concepts.
            </p>

            <div className="text-micro footer-micro-title" style={{ marginBottom: '1rem', color: 'white' }}>
              Global Network Matrix
            </div>
            <div className="social-terminal">
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="social-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* X */}
              <a href="#" aria-label="X" className="social-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733-16z"/>
                  <path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="social-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="social-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="social-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Index */}
          <div>
            <div className="text-micro" style={{ marginBottom: '1.5rem', color: 'white' }}>Index</div>
            <a href="/#about" className="footer-link">
              About Chapter
              <span className="footer-link-sub">Institutional Framework</span>
            </a>
            <Link href="/quality-concepts" className="footer-link">
              Quality Concepts
              <span className="footer-link-sub">TQM &amp; 5S Methodologies</span>
            </Link>
            <Link href="/quiz" className="footer-link">
              Knowledge Base
              <span className="footer-link-sub">Skill Assessment &amp; Tests</span>
            </Link>
            <Link href="/events" className="footer-link">
              Latest Events
              <span className="footer-link-sub">Conventions &amp; Workshops</span>
            </Link>
            <Link href="/magazine" className="footer-link">
              Publications
              <span className="footer-link-sub">Interactive 3D Magazines</span>
            </Link>
          </div>

          {/* Column 3 — System */}
          <div>
            <div className="text-micro" style={{ marginBottom: '1.5rem', color: 'white' }}>System</div>
            <a href="#" className="footer-link">
              Privacy Policy
              <span className="footer-link-sub">Data &amp; Compliance</span>
            </a>
            <a href="#" className="footer-link">
              Terms of Service
              <span className="footer-link-sub">Operational Guidelines</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; 2026 QCFI Raurkela Chapter. All Rights Reserved.</div>
          <div>QCFI / Raurkela / ODISHA / INDIA</div>
        </div>
      </div>
    </footer>
  );
}
