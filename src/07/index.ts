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
  const [imin, imax] = [Math.min(...input), Math.max(...input)];
  const mid = Math.floor((imin + imax) / 2);

  const test = (x: number) => {
    const diffs = input.map((v) => getCost(v, x));
    return diffs.reduce((sum, v) => sum + v, 0);
  };

  let s = Math.ceil((imax - imin) / 4);
  let n = mid;
  while (true) {
    const [l, c, r] = [test(n - 1), test(n), test(n + 1)];
    if (c < l && c < r && s === 1) {
      break;
    } else if (l < c) {
      n -= s;
    } else if (r < c) {
      n += s;
    } else if (r < l) {
      n += s;
    } else if (l < r) {
      n -= s;
    } else {
      throw Error("Unexpected");
    }
    s = Math.ceil(s / 2);
  }
  return test(n);
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
