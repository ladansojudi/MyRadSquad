# MyRadSquad

A tappable iOS prototype for the PlusMinusOne product-designer case: a chat app where
13–17-year-olds keep close-friend squads alive. Built with Expo (SDK 58), Expo Router,
TypeScript, Uniwind, Reanimated and react-native-svg. No backend: all data is local mock
data, and every launch starts fresh. See [AGENTS.md](./AGENTS.md) for the project rules.

## Run it (iOS)

```bash
pnpm install
pnpm ios          # builds the dev client and opens it in the iOS Simulator
pnpm start        # later runs: start Metro, then open the installed app
```

If `pod install` fails with `Unicode Normalization not appropriate for ASCII-8BIT`, run
`export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` first (a CocoaPods + Ruby 4 issue).

Web preview (for a link that opens on a phone): `npx expo export --platform web` writes
a single-page app to `dist/`.

## The flow the case asks for

The age gate comes first (asked once, at sign-in), then the intro pages: the case lists
feature screens first, but a teen under 13 should not see the product pitch.

| Case task | Where it is in the app |
|---|---|
| 13+ age gate | First, right after the splash (sign-in in the real app; Apple's Declared Age Range API where the law provides it): birthday picker (drag or tap the cards). It starts neutral (this year, January 1st), never at an age of 13+ (FTC: a neutral age screen), and checks nothing until you pick a year. Under 13 blocks Continue; "Why do we ask?" explains. No back button: it's the first step |
| Feature screens | Then three pages you swipe (or Next): 1 "Maya saved you a seat." (your squad, live), 2 "Hang out, focus, play." (rooms), 3 "Never a dead chat." (Spark's vote). Each has one animated graphic and one idea; "Start your own table" on every page |
| "Why are you here?" | "What are you here for?" (hanging out / studying / sharing moments): asked about the person, not the table |
| Onboarding earns the paywall | Straight to **Paywall A**, which leads with what they came for: title, art and the order of rooms / Spark / themes follow the answer; room for 12 is one line at the end. Then Home |
| Home, 2 minutes after onboarding | Maya's table (joined by invite) or your new, empty table |
| AI feature, state 1: a member turns it on | Home → "Add Spark to this squad" → what Spark can see, how it behaves |
| AI feature, state 2: what the squad sees | Chat: "You/Maya added Spark" system card, Spark's question, Today's Spark board |
| **Paywall B** (experiment variant) | A static screen, as the brief allows: Prototype menu → More states → Paywall B. In the test it replaces A at the same moment (end of onboarding) |

**Home** lists every squad you are in, once each, closed, ranked by who is there now:
- **Live now:** every squad with friends in it right now, most people first.
- **Quiet right now:** squads nobody is in (faded faces, softer border).
- Every card has the same layout: a fixed-width face slot (present friends first, absent
  ones faded, "+N" after three, so 2 or 12 members line up the same), name and unread,
  status, last message.
- **Tap to open in place** (one at a time). A live squad opens alive: seats pop in, the
  last messages roll through the preview line, what is happening now (voice room, focus
  session, a moment), **Jump in**, seats/Invite. A quiet squad opens still and says
  "It's quiet in here", with "Wake them up".
- Lunch Table Legends' card holds its **one daily question**. Free: the app's "Question
  of the day". With **Spark** (the Squad+ AI) the same slot becomes Spark's question,
  written for this squad and posted only when the chat goes quiet. One slot, never two.
- **A squad comes alive:** about 12 s after you land on Home (once per session, mocked),
  Jordan leaves Lunch Table's hangout room for Study Hall's focus session. Study Hall
  slides to the top and an animated in-app banner says who joined. Push notifications
  stay plain text, at most one a day. Replay it from the prototype menu.

**Moments** has two views: **Today** (the 24-hour feed from your squads) and
**Memories**, a month calendar where each day shows the moment you kept — the pattern
Locket and BeReal use. Only you see past days.

**Prototype menu:** the thin tab on the screen edge (on every screen, above sheets too;
drag it to move it), or You tab → Prototype menu. It shows the research dashboard's six
solutions in order (S1 Squad Spark, S2 feature screens, S3 "Why are you here?", S4 Paywall
A/B, S5 Home, S6 Ask a parent): how each one works, and its screens as chips that open them
in the right state. Reset sits in the corner; every other screen is listed at the bottom. It is a reviewing tool, not part of the app.

## Designed vs wireframe

Only the six solutions on the research dashboard are designed: the age gate, the three
intro pages, "What are you here for?", Paywall A and B, Ask a parent, Home, Spark (add,
chat, the quiet squad's spark, the notification, squad settings). Every other screen
(Messages, Moments, You, Search, rooms, start a room, notes and study, focus, new squad,
stickers, add a moment, QR invite) is a **high-fidelity wireframe**: the real layout and
copy in greys, dashed outlines instead of the lip on cards, buttons, chips and fields
(`useHardShadow` turns into `useDashedEdge`), photos as dashed placeholders, and a small
"WIREFRAME" tag under the Dynamic Island. It is one theme (`@variant wireframe` in `global.css`, `<Wireframe>` in
`src/components/wireframe.tsx`), so a screen moves into the design by removing one wrapper.

## What is real and what is mocked

- **Real on device:** navigation, every tap target on the designed screens, the age
  check, the iOS share sheet for invites, copy-link, the system notification prompt
  (after our own pre-prompt), haptics, keyboard handling.
- **Mocked:** messages from friends (canned replies after a typing indicator), Spark's
  questions and Maya's answer, the invite link, purchases. "Try 3 days free" starts a
  pretend trial for 18+; under 18 shows the Ask to Buy confirmation instead.
- **Beyond the hi-fi design:** Moments tab, You tab, new squad, hangout (voice) room,
  focus session, QR invite, sticker drawer, posting a moment, shared notes and
  flashcards. Built in the same brush style so every tap leads somewhere real; audio,
  camera and files are mocked.

## Design decisions worth knowing

- **Answer to see theirs.** Today's question hides the squad's answers until you answer,
  so the first action on Home is a contribution, not a scroll.
- **Notifications are asked after value, not at launch.** The pre-prompt appears right
  after your first answer and promises at most one a day; only then the iOS prompt.
- **Who controls Spark:** anyone in the squad with Squad+ can turn it on (the person who
  adds it pays; the rest of the squad gets it). Everyone sees who added it. Anyone can mute
  it for themselves or remove it for the whole squad. No admin, so nobody is stuck with
  an AI someone else chose. The rules are on the Spark sheet ("Who's in control").
- **Spark can't be creepy by construction.** It reads this squad only (never DMs,
  photos, faces or location), posts at most once a day, everything it says everyone
  sees, anyone can mute it, and the squad is told who added it.
- **Under-18 purchases** go through Apple's Ask to Buy; the paywall says so before the
  button, and the confirmation tells the teen what happens next.

## Look: pastel, flat items, Solar icons

- **Palette:** pastel tokens in `src/global.css` (butter canvas, peach, periwinkle, mint)
  with ink text; `live` and `alert` are the darker greens/corals used for text.
- **No borders anywhere**, like the logo: items and art are pastel shapes with a soft
  "lip" underneath, a darker shade of their own colour a few points down
  (`useHardShadow` + `deepen` in `src/lib/color.ts`). Never an ink outline or ink shadow.
- **Icons:** Solar icon set, Linear style (CC BY 4.0), in `src/components/solar-icons.ts`;
  tab bar icons are Solar PNGs in `assets/images/tabs` (outline, filled when selected).
- **Squad emblems:** every squad gets its own mark built from the logo's pieces, picked
  from its id (`src/components/art/squad-emblem.tsx`). Still on a closed card; when the
  card opens, each piece takes one slow quarter turn in turn.
- **Photos:** Moments and Memories use real photos from Wikimedia Commons (free licenses,
  no faces). Authors and licenses: `assets/images/photos/CREDITS.json`.

## Home: live and quiet

Home is two lists.
- **Live now**: squads with friends in them right now, in a carousel: who's here, the chat
  rolling by, the busiest room friends started (Join), Start a room and how many are open.
- **Quiet**: nobody is in. Without Spark, the card shows the last message.

## Spark (the AI feature)

- **What it does:** once a day at most, when a squad's chat has gone quiet, Spark leaves one
  "spark" in it: a question, a quick vote (a mini game) or a photo task (`spark-drop.tsx`,
  per squad in `WAKE`). Cousins: "Who wakes up first on Thanksgiving?" (vote Nia / Theo /
  Me). Study Hall: "Show your desk right now, messiest one wins" (photo). Lunch: "Drop this
  week's funniest moment" (question).
- **What it sees:** only that squad's chat. No DMs, location or faces.
- **Who sees it:** everyone in the squad. Nothing hidden.
- **Control:** opt-in (a member adds it), anyone can mute or remove it (squad settings).
- **No streaks:** no counter, nothing to lose if you skip it. Two sparks in a row with no
  answer and it takes a break until someone writes.
- **Where:** in the quiet squad's card on Home and in its chat, and as the day's one
  notification. Never a card of its own above your friends (RQ11), never in a live squad.
  Your answer pings the squad (you, not Spark); a friend comes back and the squad moves to
  Live now.

At launch Maya has added Spark in Lunch Table Legends (you arrive by her invite, A1; state
2) and Nia in Cousins. Study Hall has none: open its settings → Add Spark to see state 1
(on a Squad+ trial; otherwise it leads to Squad+).

## Squad settings (every chat)

The ⚙️ in every squad chat's header opens that squad's settings
(`squad-settings/[id]`): **Spark** (add it, mute it for you, remove it for everyone),
**mute this squad**, members with who's here, invite, rooms, leave. Spark's mark shows
next to the ⚙️ while Spark is on. Per-squad state: `useSquadSpark(id)`, `mutedSquads`.

## Rooms: started from the chat

A squad is one group chat (the 💬 line on its Home card). A **room** is something a member
starts from that chat's **+**: Hangout (voice), Focus session (shared timer), Study together,
Quick game (`start-room/[id]`, templates in `ROOM_TEMPLATES`). Nobody sets rooms up ahead of
time: the chat, the Home card and the Rooms sheet all say who started it ("Sam started a
Focus session · 3 in · Join"), friends hop in, and a room closes when it empties, so quiet
squads have no rooms. Your own room opens with you already inside; a friend who's around
joins a moment later (mock). Logic: `squadRooms` (open rooms only), `startRoom` in the store,
`useSquadRooms`.

## Room kinds: free and Squad+

Start a room (the chat's +, or + Room in the pinned strip) offers four kinds: **Hangout**
(free) and **Focus** (shared timer), **Study** (notes and flashcards together), **Game**
(trivia), which come with Squad+ (tapping a locked one opens Squad+). This is the "premium
fun" Squad+ sells (research A2).

## Rooms, Messages, Search

- **Rooms:** every squad has its own rooms, tagged FUN or STUDY (hangout, game, moments,
  study corner, focus). "Jump in" / "See rooms" on a squad card opens its rooms as a
  sheet: the busiest room on top (Join room / Mute), the rest in a grid filtered All /
  Fun / Study. Each room has a moving icon (meter and notes, a hopping die, a sweeping
  clock, a scribbling pencil, a polaroid flash) while people are in it; quiet rooms stand
  still. Logic in `src/lib/rooms.ts`.
- **Room screen:** what's playing on top; people in a 4-column grid, rings pulse on
  whoever is talking (they take turns), mic badges flip, friends' reactions drift up the
  side. You join muted, then talk, react, invite, or leave.
- **Messages:** every squad chat in one list (last line or "Leo is typing", unread count),
  with the live rooms across squads on top.
- **Search:** squads, rooms (also by "fun" / "study"), friends with where they are right
  now, and messages. Logic in `src/lib/search.ts`.

## iOS-native chrome (iOS 26, Apple HIG)

The brand lives in the content (pastel art, Rubik type, a soft cream canvas); the chrome is the
system's, so it behaves like every other iPhone app:
- **Tab bar:** `NativeTabs` (UITabBar): Squads, Messages (unread badge), Moments, You,
  and the iOS 26 system **Search** tab set apart at the end. Liquid Glass, SF Symbols,
  minimizes on scroll, tap again to scroll to top.
- **Large titles:** each tab has its own native stack; the large title collapses into
  the bar on scroll, the header floats over content with a soft scroll-edge effect.
- **Navigation bars:** pushed screens (chats, notes, Spark) use the system bar: back
  chevron, centered title + subtitle (like Messages), glass bar buttons.
- **Sheets:** native form sheets (grabber, system corner radius, swipe to dismiss,
  rise above the keyboard); large ones for Spark and the prototype menu.
- **Segmented controls:** SwiftUI `Picker` (segmented) via `@expo/ui` for Chat / Study /
  Moments, Today / Memories, Spark's vibe.
- Full-screen moments that are illustrations (paywalls, room, focus, new squad) keep
  their own close button on purpose.

## Visual quality on iOS

- No static tilts on cards and buttons: iOS does not anti-alias the borders of rotated
  views, so they looked stair-stepped. Only stickers, seats and small art move or tilt,
  and those render through `Crisp` (`src/components/motion/crisp.tsx`) to stay smooth.
- The offset shadow carries a thin inset ink outline (`useHardShadow`) so no hairline
  seam shows between a border and its shadow.
- Illustrations size themselves to the space left (`FillSpace`), so paywalls and
  onboarding fit small and large iPhones without cutting off buttons.

## Motion

Calm, never bouncy (Reanimated, ease-out arrivals, ease-in departures). One loop clock
per illustration, paused off screen and with Reduce Motion. The notes and the list of
what moves are in [`src/components/art/MOTION.md`](./src/components/art/MOTION.md).

## Project structure

```
src/app/          routes only (Expo Router)
src/sections/     one folder per feature; screen views in view/
src/components/   shared UI, art (SVG illustrations) and motion
src/lib/          store (zustand), mock data, pure logic, motion engine
```

## Commands

```bash
pnpm lint        # expo lint
pnpm typecheck   # tsc --noEmit
pnpm test        # jest (store and age logic)
npx expo-doctor  # diagnose dependency and config issues
```

## Case deliverables

- Submission folder: `python3 scripts/build-submission.py` builds `../Submission` (the one-page HTML, `Design file/` with named screenshots, the experiment note, and writes `../README.md` from `docs/FOLDER_README.md`) and refreshes `~/Desktop/MyRadSquad RQ Dashboard.html`
- [docs/ILLUSTRATION_STYLE.md](./docs/ILLUSTRATION_STYLE.md) — the art style and the graphics list per screen
- [docs/EXPERIMENT_NOTE.md](./docs/EXPERIMENT_NOTE.md) — Paywall A vs B (draft)
- [docs/AI_TOOLS.md](./docs/AI_TOOLS.md) — tools used and what each did (draft)
- [docs/screenshots/](./docs/screenshots/) — the design file: 00 cover (AI tools, what would feel creepy or spammy and what prevents it), then 16 screens in flow order. Fill in `docs/AI_TOOLS.md` and rerun `swift scripts/design-cover.swift` to redraw the cover

## Accessibility

Text colours meet WCAG AA (4.5:1) on the canvas, white cards and cream fills: near-black
ink `#1c1917` 16:1+, muted `#57534e` 6.8:1+, live green `#2f7565` 5.1:1, alert `#b9472f` 4.9:1, white on the
violet button `#6a5fd6` 5.0:1. `faint` is only for decoration and disabled days, never for
text you need to read. Quiet squads fade only their emblem; their name and text stay full
strength. Cards have no outlines; a same-colour lip under each one (like the logo) gives
them their edge.

**One rule for type:** Rubik in four weights, each with one job. SemiBold (`font-display`) is
for screen titles and big numbers; Medium (`font-heavy`) for buttons, row titles and small
labels; Regular (`font-text`, and `font-strong`) for everything you read: paragraphs,
hints, numbers and what you type. Every input is the
one `TextField` (regular weight, muted placeholder, a soft well with no outline or lip).

**One rule for spacing (Apple's layout):** a screen with no navigation bar (the tabs, the
first onboarding step) starts its one-line title 8 pt under the safe area; a screen with a
back button keeps the 44 pt navigation bar and starts right under it. The last control sits
on the safe area plus 8 pt (`useBottomInset`: 34 pt over the home indicator + 8). Titles are
always one line (`numberOfLines={1}`, shrinking to 70% if needed); sides are 16 pt (24 pt
on onboarding).

**One rule for depth:** every card that sits on the canvas, and every filled button
(violet primary, the white "+ New squad" pill, Spark's buttons), has the lip in its own
colour (`useHardShadow`). Things inside a card (rows, note tiles, plan options, chips, chat
bubbles), panels that rise from the bottom, and faded placeholders stay flat, so depth
never stacks. Main actions are violet everywhere; links on white use the violet too
(`text-primary`), never a pastel that fails contrast.
