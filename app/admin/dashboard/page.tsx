/**
 * /admin/dashboard — Server Component
 * Authenticated administration portal.
 * Mirrors templates/admin_dashboard.html
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import {
  getAllHeroImages,
  getAllEvents,
  getAllConcepts,
  getAllQuizzes,
  getAllMagazines,
} from '@/lib/supabase-db';
import DashboardClient from './DashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - QCFI Rourkela',
};

export default async function AdminDashboardPage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.adminLoggedIn) {
    redirect('/admin/login');
  }

  const heroImages = await getAllHeroImages();
  const events = await getAllEvents();
  const concepts = await getAllConcepts();
  const quizzes = await getAllQuizzes();
  const magazines = await getAllMagazines();

  return (
    <DashboardClient
      initialHeroImages={heroImages}
      initialEvents={events}
      initialConcepts={concepts}
      initialQuizzes={quizzes}
      initialMagazines={magazines}
    />
  );
}
