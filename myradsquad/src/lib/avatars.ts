import type { MemberId } from './mock-data';

/**
 * Each friend's look for their avatar: a faceless shape friend (no eyes, no mouth, like the
 * research's "never faces" rule), built from flat geometric pieces. Skin and hair are
 * illustration colours, not UI tokens; background and shirt use the app's pastels.
 */
export type Hair = 'short' | 'spiky' | 'bob' | 'long' | 'ponytail' | 'curly';
export type Pastel = 'coral' | 'cobalt' | 'teal' | 'cream';

export type AvatarLook = {
  hair: Hair;
  hairColor: string;
  skin: string;
  shirt: Pastel;
  bg: Pastel;
};

const SKIN = {
  light: '#f2d6bd',
  lightTan: '#e4b893',
  tan: '#c98d63',
  brown: '#9b6646',
  deep: '#6f4631',
};

const HAIR = {
  ink: '#2b2321',
  brown: '#6e4a35',
  red: '#d9654f',
  butter: '#efc75e',
};

export const AVATAR_LOOKS: Record<MemberId, AvatarLook> = {
  maya: { hair: 'long', hairColor: HAIR.ink, skin: SKIN.lightTan, shirt: 'coral', bg: 'cream' },
  jordan: { hair: 'curly', hairColor: HAIR.ink, skin: SKIN.deep, shirt: 'teal', bg: 'coral' },
  leo: { hair: 'spiky', hairColor: HAIR.brown, skin: SKIN.light, shirt: 'cobalt', bg: 'teal' },
  ava: { hair: 'bob', hairColor: HAIR.red, skin: SKIN.light, shirt: 'teal', bg: 'cobalt' },
  you: { hair: 'short', hairColor: HAIR.brown, skin: SKIN.tan, shirt: 'coral', bg: 'cobalt' },
  sam: { hair: 'short', hairColor: HAIR.butter, skin: SKIN.light, shirt: 'coral', bg: 'teal' },
  priya: { hair: 'long', hairColor: HAIR.ink, skin: SKIN.brown, shirt: 'teal', bg: 'coral' },
  nia: { hair: 'ponytail', hairColor: HAIR.brown, skin: SKIN.brown, shirt: 'coral', bg: 'teal' },
  theo: { hair: 'spiky', hairColor: HAIR.ink, skin: SKIN.tan, shirt: 'cobalt', bg: 'coral' },
};
