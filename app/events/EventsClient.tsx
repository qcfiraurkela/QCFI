'use client';

import { useEffect, useState } from 'react';

type EventImage = { id: number; image_path: string };
type EventRow = { id: number; name: string; event_date: string; title: string; description: string; main_image_path: string };
type EventData = { event: EventRow; images: EventImage[] };

export default function EventsClient() {
  const [eventData, setEventData] = useState<EventData[]>([]);

  useEffect(() => {
    const fetch_ = () =>
      fetch('/api/events').then(r => r.json()).then(setEventData).catch(() => {});
    fetch_();
    const id = setInterval(fetch_, 5000);
    return () => clearInterval(id);
  }, []);

  if (eventData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4A5568' }}>
        <p className="text-body">No events scheduled at this time. Please check back later.</p>
      </div>
    );
  }

  return (
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
          <div style={{ width: '100%', height: 'clamp(200px, 40vw, 400px)', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
            <img
              src={`/${event.main_image_path}`}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.85rem' }}>
                  {images.map(img => (
                    <div key={img.id} style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--bg-secondary)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                      <img
                        src={`/${img.image_path}`}
                        alt={`${event.title} gallery`}
                        loading="lazy"
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
  );
}
