#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("10-input.txt");
  partOne(lines);
  partTwo(lines);
}

function partOne(lines: string[]) {
  const results = lines.map((line) => {
    const parsed = parseExpression(line);
    const firstError = parsed?.errors[0];
    if (firstError !== undefined) {
      return errorPointValue(firstError.encountered);
    } else {
      return 0;
    }
  });
  const sum = results.reduce((a, b) => a + b);
  console.log(sum);
}

function partTwo(lines: string[]) {
  const results = lines
    .map((line) => {
      const parsed = parseExpression(line);
      if (parsed.errors.length === 0) {
        return scoreCharsToComplete(parsed.charsToComplete);
      } else {
        return 0;
      }
    })
    .filter((x) => x !== 0);
  const middleIndex = Math.floor(results.length / 2);
  console.log(results.sort((a, b) => a - b)[middleIndex]);
}

function parseExpression(line: string): ParsedExpression {
  let stack: string[] = [];
  let errors: Error[] = [];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];

    if (isOpening(c)) {
      stack.push(c);
    } else if (isClosing(c)) {
      const last = stack[stack.length - 1];
      const opener = openerForCloser(c);
      if (last !== opener) {
        errors.push({ encountered: c, expected: closerForOpener(last) });
      }
      stack.pop();
    }
  }

  const charsToComplete = stack.map(closerForOpener).reverse().join("");
  return { errors, charsToComplete };
}

type Error = { encountered: string; expected: string };
type ParsedExpression = {
  errors: Error[];
  charsToComplete: string;
};

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

function errorPointValue(c: string): number {
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

function completePointValue(c: string): number {
  switch (c) {
    case ")":
      return 1;
    case "]":
      return 2;
    case "}":
      return 3;
    case ">":
      return 4;
    default:
      return 0;
  }
}

function scoreCharsToComplete(s: string): number {
  let score = 0;
  for (const i in s.split("")) {
    score *= 5;
    score += completePointValue(s[i]);
  }
  return score;
}

main();
