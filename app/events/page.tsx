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
    <>
      <Navbar />
      <EliteBackBtn href="/" label="Back to Hub" />

      <section className="page-header-sub">
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="eyebrow eyebrow-center">[ Programmes / Conclaves ]</span>
          <h1 className="font-mixed">
            Our Latest <span className="serif-italic">Events.</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#4A5568', maxWidth: 600, margin: '1.5rem auto 0' }}>
            Stay updated with conventions, workshops, and training programs hosted by the QCFI Rourkela Chapter.
          </p>
        </div>
      </section>

      <main className="container" style={{ padding: '4rem 5%', minHeight: '50vh' }}>
        {eventData.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {eventData.map(({ event, images }) => (
              <article
                key={event.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 4px 24px rgba(5,10,20,0.06)',
                }}
              >
                <div style={{ width: '100%', height: '380px', overflow: 'hidden', background: '#f0f4f8' }}>
                  <img
                    src={`/${event.main_image_path}`}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                <div style={{ padding: '2rem 2.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span className="eyebrow" style={{ margin: 0 }}>Date: {event.event_date}</span>
                    <span className="eyebrow" style={{ margin: 0, color: 'var(--accent)' }}>Event: {event.name}</span>
                  </div>

                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem', lineHeight: 1.3 }}>
                    {event.title}
                  </h2>
                  <p style={{ color: '#4A5568', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                    {event.description}
                  </p>

                  {images.length > 0 && (
                    <>
                      <h3 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginTop: '2rem', marginBottom: '1rem' }}>
                        Event Gallery
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                        {images.map(img => (
                          <div key={img.id} style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', background: '#f0f4f8' }}>
                            <img
                              src={`/${img.image_path}`}
                              alt="Event gallery"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '0.75rem', fontWeight: 700 }}>No events currently available.</h2>
            <p style={{ color: '#718096' }}>Please check back later for upcoming events and conclaves.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}