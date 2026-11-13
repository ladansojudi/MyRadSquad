import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';

import { Sparkle } from '@/components/art/sparkle';
import { SquadLogo } from '@/components/art/squad-logo';

// Long enough for the logo to assemble and the name to land, then a beat to read it.
const NEXT_DELAY_MS = 2400;

export function SplashView() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/onboarding/birthday'), NEXT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable
      className="flex-1 items-center justify-center bg-canvas"
      onPress={() => router.replace('/onboarding/birthday')}
    >
      <View className="absolute right-[72px] top-[28%]">
        <Sparkle size={30} alive phase={0.2} />
      </View>
      <View className="absolute bottom-[23%] left-[52px] -rotate-12">
        <Sparkle size={30} tone="coral" outlined alive phase={0.7} />
      </View>

      <SquadLogo size={124} assemble />
      <Animated.View
        entering={FadeInDown.delay(700).duration(420).easing(Easing.out(Easing.cubic))}
        className="mt-12 items-center"
      >
        <Text className="font-display text-[42px] leading-[46px] text-content">MyRadSquad</Text>
        <Text className="mt-6 text-center font-text text-body text-muted">
          Different people. One squad.
        </Text>
      </Animated.View>
    </Pressable>
  );
}
