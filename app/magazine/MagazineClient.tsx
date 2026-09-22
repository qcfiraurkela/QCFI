'use client';

/**
 * app/magazine/MagazineClient.tsx
 * Client Component for Interactive 3D Magazines.
 * High-end aesthetic with consistent Navbar, Footer, and responsive Flipbook.
 */

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EliteBackBtn from '../components/EliteBackBtn';
import type { MagazineRow } from '@/lib/supabase-db';

interface MagazineClientProps {
  magazines: MagazineRow[];
}

declare global {
  interface Window {
    pdfjsLib?: any;
    St?: any;
  }
}

export default function MagazineClient() {
  const [magazines, setMagazines] = useState<MagazineRow[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/magazines').then(r => r.json()).then(setMagazines).catch(() => {});
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);
  const [activeMagPdf, setActiveMagPdf] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  const flipbookRef = useRef<HTMLDivElement>(null);
  const readerSectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pageFlipInstanceRef = useRef<any>(null);
  // Keep magazines in a ref so the URL-param effect always sees the latest list
  const magazinesRef = useRef(magazines);
  useEffect(() => { magazinesRef.current = magazines; }, [magazines]);

  const checkScriptsReady = () => {
    if (typeof window !== 'undefined' && window.pdfjsLib && window.St?.PageFlip) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      setScriptsLoaded(true);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !scriptsLoaded) return;
    const urlParams = new URLSearchParams(window.location.search);
    const magId = urlParams.get('id');
    if (magId) {
      const match = magazinesRef.current.find((m) => String(m.id) === magId);
      if (match) {
        openReader(match.pdf_path);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptsLoaded]);

  const openReader = async (pdfPath: string) => {
    const formattedUrl = pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`;
    setActiveMagPdf(formattedUrl);
    setLoadingPdf(true);
    setLoadError(null);

    setTimeout(() => {
      readerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    if (pageFlipInstanceRef.current) {
      pageFlipInstanceRef.current.destroy();
      pageFlipInstanceRef.current = null;
    }

    if (flipbookRef.current) {
      flipbookRef.current.innerHTML = '';
    }

    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF viewer library is still loading. Please try again in a moment.');
      }

      const loadingTask = window.pdfjsLib.getDocument(formattedUrl);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const container = flipbookRef.current;
      if (!container) return;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';

        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/jpeg', 0.85);

        pageDiv.appendChild(img);
        container.appendChild(pageDiv);
      }

      setLoadingPdf(false);

      if (window.St?.PageFlip) {
        const pageFlip = new window.St.PageFlip(container, {
          width: 330,
          height: 470,
          size: 'fixed',
          minWidth: 300,
          maxWidth: 400,
          minHeight: 400,
          maxHeight: 600,
          maxShadowOpacity: 0.35,
          showCover: true,
          mobileScrollSupport: false,
          usePortrait: typeof window !== 'undefined' ? window.innerWidth < 800 : false,
        });

        const pages = container.querySelectorAll('.page');
        pageFlip.loadFromHTML(pages);

        pageFlip.on('flip', () => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        });

        pageFlipInstanceRef.current = pageFlip;
      }
    } catch (err: any) {
      console.error('Error loading PDF:', err);
      setLoadingPdf(false);
      setLoadError('Error processing network data. Please verify file integrity and try again.');
    }
  };

  const closeReader = () => {
    setActiveMagPdf(null);
    setLoadingPdf(false);
    setLoadError(null);

    if (pageFlipInstanceRef.current) {
      pageFlipInstanceRef.current.destroy();
      pageFlipInstanceRef.current = null;
    }
    if (flipbookRef.current) {
      flipbookRef.current.innerHTML = '';
    }

    document.querySelector('.page-header-sub')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* External dependencies for PDF & 3D Flipbook */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
        strategy="afterInteractive"
        onLoad={checkScriptsReady}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/page-flip/dist/js/page-flip.browser.js"
        strategy="afterInteractive"
        onLoad={checkScriptsReady}
      />

      {/* Shared QCFI Glass Navbar */}
      <Navbar />

      {/* Elite Back Hub Button (visible on wide screens, safely away from header) */}
      <EliteBackBtn href="/#magazine-section" label="Back to Hub" />

      {/* Page Sub-Header - Perfectly Centered */}
      <section className="page-header-sub">
        <div className="container">
          <span className="eyebrow eyebrow-center">[ Publications & Archives ]</span>
          <h1 className="font-mixed">
            Interactive <span className="serif-italic">Magazines.</span>
          </h1>
          <p className="text-body" style={{ marginTop: '1.25rem', maxWidth: 580, marginInline: 'auto' }}>
            Immerse yourself in our hyper-realistic interactive flipbooks documenting industrial excellence and continuous improvement.
          </p>
        </div>
      </section>

      {/* Magazines Grid Selection */}
      <section
        id="magazine-grid-section"
        className="container"
        style={{
          display: activeMagPdf ? 'none' : 'block',
          padding: '4.5rem 5% 6rem',
          flex: 1,
        }}
      >
        <div className="grid-layout">
          {magazines && magazines.length > 0 ? (
            magazines.map((mag) => (
              <div
                key={mag.id}
                className="magazine-card"
                id={`mag-card-${mag.id}`}
                onClick={() => openReader(mag.pdf_path)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${mag.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReader(mag.pdf_path); } }}
              >
                <div className="magazine-cover">
                  <img src={`/${mag.cover_path}`} alt={`${mag.title} Cover`} loading="lazy" />
                </div>
                <h3 className="magazine-title">{mag.title}</h3>

                <div className="btn-read">
                  Open Edition
                  <div className="btn-icon-wrapper">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#4A5568', padding: '60px 20px' }}>
              <p className="text-body">No magazines published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3D Inline Flipbook Reader */}
      <section
        ref={readerSectionRef}
        id="inlineReaderSection"
        className="inline-reader-section"
        style={{ display: activeMagPdf ? 'block' : 'none', flex: 1 }}
      >
        <button className="close-btn-advanced" onClick={closeReader}>
          Close Edition
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 14, height: 14 }}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {loadingPdf && (
          <div id="readerLoading" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p className="text-body" style={{ color: 'var(--accent)', fontWeight: 600 }}>Processing High-Resolution Data...</p>
          </div>
        )}

        {loadError && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--accent)' }}>
            <p>{loadError}</p>
          </div>
        )}

        <div
          id="flipbookWrapper"
          className="flipbook-wrapper"
          style={{ display: loadingPdf || loadError ? 'none' : 'flex' }}
        >
          <div id="flipbook" ref={flipbookRef} />
          <div className="flip-hint">Drag edges to flip • Double click to zoom</div>
        </div>
      </section>

      {/* High-Fidelity Audio Element for Page Turn — loaded only when reader opens */}
      {activeMagPdf && (
        <audio
          ref={audioRef}
          src="https://assets.mixkit.co/active_storage/sfx/1104/1104-preview.mp3"
          preload="auto"
        />
      )}

      {/* Shared QCFI Footer */}
      <Footer />
    </div>
  );
}