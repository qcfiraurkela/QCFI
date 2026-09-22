/**
 * Home page — Server Component.
 * Fetches all required data from SQLite on the server,
 * passes it to HomeClient for rendering + interactivity.
 */
import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeClient from './components/HomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'QCFI Raurkela Chapter | Industrial Excellence',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HomeClient />
      <Footer />
    </>
  );
}
