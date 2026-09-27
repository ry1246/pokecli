import type { PokeApiPokemon } from "../types/pokemon.js";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export async function fetchPokemon(name: string): Promise<PokeApiPokemon> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${name.toLowerCase()}`);

  if (!res.ok) {
    throw new Error(`PokeAPI request failed: ${res.status} (name=${name})`);
  }

  return (await res.json()) as PokeApiPokemon;
}
