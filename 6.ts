#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("6-input.txt");
  const fish = parseLines(lines);
  partOne(fish);
  partTwo(fish);
}

function partOne(fish: number[]) {
  let updatedFish = tick(fish, 80);
  console.log(updatedFish.length);
}

function partTwo(fish: number[]) {}

function tick(fish: number[], times: number): number[] {
  if (times === 0) {
    return fish;
  }
  const newCount = fish.filter((n) => n === 0).length;
  let updatedFish = fish.map((n) => (n === 0 ? 6 : n - 1));
  for (let i = 0; i < newCount; i++) {
    updatedFish.push(8);
  }
  return tick(updatedFish, times - 1);
}

function logFish(fish: number[]): void {
  console.log(fish.join(","));
}

function parseLines(lines: string[]): number[] {
  return lines[0].split(",").map((s) => parseInt(s, 10));
}

main();
