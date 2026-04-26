# finance-website

Financial-advisory industry demo for **Maya Sterling, CFP®**, a fictional
fee-only fiduciary advisor on the SF Peninsula. This is the Finance vertical
of the Clockless concierge-advisor template.

Originally built on the `ray-website` template (CLO-38), then rebuilt
end-to-end against a Finance-specific visual direction in CLO-50 / CLO-71
("The Quarterly Letter" — Bessemer / BBH / Berkshire annual letter,
transposed to web). The information architecture and routing structure
stayed; the visual vessel is now its own thing.

- Persona: Maya Sterling (CFP®, Series 65, SEC RIA via Sterling Wealth
  Advisors LLC, CRD #312587). Fictional.
- Demo client: Daniel & Mira Park — recent IPO, single-stock concentration,
  two kids, planning for retirement and college funding.
- Public, login-less client portal walking through Daniel & Mira's
  9-stage planning engagement (Discovery → Inventory → Risk Profile →
  Plan Drafting → First Window → Final Plan → Implementation → Q2 Window →
  Ongoing Reviews).

Deployed to [finance.clockless.ai](https://finance.clockless.ai) via
Cloudflare Pages (project: `finance-website`). DNS + project setup is left
to operator before first deploy.

## What was reused from `ray-website`

- Static HTML page structure and routes (`/`, `/about/`, `/services/`,
  `/testimonials/`, `/contact/`)
- React 19 + Vite portal SPA at `/portal/`
- Bilingual EN/ZH `data-en`/`data-zh` rendering pipeline (`public/site.js`)
- Persona-content scaffolding for the demo client (Daniel & Mira) and the
  9-stage engagement
- Floating chat-bubble (`public/chat.js`) — internal CSS class prefix
  renamed `ray-chat` → `site-chat` and restyled to the new direction

## What is new for the Finance vertical

- A different visual language end-to-end (see `DESIGN.md`):
  - Palette — Paper `#FAFAF7` + Ink `#0E1116` + Indigo Bond `#1B2A4A` +
    Oxidized Copper `#9A4B2D` (drops the Ray cream/green/bronze entirely).
  - Type — Source Serif 4 (display), Inter (body), IBM Plex Mono
    (numerals + eyebrows). Drops Cormorant Garamond and Manrope.
  - Layout — hairline grid (1px graphite rules, 0–2px radii), no
    box-shadows on content blocks, asymmetric editorial hero.
  - Imagery — zero photographs; data renderings (allocation ring, 12-quarter
    concentration horizon, plan ledger) replace stock art and gradient
    monogram blocks.
- Persona, license, AUM, firm name, all marketing copy across five public
  pages (EN + ZH)
- Portal data structures (`Dashboard.tsx`) — `STAGES`, `HOLDINGS`,
  `APPOINTMENTS`, `FEES`, `DOCUMENTS`, `STRATEGY_CARDS`, `MESSAGES` —
  fully re-authored for fee-only advisory work
- Per-tab portal vocabulary: Journey → **plan ledger**, Holdings →
  **position blotter** with concentration horizon, Strategy → **brief
  stack**, Schedule → **calendar of letters**, Fees → **fee summary
  statement**, Documents → **file room**, Messages → **memo thread**
- Floating chat trigger restyled from a round green disk to an 8px black
  square with mono `MS` glyph, panel header reads `Note from Maya ·
  Drafted h:mm PT`
- Chat-bubble canned responses (RSU windows, IPO planning, ADV brochures)
- Shared portal components: `Stat.tsx` (animated mono stat with count-up),
  `Ledger.tsx` (reusable ledger row), `HorizonChart.tsx` (single-color
  horizon ribbon + allocation ring)

## Stack

- Static HTML landing + subpages (`/`, `/about/`, `/services/`,
  `/testimonials/`, `/contact/`)
- Vite + React 19 SPA at `/portal/`
- Two CSS files: `public/site.css` (marketing pages) and
  `src/styles/site.css` (portal SPA — different token set)

## Develop

```bash
npm install
npm run dev        # vite dev server on :5173
npm run build      # outputs dist/
npm run preview    # serve the dist/ build locally
```

## Deploy

A push to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm run build` and deploys `dist/` to the `finance-website` Cloudflare
Pages project. The custom domain `finance.clockless.ai` should be attached
to that project in the Cloudflare dashboard once the project is created.
