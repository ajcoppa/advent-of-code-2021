#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("6-input.txt");
  const fish = parseLines(lines);
  partOne(fish);
  partTwo(fish);
}

function partOne(fish: Fish) {
  let updatedFish = tick(fish, 80);
  console.log(count(updatedFish));
}

function partTwo(fish: Fish) {
  let updatedFish = tick(fish, 256);
  console.log(count(updatedFish));
}

// number from 0-8 => count of fish at that stage
type Fish = Map<number, number>;

function tick(fish: Fish, times: number): Fish {
  if (times === 0) {
    return fish;
  }

  let newFish: Map<number, number> = cloneMap(fish);
  const newCount = newFish.get(0) || 0;
  for (let i = 0; i <= 7; i++) {
    newFish.set(i, newFish.get(i + 1) || 0);
  }
  newFish.set(8, newCount);
  newFish.set(6, (newFish.get(6) || 0) + newCount);
  return tick(newFish, times - 1);
}

function logFish(fish: Fish): void {
  for (let i = 0; i <= 8; i++) {
    process.stdout.write(`${fish.get(i) || 0} `);
  }
  process.stdout.write("\n");
}

function count(fish: Fish): number {
  let total = 0;
  for (const val of fish.values()) {
    total += val;
  }
  return total;
}

function parseLines(lines: string[]): Fish {
  const numbers = lines[0].split(",").map((s) => parseInt(s, 10));
  const fish = new Map<number, number>();
  numbers.forEach((n) => {
    const countAtN = fish.get(n) || 0;
    fish.set(n, countAtN + 1);
  });
  return fish;
}

function cloneMap(x: Map<any, any>): Map<any, any> {
  return new Map(JSON.parse(JSON.stringify(Array.from(x))));
}

main();
