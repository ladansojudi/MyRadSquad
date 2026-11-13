import { useLocalSearchParams } from 'expo-router';

import { SquadSettingsView } from '@/sections/squad-settings/view/squad-settings-view';

export default function SquadSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SquadSettingsView squadId={id} />;
}
