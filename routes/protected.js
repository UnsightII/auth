const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

// GET /protected/profile - requires an Authorization: Bearer <token> header.
router.get('/profile', async (req, res) => {
  // Splits "Bearer <token>" into its parts and tolerates extra whitespace.
  // Lowercased scheme comparison keeps "bearer" working, as HTTP schemes are
  // case-insensitive, while anything else is treated as a bad request.
  const [scheme, token] = (req.headers.authorization ?? '').trim().split(/\s+/);

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Supabase validates the signature, expiry and revocation of the token.
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Only the metadata the brief asks for - the raw user record is never echoed.
  const { id, email, created_at } = data.user;

  return res.status(200).json({ user: { id, email, created_at } });
});

module.exports = router;
