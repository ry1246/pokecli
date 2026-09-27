export interface PokeApiStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokeApiType {
  type: {
    name: string;
  };
}

export interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokeApiType[];
  stats: PokeApiStat[];
}
