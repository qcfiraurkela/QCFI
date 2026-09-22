/**
 * /quiz — Server Component
 * Mirrors templates/quiz.html
 */
import type { Metadata } from 'next';
import QuizClient from './QuizClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quiz Assessment | QCFI Raurkela',
  description: 'Evaluate your proficiency in operational methodologies and Quality Concepts.',
};

export default function QuizPage() {
  return <QuizClient />;
}
