import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const DAY = "09";

type Input = number[][];
const parseInput = (values: string[]): Input =>
  values.filter((v) => v).map((v) => v.split("").map(toNumber));

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

const displayMapWithBasin = (map: number[][], basin: number[][]) => {
  map.forEach((row, y) => {
    let line = "";
    row.forEach((col, x) => {
      const h = map[y][x];
      line += basin.some((p) => p[0] === x && p[1] === y)
        ? `\x1b[1m\x1b[41m${h}\x1b[0m`
        : h;
    });
    console.log(line);
  });
  console.log("");
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

  const flood = (x: number, y: number) => {
    const points: number[][] = [];

    const floodHigher = (x: number, y: number): Coord[] => {
      if (x < 0 || y < 0 || x > mx || y > my) {
        return [];
      }
      if (points.some((pp) => pp[0] === x && pp[1] === y)) {
        return [];
      }
      const h = input[y][x];
      if (h >= 9) {
        return [];
      }
      points.push([x, y]);
      return [
        [x, y],
        ...floodHigher(x, y - 1),
        ...floodHigher(x, y + 1),
        ...floodHigher(x + 1, y),
        ...floodHigher(x - 1, y),
      ];
    };

    return floodHigher(x, y);
  };

  const basins: number[][][] = [];
  lows.forEach((low) => {
    const [x, y] = low;
    const basin = flood(x, y);
    basins.push(basin);
    // displayMapWithBasin(input, basin);
  });

  const basinsBySize = basins.sort((a, b) => b.length - a.length);
  const topThreeBasins = basinsBySize.slice(0, 3);
  const basinSum = topThreeBasins.reduce((acc, basin) => acc * basin.length, 1);

  /*
  const combinedTopBasins = topThreeBasins.reduce(
    (acc, basin) => [...acc, ...basin],
    [] as number[][]
  );
  displayMapWithBasin(input, combinedTopBasins);
  */

  return basinSum;
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
