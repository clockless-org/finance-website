# Maya Sterling — Design

**North star:** Warm, calm, document-first fiduciary advisor — built on the
`ray-website` visual kit (CLO-38 fork) with bilingual content and a
demo-grade portal.

## Reference template

- **Primary template:** `ray-website` (forked at the index.html / portal /
  CSS / chat-bubble layer; see CLO-38).
- **Secondary:** generic fee-only / RIA sites for tone cues
  (Sapient Wealth, Sage Financial Group, NAPFA member sites).

## Color palette

The palette is intentionally inherited from `ray-website`. Cream + forest-green
+ bronze reads as fiduciary-professional just as well as it reads as
calm-realtor — the design system did not need a vertical-specific tweak,
which is itself a useful signal about template reusability.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#f7f2eb` | Surface cream |
| `--bg-strong` | `#ede2d1` | Surface deep |
| `--surface` | `#fffdf9` | Paper-white card |
| `--text` | `#2a231f` | Ink (deep warm brown) |
| `--muted` | `#786c60` | Secondary text |
| `--green` | `#1d3a30` | Primary forest green (CTA + deep sections) |
| `--green-soft` | `#29463a` | Hover variant |
| `--gold` | `#b58a5d` | Bronze accent (View Portal CTA, links) |
| `--peach` | `#dccbbb` | Warm accent block |
| `--mint` | `#dce7d8` | Cool accent block |

## Typography

- **Display:** Cormorant Garamond (weights 500/600/700).
- **Body:** Manrope on landing; Instrument Sans inside the portal SPA
  (different `src/styles/site.css` token set).

## Imagery strategy

Unlike `ray-website`, the Finance vertical does **not** ship stock photos
of homes or people. All portrait / team-avatar / service-art slots are
abstract gradient monogram blocks. Two reasons:

1. Avoids re-using the realtor template's stock photos in a fiduciary
   context (which would either look generic or bring residue).
2. Aligns with the visual language of fee-only RIA sites, which lean
   toward typography + restraint over hero photography.

Affected CSS classes (see `public/site.css`):

- `.portrait-arch--maya` — radial-gradient forest-green block + Cormorant
  monogram "MS" via `<span class="portrait-arch__monogram">`.
- `.team-member__avatar--{maya|priya|james|sarah|david}` — gradient discs;
  initials rendered via the inline `<span class="avatar-mono">` element.
- `.service-art--{purchase|selling|investment}` — linear-gradient blocks.
- `.site-chat__head-avatar` — gradient disc + ::before "MS" text.
