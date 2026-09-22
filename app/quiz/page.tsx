/**
 * /quiz — Server Component
 * Mirrors templates/quiz.html
 */
import type { Metadata } from 'next';
import { getAllQuizzes } from '@/lib/db';
import QuizClient from './QuizClient';

export const metadata: Metadata = {
  title: 'Quiz Assessment | QCFI Raurkela',
  description: 'Evaluate your proficiency in operational methodologies and Quality Concepts.',
};

export default function QuizPage() {
  const quizzes = getAllQuizzes();

  return <QuizClient quizzes={quizzes} />;
}
