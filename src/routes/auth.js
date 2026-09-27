const express = require('express');
const supabase = require('../supabaseClient');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /auth/signup - create a new user account
router.post('/signup', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    // e.g. "User already registered" or "Password should be at least 6 characters"
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ user: data.user });
});

// POST /auth/login - authenticate the user and return the token pair
router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Generic message on purpose: never reveal whether the email exists.
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});

// POST /auth/logout - protected by requireAuth, so an invalid token is rejected
// before this handler ever runs.
router.post('/logout', requireAuth, async (req, res) => {
  // supabase.auth.signOut() reads the token from a locally stored session, which
  // a stateless server does not have. admin.signOut(jwt, scope) is the call that
  // signOut() itself makes internally: it presents the caller's JWT to
  // POST /auth/v1/logout. 'local' revokes this session only - 'global' would need
  // a service_role key.
  const { error } = await supabase.auth.admin.signOut(req.accessToken, 'local');

  if (error) {
    return res.status(400).json({ error: 'Sign out failed' });
  }

  return res.status(204).send();
});

module.exports = router;

