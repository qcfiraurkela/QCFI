/**
 * DELETE /api/magazines/[id]  → deletes a magazine (admin only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { deleteMagazine } from '@/lib/supabase-db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = NextResponse.json({});
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    if (!session.adminLoggedIn) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    await deleteMagazine(id);
    revalidatePath('/');
    revalidatePath('/magazine');
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[DELETE /api/magazines]', e);
    return NextResponse.json({ error: 'Failed to delete magazine' }, { status: 500 });
  }
}
