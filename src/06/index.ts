import {
  readFile,
  readFileLines,
  readFileSeparated,
  toNumber,
  expect,
} from "../helpers";
import { Solution } from "..";

const DAY = "06";

interface FishMap {
  [days: number]: number;
}

const getInput = readFileSeparated(",", DAY, "input").then((values) =>
  values
    .filter((v) => v.trim())
    .reduce((acc, curr) => {
      const c = parseInt(curr);
      return { ...acc, [c]: (acc[c] || 0) + 1 };
    }, {} as FishMap)
);

const getTestInput = readFileSeparated(",", DAY, "testInput").then((values) =>
  values
    .filter((v) => v.trim())
    .reduce((acc, curr) => {
      const c = parseInt(curr);
      return { ...acc, [c]: (acc[c] || 0) + 1 };
    }, {} as FishMap)
);

const process = (input: FishMap, days = 80) => {
  let day = 0;
  let fish = { ...input };
  while (day < days) {
    let nf = 0;
    fish = Object.entries(fish).reduce((newFish, [d, c]) => {
      const dn = parseInt(d);
      let nd = dn - 1;
      if (dn === 0) {
        nd = 6;
        nf = c;
      }
      return { ...newFish, [nd]: (newFish[nd] || 0) + c };
    }, {} as FishMap);
    fish[8] = nf;
    day++;
  }
  return Object.values(fish).reduce((acc, curr) => acc + curr, 0);
};

const solution: Solution = async () => {
  const input = await getInput;
  return process(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => process(testInput), 5934);
  await expect(() => process(testInput, 256), 26984457539);
};

solution.partTwo = async () => {
  const input = await getInput;
  return process(input, 256);
};

solution.inputs = [getInput];

export default solution;
