import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { usePalette } from '@/hooks/use-palette';
import { deepen } from '@/lib/color';
import { TIMING_OUT } from '@/lib/motion';

type SquadLogoProps = {
  size: number;
  /** Outline every piece in ink (splash) or leave them (app icon). */
  outlined?: boolean;
  /** Play once: the nine pieces drop into the grid one after another, then rest. */
  assemble?: boolean;
};

type Piece = { col: number; row: number; draw: (fill: string, line: object) => ReactNode };

// Each piece lives in one 50×50 cell of the 150×150 grid.
const PIECES: Piece[] = [
  {
    col: 0,
    row: 0,
    draw: (f, l) => <Path d="M50 0 L50 50 L0 50 A50 50 0 0 1 50 0 Z" fill={f} {...l} />,
  },
  { col: 1, row: 0, draw: (f, l) => <Circle cx={75} cy={25} r={25} fill={f} {...l} /> },
  {
    col: 2,
    row: 0,
    draw: (f, l) => <Path d="M100 0 L100 50 L150 50 A50 50 0 0 0 100 0 Z" fill={f} {...l} />,
  },
  { col: 0, row: 1, draw: (f, l) => <Circle cx={25} cy={75} r={25} fill={f} {...l} /> },
  { col: 1, row: 1, draw: (f, l) => <Circle cx={75} cy={75} r={25} fill={f} {...l} /> },
  {
    col: 2,
    row: 1,
    draw: (f, l) => <Path d="M100 100 L100 75 A25 25 0 0 1 150 75 L150 100 Z" fill={f} {...l} />,
  },
  {
    col: 0,
    row: 2,
    draw: (f, l) => <Path d="M50 100 L50 150 A50 50 0 0 1 0 100 Z" fill={f} {...l} />,
  },
  {
    col: 1,
    row: 2,
    draw: (f, l) => <Path d="M50 100 L100 100 L100 125 A25 25 0 0 1 50 125 Z" fill={f} {...l} />,
  },
  {
    col: 2,
    row: 2,
    draw: (f, l) => <Path d="M100 100 L150 100 A50 50 0 0 1 100 150 Z" fill={f} {...l} />,
  },
];

const STAGGER_MS = 70;
const PIECE_MS = 380;
const SHADOW = 6;

/** One piece arrives from a smaller, slightly turned, transparent state (never from scale 0). */
function pieceIn(order: number) {
  return () => {
    'worklet';
    const delay = 120 + order * STAGGER_MS;
    const config = { duration: PIECE_MS, easing: TIMING_OUT };
    return {
      initialValues: { opacity: 0, transform: [{ scale: 0.7 }, { rotate: '-18deg' }] },
      animations: {
        opacity: withDelay(delay, withTiming(1, config)),
        transform: [
          { scale: withDelay(delay, withTiming(1, config)) },
          { rotate: withDelay(delay, withTiming('0deg', config)) },
        ],
      },
    };
  };
}

/** "Squad grid": nine shapes in a 3×3 block — different people, one squad. */
export function SquadLogo({ size, outlined = false, assemble = false }: SquadLogoProps) {
  const p = usePalette();
  const fills = [
    p.coral,
    p.surface,
    p.cobalt,
    p.teal,
    p.cobalt,
    p.coral,
    p.cobalt,
    p.coral,
    p.teal,
  ];
  const line = outlined
    ? { stroke: p.ink, strokeWidth: 2.5, strokeLinejoin: 'round' as const }
    : {};
  const k = size / 162; // the grid's viewBox is -4 -4 162 162
  const cell = 58; // 50 + room for the stroke and the 6-unit shadow

  // Diagonal order (top-left first) so the grid fills like a wave.
  const order = (piece: Piece) => piece.col + piece.row;

  const layer = (shadow: boolean) =>
    PIECES.map((piece, i) => {
      const x = piece.col * 50 - 2;
      const y = piece.row * 50 - 2;
      return (
        <Animated.View
          key={`${shadow ? 's' : 'f'}${i}`}
          entering={assemble ? pieceIn(order(piece) + i * 0.15) : undefined}
          className="absolute"
          style={{ left: (x + 4) * k, top: (y + 4) * k, width: cell * k, height: cell * k }}
        >
          <Svg width={cell * k} height={cell * k} viewBox={`${x} ${y} ${cell} ${cell}`}>
            {shadow ? (
              <G transform={`translate(0 ${SHADOW})`}>{piece.draw(deepen(fills[i]), {})}</G>
            ) : (
              piece.draw(fills[i], line)
            )}
          </Svg>
        </Animated.View>
      );
    });

  return (
    <View style={{ width: size, height: size }}>
      {layer(true)}
      {layer(false)}
    </View>
  );
}
