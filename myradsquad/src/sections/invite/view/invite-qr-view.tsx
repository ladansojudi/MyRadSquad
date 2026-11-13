import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { QrCode } from '@/components/qr-code';
import { Button, TextLink } from '@/components/ui';
import { Wireframe } from '@/components/wireframe';
import { copyInviteLink, inviteLink, shareInvite } from '@/lib/invite';
import { SQUAD_NAME } from '@/lib/mock-data';

/** Invite in person: a scannable QR for the squad link, plus share and copy. */
function InviteQrViewContent({ name = SQUAD_NAME }: { name?: string }) {
  return (
    <BottomSheet>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="text-center font-display text-headline text-content"
      >
        Scan to join {name}
      </Text>
      <Text className="mt-1 text-center font-text text-body text-muted">
        {"Point a friend's camera here."}
      </Text>
      <View className="mt-5 items-center self-center rounded-[24px] bg-surface p-4">
        <QrCode value={inviteLink(name)} size={208} />
      </View>
      <Text numberOfLines={1} className="mt-4 text-center font-text text-caption text-muted">
        {inviteLink(name).replace('https://', '')}
      </Text>
      <View className="mt-4 flex-row gap-3">
        <Button
          label="Copy link"
          variant="outline"
          size="md"
          className="flex-1"
          onPress={() => copyInviteLink(name)}
        />
        <Button label="Share" size="md" className="flex-1" onPress={() => shareInvite(name)} />
      </View>
      <TextLink label="Done" className="mt-2" onPress={() => router.back()} />
    </BottomSheet>
  );
}

/** Outside the six solutions: shown as a wireframe. */
export function InviteQrView(props: { name?: string }) {
  return (
    <Wireframe sheet="fit">
      <InviteQrViewContent {...props} />
    </Wireframe>
  );
}
