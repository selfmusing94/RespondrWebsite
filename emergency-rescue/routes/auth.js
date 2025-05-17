const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const router = express.Router();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password });
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    console.log('User from DB:', user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.password_hash) {
      console.error('No password stored for user:', email);
      return res.status(500).json({ message: 'User account error' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role }, // Use user_id to match DB
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, userId: user.user_id, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  const { name, email, password, role, phone_number, address } = req.body;
  console.log('Signup request:', { name, email, password, role, phone_number, address });
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }
    const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, password_hash, role, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone_number || null, address || null]
    );
    const token = jwt.sign(
      { user_id: result.insertId, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, userId: result.insertId, role });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;