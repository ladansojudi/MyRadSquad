/// <reference types="jest" />
import { leftToday } from './time';

describe('leftToday', () => {
  it('counts down to midnight', () => {
    expect(leftToday(new Date(2026, 10, 12, 18, 4))).toBe('5h 56m left');
    expect(leftToday(new Date(2026, 10, 12, 23, 30))).toBe('30m left');
  });
});
