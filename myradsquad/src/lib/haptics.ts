import * as Haptics from 'expo-haptics';

/**
 * The app's three kinds of touch feedback, used sparingly (iOS convention):
 * - `select`: a choice changed (reaction, plan, vibe, purpose, a birthday step)
 * - `tap`: something was sent or placed (message, answer, double-tap "lol")
 * - `success`: an outcome worth confirming (trial started, Spark added, link copied)
 */
export const haptics = {
  select: () => void Haptics.selectionAsync().catch(() => {}),
  tap: () => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  success: () =>
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
};
