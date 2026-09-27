const express = require('express');

const router = express.Router();

// GET /protected/profile - requires an Authorization: Bearer <token> header.
// Stage 2 only extracts the token; Stage 3 adds verification via getUser(token).
router.get('/profile', (req, res) => {
  // Splits "Bearer <token>" into its parts and tolerates extra whitespace.
  // Lowercased scheme comparison keeps "bearer" working, as HTTP schemes are
  // case-insensitive, while anything else is treated as a bad request.
  const [scheme, token] = (req.headers.authorization ?? '').trim().split(/\s+/);

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // The token is deliberately not echoed back into the response.
  return res.status(200).json({ message: 'Access token received. Verification arrives in Stage 3.' });
});

module.exports = router;
