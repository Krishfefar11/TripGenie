---
name: "Waypoint"
description: "A functional, accessibility-first system for consumer travel and discovery products. Forest-green ink (#002b11) on white/near-white surfaces, Inter everywhere, soft-shadowed cards that lift on hover, full-pill buttons, and a warm four-color accent quartet — coral, gold, sky, sage — reserved for category wayfinding, never decoration. Built for products that need to feel trustworthy and fast, not precious. WCAG 2.2 AA is a hard requirement, not an aspiration."
tags: [travel, consumer, functional, accessible, structured, modern]
colors:
  primary:   "#002b11"
  secondary: "#38443a"
  tertiary:  "#3f6b52"
  neutral:   "#f7f7f7"
  surface:   "#ffffff"
accents:
  coral: "#e2673f"
  gold:  "#d4a24c"
  sky:   "#4a8fb0"
  sage:  "#3f6b52"
typography:
  display: Inter
  body:    Inter
  mono:    Inter
  scale:
    hero: "4.5rem / 1.05 / 400 / -0.02em"
    h1:   "2.5rem / 1.15 / 400 / -0.01em"
    h2:   "1.375rem / 1.3 / 400 / -0.004em"
    body: "1rem / 1.6 / 400 / 0"
radius:
  sm: 8px
  md: 12px
  lg: 20px
  pill: 9999px
shadows:
  card:   "0 2px 12px rgba(0,43,17,0.08)"
  cardHover: "0 6px 24px rgba(0,43,17,0.14)"
  button: none
borders:
  card:    "1px solid rgba(0,43,17,0.10)"
  divider: "rgba(0,43,17,0.18)"
buttons:
  primary:
    background: "#002b11"
    color: "#ffffff"
    border: none
    shape: pill
    padding: 13px 26px
    font: 500 / 0.8125rem / 0.02em
    uppercase: true
  secondary:
    background: transparent
    color: "#002b11"
    border: "1.5px solid #002b11"
    shape: pill
    padding: 13px 26px
    font: 500 / 0.8125rem / 0.02em
    uppercase: true
  outline:
    background: transparent
    color: "#002b11"
    border: "1.5px solid rgba(0,43,17,0.22)"
    shape: pill
    padding: 13px 26px
    font: 500 / 0.8125rem / 0.02em
    uppercase: true
  ghost:
    background: transparent
    color: "#38443a"
    border: none
    shape: pill
    padding: 13px 18px
    font: 500 / 0.8125rem / 0.02em
    uppercase: true
charts:
  variant: "colored-pill-bars"
  stroke_width: 5
  fill_opacity: 1
  gridlines: false
  bar_gap: 14px
  highlight: per-category
  dot_marker: false
accessibility:
  standard: "WCAG 2.2 AA"
  focus_visible: "2px solid #002b11, 2px offset, only on :focus-visible"
  keyboard_first: true
fonts_url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
dependencies: ["lucide-react"]
---

# Waypoint

## AI Build Instructions

> **Read this section before writing any code.** The rules below
> are non-negotiable. Every value used in the UI must come from this
> file's frontmatter — never substitute, approximate, or invent new
> colors, fonts, radii, or shadows. If a value is missing, ask the
> user before adding one.

### 1 · Your role

You are building UI for a product that has adopted **Waypoint** as its
design system. Treat `DESIGN.md` as the single source of truth. Your job is
to translate the user's product requirements into components and pages that
look like they were designed by the same person who authored this file.

### 2 · Token compliance

- Pull every color, font family, radius, shadow, and spacing value from the
  frontmatter at the top of this file.
- Use semantic roles (e.g. `primary`, `accent`, `muted`) — never hard-code
  hex values that bypass the system.
- When a token can be expressed as a CSS variable or Tailwind config entry,
  declare it once and reference it everywhere downstream — never inline a
  raw hex or arbitrary-value utility in a component.
- The Google Fonts `<link>` is provided in the Typography section. Add it to
  `<head>` before any component renders.
- Accent colors (`coral`/`gold`/`sky`/`sage`) are a **fixed four-item
  palette** for categorization — see §7. Do not introduce a fifth accent.

### 3 · Component recipes

Use these recipes verbatim when building the corresponding component.

#### Buttons

Four variants are defined. Pick one — never blend variants or invent a
fifth. All four are **full pill** (`border-radius: 9999px`), not sharp —
that is this system's defining shape signal.

- **Primary** — pill, bg `#002b11`, text `#ffffff`, padding `13px 26px`,
  weight `500`, uppercased, `0.02em` tracking.
- **Secondary** — pill, text `#002b11`, border `1.5px solid #002b11`, same
  padding/weight/tracking.
- **Outline** — pill, text `#002b11`, border `1.5px solid rgba(0,43,17,0.22)`,
  same padding/weight/tracking.
- **Ghost** — pill, text `#38443a`, no border, padding `13px 18px`.

Reach for **primary** as the single dominant CTA per screen. **Secondary**
for the supporting action. **Outline** for tertiary actions. **Ghost** for
inline/low-stakes actions (e.g. a chat send button — see Hard Constraints).

Every variant needs explicit `:hover`, `:focus-visible`, `:active`, and
`:disabled` states — see §8 Accessibility. `:disabled` is `opacity: 0.4;
cursor: not-allowed` across all four variants.

#### Cards

- Background: `#ffffff`
- Border: `1px solid rgba(0,43,17,0.10)`
- Shadow: `0 2px 12px rgba(0,43,17,0.08)` at rest
- Radius: `radius.lg` (`20px`)
- Hover: shadow deepens to `0 6px 24px rgba(0,43,17,0.14)`, border darkens
  slightly — cards should feel like they lift, not just outline-highlight.
- A `card-suite` variant (repeating/collection items — e.g. saved-item
  cards) adds a `3px solid #002b11` top border as the one extra accent.

#### Icon badges

The system's one distinctive, non-obvious recipe. A small (`w-8`–`w-9`)
rounded-square badge sits before headings/list items throughout the UI.
**Not every badge gets an accent color** — apply this rule exactly:

- If the icon is one of **several sibling items in the same set**
  (category icons in a chart legend, cards in a feature grid, repeating
  list/collection items), give it a tinted badge: `background:
  {accent}/12% opacity`, icon `color: {accent}` (full solid). Rotate through
  the four accents (`coral`/`gold`/`sky`/`sage`) so siblings are visually
  distinct from each other.
- If the icon is a **singular header for a generic container** (a card's
  own title icon, a page section header, the nav logo), it stays neutral —
  `color: #002b11`, no tinted background. Recoloring a one-off header icon
  is noise, not signal; the accent system exists to help users tell
  categories apart, not to decorate.

#### Charts / data bars

- Variant: `colored-pill-bars` — each category/series gets its own accent
  color, not a single-highlight-vs-gray scheme.
- Bar height `5px`, full pill radius, `14px` gap between rows.
- The top/leading value in a set renders at full opacity; others at `45%`
  opacity of their own color — this still reads as "what's dominant" while
  keeping every row identifiably its own category.
- No gridlines. No dot markers.

#### Background accents

`.aurora-bg` — a soft multi-color radial-gradient wash (coral/sky/gold at
8–10% opacity over white) reserved for **"moment" surfaces only**: a page's
hero section, or a single AI-generated/highlighted result card. Never apply
it to more than one surface per screen — it's a spotlight, not a texture.

#### Tabs / nav

Active tab or nav item is a **solid filled pill** (`bg-primary`, inverse
text), not an underline or font-style switch. Inactive items are secondary
ink text with a hover background tint.

### 4 · Typography pairings

Single family — Inter — used for everything, at different weights/sizes.
This system has **no display/serif pairing**; do not introduce one. Scale
distinction comes from size and weight (`500`/`600` for headings, `400` for
body), not font-family switching.

### 5 · Spacing & layout

- Base unit: `4px` (standard Tailwind default scale — this system does not
  define a custom spacing scale; use `4/8/12/16/24/32/48/64` etc. directly).
- Section padding: generous but not extreme — `64–96px` vertical on desktop
  sections, not the 200px "lobby air" of more editorial systems. This is a
  functional product, not a hospitality showcase.

### 6 · Motion

- `duration-fast`: `100ms` — micro-interactions (icon opacity, small state
  flips).
- `duration-base`: `200ms` — color/shadow/border transitions, hover states.
- Nothing slower than `200ms` for UI feedback. This is a fast, functional
  system — motion should never feel decorative or delayed.

### 7 · The accent quartet — hard rule

`coral` `#e2673f`, `gold` `#d4a24c`, `sky` `#4a8fb0`, `sage` `#3f6b52`. This
is a **closed set of four**. Their job is category disambiguation (see Icon
Badges, §3), not mood or decoration. Concretely:

- Never use an accent color for body text, primary CTAs, or backgrounds
  larger than a badge/gradient-wash — those stay in the primary ink/white
  system.
- Never invent a fifth accent for a fifth category — reuse one of the four,
  or fall back to neutral `ink-secondary` if a category is genuinely
  "miscellaneous"/unranked (see BudgetBreakdown's "Miscellaneous" row for
  the reference implementation: no accent, plain muted gray).

### 8 · Accessibility — hard constraints

This system's accessibility rules are load-bearing, not decorative:

- **Every interactive element** needs a real `:focus-visible` state — a
  `2px solid #002b11` outline with `2px` offset, visible only for keyboard
  navigation (`:focus-visible`, never plain `:focus`, so mouse/touch users
  don't see a ring on click).
- **Every custom clickable component** (a `<div>` acting as a card/button)
  must have `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler for
  `Enter`/`Space` — a `<div onClick>` alone is not acceptable, full stop.
- **Contrast**: primary ink (`#002b11`) on white or near-white surfaces
  clears WCAG AAA, not just AA — don't lighten it "for aesthetics." Accent
  colors at their solid value (not the 12%-opacity badge tint) must be
  checked against their background before use as text.
- **No color-only signal.** The "top category" in a chart, or an active
  nav item, must also differ in weight/fill/opacity/position — never rely
  on hue alone to convey state.

### 9 · Hard constraints (general)

Never do any of the following without explicit instruction from the user:

- Introduce a new color, font, radius, or shadow that isn't declared above.
- Add a display/serif font — this system is intentionally single-family.
- Use sharp/near-sharp button corners — buttons are always full pill.
- Use flat, shadowless cards — cards always carry `shadow.card` at rest.
- Tint an icon badge that's a singular container header (see §3).
- Skip the `:focus-visible` state on any new interactive element.
- Reach for emoji icons — use `lucide-react` consistently.

### 10 · Before you finish — verify

- [ ] Every color used appears in the Colors/Accents table above.
- [ ] All text uses Inter — no second family anywhere.
- [ ] Buttons match one of the four declared pill variants exactly.
- [ ] Cards carry `shadow.card` at rest and deepen on hover.
- [ ] Icon badges follow the sibling-vs-singular rule in §3 — not every
      icon is tinted.
- [ ] Every new interactive element has a visible `:focus-visible` state.
- [ ] Any custom `<div>`-as-button has `role`, `tabIndex`, and keyboard
      handling.
- [ ] No values were invented; if something was missing, you stopped and
      asked.

---

## 1. Atmosphere

Waypoint is a functional, trustworthy travel-platform system — closer to a
well-built dashboard than a boutique brochure. The page surface is clean
white, occasionally lifted to `#f7f7f7`. Text and primary actions run in a
near-black forest green, `#002b11` — dark enough to read as "serious" and
"grounded," warm enough not to feel corporate-navy. Cards carry real,
if restrained, shadow and lift slightly on hover — this is a system that
believes in soft depth, unlike flatter editorial systems. Buttons are full
pills. A fixed quartet of warm accents — coral, gold, sky, sage — appears
only where there's more than one of something to tell apart: three feature
cards, five budget categories, four essentials cards. Everywhere else stays
disciplined forest-green-on-white.

**Signature moves**
- Forest green `#002b11` ink on white — never black, never cream
- Inter, single family, everywhere — no display/serif pairing
- Full-pill buttons and active nav states — no sharp corners anywhere
- Real soft shadows on cards, deepening on hover — not flat/hairline-only
- A closed four-accent quartet (coral/gold/sky/sage) reserved for telling
  sibling categories apart — never for decoration or single-item cards
- `:focus-visible` keyboard rings and full keyboard operability everywhere,
  treated as core requirements, not an accessibility pass at the end

## 2. Palette

### Surfaces
- **Paper** `#ffffff` — page background
- **Paper Lift** `#f7f7f7` — secondary surfaces, elevated panels
- **Hairline** `rgba(0,43,17,0.14)` — dividers, resting card borders

### Ink
- **Ink** `#002b11` — text, headings, primary CTA fill, focus rings
- **Ink Secondary** `#38443a` — secondary text, muted labels

### Accent quartet (categorization only — see §7 above)
- **Coral** `#e2673f`
- **Gold** `#d4a24c`
- **Sky** `#4a8fb0`
- **Sage** `#3f6b52`

### Status
- **Success** `#3a8c5c`
- **Error** `#c4493a`

## 3. Typography

| Role | Font | Size | Weight | Leading | Tracking |
|------|------|------|--------|---------|----------|
| Hero | Inter | 72px | 400 | 1.05 | -0.02em |
| Hero (mobile) | Inter | 44px | 400 | 1.1 | -0.015em |
| H1 | Inter | 40px | 400 | 1.15 | -0.01em |
| H2 | Inter | 22px | 400 | 1.3 | -0.004em |
| Pull Quote | Inter (medium) | 18px | 500 | 1.55 | 0 |
| Body | Inter | 16px | 400 | 1.6 | 0 |
| UI / Button | Inter | 13px | 500 | 1.4 | 0.02em uppercase |
| Caption | Inter | 12px | 400 | 1.4 | 0.01em uppercase |
| Data / Figures | Inter | 14px | 400 | 1.2 | 0 (tabular-nums) |

One family throughout. Distinction comes from size/weight, not a
display-font switch — do not add Cormorant, Playfair, or any serif here.

## 4. Buttons

### Primary (Forest Green — the dominant CTA)
```css
background: #002b11;
color: #ffffff;
padding: 13px 26px;
border-radius: 9999px;
text-transform: uppercase;
letter-spacing: 0.02em;
font-weight: 500;
```
Hover deepens to `#01421c` with a soft shadow; active darkens further to
`#001f0c`; disabled drops to `opacity: 0.4`.

### Secondary / Outline / Ghost
- **Secondary** — transparent, `1.5px solid #002b11`, ink text, same pill
  shape and padding as primary.
- **Outline** — transparent, `1.5px solid rgba(0,43,17,0.22)` (softer
  border), ink text.
- **Ghost** — no border, `#38443a` text, smaller padding (`13px 18px`),
  underline-free hover (background tint instead).

## 5. Cards

```css
background: #ffffff;
border: 1px solid rgba(0,43,17,0.10);
border-radius: 20px;
box-shadow: 0 2px 12px rgba(0,43,17,0.08);
```
On hover: `box-shadow: 0 6px 24px rgba(0,43,17,0.14)`, border deepens to
`rgba(0,43,17,0.18)`. Collection/suite cards (saved items) add a `3px
solid #002b11` top border as their one extra accent — the "this is one of
your saved things" signal.

## 6. Icon badges & the accent quartet

The one component recipe unique to this system. See §3 and §7 of the AI
Build Instructions above for the full rule — in short: badges for sibling
categories get one of `coral`/`gold`/`sky`/`sage` at 12% background opacity
with the icon in the solid accent color; badges for singular container
headers stay neutral ink. This is how the system stays "aesthetic" without
turning into decoration — color always means something.

## 7. Charts

Colored pill bars, one accent per category, `5px` height, full radius, no
gridlines. The leading/dominant value renders at full opacity; the rest at
`45%` of their own accent — every row stays identifiable as its category
even when it isn't the largest.

## 8. Tabs / navigation

Active state is a solid filled pill (`bg-ink`, inverse text) — not an
underline, not a font-style switch. Inactive items are `ink-secondary`
with a `pearl-lift` hover tint.

## 9. Spacing

- Base `4px`, standard scale (`4/8/12/16/24/32/48/64...`) — no custom
  scale is defined for this system; use Tailwind's defaults directly.
- Section padding: `64–96px` vertical on desktop, `32–48px` mobile —
  generous but functional, not the extreme "air as luxury" of more
  editorial systems.

## 10. Accessibility

- WCAG 2.2 AA is a hard requirement (see §8 of AI Build Instructions).
- `*:focus-visible { outline: 2px solid #002b11; outline-offset: 2px; }`
  globally — every interactive element, no exceptions.
- Every custom clickable `<div>` needs `role="button"`, `tabIndex={0}`,
  and `Enter`/`Space` key handling.
- No color-only state signaling.

## 11. Do's & don'ts

✅ **Do**
- Use Inter at 400/500/600 only — this system has one family
- Hold full-pill buttons and a soft-shadowed, hover-lifting card language
- Reserve the accent quartet for telling siblings apart — chart categories,
  feature grids, repeating collection items
- Give every interactive element a real, visible `:focus-visible` ring
- Make every custom `<div>`-as-button truly keyboard-operable

❌ **Don't**
- Add a second (display/serif) font family
- Use sharp-cornered buttons — pill shape is non-negotiable here
- Tint a singular header icon just because tinted badges look nice
  elsewhere — the rule is sibling-sets only
- Introduce a fifth accent color, or use an accent for body text/large
  backgrounds
- Rely on hue alone (no accompanying weight/opacity/position change) to
  signal state

---

## Tokens

> Generated from the same source the live preview renders from.
> Treat the values below as the contract — never substitute approximations.

### Colors

| Role      | Value |
|-----------|-------|
| primary   | `#002b11` |
| secondary | `#38443a` |
| tertiary  | `#3f6b52` |
| neutral   | `#f7f7f7` |
| surface   | `#ffffff` |

### Accents

| Role  | Value |
|-------|-------|
| coral | `#e2673f` |
| gold  | `#d4a24c` |
| sky   | `#4a8fb0` |
| sage  | `#3f6b52` |

### Status

| Role    | Value |
|---------|-------|
| success | `#3a8c5c` |
| error   | `#c4493a` |

### Typography

- **Display:** Inter
- **Body:** Inter
- **Mono:** Inter

| Role | size / leading / weight / tracking |
|------|------------------------------------|
| Hero | 4.5rem / 1.05 / 400 / -0.02em |
| H1   | 2.5rem / 1.15 / 400 / -0.01em |
| H2   | 1.375rem / 1.3 / 400 / -0.004em |
| Body | 1rem / 1.6 / 400 / 0 |

### Radius

- sm: `8px`
- md: `12px`
- lg: `20px`
- pill: `9999px`

### Shadows

- **card:** `0 2px 12px rgba(0,43,17,0.08)`
- **cardHover:** `0 6px 24px rgba(0,43,17,0.14)`
- **button:** `none`

### Borders

- **card:** `1px solid rgba(0,43,17,0.10)`
- **divider:** `rgba(0,43,17,0.18)`

### Buttons

Four variants, each fully tokenized, all full-pill shape.

#### Primary

| Property | Value |
|----------|-------|
| shape | `pill` |
| background | `#002b11` |
| color | `#ffffff` |
| border | `none` |
| padding | `13px 26px` |
| fontWeight | `500` |
| fontSize | `0.8125rem` |
| letterSpacing | `0.02em` |
| uppercase | `true` |

#### Secondary

| Property | Value |
|----------|-------|
| shape | `pill` |
| background | `transparent` |
| color | `#002b11` |
| border | `1.5px solid #002b11` |
| padding | `13px 26px` |
| fontWeight | `500` |
| fontSize | `0.8125rem` |
| letterSpacing | `0.02em` |
| uppercase | `true` |

#### Outline

| Property | Value |
|----------|-------|
| shape | `pill` |
| background | `transparent` |
| color | `#002b11` |
| border | `1.5px solid rgba(0,43,17,0.22)` |
| padding | `13px 26px` |
| fontWeight | `500` |
| fontSize | `0.8125rem` |
| letterSpacing | `0.02em` |
| uppercase | `true` |

#### Ghost

| Property | Value |
|----------|-------|
| shape | `pill` |
| background | `transparent` |
| color | `#38443a` |
| border | `none` |
| padding | `13px 18px` |
| fontWeight | `500` |
| fontSize | `0.8125rem` |
| letterSpacing | `0.02em` |
| uppercase | `true` |

### Charts

| Property | Value |
|----------|-------|
| variant | `colored-pill-bars` |
| strokeWidth | `5` |
| fillOpacity | `1` |
| gridlines | `false` |
| barGap | `14px` |
| highlight | `per-category` |
| dotMarker | `false` |

### Accessibility

| Property | Value |
|----------|-------|
| standard | `WCAG 2.2 AA` |
| focusRing | `2px solid #002b11, 2px offset` |
| focusTrigger | `:focus-visible only` |
| keyboardFirst | `true` |
