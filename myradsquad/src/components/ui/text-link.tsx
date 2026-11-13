import { Pressable, Text, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

type TextLinkProps = Omit<PressableProps, 'children'> & {
  label: string;
  className?: string;
  textClassName?: string;
};

/** Underlined secondary action under a primary button. */
export function TextLink({ label, className, textClassName, ...props }: TextLinkProps) {
  return (
    <Pressable
      accessibilityRole="link"
      hitSlop={8}
      className={cn('items-center py-2', className)}
      {...props}
    >
      <Text
        className={cn(
          'font-heavy text-[17px] leading-[22px] text-content underline',
          textClassName,
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
