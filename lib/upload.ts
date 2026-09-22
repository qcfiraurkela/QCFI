/**
 * lib/upload.ts
 * Shared multipart/file upload helper.
 * Parses FormData from a Next.js Route Handler and writes files to disk.
 */

import path from 'path';
import fs from 'fs/promises';

const ALLOWED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf',
]);

// 10 MB file size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function isAllowedFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return ALLOWED_EXTENSIONS.has(ext);
}

/**
 * Sanitise a filename — removes path separators, leading dots, and unsafe chars.
 * Prevents path traversal attacks.
 */
export function secureName(filename: string): string {
  // Strip any directory components first (prevents ../ traversal)
  const basename = path.basename(filename);
  return basename
    .replace(/[^\w.\-]/g, '_')   // keep word chars, dots, hyphens
    .replace(/^\.+/, '')          // strip leading dots
    .replace(/_{2,}/g, '_')       // collapse repeated underscores
    .slice(0, 200);               // cap length
}

/**
 * Save a File blob to the given absolute directory.
 * Returns the relative web path suitable for storing in the DB.
 */
export async function saveFile(
  file: File,
  absoluteDir: string,
  subPath: string
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const safeName = secureName(file.name);
  if (!safeName) throw new Error('Invalid filename after sanitisation');

  const destPath = path.join(absoluteDir, safeName);

  // Verify the resolved path stays inside absoluteDir (double-check traversal)
  const resolvedDest = path.resolve(destPath);
  const resolvedDir = path.resolve(absoluteDir);
  if (!resolvedDest.startsWith(resolvedDir + path.sep) && resolvedDest !== resolvedDir) {
    throw new Error('Path traversal detected — upload rejected');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);
  return `${subPath}/${safeName}`;
}
