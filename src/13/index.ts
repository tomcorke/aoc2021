import { readFile, toNumber, expect } from "../helpers";
import { Solution } from "..";

const DAY = "13";

type Input = { points: [number, number][]; folds: [string, number][] };
const parseInput = (contents: string): Input => {
  const [pointsS, foldsS] = contents.split("\n\n");
  return {
    points: pointsS
      .split("\n")
      .map((p) => p.split(",").map(toNumber) as [number, number]),
    folds: foldsS
      .split("\n")
      .filter((f) => f.trim())
      .map((f) => {
        const [a, ds] = f.substring(11).split("=");
        return [a, toNumber(ds)] as [string, number];
      }),
  };
};

const getInput = readFile(DAY, "input").then(parseInput);
const getTestInput = readFile(DAY, "testInput").then(parseInput);

const display = (points: [number, number][]) => {
  const maxX = Math.max(...points.map(([x]) => x));
  const maxY = Math.max(...points.map(([x, y]) => y));
  const grid = Array(maxY + 1)
    .fill(0)
    .map(() => Array(maxX + 1).fill(0));
  points.forEach(([x, y]) => {
    grid[y][x] = 1;
  });
  grid.forEach((row) =>
    console.log(row.map((x) => (x ? "##" : "..")).join(""))
  );
  console.log("");
};

const process = (input: Input, foldLimit: number = NaN) => {
  let points = input.points.slice();
  input.folds.forEach(([a, d], i) => {
    if (!isNaN(foldLimit) && i >= foldLimit) {
      return;
    }
    if (a === "x") {
      points = points.map(([x, y]) => {
        const delta = x - d;
        if (delta > 0) {
          return [d - delta, y];
        }
        return [x, y];
      });
    } else if (a === "y") {
      points = points.map(([x, y]) => {
        const delta = y - d;
        if (delta > 0) {
          return [x, d - delta];
        }
        return [x, y];
      });
    }
    points = points.filter(
      ([x, y], i) => points.findIndex(([x2, y2]) => x === x2 && y === y2) === i
    );
  });
  isNaN(foldLimit) && display(points);
  return points.length;
};

const processPartOne = (input: Input): number => {
  return process(input, 1);
};

const processPartTwo = (input: Input): number => {
  return process(input);
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 17);
  // await expect(() => processPartTwo(testInput), 3.141592653589793);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
