/** Web prototype: there is no system prompt, so "Turn on" just records the choice. */
export async function requestNotificationPermission(): Promise<boolean> {
  return true;
}
