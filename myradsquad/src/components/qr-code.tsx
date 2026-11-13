import { create } from 'qrcode/lib/core/qrcode';
import { useMemo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { usePalette } from '@/hooks/use-palette';

/** A real, scannable QR code drawn as one SVG path (crisp at any size). */
export function QrCode({ value, size }: { value: string; size: number }) {
  const palette = usePalette();
  const { d, count } = useMemo(() => {
    const { modules } = create(value, { errorCorrectionLevel: 'M' });
    const n = modules.size;
    let path = '';
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (modules.data[y * n + x]) path += `M${x} ${y}h1v1h-1z`;
      }
    }
    return { d: path, count: n };
  }, [value]);
  const quiet = 2;

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`${-quiet} ${-quiet} ${count + quiet * 2} ${count + quiet * 2}`}
    >
      <Rect
        x={-quiet}
        y={-quiet}
        width={count + quiet * 2}
        height={count + quiet * 2}
        fill={palette.surface}
      />
      <Path d={d} fill={palette.ink} />
    </Svg>
  );
}
