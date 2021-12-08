#!/usr/bin/env ts-node

const fs = require("fs/promises");

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

async function loadFromFile(path: string): Promise<string[]> {
  const text = await fs.readFile(path, { encoding: "utf-8" });
  const lines = text.split("\n").filter((l: string) => l.length > 0);
  return lines;
}

function parseMeasurements(lines: string[]): number[] {
  return lines.map((l) => parseInt(l, 10));
}

main();
