/**
 * lib/supabase-upload.ts
 * Uploads files to the Supabase 'media' Storage bucket.
 * Returns the relative web path (e.g. "uploads/hero_images/file.jpg")
 * consistent with the /uploads/* rewrite in next.config.mjs.
 */

import path from 'path';
import { supabase } from './supabase';

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
 * Sanitise filename — removes directory traversal and unsafe characters.
 */
export function secureName(filename: string): string {
  const basename = path.basename(filename);
  return basename
    .replace(/[^\w.\-]/g, '_')
    .replace(/^\.+/, '')
    .replace(/_{2,}/g, '_')
    .slice(0, 200);
}

/**
 * Upload a File blob to the Supabase 'media' bucket.
 * Returns the relative web path for storing in the DB.
 */
export async function saveFile(
  file: File,
  _absoluteDir: string,  // kept for API compat — not used
  subPath: string
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const safeName = secureName(file.name);
  if (!safeName) throw new Error('Invalid filename after sanitisation');

  // Add timestamp prefix to prevent filename collisions
  const uniqueName = `${Date.now()}_${safeName}`;
  const storagePath = `${subPath}/${uniqueName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from('media')
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  return storagePath;
}

/**
 * Delete a file from Supabase Storage by its relative web path.
 */
export async function deleteStorageFile(relativePath: string): Promise<void> {
  const { error } = await supabase.storage.from('media').remove([relativePath]);
  if (error) {
    // Non-fatal — log but don't throw (file may already be gone)
    console.error('Storage delete warning:', error.message);
  }
}

// Stub for API compat
export function getUploadDir(_subfolder: string): string {
  return '';
}
