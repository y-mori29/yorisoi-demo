import { Router } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createShare, findShare, removeShare } from '../utils/sharesStore';

const router = Router();
const LOG_PATH = path.join(__dirname, '..', 'logs', 'access.log');

function logAccess(token: string, success: boolean, message: string) {
  const line = `${new Date().toISOString()} token=${token} success=${success} message=${message}\n`;
  fs.appendFile(LOG_PATH, line, err => { if (err) console.error(err); });
}

router.post('/share', async (req, res) => {
  const { content, expiresInSeconds, password } = req.body;
  if (!content || !expiresInSeconds) {
    return res.status(400).json({ error: 'content and expiresInSeconds required' });
  }
  try {
    const record = await createShare(content, expiresInSeconds, password);
    res.json({ token: record.token, expiresAt: record.expiresAt });
  } catch (err) {
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
