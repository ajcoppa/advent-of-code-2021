#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("7-input.txt");
  const positions = parseLines(lines);
  partOne(positions);
  partTwo(positions);
}

function partOne(positions: number[]) {
  const maxPosition = Math.max(...positions);
  let fuelCosts: number[] = [];
  for (let i = 0; i <= maxPosition; i++) {
    fuelCosts.push(totalDistanceToX(positions, i));
  }
  console.log(Math.min(...fuelCosts));
}

function partTwo(positions: number[]) {
  const maxPosition = Math.max(...positions);
  let fuelCosts: number[] = [];
  for (let i = 0; i <= maxPosition; i++) {
    fuelCosts.push(totalDistanceToX(positions, i, true));
  }
  console.log(Math.min(...fuelCosts));
}

function totalDistanceToX(
  positions: number[],
  x: number,
  increasingFuelCost: boolean = false
): number {
  return sum(
    positions.map((pos) => {
      const distance = Math.abs(pos - x);
      return increasingFuelCost ? triangularNumber(distance) : distance;
    })
  );
}

function triangularNumber(x: number): number {
  let total = 0;
  for (let i = x; i > 0; i--) {
    total += i;
  }
  return total;
}

function parseLines(lines: string[]): number[] {
  return lines[0].split(",").map((s) => parseInt(s, 10));
}

function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

main();
