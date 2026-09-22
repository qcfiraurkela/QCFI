import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { insertQuiz } from '@/lib/db';

export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(req, NextResponse.next(), sessionOptions);
  if (!session.adminLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    const formData = await req.formData();
    const question = formData.get('question') as string;
    const option_a = formData.get('option_a') as string;
    const option_b = formData.get('option_b') as string;
    const option_c = formData.get('option_c') as string;
    const option_d = formData.get('option_d') as string;
    const correct_option = formData.get('correct_option') as string;

    if (question && option_a && option_b && option_c && option_d && correct_option) {
      insertQuiz(question, option_a, option_b, option_c, option_d, correct_option);
    }
  } catch (e) {
    console.error('Error in /add_quiz:', e);
  }

  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}
