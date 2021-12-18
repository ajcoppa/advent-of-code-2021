#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const fileLines = await loadFromFile("5-input.txt");
  const lines = parseLines(fileLines);
  partOne(lines);
  partTwo(lines);
}

function partOne(lines: Line[]) {
  const straightLines = lines.filter(isStraight);
  let board = newBoard(1000);
  straightLines.forEach((l) => {
    board = markLineOnBoard(board, l);
  });
  console.log(intersectionCount(board));
}

function partTwo(lines: Line[]) {
  let board = newBoard(1000);
  lines.forEach((l) => {
    board = markLineOnBoard(board, l);
  });
  console.log(intersectionCount(board));
}

interface Coord {
  x: number;
  y: number;
}

type Line = {
  start: Coord;
  end: Coord;
};

type Board = number[][];

function parseLines(fileLines: string[]): Line[] {
  return fileLines.map((l) => {
    const coordStrings = l.split(" -> ");
    const startStrings = coordStrings[0].split(",");
    const endStrings = coordStrings[1].split(",");
    const start = {
      x: parseInt(startStrings[0], 10),
      y: parseInt(startStrings[1], 10),
    };
    const end = {
      x: parseInt(endStrings[0], 10),
      y: parseInt(endStrings[1], 10),
    };
    return { start, end };
  });
}

function isStraight(line: Line) {
  const { start, end } = line;
  return start.x === end.x || start.y === end.y;
}

function markLineOnBoard(board: Board, line: Line): Board {
  const { start, end } = line;

  const xDiff = end.x - start.x;
  const yDiff = end.y - start.y;

  let xStep: (n: number) => number = stepForDiff(xDiff);
  let yStep: (n: number) => number = stepForDiff(yDiff);
  let xComp: (i: number, endCoord: number) => boolean = compForDiff(xDiff);
  let yComp: (i: number, endCoord: number) => boolean = compForDiff(yDiff);

  for (
    let i = start.x, j = start.y;
    xComp(i, end.x) && yComp(j, end.y);
    i = xStep(i), j = yStep(j)
  ) {
    board[j][i] += 1;
  }
  return board;
}

function newBoard(size: number): Board {
  let board: number[][] = new Array(size);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(size);
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
      board[i][j] = 0;
    }
  }
  return board;
}

function printBoard(board: Board): void {
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
      process.stdout.write(`${board[i][j]}`);
    }
    process.stdout.write("\n");
  }
  process.stdout.write("\n");
}

function stepForDiff(diff: number): (n: number) => number {
  if (diff === 0) {
    return (n) => n;
  } else if (diff >= 1) {
    return (n) => n + 1;
  } else {
    // diff <= -1 {
    return (n) => n - 1;
  }
}

function compForDiff(diff: number): (i: number, endCoord: number) => boolean {
  if (diff === 0) {
    return (i, endCoord) => true;
  } else if (diff > 0) {
    return (i, endCoord) => i <= endCoord;
  } else {
    // diff < 0
    return (i, endCoord) => i >= endCoord;
  }
}

function intersectionCount(board: Board): number {
  return board
    .map((row) => row.map((lineCount) => (lineCount > 1 ? 1 : 0)))
    .flat()
    .reduce((a: number, b: number) => a + b, 0);
}

main();
