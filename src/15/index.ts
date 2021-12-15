import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const DAY = "15";

type Input = number[][];
type Coord = [number, number];
type Route = Coord[];
const parseInput = (values: string[]): Input =>
  values.filter((v) => v).map((v) => v.split("").map(toNumber));

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const multiplyInput = (input: Input): Input => {
  const newInput = input.map((row) => row.slice());
  const h = input.length;
  const w = input[0].length;

  for (let my = 1; my < 5; my++) {
    for (let y = 0; y < h; y++) {
      newInput.push(
        newInput[y].map((v) => {
          let nv = v + my;
          if (nv > 9) {
            return nv - 9;
          }
          return nv;
        })
      );
    }
  }

  for (let y = 0; y < h * 5; y++) {
    const row = newInput[y];
    for (let mx = 1; mx < 5; mx++) {
      newInput[y] = [
        ...newInput[y],
        ...row.map((v) => {
          const nv = v + mx;
          if (nv > 9) {
            return nv - 9;
          }
          return nv;
        }),
      ];
    }
  }

  return newInput;
};

const process = (input: Input): number => {
  let bestRouteScore = Infinity;
  const w = input[0].length;
  const h = input.length;

  const coordToIndex = ([x, y]: Coord): number => x + y * w;
  const indexToCoord = (index: number): Coord => [
    index % w,
    Math.floor(index / w),
  ];

  const visitedNodes: Set<number> = new Set();
  const eligibleNodes: Set<number> = new Set();
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      eligibleNodes.add(coordToIndex([x, y]));
    }
  }

  const dist: Map<number, number> = new Map();
  dist.set(0, 0);

  const prevNodes: Map<number, number> = new Map();

  const startScore = input[0][0];
  const getRouteScore = (route: Route): number => {
    return route.reduce((acc, [x, y]) => acc + input[y][x], 0) - startScore;
  };

  const search = (node: Coord) => {
    const [lx, ly] = node;
    // console.log(`Searching from ${lx},${ly}`);
    const nodeIndex = coordToIndex(node);
    const unvisitedNeighbours: Coord[] = (
      [
        [lx, ly + 1],
        [lx + 1, ly],
        [lx, ly - 1],
        [lx - 1, ly],
      ] as Coord[]
    ).filter(
      ([x, y]) => input[y]?.[x] && !visitedNodes.has(coordToIndex([x, y]))
    );
    const nodeScore = dist.get(nodeIndex)!;
    for (const [nx, ny] of unvisitedNeighbours) {
      eligibleNodes.add(coordToIndex([nx, ny]));
      const index = coordToIndex([nx, ny]);
      const score = nodeScore + input[ny][nx];
      if (score < (dist.get(index) ?? Infinity)) {
        dist.set(index, score);
        prevNodes.set(index, nodeIndex);
      }
    }
    visitedNodes.add(nodeIndex);
    // unvisitedNodes.delete(nodeIndex);
    eligibleNodes.delete(nodeIndex);
  };

  const totalNodes = w * h;
  // let visitedNodes = 1;
  while (visitedNodes.size < totalNodes) {
    const minDistEntry = Array.from(eligibleNodes.values())
      // .filter((index) => dist.has(index))
      .map((index) => [index, dist.get(index)!])
      .reduce(
        ([minIndex, minDist], [index, dist]) => {
          if (dist < minDist) {
            return [index, dist];
          }
          return [minIndex, minDist];
        },
        [0, Infinity]
      );
    const minNode = indexToCoord(minDistEntry[0]);
    search(minNode);
    // visitedNodes++;

    /*if (visitedNodes % 100 === 0) {
      console.log(`Visited ${visitedNodes}/${totalNodes} nodes`);
    }*/
  }

  const display = (route: Route) => {
    input.forEach((row, y) => {
      console.log(
        row
          .map((v, x) =>
            route.some(([rx, ry]) => rx === x && ry === y)
              ? `\x1b[102m\x1b[90m${v}\x1b[0m`
              : v
          )
          .join("")
      );
    });
    console.log(getRouteScore(route));
    console.log("");
  };

  /*
  const route: Route = [];
  let lastNode = coordToIndex([w - 1, h - 1]);
  route.unshift(indexToCoord(lastNode));
  let prevNode = prevNodes.get(lastNode);
  while (prevNode !== undefined) {
    route.unshift(indexToCoord(prevNode));
    prevNode = prevNodes.get(prevNode);
  }
  display(route);
  */

  bestRouteScore = dist.get(coordToIndex([w - 1, h - 1]))!;

  return bestRouteScore;
};

const processPartOne = (input: Input): number => {
  return process(input);
};

const processPartTwo = (input: Input): number => {
  return process(multiplyInput(input));
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 40);
  await expect(() => processPartTwo(testInput), 315);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
