---
name: "Hôtel Rivière"
description: "A boutique hotel that wears its restraint as luxury. Warm pearl-bone surfaces, Cormorant Infant for room names at oversized scale, Inter for body, a single sage-olive accent reserved for the Reserve CTA. Built for hospitality, restaurant groups, and travel brands that want quiet European elegance over moody hotel-stock photography."
tags: [hospitality, editorial, premium, warm, minimal]
colors:
  primary:   "#1d1a14"
  secondary: "#7a7468"
  tertiary:  "#1d1a14"
  neutral:   "#ece5d3"
  surface:   "#f6f0dd"
typography:
  display: "Cormorant Infant"
  body:    Inter
  mono:    "JetBrains Mono"
  scale:
    hero: "8rem / 0.92 / 400 / -0.045em"
    h1:   "4.5rem / 1 / 400 / -0.03em"
    h2:   "2rem / 1.18 / 400 / -0.018em"
    body: "1.0625rem / 1.7 / 400 / -0.005em"
radius:
  sm: 1px
  md: 2px
  lg: 3px
  pill: 9999px
shadows:
  card:   none
  button: none
borders:
  card:    "1px solid rgba(29,26,20,0.10)"
  divider: rgba(29,26,20,0.14)
buttons:
  primary:
    background: #5a6238
    color: #f6f0dd
    border: none
    shape: sharp
    padding: 13px 26px
    font: 500 / 0.8125rem / 0.16em
    uppercase: true
  secondary:
    background: transparent
    color: #1d1a14
    border: 1px solid #1d1a14
    shape: sharp
    padding: 13px 26px
    font: 500 / 0.8125rem / 0.16em
    uppercase: true
  outline:
    background: transparent
    color: #1d1a14
    border: 1px solid rgba(29,26,20,0.18)
    shape: sharp
    padding: 13px 26px
    font: 500 / 0.8125rem / 0.16em
    uppercase: true
  ghost:
    background: transparent
    color: #7a7468
    border: none
    shape: sharp
    padding: 13px 18px
    font: 500 / 0.8125rem / 0.16em
    uppercase: true
charts:
  variant: "thin-bars"
  stroke_width: 1
  fill_opacity: 0
  gridlines: false
  bar_gap: 20px
  highlight: single
  dot_marker: false
fonts_url: "https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
dependencies: ["lucide-react"]
---

# Hôtel Rivière

## AI Build Instructions

> **Read this section before writing any code.** The rules below
> are non-negotiable. Every value used in the UI must come from this
> file's frontmatter — never substitute, approximate, or invent new
> colors, fonts, radii, or shadows. If a value is missing, ask the
> user before adding one.

### 1 · Your role

You are building UI for a project that has adopted **Hôtel Rivière** as its
design system. Treat `DESIGN.md` as the single source of truth.
Your job is to translate the user's product requirements into
components and pages that look like they were designed by the same
person who authored this file.

### 2 · Token compliance

- Pull every color, font family, radius, shadow, and spacing value
  from the frontmatter at the top of this file.
- Use semantic roles (e.g. `primary`, `accent`, `muted`) — never
  hard-code hex values that bypass the system.
- When a token can be expressed as a CSS variable, declare it once
  in your global stylesheet and reference it everywhere downstream.
- The Google Fonts `<link>` is provided in the Typography section.
  Add it to `<head>` before any component renders.

### 3 · Component recipes

Use these recipes verbatim when building the corresponding component.

#### Buttons

Four variants are defined. Pick one — never blend variants or invent a fifth.

- **Primary** — sharp shape, bg `#5a6238`, text `#f6f0dd`, padding `13px 26px`, weight `500`, uppercased.
- **Secondary** — sharp shape, text `#1d1a14`, border `1px solid #1d1a14`, padding `13px 26px`, weight `500`, uppercased.
- **Outline** — sharp shape, text `#1d1a14`, border `1px solid rgba(29,26,20,0.18)`, padding `13px 26px`, weight `500`, uppercased.
- **Ghost** — sharp shape, text `#7a7468`, padding `13px 18px`, weight `500`, uppercased.

Reach for **primary** as the single dominant CTA per screen.
**Secondary** for the supporting action. **Outline** for tertiary
actions in toolbars. **Ghost** for inline links and table actions.

#### Cards

- Background: `#f6f0dd`
- Border: `1px solid rgba(29,26,20,0.10)`
- Shadow: `none`
- Radius: `radius.lg` (`3px`)
- Internal padding: `20px` for compact cards, `24–28px` for content cards.

#### Tabs

Variant: `underline`. Flat row of labels. Active tab gets a 2px underline in the accent color — no fill.

#### Charts

- Bar/line variant: `thin-bars`
- No gridlines — let the bars/lines carry the data.
- Highlight strategy: `single` — emphasize a single bar/point per chart.

#### Typography pairings

- **Display (`Cormorant Infant`)** — h1, h2, hero headlines, brand wordmarks.
- **Body (`Inter`)** — paragraphs, labels, button text, form inputs.
- **Mono (`JetBrains Mono`)** — code, eyebrows, metadata, numerals in tables.

### 4 · Hard constraints

Never do any of the following without explicit instruction from the user:

- Introduce a new color, font, radius, or shadow that isn't declared above.
- Mix this system with another (e.g. don't paste in Material or Bootstrap defaults).
- Use generic gradient defaults (purple→blue, peach→pink) — they break the system's voice.
- Reach for emoji icons. Use a consistent icon library and size icons in line with body type.
- Add motion that exceeds the system's restraint — keep transitions short (≤200ms) and subtle.

### 5 · Before you finish — verify

Run through this checklist for every screen you produce:

- [ ] Every color used appears in the Colors table above.
- [ ] Headlines use the display font; body copy uses the body font.
- [ ] Buttons match one of the declared variants exactly (shape, padding, weight).
- [ ] Border-radius values come from `radius.sm` / `radius.md` / `radius.lg` / `radius.pill`.
- [ ] Cards and dividers use the declared border + shadow tokens.
- [ ] No values were invented; if you needed something missing, you stopped and asked.

---

## 1. Atmosphere

Hôtel Rivière is a boutique hotel that wears restraint as luxury. The page surface is warm pearl-bone `#f6f0dd` — closer to handmade card stock than to white. Room and suite names run in Cormorant Infant at 128px, weight 400 — the soft-cornered didone glyphs giving every name an inscribed-on-stone permanence without any heaviness. Body sits in Inter at 17px on a 1.7 leading. UI labels run in Inter 500 with extreme 0.16em uppercase tracking — the brass-plaque caption voice. The single accent is sage-olive `#5a6238` that appears only on the Reserve CTA — the singular booking gesture in the entire system gets the singular color.

The discipline is in the proportion: massive Cormorant Infant on warm pearl, generous negative space, and one sage-olive button per page that reads as a stamped reservation seal.

**Signature moves**
- Cormorant Infant 400 at 128px for room/suite names — soft didone, drama through scale
- Warm pearl-bone surface `#f6f0dd` — never white, never cream
- Sage-olive `#5a6238` exclusively on the Reserve CTA — one booking gesture, one color
- All UI labels uppercase 0.16em tracking — the brass-plaque voice
- Sharp 1-3px radius — almost zero, brass-plaque precision
- Section padding 200px desktop — the air IS the lobby

## 2. Palette

### Surfaces
- **Pearl Bone** `#f6f0dd` — page background (warm card stock)
- **Pearl Lift** `#ece5d3` — secondary surfaces, gallery panels
- **Hairline** `rgba(29,26,20,0.10)` — every divider

### Ink
- **Ink** `#1d1a14` — text, headings, secondary CTA fill
- **Ink 50** `#7a7468` — secondary text, mono captions

### Accent
- **Sage Olive** `#5a6238` — Reserve CTA only
- That is the only color in the system.

## 3. Typography

| Role | Font | Size | Weight | Leading | Tracking |
|------|------|------|--------|---------|----------|
| Suite Name (Hero) | Cormorant Infant | 128px | 400 | 0.92 | -0.045em |
| H1 | Cormorant Infant | 72px | 400 | 1.0 | -0.03em |
| H2 | Cormorant Infant | 32px | 400 | 1.18 | -0.018em |
| Pull Quote | Cormorant Infant (italic) | 28px | 400 | 1.3 | -0.012em |
| Body | Inter | 17px | 400 | 1.7 | -0.005em |
| UI / Button | Inter | 13px | 500 | 1.4 | 0.16em uppercase |
| Caption / Date | JetBrains Mono | 11px | 500 | 1.0 | 0.10em uppercase |
| Room Number | JetBrains Mono | 14px | 500 | 1.0 | 0.04em uppercase tabular-nums |

Cormorant Infant only at 400 — the soft-corner didone breaks at any heavier weight. Italic reserved for the chef's signature note and pull quotes.

## 4. Buttons

### Primary (Sage Olive — Reserve only)
```css
background: #5a6238;
color: #f6f0dd;
padding: 13px 26px;
border-radius: 2px;
text-transform: uppercase;
letter-spacing: 0.16em;
font-weight: 500;
```

The 0.16em tracking is wider than typical UI — that is the brass-plaque voice carried into the booking gesture. Reads as a stamped reservation seal, not a CTA button.

### Secondary (Ink Outline — every other action)
- Transparent, 1px solid ink, ink text — same near-sharp shape, same wide tracking

### Outline & Ghost
- Outline: transparent, 1px hairline at 18% ink
- Ghost: no border, ink-50 uppercase, hover underlines

## 5. Cards

```css
background: #f6f0dd;
border: 1px solid rgba(29,26,20,0.10);
border-radius: 3px;
box-shadow: none;
```

NO shadows, NO inset highlights. Suite cards lift to pearl-lift surface with a 1px ink top border (3px wide) — the only chrome.

## 6. Charts

Thin precise bars (3px wide, 20px gap). One bar in sage-olive, others in 18% ink. NO gridlines. Y-axis labels in JetBrains Mono uppercase 11px. Charts are reserved for occupancy-by-month breakdowns and read as gallery exhibits.

## 7. Tabs

Underline 1px in ink for the active state. Inactive tabs are ink-50 in uppercase 0.16em. The active label is set in Cormorant Infant italic at the same size — that is the rhythm change, not a color shift.

## 8. Spacing

- Base 8px
- Scale: `8, 16, 24, 32, 48, 64, 96, 128, 200, 280`
- Section padding: 200px desktop, 96px mobile — the air IS the lobby

## 9. Do's & don'ts

✅ **Do**
- Use Cormorant Infant at 400 only — anything heavier breaks the soft-didone proportion
- Hold the warm pearl-bone surface — white reads as web app, cream reads as wedding stationery
- Reserve sage-olive for the Reserve CTA exclusively — one booking, one color
- Use 0.16em uppercase tracking on every UI label — that's the brass-plaque voice

❌ **Don't**
- Use moody hotel-stock photography — the typography earns the elegance
- Use Cormorant Infant at 600+ — bold breaks the soft didone
- Use a second accent — sage-olive alone, on the Reserve CTA only
- Use any radius beyond 3px — corners must read as brass-plaque, not pill

---

## Tokens

> Generated from the same source the live preview renders from.
> Treat the values below as the contract — never substitute approximations.

### Colors

| Role      | Value |
|-----------|-------|
| primary   | `#1d1a14` |
| secondary | `#7a7468` |
| tertiary  | `#1d1a14` |
| neutral   | `#ece5d3` |
| surface   | `#f6f0dd` |

### Typography

- **Display:** Cormorant Infant
- **Body:** Inter
- **Mono:** JetBrains Mono

| Role | size / leading / weight / tracking |
|------|------------------------------------|
| Hero | 8rem / 0.92 / 400 / -0.045em |
| H1   | 4.5rem / 1 / 400 / -0.03em |
| H2   | 2rem / 1.18 / 400 / -0.018em |
| Body | 1.0625rem / 1.7 / 400 / -0.005em |

### Radius

- sm: `1px`
- md: `2px`
- lg: `3px`
- pill: `9999px`

### Shadows

- **card:** `none`
- **button:** `none`

### Borders

- **card:** `1px solid rgba(29,26,20,0.10)`
- **divider:** `rgba(29,26,20,0.14)`

### Buttons

Four variants, each fully tokenized. The preview renders from these exact values.

#### Primary

| Property | Value |
|----------|-------|
| shape | `sharp` |
| background | `#5a6238` |
| color | `#f6f0dd` |
| border | `none` |
| padding | `13px 26px` |
| fontWeight | `500` |
| fontSize | `0.8125rem` |
| letterSpacing | `0.16em` |
| uppercase | `true` |

#### Secondary

| Property | Value |
|----------|-------|
| shape | `sharp` |
| background | `transparent` |
| color | `#1d1a14` |
| border | `1px solid #1d1a14` |
| padding | `13px 26px` |
| fontWeight | `500` |
| fontSize | `0.8125rem` |
| letterSpacing | `0.16em` |
| uppercase | `true` |

#### Outline

| Property | Value |
|----------|-------|
| shape | `sharp` |
| background | `transparent` |
| color | `#1d1a14` |
| border | `1px solid rgba(29,26,20,0.18)` |
| padding | `13px 26px` |
| fontWeight | `500` |
| fontSize | `0.8125rem` |
| letterSpacing | `0.16em` |
| uppercase | `true` |

#### Ghost

| Property | Value |
|----------|-------|
| shape | `sharp` |
| background | `transparent` |
| color | `#7a7468` |
| border | `none` |
| padding | `13px 18px` |
| fontWeight | `500` |
| fontSize | `0.8125rem` |
| letterSpacing | `0.16em` |
| uppercase | `true` |

### Charts

| Property | Value |
|----------|-------|
| variant | `thin-bars` |
| strokeWidth | `1` |
| fillOpacity | `0` |
| gridlines | `false` |
| barGap | `20px` |
| highlight | `single` |
| dotMarker | `false` |
