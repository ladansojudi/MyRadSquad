import Svg, { Path } from 'react-native-svg';

import { SPARKLE_PATH } from '@/components/art/sparkle';
import { usePalette } from '@/hooks/use-palette';
import { deepen } from '@/lib/color';

const SIZE = 34;

export function HangoutIcon() {
  const p = usePalette();
  return (
    <Svg width={SIZE} height={SIZE} viewBox="-2 -2 28 28">
      <Path d={SPARKLE_PATH} transform="translate(0 1.6)" fill={deepen(p.coral)} />
      <Path d={SPARKLE_PATH} fill={p.coral} />
    </Svg>
  );
}

export function StudyIcon() {
  const p = usePalette();
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 34 34">
      <Path
        d="M7 7 A22 22 0 0 1 29 29 L7 29 Z"
        transform="translate(0 2.5)"
        fill={deepen(p.cobalt)}
      />
      <Path d="M7 7 A22 22 0 0 1 29 29 L7 29 Z" fill={p.cobalt} />
    </Svg>
  );
}

export function MomentsIcon() {
  const p = usePalette();
  const d = 'M6 6 H22 A6 6 0 0 1 28 12 V28 H12 A6 6 0 0 1 6 22 Z';
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 34 34">
      <Path d={d} transform="translate(0 2.5)" fill={deepen(p.teal)} />
      <Path d={d} fill={p.teal} />
    </Svg>
  );
}
