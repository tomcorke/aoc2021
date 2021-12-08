import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const DAY = "{DAY}";

type Input = string[];
const parseInput = (values: string[]): Input => values;

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const processPartOne = (input: Input): number => {
  return NaN;
};

const processPartTwo = (input: Input): number => {
  return NaN;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 3.141592653589793);
  // await expect(() => processPartTwo(testInput), 3.141592653589793);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
