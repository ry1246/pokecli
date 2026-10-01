#!/usr/bin/env node
import { Command } from "commander";
import { fetchPokemon, PokemonNotFoundError } from "./api/pokeapi.js";
import { getCachedPokemon, saveCachedPokemon, clearCache } from "./cache/pokecache.js";
import Table from "cli-table3";

const program = new Command();

const table = new Table({
  head: ["Stat", "Value"],
  colWidths: [12, 8],
});

program
  .name("pokecli")
  .description("PokeAPIから取得したポケモンを表示するCLI")
  .version("1.0.0");

program
  .command("search")
  .description("ポケモン名で検索して情報を表示")
  .argument("<name>", "ポケモンの名前（英語表記, 例：pikachu）")
  .option("--no-cache", "キャッシュを使わず強制的にAPIから取得する")
  .action(async (name: string, options: { cache: boolean }) => {
    try {
      const cached = options.cache ? await getCachedPokemon(name) : undefined;
      const pokemon = cached ?? (await fetchPokemon(name));

      if (options.cache && !cached) {
        await saveCachedPokemon(name, pokemon);
      }
  
      for (const s of pokemon.stats) {
        table.push([s.stat.name, s.base_stat]);
      }

      console.log(`No.${pokemon.id} ${pokemon.name}${cached ? " (cached) " : ""}`);
      console.log(`Height: ${pokemon.height / 10} m`);
      console.log(`Wieght: ${pokemon.weight / 10} kg`);
      console.log(`Types: ${pokemon.types.map((t) => t.type.name).join(", ")}`);
      console.log(table.toString());

    } catch (err) {
      if (err instanceof PokemonNotFoundError) {
        console.error(err.message);
        process.exitCode = 1;
      } else {
        console.error(`RuntimeError: ${(err as Error).message}`);
        process.exitCode = 2;
      }
    }
  });

const cacheCommand = program
  .command("cache")
  .description("キャッシュ関連の操作");

cacheCommand
  .command("clear")
  .description("キャッシュファイルを削除する")
  .action(async () => {
    try {
      await clearCache();
      console.log("キャッシュを削除しました");
    } catch (err) {
      console.error(`RuntimeError: ${(err as Error).message}`);
      process.exitCode = 2;
    }
  })

program.parse();
