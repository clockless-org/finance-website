# Maya Sterling — Design Brief

> **CLO-50 redirect.** The previous version of this doc declared the Ray
> palette/typography "good enough" for Finance. Chairman rejected that:
> Finance must have its own design language, not Ray-with-new-copy. This
> brief replaces the inherited Ray visual kit with a distinct Finance
> identity, end-to-end.

## North star — "The Quarterly Letter"

The visual language of a printed advisor communiqué — **Bessemer Trust /
Brown Brothers Harriman / Berkshire annual letter**, transposed to web.

- **Authority over warmth.** Editorial serif headlines, not invitation
  serif. This is a fiduciary who manages your retirement money, not a
  realtor who hosts your open house.
- **Numbers as imagery.** Tabular monospaced figures are first-class
  visual citizens. Allocation rings, vesting horizons, plan ledgers
  replace stock photography and gradient blocks.
- **Hairlines, not cards.** Sections are separated by 1px graphite
  rules. No box-shadows. No bouncy radii. Sharp corners signal
  considered work.
- **Dated and signed.** Every page footer reads like a printed circular
  — `Sterling Wealth Advisors LLC · SEC RIA #312587 · Letter dated April 2026.`

Aesthetic in one line:
> _Quiet, considered, ink-on-paper. Numbers do the talking._

## How this differs from CLO-48 Accounting "Ledger Edition"

CLO-48 (Accounting) and CLO-50 (Finance) are adjacent professional
services. Both got an editorial-serif + tabular-mono + ink-on-paper
direction, in the same broad family. Calling that out so chairman can
validate the adjacency or push back.

| Axis | Accounting (CLO-48) | Finance (CLO-50) |
|---|---|---|
| Working metaphor | CPA's working journal — IRS notice, ledger entry, audit stamp | Advisor's quarterly letter — Bessemer / BBH / Berkshire annual circular |
| Palette story | Multi-stamp: oxblood audit red + accountant green + ochre seal on cool ledger paper | Bicolor letter ink: indigo bond + oxidized copper on warm paper |
| Display face | Newsreader (broad, news-y, masthead serif) | Source Serif 4 (narrow, book-y, academic serif) |
| Layout DNA | Columnar — `DATE | REF | STAGE | STATUS` general-ledger tables | Editorial — left-weighted hero with mono stat insert; "brief" cards in vertical stack |
| Tone | Doer's aesthetic — "audit, due, stamp, file" | Planner's aesthetic — "letter, brief, plan, considered" |
| Signature visual | Front-page masthead + IRS-notice action block + 12-month tax calendar grid | Concentration horizon ribbon + plan ledger column + memo chat |
| Action affordance | IRS-notice rectangle with double-rule + uppercase `REQUIRED ACTION` header in mono | Inline mono stat under a serif headline; copper underline on `→` link |
| Color of in-progress | Oxblood audit red `#7a1a1f` (urgency) | Oxidized copper `#9A4B2D` (signature ink) |

Same DNA family (editorial print), but two different print products —
The Wall Street Journal vs The Economist. If chairman feels they read
too similar in execution, the Finance fallback direction is **"Iconiq
Private"** — wider gutters, oversized Söhne or Söhne Breit display,
near-black palette with one ultra-restrained gold-leaf accent, no
serif, all sans. Different DNA family entirely (modernist private bank
rather than printed-letter advisor). Documented at the bottom of this
brief as the alternative if the Quarterly Letter direction is too close
to Accounting's Ledger Edition.

## What this replaces and why

| Inherited from Ray | Why it's wrong for Finance | Replaced by |
|---|---|---|
| Cream `#f7f2eb` + forest-green `#1d3a30` + bronze `#b58a5d` | Warm hospitality palette — reads "Peninsula realtor / boutique inn." Identical to ten other industry sites. | Paper `#FAFAF7` + Ink `#0E1116` + Indigo Bond `#1B2A4A` + Oxidized Copper `#9A4B2D` |
| Cormorant Garamond | Invitation serif — wedding stationery, hospitality, salons. Signals indulgence, not authority. | Source Serif 4 — editorial serif (academic press, business journalism). Signals decisions that age well. |
| Manrope | DTC-startup geometric sans. Reads "approachable consumer brand." | Inter — the default of fintech (Stripe, Linear, every modern finance product). Pairs with tabular figures. |
| (no monospace) | Numbers were rendered in body sans — same visual weight as adjectives. | IBM Plex Mono — for all stats, fees, dates, allocations. Numbers visually outrank prose. |
| Gradient monogram blocks | Stand-in for stock photos. Reads "we couldn't find the right photo." | No portrait substitutes at all. Data renderings (allocation rings, vesting horizons) are the imagery. |
| Card grid + box-shadows + 1.25rem radii | Cozy realtor-listing aesthetic. | Hairline grid + 1px graphite rules + 0–2px radii. |
| Bouncy hover transforms | Reads "consumer SaaS." | Opacity / underline / hairline-color shifts. No scale, no spring. |

## Color system

Drop the entire Ray token set. Replace `:root` in `public/site.css`:

```css
:root {
  /* Surfaces */
  --paper:        #FAFAF7;  /* warm-tinted near-white — the page */
  --paper-deep:   #F1EFE9;  /* alternate band, used sparingly */
  --vellum:       #FFFFFF;  /* pure white, only inside data containers */

  /* Ink */
  --ink:          #0E1116;  /* near-black with a hint of green */
  --ink-soft:     #2A2E33;  /* subdued body */
  --ink-quiet:    #6B6F75;  /* secondary / metadata */
  --hairline:     #D5D2CB;  /* 1px graphite rules */

  /* Marks (used sparingly — scarcity is the value) */
  --bond:         #1B2A4A;  /* primary deep — CTA fills, structural blocks */
  --bond-soft:    #243660;  /* hover variant */
  --copper:       #9A4B2D;  /* single warm accent — active markers, signature underlines, in-progress states ONLY */
  --teal-quiet:   #2E4F4A;  /* portal data fills only — not used on landing */

  /* Type */
  --serif: "Source Serif 4", "Source Serif Pro", Georgia, serif;
  --sans:  "Inter", "Helvetica Neue", Arial, sans-serif;
  --mono:  "IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace;
}
```

**Rules of use:**
- `--copper` is rare. Only: in-progress journey marker, active nav link
  underline, the `→` link arrow, the chat-bubble corner mark. Never as a
  CTA fill (CTA fills use `--bond`).
- `--bond` is the primary CTA, deep section bands, and footer. Replaces
  every appearance of `--green` from Ray.
- No `--peach`, no `--mint`, no `--gold`. Delete those tokens entirely.
- All numerals (stats, fees, dates, %s) render with
  `font-variant-numeric: tabular-nums`. Numbers ≥ 4 chars or aligned in
  columns use `--mono`.

## Typography

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
/>
```

Drop the existing Cormorant + Manrope import.

| Role | Family | Weight | Size scale (desktop) | Notes |
|---|---|---|---|---|
| Display H1 | Source Serif 4 | 600 | 56–80px | Editorial gravitas. Tight tracking (-0.02em). Leading 1.05. |
| Display H2 | Source Serif 4 | 600 | 36–48px | Section heads. |
| H3 | Source Serif 4 | 500 | 22–26px | Card / brief titles. |
| Eyebrow | IBM Plex Mono | 500 | 12px, uppercase, +0.12em tracking | Section index, dateline. |
| Body lead | Inter | 400 | 18–20px | First paragraph after a head. Leading 1.55. |
| Body | Inter | 400 | 16px | Default. Leading 1.6. |
| Stat block | IBM Plex Mono | 500 | 40–72px | The *visual hero* of any section that has a number. Tabular nums. |
| Inline number | IBM Plex Mono | 500 | inherit | Any number ≥ 4 chars or aligned in a column. |
| Caption / disclosure | Inter | 400 | 12px | Footnotes, disclosures, footer. Tracked +0.02em. |
| Signature | Source Serif 4 italic | 400 | 16px | "— Maya Sterling, CFP®" line. |

Typography rules:
- All section heads use `eyebrow + serif headline + 96px hairline ruler`
  pattern. Looks like a chapter mark.
- Lead paragraphs are 18–20px, leading 1.55. Body is 16px, leading 1.6.
  More breathing room than Ray's 1.45.
- A single ruler (`width: 96px; height: 1px; background: var(--copper)`)
  appears under H1 / H2 / signatures. This is the only decorative
  element on the page.
- No all-caps body text. Eyebrow/labels only.

## Layout rules

1. **Hairline grid, not card grid.** Replace every box-shadowed card with
   a section bordered by `border-top: 1px solid var(--hairline)` and
   generous vertical rhythm (88px desktop, 56px tablet, 40px mobile
   between sections).
2. **Sharp corners.** `border-radius: 0` on every container. Two
   exceptions: chat affordance (8px square) and avatar marks (50% circle
   for the team list only). Form inputs use 0 radius — they look like
   ledger fields.
3. **Asymmetric editorial layouts.** Hero is left-weighted: text in cols
   1–7, blank space + a single hairline + a single stat block in cols
   9–12. Never centered. Never image-right.
4. **Two-rail body for dense pages.** `/about/` and `/services/` use a
   two-rail layout: 8-col primary content, 4-col sticky margin notes
   (advisor quotes, footnotes, disclosures rendered in caption type).
   Tufte / academic-textbook density.
5. **Tabular figures everywhere.** Add `font-variant-numeric: tabular-nums`
   to `body` globally. Numbers in columns or stat blocks use `--mono`.
6. **Spacing scale.** 4px base. Vertical rhythm: `[8, 12, 16, 24, 32, 48, 64, 88, 128]`.
   Horizontal page gutter: 64px desktop, 32px tablet, 20px mobile.

## Imagery rules

Three rules, no exceptions:

1. **Zero photographs.** No stock photos. No portrait of Maya. No
   "lifestyle" hero shots. The Ray template's stock photos are gone;
   we don't replace them with anything image-shaped.
2. **No gradient monogram blocks.** Drop `.portrait-arch--maya`,
   `.team-member__avatar--*` gradient backdrops, `.service-art--*`
   gradient blocks. These were placeholders for photos and they read
   like placeholders. Replace with data renderings or with whitespace.
3. **Data IS the imagery.** When a section needs a visual, render data:
   - **Allocation ring** — single SVG ring, single color (`--bond`),
     hairline center, % rendered in mono in the middle.
   - **Concentration horizon** — 12-quarter ribbon showing employer-stock
     concentration drift. Single color (`--copper`). One per landing page.
   - **Vesting timeline** — RSU/ISO schedule as a horizontal bar with
     mono date stamps.
   - **Plan progress ledger** — vertical column of stages with mono
     dates left, serif titles middle, single-letter status right.

Where Maya needs a "face" (top-left nav, signature line):
- Render a **monogram mark**: `MS` in IBM Plex Mono 500, color `--ink`,
  no background fill. Optionally a 1px `--ink` box around it. That's it.
- Same treatment for team-list avatars: initials in `--mono`, color
  `--ink`, on `--paper` background, optional 1px box. No discs, no
  gradients.

Where the existing template uses a hero illustration / spot art (e.g.,
empty states, services band): use **single-color line drawings** in
`--ink`, max 2 line weights, hand-drawn-feel. Inspiration: NYT business
section spot illustrations, Bessemer Trust quarterly letter spots.
*Don't generate these in this round* — leave the slot empty (whitespace
is fine) and ship line-art in a follow-up if Kelvin wants it.

## Motion rules

| Property | Value | Notes |
|---|---|---|
| Default duration | 240ms | Slower than Ray's ~180ms. Considered, not snappy. |
| Default easing | `cubic-bezier(0.2, 0, 0.1, 1)` | Weighted decel. No bounce, no spring. |
| Hover treatment | Opacity / hairline color shift / underline reveal | No `scale()`, no `transform`. |
| Stat reveal | `count-up` from 0 over 800ms on scroll-into-view | Adds gravitas. Use `IntersectionObserver` + `requestAnimationFrame`. |
| Chat open | Opacity 0→1 + Y-offset `-4px → 0`, 320ms | Replace the existing scale/pop. Reads as "memo unfolding." |
| Section enter | None on landing. Portal: ledger rows fade in 80ms staggered when tab activates. | |

`prefers-reduced-motion: reduce` → all durations to 0ms, count-up shows
final value immediately.

## Portal visual language

The portal is the demo's most-screenshotted screen. It must feel like
a financial communiqué, not a realtor's CRM. Per-tab spec:

### Journey → "Plan ledger"

Vertical single-column ledger. Each stage = one row, hairline rules
between. Row anatomy:

```
[mono date stamp · 88px col]  [serif title + 12px caption subtext]  [single-glyph status · 24px col]
   2025-09-12                 Discovery — initial intake             ✓
   2026-04-15                 Implementation — RSU 10b5-1 plan       ●  ← --copper
   2026-07-01                 Q2 plan window                         ─
```

- Completed: title in `--ink`, status `✓` in `--ink-quiet`, slight
  strikethrough on the date is OK.
- In-progress: title in `--ink`, status `●` in `--copper`, the entire
  row gets a 2px left border in `--copper`.
- Future: title in `--ink-quiet`, status `─` in `--ink-quiet`.

No cards, no chevrons, no progress percentage bars. The ledger IS the
progress indicator.

### Holdings → "Position blotter"

Top: a single-color **concentration horizon** chart (12 quarters of
%-employer-stock drift, `--copper` fill, hairline axis). Below: a tight
data table with hairline rows. Columns: `Symbol (mono) | Position (serif) | Value (mono right-align) | %NW (mono right-align + inline bar in --copper)`.
No card backgrounds. No alternating row stripes (use hairlines instead).

### Strategy → "Brief cards" — replace with single-column briefs

Each strategy card becomes a **brief**. Stack vertically, hairline
between. Anatomy:

```
[mono dateline · "Brief 03 · April 2026"]
[Source Serif H3] Concentration risk plan
[mono stat] 54% → 22% over 18 months
[Inter body, 80–100 words]
[italic signature] — Maya Sterling, CFP®
```

Reads like an excerpt from a quarterly letter. This is the brand spine.

### Schedule → "Calendar of letters" (list, not grid)

No month grid. List rows: `[mono date | serif event title | mono type chip]`.
Type chips: `Plan window` in `--copper`, `Review` in `--ink-quiet`,
`Tax milestone` in `--bond`. Hairline rows.

### Fees → "Fee summary statement"

Looks like an actual quarterly statement, not a SaaS billing page:

```
SUMMARY · Q1 2026                                    Period: Jan 1 – Mar 31, 2026
─────────────────────────────────────────────────────────────────────────────
Assets under advisement (avg)                                      $2,000,000
Fee basis                                                                 0.85% AUM (annualized)
Fee earned this period                                                  $4,250
Fee payment                                                            -$4,250
─────────────────────────────────────────────────────────────────────────────
Balance forward                                                            $0
```

Mono numerals, hairline rules, right-aligned. Disclosure footer in
caption type.

### Documents → "File room"

One row per document. No card. Anatomy:
`[mono pages "07p"] [serif title] [mono filed-date] [mono revision "rev 3"] [→ link]`.
Hairline rows. Hover: `--copper` underline on title only.

### Messages → "Memo thread"

Messages render as **memos**, not chat bubbles. Each message:

```
[mono dateline] APR 24 · 2:14 PM PT — from Maya Sterling
[serif first paragraph, 18px, leading 1.55, first-line indent 24px]

[Inter body, 16px]
```

No bubble shapes. No avatar discs in-thread. The dateline + sender mark
does the work. Outbound (from Daniel) gets a 2px `--bond` left border
to differentiate. Inbound (from Maya) gets a 2px `--copper` left border.

### Floating chat → "Note from Maya"

- Trigger: an 8px-radius **black square** (32px), with a single `MS`
  glyph in `--mono` 500, white. Replaces the round green bubble.
- Bottom-right anchor unchanged.
- When opened, panel header reads `Note from Maya · Drafted 2:14 PM PT`
  in mono caption + serif name. Input prompt: `Ask Maya — she'll reply or schedule time.`
- Open animation: opacity 0→1 + Y `-4px → 0`, 320ms. No scale.
- The existing canned-reply structure stays; only visual chrome changes.

## Signature moments — the proof gallery

These five screens, viewed alongside Ray, must instantly say "different
species." Linus should screenshot each after build for the handoff comment.

1. **Landing hero.** Left-weighted serif H1 + a single `54%` mono
   stat that count-ups + a 96px copper ruler + a `→` link. Whitespace
   in cols 9–12. **No image.**
2. **Plan ledger** (portal Journey). The 9-stage vertical ledger. This
   one screen alone proves it.
3. **Quarterly brief.** Either Strategy tab or a `/services/` section,
   styled as a printed circular: dateline, headline, mono stat, body,
   italic signature.
4. **Concentration horizon.** Single-color 12-quarter ribbon, used
   both on landing (as a quiet section visual) and inside Holdings.
5. **Memo chat.** The floating note panel open, showing one memo from
   Maya rendered as correspondence — dateline + serif first paragraph
   + signature.

## Removal checklist (what dies)

In `public/site.css` and `src/portal/portal.css` + `src/portal/dashboard.css`:

- `--bg`, `--bg-strong`, `--surface-soft`, `--surface-pale`, `--green`,
  `--green-soft`, `--green-muted`, `--gold`, `--peach`, `--mint` —
  delete every token and every reference. Run a grep, replace with the
  new tokens.
- All `box-shadow:` declarations on cards, panels, hero blocks, chat
  bubble. Keep box-shadow only on the floating chat trigger (a small
  8px shadow for affordance).
- All `border-radius:` values ≥ 8px. Drop to 0. Two exceptions: chat
  trigger (8px square), team-list avatar circles (50%).
- `.portrait-arch--maya` background gradient. Replace with: blank
  paper + monogram mark (mono `MS` in `--ink`).
- `.team-member__avatar--{maya|priya|james|sarah|david}` gradient
  background. Replace with: `--paper` background, mono initials in
  `--ink`, optional 1px `--hairline` box.
- `.service-art--{purchase|selling|investment}` gradient blocks.
  Delete. Either render a tiny line illustration (deferred — leave
  whitespace) or a small allocation ring SVG.
- The `.site-chat__bubble` round green disk. Replace with the black
  square + mono MS treatment.
- Cormorant Garamond + Manrope `<link>` import. Replace with the
  Source Serif 4 + Inter + IBM Plex Mono import in this brief.
- Any `text-transform: uppercase` outside of eyebrow/label spec.
- Any `transform: scale(...)` on hover.

## Keep list (what's right and stays)

- The **information architecture**: 5 marketing pages + 7 portal tabs.
- **Persona content**: Maya Sterling, Daniel & Mira Park, the 9-stage
  journey, the SEC RIA #312587 fictional registration. Content is
  finance-correct; only the vessel changes.
- **Bilingual EN/ZH** rendering pipeline in `public/site.js`.
- **React 19 + Vite portal SPA** structure (`src/portal/{App,Dashboard,ChatBubble,api,main}.tsx`).
- Internal tab IDs (`stages | holdings | strategy | appointments | fees | documents | messages`) — already correctly de-realtor'd.
- The `getStageDisplayLabel` etc. dictionary work from CLO-35/36.
- Footer disclosure language (legal-correct, do not touch).

## File-by-file change map

For Linus. Order matches what I'd touch first:

| File | Change |
|---|---|
| `index.html` (head) | Replace Google Fonts import. Replace any `<meta theme-color>` to `--paper` value. |
| `about/index.html`, `services/index.html`, `testimonials/index.html`, `contact/index.html` (head) | Same font import replacement. |
| `public/site.css` | Rewrite `:root` token set. Delete Ray tokens. Restyle: `.site-hero`, `.stats-band`, `.meet-advisor`, `.services-grid`, `.testimonials-band`, `.cta-band`, `.contact-form`, `.team-grid`, `.footer`. Apply hairline-grid + 0-radius + serif heads + mono stats. |
| `public/site.css` (`.site-chat__bubble`, `.site-chat__panel`) | Replace bubble visual: round green disk → 8px black square with mono `MS`. Restyle panel header to `Note from Maya · Drafted Xtimestamp` pattern. |
| `public/site.js` | Update `--peach` / `--mint` color references in any inline SVGs / gradients. Update chat canned-reply formatting if it currently injects bubble-shaped HTML. Memo formatting: dateline + indented first paragraph. |
| `src/portal/portal.css` | Same token rewrite. Tab nav: drop pill-shaped buttons, replace with mono uppercase eyebrow + 2px `--copper` underline on active. |
| `src/portal/dashboard.css` | Heaviest change. Per-tab restyle to brief specs above. Drop card backgrounds + box-shadows. Replace with hairline rules. Add SVG horizon chart styles. Restyle stat blocks to `--mono` 40–72px. |
| `src/portal/Dashboard.tsx` | If any layout markup hard-codes "card" structures with grid + radius, restructure to single-column list with hairline rules. Add `<svg>` allocation-ring + concentration-horizon components. Add `count-up` hook for stats. |
| `src/portal/ChatBubble.tsx` | Restyle trigger element. Restyle thread to memo format (dateline + indented first paragraph + side border by sender). Replace bubble pop animation with opacity+Y transition. |
| (new) `src/portal/components/Ledger.tsx` | Reusable ledger row primitive used by Journey + Documents + Schedule + Fees. Props: `dateLeft, titleMid, statusRight, state: "done" | "active" | "future"`. |
| (new) `src/portal/components/Stat.tsx` | Reusable mono stat block. Props: `value, suffix, label, countUp?`. |
| (new) `src/portal/components/HorizonChart.tsx` | Single-color SVG horizon chart. Used on landing AND in Holdings. |
| `PRD.md`, `README.md` | Update visual-direction prose to match this brief. |

## Acceptance — how this gets verified

When Linus pushes, the redesign is "done" when **all six** are true:

1. **Side-by-side comparison.** Open ray.clockless.ai and finance.clockless.ai
   in two browser windows. They look like products from two different
   firms. (Concrete: different palette, different display typeface,
   different layout rhythm, different portal screen aesthetic. Not
   "two color palettes of the same template.")
2. **No Ray-token residue.** `grep -E '(--bg|--bg-strong|--green|--gold|--peach|--mint)' src public` returns 0 hits. `grep -i 'cormorant\|manrope' src public index.html` returns 0 hits.
3. **Numbers are first-class visual citizens.** Every stat ≥ 4 chars
   on landing renders in `--mono`. Every numeric column in the portal
   uses `tabular-nums`.
4. **Hairlines, not cards.** No `box-shadow` on content blocks (chat
   trigger only). All `border-radius` values ≤ 2px except chat trigger
   (8px) and team-list avatars (50%).
5. **The five signature moments render correctly.** Landing hero,
   plan ledger, quarterly brief, concentration horizon, memo chat —
   all visible and matching this spec.
6. **Build clean + routes 200.** `npm run build` succeeds, `/`,
   `/about/`, `/services/`, `/testimonials/`, `/contact/`, `/portal/`
   all return 200.

Linus does (1)–(4) self-check before flipping the issue to `in_review`.
Turing then verifies (5)–(6) mechanically + makes the visual
differentiation call. If Turing thinks the visual gap is still small
("looks like Ray with palette-swap"), reject and bounce back.

## Out of scope this round

- Hand-drawn line illustrations for empty states (defer to follow-up).
- Real custodian / brokerage data integrations (still demo data).
- DNS / Cloudflare Pages provisioning (operator handoff).
- A redesign of `ray-website` or other industry sites — they keep their
  current shared template until each gets its own brief.

## Fallback direction — "Iconiq Private" (only if "Quarterly Letter" reads too close to CLO-48)

Use this only if chairman feels the Quarterly Letter direction sits in
the same DNA family as CLO-48's Ledger Edition. Documented as a backup,
not a recommendation.

Reframe Finance away from "printed-letter advisor" and toward
"modernist private bank":

- **Palette** — pure paper `#FFFFFF` + near-black `#0A0A0A` + a single
  ultra-restrained gold-leaf accent `#A87E36` (used at ≤ 4% surface
  coverage). No serif palette; no copper. Drops the "warm paper"
  warmth entirely.
- **Typography** — Söhne (paid; or **Inter Display** as free
  substitute) for ALL headlines and body. **No serif anywhere.** Mono
  stays IBM Plex Mono for figures.
- **Layout** — much wider gutters (96–128px desktop), oversize
  display type (96–144px H1), generous full-bleed black sections that
  hold a single sentence in 32px white serif-italic, single column —
  no two-rail academic layout.
- **Imagery** — no data renderings on landing (those move to portal
  only). Marketing pages lean on **typographic posters**: a single
  oversized stat or quote per fold, set in Söhne 96px+ on
  edge-to-edge black. Reads as Iconiq / Bessemer landing pages from
  ~2023–2026.
- **Portal** — keeps the ledger / blotter / brief / statement
  vocabulary, but in white sans on black. No serif. No copper. The
  floating chat is a thin black bar at the bottom edge, not a square
  badge.
- **Tone** — fewer words, larger type, more confident silence. Chairman
  hint "intelligent restraint" leans even further.

Why this is filed as fallback rather than first choice: the
chairman's hint mentions "**refined wealth atelier**" and
"**understated**" — both pull toward an editorial-print register more
than a modernist-private-bank register. So Quarterly Letter is the
better read of the prompt. But if Accounting + Finance side-by-side
read as siblings, Iconiq Private is the cleanest exit.
