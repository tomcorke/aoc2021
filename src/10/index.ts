import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { map } from "lodash";

const DAY = "10";

type Input = string[][];
const parseInput = (values: string[]): Input =>
  values.map((line) => line.split(""));

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const pairs: [string, string, number, number][] = [
  ["(", ")", 3, 1],
  ["[", "]", 57, 2],
  ["{", "}", 1197, 3],
  ["<", ">", 25137, 4],
];

const processLine = (line: string[]): [number, string[]] => {
  const stack: string[] = [];
  const peek = () => stack[stack.length - 1];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (pairs.some((p) => p[0] === c)) {
      // is opening
      stack.push(line[i]);
    } else {
      const pair = pairs.find((p) => p[1] === c)!;
      if (peek() !== pair[0]) {
        return [pair[2], stack];
      }
      stack.pop();
    }
  }
  return [0, stack];
};

const processPartOne = (input: Input): number => {
  return input.reduce((acc, line) => acc + processLine(line)[0], 0);
};

const processPartTwo = (input: Input): number => {
  const mappedLines = input.map((line) => [line, ...processLine(line)]) as [
    string[],
    number,
    string[]
  ][];
  const uncorrupted = mappedLines.filter(([line, score]) => score === 0);
  const completions = uncorrupted
    .map(([line, score, stack]) => stack.slice().reverse())
    .map((c) => [
      c,
      c.reduce((acc, c) => acc * 5 + pairs.find((p) => p[0] === c)![3], 0),
    ]) as [string[], number][];
  const sortedScores = completions.map((c) => c[1]).sort((a, b) => a - b);
  const middleScore = sortedScores[Math.floor(sortedScores.length / 2)];
  return middleScore;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 26397);
  await expect(() => processPartTwo(testInput), 288957);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
