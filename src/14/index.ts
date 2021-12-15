import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const DAY = "14";

type Input = { input: string; rules: [string, string, string, string][] };
const parseInput = (values: string[]): Input => {
  const input = values[0];
  const rules = values[1]
    .split("\n")
    .filter((line) => line)
    .map((line) => line.split(" -> ") as [string, string])
    .map(
      ([rule, replace]) =>
        [rule, replace, rule[0], rule[1]] as [string, string, string, string]
    );
  return { input, rules };
};

const getInput = readFileSeparated("\n\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n\n", DAY, "testInput").then(
  parseInput
);

const process = (input: Input, times: number): number => {
  let pairs: { [key: string]: number } = {};
  const last = input.input.slice(-1)[0];
  for (let i = 0; i < input.input.length - 1; i++) {
    const pair = input.input.slice(i, i + 2);
    pairs[pair] = (pairs[pair] || 0) + 1;
  }
  for (let i = 0; i < times; i++) {
    let newPairs = { ...pairs };
    for (const [rule, replace, first, second] of input.rules) {
      const leftPair = `${first}${replace}`;
      const rightPair = `${replace}${second}`;
      const c = pairs[rule] || 0;
      if (c > 0) {
        newPairs[rule] = newPairs[rule] - c;
        newPairs[leftPair] = (newPairs[leftPair] || 0) + c;
        newPairs[rightPair] = (newPairs[rightPair] || 0) + c;
      }
    }
    pairs = newPairs;
  }
  const counts: { [key: string]: number } = {};
  for (const [key, value] of Object.entries(pairs)) {
    counts[key.slice(0, 1)] = (counts[key.slice(0, 1)] || 0) + value;
  }
  counts[last] = (counts[last] || 0) + 1;
  return (
    Math.max(...Object.values(counts)) - Math.min(...Object.values(counts))
  );
};

const processPartOne = (input: Input): number => {
  return process(input, 10);
};

const processPartTwo = (input: Input): number => {
  return process(input, 40);
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 1588);
  await expect(() => processPartTwo(testInput), 2188189693529);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
