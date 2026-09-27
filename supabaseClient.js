const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    'Missing SUPABASE_URL and/or SUPABASE_KEY. ' +
      'Create a .env file in the project root with both values (see project.md, Stage 0).'
  );
  process.exit(1);
}

// Server-side Supabase client.
// persistSession and autoRefreshToken are disabled because a server must not
// keep auth state between requests - each request carries its own token.
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = supabase;
