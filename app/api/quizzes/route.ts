/**
 * GET  /api/quizzes   → all quiz questions (public)
 * POST /api/quizzes   → add a question (admin only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { getAllQuizzes, insertQuiz } from '@/lib/supabase-db';

export async function GET() {
  try {
    const quizzes = await getAllQuizzes();
    return NextResponse.json(quizzes);
  } catch (e) {
    console.error('[GET /api/quizzes]', e);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

    // Validate correct_option is one of A-D
    if (!['A', 'B', 'C', 'D'].includes(correct_option)) {
      return NextResponse.json({ error: 'correct_option must be A, B, C, or D' }, { status: 400 });
    }

    const id = await insertQuiz(question, option_a, option_b, option_c, option_d, correct_option);
    revalidatePath('/');
    revalidatePath('/quiz');
    return NextResponse.json(
      { id, question, option_a, option_b, option_c, option_d, correct_option },
      { status: 201 }
    );
  } catch (e) {
    console.error('[POST /api/quizzes]', e);
    return NextResponse.json({ error: 'Failed to add question' }, { status: 500 });
  }
}
