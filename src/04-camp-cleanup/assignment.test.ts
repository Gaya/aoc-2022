import {
  findCompleteOverlapping, findOverlapping,
  hasAssignmentCompleteOverlap,
  hasAssignmentOverlap,
} from './assignment';

describe('hasAssignmentCompleteOverlap', () => {
  it('should correctly identify overlaps', () => {
    expect(hasAssignmentCompleteOverlap('6-6,4-6')).toBe(true);
    expect(hasAssignmentCompleteOverlap('2-8,3-7')).toBe(true);
    expect(hasAssignmentCompleteOverlap('20-80,30-70')).toBe(true);
  });

  it('should correctly identify non-overlaps', () => {
    expect(hasAssignmentCompleteOverlap('2-4,6-8')).toBe(false);
    expect(hasAssignmentCompleteOverlap('2-3,4-5')).toBe(false);
    expect(hasAssignmentCompleteOverlap('5-7,7-9')).toBe(false);
    expect(hasAssignmentCompleteOverlap('50-70,70-90')).toBe(false);
  });
});

describe('findCompleteOverlapping', () => {
  it('should only find two overlapping in example', () => {
    const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;
    expect(findCompleteOverlapping(input).length).toBe(2);
  });
});

describe('hasAssignmentOverlap', () => {
  it('should correctly identify overlaps', () => {
    expect(hasAssignmentOverlap('5-7,7-9')).toBe(true);
    expect(hasAssignmentOverlap('6-6,4-6')).toBe(true);
    expect(hasAssignmentOverlap('2-8,3-9')).toBe(true);
    expect(hasAssignmentOverlap('20-80,30-70')).toBe(true);
  });

  it('should correctly identify non-overlaps', () => {
    expect(hasAssignmentOverlap('50-70,71-90')).toBe(false);
    expect(hasAssignmentOverlap('50-70,10-20')).toBe(false);
    expect(hasAssignmentOverlap('50-70,10-49')).toBe(false);
  });
});

describe('findOverlapping', () => {
  it('should only find four overlapping in example', () => {
    const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;
    expect(findOverlapping(input).length).toBe(4);
  });
});
