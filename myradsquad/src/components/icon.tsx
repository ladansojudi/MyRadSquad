import { SvgXml } from 'react-native-svg';

import { SOLAR, type SolarName } from '@/components/solar-icons';
import { usePalette, type Palette } from '@/hooks/use-palette';

export type IconName = SolarName;

type IconProps = {
  name: IconName;
  size?: number;
  tone?: keyof Palette;
  /** Weight hint: 2 is Solar's own 1.5 line; heavier values thicken it a little. */
  strokeWidth?: number;
};

/** Solar icons (Linear), drawn in a palette colour. */
export function Icon({ name, size = 20, tone = 'ink', strokeWidth = 2 }: IconProps) {
  const palette = usePalette();
  const width = Math.min(2.2, Math.max(1.5, 1.5 + (strokeWidth - 2) * 0.35));
  const body = SOLAR[name]
    .replaceAll('currentColor', palette[tone])
    .replaceAll('stroke-width="1.5"', `stroke-width="${width}"`);
  return (
    <SvgXml
      xml={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`}
      width={size}
      height={size}
    />
  );
}
