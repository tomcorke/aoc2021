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

const process = (input: Input): number => {
  let bestRouteScore = Infinity;
  const w = input[0].length;
  const h = input.length;

  const startScore = input[0][0];
  const getRouteScore = (route: Route): number => {
    return route.reduce((acc, [x, y]) => acc + input[y][x], 0) - startScore;
  };

  const display = (route: Route) => {
    input.forEach((row, y) => {
      console.log(
        row
          .map((v, x) =>
            route.some(([rx, ry]) => rx === x && ry === y)
              ? `\x1b[1m${v}\x1b[0m`
              : v
          )
          .join("")
      );
    });
    console.log(getRouteScore(route));
    console.log("");
  };

  const search = function* (route: Route): Generator<Route> {
    const [x, y] = route[route.length - 1];

    let next: Coord[];
    if (route.length % 2 === 0) {
      next = [
        [x + 1, y],
        [x, y + 1],
        //[x - 1, y],
        //[x, y - 1],
      ] as Coord[];
    } else {
      next = [
        [x, y + 1],
        [x + 1, y],
        //[x, y - 1],
        //[x - 1, y],
      ] as Coord[];
    }

    for (const n of next) {
      const [nx, ny] = n;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
        continue;
      }
      if (route.some(([ox, oy]) => ox === nx && oy === ny)) {
        continue;
      }
      const nextRoute = [...route, n];
      if (getRouteScore(nextRoute) >= bestRouteScore) {
        continue;
      }

      if (nx === w - 1 && ny === h - 1) {
        bestRouteScore = Math.min(bestRouteScore, getRouteScore(nextRoute));
        yield nextRoute;
        continue;
      }

      for (const deeper of search(nextRoute)) {
        yield deeper;
      }
    }

    const endRoutes = next.filter(([nx, ny]) => nx === w - 1 && ny === h - 1);
    if (endRoutes.length) {
      bestRouteScore = Math.min(
        bestRouteScore,
        ...endRoutes.map((r) => getRouteScore([...route, r]))
      );
      return endRoutes.map((r) => [...route, r]);
    }

    return next.flatMap(([nx, ny]) => search([...route, [nx, ny]]));
  };

  const initialRoute: Route = [[0, 0]];

  for (const route of search(initialRoute)) {
    display(route);
  }

  return bestRouteScore;
};

const processPartOne = (input: Input): number => {
  return process(input);
};

const processPartTwo = (input: Input): number => {
  return NaN;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 40);
  // await expect(() => processPartTwo(testInput), 3.141592653589793);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
