import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { filter } from "lodash";
import { time } from "console";

const DAY = "11";

type Input = number[][];
const parseInput = (values: string[]): Input =>
  values.map((v) => v.split("").map(toNumber));

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const display = (input: Input) => {
  console.log(
    input
      .map((row) =>
        row
          .map((c) => {
            if (c === 0) {
              return `\x1b[1m${c}\x1b[0m`;
            }
            return c;
          })
          .join("")
      )
      .join("\n") + "\n"
  );
};

const step = (grid: Input): Input => {
  let fc = 0;
  let lastFc: number = 0;

  // Simple increment all cells, flash above 9 down to zero
  const g = grid.slice().map((row, y) => {
    return row.map((cell, x) => {
      let ng = cell + 1;
      if (ng > 9) {
        ng = 0;
        fc++;
      }
      return ng;
    });
  });

  const getAdjacents = (
    grid: Input,
    x: number,
    y: number,
    fn: (n: number) => boolean
  ) => {
    const adj = [
      grid[y - 1]?.[x - 1],
      grid[y - 1]?.[x],
      grid[y - 1]?.[x + 1],
      grid[y]?.[x - 1],
      grid[y]?.[x + 1],
      grid[y + 1]?.[x - 1],
      grid[y + 1]?.[x],
      grid[y + 1]?.[x + 1],
    ];
    return adj.filter(fn);
  };

  do {
    lastFc = fc;

    g.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          // If this cell would be pushed over 9 by adjacent flashes, flash this cell too
          if (cell + getAdjacents(g, x, y, (n) => n === 0).length > 9) {
            g[y][x] = 0;
            fc++;
          }
        }
      });
    });
  } while (lastFc !== fc);

  return g.map((row, y) => {
    return row.map((cell, x) => {
      return cell > 0 ? cell + getAdjacents(g, x, y, (n) => n === 0).length : 0;
    });
  });
};

const processPartOne = (input: Input): number => {
  let g = input;

  let flashes = 0;
  for (let i = 0; i < 100; i++) {
    g = step(g);
    flashes += g.reduce(
      (sum, row) => sum + row.filter((r) => r === 0).length,
      0
    );
  }
  return flashes;
};

const processPartTwo = (input: Input): number => {
  let g = input;

  let flashes = 0;
  let time = 0;
  while (true) {
    time++;
    g = step(g);
    if (g.every((row) => row.every((cell) => cell === 0))) {
      return time;
    }
    if (time > 1000000) {
      throw Error("This is madness");
    }
  }
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  /*
  const smallTestInput = parseInput(
    `11111
19991
19191
19991
11111`.split("\n")
  );
  processPartOne(smallTestInput);
  */
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 1656);
  await expect(() => processPartTwo(testInput), 195);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
