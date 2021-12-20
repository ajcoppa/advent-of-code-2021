#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines = await loadFromFile("8-input.txt");
  const entries = parseLines(lines);
  partOne(entries);
  partTwo(entries);
}

function partOne(entries: Entry[]) {
  const easyDigitCount = entries
    .map(
      (entry) =>
        entry.output.filter((e) => [2, 3, 4, 7].includes(e.length)).length
    )
    .reduce((a, b) => a + b, 0);
  console.log(easyDigitCount);
}

function partTwo(entries: Entry[]) {
  const total = entries.map(entryToNumber).reduce((a, b) => a + b, 0);
  console.log(total);
}

type Possibilities = Map<string, Set<Seg>>;
type CharacterToSegment = Map<string, Seg>;

interface Entry {
  patterns: string[];
  output: string[];
}

enum Seg {
  Top,
  TopLeft,
  TopRight,
  Middle,
  BottomLeft,
  BottomRight,
  Bottom,
}
function parseLines(lines: string[]): Entry[] {
  return lines.map(lineToEntry);
}

function lineToEntry(line: string): Entry {
  const [patternsStr, outputStr] = line.split("|").map((s) => s.trim());
  const patterns = patternsStr.split(" ");
  const output = outputStr.split(" ");
  return { patterns, output };
}

function entryToNumber(entry: Entry): number {
  const allSegments = [...numberSegments[8]];
  let possibilities = new Map<string, Set<Seg>>();
  "abcdefg".split("").forEach((c) => {
    possibilities.set(c, new Set(allSegments));
  });
  deducePossibilities(entry.patterns, possibilities);

  const charToSeg = convertPossibilitiesToMap(possibilities);
  return getNumberGivenSegMap(entry.output, charToSeg);
}

function deducePossibilities(patterns: string[], possibilities: Possibilities) {
  const allPossibilities = new Set<Seg>(numberSegments[8]);

  filterEasyDigits(patterns, possibilities);
  filterSixSegmentDigits(patterns, possibilities);
  filterDecidedPossibilities(possibilities);
}

function filterEasyDigits(
  patterns: string[],
  possibilities: Possibilities
): void {
  const easyDigits = [
    { number: 1, length: 2 },
    { number: 4, length: 4 },
    { number: 7, length: 3 },
    { number: 8, length: 7 },
  ];
  easyDigits.forEach((ed) => {
    const digitPatternStr = patterns.filter((s) => s.length === ed.length)[0];
    const digitPatterns = digitPatternStr.split("");
    digitPatterns.forEach((c) => {
      // filter down possibilities for these characters down to the segments
      // in the digit they're part of
      const currPoss = possibilities.get(c) || new Set();
      const numberSegsSet = new Set<Seg>(numberSegments[ed.number]);
      possibilities.set(c, intersection(currPoss, numberSegsSet));
    });
    // remove these segments from possibilities of the characters not in this list
    const otherChars = "abcdefg"
      .split("")
      .filter((c) => !digitPatterns.includes(c));
    removePossibilities(otherChars, numberSegments[ed.number], possibilities);
  });
}

function filterSixSegmentDigits(
  patterns: string[],
  possibilities: Possibilities
): void {
  const digitPatternsStr = patterns.filter((s) => s.length === 6);
  const missingLetters = digitPatternsStr.flatMap((p) =>
    "abcdefg".split("").filter((c) => !p.includes(c))
  );
  missingLetters.forEach((c) => {
    const currPoss = possibilities.get(c) || new Set();
    possibilities.set(
      c,
      intersection(
        currPoss,
        // digits with 6 segments each have one of these missing, so the missing
        // letters need to be one of these
        new Set([Seg.Middle, Seg.BottomLeft, Seg.TopRight])
      )
    );
  });
}

function filterDecidedPossibilities(possibilities: Possibilities): void {
  // If any character has already been narrowed down to a single item, remove
  // that item from all other sets
  let decidedPossibilities: Seg[] = [];
  "abcdefg".split("").forEach((c) => {
    const currPoss = possibilities.get(c) || new Set();
    if (currPoss.size === 1) {
      const value = currPoss.values().next().value;
      decidedPossibilities.push(value);
    }
  });

  const everythingExceptSegs = new Set<Seg>(numberSegments[8]);
  decidedPossibilities.forEach((poss) => {
    everythingExceptSegs.delete(poss);
  });

  "abcdefg".split("").forEach((c) => {
    const currPoss = possibilities.get(c) || new Set();
    if (currPoss.size > 1) {
      possibilities.set(c, intersection(currPoss, everythingExceptSegs));
    }
  });
}

function convertPossibilitiesToMap(
  possibilities: Possibilities
): CharacterToSegment {
  const charToSeg = new Map();
  "abcdefg".split("").forEach((c) => {
    const poss = possibilities.get(c) || new Set();
    if (poss.size === 1) {
      charToSeg.set(c, poss.values().next().value);
    }
  });
  return charToSeg;
}

function getNumberGivenSegMap(
  output: string[],
  segMap: CharacterToSegment
): number {
  const digits = output.map((digitStr) => {
    const digitSegs = digitStr.split("").map((c) => segMap.get(c) || Seg.Top);
    const digit = numberSegments.findIndex((s) =>
      arrayEquals(s, digitSegs.sort())
    );
    return digit;
  });
  return parseInt(digits.join(""), 10);
}

function intersection<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  var intersect = new Set<T>();
  for (const x of s1) {
    if (s2.has(x)) {
      intersect.add(x);
    }
  }
  return intersect;
}

function removePossibilities(
  cs: string[],
  segs: Seg[],
  poss: Possibilities
): void {
  const setWithoutSegs = new Set<Seg>(numberSegments[8]);
  segs.forEach((seg) => setWithoutSegs.delete(seg));
  cs.forEach((c) => {
    const currentPoss = poss.get(c) || new Set();
    poss.set(c, intersection(currentPoss, setWithoutSegs));
  });
}

function arrayEquals<T>(a1: T[], a2: T[]): boolean {
  if (a1.length !== a2.length) {
    return false;
  }

  for (let i = 0; i < a1.length; i++) {
    const x1 = a1[i],
      x2 = a2[i];
    if (x1 !== x2) {
      return false;
    }
  }
  return true;
}

const numberSegments = [
  [
    // 0
    Seg.Top,
    Seg.TopLeft,
    Seg.TopRight,
    Seg.BottomLeft,
    Seg.BottomRight,
    Seg.Bottom,
  ],
  [Seg.TopRight, Seg.BottomRight], // 1
  [
    // 2
    Seg.Top,
    Seg.TopRight,
    Seg.Middle,
    Seg.BottomLeft,
    Seg.Bottom,
  ],
  [
    // 3
    Seg.Top,
    Seg.TopRight,
    Seg.Middle,
    Seg.BottomRight,
    Seg.Bottom,
  ],
  [Seg.TopLeft, Seg.TopRight, Seg.Middle, Seg.BottomRight], // 4
  [
    // 5
    Seg.Top,
    Seg.TopLeft,
    Seg.Middle,
    Seg.BottomRight,
    Seg.Bottom,
  ],
  [
    // 6
    Seg.Top,
    Seg.TopLeft,
    Seg.Middle,
    Seg.BottomLeft,
    Seg.BottomRight,
    Seg.Bottom,
  ],
  [Seg.Top, Seg.TopRight, Seg.BottomRight], // 7
  [
    // 8
    Seg.Top,
    Seg.TopLeft,
    Seg.TopRight,
    Seg.Middle,
    Seg.BottomLeft,
    Seg.BottomRight,
    Seg.Bottom,
  ],
  [
    // 9
    Seg.Top,
    Seg.TopLeft,
    Seg.TopRight,
    Seg.Middle,
    Seg.BottomRight,
    Seg.Bottom,
  ],
];

main();
