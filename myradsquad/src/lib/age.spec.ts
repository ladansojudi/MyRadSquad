/// <reference types="jest" />
import { ageOn, daysInMonth } from './age';

describe('ageOn', () => {
  const today = new Date(2026, 10, 12);

  it('counts a birthday that already happened this year', () => {
    expect(ageOn({ year: 2011, month: 2, day: 12 }, today)).toBe(15);
  });

  it('subtracts a year before the birthday', () => {
    expect(ageOn({ year: 2011, month: 11, day: 1 }, today)).toBe(14);
  });

  it('counts the birthday itself', () => {
    expect(ageOn({ year: 2013, month: 10, day: 12 }, today)).toBe(13);
  });
});

describe('daysInMonth', () => {
  it('handles leap years', () => {
    expect(daysInMonth(2012, 1)).toBe(29);
    expect(daysInMonth(2011, 1)).toBe(28);
  });
});
