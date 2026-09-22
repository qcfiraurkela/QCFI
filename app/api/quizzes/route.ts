/**
 * GET  /api/quizzes   → all quiz questions (public – needed for quiz page)
 * POST /api/quizzes   → add a question (admin only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { getAllQuizzes, insertQuiz } from '@/lib/supabase-db';

export async function GET() {
  const quizzes = await getAllQuizzes();
  return NextResponse.json(quizzes);
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({});
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.adminLoggedIn) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const body = await req.json();
  const { question, option_a, option_b, option_c, option_d, correct_option } =
    body as {
      question: string;
      option_a: string;
      option_b: string;
      option_c: string;
      option_d: string;
      correct_option: string;
    };

  if (!question || !option_a || !option_b || !option_c || !option_d || !correct_option) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const id = await insertQuiz(question, option_a, option_b, option_c, option_d, correct_option);
  return NextResponse.json({ id }, { status: 201 });
}
