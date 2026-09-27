const express = require('express');
const supabase = require('../supabaseClient');

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

module.exports = router;

