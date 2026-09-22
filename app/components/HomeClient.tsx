'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type {
  HeroImageRow,
  MagazineRow,
  ConceptWithImages,
} from '@/lib/supabase-db';

/* ─────────────────────────────────────────────────
   HERO SVG — Industrial Precision Diagram
───────────────────────────────────────────────── */
function IndustrySVG() {
  return (
    <svg
      className="industry-core-svg"
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Industrial precision hardware and quality control visualization"
    >
      <defs>
        <radialGradient id="industryField" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1D45ED" stopOpacity="0.13" />
          <stop offset="48%" stopColor="#1D45ED" stopOpacity="0.045" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="machineFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="52%" stopColor="#F2F5FF" />
          <stop offset="100%" stopColor="#DDE5FF" />
        </linearGradient>
        <linearGradient id="inspectionBlue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1D45ED" stopOpacity="0" />
          <stop offset="50%" stopColor="#1D45ED" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1D45ED" stopOpacity="0" />
        </linearGradient>
        <filter id="machineGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="machineShadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="#081738" floodOpacity="0.14" />
        </filter>
      </defs>

      <circle cx="400" cy="400" r="335" fill="url(#industryField)" className="industry-field" />

      <g className="industry-orbit">
        <circle cx="400" cy="400" r="300" fill="none" stroke="#081738" strokeOpacity="0.09" strokeWidth="1" />
        <circle cx="400" cy="400" r="270" fill="none" stroke="#1D45ED" strokeOpacity="0.23" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="400" cy="400" r="225" fill="none" stroke="#081738" strokeOpacity="0.08" strokeWidth="1" />
      </g>
      <g className="industry-orbit-reverse">
        <path d="M400 84v34 M400 682v34 M84 400h34 M682 400h34" stroke="#081738" strokeWidth="3" strokeLinecap="round" />
        <path d="M623 177l-13 13 M623 623l-13-13 M177 623l13-13 M177 177l13 13" stroke="#081738" strokeWidth="1.5" strokeOpacity="0.5" />
      </g>

      <g fill="none" stroke="#1D45ED" strokeOpacity="0.38" strokeWidth="1">
        <path d="M205 156h390 M205 644h390" /><path d="M205 146v20 M595 146v20 M205 634v20 M595 634v-20" />
      </g>
      <g fill="#081738" opacity="0.48" className="quality-label">
        <text x="250" y="143">PRECISION / 01</text>
        <text x="450" y="663">QC-METROLOGY</text>
      </g>

      <g className="tooling-ring">
        <circle cx="400" cy="400" r="185" fill="none" stroke="#081738" strokeOpacity="0.13" strokeWidth="2" />
        <circle cx="400" cy="400" r="170" fill="none" stroke="#1D45ED" strokeOpacity="0.26" strokeWidth="1.5" strokeDasharray="7 9" />
        <circle cx="400" cy="400" r="142" fill="none" stroke="#081738" strokeOpacity="0.10" strokeWidth="1" />
      </g>
      <g fill="#1D45ED">
        {[0,1,2,3,4,5,6,7].map((i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const r = 186;
          const cx = 400 + r * Math.sin(angle);
          const cy = 400 - r * Math.cos(angle);
          return <circle key={i} cx={cx} cy={cy} r="4" />;
        })}
      </g>

      <g className="machine-core" filter="url(#machineShadow)">
        <circle cx="400" cy="400" r="128" fill="#FFFFFF" fillOpacity="0.86" stroke="#081738" strokeOpacity="0.16" strokeWidth="2" />
        <circle cx="400" cy="400" r="116" fill="url(#machineFace)" stroke="#1D45ED" strokeWidth="2" />
        <g className="gear-rotate">
          <path d="M0-104 L12-104 L17-118 L31-113 L34-99 L52-94 L61-106 L73-98 L67-82 L83-72 L98-78 L105-65 L92-52 L101-34 L116-30 L114-15 L99-11 L104 8 L118 13 L113 28 L98 31 L93 50 L106 60 L98 73 L82 67 L72 83 L78 98 L65 105 L52 92 L34 101 L30 116 L15 114 L11 99 L-8 104 L-13 118 L-28 113 L-31 98 L-50 93 L-60 106 L-73 98 L-67 82 L-83 72 L-98 78 L-105 65 L-92 52 L-101 34 L-116 30 L-114 15 L-99 11 L-104-8 L-118-13 L-113-28 L-98-31 L-93-50 L-106-60 L-98-73 L-82-67 L-72-83 L-78-98 L-65-105 L-52-92 L-34-101 L-30-116 L-15-114 L-11-99 Z"
            fill="#081738" fillOpacity="0.08" stroke="#081738" strokeOpacity="0.18" strokeWidth="1.5" transform="translate(400 400)" />
          <circle cx="400" cy="400" r="82" fill="#FFFFFF" fillOpacity="0.84" stroke="#1D45ED" strokeOpacity="0.35" strokeWidth="2" />
          <circle cx="400" cy="400" r="67" fill="none" stroke="#081738" strokeOpacity="0.16" strokeWidth="2" />
          <circle cx="400" cy="400" r="50" fill="none" stroke="#1D45ED" strokeOpacity="0.24" strokeWidth="1.5" strokeDasharray="3 7" />
        </g>
        <g transform="translate(400 400)">
          <circle r="18" fill="#FFFFFF" stroke="#1D45ED" strokeWidth="1.5" strokeOpacity="0.2">
            <animate attributeName="r" values="18;24;18" dur="4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle r="12" fill="#F6F8FF" stroke="#1D45ED" strokeWidth="1.5" />
          <path d="M-4 0.5 L-1.5 3.5 L4.5 -3" fill="none" stroke="#1D45ED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      <g className="data-points">
        <circle cx="181" cy="350" r="3" fill="#1D45ED" /><circle cx="619" cy="350" r="3" fill="#1D45ED" />
        <circle cx="181" cy="450" r="3" fill="#1D45ED" /><circle cx="619" cy="450" r="3" fill="#1D45ED" />
        <circle cx="310" cy="205" r="3" fill="#081738" fillOpacity="0.4" />
        <circle cx="490" cy="595" r="3" fill="#081738" fillOpacity="0.4" />
      </g>
      <g fill="none" stroke="#081738" strokeOpacity="0.25" strokeWidth="1">
        <path d="M225 282H150V245" /><path d="M575 282H650V245" />
        <path d="M225 518H150V555" /><path d="M575 518H650V555" />
      </g>
      <g className="quality-label" fill="#081738" opacity="0.56">
        <text x="110" y="237">INPUT</text><text x="648" y="237">PROCESS</text>
        <text x="105" y="574">INSPECT</text><text x="648" y="574">OUTPUT</text>
      </g>
      <g className="quality-scan">
        <rect x="126" y="398" width="548" height="4" rx="2" fill="url(#inspectionBlue)" filter="url(#machineGlow)" />
        <path d="M126 390l20 10-20 10z" fill="#1D45ED" />
        <path d="M674 390l-20 10 20 10z" fill="#1D45ED" />
      </g>
      <g stroke="#081738" strokeLinecap="round" opacity="0.5">
        <path d="M120 120h34 M120 120v34" /><path d="M680 120h-34 M680 120v34" />
        <path d="M120 680h34 M120 680v-34" /><path d="M680 680h-34 M680 680v-34" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────
   MAIN CLIENT COMPONENT
───────────────────────────────────────────────── */
export default function HomeClient() {
  const [heroImages, setHeroImages] = useState<HeroImageRow[]>([]);
  const [magazines, setMagazines] = useState<MagazineRow[]>([]);
  const [conceptData, setConceptData] = useState<ConceptWithImages[]>([]);
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/hero').then(r => r.json()).then(setHeroImages).catch(() => {});
      fetch('/api/magazines').then(r => r.json()).then(setMagazines).catch(() => {});
      fetch('/api/concepts').then(r => r.json()).then(setConceptData).catch(() => {});
      fetch('/api/quizzes').then(r => r.json()).then((d) => setQuizCount(d.length)).catch(() => {});
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);
  /* ── 3D Gallery state ── */
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isPlaying, setIsPlaying]       = useState(true);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const galleryRef  = useRef<HTMLDivElement>(null);

  /* ── FAQ state ── */
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const opts = { threshold: 0.05, rootMargin: '50px 0px 50px 0px' };
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      });
    }, opts);
    document.querySelectorAll('.reveal-up,.reveal,.reveal-3d').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Gallery autoplay ── */
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setGalleryIndex(i => (i + 1) % heroImages.length);
    }, 3500);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroImages.length > 0 && isPlaying) startAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [isPlaying, heroImages.length, startAutoplay]);

  const moveNext = useCallback(() => {
    setGalleryIndex(i => (i + 1) % heroImages.length);
    if (isPlaying) startAutoplay();
  }, [heroImages.length, isPlaying, startAutoplay]);

  const movePrev = useCallback(() => {
    setGalleryIndex(i => (i - 1 + heroImages.length) % heroImages.length);
    if (isPlaying) startAutoplay();
  }, [heroImages.length, isPlaying, startAutoplay]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 45) {
      movePrev();
    } else if (deltaX < -45) {
      moveNext();
    }
    touchStartX.current = null;
  };
  const getCardClass = (idx: number) => {
    if (idx === galleryIndex) return 'gallery-card-3d active';
    if (idx === galleryIndex - 1 || (galleryIndex === 0 && idx === heroImages.length - 1)) return 'gallery-card-3d prev';
    if (idx === galleryIndex + 1 || (galleryIndex === heroImages.length - 1 && idx === 0)) return 'gallery-card-3d next';
    if (idx < galleryIndex) return 'gallery-card-3d hidden-left';
    return 'gallery-card-3d hidden-right';
  };

  /* ── Concepts marquee - powered by pure GPU-accelerated CSS marquee ── */

  const faqs = [
    { q: '01. What is a Quality Circle?', a: 'A Quality Circle is a volunteer group composed of workers who usually work under the same supervisor and meet regularly to identify, analyze, and solve work-related problems to improve performance.' },
    { q: '02. How can I join QCFI Raurkela?', a: 'You can join by becoming an individual or institutional member. Membership integrates you into a vast network of quality professionals and grants access to exclusive training modules.' },
    { q: '03. What are the benefits of 5S?', a: '5S methodology establishes a framework for workplace organization, reducing systematic waste, enhancing occupational safety, and boosting overall operational productivity.' },
    { q: '04. What is Kaizen?', a: 'Kaizen refers to business activities that continuously improve all functions and involve all employees from the CEO to the assembly line workers. It translates to "change for the better."' },
    { q: '05. Are conventions mandatory for members?', a: 'While not mandatory, participating in Chapter and National Conventions is highly recommended. It offers a platform to present case studies, gain recognition, and observe industry-leading benchmarks.' },
  ];

  return (
    <main className="industrial-grid">

      {/* ═══════════════════════════════════════════
          01. HERO
      ═══════════════════════════════════════════ */}
      <section className="hero" style={{
        position: 'relative', height: '100svh', minHeight: 600,
        backgroundColor: '#FAFCFF', display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--border-light)', overflow: 'hidden', paddingTop: '7rem',
      }}>
      {/* Hero mesh + aura defined in globals.css — .hero::before / .hero::after */}

        {/* Corners */}
        <div className="hero-corner corner-tl"><div className="corner-cross" /></div>
        <div className="hero-corner corner-tr"><div className="corner-cross" /></div>
        <div className="hero-corner corner-bl"><div className="corner-cross" /><div className="corner-text">LAT_22.24°N</div></div>
        <div className="hero-corner corner-br"><div className="corner-cross" /></div>

        <div className="container hero-grid-layout" style={{
          display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '4rem',
          alignItems: 'center', width: '100%', position: 'relative', zIndex: 2,
        }}>
          {/* Left */}
          <div className="hero-left-content reveal-up is-visible" style={{ maxWidth: 580 }}>
            <span className="eyebrow">[ Quality Circle Forum Of India ]</span>
            <h1 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem,5vw,5.2rem)',
              lineHeight: 1.05, fontWeight: 400, letterSpacing: '-0.02em',
              color: 'var(--text-dark)', marginBottom: '1.5rem',
            }}>
              <span style={{ display: 'block', paddingBottom: '0.1rem' }}>Raurkela Chapter</span>
              <span style={{
                display: 'inline-block', fontStyle: 'italic',
                background: 'linear-gradient(120deg,var(--accent) 0%,#5C83FF 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', paddingRight: '0.2em',
              }}>Engineering</span>
              <span style={{ display: 'block' }}>Excellence.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem,1.2vw,1.15rem)', color: '#4A5568', maxWidth: 420, marginBottom: '2.5rem', fontWeight: 400, lineHeight: 1.6 }}>
              Driving deep core industrial methodologies and fostering total quality management for
              optimal operational output across the region.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="#about" className="ios-btn-primary">
                About Us
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a href="#contact" className="ios-btn-secondary">Contact Us</a>
            </div>
          </div>

          {/* Right — SVG */}
          <div className="hero-right-visual reveal-3d delay-200 is-visible" style={{ position: 'relative', width: '100%', height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1200, transformStyle: 'preserve-3d' }}>
            <div style={{ position: 'absolute', width: 430, height: 430, borderRadius: '50%', background: 'radial-gradient(circle,rgba(29,69,237,.11) 0%,rgba(29,69,237,.045) 34%,transparent 72%)', filter: 'blur(3px)', pointerEvents: 'none' }} />
            <IndustrySVG />
          </div>
        </div>

        {/* Scroll Indicator */}
        <a href="#about" className="hero-scroll-indicator">
          <div className="scroll-ring"><div className="scroll-dot" /></div>
          <span>SCROLL</span>
        </a>
      </section>

      {/* ═══════════════════════════════════════════
          02. ABOUT US
      ═══════════════════════════════════════════ */}
      <section id="about" className="section-spacing">
        <div className="container split-grid">
          <div className="reveal-3d">
            <span className="eyebrow">[ 01 / About Us ]</span>
            <h2 className="font-mixed" style={{ marginBottom: '2rem' }}>
              Engineering <br /><span className="serif-italic">continuous</span> improvement.
            </h2>
            <p className="text-body" style={{ marginBottom: '1.5rem' }}>
              Welcome to the Quality Circle Forum of India (QCFI) Raurkela Chapter. We are dedicated to
              promoting and implementing quality concepts across industries and educational institutions
              in our region.
            </p>
            <p className="text-body">
              Our goal is to foster a culture of continuous improvement, setting the benchmark for
              operational excellence.
            </p>
          </div>
          <div className="about-image-wrapper reveal-3d delay-200">
            <div className="cinematic-corner top-left" />
            <div className="cinematic-corner bottom-right" />
            <div className="cinematic-cross" />
            <div className="industrial-frame">
              <img src="/qcfi_rkl.png" alt="QCFI Raurkela Chapter building" className="industrial-img-inner" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          03. ABOUT QCFI
      ═══════════════════════════════════════════ */}
      <section className="section-spacing">
        <div className="container split-grid">
          <div className="about-image-wrapper reveal-3d">
            <div className="cinematic-corner top-left" />
            <div className="cinematic-corner bottom-right" />
            <div className="cinematic-cross" />
            <div className="industrial-frame dark-frame">
              <img src="/about_qcfi.png" alt="QCFI national organization overview" className="industrial-img-inner" loading="lazy" />
            </div>
          </div>
          <div className="reveal-3d delay-200">
            <span className="eyebrow">[ 02 / About QCFI ]</span>
            <h2 className="font-mixed" style={{ marginBottom: '2rem' }}>
              <span className="serif-italic">Total</span> Quality Management.
            </h2>
            <p className="text-body">
              QCFI is recognized as the institution representing The Quality Circle Movement in India.
              We conduct highly specialized training programs, technical workshops, and conventions to
              share best practices and develop leadership skills focusing on TQM methodologies.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          03.5. 3D PHOTO GALLERY
      ═══════════════════════════════════════════ */}
      <section className="section-spacing" style={{ borderTop: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <div className="container reveal-up">
          <div style={{ marginBottom: '1rem' }}>
            <span className="eyebrow">[ 03 / Visual Archives ]</span>
            <h2 className="font-mixed" style={{ lineHeight: 1.1 }}>
              Our <span className="serif-italic">Photo Gallery.</span>
            </h2>
          </div>

          <div
            className="gallery-3d-container"
            id="gallery-container"
            ref={galleryRef}
            onMouseEnter={() => { if (isPlaying && autoplayRef.current) clearInterval(autoplayRef.current); }}
            onMouseLeave={() => { if (isPlaying) startAutoplay(); }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button className="carousel-btn" style={{ left: '5%', zIndex: 30 }} onClick={movePrev} aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="carousel-btn" style={{ right: '5%', zIndex: 30 }} onClick={moveNext} aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div className="gallery-track-3d">
              {heroImages.length > 0 ? heroImages.map((img, idx) => (
                <div
                  key={img.id}
                  className={getCardClass(idx)}
                  onClick={() => { if (idx !== galleryIndex) { setGalleryIndex(idx); if (isPlaying) startAutoplay(); } }}
                >
                  <div className="gallery-img-wrapper">
                    <img src={`/${img.image_path}`} alt={`Gallery photo ${idx + 1}`} loading={idx === 0 ? 'eager' : 'lazy'} />
                  </div>
                  {/* Glass Controls (visible only on active) */}
                  <div className="gallery-glass-controls">
                    <button className="g-btn" onClick={movePrev} aria-label="Prev">
                      <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button className="g-btn g-play" aria-label="Toggle play" onClick={e => { e.stopPropagation(); setIsPlaying(p => !p); }}>
                      {isPlaying
                        ? <svg viewBox="0 0 24 24" className="pause-icon"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        : <svg viewBox="0 0 24 24" className="play-icon"><path d="M8 5v14l11-7z" /></svg>}
                    </button>
                    <div className="g-dots-container">
                      {heroImages.map((_, di) => (
                        <div key={di} className={`g-dot${di === galleryIndex ? ' active' : ''}`} />
                      ))}
                    </div>
                    <button className="g-btn" onClick={moveNext} aria-label="Next">
                      <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568', borderRadius: 24, border: '1px solid var(--border-light)' }}>
                  No images in gallery repository.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          04. MAGAZINES
      ═══════════════════════════════════════════ */}
      <section id="magazine-section" className="section-spacing" style={{
        background: 'linear-gradient(180deg,var(--bg-primary) 0%,var(--bg-secondary) 100%)',
        borderTop: '1px solid var(--border-light)', padding: '100px 0',
      }}>
        <div className="container reveal-up">
          <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span className="eyebrow eyebrow-center">[ 04 / Periodicals & Publications ]</span>
            <h2 className="font-mixed">Our <span className="serif-italic">Magazines.</span></h2>
            <p className="text-body" style={{ maxWidth: 580, margin: '1rem auto 0' }}>
              Explore our flagship publications covering industrial quality circles, regional conclaves, and continuous improvement case studies.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4rem' }}>
            {magazines.length > 0 ? magazines.map((mag, i) => (
              <div key={mag.id} className="mag-card-elite"
                onClick={() => window.location.href = `/magazine?id=${mag.id}`}
                role="button"
                tabIndex={0}
                aria-label={`Read ${mag.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = `/magazine?id=${mag.id}`; } }}
              >
                <div className="mag-cover-3d">
                  <div className="mag-cover-overlay" />
                  <div className="mag-issue-badge">Vol {i + 1}</div>
                  <img src={`/${mag.cover_path}`} alt={mag.title} loading="lazy" />
                </div>
                <div className="mag-info-elite">
                  <div className="text-micro mag-micro-badge">
                    <span className="mag-dot" />
                    Premium Edition
                  </div>
                  <h3 className="mag-title-elite">{mag.title}</h3>
                  <div className="mag-divider" />
                </div>
              </div>
            )) : (
              <p className="text-body" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                No magazines published yet. Check back soon.
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem', position: 'relative', zIndex: 10 }}>
            <Link href="/magazine" className="elite-btn" style={{ padding: '0.8rem 1.25rem 0.8rem 1.75rem', fontSize: '0.75rem', gap: '1rem' }}>
              View All Magazines
              <div className="btn-arrow" style={{ width: 28, height: 28 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19L19 5M19 5v10M19 5H9" /></svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          05. QUALITY CONCEPTS MARQUEE
      ═══════════════════════════════════════════ */}
      <section id="concepts-section" className="concepts-section section-spacing" style={{
        background: 'radial-gradient(circle at top right,rgba(29,69,237,.05) 0%,transparent 60%),var(--bg-secondary)',
        overflow: 'hidden', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{ marginBottom: '3rem' }}>
          <span className="eyebrow">[ 05 / Core Methodologies ]</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <h2 className="font-mixed" style={{ lineHeight: 1.1, maxWidth: 600 }}>
              <span className="serif-italic">Quality</span> Concepts
            </h2>
          </div>
        </div>

        <div className="marquee-viewport">
          <div className="marquee-track" style={{ padding: '2rem 24px 4rem' }}>
            {conceptData.length > 0 ? (
              [...conceptData, ...conceptData].map((item, i) => {
                const realIndex = (i % conceptData.length) + 1;
                return (
                  <div key={`${item.concept.id}-${i}`} className="concept-item">
                    <div className="concept-meta-top">
                      <span className="text-micro text-accent">Methodology</span>
                      <span className="index">0{realIndex}</span>
                    </div>
                    <div className="concept-img-box">
                      <div className="concept-img-inner">
                        {item.images[0]
                          ? <img src={`/${item.images[0].image_path}`} alt={item.concept.title} loading="lazy" />
                          : <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg></div>
                        }
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '0.5rem' }}>
                      <h3 className="concept-title">{item.concept.title}</h3>
                    </div>
                    <Link href={`/quality-concepts#concept-${realIndex}`} className="concept-view-btn" aria-label={`View ${item.concept.title}`}>
                      View More
                      <div className="btn-arrow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div style={{ paddingLeft: '5vw' }}>
                <p className="text-body">System updating operational concepts. Check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          06. FLOW OF IMPLEMENTATION
      ═══════════════════════════════════════════ */}
      <section className="section-spacing">
        <div className="container reveal-up">
          <span className="eyebrow">[ 06 / Process Architecture ]</span>
          <h2 className="font-mixed" style={{ marginBottom: '4rem' }}>
            Flow of <span className="serif-italic">Implementation</span>
          </h2>
          <div className="process-scroll-container">
            {[
              { phase: '01', label: 'Training & Awareness', icon: <><circle cx="12" cy="12" r="3" className="pulse-core" /><path className="spin-slow" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></> },
              { phase: '02', label: 'Implementation', icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /><circle cx="12" cy="12" r="2" className="pulse-core" /></> },
              { phase: '03', label: 'Evaluation', icon: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" className="spin-slow" strokeDasharray="4 4" /><circle cx="12" cy="12" r="2" className="pulse-core" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /></> },
              { phase: '04', label: 'Certification', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" className="pulse-core" /></> },
              { phase: '05', label: 'Chapter Convention', icon: <><circle cx="12" cy="12" r="3" className="pulse-core" /><path className="spin-slow" d="M12 2v3m0 14v3M2 12h3m14 0h3M5.5 5.5l2.5 2.5m8 8l2.5 2.5M5.5 18.5l2.5-2.5m8-8l2.5-2.5" /><circle cx="12" cy="12" r="7" strokeDasharray="2 4" /></> },
              { phase: '06', label: 'National Convention', icon: <><circle cx="12" cy="12" r="10" /><ellipse cx="12" cy="12" rx="10" ry="4" className="spin-slow" /><line x1="12" y1="2" x2="12" y2="22" /><circle cx="12" cy="12" r="2" className="pulse-core" fill="var(--bg-primary)" /></> },
            ].map(({ phase, label, icon }) => (
              <div key={phase} className="process-step reveal">
                <div className="process-icon-elite">
                  <div className="icon-ring" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">{icon}</svg>
                </div>
                <span className="text-micro text-accent">PHASE {phase}</span>
                <h3 className="heading-sm" style={{ marginTop: '0.5rem' }}>{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          07. QUIZ CARD
      ═══════════════════════════════════════════ */}
      <section id="quiz-section" className="quiz-section section-spacing" style={{ backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="quiz-premium-grid">
            <div className="quiz-info reveal-up">
              <span className="eyebrow">[ 07 / Knowledge Assessment ]</span>
              <h2 className="font-mixed" style={{ marginBottom: '1.5rem', textAlign: 'left', maxWidth: 600 }}>
                Verify your core <br /><span className="serif-italic">industry expertise.</span>
              </h2>
              <p className="text-body" style={{ maxWidth: 480 }}>
                Engage in our interactive evaluation designed to test your proficiency in fundamental
                methodologies—including 5S, Kaizen, and Lean Management.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2.5rem' }}>
                {['Interactive Modules', 'Instant Scoring', 'TQM Fundamentals'].map(f => (
                  <div key={f} className="q-feature"><div className="q-dot" /><span>{f}</span></div>
                ))}
              </div>
            </div>

            <div className="quiz-card-wrapper reveal-3d delay-200">
              <div className="quiz-card-premium">
                <div className="quiz-card-glow" />
                <div className="quiz-card-content">
                  <div className="q-badge">Ready to begin</div>
                  <h3 className="q-card-title">Foundations Quiz</h3>
                  <div className="q-metrics">
                    <div className="q-metric">
                      <span className="q-metric-val">{quizCount || 15}</span>
                      <span className="q-metric-lbl">Questions</span>
                    </div>
                    <div className="q-divider" />
                    <div className="q-metric">
                      <span className="q-metric-val">5m</span>
                      <span className="q-metric-lbl">Est. Time</span>
                    </div>
                  </div>
                  <Link href="/quiz" className="quiz-start-btn">
                    Start Assessment
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          08. CONCLAVES, EVENTS & FAQ
      ═══════════════════════════════════════════ */}
      <section id="events-section" className="section-spacing">
        <div className="container split-grid faq-container">
          <div className="reveal-up">
            <span className="eyebrow">[ 08 / Conclaves & Events ]</span>
            <h2 className="font-mixed" style={{ marginBottom: '1.25rem' }}>Frequently Asked <span className="serif-italic">Questions.</span></h2>
            <p className="text-body" style={{ marginBottom: '1.5rem', maxWidth: 460 }}>
              Stay updated with conventions, regional conclaves, and training programs hosted by the QCFI Raurkela Chapter.
            </p>
            <Link href="/events" className="ios-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
              View All Events &amp; Conclaves
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="reveal-up delay-200">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item${activeFaq === i ? ' active' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  aria-expanded={activeFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span>{faq.q}</span>
                  <div className="faq-icon-elite" aria-hidden="true" />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="faq-answer"
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          09. MISSION & VISION
      ═══════════════════════════════════════════ */}
      <section className="light-theme-mv section-spacing" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="container mv-grid">
          <div className="reveal-up">
            <svg className="mv-icon anim-dash" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
              <circle cx="12" cy="12" r="6" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <path d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12" strokeWidth="1.5" />
            </svg>
            <div className="mv-number">01</div>
            <span className="text-micro" style={{ color: 'var(--accent)', marginBottom: '1rem', display: 'block' }}>Objective</span>
            <h2 className="font-mixed" style={{ marginBottom: '2rem' }}>Our <span className="serif-italic">Mission.</span></h2>
            <p className="text-body">
              To impart training and promote Quality Concepts to individuals and organizations, enabling
              them to achieve excellence and build a self-reliant nation through engineered methodologies.
            </p>
          </div>
          <div className="mv-divider" />
          <div className="reveal-up delay-200">
            <svg className="mv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path className="anim-dash" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" strokeWidth="1.5" fill="currentColor" opacity="0.2" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <path d="M4.5 12h15" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
            </svg>
            <div className="mv-number">02</div>
            <span className="text-micro" style={{ color: 'var(--accent)', marginBottom: '1rem', display: 'block' }}>Future State</span>
            <h2 className="font-mixed" style={{ marginBottom: '2rem' }}>Our <span className="serif-italic">Vision.</span></h2>
            <p className="text-body">
              To be the premium organization in promoting quality concepts, driving operational
              excellence, and nurturing innovative mindsets across all industrial and institutional sectors.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10. CONTACT
      ═══════════════════════════════════════════ */}
      <section id="contact" className="section-spacing bg-secondary">
        <div className="container split-grid">
          <div className="reveal-up">
            <span className="eyebrow">[ 09 / Network & Contact ]</span>
            <h2 className="font-mixed" style={{ marginBottom: '2rem' }}>
              Let&apos;s build better <span className="serif-italic">systems.</span>
            </h2>

            <p className="text-body" style={{ marginBottom: '1rem' }}><strong>Address:</strong> QCFI Raurkela Chapter, Sector-19, Raurkela, Odisha – 769 003, India</p>
            <p className="text-body" style={{ marginBottom: '1rem' }}><strong>Contact No:</strong> +91 661 251 0476</p>
            <p className="text-body"><strong>Email ID:</strong> qcfiRourkela@gmail.com</p>
          </div>
          <div className="reveal-up delay-200">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Contact form — needs its own submit handler, client sub-component ── */
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return submitted ? (
    <div style={{ padding: '2.5rem', background: 'rgba(29,69,237,0.06)', borderRadius: 16, border: '1px solid rgba(29,69,237,0.15)', textAlign: 'center' }}>
      <p className="text-body" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.1rem' }}>
        Message received successfully. We will be in touch shortly.
      </p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="contact-form" aria-label="Contact QCFI Raurkela">
      <div>
        <input
          id="contact-name"
          name="fullName"
          type="text"
          placeholder="Full Name"
          aria-label="Full Name"
          autoComplete="name"
          required
        />
      </div>
      <div className="input-row">
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="Email Address"
          aria-label="Email Address"
          autoComplete="email"
          required
        />
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          placeholder="Phone Number"
          aria-label="Phone Number"
          autoComplete="tel"
        />
      </div>
      <div>
        <input
          id="contact-org"
          name="organization"
          type="text"
          placeholder="Organisation / Company"
          aria-label="Organisation / Company"
          autoComplete="organization"
        />
      </div>
      <div>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="Inquiry / Message"
          aria-label="Inquiry / Message"
          required
        />
      </div>
      <button type="submit" className="elite-btn" style={{ marginTop: '0.5rem', minHeight: '52px' }}>
        Initialize Contact
        <div className="btn-arrow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19L19 5M19 5v10M19 5H9" /></svg>
        </div>
      </button>
    </form>
  );
}
