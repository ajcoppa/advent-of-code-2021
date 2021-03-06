#!/usr/bin/env ts-node

import { exit } from "process";
import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("2-input.txt");
  const commands = parseCommands(lines);
  partOne(commands);
  partTwo(commands);
}

function partOne(commands: Command[]) {
  let depth = 0,
    position = 0;
  commands.forEach((command) => {
    const { direction, amount } = command;
    if (direction === Direction.Forward) {
      position += amount;
    } else if (direction === Direction.Up) {
      depth -= amount;
    } else if (direction === Direction.Down) {
      depth += amount;
    }
  });
  console.log(depth * position);
}

function partTwo(commands: Command[]) {
  let depth = 0,
    position = 0,
    aim = 0;
  commands.forEach((command) => {
    const { direction, amount } = command;
    if (direction === Direction.Forward) {
      position += amount;
      depth += aim * amount;
    } else if (direction === Direction.Up) {
      aim -= amount;
    } else if (direction === Direction.Down) {
      aim += amount;
    }
  });
  console.log(depth * position);
}

enum Direction {
  Forward,
  Down,
  Up,
}

interface Command {
  direction: Direction;
  amount: number;
}

function parseCommands(lines: string[]): Command[] {
  return lines.map((l) => {
    const [dirString, amountString] = l.split(" ");
    const amount = parseInt(amountString, 10);
    let direction;
    if (dirString === "forward") {
      return { direction: Direction.Forward, amount };
    } else if (dirString === "up") {
      return { direction: Direction.Up, amount };
    } else if (dirString === "down") {
      return { direction: Direction.Down, amount };
    } else {
      console.error(`Unexpected direction ${dirString}`);
      exit(1);
    }
  });
}

main();
