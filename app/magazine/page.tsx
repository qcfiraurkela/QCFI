/**
 * /magazine — Server Component
 * Mirrors templates/magazine.html
 */
import type { Metadata } from 'next';
import MagazineClient from './MagazineClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Magazines | QCFI Rourkela Chapter',
  description: 'Interactive flipbooks documenting industrial excellence and continuous improvement.',
};

export default function MagazinePage() {
  return <MagazineClient />;
}
