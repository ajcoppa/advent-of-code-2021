#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("11-input.txt");
  const octopi = parseLines(lines);
  const octopiCopy = JSON.parse(JSON.stringify(octopi));
  partOne(octopi);
  partTwo(octopiCopy);
}

function partOne(octopi: number[][]) {
  let flashTotal = 0;
  for (let i = 1; i <= 100; i++) {
    flashTotal += tick(octopi);
  }
  console.log(flashTotal);
}

function partTwo(octopi: number[][]) {
  for (let i = 1; i <= 1000; i++) {
    const length = octopi.length;
    const height = octopi[0].length;
    const flashCount = tick(octopi);
    if (flashCount === length * height) {
      console.log(i);
      return;
    }
  }
}

function tick(octopi: number[][]): number {
  const flashMap: boolean[][] = [];

  for (let i = 0; i < octopi.length; i++) {
    const row = octopi[i];
    flashMap[i] = [];
    for (let j = 0; j < row.length; j++) {
      flashMap[i][j] = false;
      const octopus = row[j];
      octopi[i][j] += 1;
    }
  }

  for (let i = 0; i < octopi.length; i++) {
    const row = octopi[i];
    for (let j = 0; j < row.length; j++) {
      if (octopi[i][j] > 9 && flashMap[i][j] === false) {
        flash(octopi, flashMap, j, i);
      }
    }
  }

  let flashCount = 0;
  for (let i = 0; i < octopi.length; i++) {
    const row = octopi[i];
    for (let j = 0; j < row.length; j++) {
      if (flashMap[i][j] === true) {
        octopi[i][j] = 0;
        flashCount++;
      }
    }
  }

  return flashCount;
}

function flash(
  octopi: number[][],
  flashMap: boolean[][],
  x: number,
  y: number
): void {
  flashMap[y][x] = true;
  const adjacents = getAdjacentCoords(octopi, x, y);
  adjacents.forEach((coord) => {
    const { x: cX, y: cY } = coord;
    octopi[cY][cX] += 1;
    if (octopi[cY][cX] > 9 && flashMap[cY][cX] === false) {
      flash(octopi, flashMap, cX, cY);
    }
  });
}

function getAdjacentCoords(
  octopi: number[][],
  x: number,
  y: number
): { x: number; y: number }[] {
  const yMax = octopi.length;
  const xMax = octopi[0].length;
  const modifications = [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ].map((mod) => ({ x: x + mod.x, y: y + mod.y }));
  return modifications.filter((coord) =>
    inBounds(coord.x, coord.y, xMax, yMax)
  );
}

function inBounds(x: number, y: number, xMax: number, yMax: number): boolean {
  return x >= 0 && x < xMax && y >= 0 && y < yMax;
}

function parseLines(lines: string[]): number[][] {
  return lines.map((line) => line.split("").map((s) => parseInt(s, 10)));
}

main();
