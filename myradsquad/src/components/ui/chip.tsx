import { cva, type VariantProps } from 'class-variance-authority';
import { Text, type PressableProps } from 'react-native';

import { PressableScale } from './pressable-scale';

import { useDashedEdge } from '@/hooks/use-hard-shadow';
import { useIsWireframe } from '@/hooks/use-is-wireframe';
import { cn } from '@/lib/utils';

const chipVariants = cva('flex-row items-center justify-center rounded-full', {
  variants: {
    tone: {
      surface: 'bg-surface',
      mustard: 'bg-canvas',
      ink: 'bg-content',
      primary: 'bg-primary',
      cream: 'border-0 bg-cream',
    },
    size: {
      xs: 'h-7 px-2.5',
      sm: 'h-9 px-3.5',
      md: 'h-12 px-5',
    },
  },
  defaultVariants: { tone: 'surface', size: 'sm' },
});

const chipLabel = cva('font-heavy', {
  variants: {
    tone: {
      surface: 'text-content',
      mustard: 'text-content',
      ink: 'text-brand-content',
      primary: 'text-primary-content',
      cream: 'text-content',
    },
    size: {
      xs: 'text-[12px] leading-[16px]',
      sm: 'text-[14px] leading-[18px]',
      md: 'text-[16px] leading-[20px]',
    },
  },
  defaultVariants: { tone: 'surface', size: 'sm' },
});

type ChipProps = Omit<PressableProps, 'children'> &
  VariantProps<typeof chipVariants> & {
    label: string;
    className?: string;
  };

/** Rounded pill for reactions, tabs and small actions. */
export function Chip({ label, tone, size, className, style, ...props }: ChipProps) {
  const dashed = useDashedEdge();
  const wire = useIsWireframe();
  return (
    <PressableScale
      className={cn(chipVariants({ tone, size }), className)}
      style={wire ? [dashed, style as object] : style}
      {...props}
    >
      <Text className={chipLabel({ tone, size })}>{label}</Text>
    </PressableScale>
  );
}
