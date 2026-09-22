const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vrqwhciakhwnwgwqrtnx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXdoY2lha2h3bndnd3FydG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDUxNTQsImV4cCI6MjEwNTYyMTE1NH0.O_vRh2Z2fm64cx_eiYcMYpKQnUJ5it1gqoGwWIECjG8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAllTables() {
  const tables = [
    'hero_images',
    'events',
    'event_images',
    'quality_concepts',
    'concept_images',
    'quizzes',
    'magazines'
  ];

  console.log('--- Verifying Supabase Tables ---');
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`[FAIL] Table ${table}:`, error.message);
    } else {
      console.log(`[PASS] Table ${table}: ${data.length} records retrieved successfully.`);
    }
  }
}

verifyAllTables();
