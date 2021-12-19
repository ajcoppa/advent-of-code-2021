#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("8-input.txt");
  const entries = parseLines(lines);
  partOne(entries);
  // partTwo(entries);
}

function partOne(entries: Entry[]) {
  const easyDigitCount = entries
    .map(
      (entry) =>
        entry.output.filter((e) => [2, 3, 4, 7].includes(e.length)).length
    )
    .reduce((a, b) => a + b, 0);
  console.log(easyDigitCount);
}

function partTwo(entries: Entry[]) {}

function parseLines(lines: string[]): Entry[] {
  return lines.map(lineToEntry);
}

function lineToEntry(line: string): Entry {
  const [patternsStr, outputStr] = line.split("|").map((s) => s.trim());
  const patterns = patternsStr.split(" ");
  const output = outputStr.split(" ");
  return { patterns, output };
}

interface Entry {
  patterns: string[];
  output: string[];
}

main();
