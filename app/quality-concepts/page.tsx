/**
 * /quality-concepts — Server Component
 * Consistent premium design with shared Navbar & Footer.
 */
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EliteBackBtn from '../components/EliteBackBtn';
import ConceptsClient from './ConceptsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quality Concepts — QCFI Raurkela',
  description: 'Explore the fundamental principles of Quality Management, including 5S, Kaizen, Lean, and Six Sigma.',
};

export default function QualityConceptsPage() {
  return (
    <>
      <Navbar />
      <EliteBackBtn href="/#concepts-section" label="Back to Hub" />

      {/* Page header */}
      <section className="page-header-sub">
        <div className="container">
          <span className="eyebrow eyebrow-center">[ Methodologies ]</span>
          <h1 className="font-mixed">
            Quality <span className="serif-italic">Concepts.</span>
          </h1>
          <p className="text-body" style={{ marginTop: '1.25rem', maxWidth: 620, marginInline: 'auto' }}>
            Explore the fundamental principles of Quality Management, including 5S, Kaizen, Lean, and
            Six Sigma, engineered for operational excellence.
          </p>
        </div>
      </section>

      {/* Tabs + Panels */}
      <ConceptsClient />

      {/* Shared Footer */}
      <Footer />
    </>
  );
}