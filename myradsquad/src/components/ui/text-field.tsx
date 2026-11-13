import { cva, type VariantProps } from 'class-variance-authority';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useDashedEdge } from '@/hooks/use-hard-shadow';
import { useIsWireframe } from '@/hooks/use-is-wireframe';
import { usePalette } from '@/hooks/use-palette';
import { cn } from '@/lib/utils';

const fieldVariants = cva('h-14 flex-row items-center gap-3 rounded-2xl px-4', {
  variants: {
    // White on the canvas, cream on a white sheet: the field always reads as a soft well.
    on: { canvas: 'bg-surface', surface: 'bg-cream' },
  },
  defaultVariants: { on: 'surface' },
});

type TextFieldProps = Omit<TextInputProps, 'className' | 'placeholderTextColor'> &
  VariantProps<typeof fieldVariants> & {
    /** Shows how many characters are left (needs `maxLength`). */
    counter?: boolean;
    className?: string;
  };

/**
 * The one text field: regular weight, a muted placeholder, no outline and no lip (fields
 * are wells, not cards). Every input in the app uses it, so they all look and feel the same.
 */
export function TextField({ on, counter, className, maxLength, value, ...props }: TextFieldProps) {
  const p = usePalette();
  const dashed = useDashedEdge();
  const wire = useIsWireframe();
  return (
    <View className={cn(fieldVariants({ on }), className)} style={wire ? dashed : undefined}>
      <TextInput
        value={value}
        maxLength={maxLength}
        placeholderTextColor={p.muted}
        className="h-full flex-1 font-text text-body text-content"
        {...props}
      />
      {counter && maxLength ? (
        <Text className="font-text text-caption text-muted">
          {maxLength - (value?.length ?? 0)}
        </Text>
      ) : null}
    </View>
  );
}
