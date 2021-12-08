#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("1-input.txt");
  const measurements = parseMeasurements(lines);
  partOne(measurements);
  partTwo(measurements);
}

function partOne(measurements: number[]) {
  let increases = 0;
  for (let i = 0, j = 1; j < measurements.length; i++, j++) {
    if (measurements[j] > measurements[i]) {
      increases++;
    }
  }
  console.log(increases);
}

function partTwo(measurements: number[]) {
  const sums = [];
  for (let i = 0, j = 1, k = 2; k < measurements.length; i++, j++, k++) {
    const sum = measurements[i] + measurements[j] + measurements[k];
    sums.push(sum);
  }
  partOne(sums);
}

function parseMeasurements(lines: string[]): number[] {
  return lines.map((l) => parseInt(l, 10));
}

main();
