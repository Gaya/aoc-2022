import { deepCopy } from '../utils';

const monkeyParser = /^Monkey (?<monkey>\d+):\n[\sa-zA-Z:]+(?<items>[\d+,\s]+)\n[\sa-zA-Z:]+=\s(?<operation>.+)\n[\sa-zA-Z:]+(?<divisible>\d+)\n[\sa-zA-Z:]+(?<true>\d+)\n[\sa-zA-Z:]+(?<false>\d+)/gm;
const operationParser = /^(old|\d+) ([+*]) (old|\d+)$/

type Monkeys = Record<number, Monkey>;

interface Monkey {
  id: number;
  inspections: number;
  items: bigint[];
  operation: string;
  divisible: number;
  ifTrue: number;
  ifFalse: number;
}

export function parseMonkeyInput(input: string): Monkeys {
  const parsed = [...input.matchAll(monkeyParser)];
  return parsed.reduce((acc: Monkeys, match) => {
    if (!match.groups) {
      return acc;
    }

    const monkey: Monkey = {
      id: parseInt(match.groups.monkey, 10),
      inspections: 0,
      items: match.groups.items.split(', ').map((i) => BigInt(parseInt(i, 10))),
      operation: match.groups.operation,
      divisible: parseInt(match.groups.divisible, 10),
      ifTrue: parseInt(match.groups.true, 10),
      ifFalse: parseInt(match.groups.false, 10),
    };

    return {
      ...acc,
      [monkey.id]: monkey,
    }
  }, {});
}

export function performOperation(operation: string, input: bigint): bigint {
  const [_, f, o, s] = operation.match(operationParser) || [];

  if (!_) {
    return input;
  }

  const first = f === 'old' ? input : BigInt(parseInt(f, 10));
  const second = s === 'old' ? input : BigInt(parseInt(s, 10));

  if (o === '+') {
    return first + second;
  }

  if (o === '*') {
    return first * second;
  }

  return input;
}

function doMonkeyRound(monkeys: Monkeys, suppressWorry = true): Monkeys {
  for (const monkey of Object.values(monkeys)) {
    do {
      const item = monkey.items.shift();

      if (!item) continue;

      let worryLevel = performOperation(monkey.operation, item);

      if (suppressWorry) {
        worryLevel = BigInt(worryLevel / BigInt(3));
      }

      const worryCheckedOut = worryLevel % BigInt(monkey.divisible) === BigInt(0);

      monkeys[worryCheckedOut ? monkey.ifTrue : monkey.ifFalse].items.push(worryLevel);

      monkey.inspections += 1;
    } while (monkey.items.length > 0);
  }

  return monkeys;
}

export function doMonkeyRounds(monkeys: Monkeys, amount = 1, suppressWorry = true) {
  for (let  i = 0; i < amount; i++) {
    monkeys = doMonkeyRound(monkeys, suppressWorry);
  }

  return monkeys;
}

export function getMonkeyBusiness(monkeys: Monkeys): number {
  const [a, b] = Object.values(monkeys).map((m) => m.inspections).sort((a, b) => b - a);

  return a * b;
}
