import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

enum Direction {
  Up,
  Down,
  Forward,
}

interface Move {
  direction: Direction;
  distance: number;
}

const toDirection = (value: string) => {
  switch (value) {
    case "up":
      return Direction.Up;
    case "down":
      return Direction.Down;
    case "forward":
      return Direction.Forward;
  }
  throw new Error(`Unknown direction ${value}`);
};

const toMove = (input: string): Move => {
  const values = input.split(" ");
  return {
    direction: toDirection(values[0]),
    distance: toNumber(values[1]),
  };
};

const getInput = readFileSeparated("\n", "02", "input").then((values) =>
  values.map(toMove)
);

const getTestInput = readFileSeparated("\n", "02", "testInput").then((values) =>
  values.map(toMove)
);

const process = (input: Move[]) => {
  let position = 0;
  let depth = 0;
  input.forEach((move) => {
    switch (move.direction) {
      case Direction.Up:
        depth -= move.distance;
        break;
      case Direction.Down:
        depth += move.distance;
        break;
      case Direction.Forward:
        position += move.distance;
        break;
    }
  });
  return position * depth;
};

const process2 = (input: Move[]) => {
  let position = 0;
  let depth = 0;
  let aim = 0;
  input.forEach((move) => {
    switch (move.direction) {
      case Direction.Up:
        aim -= move.distance;
        break;
      case Direction.Down:
        aim += move.distance;
        break;
      case Direction.Forward:
        position += move.distance;
        depth += aim * move.distance;
        break;
    }
  });
  return position * depth;
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput), 150);
  await expect(() => process2(testInput), 900);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput];

export default solution;
