import '@/global.css';

import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  Rubik_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/rubik';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { LiveBanner } from '@/components/live-banner';
import { ProtoButton } from '@/components/proto-button';
import { WireframeTag } from '@/components/wireframe';
import { SparkBanner } from '@/components/spark-banner';
import { usePalette } from '@/hooks/use-palette';
import { Toast } from '@/components/toast';

SplashScreen.preventAutoHideAsync();

// Clean frames for the design-file screenshots: no dev warning toasts.
if (process.env.EXPO_PUBLIC_SCREENSHOTS === '1') LogBox.ignoreAllLogs();

const FULL_MODAL = { presentation: 'fullScreenModal', animation: 'slide_from_bottom' } as const;
const SWAP = { animation: 'none' } as const;

export default function RootLayout() {
  const palette = usePalette();
  // Native iOS form sheets: system grabber, corner radius, dimming and swipe to dismiss.
  const SHEET = {
    presentation: 'formSheet',
    sheetAllowedDetents: 'fitToContents',
    sheetGrabberVisible: true,
    contentStyle: { backgroundColor: palette.surface },
  } as const;
  const LARGE_SHEET = { ...SHEET, sheetAllowedDetents: [1.0] };

  const [loaded, error] = useFonts({
    'Rubik-Regular': Rubik_400Regular,
    'Rubik-Medium': Rubik_500Medium,
    'Rubik-SemiBold': Rubik_600SemiBold,
    'Rubik-Bold': Rubik_700Bold,
    'Rubik-ExtraBold': Rubik_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="invite" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="squad/chat" />
        <Stack.Screen name="spark/today" options={SWAP} />
        <Stack.Screen name="notify" options={SHEET} />
        <Stack.Screen name="answer" options={SHEET} />
        <Stack.Screen name="why-age" options={SHEET} />
        <Stack.Screen name="prototype" options={LARGE_SHEET} />
        <Stack.Screen name="invite-qr" options={SHEET} />
        <Stack.Screen name="stickers" options={SHEET} />
        <Stack.Screen name="add-moment" options={SHEET} />
        <Stack.Screen name="start-room/[id]" options={SHEET} />
        <Stack.Screen
          name="squad-settings/[id]"
          options={{ ...LARGE_SHEET, contentStyle: { backgroundColor: palette.canvas } }}
        />
        <Stack.Screen
          name="rooms/[id]"
          options={{ ...LARGE_SHEET, contentStyle: { backgroundColor: palette.canvas } }}
        />
        <Stack.Screen name="room" options={FULL_MODAL} />
        <Stack.Screen name="focus" options={FULL_MODAL} />
        <Stack.Screen name="new-squad" options={FULL_MODAL} />
        <Stack.Screen name="spark/add" options={LARGE_SHEET} />
        <Stack.Screen name="parent-request" options={SHEET} />
        <Stack.Screen name="squad-plus" options={FULL_MODAL} />
        <Stack.Screen name="paywall" options={FULL_MODAL} />
        <Stack.Screen name="seats" options={FULL_MODAL} />
      </Stack>
      <Toast />
      <LiveBanner />
      <SparkBanner />
      <WireframeTag />
      <ProtoButton />
    </GestureHandlerRootView>
  );
}
