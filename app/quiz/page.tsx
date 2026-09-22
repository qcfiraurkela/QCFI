/**
 * /quiz — Server Component
 * Mirrors templates/quiz.html
 */
import type { Metadata } from 'next';
import { getAllQuizzes } from '@/lib/supabase-db';
import QuizClient from './QuizClient';

export const metadata: Metadata = {
  title: 'Quiz Assessment | QCFI Raurkela',
  description: 'Evaluate your proficiency in operational methodologies and Quality Concepts.',
};

export default async function QuizPage() {
  const quizzes = await getAllQuizzes();

  return <QuizClient quizzes={quizzes} />;
}
