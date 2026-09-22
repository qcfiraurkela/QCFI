import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFFFFF',
};

export const metadata: Metadata = {
  title: {
    default: 'QCFI Raurkela Chapter | Industrial Excellence',
    template: '%s | QCFI Raurkela',
  },
  description:
    'Quality Circle Forum of India — Raurkela Chapter. Driving industrial methodologies and total quality management for operational excellence.',
  keywords: ['QCFI', 'Quality Circle', 'Raurkela', 'TQM', '5S', 'Kaizen', 'Lean', 'Six Sigma'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'QCFI Raurkela Chapter',
    title: 'QCFI Raurkela Chapter | Industrial Excellence',
    description:
      'Driving deep core industrial methodologies and fostering total quality management for optimal operational output.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* eslint-disable-next-line @next/next/no-page-custom-font */
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/*
         * Fonts loaded via <link> with preconnect for performance.
         * next/font/google requires build-time internet access which is unavailable
         * in this deployment environment. The preconnect + stylesheet approach
         * with display=swap provides equivalent FOUT prevention.
         */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
