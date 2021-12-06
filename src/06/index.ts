import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const DAY = "06";

const getInput = readFileSeparated("\n", DAY, "input").then((values) =>
  values.filter((v) => v).flatMap((v) => v.split(",").map((n) => parseInt(n)))
);

const getTestInput = readFileSeparated("\n", DAY, "testInput").then((values) =>
  values.filter((v) => v).flatMap((v) => v.split(",").map((n) => parseInt(n)))
);

const process = (input: number[]) => {};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput), 5934);
};

solution.partTwo = async () => {
  const input = await getInput;
  return NaN;
};

solution.inputs = [getInput];

export default solution;
