import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ShareRecord {
  token: string;
  content: string;
  expiresAt: number; // unix ms
  passwordHash?: string;
}

const DATA_PATH = path.join(__dirname, '..', 'data', 'shares.json');

function load(): ShareRecord[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(records: ShareRecord[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(records, null, 2));
}

export function createShare(content: string, expiresInSeconds: number, password?: string): ShareRecord {
  const records = load();
  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const passwordHash = password ? crypto.createHash('sha256').update(password).digest('hex') : undefined;
  const record: ShareRecord = { token, content, expiresAt, passwordHash };
  records.push(record);
  save(records);
  return record;
}

export function findShare(token: string): ShareRecord | undefined {
  const records = load();
  return records.find(r => r.token === token);
}

export function removeShare(token: string) {
  const records = load().filter(r => r.token !== token);
  save(records);
}

export function removeExpired(): number {
  const now = Date.now();
  const records = load();
  const valid = records.filter(r => r.expiresAt > now);
  const removed = records.length - valid.length;
  if (removed > 0) save(valid);
  return removed;
}
