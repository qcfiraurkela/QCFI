const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vrqwhciakhwnwgwqrtnx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXdoY2lha2h3bndnd3FydG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDUxNTQsImV4cCI6MjEwNTYyMTE1NH0.O_vRh2Z2fm64cx_eiYcMYpKQnUJ5it1gqoGwWIECjG8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to Supabase project: vrqwhciakhwnwgwqrtnx...');
  try {
    const { data, error } = await supabase.from('hero_images').select('*').limit(1);
    if (error) {
      console.log('Query result error (expected if table not created yet):', error.message, error.code);
    } else {
      console.log('Query successful, records found:', data ? data.length : 0);
    }
    
    // Check storage buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.log('Bucket check error:', bucketError.message);
    } else {
      console.log('Buckets found:', buckets.map(b => b.name));
    }
  } catch (err) {
    console.error('Fatal connection error:', err);
  }
}

testConnection();
