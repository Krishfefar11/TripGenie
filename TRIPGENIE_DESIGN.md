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
| Hero background photo carousel | `client/src/components/ui/HeroBackdrop.jsx` |
| Per-destination photo fetch (Wikipedia) | `client/src/utils/useDestinationImage.js` |
| Itinerary route map | `client/src/components/TripMap.jsx` |
| Server-side geocoding (Nominatim) | `server/services/geocodeService.js` |

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

---

## 5. Real imagery and the itinerary map

Added after a second round of feedback: Aurora had zero photographic imagery
and no map, despite being a travel product. This section covers both —
implemented with free, keyless data sources rather than a paid image/maps API,
so the project still runs with nothing but the existing Groq/Gemini keys.

Also removed in this pass: the homepage's **Capabilities** (bento grid) and
**Reception** (testimonials) sections, at the user's request — cut cleanly,
including their now-orphaned `TESTIMONIALS` data and `Quote` icon import.

### Hero photo carousel — `HeroBackdrop.jsx`

Six real photos (Rome, Tokyo, Paris, Bali, Bangkok, New York — matching the
RAG corpus exactly) from Wikimedia Commons, crossfading behind the existing
`bg-mesh`/`bg-grid` layers at low opacity (a `bg-white/[0.86]` scrim). This is
deliberately texture, not a loud photo banner: hero text contrast never
depends on which of the six frames happens to be showing, because the scrim
dominates regardless. All six URLs were verified to resolve (200, correct
content-type) before hardcoding.

Crossfade is a single 36s CSS keyframe (`animate-hero-crossfade`) shared by
all six images, each offset by `animation-delay: {i * 6}s` — one image visible
at a time, brief overlap at the edges. Uses `fill-mode: both` so an image
doesn't flash fully-visible during its own delay before its first turn (same
technique already used by `fade-up`/`bar-grow`). No extra reduced-motion rule
was needed: the project's existing global `prefers-reduced-motion` block
already collapses all animation durations to ~0ms, which lands every image on
its keyframe's final (invisible) frame — the backdrop just settles to plain
`bg-mesh`, correctly.

Small attribution line ("Photos: {credits} · Wikimedia Commons") in the
hero's bottom-right corner — required by the Commons licenses on these
specific photos, not optional decoration.

### Destination photo — `useDestinationImage.js` + `ItineraryPage`

Fetches a real photo for the *generated* destination (arbitrary user input,
not a fixed set) from Wikipedia's REST summary API, client-side, no API key.
Verified directly that its title-matching already handles real-world typos —
the exact "ahemdabad" input from earlier this session resolves to Ahmedabad's
photo. Same safe scrim treatment as the hero backdrop, so it's a drop-in reuse
of a pattern rather than a new risk. Fails silently (no image, no error) when
a destination has no matching Wikipedia page; the header just stays on plain
`bg-mesh`.

**Scope call:** the second ask was photos on individual day cards, tied to
each retrieved place. Not implemented — most itinerary line items (a specific
restaurant, a specific street) don't have their own Wikipedia page, so
per-line-item lookups would fail far more often than they'd succeed, leaving
scattered broken/missing images across the day cards. One reliable
destination-level photo beats several unreliable landmark-level ones.

### Itinerary map — `geocodeService.js` + `TripMap.jsx`

The itinerary JSON schema (`buildItineraryPrompt` in `ragPipeline.js`) now
asks the LLM for one extra field per day: `mapQuery`, a short real place name
("Colosseum, Rome") the LLM already effectively knows since it just named
that landmark in the day's text. After parsing, each day's `mapQuery` is
geocoded server-side via Nominatim (OpenStreetMap's free geocoder — no key).

Nominatim's usage policy caps its public instance at 1 request/second and
requires an identifying `User-Agent`; calls are sequential with ~1.1s spacing,
not parallel, to actually respect that rather than risk the shared IP getting
blocked. Trips are capped at the first 14 days for geocoding — no itinerary
in practice gets close to that, and it bounds worst-case added latency.

Two reliability details found by testing real queries, not assumed:
- **"Vatican Museums, Rome" returned zero Nominatim results; "Vatican
  Museums" alone returned a correct match.** A city qualifier can
  over-constrain the free-text search. So a failed lookup retries once on
  just the part before the first comma before giving up.
- **If both attempts fail, the day still gets a marker** — placed at the
  destination's own coordinates with a small deterministic offset (golden-
  angle spiral) so multiple fallback markers fan out instead of stacking
  exactly on top of each other. Flagged internally via `coordsApproximate`.

`TripMap.jsx` renders via `react-leaflet` (v4, not v5 — v5 requires React 19
and this project is on React 18.3; installed the matching major version
rather than forcing an incompatible peer dep). Markers are custom numbered
`L.divIcon`s reusing the exact classes from `ItineraryCard`'s day-node badge
(`bg-grad-brand`, white bold number), not Leaflet's default marker image —
which sidesteps a well-known Leaflet+bundler issue where the default icon's
relative URLs don't resolve under Vite. A route polyline connects the markers
in day order. Tiles are plain OpenStreetMap with required attribution.

**Persistence gap found and fixed:** `Trip.js`'s Mongoose schema stores
`itinerary` as `Mixed`, so per-day `coords` survive save/reload automatically.
But the new top-level `destinationCoords` field was silently dropped on save
— Mongoose strips undeclared top-level fields, and `tripController.js`
explicitly whitelists which `req.body` fields it reads. Both the schema and
the controller's destructure needed the new field added. Verified with a real
save → fetch round-trip (Bangkok, both `destinationCoords` and per-day
`coords` came back intact) rather than assumed from reading the code.

### Bug found during verification

**Rules of Hooks violation, `ItineraryPage.jsx`.** `useDestinationImage()`
was first added *after* the component's `if (loading) return <LoadingSpinner
/>` early return. On the first render (`loading === true`) that hook call
never executes; once data arrives and `loading` flips to `false`, a re-render
reaches it for the first time — React sees a different number of hooks
between renders and throws `Rendered more hooks than during the previous
render`. Caught live in the browser console, not in code review. Fixed by
moving the hook above the early return, called unconditionally every render
with `data?.destination` (safe pre-load, since the hook itself no-ops on a
falsy destination).

### Verification

- Hero backdrop: visually confirmed in-browser — a real cityscape photo
  visible at low opacity behind the hero copy, text fully legible, crossfade
  advances over time.
- Destination photo: visually confirmed on a live Rome generation — real
  building photo, "Photo via Wikipedia" credit visible.
- Map: DOM-verified rather than screenshot-only (the preview pane's
  screenshot pipeline was unreliable this session) — `12/12` tiles loaded and
  `3/3` numbered markers present for a 3-day Rome trip on desktop; `6/6`
  tiles and `2/2` markers for a 2-day Bangkok trip on a 375px mobile
  viewport, with no horizontal page overflow.
- Persistence: real save → fetch round-trip confirmed both `destinationCoords`
  and per-day `coords` survive intact.
- `vite build`: passes clean (600.8 kB JS / 187.4 kB gzip, 72.4 kB CSS / 17.4 kB
  gzip — the size jump from ~440 kB is `leaflet` + `react-leaflet`; not code-
  split, since this app doesn't route-split anything else either).
- Console: clean after the Rules of Hooks fix.
