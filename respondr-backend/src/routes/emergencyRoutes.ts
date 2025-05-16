import { Router, Request, Response } from 'express';
import pool from '../config/db';

const router = Router();

router.get('/emergencies', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM emergencies');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/emergencies', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO emergencies (title, description) VALUES (?, ?)',
      [title, description || null]
    );
    return res.status(201).json({ id: (result as any).insertId, title, description });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;