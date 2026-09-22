/**
 * /events — Server Component
 * Consistent premium design matching the QCFI landing page aesthetic.
 */
import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import EliteBackBtn from '@/app/components/EliteBackBtn';
import EventsClient from './EventsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events — QCFI Raurkela Chapter',
  description: 'Conventions, workshops, and training programs by QCFI Rourkela Chapter.',
};

export default function EventsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <EliteBackBtn href="/#events-section" label="Back to Hub" />

      <section className="page-header-sub">
        <div className="container">
          <span className="eyebrow eyebrow-center">[ Programmes & Conclaves ]</span>
          <h1 className="font-mixed">
            Our Latest <span className="serif-italic">Events.</span>
          </h1>
          <p className="text-body" style={{ marginTop: '1.25rem', maxWidth: 620, marginInline: 'auto' }}>
            Stay updated with conventions, workshops, and training programs hosted by the QCFI Rourkela Chapter.
          </p>
        </div>
      </section>

      <main className="container" style={{ padding: '4rem 5% 6rem', flex: 1 }}>
        <EventsClient />
      </main>

      <Footer />
    </div>
  );
}