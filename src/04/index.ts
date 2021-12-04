import util from "util";

import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

class Board {
  data: number[][];
  marks: Set<number> = new Set();
  constructor(data: number[][]) {
    this.data = data;
  }
  [util.inspect.custom]() {
    return `[\n${this.data
      .map((row) =>
        row
          .map((n) => {
            const sn = n.toString().padStart(2, " ");
            return this.marks.has(n) ? `\x1b[1m\x1b[41m${sn}\x1b[0m` : sn;
          })
          .join(" ")
      )
      .map((r) => ` ${r}`)
      .join("\n")}\n]`;
  }
  setMarks(marks: Set<number>) {
    this.marks = marks;
  }
  hasRowBingo(marks: Set<number>) {
    return this.data.some((row) => row.every((n) => marks.has(n)));
  }
  hasColumnBingo(marks: Set<number>) {
    const cols = new Array(this.data[0].length).fill(0).map((_, i) => i);
    return cols.some((col) => this.data.every((row) => marks.has(row[col])));
  }
  hasBingo(marks: Set<number>) {
    return this.hasRowBingo(marks) || this.hasColumnBingo(marks);
  }
  getResult(marks: Set<number>, lastMove: number) {
    const unmarked = this.data.flatMap((row) =>
      row.filter((n) => !marks.has(n))
    );
    const sum = unmarked.reduce((acc, n) => acc + n, 0);
    return sum * lastMove;
  }
}

const parseBoard = (input: string) => {
  const data = input.split("\n").map((line) =>
    line
      .split(/\s+/)
      .map((s) => s.trim())
      .filter((s) => s)
      .map(toNumber)
  );
  return new Board(data);
};

const parse = (input: string[]) => {
  const moves = input[0].split(",").map(toNumber);
  const boards = input.slice(1).map(parseBoard);
  return { moves, boards };
};

const getInput = readFileSeparated("\n\n", "04", "input").then((values) =>
  parse(values)
);

const getTestInput = readFileSeparated("\n\n", "04", "testInput").then(
  (values) => parse(values)
);

const process = (input: { moves: number[]; boards: Board[] }) => {
  for (let i = 0; i < input.moves.length; i++) {
    const m = new Set(input.moves.slice(0, i + 1));
    const completeBoardIndex = input.boards.findIndex((b) => b.hasBingo(m));
    if (completeBoardIndex > -1) {
      const board = input.boards[completeBoardIndex];
      board.setMarks(m);
      console.log(board);
      return board.getResult(m, input.moves.slice(i, i + 1)[0]);
    }
  }
  return NaN;
};

const process2 = (input: { moves: number[]; boards: Board[] }) => {
  let boards = input.boards.slice();
  for (let i = 0; i < input.moves.length; i++) {
    const m = new Set(input.moves.slice(0, i + 1));
    if (boards.length > 1) {
      boards = boards.filter((b) => !b.hasBingo(m));
    } else {
      const board = boards[0];
      if (board.hasBingo(m)) {
        board.setMarks(m);
        console.log(board);
        return board.getResult(m, input.moves.slice(i, i + 1)[0]);
      }
    }
  }
  return NaN;
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput), 4512);
  await expect(() => process2(testInput), 1924);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process2(input);
};

solution.inputs = [getInput];

export default solution;
