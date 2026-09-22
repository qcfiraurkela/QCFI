const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vrqwhciakhwnwgwqrtnx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXdoY2lha2h3bndnd3FydG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDUxNTQsImV4cCI6MjEwNTYyMTE1NH0.O_vRh2Z2fm64cx_eiYcMYpKQnUJ5it1gqoGwWIECjG8';

const supabase = createClient(supabaseUrl, supabaseKey);
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

async function getFiles(dir) {
  const subdirs = await fs.promises.readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await fs.promises.stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.svg': 'image/svg+xml'
  };
  return map[ext] || 'application/octet-stream';
}

async function uploadAll() {
  console.log('Uploading media files to Supabase Storage bucket "media"...');
  const allFiles = await getFiles(uploadsDir);
  console.log(`Found ${allFiles.length} files to upload.`);

  let success = 0;
  let failed = 0;

  for (const fullPath of allFiles) {
    const relPath = path.relative(path.join(__dirname, '..', 'public'), fullPath).replace(/\\/g, '/');
    const fileBuffer = fs.readFileSync(fullPath);
    const contentType = getMimeType(fullPath);

    const { data, error } = await supabase.storage
      .from('media')
      .upload(relPath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`[FAIL] ${relPath}: ${error.message}`);
      failed++;
    } else {
      console.log(`[OK] ${relPath}`);
      success++;
    }
  }

  console.log(`\nUpload complete: ${success} succeeded, ${failed} failed.`);
}

uploadAll();
