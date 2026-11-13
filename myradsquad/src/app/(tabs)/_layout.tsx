import { NativeTabs } from 'expo-router/native-tabs';

import { useSquads } from '@/hooks/use-squads';
import { usePalette } from '@/hooks/use-palette';

/**
 * Native iOS tab bar (Liquid Glass on iOS 26) with Solar icons, minimizes on scroll.
 * Unread messages badge the Messages tab; Search is the system search tab.
 */
export default function TabsLayout() {
  const p = usePalette();
  const unread = useSquads().reduce((n, s) => n + s.unread, 0);

  return (
    <NativeTabs
      tintColor={p.ink}
      minimizeBehavior="onScrollDown"
      labelStyle={{ fontFamily: 'Rubik-Medium' }}
    >
      <NativeTabs.Trigger name="squads">
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/images/tabs/tab-squads.png'),
            selected: require('@/assets/images/tabs/tab-squads-selected.png'),
          }}
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>Squads</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/images/tabs/tab-messages.png'),
            selected: require('@/assets/images/tabs/tab-messages-selected.png'),
          }}
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>Messages</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Badge hidden={!unread}>{String(unread)}</NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="moments">
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/images/tabs/tab-moments.png'),
            selected: require('@/assets/images/tabs/tab-moments-selected.png'),
          }}
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>Moments</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="you">
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/images/tabs/tab-you.png'),
            selected: require('@/assets/images/tabs/tab-you-selected.png'),
          }}
          renderingMode="template"
        />
        <NativeTabs.Trigger.Label>You</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      {/* iOS 26: the system search tab, set apart at the end of the bar. */}
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
