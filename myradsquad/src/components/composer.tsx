import { useState, type Ref } from 'react';
import { Pressable, TextInput, View, type TextInputInstance } from 'react-native';
import { withUniwind } from 'uniwind';

import { Icon, type IconName } from '@/components/icon';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { usePalette } from '@/hooks/use-palette';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

const StyledInput = withUniwind(TextInput);

type ComposerProps = {
  placeholder: string;
  /** Optional round button on the left (attach / add file). */
  leading?: IconName;
  onLeadingPress?: () => void;
  /** Coral camera button instead of the ink send arrow. */
  action?: 'send' | 'camera';
  /** The camera button with an empty field (with text it sends, like iMessage). */
  onCamera?: () => void;
  /** `cream` fills the input; `outlined` also rounds it (yellow screens). No borders. */
  field?: 'cream' | 'outlined';
  onSend?: (text: string) => void;
  className?: string;
  /** Lets a screen focus the field (e.g. an "Answer" button). */
  inputRef?: Ref<TextInputInstance>;
  /** Text already in the field (a suggested opener you can edit before sending). */
  initialText?: string;
};

/** The bottom message bar shared by chat-style screens. */
export function Composer({
  placeholder,
  leading,
  onLeadingPress,
  action = 'send',
  onCamera,
  field = 'cream',
  onSend,
  className,
  inputRef,
  initialText = '',
}: ComposerProps) {
  const bottomInset = useBottomInset();
  const palette = usePalette();
  const keyboardVisible = useKeyboardVisible();
  const [text, setText] = useState(initialText);

  const send = () => {
    const value = text.trim();
    if (!value) return;
    haptics.tap();
    onSend?.(value);
    setText('');
  };

  return (
    <View
      className={cn(
        'flex-row items-center gap-3 border-t border-cream bg-surface px-4 pt-3',
        className,
      )}
      style={{ paddingBottom: keyboardVisible ? 12 : bottomInset }}
    >
      {leading ? (
        <Pressable
          accessibilityRole="button"
          onPress={onLeadingPress}
          className="size-12 items-center justify-center rounded-full bg-surface"
        >
          <Icon name={leading} size={22} />
        </Pressable>
      ) : null}
      <StyledInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        onSubmitEditing={send}
        returnKeyType="send"
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        className={cn(
          'h-13 flex-1 rounded-full px-5 font-text text-body text-content',
          field === 'cream' ? 'bg-cream' : 'rounded-2xl bg-cream',
        )}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={action === 'camera' ? 'Camera' : 'Send'}
        onPress={action === 'camera' && !text.trim() ? onCamera : send}
        className={cn(
          'size-13 items-center justify-center rounded-full',
          action === 'send' ? 'bg-content' : 'bg-accent',
        )}
      >
        <Icon
          name={action === 'send' ? 'arrow-up' : 'camera'}
          size={22}
          tone="surface"
          strokeWidth={2.6}
        />
      </Pressable>
    </View>
  );
}
