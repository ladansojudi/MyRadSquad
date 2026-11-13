import { router, Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/icon';

import { useNavOptions } from '@/hooks/use-nav-options';

type NavHeaderProps = {
  title: string;
  /** Second line under the title (who's here, context). */
  subtitle?: string;
  /** Kept for callers; the title stays centred, so the mark is not drawn. */
  mark?: ReactNode;
  /** Bar button on the right. */
  right?: ReactNode;
  background?: 'canvas' | 'surface';
  /** iOS large title (lists like Shared notes); chats use the inline title. */
  large?: boolean;
  /** The first step of a flow: nothing to go back to, so no back button. */
  noBack?: boolean;
};

/**
 * Configures the native iOS navigation bar for a pushed screen: system back chevron,
 * centered title (with an optional subtitle and mark, like Messages), bar button items.
 */
export function NavHeader({
  title,
  subtitle,
  mark,
  right,
  background = 'canvas',
  large = false,
  noBack = false,
}: NavHeaderProps) {
  const nav = useNavOptions();
  const base = large ? nav.large : nav.inline(background);
  const custom = !large && (subtitle || mark);
  // Opened directly (a notification, a link) there is nothing to go back to: the back
  // button takes you Home instead, so no screen is ever a dead end.
  const orphan = !router.canGoBack();

  return (
    <Stack.Screen
      options={{
        ...base,
        title,
        headerBackVisible: noBack ? false : undefined,
        headerLeft: noBack
          ? () => null
          : orphan
            ? () => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Back to Squads"
                  hitSlop={8}
                  onPress={() => router.replace('/squads')}
                  className="px-1"
                >
                  <Icon name="chevron-left" size={24} strokeWidth={2.6} />
                </Pressable>
              )
            : undefined,
        // Centered like Messages: name and who's here, nothing beside them pulling it off-centre.
        headerTitle: custom
          ? () => (
              <View className="max-w-[220px] items-center">
                <View className="items-center">
                  <Text numberOfLines={1} className="font-heavy text-body text-content">
                    {title}
                  </Text>
                  {subtitle ? (
                    <Text numberOfLines={1} className="font-text text-overline text-muted">
                      {subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>
            )
          : undefined,
        headerRight: right ? () => right : undefined,
      }}
    />
  );
}
