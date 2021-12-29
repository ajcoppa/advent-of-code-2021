#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("9-input.txt");
  const heights = parseLines(lines);
  partOne(heights);
  partTwo(heights);
}

function partOne(heights: number[][]) {
  const lowPointValues = [];
  for (let i = 0; i < heights.length; i++) {
    const row = heights[i];
    for (let j = 0; j < row.length; j++) {
      const neighbors = getAdjacentCoords(heights, j, i);
      const neighborHeights = neighbors.map(
        (coord) => heights[coord.y][coord.x]
      );
      const pointHeight = heights[i][j];
      const higherThanPoint = neighborHeights.filter((n) => n > pointHeight);
      if (higherThanPoint.length === neighbors.length) {
        lowPointValues.push(pointHeight);
      }
    }
  }
  const riskLevels = lowPointValues.map((x) => x + 1);
  const riskSum = riskLevels.reduce((a, b) => a + b, 0);
  console.log(riskSum);
}

function partTwo(heights: number[][]) {
  const yMax = heights.length;
  const basinMap: number[][] = new Array(yMax);

  for (let i = 0; i < heights.length; i++) {
    const row = heights[i];
    basinMap[i] = new Array(row.length);
  }

  let currentBasin = 1;
  markBasins(heights, basinMap, currentBasin);
  const sizes = getBasinSizes(basinMap).sort((a, b) => -1 * (a - b));
  console.log(sizes[0] * sizes[1] * sizes[2]);
}

function markBasins(
  heights: number[][],
  basinMap: number[][],
  currentBasin: number
): void {
  for (let i = 0; i < heights.length; i++) {
    const row = heights[i];
    for (let j = 0; j < row.length; j++) {
      const foundABasin = markOrSkip(heights, j, i, currentBasin, basinMap);
      if (foundABasin) {
        currentBasin++;
      }
    }
  }
}

function getAdjacentCoords(
  heights: number[][],
  x: number,
  y: number
): { x: number; y: number }[] {
  const yMax = heights.length;
  const xMax = heights[0].length;
  const modifications = [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ].map((mod) => ({ x: x + mod.x, y: y + mod.y }));
  return modifications.filter((coord) =>
    inBounds(coord.x, coord.y, xMax, yMax)
  );
}

function markOrSkip(
  heights: number[][],
  x: number,
  y: number,
  currentBasin: number,
  basinMap: number[][]
): boolean {
  if (basinMap[y][x] !== undefined) {
    return false;
  } else if (heights[y][x] === 9) {
    basinMap[y][x] = 0;
    return false;
  } else {
    basinMap[y][x] = currentBasin;
    const neighbors = getAdjacentCoords(heights, x, y);
    neighbors.forEach((coord) => {
      markOrSkip(heights, coord.x, coord.y, currentBasin, basinMap);
    });
    return true;
  }
}

function getBasinSizes(basinMap: number[][]): number[] {
  const basinSizes: number[] = Array();

  for (let i = 0; i < basinMap.length; i++) {
    const row = basinMap[i];
    for (let j = 0; j < row.length; j++) {
      const basinId = row[j];
      if (basinId === 0) {
        continue;
      }

      if (basinSizes[basinId] === undefined) {
        basinSizes[basinId] = 1;
      } else {
        basinSizes[basinId] = 1 + basinSizes[basinId];
      }
    }
  }
  return basinSizes.slice(1);
}

function inBounds(x: number, y: number, xMax: number, yMax: number): boolean {
  return x >= 0 && x < xMax && y >= 0 && y < yMax;
}

function parseLines(lines: string[]): number[][] {
  return lines.map((line) => line.split("").map((s) => parseInt(s, 10)));
}

main();
