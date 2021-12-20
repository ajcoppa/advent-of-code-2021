#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("9-input.txt");
  const heights = parseLines(lines);
  partOne(heights);
  // partTwo(positions);
}

function partOne(heights: number[][]) {
  const lowPointValues = [];
  for (let i = 0; i < heights.length; i++) {
    const row = heights[i];
    for (let j = 0; j < row.length; j++) {
      const neighbors = getAdjacentHeights(heights, j, i);
      const pointHeight = heights[i][j];
      const higherThanPoint = neighbors.filter((n) => n > pointHeight);
      if (higherThanPoint.length === neighbors.length) {
        lowPointValues.push(pointHeight);
      }
    }
  }
  const riskLevels = lowPointValues.map((x) => x + 1);
  const riskSum = riskLevels.reduce((a, b) => a + b, 0);
  console.log(riskSum);
}

function partTwo(heights: number[][]) {}

function getAdjacentHeights(
  heights: number[][],
  x: number,
  y: number
): number[] {
  const yMax = heights.length;
  const xMax = heights[0].length;
  const modifications = [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ].map((mod) => {
    const modifiedX = x + mod.x;
    const modifiedY = y + mod.y;
    return inBounds(modifiedX, modifiedY, xMax, yMax)
      ? heights[modifiedY][modifiedX]
      : 1000;
  });
  return modifications.filter((x) => x !== 1000);
}

function inBounds(x: number, y: number, xMax: number, yMax: number): boolean {
  return x >= 0 && x < xMax && y >= 0 && y < yMax;
}

function parseLines(lines: string[]): number[][] {
  return lines.map((line) => line.split("").map((s) => parseInt(s, 10)));
}

main();
