import { readFile } from 'fs/promises';

// https://adventofcode.com/2022/day/6
export default async function solution() {
  const input = (await readFile(`${__dirname}/input.txt`)).toString();

  const part1 = 0;
  const part2 = 0;

  console.log(`Day 6 - Part 1: ${part1}`);
  console.log(`Day 6 - Part 2: ${part2}`);
}
