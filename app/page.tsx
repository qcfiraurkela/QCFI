/**
 * Home page — Server Component.
 * Fetches all required data from SQLite on the server,
 * passes it to HomeClient for rendering + interactivity.
 */
import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeClient from './components/HomeClient';
import {
  getAllHeroImages,
  getRecentMagazines,
  getAllConceptsWithImages,
  getAllQuizzes,
} from '@/lib/db';

export const metadata: Metadata = {
  title: 'QCFI Raurkela Chapter | Industrial Excellence',
};

export default function HomePage() {
  const heroImages  = getAllHeroImages();
  const magazines   = getRecentMagazines(4);
  const conceptData = getAllConceptsWithImages();
  const quizzes     = getAllQuizzes();

  return (
    <>
      <Navbar />
      <HomeClient
        heroImages={heroImages}
        magazines={magazines}
        conceptData={conceptData}
        quizCount={quizzes.length}
      />
      <Footer />
    </>
  );
}
