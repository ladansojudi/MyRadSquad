import { Text, View } from 'react-native';

import { PhotoImage } from '@/components/wireframe';
import type { MomentTone, Photo } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export const MOMENT_BG: Record<MomentTone, string> = {
  cobalt: 'bg-cobalt',
  teal: 'bg-teal',
  coral: 'bg-accent',
  canvas: 'bg-canvas',
};

type MomentsPhotoProps = {
  tones: [MomentTone, MomentTone, MomentTone];
  photo?: Photo;
  caption?: string;
  height: number;
  className?: string;
};

/** A moment's photo with its caption pill; a coloured placeholder when there's no photo. */
export function MomentsPhoto({ tones, photo, caption, height, className }: MomentsPhotoProps) {
  return (
    <View
      className={cn('overflow-hidden rounded-[22px]', MOMENT_BG[tones[0]], className)}
      style={{ height }}
    >
      {photo ? (
        <PhotoImage source={photo} contentFit="cover" style={{ position: 'absolute', inset: 0 }} />
      ) : (
        <>
          <View
            className={cn('absolute -right-10 -top-14 rounded-full', MOMENT_BG[tones[1]])}
            style={{ width: height * 0.75, height: height * 0.75 }}
          />
          <View
            className={cn('absolute -bottom-16 -left-14 rounded-full', MOMENT_BG[tones[2]])}
            style={{ width: height * 0.95, height: height * 0.95 }}
          />
        </>
      )}
      {caption ? (
        <View className="absolute bottom-3 left-3 max-w-[85%] rounded-full bg-surface px-3 py-1">
          <Text numberOfLines={1} className="font-heavy text-caption text-content">
            {caption}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
