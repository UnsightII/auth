const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapi = require('../openapi.json');

// Boot-time side effect: initializes the Supabase client from .env and
// exits with a clear message if the environment variables are missing.
require('./supabaseClient');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API routes (/auth/signup, /auth/login - more routers arrive in later stages)
app.use('/auth', require('./routes/auth'));

// API routes (/public/info)
app.use('/public', require('./routes/public'));

// API routes (/protected/profile, /protected/dashboard)
app.use('/protected', require('./routes/protected'));

// Interactive API docs, with the Authorize padlock wired to the bearer scheme
// declared in openapi.json. The spec is read from disk, so /docs always matches it.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

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
