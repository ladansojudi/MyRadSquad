import { useLocalSearchParams } from 'expo-router';

import { SparkAddView } from '@/sections/spark/view/spark-add-view';

export default function SparkAddScreen() {
  const { squad } = useLocalSearchParams<{ squad?: string }>();
  return <SparkAddView squadId={squad ?? 'lunch'} />;
}
