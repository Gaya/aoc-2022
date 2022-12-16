import { findDistressBeacon, parseSensorInput, scannedColsInRow } from './beacons';

// https://adventofcode.com/2022/day/15
export default function solution(input: string) {
  const part1 = Object.keys(scannedColsInRow(parseSensorInput(input), 2000000)).length;
  const part2 = 0; // findDistressBeacon(parseSensorInput(input), 0 ,4000000);

  return [part1, part2];
}
