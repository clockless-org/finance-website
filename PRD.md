# Maya Sterling — PRD

**Client:** Maya Sterling, CFP® (fictional)
**Industry:** Financial Advisory — Fee-Only Fiduciary
**Stage:** Demo — Finance vertical of the Clockless concierge-advisor template
**Slug:** `maya`

## Overview

Maya Sterling is a fictional fee-only fiduciary advisor created as the
Finance industry version of the Clockless concierge-advisor product, built
on the `ray-website` template (CLO-38). The site serves three purposes:

1. Show prospective financial advisors what a full Clockless engagement
   looks like — landing pages + client portal + floating chat — adapted
   to financial-planning workflows.
2. Prove that the Clockless template can be migrated cross-vertical from
   real estate to financial advisory without re-inventing the visual or
   information architecture.
3. Serve as a reference implementation for other financial-advisor
   clients (CFP, RIA, family-office tier).

All content is fictional. The persona is deliberately distinct from any
real advisor to avoid confusion, and the firm CRD (#312587) is not a real
SEC registration.

## Persona

**Maya Sterling** — ex-software-engineer turned fee-only fiduciary CFP®
based in Menlo Park.

- Stanford CS '13.
- 8 years engineering at two Peninsula tech companies.
- Earned CFP® and Series 65, registered Sterling Wealth Advisors LLC as
  an SEC investment advisor in 2021 (CRD #312587, fictional).
- Calm, technical, document-first.
- Voice: reads like an engineer who found her second act in financial
  planning. Plain-English, never pushy, never gives tax advice without
  pointing at "talk to your CPA."

## Demo client

**Daniel & Mira Park** — dual-income tech couple, two kids (Owen 5,
Emma 2). Mira's company IPO'd in Q3 2025; lockup ended Mar 2026 with
54% of liquid net worth in employer stock. Engagement runs across nine
stages, from Discovery through Ongoing Reviews.

## Public content scope

- `/` — Hero, stats band, "Meet Maya" quote, three service cards,
  feature split panel, featured testimonial, CTA.
- `/about/` — Bio, four-card career timeline, credentials & memberships,
  five-person Sterling Wealth Advisors team, "How I Work" feature band.
- `/services/` — Three service rows (Comprehensive Plan / Equity Comp &
  IPO Planning / One-Time Plan Review), engineer-advantage panel,
  4-step process.
- `/testimonials/` — Featured story (Daniel & Mira), six testimonial
  cards, stats band.
- `/contact/` — Form + sidebar + 3 connect-card formats + map panel.
- `/portal/` — 7-tab portal demo (Journey · Holdings · Strategy ·
  Schedule · Fees · Documents · Messages).

## Out of scope (for the demo)

- Real custodian / brokerage integrations (no live data).
- Real form submission backend (the form posts to a placeholder
  `finance-contact` lead endpoint that may not yet exist on Clockless).
- DNS / Cloudflare Pages project provisioning — operator handoff.
- Image assets — all portrait / team avatars are abstract gradient
  monogram blocks, not photos.
