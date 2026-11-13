# Illustration style: "Squad Shapes"

One visual language for the logo, the moving room icons, new illustrations, stickers and
photos. It grows out of the two things that already work: the **logo** (flat pastel pieces
that fit together, a same-colour lip, no outlines) and the **room icons** (dice, timer,
equalizer, notes on soft rounded tiles, moving calmly).

## 1. The kit of parts

Everything is built from the logo's pieces, nothing else:

| Piece | Use |
|---|---|
| Quarter circle | backs of chairs, speech, motion ("swoosh") |
| Half circle | heads of shape people, a sunrise, a cake |
| Circle | heads, plates, buttons, the sun |
| Rounded square (28% radius) | bodies, phones, tiles, books |
| Leaf (two opposite rounded corners) | hands, hair, plants |
| Four-point sparkle | Spark, celebration, "new" |

**Rules:** flat colour only, no gradients, no outlines, no textures. Depth comes from one
thing, the lip: a solid copy of the shape, 3–4 pt straight down, in a deeper shade of the
same colour (`useHardShadow`, `deepen()`).

## 2. Colour

The four pastels plus cocoa ink and white, nothing new:

| | Hex | Used for |
|---|---|---|
| Coral | `#f4a594` | fun, games, warmth, alerts in art |
| Periwinkle | `#aab5ec` | hangouts, Spark, calm |
| Mint | `#9fd4c5` | study, focus, "live" |
| Butter / cream | `#fbf6ec` / `#f6f1e9` | backgrounds, paper |
| Cocoa | `#4a3f3c` | small details only (dice dots, clock hands, letters) |
| White | `#ffffff` | highlights, stickers, plates |

One illustration uses at most three pastels plus cocoa details. The violet (`#6a5fd6`) is
for buttons only, never in art, so the art never competes with the next step.

## 3. People: shape friends, no faces

Friends are **faceless geometric avatars** (`src/components/art/shape-avatar.tsx`, looks in
`src/lib/avatars.ts`): a pastel disc, a shirt in one of the four pastels, a head split into
a lit and a shaded half (flat facets, no outline), and hair built from simple shapes
(short, spiky, bob, long, ponytail, curly). No eyes, no mouth. Skin tones and hair colours
vary, so the squad looks like real, different people without drawing anyone's face.

Why: the research says AI that "asks about people in photos" feels creepy (RQ7), and
Spark never reads faces. The product's own art follows the same rule.

## 4. Spark is an object, not a mascot

Spark stays the four-point sparkle with the small "AI" tag. It never gets eyes, a mouth or
a name voice. It moves (glints, drifts, drops a card), it doesn't talk like a friend.

Why: 1 in 3 teen AI users felt uncomfortable with AI companions (Common Sense), and
Snapchat's My AI backlash came from an AI posing as a friend (RQ7, RQ11).

## 5. Motion

The same calm motion as the room icons and the logo:

- One main action when a scene appears (pieces land one by one, like the logo assembling),
  then two or three idle loops (a bob of 2–4 pt, a 3° sway, a sparkle glint).
- Ease-out to arrive, ease-in to leave, no springs or bounce. Everything out of phase.
- UI chrome (tab bar, chat avatars, headers) never moves; only illustrations do.
- Reduced motion: every scene's first frame is a finished drawing.

## 6. Stickers

Chunky Rubik Bold words ("LUNCH?", "I'M IN", "LOL", "HOP IN") on a rounded pastel slab
with a white rim and the lip, tilted ±5–10°, one small sparkle. They are the squad's voice
in the art.

## 7. Photos: only what friends post

Photos are **real content, never decoration**: moments, memories, and the squad's photo
tasks. The product's own screens (onboarding, paywall, empty states) use illustration.

- Places and things, never faces (same rule as Spark).
- Rounded 22 pt corners, the same lip as a card, a white sticker caption pill.
- No filters or duotone: real colour, so a teen's photo still looks like their day.
- On onboarding page 1 a photo can appear as a **polaroid tile** in the scene (a lunch
  tray, a hallway), tilted like a sticker, to say "this is about your real life".

## 8. Graphics list, by screen

Priority **P0** = the six solutions (what the case is judged on). **P1** = nice to have.
"Have" = already in the app.

### Onboarding

| Screen | Graphic | Motion | Status |
|---|---|---|---|
| Splash | Logo assembles from its pieces | pieces land one by one | Have |
| Age gate | A calendar card made of shapes with a small sealed envelope ("nobody else sees it"). No cake, no age hints (neutral screen) | card settles, envelope flap closes | P0, new |
| Intro 1 · your squad | Table with shape friends and stickers; add one **polaroid photo** of a lunch tray tilted behind the table | friends land, your seat jiggles | Have + photo P1 |
| Intro 2 · rooms | Hangout, focus and game tiles, "Leo started Hangout", HOP IN | tiles drift; music notes rise from the hangout | Have + notes P1 |
| Intro 3 · Spark | Spark's vote card with bars filling, "it's leo 💀" and LOL stickers | bars draw on, stickers pop in | Have |
| What are you here for? | Three mini scenes instead of single shapes: **hanging out** (two shape friends + pizza slice), **studying** (book + timer), **moments** (camera + polaroid) | the picked one comes alive, the others rest | P0, new |

### Paywall and purchase

| Screen | Graphic | Motion | Status |
|---|---|---|---|
| Paywall A | Hero by answer: game / focus / hangout tile + Spark + LOL sticker | tile floats, Spark glints | Have |
| Paywall B | Ring of 5 seats taken, 7 empty | empty seats breathe; on "Unlock", 7 fill one by one | Have + fill P1 |
| Ask a parent | Phone tile showing an "Ask to Buy" card + a parent shape friend with a check | check draws on when approved | P0, upgrade |

### Home

| Screen | Graphic | Motion | Status |
|---|---|---|---|
| Squad emblems | Each squad's logo-piece emblem | moves only while live | Have |
| Live card · room | Room tile (hangout, focus, game, study) | equalizer / timer / dice | Have |
| Quiet card | Faded emblem + Spark's card (vote / photo / question) | Spark glints once | Have |
| Empty table (started your own) | Your empty table with 4 empty seats and an invite ticket sliding out | seats breathe, ticket slides | P0, upgrade |
| A squad comes alive | Banner with friends' faces popping in | pop in one by one | Have |

### Spark

| Screen | Graphic | Motion | Status |
|---|---|---|---|
| Add Spark | Sparkle hovering over a chat bubble, rule tiles | sparkle orbits once | P0, small |
| "Maya added Spark" card | Sparkle + Maya's shape-friend tile | sparkle lands next to her | P1 |
| Spark takes a break | Sparkle resting on a pillow tile, "zzz" as tiny circles | slow breathe | P1 |
| Photo task | Camera tile with a small flash | flash once | P1 |

### Wireframe screens (later)

Messages, Moments, You, Search, rooms, start a room, notes, focus, new squad, stickers,
add a moment, QR invite stay wireframes; they reuse the same kit when designed.

## 9. How to make them

Draw each graphic as React Native SVG from the kit (like `room-art.tsx`,
`squad-emblem.tsx`), with motion on the shared scene clock (`SceneClock`, `wave`, `popIn`).
No raster illustrations, so the art stays sharp, light, and recolours for the wireframe
theme for free. Photos stay bundled images (`expo-image`), credited in
`assets/images/photos/CREDITS.json`.
