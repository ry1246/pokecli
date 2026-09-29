import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { PokeApiPokemon } from "../types/pokemon.js";

const CACHE_DIR = join(homedir(), ".pokecli");
const CACHE_FILE = join(CACHE_DIR, "cache.json");

type Cache = Record<string, PokeApiPokemon>;

async function readCache(): Promise<Cache> {
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(raw) as Cache;
  } catch {
    return {};
  }
}

async function writeCache(cache: Cache): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
}

export async function getCachedPokemon(name: string): Promise<PokeApiPokemon | undefined> {
  const cache = await readCache();
  return cache[name.toLowerCase()];
}

export async function saveCachedPokemon(name: string, data: PokeApiPokemon): Promise<void> {
  const cache = await readCache();
  cache[name.toLowerCase()] = data;
  await writeCache(cache);
}
