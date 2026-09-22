import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'QCFI Raurkela Chapter | Industrial Excellence',
    template: '%s | QCFI Raurkela',
  },
  description:
    'Quality Circle Forum of India – Raurkela Chapter. Driving industrial methodologies and total quality management for operational excellence.',
  keywords: ['QCFI', 'Quality Circle', 'Raurkela', 'TQM', '5S', 'Kaizen', 'Lean', 'Six Sigma'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'QCFI Raurkela Chapter',
    title: 'QCFI Raurkela Chapter | Industrial Excellence',
    description: 'Driving deep core industrial methodologies and fostering total quality management for optimal operational output.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
