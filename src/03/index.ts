import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const parse = (value: string) => {
  return value.split("").map((v) => v === "1");
};

const getInput = readFileSeparated("\n", "03", "input").then((values) =>
  values.map(parse)
);

const getTestInput = readFileSeparated("\n", "03", "testInput").then((values) =>
  values.map(parse)
);

const common = (values: boolean[]) => {
  return values.filter((v) => v).length >= values.length / 2;
};

const process = (input: boolean[][]) => {
  const l = input[0].length;
  let gamma = 0;
  let epsilon = 0;
  let m = 1;
  let o = "";
  for (let i = l - 1; i >= 0; i--) {
    const c = common(input.map((v) => v[i]));
    gamma = gamma + (c ? m : 0);
    epsilon = epsilon + (c ? 0 : m);
    m = m * 2;
  }
  const result = gamma * epsilon;
  return { gamma, epsilon, result };
};

const display = (input: boolean[][]) => {
  console.log(
    input.map((v) => v.map((n) => (n ? "1" : "0")).join("")).join("\n")
  );
};

const findRatings = (input: boolean[][]) => {
  let n = 0;
  const l = input[0].length;

  let oxygen = "";
  // find oxygen, most common bits
  let oinput = input.slice();
  let oi = 0;
  while (oinput.length > 1) {
    const c = common(oinput.map((v) => v[oi]));
    oinput = oinput.filter((v) => v[oi] === c);
    oi++;
    n++;
    if (n > 1000) {
      throw Error("Too many iterations");
    }
  }
  oxygen = oinput[0].map((v) => (v ? "1" : "0")).join("");

  let co2 = "";
  // find co2, least common bits
  let cinput = input.slice();
  let ci = 0;
  while (cinput.length > 1) {
    const c = common(cinput.map((v) => v[ci]));
    cinput = cinput.filter((v) => v[ci] !== c);
    ci++;
    n++;
    if (n > 1000) {
      throw Error("Too many iterations");
    }
  }
  co2 = cinput[0].map((v) => (v ? "1" : "0")).join("");

  const ov = parseInt(oxygen, 2);
  const cv = parseInt(co2, 2);
  const result = ov * cv;

  return { oxygen, co2, result };
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input).result;
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process([[true]]).gamma, 1);
  await expect(() => process([[true, false]]).gamma, 2);
  await expect(
    () =>
      process([
        [true, false],
        [true, true],
        [false, true],
      ]).gamma,
    3
  );
  await expect(() => process(testInput).gamma, 22);
  await expect(() => process(testInput).epsilon, 9);

  await expect(() => findRatings(testInput).oxygen, "10111");
  await expect(() => findRatings(testInput).co2, "01010");
  await expect(() => findRatings(testInput).result, 230);
};

solution.partTwo = async () => {
  const input = await getInput;
  return findRatings(input).result;
};

solution.inputs = [getInput];

export default solution;
