import { promises as fs } from 'fs';
import path from 'path';

const APPDATA_PATH = path.join(process.cwd(), 'public', 'appdata');

export async function ensureDirectories() {
  const dirs = [
    path.join(APPDATA_PATH, 'media', 'files'),
    path.join(APPDATA_PATH, 'media', 'data'),
    path.join(APPDATA_PATH, 'posts'),
    path.join(APPDATA_PATH, 'emails'),
    path.join(APPDATA_PATH, 'users'),
    path.join(APPDATA_PATH, 'settings'),
    path.join(APPDATA_PATH, 'expenses'),
    path.join(APPDATA_PATH, 'savings-goals'),
    path.join(APPDATA_PATH, 'tasks'),
    path.join(APPDATA_PATH, 'portfolio'),
  ];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

const cache = new Map<string, any>();

export async function readJson(filePath: string): Promise<any> {
  const fullPath = path.join(APPDATA_PATH, filePath);
  if (cache.has(fullPath)) {
    return cache.get(fullPath);
  }
  try {
    const data = await fs.readFile(fullPath, 'utf-8');
    const json = JSON.parse(data);
    cache.set(fullPath, json);
    return json;
  } catch (error) {
    throw new Error(`Failed to read JSON from ${filePath}: ${error}`);
  }
}

export async function writeJson(filePath: string, data: any): Promise<void> {
  const fullPath = path.join(APPDATA_PATH, filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
  cache.set(fullPath, data);
}

export async function deleteFile(filePath: string): Promise<void> {
  const fullPath = path.join(APPDATA_PATH, filePath);
  await fs.unlink(fullPath);
  cache.delete(fullPath);
}

export async function listDir(dirPath: string): Promise<string[]> {
  const fullPath = path.join(APPDATA_PATH, dirPath);
  try {
    const files = await fs.readdir(fullPath);
    return files;
  } catch (error) {
    return [];
  }
}

export function invalidateCache(filePath: string) {
  const fullPath = path.join(APPDATA_PATH, filePath);
  cache.delete(fullPath);
}