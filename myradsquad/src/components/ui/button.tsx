import { cva, type VariantProps } from 'class-variance-authority';
import { Text, type PressableProps } from 'react-native';

import { PressableScale } from './pressable-scale';

import { useHardShadow } from '@/hooks/use-hard-shadow';
import { useIsWireframe } from '@/hooks/use-is-wireframe';
import { cn } from '@/lib/utils';

const buttonVariants = cva('flex-row items-center justify-center active:opacity-90', {
  variants: {
    variant: {
      primary: 'bg-primary',
      cobalt: 'bg-cobalt',
      mustard: 'bg-canvas',
      // A soft tint of ink: reads as a quiet button on white, cream or butter.
      outline: 'bg-content/10',
    },
    size: {
      lg: 'h-16 rounded-[22px] px-6',
      md: 'h-12 rounded-2xl px-5',
      sm: 'h-10 rounded-full px-4',
    },
  },
  defaultVariants: { variant: 'primary', size: 'lg' },
});

const labelVariants = cva('font-display', {
  variants: {
    variant: {
      primary: 'text-primary-content',
      cobalt: 'text-cobalt-content',
      mustard: 'text-content',
      outline: 'text-content',
    },
    size: {
      lg: 'text-[20px] leading-[24px]',
      md: 'text-[16px] leading-[20px]',
      sm: 'text-[14px] leading-[18px]',
    },
  },
  defaultVariants: { variant: 'primary', size: 'lg' },
});

type ButtonProps = Omit<PressableProps, 'children'> &
  VariantProps<typeof buttonVariants> & {
    label: string;
    className?: string;
    labelClassName?: string;
  };

/** Filled buttons sit on the same-colour lip as the logo and the cards; the quiet one doesn't. */
const LIP_TONE = {
  primary: 'primary',
  cobalt: 'cobalt',
  mustard: 'canvas',
  outline: null,
} as const;

export function Button({
  label,
  variant,
  size,
  className,
  labelClassName,
  style,
  ...props
}: ButtonProps) {
  const tone = LIP_TONE[variant ?? 'primary'];
  const lip = useHardShadow(4, tone ?? 'surface');
  const wire = useIsWireframe();
  // In a wireframe every button, the quiet one too, gets the dashed edge.
  const edged = Boolean(tone) || wire;
  return (
    <PressableScale
      accessibilityRole="button"
      className={cn(buttonVariants({ variant, size }), className)}
      style={edged ? [lip, style as object] : style}
      {...props}
    >
      <Text numberOfLines={1} className={cn(labelVariants({ variant, size }), labelClassName)}>
        {label}
      </Text>
    </PressableScale>
  );
}
