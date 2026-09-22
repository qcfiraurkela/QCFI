/**
 * lib/upload.ts
 * Shared multipart/file upload helper using the built-in Web Request API.
 * Parses FormData from a Next.js Route Handler request and writes files to disk.
 * No external multer needed for App Router — Next.js 14 supports formData() natively.
 */

import path from 'path';
import fs from 'fs/promises';

const ALLOWED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf',
]);

export function isAllowedFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return ALLOWED_EXTENSIONS.has(ext);
}

/**
 * Sanitise a filename — replaces spaces and unsafe chars with underscores.
 * Mirrors Werkzeug's secure_filename.
 */
export function secureName(filename: string): string {
  return filename
    .replace(/[^\w.\-]/g, '_')   // keep word chars, dots, hyphens
    .replace(/^\.+/, '')          // strip leading dots
    .replace(/_{2,}/g, '_');      // collapse repeated underscores
}

/**
 * Save a File blob to the given absolute directory.
 * Returns the relative web path suitable for storing in the DB
 * e.g. "uploads/hero_images/HERO_1.jpeg"
 */
export async function saveFile(
  file: File,
  absoluteDir: string,
  subPath: string   // e.g. "uploads/hero_images"
): Promise<string> {
  const safeName = secureName(file.name);
  const destPath = path.join(absoluteDir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);
  return `${subPath}/${safeName}`;
}
