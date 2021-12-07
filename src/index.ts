import { performance } from "perf_hooks";

type Answer = string | number | number[];
type AsyncAnswer = Promise<Answer>;
export type Solution = {
  (): Answer | AsyncAnswer;
  partTwo?: Solution;
  tests?: () => Promise<void> | void;
  inputs?: Promise<any>[];
};

const args = Array.from(process.argv.slice(2));

const validDayRegex = /^\d{1,2}$/;

if (!args[0] || !validDayRegex.test(args[0])) {
  throw Error(
    'Day must be specified as two digit number, e.g. "npm start -- 01"'
  );
}

const dayString = args[0].padStart(2, "0");

let solution: Solution | undefined;
try {
  solution = require(`./${dayString}/`).default;
} catch (e: any) {
  console.error(`Error loading solution for day ${args[0]}:`, e.message);
  process.exit(1);
}

const timeSolution = async <T>(func: () => T) => {
  const start = performance.now();
  const result = await func();
  const end = performance.now();
  return [result, Math.floor((end - start) * 100) / 100];
};

(async () => {
  const day = args[0];
  let mode = "initialisation";
  try {
    if (!solution) {
      throw Error("Solution not defined");
    }
    if (typeof solution !== "function") {
      throw Error("Solution is not a function");
    }

    if (args.includes("--wait")) {
      console.log('Pausing with "--wait", press any key to continue...');
      await new Promise<void>((resolve) => {
        process.stdin.setRawMode && process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on("data", () => {
          process.stdin.setRawMode && process.stdin.setRawMode(false);
          resolve();
        });
      });
    }

    if (solution.inputs) {
      console.log("Waiting for async inputs to resolve...");
      await Promise.all(solution.inputs);
    }

    if (typeof solution.tests === "function") {
      mode = "tests";
      console.log("");
      console.log("Running tests...");
      const [_, testTime] = await timeSolution(solution.tests);
      console.log(`Completed in ${testTime}ms`);
    }

    mode = "solution part one";
    console.log("");
    console.log(`Running day ${day} part one...`);
    const [result, partOneTime] = await timeSolution(solution);
    console.log("");
    console.log(`Day ${day} part one result:`, result);
    console.log(`Completed in ${partOneTime}ms`);

    if (solution.partTwo) {
      mode = "solution part two";
      console.log("");
      console.log(`Running day ${day} part two...`);
      const [partTwoResult, partTwoTime] = await timeSolution(solution.partTwo);
      console.log("");
      console.log(`Day ${day} part two result:`, partTwoResult);
      console.log(`Completed in ${partTwoTime}ms`);
    }

    console.log("");
  } catch (e) {
    console.error(`Error running ${mode} for day ${day}:`, e);
  }
})();
