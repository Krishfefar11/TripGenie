# TripGenie — Applied Design System: Aurora

This file records **how the current design system is actually implemented**
across TripGenie's real pages and components — where the tokens live, the
component vocabulary, the deliberate engineering calls, and what was verified.

Written after implementation. Documentation of current state, not a plan.

> **History:** the frontend has been through several systems this session —
> a liquid-glass/neumorphic experiment, "Devshell Mono" (developer-console
> aesthetic), "Hôtel Rivière" (warm cream + serif editorial), and "Waypoint"
> (clean forest-green-on-white, distilled from a Tripadvisor token dump).
> **Aurora** is the current one: a full product-grade redesign aiming at the
> Stripe/Linear/Vercel tier while keeping TripGenie's forest-green identity.

---

## 1. What changed from Waypoint

Waypoint was clean but read as flat and under-designed — one accent per icon,
plain white everywhere, no section rhythm, no footer, minimal motion. Aurora
keeps the brand anchor (deep forest green, Inter, pill buttons) and rebuilds
everything else:

| Concern | Waypoint | Aurora |
|---|---|---|
| Color | 4 flat accents | 7 accents, each a **tonal ramp** (100→700) + 9 gradient presets |
| Ink | `#002b11` | `#0a1f14` with a 4-step ramp (`ink` / `soft` / `muted` / `faint`) |
| Type scale | 10 sizes, fixed | 13 roles, `clamp()`-fluid, weights baked into tokens |
| Shadows | 2 | 8-step layered scale, **tinted green** rather than neutral black, plus 4 colored glows |
| Section bgs | all white | mesh gradient, tint, blueprint grid, dot grid, film-grain noise, dark bands |
| Motion | none | scroll reveals, stagger, float, sheen, pulse rings, bar grow, spring easing |
| Footer | none | full footer: CTA row, brand blurb, link columns, socials, status bar |
| Homepage | hero + form + 3 cards | hero w/ product preview, form, **bento grid**, dark pipeline timeline, sample-output showcase, testimonials, CTA band |

---

## 2. Where things live

| Concern | File |
|---|---|
| Color / type / radius / shadow / gradient / motion tokens | `client/tailwind.config.js` |
| Component recipes, surfaces, backgrounds, reveal CSS | `client/src/index.css` |
| Fonts (Inter + JetBrains Mono) | `client/index.html` |
| Scroll-reveal primitives | `client/src/components/ui/Reveal.jsx` |
| Icon containers | `client/src/components/ui/IconBadge.jsx` |
| Section header | `client/src/components/ui/SectionHeading.jsx` |
| Scroll progress bar | `client/src/components/ui/ScrollProgress.jsx` |
| Footer | `client/src/components/Footer.jsx` |
| `cn()` class merge helper | `client/src/utils/cn.js` |

### Component vocabulary

`.btn-primary` / `.btn-dark` / `.btn-secondary` / `.btn-ghost` / `.btn-glass`
(+ `.btn-sm` / `.btn-lg`) · `.card` / `.card-hover` / `.card-sunken` /
`.card-gradient` · `.glass` / `.glass-dark` · `.bg-mesh` / `.bg-mesh-soft` /
`.bg-tint` / `.bg-grid` / `.bg-dots` / `.bg-noise` / `.bg-ink-deep` · `.orb` ·
`.text-gradient` / `.text-gradient-vivid` · `.input` / `.chip` / `.pill` ·
`.eyebrow` / `.label-form` / `.caption-meta` / `.stat-num` / `.data-num` /
`.pull-quote` · `.icon-box` / `.status-dot` / `.rule` / `.sheen-wrap`

---

## 3. Engineering decisions worth knowing

### Above-the-fold content never depends on JavaScript to become visible

The hero originally used Framer Motion's `initial={{opacity: 0}}` → `animate`.
That writes `opacity: 0` inline on mount and relies on `requestAnimationFrame`
to walk it back up. **If rAF is throttled — a backgrounded tab, a busy main
thread, a script that fails mid-flight — the hero is stranded invisible.**

This was not hypothetical: it reproduced immediately in a backgrounded tab
(`document.hidden === true`, **0 rAF callbacks in 500ms**, hero frozen at
`opacity: 0.0215`).

The hero now uses CSS keyframe animations with `animation-fill-mode: both`,
staggered via `animationDelay`. The browser owns the timeline; there is no JS
in the path to visibility.

### Scroll reveals are IntersectionObserver + CSS, not a JS animation loop

`Reveal` / `Stagger` set a `data-reveal` attribute; an observer flips
`data-revealed`; **both the hidden and visible states are declarative CSS**
(see the reveal block in `index.css`). The observer only toggles an attribute —
it never interpolates values. Worst case the transition doesn't paint and the
content simply appears.

Three safety nets, because content stuck at `opacity: 0` is the worst possible
failure mode:
1. **No `IntersectionObserver` support** → reveal immediately.
2. **Synchronous in-viewport check on mount** → anything already on screen
   reveals without waiting for an observer callback (which a hidden tab
   suspends).
3. **`visibilitychange` re-check** → a tab restored from the background
   re-evaluates, so nothing stays stranded after scrolling while suspended.

Stagger delays come from CSS `nth-child` rules, so there's no per-item JS.

### Progress bars carry their real value in the DOM

Budget bars set `width` to the true percentage and animate with a CSS
`scaleX` keyframe. A stalled animation shows a **correct bar**, never an empty
track — which is what a JS width-interpolation would have left behind.

### Icon color means something

`IconBadge` has `gradient` (feature-level: solid gradient, white glyph, colored
glow) and `tint` (inline: 12% wash, solid glyph). Accents are assigned when an
icon **distinguishes one sibling from another** — budget categories, bento
tiles, pipeline steps, time-of-day blocks. Generic container headers stay
neutral. Recoloring a one-off header icon is decoration, not signal.

`BudgetBreakdown`'s "Miscellaneous" row is deliberately neutral gray: it's the
unranked catch-all and shouldn't compete. The top category is marked with both
a `TOP` chip **and** full opacity — never hue alone.

### Accessibility

- Global `*:focus-visible` ring (2px, 2px offset) — keyboard only, never on
  pointer click.
- `prefers-reduced-motion` is honored in **CSS**, so it applies to every
  animation path including the reveal system.
- Saved-trip cards are `role="button"` + `tabIndex={0}` + Enter/Space handlers.
  Verified: focus ring visible, `Enter` navigates.
- Form controls have real `<label htmlFor>`, steppers have `aria-label`,
  toggles have `aria-pressed`, the chat log is `role="log" aria-live="polite"`,
  errors are `role="alert"`, decorative icons are `aria-hidden`.

### Interactions that now do something

- **PackingList** items are genuinely checkable with a progress bar. Previously
  the checkmark appeared on hover and tracked nothing — a packing list you
  can't tick off is decoration.
- **MediaUpload** accepts real drag-and-drop with a distinct dragging state,
  and revokes its object URLs.
- **TripForm** has a chip-based interest picker, a day stepper, and budget
  presets. Chips and the free-text field merge (de-duplicated) into the same
  `interests` string the API already expected — no backend change.
- **ChatInterface** textarea auto-grows to a 140px ceiling.

---

## 4. Verification

Restarted Vite (Tailwind's JIT does not reliably pick up config-only changes on
hot reload in this project — a recurring issue across every redesign here).

- **Desktop 1440**, **mobile 375**, and full-page captures of Home, Itinerary,
  Chat, Saved Trips.
- **Real end-to-end generation** (Tokyo, 3 days, $1000, "Food" chip). Server
  logs confirm the full path: hybrid search fused 15 candidates → cross-encoder
  reranked to top 5 → Groq generated. The chip merge reached the retrieval
  query as `"Tokyo Food Plan a 3-day trip to Tokyo"`, and the page rendered 3
  day cards with genuinely retrieved Tokyo specifics (Senso-ji, Tsukiji,
  TeamLab Planets, Ichiran).
- **Keyboard**: saved-trip card `Enter` → navigates to `/itinerary`.
- **Console**: zero errors.
- **`vite build`**: passes (446 kB JS / 141 kB gzip, 57 kB CSS / 11 kB gzip).

### Bugs found and fixed during verification

- **Day-number timeline nodes were invisible** — `overflow-hidden` on
  `ItineraryCard` clipped the node positioned outside the card's box.
- **Hero frozen invisible** in a throttled tab — root cause above.
- **Floating hero badges overlapped card body copy** — re-anchored to the
  card's outer corners and gated to `xl:`.
- **Hero headline wrapped awkwardly** ("Travel plans / that") — reduced the
  `hero` clamp ceiling from `5rem` to `3.875rem`.
- **Duplicate padding** in the saved-trip card footer row.
- **Excess dead space** above the footer (`mt-24` on top of section padding).

### Known cosmetic notes

- Bento tiles in the second row stretch to equal height, leaving some bottom
  whitespace when copy is short. Intentional for grid alignment.
- A saved trip persisted before this work has an empty `summary`, so its
  summary panel renders empty quotes. Pre-existing data shape issue in what
  gets persisted on save — **not** introduced by this redesign, and not fixed
  here since it's a backend/persistence concern rather than a design one.
