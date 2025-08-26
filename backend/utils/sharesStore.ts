import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ShareRecord {
  token: string;
  content: string;
  expiresAt: number; // unix ms
  passwordHash?: string;
}

const DATA_PATH = path.join(__dirname, '..', 'data', 'shares.json');

class Mutex {
  private mutex = Promise.resolve();
  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    let release: () => void;
    const p = new Promise<void>(res => (release = res));
    const prev = this.mutex;
    this.mutex = prev.then(() => p);
    await prev;
    try {
      return await fn();
    } finally {
      release();
    }
  }
}

const fileMutex = new Mutex();

async function load(): Promise<ShareRecord[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function save(records: ShareRecord[]) {
  const tmpPath = `${DATA_PATH}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(records, null, 2), 'utf-8');
  await fs.rename(tmpPath, DATA_PATH);
}

export async function createShare(content: string, expiresInSeconds: number, password?: string): Promise<ShareRecord> {
  return fileMutex.runExclusive(async () => {
    const records = await load();
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const passwordHash = password ? crypto.createHash('sha256').update(password).digest('hex') : undefined;
    const record: ShareRecord = { token, content, expiresAt, passwordHash };
    records.push(record);
    await save(records);
    return record;
  });
}

export async function findShare(token: string): Promise<ShareRecord | undefined> {
  const records = await load();
  return records.find(r => r.token === token);
}

export async function removeShare(token: string): Promise<void> {
  await fileMutex.runExclusive(async () => {
    const records = (await load()).filter(r => r.token !== token);
    await save(records);
  });
}

export async function removeExpired(): Promise<number> {
  return fileMutex.runExclusive(async () => {
    const now = Date.now();
    const records = await load();
    const valid = records.filter(r => r.expiresAt > now);
    const removed = records.length - valid.length;
    if (removed > 0) await save(valid);
    return removed;
  });
}
