import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";
import { sum } from "lodash";

const getInput = readFileSeparated("\n", "01", "input").then((values) =>
  values.map(toNumber)
);

const getTestInput = readFileSeparated("\n", "01", "testInput").then((values) =>
  values.map(toNumber)
);

const countIncreases = (input: number[], samples: number = 1): number => {
  let count = 0;
  if (samples === 1) {
    count = input.filter((_, i) => i > 0 && input[i] > input[i - 1]).length;
  } else {
    var windows = input
      .slice(0, input.length - (samples - 1))
      .map((_, i) => input.slice(i, i + samples))
      .map(sum);
    count = windows.filter(
      (_, i) => i > 0 && windows[i] > windows[i - 1]
    ).length;
  }
  return count;
};

const solution: Solution = async () => {
  const input = await getInput;

  return countIncreases(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => countIncreases(testInput), 7);
  await expect(() => countIncreases(testInput, 3), 5);
};

solution.partTwo = async () => {
  const input = await getInput;
  return countIncreases(input, 3);
};

solution.inputs = [getInput];

export default solution;
