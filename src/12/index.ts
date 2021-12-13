import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { linkSync } from "fs";

const DAY = "12";

class CaveMap {
  links: Map<string, string[]> = new Map<string, string[]>();
  addLink(from: string, to: string) {
    this.links.set(from, [...(this.links.get(from) || []), to]);
    this.links.set(to, [...(this.links.get(to) || []), from]);
  }
}

type Input = CaveMap;
const parseInput = (values: string[]): Input => {
  const map = new CaveMap();
  values.forEach((v) => {
    const [a, b] = v.split("-");
    map.addLink(a, b);
  });
  return map;
};

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);
const getTestInput2 = readFileSeparated("\n", DAY, "testInput2").then(
  parseInput
);
const getTestInput3 = readFileSeparated("\n", DAY, "testInput3").then(
  parseInput
);

const isSmallCave = (node: string) => /^[a-z]+$/.test(node);
const canVisit = (node: string, route: string[]) => {
  if (!isSmallCave(node)) return true;
  return !route.includes(node);
};

const newCanVisit = (node: string, route: string[]) => {
  if (node === "start") {
    return false;
  }
  if (!isSmallCave(node)) return true;
  const anySmallCaveVisistedTwice = route.some(
    (n, i) => isSmallCave(n) && route.indexOf(n) < i
  );
  if (!anySmallCaveVisistedTwice) return true;
  return !route.includes(node);
};

const search = (
  map: Input,
  route: string[],
  nodeFilter: (node: string, route: string[]) => boolean = canVisit
): string[][] => {
  const lastNode = route[route.length - 1];
  if (lastNode === "end") {
    return [route];
  }
  const nextNodes = map.links
    .get(lastNode)!
    .filter((node) => nodeFilter(node, route));
  return [
    ...nextNodes.flatMap((node) => search(map, [...route, node], nodeFilter)),
  ];
};

const processPartOne = (input: Input): number => {
  const routes = search(input, ["start"]);
  return routes.length;
};

const processPartTwo = (input: Input): number => {
  const routes = search(input, ["start"], newCanVisit);
  return routes.length;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  const testInput3 = await getTestInput3;
  await expect(() => processPartOne(testInput), 10);
  await expect(() => processPartOne(testInput2), 19);
  await expect(() => processPartOne(testInput3), 226);
  await expect(() => processPartTwo(testInput), 36);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
