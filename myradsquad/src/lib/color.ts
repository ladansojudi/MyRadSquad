/**
 * The same colour, a step darker: the soft "lip" under a borderless item (the item's own
 * hue, never ink), like a pastel tile pressed into the page.
 */
export function deepen(hex: string, amount = 0.14): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  // White and near-white get a warm grey lip; colours get darker and a touch richer.
  const light = Math.min(...ch) > 235;
  const out = ch.map((c, i) => {
    if (light) return Math.round(c * (1 - amount * 0.85) - (i === 2 ? 6 : 0));
    const avg = (ch[0] + ch[1] + ch[2]) / 3;
    const rich = c + (c - avg) * 0.35;
    return Math.max(0, Math.min(255, Math.round(rich * (1 - amount))));
  });
  return `#${out.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}
