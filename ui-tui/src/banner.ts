import { relativeLuminance } from './lib/color.js'
import type { ThemeColors } from './theme.js'

const RICH_RE = /\[(?:bold\s+)?(?:dim\s+)?(#(?:[0-9a-fA-F]{3,8}))\]([\s\S]*?)(\[\/\])/g

export function parseRichMarkup(markup: string): Line[] {
  const lines: Line[] = []

  for (const raw of markup.split('\n')) {
    const trimmed = raw.trimEnd()

    if (!trimmed) {
      lines.push(['', ' '])

      continue
    }

    const matches = [...trimmed.matchAll(RICH_RE)]

    if (!matches.length) {
      lines.push(['', trimmed])

      continue
    }

    let cursor = 0

    for (const m of matches) {
      const before = trimmed.slice(cursor, m.index)

      if (before) {
        lines.push(['', before])
      }

      lines.push([m[1]!, m[2]!])
      cursor = m.index! + m[0].length
    }

    if (cursor < trimmed.length) {
      lines.push(['', trimmed.slice(cursor)])
    }
  }

  return lines
}

// J.A.G.O.D.A wordmark (ASSET 1) — ANSI Shadow block letters. Letter cells
// for A/G reuse the exact glyphs from the previous HERMES AGENT art (same
// font), O/D/J are new cells drawn in the same style so stroke weight and
// corner glyphs stay identical.
const LOGO_ART = [
  '     ██╗    █████╗     ██████╗     ██████╗    ██████╗     █████╗ ',
  '     ██║   ██╔══██╗   ██╔════╝    ██╔═══██╗   ██╔══██╗   ██╔══██╗',
  '     ██║   ███████║   ██║  ███╗   ██║   ██║   ██║  ██║   ███████║',
  '██   ██║   ██╔══██║   ██║   ██║   ██║   ██║   ██║  ██║   ██╔══██║',
  '╚█████╔╝██╗██║  ██║██╗╚██████╔╝██╗╚██████╔╝██╗██████╔╝██╗██║  ██║',
  ' ╚════╝ ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝ ╚═════╝ ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝'
]

// J.A.G.O.D.A CORE hero-art (ASSET 2) — deterministic braille adaptation of
// the sphere/crown/particle-disintegration symbol: a solid circle on the
// left, a jagged opening ("crown") near the top, and debris disintegrating
// outward on the right, shrinking and thinning with distance. Generated
// procedurally (fixed hash, not Math.random) from real circle math rather
// than freehand: a braille cell packs a 2(w)x4(h) sub-dot matrix into a
// terminal cell that is itself ~1:2 (w:h), so each dot is SQUARE — a circle
// drawn with plain Euclidean distance in dot-space renders as a true circle
// on screen with no extra squash/stretch, which is what the earlier
// hand-tuned grid (34 wide x 16 tall, an aspect the math above doesn't
// support) got wrong. Regenerated at 30x10 — smaller and more legible,
// reads cleanly at ~120-160 terminal columns.
const CADUCEUS_ART = [
  '⠀⠀⠀⠀⠀⠀⠀⢠⠀⠀⡇⠀⣶⣶⣶⣿⣷⢣⣴⠴⠀⠀⠄⠀⠀⠄⠀⠀⠀⠀',
  '⠀⠀⢀⠀⠀⢱⣄⢸⣧⢰⣷⢠⣿⢀⣼⠉⢠⣬⠉⢰⣶⠵⠁⠁⢀⡅⠄⠀⠀⠀',
  '⠀⢠⣿⣿⣶⣄⣻⣧⣿⣾⣿⣾⣧⣿⣃⣴⣾⣿⣿⢷⣷⢵⣷⣠⠀⢅⡅⠄⠄⠄',
  '⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣵⣷⠄⠑⠃⢄⡔⠃⠁⠀',
  '⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣅⣥⣤⣥⢁⢄⡄⢀⡄⠀',
  '⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠍⠉⠍⠍⠁⠄⠅⠀⠄',
  '⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⣤⣥⣤⢄⠄⠀⠄⠀',
  '⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣤⣅⡍⠍⠍⠍⠚⠀⠀⠁',
  '⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢡⣬⣭⡿⣧⣄⢴⢔⡇⠄⠄⠀',
  '⠀⠀⠀⠀⠉⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠉⠛⠁⠁⠉⠉⠀⠀⠀⠁⠀'
]

// Uniform chrome/silver wordmark (ASSET 1's letters are a single metallic
// tone). NOTE: colorize() paints one color per whole ROW — this renderer has
// no per-glyph coloring, so the multi-colored separator dots visible in
// ASSET 1 aren't reproducible here without rebuilding the art pipeline
// (out of scope for this rebrand) — flagged in the rebrand report.
const LOGO_GRADIENT = [0, 0, 0, 0, 0, 0] as const

const colorize = (art: string[], gradient: readonly number[], c: ThemeColors): Line[] => {
  const p = [c.primary, c.accent, c.border, c.muted]

  return art.map((text, i) => [p[gradient[i]!] ?? c.muted, text])
}

export const LOGO_WIDTH = Math.max(...LOGO_ART.map(line => line.length))
export const CADUCEUS_WIDTH = Math.max(...CADUCEUS_ART.map(line => line.length))

export const logo = (c: ThemeColors, customLogo?: string): Line[] =>
  customLogo ? parseRichMarkup(customLogo) : colorize(LOGO_ART, LOGO_GRADIENT, c)

// CORE hero-art is monochrome-cyan IDENTITY (like the wordmark's chrome and
// the CORE glyph's own fixed palette) rather than theme-derived: it must
// never render in the theme's red border / blue accent / white primary —
// that mismatch was the reported "gaming RGB" look. Bright/mid/dim map to
// crown+core-highlight / body / fading-debris. Dark and light triples are
// both real, hand-picked hex (not lifted from theme seeds): on a dark
// terminal "bright" is near-white cyan; on a light terminal the same role is
// played by the DARKEST teal (the readable pole flips), and "dim" fades
// toward whichever background pole is in play, matching the disintegration
// actually fading into the terminal's own canvas.
const CADUCEUS_CYAN_DARK = ['#96F5FF', '#27B2C7', '#12545C'] as const
const CADUCEUS_CYAN_LIGHT = ['#036672', '#0E8CA3', '#9FDCE6'] as const
// Crown/opening (top) → body → core highlight (vertical middle) → body →
// fading debris — cyan-only echo of the original red/blue/white structure.
const CADUC_GRADIENT = [0, 0, 1, 1, 0, 0, 1, 1, 2, 2] as const

const colorizeCyan = (art: string[], gradient: readonly number[], c: ThemeColors): Line[] => {
  // Inverted on purpose: `text` is chosen for contrast AGAINST the
  // background, so a LIGHT terminal has DARK text (low luminance) and a DARK
  // terminal has LIGHT text (high luminance) -- see LIGHT_SEEDS/DARK_SEEDS
  // in theme.ts (text: '#20262E' vs '#E4E8EF'). Defaulting the missing-color
  // case to 1 (high luminance) keeps the fallback on the dark-theme branch.
  const isLight = (relativeLuminance(c.text) ?? 1) < 0.5
  const p = isLight ? CADUCEUS_CYAN_LIGHT : CADUCEUS_CYAN_DARK

  return art.map((text, i) => [p[gradient[i]!] ?? p[1], text])
}

export const caduceus = (c: ThemeColors, customHero?: string): Line[] =>
  customHero ? parseRichMarkup(customHero) : colorizeCyan(CADUCEUS_ART, CADUC_GRADIENT, c)

export const artWidth = (lines: Line[]) => lines.reduce((m, [, t]) => Math.max(m, t.length), 0)

type Line = [string, string]
