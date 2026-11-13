import { usePalette, type Palette } from '@/hooks/use-palette';
import { useIsWireframe } from '@/hooks/use-is-wireframe';
import { deepen } from '@/lib/color';

/** The wireframe edge: a dashed outline, so an unfinished screen reads as a sketch. */
export function useDashedEdge() {
  const palette = usePalette();
  return { borderWidth: 1.5, borderStyle: 'dashed' as const, borderColor: palette.muted };
}

/**
 * The borderless "lip": a solid, unblurred copy of the item in a darker shade of its own
 * fill, a few points straight down. No outlines anywhere; the lip gives items their depth.
 * `tone` is the item's FILL colour. In a wireframe it becomes a dashed outline instead.
 */
export function useHardShadow(offset = 3, tone: keyof Palette = 'surface') {
  const palette = usePalette();
  const dashed = useDashedEdge();
  if (useIsWireframe()) return dashed;
  return { boxShadow: `0px ${offset}px 0px 0px ${deepen(palette[tone])}` };
}
