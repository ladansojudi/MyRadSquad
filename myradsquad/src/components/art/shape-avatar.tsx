import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { usePalette, type Palette } from '@/hooks/use-palette';
import { AVATAR_LOOKS, type Hair } from '@/lib/avatars';
import { deepen } from '@/lib/color';
import type { MemberId } from '@/lib/mock-data';

const PASTEL: Record<string, keyof Palette> = {
  coral: 'coral',
  cobalt: 'cobalt',
  teal: 'teal',
  cream: 'cream',
};

/** Hair drawn behind the head (long hair, ponytail). Viewbox is 48 x 48. */
function HairBack({ hair, color }: { hair: Hair; color: string }) {
  if (hair === 'long') return <Path d="M12 40 Q10 9 24 8 Q38 9 36 40 Z" fill={color} />;
  if (hair === 'bob') return <Path d="M13 31 Q11 9 24 8 Q37 9 35 31 Z" fill={color} />;
  if (hair === 'ponytail') return <Circle cx={35} cy={13} r={5.5} fill={color} />;
  return null;
}

/** Hair drawn over the top of the head. */
function HairFront({ hair, color }: { hair: Hair; color: string }) {
  switch (hair) {
    case 'short':
      return <Path d="M15 19 Q14 8 24 8 Q34 8 33 19 L31 14 Q24 11 17 14 Z" fill={color} />;
    case 'spiky':
      return (
        <Path
          d="M14.5 19 L15 10 L18.5 12 L21 6.5 L24 10.5 L28 6.5 L29.5 11 L33.5 9.5 L33.5 19 Q30 13 24 13 Q18 13 14.5 19 Z"
          fill={color}
        />
      );
    case 'curly':
      return (
        <G fill={color}>
          <Circle cx={17} cy={13} r={4.2} />
          <Circle cx={22} cy={9.5} r={4.4} />
          <Circle cx={27.5} cy={9.8} r={4.4} />
          <Circle cx={31.5} cy={13.5} r={4} />
          <Circle cx={15.5} cy={17.5} r={3} />
          <Circle cx={33} cy={18} r={3} />
        </G>
      );
    case 'bob':
    case 'long':
      return <Path d="M15 20 Q15 9 24 9 Q33 9 33 20 Q29 13 22 14 Q18 15 15 20 Z" fill={color} />;
    case 'ponytail':
      return <Path d="M15 19 Q14 9 24 9 Q34 9 33 19 Q29 13 24 13 Q19 13 15 19 Z" fill={color} />;
  }
}

/**
 * A friend as a faceless shape friend: pastel disc, shirt, neck, a head split into a lit and
 * a shaded half (flat facets, no outline), and geometric hair. No eyes or mouth, by design.
 */
export function ShapeAvatar({ id, size = 32 }: { id: MemberId; size?: number }) {
  const p = usePalette();
  const look = AVATAR_LOOKS[id];
  const bg = p[PASTEL[look.bg]];
  const shirt = p[PASTEL[look.shirt]];
  const clip = `disc-${id}`;
  const face = `face-${id}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <ClipPath id={clip}>
          <Circle cx={24} cy={24} r={24} />
        </ClipPath>
        <ClipPath id={face}>
          <Rect x={15} y={10} width={18} height={21} rx={8} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clip})`}>
        <Rect width={48} height={48} fill={bg} />
        <HairBack hair={look.hair} color={look.hairColor} />
        <Path d="M7 50 Q7 36 24 35 Q41 36 41 50 Z" fill={shirt} />
        <Path d="M24 35 Q41 36 41 50 L24 50 Z" fill={deepen(shirt, 0.1)} />
        <Rect x={21} y={28} width={6} height={8} fill={look.skin} />
        <Rect x={15} y={10} width={18} height={21} rx={8} fill={look.skin} />
        <G clipPath={`url(#${face})`}>
          <Rect x={24} y={10} width={10} height={22} fill={deepen(look.skin, 0.12)} />
        </G>
        <HairFront hair={look.hair} color={look.hairColor} />
      </G>
    </Svg>
  );
}
