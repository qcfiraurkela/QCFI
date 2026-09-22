'use client';

import { useEffect, useState } from 'react';
import type { ConceptWithImages } from '@/lib/db';

export default function ConceptsClient({ conceptData }: { conceptData: ConceptWithImages[] }) {
  const [active, setActive] = useState(1);

  /* Handle URL hash on load — e.g. /quality-concepts#concept-3 */
  useEffect(() => {
    const hash = window.location.hash;
    if (hash?.startsWith('#concept-')) {
      const n = parseInt(hash.replace('#concept-', ''), 10);
      if (!isNaN(n) && n >= 1 && n <= conceptData.length) setActive(n);
    }
  }, [conceptData.length]);

  const switchConcept = (index: number) => {
    setActive(index);
    // Quietly update URL hash
    if (window.location.hash !== `#concept-${index}`) {
      window.history.replaceState(null, '', `#concept-${index}`);
    }
    // Scroll tab into view (mobile horizontal scroll)
    const btn = document.querySelector<HTMLButtonElement>(`.tab-btn[data-target="concept-${index}"]`);
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    // If user is far below the panel area, scroll back up
    const panels = document.querySelector<HTMLElement>('.concept-panels-container');
    if (panels && window.scrollY > panels.offsetTop + 50) {
      window.scrollTo({ top: panels.offsetTop - 80, behavior: 'smooth' });
    }
  };

  if (conceptData.length === 0) {
    return (
      <div className="container concept-panels-container">
        <div className="fallback-ui">
          <svg className="fallback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
          </svg>
          <h2 className="font-mixed" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            System <span className="serif-italic">Updating.</span>
          </h2>
          <p style={{ color: '#4A5568', fontSize: '1.1rem' }}>
            No quality concepts have been published yet.
          </p>
        </div>
      </div>
    );
  }

  const current = conceptData[active - 1];

  return (
    <>
      {/* ── Sticky tab bar ── */}
      <div className="concept-tabs-wrapper">
        <div className="tabs-scroll-area">
          {conceptData.map((item, i) => (
            <button
              key={item.concept.id}
              className={`tab-btn${active === i + 1 ? ' active' : ''}`}
              data-target={`concept-${i + 1}`}
              onClick={() => switchConcept(i + 1)}
            >
              <span className="tab-num">0{i + 1}</span>
              {item.concept.title}
            </button>
          ))}
        </div>
      </div>

      {/* ── Panels ── */}
      <div className="container concept-panels-container" style={{ padding: '60px 0 120px' }}>
        {current && (
          <div className="concept-panel active" key={current.concept.id}>

            {/* Split layout */}
            <div className="concept-split-grid">
              {/* Left: text */}
              <div className="concept-info-left">
                <div className="tech-label-group">
                  <span className="tech-dot" />
                  <span className="tech-text">DATA MATRIX // 0{active}</span>
                </div>
                <h2 className="concept-huge-title">{current.concept.title}</h2>
                <div className="title-divider" />
                <p className="concept-short-desc">
                  Review the structural workflow, implementation guidelines, and core benefits of this methodology.
                </p>
              </div>

              {/* Right: cinematic image frame */}
              <div className="concept-image-right">
                <div className="creative-frame-wrapper">
                  <div className="frame-bracket br-tl" />
                  <div className="frame-bracket br-tr" />
                  <div className="frame-bracket br-bl" />
                  <div className="frame-bracket br-br" />
                  <div className="image-core-mask">
                    <div className="frame-scanner" />
                    <div className="overlay-data">SYS.VIEW // SEC.0{active}</div>
                    {current.images[0] ? (
                      <img
                        src={`/${current.images[0].image_path}`}
                        alt={current.concept.title}
                        className="concept-main-img"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="concept-body-text">
              {current.concept.description}
            </div>

            {/* Secondary gallery (images after the first) */}
            {current.images.length > 1 && (
              <>
                <div style={{ marginTop: '5rem', textAlign: 'center' }}>
                  <span className="eyebrow eyebrow-center">[ Visual References ]</span>
                </div>
                <div className="secondary-gallery">
                  {current.images.slice(1).map(img => (
                    <div key={img.id} className="sec-gallery-item">
                      <img src={`/${img.image_path}`} alt={`${current.concept.title} view`} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
