const supabase = require('../supabaseClient');

/**
 * requireAuth - reusable guard for every protected route.
 *
 * Parses `Authorization: Bearer <token>`, asks Supabase to verify it, and
 * attaches the verified user to `req.user` (plus the raw token on
 * `req.accessToken`) so route handlers never touch token parsing themselves.
 * Any failure short-circuits with a 401 and the handler never runs.
 */
async function requireAuth(req, res, next) {
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

  req.user = data.user;
  req.accessToken = token;

  return next();
}

module.exports = { requireAuth };
