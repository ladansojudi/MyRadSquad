import { TableRing, type RingSeat } from '@/components/art/table-ring';
import { MEMBERS } from '@/lib/mock-data';

const FILLED: RingSeat[] = [
  { angle: -100, member: MEMBERS.maya },
  { angle: -68, member: MEMBERS.jordan },
  { angle: -36, member: MEMBERS.leo },
  { angle: -4, member: MEMBERS.ava },
  { angle: 28, member: MEMBERS.you },
];

const EMPTY: RingSeat[] = [60, 90, 120, 150, 180, 210, 240].map((angle, i) => ({
  angle,
  round: i % 2 === 1,
}));

/** Twelve seats around the table: five taken, seven waiting. */
export function PaywallSeatsArt({ size = 300 }: { size?: number }) {
  return (
    <TableRing
      size={size}
      tableSize={size * 0.55}
      seatSize={size * 0.125}
      radius={size * 0.41}
      seats={[...FILLED, ...EMPTY]}
    />
  );
}
