import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ArrowUpRight, Database, Layers, Wallet, MessageSquare,
  ImagePlus, Search, MapPin, Sunrise, Sun, Moon,
  ShieldCheck, Zap, FileText, CheckCircle2, Compass,
} from 'lucide-react';
import TripForm from '../components/TripForm';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import IconBadge from '../components/ui/IconBadge';
import HeroBackdrop from '../components/ui/HeroBackdrop';
import { EXAMPLE_ITINERARIES } from '../data/exampleItineraries';

/* ── Content ─────────────────────────────────────────────────────────── */

const TRUST_STATS = [
  { value: '6', label: 'Destination guides indexed' },
  { value: '384-d', label: 'Local embedding vectors' },
  { value: '0.97', label: 'Retrieval MRR@5' },
  { value: '4', label: 'LLM fallback layers' },
];

const HOW_STEPS = [
  {
    n: '01', accent: 'brand', icon: FileText,
    title: 'Ingest & chunk',
    body: 'Real destination guides are split into overlapping ~250-word passages so no fact gets cut mid-sentence.',
  },
  {
    n: '02', accent: 'indigo', icon: Search,
    title: 'Hybrid retrieve',
    body: 'BM25 keyword search runs alongside vector similarity, then Reciprocal Rank Fusion merges both rankings.',
  },
  {
    n: '03', accent: 'violet', icon: Layers,
    title: 'Cross-encoder rerank',
    body: 'A local cross-encoder rescores every candidate against your query, lifting the best passage to the top.',
  },
  {
    n: '04', accent: 'amber', icon: Sparkles,
    title: 'Ground & generate',
    body: 'Retrieved passages are injected into the prompt, so the itinerary cites real places — not hallucinations.',
  },
];

// Fixed per time-of-day slot regardless of which example is showing, so the
// icon language stays consistent as the card rotates.
const TIME_SLOTS = [
  { part: 'Morning',   key: 'morning',   icon: Sunrise, tint: 'amber' },
  { part: 'Afternoon', key: 'afternoon', icon: Sun,     tint: 'sky' },
  { part: 'Evening',   key: 'evening',   icon: Moon,    tint: 'violet' },
];

/* ── Hero visual: a floating itinerary preview card ───────────────────── */
// Rotates through the same real, pre-generated examples as the gallery
// below — not one static Rome card forever. Content swap is a React state
// change + a CSS opacity fade-in on remount (via `key`), no JS-interpolated
// values, so a stalled interval just leaves the last example showing
// instead of a broken half-transition.

const HeroPreview = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % EXAMPLE_ITINERARIES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const example = EXAMPLE_ITINERARIES[index];
  const { data } = example;
  const day1 = data.itinerary?.[0];

  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      {/* Glow behind the card */}
      <div className="orb -right-8 -top-10 h-56 w-56 bg-brand-400/26" aria-hidden="true" />
      <div className="orb -bottom-12 -left-10 h-56 w-56 bg-indigo-500/20" aria-hidden="true" />

      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate('/itinerary', { state: { itinerary: data } })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('/itinerary', { state: { itinerary: data } });
          }
        }}
        aria-label={`View the full example itinerary for ${example.label}`}
        className="card-gradient relative block w-full animate-fade-up cursor-pointer overflow-hidden rounded-xl p-5 text-left shadow-[0_30px_60px_-15px_rgba(10,31,20,0.32)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] sm:p-6"
        style={{ animationDelay: '280ms' }}
      >
        <div key={index} className="animate-fade-in">
          {/* Window chrome */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <IconBadge icon={MapPin} accent={example.accent} size="sm" />
              <div>
                <p className="text-h3 leading-tight text-ink">{example.label}</p>
                <p className="caption-meta mt-0.5">{data.days} days · ${data.budget?.toLocaleString()}</p>
              </div>
            </div>
            <span className="pill border-brand-500/20 bg-brand-500/10 text-brand-700">
              <span className="status-dot bg-brand-500" aria-hidden="true" />
              AI Generated
            </span>
          </div>

          {/* Day 1 timeline */}
          {day1 && (
            <div className="card-sunken rounded-md p-4">
              <div className="mb-3.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-tiny font-semibold text-ink">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-xs bg-grad-brand text-[0.625rem] font-bold text-white">
                    1
                  </span>
                  {day1.title}
                </span>
                <span className="data-num text-caption text-ink-muted">EST. ${day1.estimatedCost}</span>
              </div>

              <ul className="space-y-3">
                {TIME_SLOTS.map(({ part, key, icon: Icon, tint }, i) => (
                  <li
                    key={part}
                    className="flex animate-fade-up gap-2.5"
                    style={{ animationDelay: `${420 + i * 110}ms` }}
                  >
                    <IconBadge icon={Icon} accent={tint} variant="tint" size="xs" lift={false} />
                    <div className="min-w-0 flex-1">
                      <p className="text-caption uppercase text-ink-muted">{part}</p>
                      <p className="mt-0.5 text-tiny leading-relaxed text-ink-soft line-clamp-2">{day1[key]}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Retrieval provenance — the RAG proof, shown not told */}
          <div className="mt-4 flex items-center gap-2 rounded-md border border-indigo-500/16 bg-indigo-500/[0.055] px-3 py-2.5">
            <Database className="h-3.5 w-3.5 shrink-0 text-indigo-600" aria-hidden="true" />
            <p className="text-caption leading-snug text-ink-soft">
              Grounded in <span className="font-semibold text-indigo-700">{data.retrievedSources} retrieved passage{data.retrievedSources === 1 ? '' : 's'}</span> from
              {' '}<span className="font-mono text-[0.6875rem]">{example.key}-guide.txt</span>
            </p>
          </div>
        </div>

        {/* Rotation indicator — small, quiet, tells you this card is alive */}
        <div className="mt-4 flex items-center justify-center gap-1.5" aria-hidden="true">
          {EXAMPLE_ITINERARIES.map((e, i) => (
            <span
              key={e.key}
              className={`h-1.5 rounded-pill transition-all duration-slow ${i === index ? 'w-5 bg-brand-500' : 'w-1.5 bg-ink-faint/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Floating feature badges — depth cue around the card. Anchored to the
          card's outer corners so they straddle the edge without landing on
          body copy. The float animation is decorative; the badges stay visible. */}
      <div className="absolute -left-7 -top-4 hidden animate-float xl:block">
        <div className="glass flex items-center gap-2 rounded-pill px-3 py-2 shadow-lg">
          <ImagePlus className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
          <span className="text-caption font-semibold text-ink">Photo → Itinerary</span>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-7 hidden animate-float-slow xl:block">
        <div className="glass flex items-center gap-2 rounded-pill px-3 py-2 shadow-lg">
          <Wallet className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
          <span className="text-caption font-semibold text-ink">Budget aware</span>
        </div>
      </div>
    </div>
  );
};

/* ── Page ────────────────────────────────────────────────────────────── */

const HomePage = () => {
  const navigate = useNavigate();
  const openExample = (example) => navigate('/itinerary', { state: { itinerary: example.data } });

  return (
    <div className="overflow-x-clip">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative isolate overflow-hidden bg-mesh">
        <HeroBackdrop />
        <div className="absolute inset-0 bg-grid" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:pb-28 lg:pt-24">
          <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-6 xl:gap-10">

            {/* ── Copy column ──
                Above-the-fold content animates via CSS, not JS. A hero that
                needs JavaScript to become visible is a hero that renders blank
                whenever rAF is throttled or a script fails.

                Sits on a solid frosted panel rather than raw ink-on-photo —
                the backdrop photo crossfades through very different scenes
                (bright sky, dark stone, neon skyline), so text color alone
                can never guarantee contrast against all of them. A panel
                with a fixed, near-opaque surface color does.

                Capped at max-w-xl and left-aligned in its own column (not
                stretched full-width) so the photo stays visible in the
                margin around it — two distinct floating panels over one
                backdrop, not a single two-column slab with a seam down the
                middle. The slight counter-rotation vs. the preview card
                (see below) reinforces the "two separate things" reading. */}
            <div className="mx-auto max-w-xl rounded-3xl border border-line/70 bg-surface/92 px-6 py-8 text-center shadow-[0_30px_60px_-15px_rgba(10,31,20,0.32)] backdrop-blur-md dark:bg-surface/94 dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.55)] sm:px-9 sm:py-10 lg:mx-0 lg:-rotate-[0.6deg] lg:px-10 lg:text-left">
              <div className="inline-flex animate-fade-up items-center gap-2 rounded-pill border border-brand-500/18 bg-surface/70 py-1.5 pl-1.5 pr-3.5 shadow-xs backdrop-blur dark:bg-surface/90">
                <span className="inline-flex items-center gap-1 rounded-pill bg-grad-brand px-2 py-0.5 text-caption font-bold text-white">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  RAG
                </span>
                <span className="text-caption font-semibold text-ink-soft">
                  Hybrid retrieval + cross-encoder reranking
                </span>
              </div>

              <h1
                className="mt-6 animate-fade-up text-hero text-ink text-balance"
                style={{ animationDelay: '80ms' }}
              >
                Travel plans that<br className="hidden sm:block" />{' '}
                <span className="text-gradient-vivid">cite their sources</span>
              </h1>

              <p
                className="mx-auto mt-5 max-w-xl animate-fade-up text-lead text-ink-soft lg:mx-0"
                style={{ animationDelay: '160ms' }}
              >
                Most AI planners guess. TripGenie retrieves real passages from real
                destination guides, reranks them for relevance, then writes a
                day-by-day itinerary that fits your budget — and shows you what it read.
              </p>

              <div
                className="mt-8 flex animate-fade-up flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
                style={{ animationDelay: '240ms' }}
              >
                <a href="#plan" className="btn-primary btn-lg">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Plan my trip — free
                  <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                </a>
                <Link to="/chat" className="btn-secondary btn-lg">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Ask the assistant
                </Link>
              </div>

              {/* Trust indicators */}
              <div
                className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-x-5 gap-y-2.5 lg:justify-start"
                style={{ animationDelay: '330ms' }}
              >
                {[
                  { icon: CheckCircle2, text: 'No signup required' },
                  { icon: ShieldCheck,  text: 'Local embeddings' },
                  { icon: Zap,          text: 'Under 60s' },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="inline-flex items-center gap-1.5 text-caption font-medium text-ink-muted">
                    <Icon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Visual column ──
                Offset lower and counter-tilted vs. the copy panel, capped to
                its own width instead of stretching the column — reads as a
                second card someone dropped onto the photo, not the other
                half of a matched pair. */}
            <div className="relative mx-auto max-w-[430px] lg:mx-0 lg:ml-auto lg:mt-16 lg:rotate-1">
              <HeroPreview />
            </div>
          </div>
        </div>

        {/* Stat strip — seals the hero, bridges into the next band */}
        <div className="relative border-y border-line bg-surface/55 backdrop-blur-sm">
          <div className="mx-auto max-w-shell px-5 sm:px-8">
            <Stagger className="grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x" gap={0.07}>
              {TRUST_STATS.map((s) => (
                <StaggerItem key={s.label} className="px-2 py-6 text-center md:px-6 md:py-7">
                  <p className="stat-num">{s.value}</p>
                  <p className="mt-1.5 text-caption uppercase leading-snug text-ink-muted">{s.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ═══════════════ EXAMPLE GALLERY ═══════════════ */}
      <section className="relative overflow-hidden bg-mesh-soft py-20 sm:py-24">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionHeading
            eyebrow="Try it now"
            eyebrowIcon={Compass}
            title="See real output before you plan your own"
            lead="Three itineraries generated for real by the pipeline above — hybrid retrieval, reranking, and live-geocoded routes. Click straight through, no form required."
            className="mb-12"
          />

          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {EXAMPLE_ITINERARIES.map((example) => {
              const rail = {
                brand: 'bg-grad-brand', rose: 'bg-grad-rose', teal: 'bg-grad-teal',
              }[example.accent];
              const day1 = example.data.itinerary?.[0];
              return (
                <StaggerItem key={example.key}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openExample(example)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openExample(example);
                      }
                    }}
                    aria-label={`View example itinerary for ${example.label}`}
                    className="card card-hover group relative flex h-full cursor-pointer flex-col overflow-hidden p-6"
                  >
                    <span className={`absolute inset-x-0 top-0 h-[3px] ${rail}`} aria-hidden="true" />

                    <div className="flex items-start justify-between gap-3">
                      <IconBadge icon={MapPin} accent={example.accent} size="md" />
                      <span className="pill">
                        <span className="data-num font-semibold">{example.data.days}</span> days
                      </span>
                    </div>

                    <h3 className="mt-4 text-h2 text-ink">{example.label}</h3>
                    <p className="mt-1.5 text-small text-ink-soft line-clamp-2">{example.data.summary}</p>

                    {day1 && (
                      <div className="mt-4 rounded-md border border-line bg-surface-sunken p-3.5">
                        <p className="text-caption font-bold uppercase tracking-wide text-ink-muted">
                          Day 1 · {day1.title}
                        </p>
                        <p className="mt-1 text-tiny leading-relaxed text-ink-soft line-clamp-2">
                          {day1.morning}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="text-caption text-ink-faint">Pre-generated example</span>
                      <span className="inline-flex items-center gap-1 text-tiny font-semibold text-brand-700">
                        View example
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-base group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════ PLAN FORM ═══════════════ */}
      <section id="plan" className="relative scroll-mt-24 bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionHeading
            eyebrow="Start here"
            eyebrowIcon={Sparkles}
            title="Tell us where you're going"
            lead="Four fields, or upload a photo and let the vision model work out the destination for you."
            className="mb-12"
          />
          <Reveal direction="up" delay={0.08}>
            <TripForm />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS — TIMELINE ═══════════════ */}
      <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden bg-ink-deep bg-noise py-20 text-white sm:py-24">
        <div className="orb -left-20 top-10 h-80 w-80 bg-brand-500/16" aria-hidden="true" />
        <div className="orb -right-20 bottom-10 h-80 w-80 bg-indigo-500/14" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell px-5 sm:px-8">
          <div className="mb-14 flex flex-col items-center gap-4 text-center">
            <Reveal>
              <span className="eyebrow rounded-pill border border-white/14 bg-white/[0.07] px-3 py-1.5 text-white/72">
                <Database className="h-3.5 w-3.5" aria-hidden="true" />
                The pipeline
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-display text-white text-balance">Four stages, no magic</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-2xl text-lead text-white/58">
                This is the whole retrieval-augmented generation flow — the same one
                you could walk an interviewer through, line by line.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5" gap={0.1}>
            {HOW_STEPS.map((step, i) => (
              <StaggerItem key={step.n}>
                <div className="group relative h-full rounded-lg border border-white/10 bg-white/[0.045] p-6 transition-all duration-slow hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.075]">
                  {/* Connector line between steps on desktop */}
                  {i < HOW_STEPS.length - 1 && (
                    <span
                      className="absolute -right-2.5 top-11 hidden h-px w-5 bg-gradient-to-r from-white/22 to-transparent lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <IconBadge icon={step.icon} accent={step.accent} size="md" />
                    <span className="font-mono text-[0.6875rem] font-medium text-white/28">{step.n}</span>
                  </div>
                  <h3 className="mt-5 text-h3 text-white">{step.title}</h3>
                  <p className="mt-2 text-small leading-relaxed text-white/58">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="relative bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <Reveal direction="up">
            <div className="relative overflow-hidden rounded-2xl bg-grad-ink bg-noise px-7 py-14 text-center sm:px-14 sm:py-18">
              <div className="orb -left-12 -top-12 h-64 w-64 bg-brand-500/24" aria-hidden="true" />
              <div className="orb -bottom-16 -right-10 h-64 w-64 bg-violet-500/20" aria-hidden="true" />

              <div className="relative mx-auto max-w-2xl">
                <span className="eyebrow rounded-pill border border-white/14 bg-white/[0.07] px-3 py-1.5 text-white/72">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Free · No signup
                </span>
                <h2 className="mt-6 text-display text-white text-balance">
                  Your next trip, grounded in real sources
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lead text-white/60">
                  Pick a destination, set a budget, and watch the retrieval pipeline
                  build something specific enough to actually use.
                </p>
                <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                  <a href="#plan" className="btn-primary btn-lg">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Build my itinerary
                    <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                  </a>
                  <Link to="/chat" className="btn-glass btn-lg">
                    Try the assistant
                    <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
