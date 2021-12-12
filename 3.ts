#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("3-input.txt");
  partOne(lines);
  partTwo(lines);
}

function partOne(lines: string[]) {
  const count = lines.length;
  const countsPerBit = getCountsPerBit(lines);

  const gammaRateString = countsPerBit
    .map((bitCount) => (bitCount > Math.floor(count / 2) ? 1 : 0))
    .join("");
  const gammaRate = parseInt(gammaRateString, 2);
  const epsilonRateString = countsPerBit
    .map((bitCount) => (bitCount < Math.floor(count / 2) ? 1 : 0))
    .join("");
  const epsilonRate = parseInt(epsilonRateString, 2);
  console.log(gammaRate * epsilonRate);
}

function partTwo(lines: string[]) {
  let linesInConsideration = lines;

  const mostCommonBits = getLineMatchingP(lines, (bitCount, count) =>
    bitCount >= count / 2 ? 1 : 0
  );
  const leastCommonBits = getLineMatchingP(lines, (bitCount, count) =>
    bitCount < count / 2 ? 1 : 0
  );

  const o2GeneratorRating = parseInt(mostCommonBits, 2);
  const co2ScrubberRating = parseInt(leastCommonBits, 2);

  console.log(o2GeneratorRating * co2ScrubberRating);
}

function getLineMatchingP(
  lines: string[],
  p: (bitCount: number, totalCount: number) => number
): string {
  let linesInConsideration = lines;
  let bitsToKeep: string = "";
  for (let i = 0; i < lines[0].length; i++) {
    const count = linesInConsideration.length;
    if (count === 1) {
      return linesInConsideration[0];
    }
    const countsPerBit = getCountsPerSpecificBit(linesInConsideration, i);
    const bitToKeep = p(countsPerBit, count);
    bitsToKeep += bitToKeep;
    linesInConsideration = linesInConsideration.filter(
      (line) => parseInt(line[i], 10) === bitToKeep
    );
  }
  return bitsToKeep;
}

function getCountsPerBit(lines: string[]): number[] {
  return lines
    .map((line) => {
      // transform each line to an array of digits
      const digits = line.split("").map((c) => parseInt(c, 10));
      return digits;
    })
    .reduce((currentTotal: number[], nextItem: number[]) => {
      let newTotal: number[] = [];
      for (let i = 0; i < nextItem.length; i++) {
        newTotal.push(currentTotal[i] + nextItem[i]);
      }
      return newTotal;
    });
}

function getCountsPerSpecificBit(lines: string[], whichBit: number): number {
  return lines
    .map((line) => parseInt(line[whichBit], 10))
    .reduce((a, b) => a + b);
}

main();
