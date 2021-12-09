#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("3-input.txt");
  partOne(lines);
  // partTwo(commands);
}

function partOne(lines: string[]) {
  const count = lines.length;
  const countsPerBit = lines
    .map((line) => {
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

main();
