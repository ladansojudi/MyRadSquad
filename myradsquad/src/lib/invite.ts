import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

import { useAppStore } from '@/lib/app-store';
import { haptics } from '@/lib/haptics';
import { SQUAD_NAME } from '@/lib/mock-data';

/** Mock invite link for a squad (no backend): myradsquad.app/j/<squad-name>. */
export function inviteLink(name: string = SQUAD_NAME): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `https://myradsquad.app/j/${slug || 'squad'}`;
}

/** Opens the iOS share sheet with the squad's invite link. */
export async function shareInvite(name: string = SQUAD_NAME) {
  haptics.tap();
  try {
    await Share.share({ message: `Pull up a chair at ${name} on MyRadSquad: ${inviteLink(name)}` });
  } catch {
    // The share sheet was dismissed or is unavailable: nothing to do.
  }
}

/** Copies the invite link and confirms with a toast. */
export async function copyInviteLink(name: string = SQUAD_NAME) {
  await Clipboard.setStringAsync(inviteLink(name));
  haptics.success();
  useAppStore.getState().showToast('Invite link copied');
}
