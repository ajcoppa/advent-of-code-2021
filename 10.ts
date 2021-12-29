#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("10-input.txt");
  partOne(lines);
  partTwo(lines);
}

function partOne(lines: string[]) {
  const results = lines.map((line) => {
    const result = parseExpression(line);
    return pointValue(result.encountered);
  });
  const sum = results.reduce((a, b) => a + b);
  console.log(sum);
}

function partTwo(lines: string[]) {}

function parseExpression(line: string): {
  encountered: string;
  expected: string;
} {
  let stack: string[] = [];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];

    if (isOpening(c)) {
      stack.push(c);
    } else if (isClosing(c)) {
      const last = stack[stack.length - 1];
      const opener = openerForCloser(c);
      if (last === opener) {
        stack.pop();
      } else {
        return { encountered: c, expected: closerForOpener(last) };
      }
    }
  }

  return { encountered: "", expected: "" };
}

function isOpening(c: string): boolean {
  if (["(", "[", "{", "<"].includes(c)) {
    return true;
  } else {
    return false;
  }
}

function isClosing(c: string): boolean {
  if ([")", "]", "}", ">"].includes(c)) {
    return true;
  } else {
    return false;
  }
}

function openerForCloser(c: string): string {
  switch (c) {
    case ")":
      return "(";
    case "]":
      return "[";
    case "}":
      return "{";
    case ">":
      return "<";
    default:
      return "";
  }
}

function closerForOpener(c: string): string {
  switch (c) {
    case "(":
      return ")";
    case "[":
      return "]";
    case "{":
      return "}";
    case "<":
      return ">";
    default:
      return "";
  }
}

function pointValue(c: string): number {
  switch (c) {
    case ")":
      return 3;
    case "]":
      return 57;
    case "}":
      return 1197;
    case ">":
      return 25137;
    default:
      return 0;
  }
}

main();
