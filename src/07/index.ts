import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const DAY = "07";

const getInput = readFileSeparated(",", DAY, "input").then((values) =>
  values.map(toNumber)
);

const getTestInput = readFileSeparated(",", DAY, "testInput").then((values) =>
  values.map(toNumber)
);

const LINEAR = (a: number, b: number) => Math.abs(a - b);

const INCREASING = (a: number, b: number) => {
  const diff = Math.abs(a - b);
  let sum = 0;
  for (let i = 0; i <= diff; i++) {
    sum += i;
  }
  return sum;
};

const process = (input: number[], getCost = LINEAR) => {
  // const avg = input.reduce((sum, v) => sum + v, 0) / input.length;
  const median = input.slice().sort()[Math.floor(input.length / 2)];
  const q = input.length;
  const tests = new Array(q)
    .fill(0)
    .map((_, i) => median + (i - Math.floor(q / 2)));
  return tests.reduce((min, test) => {
    const diffs = input.map((v) => getCost(v, test));
    const sum = diffs.reduce((sum, v) => sum + v, 0);
    if (isNaN(min) || sum < min) {
      return sum;
    }
    return min;
  }, NaN);
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput), 37);
  await expect(() => process(testInput, INCREASING), 168);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process(input, INCREASING);
};

solution.inputs = [getInput];

export default solution;
