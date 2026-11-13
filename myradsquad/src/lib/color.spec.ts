/// <reference types="jest" />
import { deepen } from './color';

describe('deepen', () => {
  it('darkens a colour and keeps it a hex', () => {
    const d = deepen('#aab5ec');
    expect(d).toMatch(/^#[0-9a-f]{6}$/);
    expect(parseInt(d.slice(1, 3), 16)).toBeLessThan(0xaa);
  });
  it('gives white a light grey lip, and leaves non-hex alone', () => {
    expect(deepen('#ffffff')).not.toBe('#ffffff');
    expect(deepen('rgb(1,2,3)')).toBe('rgb(1,2,3)');
  });
});
