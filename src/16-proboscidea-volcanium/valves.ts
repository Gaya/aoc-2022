const matchValve = /(?<valve>[A-Z]{2}).+=(?<rate>\d+).+valves? (?<tunnels>(?:[A-Z]{2},? ?)+)/gm;

interface Valve {
  key: string;
  flow: number;
  tunnels: string[];
  distances: Record<string, number>;
  opened?: boolean;
}

type Valves = Record<string, Valve>;

type Path = Record<string, { d: number; f: string }>;

function findPath(valves: Valves, from: string, to: string): Path {
  if (valves[from].tunnels.includes(to)) {
    return {
      [from]: {
        d: 1,
        f: to,
      }
    };
  }

  const valveKeys = Object.keys(valves);
  let unvisited = Object.values(valves);
  const results: Path = valveKeys
    .reduce((acc: Path, k) => ({
      ...acc,
      [k]: { d: Infinity, f: '' },
    }), {});
  let current = to;
  results[current] = { d: 0, f: current };

  let searching = true;

  while (searching) {
    for (const valve of valves[current].tunnels) {
      const dist = results[current].d + 1;

      if (results[valve].d > dist) {
        results[valve] = { d: dist, f: current };
      }
    }

    unvisited = unvisited.filter((v) => v.key !== current);

    if (current === from || unvisited.every((v) => results[v.key].d === Infinity)) {
      searching = false;
      return results;
    }

    unvisited.sort((a, b) => results[a.key].d - results[b.key].d);
    current = unvisited[0].key;

    if (current === from) {
      searching = false;
      return results;
    }
  }

  throw new Error('No path found.');
}

export function parseValves(input: string): Valves {
  const matched = [...input.matchAll(matchValve)];

  const valves = matched.reduce((acc: Valves, match) => {
    if (!match.groups) {
      return acc;
    }

    return {
      [match.groups.valve]: {
        key: match.groups.valve,
        flow: parseInt(match.groups.rate, 10),
        tunnels: match.groups.tunnels.split(', '),
        distances: {},
      },
      ...acc,
    };
  }, {});

  const valveKeys = Object.keys(valves);
  return valveKeys.reduce((acc, key) => {
    const otherValves = valveKeys.filter((k) => k !== key);
    const valve = valves[key];

    return {
      ...acc,
      [valve.key]: {
        ...valve,
        distances: otherValves.reduce((acc: Record<string, number>, key) => {
          return {
            ...acc,
            [key]: findPath(valves, valve.key, key)[valve.key].d,
          };
        }, {}),
      },
    };
  }, valves);
}

export function findMaxPossibleFlow(
  valves: Valves,
  start: Valve,
  minutes: number,
  withElephant = false,
): number {
  const allValves = Object.values(valves);
  const flows: Record<string, number[]> = allValves
    .reduce((acc, valve) => {
      let outputs: number[] = [];

      for (let i = minutes; i >= 0; i--) {
        outputs[i] = valve.flow * i;
      }

      return {
        ...acc,
        [valve.key]: outputs,
      };
    }, {});
  const scores: Record<string, number> = {};
  const flowValves = allValves.filter((v) => v.flow > 0);
  let highestScore = 0;

  function maxTotal(valvesLeft: Valve[], minutesLeft: number): number {
    return valvesLeft.reduce((acc, v) => {
      return acc + (flows[v.key][minutesLeft] || 0);
    }, 0);
  }

  function findScores(
    currentValve: Valve,
    opened: string[],
    minutesLeft: number,
    path: string,
    score: number,
    eCurrentValve: Valve,
    eMinutesLeft: number,
  ) {
    const human = !withElephant || minutesLeft >= eMinutesLeft;

    const otherValves = flowValves.filter((v) => !opened.includes(v.key));

    for (const nextValve of otherValves) {
      const d = (human ? currentValve : eCurrentValve).distances[nextValve.key];
      const t = human ? minutesLeft - d - 1 : minutesLeft;
      const et = !human ? eMinutesLeft - d - 1 : eMinutesLeft;
      const f = flows[nextValve.key][human ? t : et];
      const p = [path, nextValve.key].join(':');
      const o = [...opened, nextValve.key];
      const s = f + score;
      const max = maxTotal(
        otherValves.filter((v) => !o.includes(v.key)),
        Math.max(minutesLeft - 1, eMinutesLeft - 1),
      );

      if (s > highestScore) {
        highestScore = s;
        scores[p] = s;
      }

      // give it a chance
      if (t > 0 && et > 0 && s + max >= highestScore) {
        findScores(
          human ? nextValve : currentValve,
          o,
          t,
          p,
          s,
          !human ? nextValve : eCurrentValve,
          et,
        );
      }
    }
  }

  findScores(start, [], minutes, 'AA', 0, start, minutes);

  return highestScore;
}
