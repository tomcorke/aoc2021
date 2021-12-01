import fs from "fs";
import path from "path";

const DEFAULT_MAPPER = (s: string) => s;

export const readFile = async (...pathParts: string[]) => {
  return new Promise<string>((resolve, reject) => {
    const filePath = path.join(__dirname, "../src/", ...pathParts);
    console.log(`Loading file from path: "${filePath}"`);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

export const readFileSeparated = async (
  separator: string,
  ...pathParts: string[]
) => {
  return (await readFile(...pathParts)).split(separator);
};

export const readFileLines = async (...pathParts: string[]) => {
  return readFileSeparated("\n", ...pathParts);
};

export const toNumber = (s: string) => parseFloat(s);
export const toInteger = (s: string) => parseInt(s);

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export const toVector3 = (vectorString: string): Vector3 => {
  const match = /^<x=(-?\d+),\s?y=(-?\d+),\s?z=(-?\d+)>/i.exec(vectorString);
  if (!match) {
    throw Error(`Could not parse vector from string: "${vectorString}"`);
  }
  return {
    x: parseInt(match[1]),
    y: parseInt(match[2]),
    z: parseInt(match[3]),
  };
};

export const expect = async <T>(
  test: () => T | Promise<T>,
  expected: T
): Promise<void> => {
  const actual = await test();
  if (actual !== expected) {
    throw Error(
      `Test failed, expected result ${expected}, actual result ${actual}`
    );
  }
};
