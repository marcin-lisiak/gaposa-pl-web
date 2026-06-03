# Design

## Color Strategy

Restrained. Tinted-neutral backgrounds with a single precise accent. The Gaposa brand orange is present but never dominant — it acts as a punctuation mark, not a shout.

### Palette (OKLCH)

| Role | OKLCH | Hex equiv | Usage |
|---|---|---|---|
| `--c-bg` | oklch(97% 0.006 60) | ~#F5F3F0 | Page background, warm off-white |
| `--c-surface` | oklch(99% 0.004 60) | ~#FDFCFB | Card surfaces |
| `--c-surface-alt` | oklch(94% 0.008 55) | ~#EDE9E3 | Section alternates, light blocks |
| `--c-ink` | oklch(18% 0.01 50) | ~#1E1A17 | Primary text, headings |
| `--c-ink-mid` | oklch(38% 0.01 50) | ~#4A4340 | Secondary text |
| `--c-ink-faint` | oklch(60% 0.008 50) | ~#8A8178 | Captions, metadata |
| `--c-rule` | oklch(88% 0.008 55) | ~#D8D2CA | Borders, dividers |
| `--c-dark` | oklch(14% 0.01 50) | ~#141210 | Dark sections (footer, navbar) |
| `--c-dark-surface` | oklch(18% 0.01 50) | ~#1E1A17 | Cards on dark |
| `--c-accent` | oklch(58% 0.19 38) | ~#C94010 | Gaposa orange, softened from brand |
| `--c-accent-hover` | oklch(52% 0.19 38) | ~#A8330B | Hover state |
| `--c-accent-pale` | oklch(95% 0.04 50) | ~#FAF0EB | Very light accent tint |
| `--c-on-dark` | oklch(88% 0.006 55) | ~#E2DDD7 | Body text on dark |
| `--c-on-dark-faint` | oklch(55% 0.006 50) | ~#8A8178 | Subdued text on dark |

## Typography

Brand: DINPro (weight range: 300/400/500/700/900) + DINProCond (700/900).

DINPro is an industrial classic — used in airport signage, technical manuals, German precision tooling. It is the correct voice here. Not a reflex pick; it IS the Gaposa identity.

### Usage

- **Display headings (H1)**: DINProCond 900, clamp(3.5rem, 7vw, 6rem), tracking -0.02em, line-height 0.95
- **Section headings (H2)**: DINProCond 900, clamp(2rem, 4vw, 3.25rem), tracking -0.01em, line-height 1.05
- **Sub-headings (H3)**: DINPro 700, clamp(1.1rem, 2vw, 1.4rem), line-height 1.3
- **Body**: DINPro 300–400, 1rem–1.05rem, line-height 1.75, max 65ch
- **Labels/metadata**: DINPro 700, 0.68rem, letter-spacing 0.14em, ALL CAPS — used sparingly, not above every heading
- **Nav**: DINPro 500, 0.78rem, letter-spacing 0.09em

## Elevation & Borders

No rounded corners (brand precision). Radius is 0 or 2px max.
Shadows are used once — on the most prominent element per section.
Border weight: 1px, always `--c-rule`.
No `border-left` accents (banned).

## Components

### Buttons
- Primary: `--c-accent` fill, white text, 2px solid transparent, 0px radius → 2px radius
- Outline: transparent, ink border, ink text — for dark sections: white border/text
- No rounded pills
- Padding: 0.85rem 1.75rem
- Font: DINPro 700, 0.8rem, letter-spacing 0.1em, uppercase

### Cards (Product)
- White surface, 1px `--c-rule` border, 2px radius
- No shadow by default; `box-shadow: var(--shadow-card)` on hover
- Image fills top 260px, object-fit cover
- Bottom area: type label (small, colored), product name (H3 size), short description, spec chips, action row
- No side-stripe borders

### Feature Items (About section)
- Simple flex row: number or icon (no emoji) + text
- No background box, no border-left
- Divider is a thin `--c-rule` horizontal rule, not a colored border

### Stat Items
- Text only: large number + label below
- Separated by vertical rules, not background color bands

### Why-Us Cards
- Clean dark surface `--c-dark-surface`, full border `--c-rule` at low opacity
- Number (01, 02…) as the icon replacement — industrial catalogue style
- No top-border accent on hover; instead subtle background lightening

## Spacing Scale

- `--space-xs`: 0.5rem
- `--space-sm`: 1rem
- `--space-md`: 2rem
- `--space-lg`: 4rem
- `--space-xl`: 6rem
- `--space-2xl`: 9rem

Section padding: `--space-xl` (6rem) top/bottom. Not uniform: hero gets full viewport; stats bar gets compact 1.5rem; footer gets `--space-lg`.

## Motion

Minimal. Page-load only uses `fadeInUp` on hero elements (staggered 0s, 0.12s, 0.22s). Scroll-reveal for sections: opacity 0→1 + translateY(20px)→0, 0.55s ease-out-quart. No bounce. No elastic.

Transition tokens:
- `--t-fast`: 140ms ease
- `--t-normal`: 280ms ease
- `--t-slow`: 480ms cubic-bezier(0.16, 1, 0.3, 1) (ease-out-quart)
