import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";
import { access } from "fs";

const DAY = "08";

interface Line {
  inputs: string[][];
  outputs: string[][];
}

const parseInput = (values: string[]): Line[] =>
  values
    .filter((v) => v)
    .map((v) => {
      const [inputs, outputs] = v.split("|").map((n) =>
        n
          .split(" ")
          .filter((m) => m)
          .map((m) => m.trim().split(""))
      );
      return { inputs, outputs };
    });

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);
const getTestInput2 = readFileSeparated("\n", DAY, "testInput2").then(
  parseInput
);

interface MapOf<T> {
  [key: string]: T;
}

const segments = "abcdefg".split("");
const displays: MapOf<string[]> = {
  0: ["a", "b", "c", "e", "f", "g"],
  1: ["c", "f"],
  2: ["a", "c", "d", "e", "g"],
  3: ["a", "c", "d", "f", "g"],
  4: ["b", "c", "d", "f"],
  5: ["a", "b", "d", "f", "g"],
  6: ["a", "b", "d", "e", "f", "g"],
  7: ["a", "c", "f"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

const process = (input: Line[]) => {
  return input
    .map((line) => {
      const lengths = [2, 3, 4, 7];
      return line.outputs.filter((o) => lengths.includes(o.length)).length;
    })
    .reduce((acc, v) => acc + v, 0);
};

const process2 = (lines: Line[]) => {
  const find = (fn: () => string[]): string => {
    const r = fn();
    if (r.length === 1) {
      return r[0];
    } else if (r.length > 1) {
      throw Error("More than one find result");
    }
    throw Error("No find result");
  };

  const exclude = (a: string[], b: string[]) => a.filter((v) => !b.includes(v));
  const intersect = (a: string[], b: string[]) =>
    a.filter((v) => b.includes(v));

  return lines.reduce((acc, line) => {
    const inputCf = line.inputs.find((i) => i.length === 2)!; // One
    const inputBcdf = line.inputs.find((i) => i.length === 4)!; // Four
    const inputAcf = line.inputs.find((i) => i.length === 3)!; // Seven

    const inputZeroSixNine = line.inputs.filter((i) => i.length === 6); // Zero, Six or Nine
    const inputAbfg = segments.filter((s) =>
      inputZeroSixNine.every((i) => i.includes(s))
    );
    const inputCde = segments.filter(
      (s) => !inputZeroSixNine.every((i) => i.includes(s))
    );

    const inputBd = exclude(inputBcdf, inputCf);

    const finalMap: MapOf<string> = {};
    finalMap["a"] = find(() => exclude(inputAcf, inputCf));
    finalMap["b"] = find(() => intersect(inputAbfg, inputBd));
    finalMap["c"] = find(() => intersect(inputCf, inputCde));
    finalMap["d"] = find(() => exclude(inputBd, [finalMap.b]));
    finalMap["e"] = find(() => exclude(inputCde, [finalMap.c, finalMap.d]));
    finalMap["f"] = find(() => exclude(inputAcf, [finalMap.a, finalMap.c]));
    finalMap["g"] = find(() => exclude(segments, Object.values(finalMap)));

    if (Object.values(finalMap).filter((v) => v).length !== 7) {
      throw Error("Not all keys determined");
    }

    const reverseMap: MapOf<string> = Object.entries(finalMap).reduce(
      (acc, [k, v]) => ({ ...acc, [v]: k }),
      {}
    );

    const codeToNumber = (code: string[]): number => {
      const translatedCode = code.map((c) => reverseMap[c]);
      const number = Object.entries(displays).find(
        ([k, v]) =>
          v.length === code.length && v.every((c) => translatedCode.includes(c))
      );
      if (!number) {
        throw Error("No number found");
      }
      return toNumber(number[0]);
    };

    const numString = line.outputs.reduce(
      (s, code) => `${s}${codeToNumber(code)}`,
      "0"
    );
    const num = toNumber(numString);
    return acc + num;
  }, 0);

  return 1;
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  await expect(() => process(testInput2), 26);
  await expect(() => process2(testInput2), 61229);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput];

export default solution;
