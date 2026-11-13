import { Text, View } from 'react-native';

import { ShapeAvatar } from '@/components/art/shape-avatar';
import { useIsWireframe } from '@/hooks/use-is-wireframe';
import { MEMBERS, type MemberId } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

/**
 * A friend as their shape avatar (faceless, geometric, on a pastel disc). In a wireframe
 * screen it falls back to a grey initial, like everything else there.
 */
export function PersonAvatar({
  id,
  size = 32,
  ring = false,
  faded = false,
}: {
  id: MemberId;
  size?: number;
  /** A white ring around it, for avatars that overlap in a stack. */
  ring?: boolean;
  faded?: boolean;
}) {
  const wire = useIsWireframe();
  const frame = cn(
    'items-center justify-center overflow-hidden rounded-full',
    ring && 'border-2 border-surface',
  );
  if (wire) {
    return (
      <View className={cn(frame, 'bg-cream')} style={{ width: size, height: size }}>
        <Text className="font-display text-content" style={{ fontSize: size * 0.42 }}>
          {MEMBERS[id].letter}
        </Text>
      </View>
    );
  }
  return (
    <View className={frame} style={{ width: size, height: size, opacity: faded ? 0.5 : 1 }}>
      <ShapeAvatar id={id} size={ring ? size - 4 : size} />
    </View>
  );
}
