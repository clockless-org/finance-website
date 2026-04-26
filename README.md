# finance-website

Financial-advisory industry demo for **Maya Sterling, CFP®**, a fictional
fee-only fiduciary advisor on the SF Peninsula. This is the Finance vertical
of the Clockless concierge-advisor template.

Built on the `ray-website` template (CLO-38) — same information architecture,
visual language, and routing structure, swapped to the financial-planning
domain:

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
- Bilingual EN/ZH `data-en`/`data-zh` rendering pipeline (`src/scripts/site.js`)
- Floating chat-bubble (`public/chat.js`) — internal CSS class prefix renamed
  `ray-chat` → `site-chat` to match its template-level role
- Design system tokens in `public/site.css` (cream / forest-green / bronze
  palette is finance-appropriate and was kept intact)

## What is new for the Finance vertical

- Persona, license, AUM, firm name, all marketing copy across five public
  pages (EN + ZH)
- Portal data structures (Dashboard.tsx) — `STAGES`, `HOLDINGS`,
  `APPOINTMENTS`, `FEES`, `DOCUMENTS`, `STRATEGY_CARDS`, `MESSAGES` — fully
  re-authored for fee-only advisory work
- Portal tab schema — `properties → holdings`, `neighborhood → strategy`,
  `payments → fees`; tab IDs renamed in code so there is no realtor residue
- Chat-bubble canned responses (RSU windows, IPO planning, ADV brochures)
- Portrait + team avatars switched from photo backgrounds to gradient +
  monogram blocks (no stock-photo residue from the realtor template)
- Service-art panels switched from house photos to abstract gradient blocks

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
