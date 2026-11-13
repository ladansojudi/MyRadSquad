import { router, type Href } from 'expo-router';

/** Where a paywall was opened from: the end of onboarding, or later from inside the app. */
export type PaywallSource = 'onboarding' | 'app';

/** Lands on Home with nothing to go "back" to (end of onboarding, after a purchase step). */
export function goHome() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/squads');
}

/** Leaves a paywall without buying: onboarding continues to Home, elsewhere it just closes. */
export function leavePaywall(source: PaywallSource) {
  if (source === 'onboarding' || !router.canGoBack()) goHome();
  else router.back();
}

/** Opens a squad's chat (Lunch Table Legends has its own Chat / Study / Moments screens). */
export function openSquad(id: string) {
  if (id === 'lunch') router.push('/squad/chat');
  else router.push({ pathname: '/s/[id]', params: { id } });
}

/**
 * Leaves the sheet you're in, then opens `href`. A screen pushed from a form sheet would
 * otherwise open underneath it.
 */
export function leaveSheetTo(href: Href) {
  router.back();
  router.push(href);
}
