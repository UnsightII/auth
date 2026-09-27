const express = require('express');

// Boot-time side effect: initializes the Supabase client from .env and
// exits with a clear message if the environment variables are missing.
require('./supabaseClient');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Smoke-test route: proves the server itself is up.
app.get('/', (req, res) => {
  res.json({ message: 'Auth Login & Protect API is running.' });
});

// Confirms the Supabase project is actually reachable before we declare success.
async function pingSupabase() {
  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/health`, {
    headers: { apikey: process.env.SUPABASE_KEY },
  });

  if (!response.ok) {
    throw new Error(`Supabase health check returned HTTP ${response.status}`);
  }
}

async function start() {
  try {
    await pingSupabase();
  } catch (error) {
    console.error(`Failed to connect to Supabase: ${error.message}`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running and connected to Supabase on http://localhost:${PORT}`);
  });
}

start();
