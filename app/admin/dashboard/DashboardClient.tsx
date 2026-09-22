'use client';

/**
 * app/admin/dashboard/DashboardClient.tsx — 2026 Industrial Luxury Theme
 * Master Administration HUD for QCFI Raurkela Chapter:
 *  - Blueprint mesh & industrial background
 *  - Master control header with live system indicator & quick navigation
 *  - 5-Card Operational Metrics HUD (Hero, Events, Concepts, Quizzes, Magazines)
 *  - Segmented tab bar with technical index numbering
 *  - Elevated form cards with drag-and-drop dropzone indicators & file previews
 *  - High-precision glass data tables with thumbnail previews & deletion safeguards
 *  - Full preservation of all 5 database CRUD interfaces and backend API routes
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type {
  HeroImageRow,
  EventRow,
  QualityConceptRow,
  QuizRow,
  MagazineRow,
} from '@/lib/db';

interface DashboardClientProps {
  initialHeroImages: HeroImageRow[];
  initialEvents: EventRow[];
  initialConcepts: QualityConceptRow[];
  initialQuizzes: QuizRow[];
  initialMagazines: MagazineRow[];
}

type TabType = 'heroTab' | 'eventsTab' | 'conceptsTab' | 'quizTab' | 'magazinesTab';

export default function DashboardClient({
  initialHeroImages,
  initialEvents,
  initialConcepts,
  initialQuizzes,
  initialMagazines,
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('heroTab');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImageRow[]>(initialHeroImages);
  const [events, setEvents] = useState<EventRow[]>(initialEvents);
  const [concepts, setConcepts] = useState<QualityConceptRow[]>(initialConcepts);
  const [quizzes, setQuizzes] = useState<QuizRow[]>(initialQuizzes);
  const [magazines, setMagazines] = useState<MagazineRow[]>(initialMagazines);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const modulesMeta = {
    heroTab: {
      num: '01',
      title: 'Hero Visuals & Carousel',
      sub: 'Manage homepage hero carousel assets and high-resolution visual banners.',
      count: heroImages.length,
      badgeText: 'Gallery Assets',
    },
    eventsTab: {
      num: '02',
      title: 'Events & Conclaves',
      sub: 'Publish upcoming quality conventions, training workshops, and photo galleries.',
      count: events.length,
      badgeText: 'Conclaves',
    },
    conceptsTab: {
      num: '03',
      title: 'Quality Concepts Matrix',
      sub: 'Publish educational articles on 5S, Kaizen, Six Sigma, and TQM principles.',
      count: concepts.length,
      badgeText: 'Concepts',
    },
    magazinesTab: {
      num: '04',
      title: '3D Digital Magazines',
      sub: 'Upload and distribute interactive PDF flipbooks and chapter journals.',
      count: magazines.length,
      badgeText: 'Flipbooks',
    },
    quizTab: {
      num: '05',
      title: 'Knowledge Assessment Matrix',
      sub: 'Configure examination questions, answer keys, and quality concept evaluations.',
      count: quizzes.length,
      badgeText: 'Evaluations',
    },
  };
  const activeModule = modulesMeta[activeTab];

  // File selection labels
  const [heroFileLabel, setHeroFileLabel] = useState<string>('');
  const [eventMainFileLabel, setEventMainFileLabel] = useState<string>('');
  const [eventExtraCount, setEventExtraCount] = useState<number>(0);
  const [conceptFilesCount, setConceptFilesCount] = useState<number>(0);
  const [magPdfLabel, setMagPdfLabel] = useState<string>('');
  const [magCoverLabel, setMagCoverLabel] = useState<string>('');

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  // ── 1. Hero Handlers ────────────────────────────────────────────────────────
  const handleAddHero = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('hero_image') as HTMLInputElement;
    if (!fileInput.files?.[0]) return;

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('hero_image', fileInput.files[0]);

      const res = await fetch('/api/hero', { method: 'POST', body: fd });
      if (res.ok) {
        const newItem = await res.json();
        setHeroImages((prev) => [newItem, ...prev]);
        form.reset();
        setHeroFileLabel('');
        notify('Hero image registered into gallery matrix successfully.');
      } else {
        const err = await res.json();
        notify(err.error || 'Failed to upload hero image.', 'error');
      }
    } catch {
      notify('Network communication failure.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteHero = async (id: number) => {
    if (!window.confirm('Confirm deletion of this hero gallery item?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/hero/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHeroImages((prev) => prev.filter((item) => item.id !== id));
        notify('Hero image deleted.');
      } else {
        notify('Failed to delete image.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  // ── 2. Event Handlers ───────────────────────────────────────────────────────
  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setBusy(true);
    try {
      const res = await fetch('/api/events', { method: 'POST', body: fd });
      if (res.ok) {
        const newItem = await res.json();
        setEvents((prev) => [newItem, ...prev]);
        form.reset();
        setEventMainFileLabel('');
        setEventExtraCount(0);
        notify('New industrial convention/event published successfully.');
      } else {
        const err = await res.json();
        notify(err.error || 'Failed to create event.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm('Delete this event and its associated galleries?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item.id !== id));
        notify('Event deleted.');
      } else {
        notify('Failed to delete event.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  // ── 3. Concept Handlers ─────────────────────────────────────────────────────
  const handleAddConcept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setBusy(true);
    try {
      const res = await fetch('/api/concepts', { method: 'POST', body: fd });
      if (res.ok) {
        const newItem = await res.json();
        setConcepts((prev) => [...prev, newItem]);
        form.reset();
        setConceptFilesCount(0);
        notify('Quality Concept methodology synchronized.');
      } else {
        const err = await res.json();
        notify(err.error || 'Failed to add concept.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteConcept = async (id: number) => {
    if (!window.confirm('Delete this Quality Concept and its visual matrix?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/concepts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConcepts((prev) => prev.filter((item) => item.id !== id));
        notify('Quality Concept deleted.');
      } else {
        notify('Failed to delete concept.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  // ── 4. Quiz Handlers ────────────────────────────────────────────────────────
  const handleAddQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      question: fd.get('question'),
      option_a: fd.get('option_a'),
      option_b: fd.get('option_b'),
      option_c: fd.get('option_c'),
      option_d: fd.get('option_d'),
      correct_option: fd.get('correct_option'),
    };

    setBusy(true);
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newItem = await res.json();
        setQuizzes((prev) => [...prev, newItem]);
        form.reset();
        notify('Assessment question integrated into knowledge base.');
      } else {
        const err = await res.json();
        notify(err.error || 'Failed to add question.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteQuiz = async (id: number) => {
    if (!window.confirm('Delete this assessment question?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuizzes((prev) => prev.filter((item) => item.id !== id));
        notify('Question deleted.');
      } else {
        notify('Failed to delete question.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  // ── 5. Magazine Handlers ────────────────────────────────────────────────────
  const handleAddMagazine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setBusy(true);
    try {
      const res = await fetch('/api/magazines', { method: 'POST', body: fd });
      if (res.ok) {
        const newItem = await res.json();
        setMagazines((prev) => [newItem, ...prev]);
        form.reset();
        setMagPdfLabel('');
        setMagCoverLabel('');
        notify('Interactive 3D Magazine published successfully.');
      } else {
        const err = await res.json();
        notify(err.error || 'Failed to add magazine.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteMagazine = async (id: number) => {
    if (!window.confirm('Delete this interactive magazine publication?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/magazines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMagazines((prev) => prev.filter((item) => item.id !== id));
        notify('Magazine deleted.');
      } else {
        notify('Failed to delete magazine.', 'error');
      }
    } catch {
      notify('Network error.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-hud-layout">
      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="hud-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Left Executive Sidebar Navigation ── */}
      <aside className={`admin-hud-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-block">
          <div className="sidebar-brand-main">
            <div className="sidebar-logo-ring">
              <Image src="/logo.png" alt="QCFI Logo" width={38} height={38} priority />
            </div>
            <div className="sidebar-brand-text">
              <div className="sidebar-brand-title">QCFI RAURKELA</div>
              <div className="sidebar-brand-sub">EXECUTIVE CONSOLE // 2026</div>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>

        {/* Live Operational Status Beacon */}
        <div className="sidebar-status-box">
          <span className="hud-status-dot" />
          <div className="status-text">
            <span className="status-label">STATUS</span>
            <span className="status-val">SYSTEM SECURE // LIVE</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="sidebar-section-label">MODULE DIRECTORY</div>

        {/* Navigation Items (Sidebar Tabs with Live Badges) */}
        <nav className="sidebar-nav-list">
          {/* 01: Hero Visuals */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'heroTab' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('heroTab');
              setSidebarOpen(false);
            }}
          >
            <div className="nav-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <div className="nav-item-content">
              <span className="nav-item-title">Hero Visuals</span>
              <span className="nav-item-sub">01 // VISUALS</span>
            </div>
            <span className="nav-item-counter">{heroImages.length}</span>
          </button>

          {/* 02: Events & Conclaves */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'eventsTab' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('eventsTab');
              setSidebarOpen(false);
            }}
          >
            <div className="nav-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
              </svg>
            </div>
            <div className="nav-item-content">
              <span className="nav-item-title">Events &amp; Conclaves</span>
              <span className="nav-item-sub">02 // ACTIVITIES</span>
            </div>
            <span className="nav-item-counter">{events.length}</span>
          </button>

          {/* 03: Quality Concepts */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'conceptsTab' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('conceptsTab');
              setSidebarOpen(false);
            }}
          >
            <div className="nav-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="nav-item-content">
              <span className="nav-item-title">Quality Concepts</span>
              <span className="nav-item-sub">03 // CORE TQM</span>
            </div>
            <span className="nav-item-counter">{concepts.length}</span>
          </button>

          {/* 04: 3D Magazines */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'magazinesTab' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('magazinesTab');
              setSidebarOpen(false);
            }}
          >
            <div className="nav-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6 6h10M6 10h10" />
              </svg>
            </div>
            <div className="nav-item-content">
              <span className="nav-item-title">3D Magazines</span>
              <span className="nav-item-sub">04 // ARCHIVES</span>
            </div>
            <span className="nav-item-counter">{magazines.length}</span>
          </button>

          {/* 05: Quiz Assessment */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'quizTab' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('quizTab');
              setSidebarOpen(false);
            }}
          >
            <div className="nav-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 11 3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className="nav-item-content">
              <span className="nav-item-title">Quiz Matrix</span>
              <span className="nav-item-sub">05 // EVALUATION</span>
            </div>
            <span className="nav-item-counter">{quizzes.length}</span>
          </button>
        </nav>
      </aside>

      {/* ── Right Main Workspace Viewport ── */}
      <div className="admin-hud-main">
        {/* Workspace Top Bar */}
        <header className="workspace-top-bar">
          <div className="top-bar-left">
            <button
              type="button"
              className="mobile-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="top-bar-meta">
              <div className="top-bar-breadcrumb">
                <span className="crumb-root">ADMIN CONSOLE</span>
                <span className="crumb-sep">/</span>
                <span className="crumb-active">{activeModule.title}</span>
              </div>
              <div className="top-bar-heading-row">
                <h1 className="top-bar-title">{activeModule.title}</h1>
                <span className="top-bar-live-tag">LIVE SYNC</span>
              </div>
              <p className="top-bar-sub">{activeModule.sub}</p>
            </div>
          </div>

          <div className="top-bar-right">
            <div className="top-bar-kpi-chip">
              <span className="kpi-num">{activeModule.count}</span>
              <span className="kpi-label">{activeModule.badgeText}</span>
            </div>

            <div className="top-bar-divider" />

            <div className="top-bar-actions">
              <Link href="/" target="_blank" className="hud-btn-ghost" title="View Public Website">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>Live Website</span>
              </Link>

              <button type="button" onClick={handleLogout} className="hud-btn-danger" title="Terminate Session">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Terminate</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── Floating Notification Toast ── */}
        {message && (
          <div className={`hud-toast ${message.type === 'success' ? 'toast-success' : 'toast-error'}`}>
            <div className="toast-dot" />
            <span>{message.text}</span>
          </div>
        )}

        {/* ── Image Modal Preview ── */}
        {previewImage && (
          <div className="hud-modal-backdrop" onClick={() => setPreviewImage(null)}>
            <div className="hud-modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="hud-modal-close" onClick={() => setPreviewImage(null)}>✕</button>
              <img src={previewImage} alt="Preview" className="hud-modal-img" />
            </div>
          </div>
        )}

        {/* ── Main Dashboard Workspace Content ── */}
        <main className="admin-hud-workspace">

        {/* ── 1. HERO TAB CONTENT ── */}
        {activeTab === 'heroTab' && (
          <div className="hud-panel-content">
            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ UPLOAD DISPATCH // HERO MATRIX ]</span>
                <h2 className="hud-card-heading">Add New <span className="serif-italic">Hero Image.</span></h2>
              </div>

              <form onSubmit={handleAddHero} className="hud-form">
                <div className="hud-dropzone">
                  <input
                    type="file"
                    name="hero_image"
                    id="hero_image"
                    accept="image/*"
                    required
                    disabled={busy}
                    className="dropzone-input"
                    onChange={(e) => setHeroFileLabel(e.target.files?.[0]?.name || '')}
                  />
                  <div className="dropzone-body">
                    <div className="dropzone-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                    <div className="dropzone-title">
                      {heroFileLabel ? heroFileLabel : 'Click or drop hero image here'}
                    </div>
                    <div className="dropzone-sub">Supported formats: WEBP, JPG, PNG, AVIF (Max 15MB)</div>
                  </div>
                </div>

                <div className="hud-form-actions">
                  <button type="submit" className="hud-submit-btn" disabled={busy}>
                    {busy ? 'Registering...' : 'Upload & Deploy Image'}
                    <div className="btn-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                </div>
              </form>
            </div>

            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ REPOSITORY OVERVIEW ]</span>
                <h2 className="hud-card-heading">Deployed <span className="serif-italic">Hero Images ({heroImages.length})</span></h2>
              </div>

              <div className="hud-table-wrapper">
                <table className="hud-table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>ID</th>
                      <th style={{ width: 140 }}>Preview</th>
                      <th>Database File Path</th>
                      <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroImages.map((img) => (
                      <tr key={img.id}>
                        <td><span className="id-chip">#{img.id}</span></td>
                        <td>
                          <div className="table-thumb" onClick={() => setPreviewImage(`/${img.image_path}`)}>
                            <img src={`/${img.image_path}`} alt="Hero" />
                            <div className="thumb-zoom-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9" />
                                <polyline points="9 21 3 21 3 15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td>
                          <code className="code-badge">{img.image_path}</code>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="hud-delete-btn"
                            onClick={() => handleDeleteHero(img.id)}
                            disabled={busy}
                            title="Delete this hero image"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {heroImages.length === 0 && (
                      <tr>
                        <td colSpan={4} className="hud-empty-cell">
                          No hero images deployed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. EVENTS TAB CONTENT ── */}
        {activeTab === 'eventsTab' && (
          <div className="hud-panel-content">
            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ EVENT CREATION ENGINE ]</span>
                <h2 className="hud-card-heading">Publish <span className="serif-italic">Chapter Event.</span></h2>
              </div>

              <form onSubmit={handleAddEvent} className="hud-form">
                <div className="hud-grid-2">
                  <div className="hud-field">
                    <label>Event Name / Convention Code</label>
                    <input type="text" name="name" required placeholder="e.g. 32nd Annual Chapter Convention" disabled={busy} />
                  </div>
                  <div className="hud-field">
                    <label>Event Date</label>
                    <input type="date" name="event_date" required disabled={busy} />
                  </div>
                </div>

                <div className="hud-field">
                  <label>Event Header Title</label>
                  <input type="text" name="title" required placeholder="e.g. Fostering Quality Circles for Zero-Defect Manufacturing" disabled={busy} />
                </div>

                <div className="hud-field">
                  <label>Event Description &amp; Detailed Schedule</label>
                  <textarea name="description" rows={4} required placeholder="Provide executive overview, key speakers, participating institutions, and milestones..." disabled={busy} />
                </div>

                <div className="hud-grid-2">
                  <div className="hud-dropzone">
                    <input
                      type="file"
                      name="main_image"
                      accept="image/*"
                      required
                      disabled={busy}
                      className="dropzone-input"
                      onChange={(e) => setEventMainFileLabel(e.target.files?.[0]?.name || '')}
                    />
                    <div className="dropzone-body">
                      <div className="dropzone-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </div>
                      <div className="dropzone-title">
                        {eventMainFileLabel ? eventMainFileLabel : 'Select Main Event Cover Image'}
                      </div>
                      <div className="dropzone-sub">Primary hero banner (Required)</div>
                    </div>
                  </div>

                  <div className="hud-dropzone">
                    <input
                      type="file"
                      name="additional_images"
                      accept="image/*"
                      multiple
                      disabled={busy}
                      className="dropzone-input"
                      onChange={(e) => setEventExtraCount(e.target.files?.length || 0)}
                    />
                    <div className="dropzone-body">
                      <div className="dropzone-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2"/><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      <div className="dropzone-title">
                        {eventExtraCount > 0 ? `${eventExtraCount} Extra Images Selected` : 'Additional Gallery Photos'}
                      </div>
                      <div className="dropzone-sub">Select multiple photos for event gallery</div>
                    </div>
                  </div>
                </div>

                <div className="hud-form-actions">
                  <button type="submit" className="hud-submit-btn" disabled={busy}>
                    {busy ? 'Publishing Event...' : 'Publish Event to Live Matrix'}
                    <div className="btn-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                </div>
              </form>
            </div>

            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ ACTIVE CONVENTIONS &amp; CONCLAVES ]</span>
                <h2 className="hud-card-heading">Registered <span className="serif-italic">Events ({events.length})</span></h2>
              </div>

              <div className="hud-table-wrapper">
                <table className="hud-table">
                  <thead>
                    <tr>
                      <th style={{ width: 140 }}>Cover</th>
                      <th>Event Name</th>
                      <th>Date</th>
                      <th>Summary Title</th>
                      <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          <div className="table-thumb" onClick={() => setPreviewImage(`/${ev.main_image_path}`)}>
                            <img src={`/${ev.main_image_path}`} alt={ev.name} />
                            <div className="thumb-zoom-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9" />
                                <polyline points="9 21 3 21 3 15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td><strong>{ev.name}</strong></td>
                        <td><span className="badge-outline">{ev.event_date}</span></td>
                        <td><span className="text-truncate">{ev.title}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="hud-delete-btn"
                            onClick={() => handleDeleteEvent(ev.id)}
                            disabled={busy}
                            title="Delete this event"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={5} className="hud-empty-cell">No events published yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. CONCEPTS TAB CONTENT ── */}
        {activeTab === 'conceptsTab' && (
          <div className="hud-panel-content">
            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ METHODOLOGY ARCHITECT ]</span>
                <h2 className="hud-card-heading">Add <span className="serif-italic">Quality Concept.</span></h2>
              </div>

              <form onSubmit={handleAddConcept} className="hud-form">
                <div className="hud-field">
                  <label>Concept Title / Methodology Name</label>
                  <input type="text" name="title" required placeholder="e.g. 5S Workplace Optimization System" disabled={busy} />
                </div>

                <div className="hud-field">
                  <label>Methodology Framework &amp; Implementation Description</label>
                  <textarea name="description" rows={5} required placeholder="Detail the structural workflow, step-by-step principles, and measurable efficiency returns..." disabled={busy} />
                </div>

                <div className="hud-dropzone">
                  <input
                    type="file"
                    name="concept_images"
                    accept="image/*"
                    multiple
                    required
                    disabled={busy}
                    className="dropzone-input"
                    onChange={(e) => setConceptFilesCount(e.target.files?.length || 0)}
                  />
                  <div className="dropzone-body">
                    <div className="dropzone-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                      </svg>
                    </div>
                    <div className="dropzone-title">
                      {conceptFilesCount > 0 ? `${conceptFilesCount} Concept Diagrams Selected` : 'Select Concept Diagrams & Matrices'}
                    </div>
                    <div className="dropzone-sub">Upload 1 primary diagram + optional secondary visual references</div>
                  </div>
                </div>

                <div className="hud-form-actions">
                  <button type="submit" className="hud-submit-btn" disabled={busy}>
                    {busy ? 'Registering...' : 'Deploy Quality Concept'}
                    <div className="btn-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                </div>
              </form>
            </div>

            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ ACTIVE METHODOLOGIES ]</span>
                <h2 className="hud-card-heading">Published <span className="serif-italic">Concepts ({concepts.length})</span></h2>
              </div>

              <div className="hud-table-wrapper">
                <table className="hud-table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>Index</th>
                      <th>Methodology Title</th>
                      <th>Overview Snippet</th>
                      <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {concepts.map((concept, idx) => (
                      <tr key={concept.id}>
                        <td><span className="id-chip">0{idx + 1}</span></td>
                        <td><strong>{concept.title}</strong></td>
                        <td><span className="text-truncate">{concept.description}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="hud-delete-btn"
                            onClick={() => handleDeleteConcept(concept.id)}
                            disabled={busy}
                            title="Delete this quality concept"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {concepts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="hud-empty-cell">No Quality Concepts registered yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 4. MAGAZINES TAB CONTENT ── */}
        {activeTab === 'magazinesTab' && (
          <div className="hud-panel-content">
            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ PUBLICATION DISPATCH ]</span>
                <h2 className="hud-card-heading">Add Interactive <span className="serif-italic">3D Magazine.</span></h2>
              </div>

              <form onSubmit={handleAddMagazine} className="hud-form">
                <div className="hud-field">
                  <label>Magazine Title / Edition Header</label>
                  <input type="text" name="title" required placeholder="e.g. Industrial Excellence - Q1 2026 Edition" disabled={busy} />
                </div>

                <div className="hud-grid-2">
                  <div className="hud-dropzone">
                    <input
                      type="file"
                      name="pdf_file"
                      accept=".pdf"
                      required
                      disabled={busy}
                      className="dropzone-input"
                      onChange={(e) => setMagPdfLabel(e.target.files?.[0]?.name || '')}
                    />
                    <div className="dropzone-body">
                      <div className="dropzone-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div className="dropzone-title">{magPdfLabel ? magPdfLabel : 'Select PDF Document'}</div>
                      <div className="dropzone-sub">High-resolution publication PDF for 3D flipbook</div>
                    </div>
                  </div>

                  <div className="hud-dropzone">
                    <input
                      type="file"
                      name="cover_image"
                      accept="image/*"
                      required
                      disabled={busy}
                      className="dropzone-input"
                      onChange={(e) => setMagCoverLabel(e.target.files?.[0]?.name || '')}
                    />
                    <div className="dropzone-body">
                      <div className="dropzone-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div className="dropzone-title">{magCoverLabel ? magCoverLabel : 'Select Cover Thumbnail'}</div>
                      <div className="dropzone-sub">Vertical aspect ratio (3:4 ratio recommended)</div>
                    </div>
                  </div>
                </div>

                <div className="hud-form-actions">
                  <button type="submit" className="hud-submit-btn" disabled={busy}>
                    {busy ? 'Processing Publication...' : 'Publish Interactive Edition'}
                    <div className="btn-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                </div>
              </form>
            </div>

            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ ACTIVE PUBLICATIONS ]</span>
                <h2 className="hud-card-heading">Available <span className="serif-italic">Editions ({magazines.length})</span></h2>
              </div>

              <div className="hud-table-wrapper">
                <table className="hud-table">
                  <thead>
                    <tr>
                      <th style={{ width: 100 }}>Cover</th>
                      <th>Edition Title</th>
                      <th>Document Link</th>
                      <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {magazines.map((mag) => (
                      <tr key={mag.id}>
                        <td>
                          <div className="table-thumb" onClick={() => setPreviewImage(`/${mag.cover_path}`)}>
                            <img src={`/${mag.cover_path}`} alt="Cover" />
                            <div className="thumb-zoom-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9" />
                                <polyline points="9 21 3 21 3 15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td><strong>{mag.title}</strong></td>
                        <td>
                          <a href={`/${mag.pdf_path}`} target="_blank" rel="noreferrer" className="hud-link-pill">
                            <span>Inspect PDF Document</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                          </a>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="hud-delete-btn"
                            onClick={() => handleDeleteMagazine(mag.id)}
                            disabled={busy}
                            title="Delete this magazine"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {magazines.length === 0 && (
                      <tr>
                        <td colSpan={4} className="hud-empty-cell">No magazines in repository yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. QUIZ TAB CONTENT ── */}
        {activeTab === 'quizTab' && (
          <div className="hud-panel-content">
            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ ASSESSMENT CREATION ENGINE ]</span>
                <h2 className="hud-card-heading">Add Assessment <span className="serif-italic">Query.</span></h2>
              </div>

              <form onSubmit={handleAddQuiz} className="hud-form">
                <div className="hud-field">
                  <label>Question Statement</label>
                  <input type="text" name="question" required placeholder="e.g. Which of the following defines Seiri in 5S methodology?" disabled={busy} />
                </div>

                <div className="hud-grid-2">
                  <div className="hud-field">
                    <label>Option A</label>
                    <input type="text" name="option_a" required placeholder="First potential answer" disabled={busy} />
                  </div>
                  <div className="hud-field">
                    <label>Option B</label>
                    <input type="text" name="option_b" required placeholder="Second potential answer" disabled={busy} />
                  </div>
                </div>

                <div className="hud-grid-2">
                  <div className="hud-field">
                    <label>Option C</label>
                    <input type="text" name="option_c" required placeholder="Third potential answer" disabled={busy} />
                  </div>
                  <div className="hud-field">
                    <label>Option D</label>
                    <input type="text" name="option_d" required placeholder="Fourth potential answer" disabled={busy} />
                  </div>
                </div>

                <div className="hud-field" style={{ maxWidth: 320 }}>
                  <label>Designated Correct Key</label>
                  <select name="correct_option" required disabled={busy} className="hud-select">
                    <option value="A">Option A (Standard)</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="hud-form-actions">
                  <button type="submit" className="hud-submit-btn" disabled={busy}>
                    {busy ? 'Integrating...' : 'Add Assessment Question'}
                    <div className="btn-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                </div>
              </form>
            </div>

            <div className="hud-glass-card">
              <div className="card-top-meta">
                <span className="eyebrow">[ ACTIVE QUESTION BANK ]</span>
                <h2 className="hud-card-heading">Knowledge Matrix <span className="serif-italic">Items ({quizzes.length})</span></h2>
              </div>

              <div className="hud-table-wrapper">
                <table className="hud-table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>#</th>
                      <th>Institutional Query</th>
                      <th style={{ width: 140 }}>Correct Key</th>
                      <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((q, idx) => (
                      <tr key={q.id}>
                        <td><span className="id-chip">Q{idx + 1}</span></td>
                        <td><strong>{q.question}</strong></td>
                        <td>
                          <span className="badge-correct">KEY: Option {q.correct_option}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="hud-delete-btn"
                            onClick={() => handleDeleteQuiz(q.id)}
                            disabled={busy}
                            title="Delete this question"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {quizzes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="hud-empty-cell">No assessment questions registered yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
