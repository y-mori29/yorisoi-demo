import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

/** ESM で __dirname を使えるようにする */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ShareRecord {
  token: string;
  content: string;
  /** unix ms */
  expiresAt: number;
  passwordHash?: string;
}

/**
 * Cloud Run はコンテナのファイルシステムが基本 read-only のため
 * 書き込みは /tmp を使う（環境変数で上書き可能）
 */
const DATA_DIR = process.env.SHARES_DIR || '/tmp/yorisoi-data';
const DATA_PATH = path.join(DATA_DIR, 'shares.json');

/** 失敗しないように必ずディレクトリを用意する */
async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/** シンプルな Mutex（TS strict でも OK な実装） */
class Mutex {
  private mutex = Promise.resolve();

  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    let release: (() => void) | null = null;
    const p = new Promise<void>((res) => {
      release = res;
    });
    const prev = this.mutex;
    this.mutex = prev.then(() => p);
    await prev;
    try {
      return await fn();
    } finally {
      if (release) release();
    }
  }
}

const fileMutex = new Mutex();

async function load(): Promise<ShareRecord[]> {
  try {
    await ensureDir();
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    try {
      return JSON.parse(raw);
    } catch {
      // 壊れていたら初期化
      return [];
    }
  } catch (err: any) {
    if (err?.code === 'ENOENT') return [];
    throw err;
  }
}

async function save(records: ShareRecord[]) {
  await ensureDir();
  const tmpPath = path.join(
    DATA_DIR,
    `shares.${crypto.randomBytes(6).toString('hex')}.tmp.json`
  );
  await fs.writeFile(tmpPath, JSON.stringify(records, null, 2), 'utf-8');
  await fs.rename(tmpPath, DATA_PATH);
}

export async function createShare(
  content: string,
  expiresInSeconds: number,
  password?: string
): Promise<ShareRecord> {
  return fileMutex.runExclusive(async () => {
    const records = await load();
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const passwordHash = password
      ? crypto.createHash('sha256').update(password).digest('hex')
      : undefined;

    const record: ShareRecord = { token, content, expiresAt, passwordHash };
    records.push(record);
    await save(records);
    return record;
  });
}

export async function findShare(token: string): Promise<ShareRecord | undefined> {
  const records = await load();
  return records.find((r) => r.token === token);
}

export async function removeShare(token: string): Promise<void> {
  await fileMutex.runExclusive(async () => {
    const records = (await load()).filter((r) => r.token !== token);
    await save(records);
  });
}

export async function removeExpired(): Promise<number> {
  return fileMutex.runExclusive(async () => {
    const now = Date.now();
    const records = await load();
    const valid = records.filter((r) => r.expiresAt > now);
    const removed = records.length - valid.length;
    if (removed > 0) await save(valid);
    return removed;
  });
}
