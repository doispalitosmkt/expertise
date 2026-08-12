# Design QA — seção editorial do Blog

## Comparação

- Source visual truth path: imagem de referência anexada pelo usuário na solicitação atual (870 × 759 px; o cliente não expõe um caminho local para o anexo).
- Implementation screenshot paths:
  - `/tmp/expertise-blog-photos-home-870.png`
  - `/tmp/expertise-blog-photos-page-870.png`
  - `/tmp/expertise-blog-audit-photos/home-1920x1080-section.png`
  - `/tmp/expertise-blog-audit-photos/blog-1920x1080-section.png`
  - `/tmp/expertise-blog-audit-photos/home-390x844-section.png`
  - `/tmp/expertise-blog-audit-photos/blog-390x844-section.png`
  - `/tmp/expertise-blog-audit-photos/home-360x800-section.png`
  - `/tmp/expertise-blog-audit-photos/blog-360x800-section.png`
- Reference pixels: 870 × 759.
- Primary comparison viewport: 870 × 759 CSS px, `deviceScaleFactor: 1`.
- Additional responsive viewports: 1920 × 1080, 1024 × 900, 768 × 900, 390 × 844 and 360 × 800 CSS px, all at density 1.
- State: page scrolled to the Cases/Blog transition on the homepage and to the editorial listing on `/blog/`; fonts loaded; reveal animations settled.

## Full-view comparison evidence

The implementation preserves the reference's main composition: a dark section ending with rounded lower corners and a thin yellow seam; a light-gray editorial field; a solid yellow Blog pill; a large sans/editorial title; supporting copy aligned to the right on wide screens; and white cards with restrained shadow, compact black-and-yellow category labels, thematic photography, and content anchored at the bottom.

The homepage uses three equal cards at desktop width. The Blog archive uses the same visual system for all seven entries instead of creating a disproportionate featured card. Responsive behavior is deliberately adapted to 3, 2, and 1 columns so card copy remains readable.

## Focused region comparison evidence

Focused captures were used because typography, card proportions, category pills, lower-corner rounding, and the yellow seam are too small to judge reliably in a full-page image. The 870 × 759 homepage capture verifies the transition and section hierarchy; the Blog capture verifies component parity. The 390 × 844 captures verify wrapping, single-column spacing, and card content without horizontal clipping.

## Required fidelity surfaces

- Fonts and typography: Plus Jakarta Sans and Bodoni Moda reproduce the sans/italic contrast; weights, line height, wrapping, and hierarchy remain legible at every tested viewport.
- Spacing and layout rhythm: section offsets, two-column heading, card gaps, radii, shadows, consistent media slots, and bottom-aligned content match the reference language. Equal heights were confirmed per row.
- Colors and visual tokens: the existing tokenized ink, paper, white, and yellow palette maps directly to the reference and preserves contrast.
- Image quality and asset fidelity: existing topic-specific WebP assets are used in consistent 16:9 media slots, with focal positions adjusted where needed. Intrinsic dimensions, lazy loading, and asynchronous decoding are declared.
- Copy and content: existing Expertise titles, summaries, categories, original dates, and validated reading times are preserved. Homepage CTAs point to real Blog anchors; archive cards do not imply unavailable article-detail pages.

## Findings

- No actionable P0, P1, or P2 differences remain.
- No horizontal overflow, clipped card content, broken asset, failed request, console error, or warning was found across the ten route/viewport scenarios.
- The desktop anchor offset differs from the fixed navigation edge by less than 0.4 CSS px. This is visually imperceptible and not actionable.

## Open Questions

- None for this iteration. Individual “Ler artigo” links should only be introduced when article-detail routes exist.

## Comparison history

- Pass 1: the previous implementation used an asymmetric featured-card layout and image-led cards. It was replaced by equal editorial cards, the shared heading treatment, and the rounded Cases/Blog transition.
- Pass 2: topic-specific photography was added at the user's request, the artificial blank space was removed, and focal points were adjusted for portrait-oriented source images.
- Pass 3: post-fix captures at desktop and mobile found no remaining P0/P1/P2 issue. No further visual correction was required.

## Implementation Checklist

- [x] Shared editorial component used on home and `/blog/`.
- [x] Three equal desktop cards on the homepage.
- [x] Seven equal archive cards with semantic heading order.
- [x] Responsive 3 → 2 → 1 grid.
- [x] Real anchor destinations for homepage CTAs.
- [x] Reduced-motion behavior preserved.
- [x] HTML, CSS, JavaScript, internal references, and Pages artifact validated.

## Follow-up Polish

- A small arrow icon can be added to the homepage CTA after a matching approved icon asset is available; it is intentionally omitted rather than approximated with a text glyph.

final result: passed
