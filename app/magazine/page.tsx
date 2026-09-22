/**
 * /magazine — Server Component
 * Mirrors templates/magazine.html
 */
import type { Metadata } from 'next';
import { getAllMagazines } from '@/lib/db';
import MagazineClient from './MagazineClient';

export const metadata: Metadata = {
  title: 'Magazines | QCFI Rourkela Chapter',
  description: 'Interactive flipbooks documenting industrial excellence and continuous improvement.',
};

export default function MagazinePage() {
  const magazines = getAllMagazines();

  return <MagazineClient magazines={magazines} />;
}
