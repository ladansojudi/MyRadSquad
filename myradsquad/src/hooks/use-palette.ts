import { useCSSVariable } from 'uniwind';

export type Palette = {
  canvas: string;
  surface: string;
  ink: string;
  muted: string;
  coral: string;
  cobalt: string;
  teal: string;
  cream: string;
  primary: string;
};

/** Reads the design tokens for props that need a raw colour (SVG fills, shadows). */
export function usePalette(): Palette {
  const [canvas, surface, ink, muted, coral, cobalt, teal, cream, primary] = useCSSVariable([
    '--color-canvas',
    '--color-surface',
    '--color-content',
    '--color-muted',
    '--color-accent',
    '--color-cobalt',
    '--color-teal',
    '--color-cream',
    '--color-primary',
  ]);
  return {
    canvas: String(canvas),
    surface: String(surface),
    ink: String(ink),
    muted: String(muted),
    coral: String(coral),
    cobalt: String(cobalt),
    teal: String(teal),
    cream: String(cream),
    primary: String(primary),
  };
}
