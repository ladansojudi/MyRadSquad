import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-family': [{ font: ['text', 'strong', 'heavy', 'display'] }],
      'font-size': [
        { text: ['hero', 'title', 'headline', 'subtitle', 'body', 'caption', 'overline'] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
