import fs from "fs/promises";

export async function loadFromFile(path: string): Promise<string[]> {
  const text = await fs.readFile(path, { encoding: "utf-8" });
  const lines = text.split("\n").filter((l: string) => l.length > 0);
  return lines;
}
