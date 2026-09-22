/**
 * /events — Server Component
 * Consistent premium design matching the QCFI landing page aesthetic.
 */
import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import EliteBackBtn from '@/app/components/EliteBackBtn';
import { getAllEventsWithImages } from '@/lib/supabase-db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events — QCFI Raurkela Chapter',
  description: 'Conventions, workshops, and training programs by QCFI Rourkela Chapter.',
};

export default async function EventsPage() {
  const eventData = await getAllEventsWithImages();

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
        {eventData.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: 1000, margin: '0 auto' }}>
            {eventData.map(({ event, images }) => (
              <article
                key={event.id}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 8px 30px rgba(8,23,56,0.05)',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                }}
              >
                <div style={{ width: '100%', height: '400px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                  <img
                    src={`/${event.main_image_path}`}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                <div style={{ padding: '2.5rem 3rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="eyebrow" style={{ margin: 0 }}>Date: {event.event_date}</span>
                    <span className="eyebrow" style={{ margin: 0, color: 'var(--accent)' }}>Event: {event.name}</span>
                  </div>

                  <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.25rem', lineHeight: 1.3 }}>
                    {event.title}
                  </h2>
                  <p className="text-body" style={{ whiteSpace: 'pre-wrap' }}>
                    {event.description?.trim()}
                  </p>

                  {images.length > 0 && (
                    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
                      <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: '1.25rem' }}>
                        Event Gallery
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                        {images.map(img => (
                          <div key={img.id} style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--bg-secondary)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                            <img
                              src={`/${img.image_path}`}
                              alt="Event gallery"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4A5568' }}>
            <p className="text-body">No events scheduled at this time. Please check back later.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}