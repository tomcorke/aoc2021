import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { runInNewContext } from "vm";

const DAY = "09";

type Input = number[][];
const parseInput = (values: string[]): Input =>
  values.map((v) => v.split("").map(toNumber));

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const isLowPoint = (input: Input, x: number, y: number) => {
  const mx = input[0].length - 1;
  const my = input.length - 1;
  const h = input[y][x];
  if (x > 0 && input[y][x - 1] <= h) {
    return false;
  }
  if (y > 0 && input[y - 1][x] <= h) {
    return false;
  }
  if (x < mx && input[y][x + 1] <= h) {
    return false;
  }
  if (y < my && input[y + 1][x] <= h) {
    return false;
  }
  return true;
};

const processPartOne = (input: Input): number => {
  return input.reduce(
    (rowAcc, row, y) =>
      rowAcc +
      row.reduce(
        (colAcc, col, x) =>
          colAcc + (isLowPoint(input, x, y) ? input[y][x] + 1 : 0),
        0
      ),
    0
  );
};

type Coord = number[];
const processPartTwo = (input: Input): number => {
  const mx = input[0].length - 1;
  const my = input.length - 1;

  const lows: Coord[] = [];
  input.forEach((row, y) => {
    row.forEach((col, x) => {
      if (isLowPoint(input, x, y)) {
        lows.push([x, y]);
      }
    });
  });

  const floodHigher = (
    x: number,
    y: number,
    p: Coord[],
    lastH: number
  ): Coord[] => {
    if (x < 0 || y < 0 || x > mx || y > my) {
      return [];
    }
    if (p.some((pp) => pp[0] === x && pp[1] === y)) {
      return [];
    }
    const h = input[y][x];
    if (h === 9) {
      return [];
    }
    const np = [...p, [x, y]];
    return [
      [x, y],
      ...floodHigher(x - 1, y - 1, np, h),
      ...floodHigher(x - 1, y + 1, np, h),
      ...floodHigher(x + 1, y - 1, np, h),
      ...floodHigher(x + 1, y + 1, np, h),
    ];
  };

  lows.forEach((low) => {
    const [x, y] = low;
    const h = input[y][x];
    const basin = floodHigher(x, y, [], h);
    console.log(basin);
  });
  return 1;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 15);
  await expect(() => processPartTwo(testInput), 1134);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
