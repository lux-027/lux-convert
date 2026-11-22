import { promises as fs } from 'fs';
import path from 'path';

export const STATS_BASE = 19238;
const KEY = 'lux-convert:converted';
const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const FILE = path.join(process.cwd(), '.data', 'stats.json');

let memory = 0;

async function redis(cmd: string): Promise<number> {
  const res = await fetch(`${redisUrl}/${cmd}`, { headers: { Authorization: `Bearer ${redisToken}` }, cache: 'no-store' });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const { result } = (await res.json()) as { result: string | number | null };
  return Number(result ?? 0);
}

async function readFile(): Promise<number> {
  try {
    return Number(JSON.parse(await fs.readFile(FILE, 'utf8')).converted) || 0;
  } catch {
    return memory;
  }
}

let fileQueue: Promise<unknown> = Promise.resolve();

async function addToFile(n: number): Promise<number> {
  const run = fileQueue.then(async () => {
    const next = (await readFile()) + n;
    memory = next;
    try {
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, JSON.stringify({ converted: next }));
    } catch {}
    return next;
  });
  fileQueue = run.catch(() => {});
  return run;
}

export async function getTotal(): Promise<number> {
  const n = redisUrl && redisToken ? await redis(`get/${KEY}`) : await readFile();
  return STATS_BASE + n;
}

export async function addConverted(n: number): Promise<number> {
  const next = redisUrl && redisToken ? await redis(`incrby/${KEY}/${n}`) : await addToFile(n);
  return STATS_BASE + next;
}
