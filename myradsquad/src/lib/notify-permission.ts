import * as Notifications from 'expo-notifications';

/**
 * Asks iOS for notification permission, right after our own pre-prompt ("Want a heads-up…").
 * Returns whether notifications are allowed. Local only: the app sends nothing.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const result = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return result.granted;
  } catch {
    return false;
  }
}
