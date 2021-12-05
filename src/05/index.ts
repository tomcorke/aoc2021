import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const DAY = "05";

interface Coord {
  x: number;
  y: number;
}

interface Line {
  a: Coord;
  b: Coord;
}

const parse = (line: string): Line => {
  const [x1, y1, x2, y2] = line
    .split(" -> ")
    .join(",")
    .split(",")
    .map(toNumber);
  return { a: { x: x1, y: y1 }, b: { x: x2, y: y2 } };
};

const getInput = readFileSeparated("\n", DAY, "input").then((values) =>
  values.filter((line) => line).map(parse)
);

const getTestInput = readFileSeparated("\n", DAY, "testInput").then((values) =>
  values.filter((line) => line).map(parse)
);

const isHorizontal = (line: Line) => line.a.y === line.b.y;
const isVertical = (line: Line) => line.a.x === line.b.x;

const isHorizontalOrVertical = (line: Line) =>
  isHorizontal(line) || isVertical(line);

const all = (line: Line) => true;

const process = (input: Line[], filter: (l: Line) => boolean) => {
  const map: number[][] = [];
  const lines = input.filter(filter);
  const setPoint = (x: number, y: number) => {
    map[y] = map[y] || [];
    map[y][x] = (map[y][x] || 0) + 1;
  };
  lines.forEach((line) => {
    const { a, b } = line;
    let x = a.x;
    let y = a.y;
    let dx = b.x === a.x ? 0 : b.x > a.x ? 1 : -1;
    let dy = b.y === a.y ? 0 : b.y > a.y ? 1 : -1;
    setPoint(x, y);
    while (x !== b.x || y !== b.y) {
      x += dx;
      y += dy;
      setPoint(x, y);
    }
  });
  return map.reduce((acc, row) => acc + row.filter((v) => v > 1).length, 0);
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input, isHorizontalOrVertical);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput, isHorizontalOrVertical), 5);
  await expect(() => process(testInput, all), 12);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process(input, all);
};

solution.inputs = [getInput];

export default solution;
