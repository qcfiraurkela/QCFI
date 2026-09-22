/**
 * /events — Server Component
 * Preserves the original events.html design exactly:
 *  - Blue sticky navbar header
 *  - Page header with title + subtitle
 *  - Event cards: main image (400px), metadata bar, title, description (pre-wrap), gallery grid
 *  - Empty-state fallback
 *  - Dark footer
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllEventsWithImages } from '@/lib/supabase-db';

export const metadata: Metadata = { title: 'Events — QCFI Raurkela Chapter' };

export default async function EventsPage() {
  const eventData = await getAllEventsWithImages();

  return (
    <>
      {/* ── Blue sticky navigation (matches original events.html header) ── */}
      <header className="events-nav">
        <div className="events-nav-container">
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>QCFI Rourkela</div>
          <ul className="events-nav-links">
            <li><Link href="/" style={{ color: 'white', fontWeight: 500 }}>Home</Link></li>
            <li><Link href="/quality-concepts" style={{ color: 'white', fontWeight: 500 }}>Quality Concepts</Link></li>
            <li><span style={{ color: '#ffc107', fontWeight: 500 }}>Events</span></li>
            <li><Link href="/magazine" style={{ color: 'white', fontWeight: 500 }}>Magazines</Link></li>
            <li><Link href="/quiz" style={{ color: 'white', fontWeight: 500 }}>Quiz</Link></li>
          </ul>
        </div>
      </header>

      {/* ── Main container ── */}
      <div style={{ width: '90%', maxWidth: 1000, margin: '40px auto' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, color: '#004085', marginBottom: 15 }}>Our Latest Events</h1>
          <p style={{ fontSize: 18, color: '#666' }}>
            Stay updated with conventions, workshops, and training programs hosted by the QCFI Rourkela Chapter.
          </p>
        </div>

        {/* Event cards */}
        {eventData.length > 0 ? (
          eventData.map(({ event, images }) => (
            <div key={event.id} className="event-card">
              {/* Main image */}
              <img
                src={`/${event.main_image_path}`}
                alt="Event Main Image"
                className="main-event-img"
              />

              <div className="event-content">
                {/* Metadata bar */}
                <div className="event-meta">
                  <span>Event: {event.name}</span>
                  <span>Date: {event.event_date}</span>
                </div>

                {/* Title & description */}
                <h2 className="event-title">{event.title}</h2>
                <p className="event-description">{event.description}</p>

                {/* Additional images gallery */}
                {images.length > 0 && (
                  <>
                    <h3 className="gallery-header">Event Gallery</h3>
                    <div className="gallery-grid">
                      {images.map(img => (
                        <img
                          key={img.id}
                          src={`/${img.image_path}`}
                          alt="Event Gallery Image"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: 50, background: 'white', borderRadius: 8, border: '1px solid #ddd' }}>
            <h2 style={{ color: '#004085', marginBottom: 15 }}>No events currently available.</h2>
            <p style={{ color: '#555' }}>Please check back later or wait for the administrator to add upcoming events.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: '#343a40', color: 'white', textAlign: 'center', padding: '20px 0', marginTop: 50 }}>
        <p>&copy; 2026 QCFI Raurkela Chapter. All Rights Reserved.</p>
      </footer>
    </>
  );
}
