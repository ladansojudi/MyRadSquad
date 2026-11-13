import { useLocalSearchParams } from 'expo-router';

import type { ThreadId } from '@/lib/app-store';
import { StickersView } from '@/sections/stickers/view/stickers-view';

const THREADS: ThreadId[] = ['squad', 'study', 'spark', 'thread', 'moments'];

export default function StickersScreen() {
  const { thread } = useLocalSearchParams<{ thread?: string }>();
  const target = THREADS.find((t) => t === thread) ?? 'squad';
  return <StickersView thread={target} />;
}
