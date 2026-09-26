#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("pokecli")
  .description("PokeAPIから取得したポケモンを表示するCLI")
  .version("1.0.0");

program
  .command("search")
  .description("ポケモン名で検索して情報を表示")
  .argument("<name>", "ポケモンの名前（英語表記, 例：pikachu）")
  .action((name: string) => {
    console.log(`search called with: ${name}`);
  });

program.parse();
