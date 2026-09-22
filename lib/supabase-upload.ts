/**
 * lib/supabase-upload.ts
 * Uploads files to the Supabase 'media' Storage bucket.
 * Returns the relative web path (e.g. "uploads/hero_images/file.jpg")
 * that is consistent with the /uploads/* rewrite in next.config.mjs.
 */

import { supabase } from './supabase';

const ALLOWED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf',
]);

export function isAllowedFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return ALLOWED_EXTENSIONS.has(ext);
}

/**
 * Sanitise a filename — replaces spaces and unsafe chars with underscores.
 */
export function secureName(filename: string): string {
  return filename
    .replace(/[^\w.\-]/g, '_')   // keep word chars, dots, hyphens
    .replace(/^\.+/, '')          // strip leading dots
    .replace(/_{2,}/g, '_');      // collapse repeated underscores
}

/**
 * Upload a File blob to the Supabase 'media' bucket.
 * Returns the relative web path suitable for storing in the DB,
 * e.g. "uploads/hero_images/HERO_1.jpeg"
 *
 * The next.config.mjs rewrite maps /uploads/* → Supabase CDN, so
 * these paths work identically in both local dev and production.
 */
export async function saveFile(
  file: File,
  _absoluteDir: string,  // kept for API compat – not used
  subPath: string        // e.g. "uploads/hero_images"
): Promise<string> {
  const safeName = secureName(file.name);
  const storagePath = `${subPath}/${safeName}`;  // e.g. uploads/hero_images/file.jpg

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from('media')
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true, // overwrite if the same filename is re-uploaded
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  // Return the relative path that matches the /uploads/* proxy rewrite
  return storagePath;
}

/**
 * Delete a file from Supabase Storage by its relative web path.
 * e.g. deleteStorageFile("uploads/hero_images/foo.jpg")
 */
export async function deleteStorageFile(relativePath: string): Promise<void> {
  const { error } = await supabase.storage.from('media').remove([relativePath]);
  if (error) console.error('Storage delete warning:', error.message); // non-fatal
}

// Stub for API compat (not needed with Supabase)
export function getUploadDir(_subfolder: string): string {
  return '';
}
