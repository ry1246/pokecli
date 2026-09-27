#!/usr/bin/env node
import { Command } from "commander";
import { fetchPokemon, PokemonNotFoundError } from "./api/pokeapi.js";

const program = new Command();

program
  .name("pokecli")
  .description("PokeAPIから取得したポケモンを表示するCLI")
  .version("1.0.0");

program
  .command("search")
  .description("ポケモン名で検索して情報を表示")
  .argument("<name>", "ポケモンの名前（英語表記, 例：pikachu）")
  .action(async (name: string) => {
    try {
      const pokemon = await fetchPokemon(name);
  
      console.log(`No.${pokemon.id} ${pokemon.name}`);
      console.log(`Height: ${pokemon.height / 10} m`);
      console.log(`Wieght: ${pokemon.weight / 10} kg`);
      console.log(`Types: ${pokemon.types.map((t) => t.type.name).join(", ")}`);
      console.log("Stats:");
      for (const s of pokemon.stats) {
        console.log(` ${s.stat.name}: ${s.base_stat}`);
      }
    } catch (err) {
      if (err instanceof PokemonNotFoundError) {
        console.error(err.message);
        process.exitCode = 1;
      } else {
        console.error(`RuntimeError: ${(err as Error).message}`);
      }
    }
  });

program.parse();
