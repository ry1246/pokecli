import type { PokeApiPokemon } from "../types/pokemon.js";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export class PokemonNotFoundError extends Error {
  constructor(name: string) {
    super(`ポケモンが見つかりませんでした: ${name}`);
    this.name = "POkemonNotFoundError";
  }
}

export async function fetchPokemon(name: string): Promise<PokeApiPokemon> {
  let res: Response;
  try {
    res = await fetch(`${POKEAPI_BASE}/pokemon/${name.toLowerCase()}`);
  } catch (cause) {
    throw new Error(`PokeAPIへの接続に失敗: ${(cause as Error).message}`);
  }

  if (res.status === 404) {
    throw new PokemonNotFoundError(name);
  }

  if (!res.ok) {
    throw new Error(`PokeAPI request failed: ${res.status} (name=${name})`);
  }

  return (await res.json()) as PokeApiPokemon;
}
