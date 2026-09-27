const express = require('express');

const router = express.Router();

// GET /public/info - open endpoint, no authentication required
router.get('/info', (req, res) => {
  return res.status(200).json({ message: 'Welcome stranger! This info is public.' });
});

module.exports = router;
