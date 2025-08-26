import { Router } from 'express';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { createShare, findShare, removeShare } from '../utils/sharesStore';

const router = Router();
const MAX_CONTENT_BYTES = 1024 * 1024; // 1 MB limit

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_PATH = path.join(LOG_DIR, 'access.log');
const LOG_MAX_SIZE = parseInt(process.env.ACCESS_LOG_MAX_BYTES || '1048576', 10); // 1MB default

async function logAccess(token: string, success: boolean, message: string) {
  const line = `${new Date().toISOString()} token=${token} success=${success} message=${message}\n`;
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    let size = 0;
    try {
      const stats = await fs.stat(LOG_PATH);
      size = stats.size;
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err;
    }
    if (size >= LOG_MAX_SIZE) {
      const rotated = path.join(LOG_DIR, `access-${Date.now()}.log`);
      await fs.rename(LOG_PATH, rotated);
    }
    await fs.appendFile(LOG_PATH, line);
  } catch (err) {
    console.error(err);
  }
}

router.post('/share', async (req, res) => {
  const { content, expiresInSeconds, password } = req.body;
  if (!content || !expiresInSeconds) {
    return res.status(400).json({ error: 'content and expiresInSeconds required' });
  }

  const contentSize = Buffer.byteLength(content, 'utf8');
  if (contentSize > MAX_CONTENT_BYTES) {
    return res.status(400).json({ error: 'content too large' });
  }

  try {
    const record = await createShare(content, expiresInSeconds, password);
    res.json({ token: record.token, expiresAt: record.expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

router.get('/share/:token', async (req, res) => {
  const token = req.params.token;
  const password = req.query.password as string | undefined;
  const share = await findShare(token);
  if (!share) {
    logAccess(token, false, 'not_found');
    return res.status(404).json({ error: 'not found' });
  }
  if (share.expiresAt <= Date.now()) {
    await removeShare(token);
    logAccess(token, false, 'expired');
    return res.status(410).json({ error: 'expired' });
  }
  if (share.passwordHash) {
    if (!password) {
      logAccess(token, false, 'password_required');
      return res.status(401).json({ error: 'password required' });
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (hash !== share.passwordHash) {
      logAccess(token, false, 'wrong_password');
      return res.status(403).json({ error: 'invalid password' });
    }
  }
  logAccess(token, true, 'success');
  res.json({ content: share.content, expiresAt: share.expiresAt });
});

export default router;
