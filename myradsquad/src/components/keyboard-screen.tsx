import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useHeaderHeight } from 'expo-router/react-navigation';

/** Page that lifts its bottom composer above the keyboard (accounts for the native header). */
export function KeyboardScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <View className={className}>{children}</View>
    </KeyboardAvoidingView>
  );
}
