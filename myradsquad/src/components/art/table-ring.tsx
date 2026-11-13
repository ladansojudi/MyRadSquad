import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { RoundTable } from '@/components/art/round-table';
import { EmptySeat, SeatTile } from '@/components/art/seat-tile';
import { popIn } from '@/components/motion/pop-in';
import { SceneClock } from '@/components/motion/scene-clock';
import { seeded } from '@/lib/motion';
import type { Member } from '@/lib/mock-data';

export type RingSeat = { angle: number; member?: Member; round?: boolean };

type TableRingProps = {
  /** Width/height of the whole drawing. */
  size: number;
  tableSize: number;
  seatSize: number;
  /** Distance from the centre to each seat's centre. */
  radius: number;
  seats: RingSeat[];
  variant?: 'shapes' | 'quarters';
  /** Friends bob, open seats breathe, the rim turns. One clock for the whole ring. */
  alive?: boolean;
  /** Seats pop in one by one, and again whenever someone sits down or leaves. */
  popSeats?: boolean;
};

/** The round table with friends (and faint empty seats) placed around it by angle. */
export function TableRing({
  size,
  tableSize,
  seatSize,
  radius,
  seats,
  variant,
  alive = true,
  popSeats = false,
}: TableRingProps) {
  const c = size / 2;
  return (
    <SceneClock>
      <View style={{ width: size, height: size }}>
        <View className="absolute" style={{ left: c - tableSize / 2, top: c - tableSize / 2 }}>
          <RoundTable size={tableSize} variant={variant} alive={alive} />
        </View>
        {seats.map((seat, i) => {
          const rad = (seat.angle * Math.PI) / 180;
          const left = c + Math.cos(rad) * radius - seatSize / 2;
          const top = c + Math.sin(rad) * radius - seatSize / 2;
          return (
            <Animated.View
              key={`${seat.angle}-${seat.member?.id ?? 'open'}`}
              entering={popSeats ? popIn(i * 70, -12) : undefined}
              className="absolute"
              style={{ left, top }}
            >
              {seat.member ? (
                <SeatTile
                  letter={seat.member.letter}
                  tone={seat.member.tone}
                  shape={seat.member.shape}
                  size={seatSize}
                  alive={alive}
                />
              ) : (
                <EmptySeat size={seatSize} round={seat.round} alive={alive} phase={seeded(i, 3)} />
              )}
            </Animated.View>
          );
        })}
      </View>
    </SceneClock>
  );
}
