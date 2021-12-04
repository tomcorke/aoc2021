import fetch from "isomorphic-fetch";
import util from "util";

require("dotenv-safe").config();

const leaderboardId = process.env.LEADERBOARD_ID;

const sessionCookie = process.env.SESSION_COOKIE;
const highlightNames = (process.env.HIGHLIGHT_NAMES || "").split(",");

const url = `https://adventofcode.com/2021/leaderboard/private/view/${leaderboardId}.json`;

interface CompletionDayTs {
  get_star_ts: number;
}
interface CompletionDataRaw {
  [key: string]: { "1": CompletionDayTs; "2": CompletionDayTs };
}
interface MemberData {
  global_score: number;
  stars: number;
  last_star_ts: number;
  completion_day_level: CompletionDataRaw;
  local_score: number;
  name: string;
  id: string;
}
interface AOCData {
  event: string;
  owner_id: string;
  members: {
    [key: string]: MemberData;
  };
}

type CompletionData = { [day: string]: { [star: string]: string } };
interface IParsedMemberData {
  rank: number;
  stars: number;
  completion_data: CompletionData;
  local_score: number;
  name: string;
}

const highlight = (text: string) => `\x1b[1m${text}\x1b[0m`;

class ParsedMemberData implements IParsedMemberData {
  rank: number;
  stars: number;
  completion_data: CompletionData;
  local_score: number;
  name: string;
  constructor(data: IParsedMemberData) {
    this.rank = data.rank;
    this.stars = data.stars;
    this.completion_data = data.completion_data;
    this.local_score = data.local_score;
    this.name = data.name;
  }
  [util.inspect.custom]() {
    const name = highlightNames.includes(this.name)
      ? highlight(this.name)
      : this.name;
    return `(#${this.rank}) ${name}: ${this.stars}⭐, ${this.local_score}pts
${util.inspect(this.completion_data, false, 10, true)}
`;
  }
}

const parseCompletionData = (data: CompletionDataRaw) => {
  return Object.entries(data).reduce((acc, [day, dayData]) => {
    return {
      ...acc,
      [day]: Object.entries(dayData).reduce((sacc, [star, { get_star_ts }]) => {
        const s = `${new Date(get_star_ts * 1000).toLocaleString()}`;
        if (star === "2") {
          const star1Ts = data[day]["1"].get_star_ts;
          const diff = Math.ceil(get_star_ts - star1Ts);
          const diffm = Math.floor(diff / 60);
          const diffs = diff % 60;
          return { ...sacc, [star]: `${s} (+${diffm}m${diffs}s)` };
        }
        return { ...sacc, [star]: s };
      }, {} as { [key: string]: string }),
    };
  }, {} as CompletionData);
};

const parseMember = (member: MemberData, index: number): ParsedMemberData => {
  const { last_star_ts, completion_day_level, global_score, id, ...rest } =
    member;
  return new ParsedMemberData({
    rank: index + 1,
    ...rest,
    completion_data: parseCompletionData(completion_day_level),
  });
};

const getData = async () => {
  const response = await fetch(url, {
    headers: {
      Cookie: `session=${sessionCookie}`,
    },
  });
  const data = (await response.json()) as AOCData;

  const members = Object.values(data.members)
    .sort((a, b) => b.local_score - a.local_score)
    .map((m, i) => parseMember(m, i))
    .filter((m) => m.rank <= 5 || highlightNames.includes(m.name));
  console.log(util.inspect(members, false, 5, true));

  return data;
};

(async () => {
  await getData();
})();
