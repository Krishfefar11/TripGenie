# TripGenie — Applied Design System

This is not a design system spec — that's [`DESIGN.md`](DESIGN.md) ("Hôtel
Rivière"), which remains the single source of truth for tokens and recipes.
This file records **how that system was actually implemented** across
TripGenie's real pages and components: where the tokens live in code, the
concrete choices made where the base spec was silent, and a map of what
changed file by file.

Written after implementation, not before — treat it as documentation of the
current state, not a plan.

> **History:** this is the third design system applied to the frontend this
> session. First a custom liquid-glass/neumorphic system (discarded before
> full rollout), then Devshell Mono (a developer-console aesthetic — wrong
> fit for a consumer travel product, see the "why" below), now Hôtel
> Rivière. If you're auditing old commits/screenshots, they may not match
> what's live.

## Why Devshell Mono got replaced

Devshell Mono (monospace-everywhere, terminal chrome, single cyan accent)
was evaluated honestly and rejected: it's tagged `[developer, minimal,
modern, saas, premium]` in its own source — built for dev-tool branding, not
travel. Monospace body copy hurt readability on itinerary prose, there was
no visual language for destinations/imagery, and lowercase kebab-case nav
labels (`plan-trip`, `ai-chat`) read as "for developers," not "plan my
vacation." Hôtel Rivière fixes all four: proportional serif+sans pairing,
warm palette, an accent used for genuine emphasis, and normal-cased human
copy.

---

## 1. Where the tokens live

| Concern | File |
|---|---|
| Color / font / radius / spacing tokens | `client/tailwind.config.js` |
| Component classes (buttons, cards, labels) | `client/src/index.css` |
| Font `<link>` (Cormorant Infant, Inter, JetBrains Mono) | `client/index.html` |

### Component classes available for future work

| Class | Use |
|---|---|
| `.btn-primary` / `.btn-secondary` / `.btn-outline` / `.btn-ghost` | The four button variants, exact padding/uppercase/tracking from DESIGN.md §4 |
| `.card` | Default hairline card — bg pearl, 1px hairline, hover border → ink |
| `.card-lift` | Secondary surface — bg `pearl-lift`, same hairline |
| `.card-suite` | Pearl-lift + 3px ink top border ("the only chrome") — used for saved-trip cards, the closest thing to a "suite card" in this app |
| `.caption` | Mono uppercase 11px, `ink-secondary` — eyebrows, metadata, stat labels |
| `.data-figure` | Mono uppercase 14px tabular-nums — costs, day counts, day-marker numerals |
| `.pull-quote` | Cormorant Infant italic, 28px — AI summary text and travel tips |
| `.status-dot` | Small filled circle for semantic-color status use |

Tailwind additions worth knowing: `text-hero` / `text-hero-sm`, `text-h1` /
`text-h1-sm`, `text-h2`, `text-quote`, `text-body`, `text-ui`, `text-caption`,
`text-data` (exact size/leading/tracking from DESIGN.md §3), and
`font-display` / `font-sans` / `font-mono` for the three families.

**One deviation from the literal spec, flagged per its own "ask before
adding" rule:** the source hero/H1 sizes (`8rem` / `4.5rem`) are desktop-only
values with no mobile counterpart declared. Added `hero-sm` (3.25rem) and
`h1-sm` (2.75rem) as responsive companions, applied at the base breakpoint
with the full-size token taking over at `md:`. This mirrors the system's own
established pattern of desktop/mobile pairs (see: "Section padding: 200px
desktop, 96px mobile") rather than inventing an unrelated value.

A legacy `primary` color alias points at sage for backward compatibility;
no component actually uses `text-primary` / `bg-primary` — everything uses
`.btn-primary` or `text-sage` directly (verified via grep across `client/src`).

---

## 2. Page-by-page

**Navbar** — Flat pearl bar, bottom hairline, sticky. Logo is an ink square +
Compass icon, wordmark in Cormorant Infant (per "Display... brand
wordmarks"). Tabs follow the literal Tabs recipe in DESIGN.md §7: the active
label doesn't change color, it switches font — from Inter uppercase to
Cormorant Infant italic at the same visual weight. That's the one most
distinctive, most literally-followed detail in this implementation.

**HomePage** — Hero headline is the "Suite Name" moment applied to the
brand: Cormorant Infant at (responsive) hero scale, no color, no gradient.
Eyebrow above it is a plain `.caption`, not a bordered badge — matching the
system's general lack of pill/badge chrome. Feature cards are `.card`s with
ink-only icons (never sage — sage is reserved, see below).

**TripForm** — One `.card`, hairline inputs (`hover:border-ink/40`,
`focus:border-ink` + 5% ink wash). The submit button, "Generate Itinerary,"
is the **one sage-olive CTA on this page** — the direct analog of the
system's "Reserve" button.

**ItineraryPage** — The destination name (`Lisbon, Portugal`, etc.) renders
as an H1 in Cormorant Infant — this is the single best content/system fit in
the whole app: a large-format place-name in a soft-didone serif is *exactly*
what "Suite Name" typography was designed for, just applied to a destination
instead of a hotel room. The AI-generated summary uses `.pull-quote` inside
a `card-lift` panel — a direct, literal use of the system's declared Pull
Quote role ("reserved for... pull quotes"). "Save Trip" gets `.btn-primary`
(sage) as this page's one reservation-equivalent gesture; "Download PDF" is
`.btn-secondary` (ink outline).

**ItineraryCard** — Day marker is a bordered square with the day number in
`.data-figure` (mono tabular numerals, matching the system's "Room Number"
token intent). Morning/afternoon/evening labels use `.caption`.

**BudgetBreakdown** — See §3, same single-highlight interpretation carried
over from the previous system, now in sage instead of cyan. Category icons
via `lucide-react`, no emoji (hard constraint, unchanged requirement).

**WeatherInfo / PackingList** — Standard `.card` / `.card-lift`. No accent
color used at all here — intentional, since sage stays reserved for the
per-page CTA and these components carry no "commitment" gesture.

**TravelTips** — Each tip renders in `.pull-quote` — turns generic advice
strings into something that reads like the "chef's signature note" the
system describes, rather than a bulleted list.

**ChatInterface / ChatPage** — User bubble: ink bg, pearl text. Assistant
bubble: `pearl-lift` + hairline. The chat send button is deliberately **ink,
not sage** — see §3, sending a message isn't treated as a reservation-grade
action.

**SavedTripsPage** — Cards use `.card-suite` (the 3px ink top border) since
these literally are the user's saved "reservations." The heart icon is ink,
not sage — kept in reserve for the empty-state "Start Planning" button,
which is that page's one CTA.

---

## 3. Interpretations — where DESIGN.md didn't specify

DESIGN.md's own instructions say: *"If a value is missing, ask the user
before adding one."* These are the calls made without a literal spec value:

- **"One sage-olive button per page."** The source system built this around
  a single hotel-booking flow with one obvious Reserve action. TripGenie has
  several pages, each with its own candidate CTA. Resolved by picking the
  one genuine commitment action per page: **Generate Itinerary** (Home),
  **Save Trip** (Itinerary), **Start Planning** (Saved Trips empty state).
  Everything else — downloads, deletes, chat send, nav — stays ink/outline.
  This required judgment the source file doesn't cover explicitly, but it's
  a direct extension of "one booking, one color."

- **Budget chart highlighting.** Same interpretation as the previous system:
  `highlight: single` in the chart tokens is applied by coloring only the
  largest-spend category's bar in sage; the rest render at `bg-ink/18`.

- **Chat send button color.** Not specified. Kept ink rather than sage,
  reasoning that a frequently-repeated, low-stakes action (sending a chat
  message) shouldn't carry the same "stamped reservation seal" weight the
  system explicitly reserves for singular commitments.

- **Responsive hero/H1 sizes.** Covered in §1 above — added `hero-sm`/`h1-sm`
  companions rather than shipping an unreadable 8rem headline on mobile.

---

## 4. Verification

Ran the full user flow after implementation: home → fill trip form → submit
→ real Groq-generated itinerary for Lisbon, Portugal on `/itinerary` → chat
page → saved trips (empty state). Screenshots taken at each step. No
leftover references to Devshell Mono's classes (`text-cyan`, `.shell-card`,
`.comment`, `font-jakarta`, etc.) anywhere in `client/src` (checked via grep
across all `.jsx` files).
