import { readFile, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { schedulingPolicy } from "cluster";
import { split } from "lodash";

const DAY = "16";

type Input = string;
const parseInput = (value: string): Input => value.trim();

const getInput = readFile(DAY, "input").then(parseInput);

const stringToBinary = (hexString: string) =>
  hexString
    .split("")
    .map((s) => parseInt(s, 16).toString(2).padStart(4, "0"))
    .join("");

interface HeadRef {
  head: number;
}
const read = (data: boolean[], h: HeadRef, numBits: number) => {
  const bits = data.slice(h.head, h.head + numBits);
  h.head += numBits;
  const s = bits.map((b) => (b ? "1" : "0")).join("");
  return s;
};
const readNum = (data: boolean[], h: HeadRef, numBits: number) => {
  const s = read(data, h, numBits);
  const v = parseInt(s, 2);
  if (isNaN(v)) {
    throw Error("Unexpected NaN");
  }
  return v;
};

class Packet {
  version: number;
  type: number;
  value: number;
  subPackets: Packet[];

  constructor(
    version: number,
    type: number,
    value: number,
    subPackets: Packet[] = []
  ) {
    this.version = version;
    this.type = type;
    this.value = value;
    this.subPackets = subPackets;
  }

  versionSum(): number {
    return (
      this.version +
      this.subPackets.reduce((acc, sp) => acc + sp.versionSum(), 0)
    );
  }

  getValue(): number {
    switch (this.type) {
      case 0: // sum packet
        return this.subPackets.reduce((acc, sp) => acc + sp.getValue(), 0);
      case 1:
        return this.subPackets.reduce((acc, sp) => acc * sp.getValue(), 1);
      case 2:
        return Math.min(...this.subPackets.map((sp) => sp.getValue()));
      case 3:
        return Math.max(...this.subPackets.map((sp) => sp.getValue()));
      case 4:
        return this.value;
      case 5:
        return this.subPackets[0].getValue() > this.subPackets[1].getValue()
          ? 1
          : 0;
      case 6:
        return this.subPackets[0].getValue() < this.subPackets[1].getValue()
          ? 1
          : 0;
      case 7:
        return this.subPackets[0].getValue() === this.subPackets[1].getValue()
          ? 1
          : 0;
    }
    throw Error("Unexpected type ID for version operation");
  }

  static fromData(data: boolean[], h: HeadRef) {
    const version = readNum(data, h, 3);
    const type = readNum(data, h, 3);

    if (type === 4) {
      // Type 4, literal value
      let literalData: string;
      let buffer: string[] = [];
      do {
        literalData = read(data, h, 5);
        buffer.push(literalData.substring(1));
      } while (literalData[0] === "1");
      const literalValue = parseInt(buffer.join(""), 2);
      return new Packet(version, type, literalValue);
    } else {
      // Any other type, operator packet
      const lengthTypeId = readNum(data, h, 1);
      if (lengthTypeId === 0) {
        // Next 15 bits are total subpacket length
        const subPacketTotalLength = readNum(data, h, 15);
        const currentHead = h.head;
        const subPackets: Packet[] = [];
        while (h.head < currentHead + subPacketTotalLength) {
          const subPacket = Packet.fromData(data, h);
          subPackets.push(subPacket);
        }
        return new Packet(version, type, NaN, subPackets);
      } else {
        // Next 11 bits are number that represents number of sub packets
        const numberOfSubPackets = readNum(data, h, 11);
        const subPackets: Packet[] = [];
        while (subPackets.length < numberOfSubPackets) {
          subPackets.push(Packet.fromData(data, h));
        }
        return new Packet(version, type, NaN, subPackets);
      }
    }

    throw Error("Unexpected end of Packet.fromData");
  }
}

const processPartOne = (input: Input): number => {
  const binary = stringToBinary(input);
  const bits = binary.split("").map((n) => n === "1");

  let head = 0;
  const headRef = { head };

  const packet = Packet.fromData(bits, headRef);
  return packet.versionSum();
};

const processPartTwo = (input: Input): number => {
  const binary = stringToBinary(input);
  const bits = binary.split("").map((n) => n === "1");

  let head = 0;
  const headRef = { head };

  const packet = Packet.fromData(bits, headRef);
  return packet.getValue();
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  await expect(() => stringToBinary("0"), "0000");
  await expect(() => stringToBinary("F"), "1111");
  processPartOne("D2FE28");
  processPartOne("38006F45291200");
  processPartOne("EE00D40C823060");
  await expect(() => processPartOne("8A004A801A8002F478"), 16);
  await expect(() => processPartOne("620080001611562C8802118E34"), 12);
  await expect(() => processPartOne("C0015000016115A2E0802F182340"), 23);
  await expect(() => processPartOne("A0016C880162017C3686B18A3D4780"), 31);

  await expect(() => processPartTwo("C200B40A82"), 3);
  await expect(() => processPartTwo("04005AC33890"), 54);
  await expect(() => processPartTwo("880086C3E88112"), 7);
  await expect(() => processPartTwo("CE00C43D881120"), 9);
  await expect(() => processPartTwo("D8005AC2A8F0"), 1);
  await expect(() => processPartTwo("F600BC2D8F"), 0);
  await expect(() => processPartTwo("9C005AC2F8F0"), 0);
  await expect(() => processPartTwo("9C0141080250320F1802104A08"), 1);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
