/// <reference types="jest" />
import { daysBetween, monthWeeks, sameDay } from './calendar';

describe('monthWeeks', () => {
  it('lays November 2026 out in Sunday-first weeks', () => {
    const weeks = monthWeeks(2026, 10);
    expect(weeks[0][0].date.getDate()).toBe(1); // Nov 1 2026 is a Sunday
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    const days = weeks.flat().filter((c) => c.inMonth);
    expect(days).toHaveLength(30);
  });

  it('pads the first week with the previous month', () => {
    const weeks = monthWeeks(2026, 9); // Oct 1 2026 is a Thursday
    expect(weeks[0].filter((c) => !c.inMonth)).toHaveLength(4);
  });
});

describe('daysBetween / sameDay', () => {
  it('counts calendar days, ignoring the time of day', () => {
    expect(daysBetween(new Date(2026, 10, 12, 9), new Date(2026, 10, 10, 23))).toBe(2);
    expect(sameDay(new Date(2026, 10, 12, 1), new Date(2026, 10, 12, 22))).toBe(true);
  });
});
