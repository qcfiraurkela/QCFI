/**
 * lib/db.ts
 * Supabase-backed data layer (re-exports from supabase-db for backwards compatibility).
 * Eliminates better-sqlite3 dependency for cloud deployments (Vercel).
 */

import path from 'path';
import fs from 'fs';

export * from './supabase-db';

// ── Upload directory helper (legacy fallback) ──────────────────────────────
export function getUploadDir(subfolder: string): string {
  const dir = path.join(process.cwd(), 'public', 'uploads', subfolder);
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {}
  return dir;
}
