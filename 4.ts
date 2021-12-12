#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("4-input.txt", false);
  const game = parseLinesIntoGame(lines);
  partOne(game);
  partTwo(game);
}

function partOne(game: BingoGame) {
  const firstWinner = findFirstWinner(game);
  if (firstWinner) {
    const score = scoreCard(firstWinner);
    console.log(score);
  } else {
    console.log("no winner :(");
  }
}

function partTwo(game: BingoGame) {
  const lastWinner = findLastWinner(game);
  if (lastWinner) {
    const score = scoreCard(lastWinner);
    console.log(score);
  } else {
    console.log("no winner :(");
  }
}

interface BingoGame {
  numbers: number[];
  cards: BingoCard[];
}

interface BingoCard {
  rows: number[][];
  // encoding columns separately duplicates data but speeds checking completion
  columns: number[][];
  marks: Map<number, boolean>;
}

function parseLinesIntoGame(lines: string[]): BingoGame {
  const numbers =
    lines
      .shift()
      ?.split(",")
      ?.map((x) => parseInt(x, 10)) ?? [];
  lines.shift();

  let cards: BingoCard[] = [];
  let latestCardLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) {
      const card = parseCardLinesIntoCard(latestCardLines);
      cards.push(card);
      latestCardLines = [];
    } else {
      latestCardLines.push(line);
    }
  }

  if (latestCardLines.length > 0) {
    const lastCard = parseCardLinesIntoCard(latestCardLines);
    cards.push(lastCard);
  }

  return {
    numbers,
    cards,
  };
}

function parseCardLinesIntoCard(lines: string[]): BingoCard {
  const rowDigitArrays: number[][] = lines.map((line) =>
    line
      .split(" ")
      .filter((s) => s.length > 0)
      .map((n) => parseInt(n, 10))
  );

  let columnDigitArrays: number[][] = [];
  for (let i = 0; i < rowDigitArrays[0].length; i++) {
    columnDigitArrays.push(rowDigitArrays.map((row) => row[i]));
  }
  const card = {
    rows: rowDigitArrays,
    columns: columnDigitArrays,
    marks: new Map<number, boolean>(),
  };
  return card;
}

function cardIsAWinner(
  sequenceMap: Map<number, boolean>,
  card: BingoCard
): boolean {
  return any(
    card.rows.concat(card.columns).map((rowOrColumn) => {
      const bools = rowOrColumn.map((x) => sequenceMap.get(x) || false);
      return all(bools);
    })
  );
}

function all(xs: boolean[]): boolean {
  return xs.reduce((result, x) => result && x, true);
}

function any(xs: boolean[]): boolean {
  return xs.reduce((result, x) => result || x, false);
}

function findFirstWinner(game: BingoGame): BingoCard | null {
  const { cards, numbers } = game;
  // transform numbers into arrays of every initial sequence they contain
  // e.g. [1, 2, 3] => [[1], [1, 2], [1, 2, 3]]
  const sequences = numbers.map((n, i) => numbers.slice(0, i));
  for (let i = 0; i < sequences.length; i++) {
    const sequence = sequences[i];
    // transform sequence into map of number => boolean for fast lookup
    const sequenceMap = sequence.reduce((map, n) => {
      map.set(n, true);
      return map;
    }, new Map<number, boolean>());
    const firstWinner = cards.find(cardIsAWinner.bind(null, sequenceMap));
    if (firstWinner) {
      firstWinner.marks = sequenceMap;
      return firstWinner;
    }
  }
  return null;
}

function findLastWinner(game: BingoGame): BingoCard | null {
  const { cards, numbers } = game;
  // transform numbers into arrays of every initial sequence they contain
  // e.g. [1, 2, 3] => [[1], [1, 2], [1, 2, 3]]
  const sequences = numbers.map((n, i) => numbers.slice(0, i));

  let cardsLeft: BingoCard[] = cards;
  let lastCard: BingoCard | null = null;
  for (let i = 0; i < sequences.length; i++) {
    const sequence = sequences[i];
    // transform sequence into map of number => boolean for fast lookup
    const sequenceMap = sequence.reduce((map, n) => {
      map.set(n, true);
      return map;
    }, new Map<number, boolean>());

    if (cardsLeft.length === 1) {
      lastCard = cardsLeft[0];
    }
    cardsLeft = cardsLeft.filter((c) => !cardIsAWinner(sequenceMap, c));

    if (cardsLeft.length === 0 && lastCard) {
      lastCard.marks = sequenceMap;
      return lastCard;
    }
  }
  return null;
}

function scoreCard(card: BingoCard): number {
  const numbers = card.rows.flat();
  const unmarkedNumbers = numbers.filter(
    (x) => card.marks.get(x) === undefined
  );
  const unmarkedSum = unmarkedNumbers.reduce((a, b) => a + b, 0);
  // JS maps remember order, so this trick works to get last inserted element
  const lastNumberMarked = Array.from(card.marks)[card.marks.size - 1][0];
  return unmarkedSum * lastNumberMarked;
}

main();
