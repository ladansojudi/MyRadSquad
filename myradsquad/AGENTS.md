# MyRadSquad

An interview case study: a small, clean Expo app. No backend, no data fetching layer,
no API routes, no auth, no `.env` keys, no analytics, no Firebase, no payments, no EAS
Update. Any data is local — typed mock data in `src/lib/` and local state. One Expo app
at the repo root; no monorepo.

## Expo has changed — don't trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed,
moved, or removed. Before writing any code that touches an Expo, EAS, or React Native
API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch `https://docs.expo.dev/llms.txt` — an index of all Expo docs
   with corrections to common LLM misconceptions. Follow its links to the specific page
   you need; never answer from memory.

The same applies to Uniwind (`https://docs.uniwind.dev`) — follow its current docs, not
memory of NativeWind or an older Uniwind API.

## Commands

```bash
npx expo install <package>  # ALWAYS use instead of npm/pnpm add — resolves SDK-compatible versions
pnpm start                   # start the dev server
pnpm ios                     # expo run:ios
pnpm android                 # expo run:android
pnpm prebuild                # expo prebuild --clean
pnpm lint                    # expo lint
pnpm typecheck               # tsc --noEmit
pnpm test                    # jest
npx expo-doctor              # diagnose dependency and config issues
npx expo install --fix       # fix incompatible package versions
```

Run `pnpm lint` and `pnpm typecheck` before calling anything done.

## Navigation and routing

- Expo Router for all navigation. Routes live in `src/app/` — every file there is a
  screen, `_layout.tsx` files define navigators. No logic or UI in `src/app/`; a route
  file only reads params and renders one view from `src/sections/<feature>/view/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.

## Structure

```
src/
  app/               # Expo Router routes ONLY (_layout.tsx, index.tsx, ...)
  sections/
    <feature>/
      <feature>-*.tsx   # parts of one feature, prefixed with its name
      view/
        <feature>-view.tsx  # screen-level view rendered by a route
  components/        # shared across sections
    ui/              # primitives built with cva + cn(), re-exported from index.ts
  hooks/             # use-*.ts
  lib/               # non-UI code: utils.ts, zustand stores (*-store.ts), pure logic, mock data
  global.css
```

- A feature's files live in `src/sections/<feature>/`, prefixed with the feature name
  (`home-header.tsx`); its screen views go in `view/` (`home-view.tsx`).
- Shared components go in `src/components/`; primitives (`button`, `card`, …) go in
  `src/components/ui/` and are exported from `ui/index.ts`.
- Hooks go in `src/hooks/use-<name>.ts`.
- State uses **zustand**, added only when the first store is needed, as
  `src/lib/<name>-store.ts`. A selector must never return a fresh `[]`/`{}` — fall back
  to a shared constant.
- Tests sit next to the code as `*.spec.ts` (Jest, `ts-jest`, `testEnvironment: 'node'`,
  pure logic only — no RN rendering).
- Platform-specific files use suffixes (`slider.android.tsx`).
- kebab-case filenames, at most 4 parts. Named exports, PascalCase components.
- Path aliases: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`.
- Every `ScrollView`/`FlatList` sets `showsVerticalScrollIndicator={false}` and
  `showsHorizontalScrollIndicator={false}` (enforced by eslint).
- Motion: Reanimated, ease-out arrivals and ease-in departures — no springs or bounce.

## Styling: Uniwind

- `metro.config.js` wraps the default config with `withUniwindConfig`; it must stay the
  outermost wrapper.
- `src/global.css` imports Tailwind and Uniwind, then defines design tokens inside
  `@layer theme { :root { @variant light {…} @variant dark {…} } }`. Every theme defines
  the same variables: `canvas`, `surface`, `content`, `muted`, `border`, `brand`,
  `brand-content`, `accent`, `accent-content`. Never hardcode a colour in a component.
- Use React Native's own `View`/`Text` with `className`. Don't import components from
  `uniwind`, and don't wrap them in `Text`/`View` wrapper components.
- A third-party component that needs `className` is wrapped once (at module scope) with
  `withUniwind`. `expo-image` stays on `style`.
- A native prop that takes a colour (`tintColor`, `ActivityIndicator`'s `color`) reads the
  token with `useCSSVariable('--color-…')`, wrapped in `String()` only if a numeric token
  is needed as a string.
- `src/lib/utils.ts` exports `cn()` = `twMerge(clsx(...))`, built with
  `extendTailwindMerge`; register any custom text size or shadow added to `global.css`
  there too, so `cn()` doesn't drop it.
- Variants are defined with `cva`. Prefer `size-*` over matching `w-*`/`h-*`. Spacing is
  on the 8pt grid, with screen content at `px-4` (16pt).
- `uniwind-types.d.ts` is generated by Metro and gitignored — don't edit or commit it.
  `uniwind-env.d.ts` and `css.d.ts` are committed so `tsc` passes on a fresh clone.

## Rules

- CNG: never create or edit `ios/` or `android/` by hand — they're generated and
  gitignored. Native settings go in `app.json` and config plugins.
- Prefer Expo modules over third-party ones.
- A dev build (`expo run:ios`/`expo run:android`) is needed after adding native code —
  Expo Go only includes its bundled native modules.
