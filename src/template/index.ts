import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const DAY = "{DAY}";

const getInput = readFileSeparated("\n", DAY, "input").then((values) => values);

const getTestInput = readFileSeparated("\n", DAY, "testInput").then(
  (values) => values
);

const solution: Solution = async () => {
  const input = await getInput;

  return NaN;
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => 123, 123);
};

solution.partTwo = async () => {
  const input = await getInput;
  return NaN;
};

solution.inputs = [getInput];

export default solution;
