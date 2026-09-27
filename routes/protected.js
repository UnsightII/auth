const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /protected/profile - requireAuth has already verified the token and
// attached the user, so this handler only formats the response.
router.get('/profile', requireAuth, (req, res) => {
  const { id, email, created_at } = req.user;

  return res.status(200).json({ user: { id, email, created_at } });
});

// GET /protected/dashboard - a second protected route that inherits the exact
// same guard, which is the point of the middleware.
router.get('/dashboard', requireAuth, (req, res) => {
  return res.status(200).json({
    message: `Welcome back, ${req.user.email}.`,
    user: { id: req.user.id, email: req.user.email },
  });
});

module.exports = router;
