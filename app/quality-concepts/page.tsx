/**
 * /quality-concepts — Server Component
 * Mirrors quality_concepts.html exactly:
 *  - EliteBackBtn (fixed top-left)
 *  - Page header with eyebrow + title + subtitle
 *  - Sticky borderless tab bar
 *  - Dynamic concept panels (title, image frame with scanner, description, secondary gallery)
 *  - Minimal footer
 */
import type { Metadata } from 'next';
import EliteBackBtn from '../components/EliteBackBtn';
import ConceptsClient from './ConceptsClient';
import { getAllConceptsWithImages } from '@/lib/supabase-db';

export const metadata: Metadata = { title: 'Quality Concepts — QCFI Raurkela' };

export default async function QualityConceptsPage() {
  const conceptData = await getAllConceptsWithImages();

  return (
    <>
      <EliteBackBtn href="/#concepts-section" label="Back to Hub" />

      {/* Page header */}
      <section className="page-header-sub">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="eyebrow eyebrow-center">Methodologies</span>
          <h1 className="font-mixed">
            Quality <span className="serif-italic">Concepts.</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#4A5568', maxWidth: 600, margin: '1.5rem auto 0', position: 'relative', zIndex: 2 }}>
            Explore the fundamental principles of Quality Management, including 5S, Kaizen, Lean, and
            Six Sigma, engineered for operational excellence.
          </p>
        </div>
      </section>

      {/* Tabs + Panels — client */}
      <ConceptsClient conceptData={conceptData} />

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--text-dark)', color: 'white', padding: '4rem 5%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
        &copy; 2026 QCFI Raurkela Chapter. All Rights Reserved. Engineered for Excellence.
      </footer>
    </>
  );
}
