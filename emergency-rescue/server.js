require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('DB Connection Error:', err);
    return;
  }
  console.log('DB Connected');
});

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});