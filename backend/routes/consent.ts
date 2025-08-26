import { Router } from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = Router();

const dbPromise = open({
  filename: './data.sqlite',
  driver: sqlite3.Database,
});

export async function initConsentTable() {
  const db = await dbPromise;
  await db.exec(`CREATE TABLE IF NOT EXISTS consents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    consent INTEGER,
    time TEXT,
    ip TEXT,
    user_agent TEXT
  )`);
}

router.post('/', async (req, res) => {
  const { userId, consent } = req.body;
  const db = await dbPromise;

  const time = new Date().toISOString();
  const ip = req.ip;
  const ua = req.get('User-Agent') || '';

  try {
    await db.run(
      'INSERT INTO consents (user_id, consent, time, ip, user_agent) VALUES (?, ?, ?, ?, ?)',
      userId,
      consent ? 1 : 0,
      time,
      ip,
      ua
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'failed to save consent' });
  }
});

export default router;

