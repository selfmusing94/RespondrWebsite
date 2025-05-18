const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const pool = require('../config/database');

// GET /api/user/profile
router.get('/profile', authenticate(), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, name, email, role, phone_number FROM users WHERE user_id = ?', [req.user.user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
