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
// the sphere/crown/particle-disintegration symbol: a solid arc on the left,
// a jagged opening ("crown") near the top, and debris scattering outward on
// the right as the ring dissolves. Generated procedurally (fixed hash, not
// Math.random) rather than freehand so the silhouette stays geometrically a
// circle instead of an eyeballed approximation.
const CADUCEUS_ART = [
  '⠀⠀⠀⠀⠀⠀⠀⣀⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣄⠀⠀⠀⠀⠀⠀⢀⠀⠀',
  '⠀⠀⣠⣾⣿⣿⣿⣿⣿⠿⠓⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣷⣄⠀⠂⠀⠀⠀⠀⠀',
  '⢀⣾⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⣿⣿⣿⣿⣷⣐⠀⠀⠀⠂⠀',
  '⣾⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠝⡿⣿⣿⣿⣿⡀⠄⠀⠀⠀',
  '⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠁⢅⠈⣽⣿⣏⣯⣕⠀⠀⠀⢀',
  '⣿⣿⣿⠁⠀⠀⠀⢀⠀⢀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣭⢿⣽⡩⠇⠀⠀⠀',
  '⣿⣿⡟⠀⠀⠀⠀⠀⠠⡀⠀⡀⠀⠀⠀⠀⠈⠀⠀⠄⠀⠀⠁⠠⠁⠆⢑⣿⢝⣻⣳⠐⠀⠀',
  '⣿⣿⣇⠀⠀⠂⠀⠀⠀⠁⠀⠰⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠆⠬⠀⢲⡶⠿⣿⣪⠀⠀⠁',
  '⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡁⠄⡌⡓⡿⢢⠱⡁⠀⠊⠀',
  '⣿⣿⣿⣧⠀⠀⠀⠀⠈⠀⠀⢀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠠⠀⣢⡃⡌⡩⢿⢹⣀⠁⠀⠀⠀',
  '⣿⣿⣿⣿⣧⡀⠂⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠠⠀⠀⠄⠂⡜⣯⡯⡿⢙⠄⠀⢀⠀⠀',
  '⠘⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⡦⠤⠆⢈⠀⠋⠮⢘⠍⢖⠁⠀⠀⠀⠀⠀',
  '⠀⠈⠻⣿⣿⣿⣿⣿⣾⣤⣀⣁⠀⠀⠀⡈⠀⢘⠊⠄⠠⡀⠖⠒⠂⢠⠉⠀⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠈⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠵⠁⣂⠍⠢⢌⠰⠀⠀⠀⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠉⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡗⠂⠱⠑⠈⣀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀'
]

// Uniform chrome/silver wordmark (ASSET 1's letters are a single metallic
// tone). NOTE: colorize() paints one color per whole ROW — this renderer has
// no per-glyph coloring, so the multi-colored separator dots visible in
// ASSET 1 aren't reproducible here without rebuilding the art pipeline
// (out of scope for this rebrand) — flagged in the rebrand report.
const LOGO_GRADIENT = [0, 0, 0, 0, 0, 0] as const
// Red crown/opening at top → cyan body → chrome core highlight → cyan body
// → fading to muted as the ring dissolves into drifting debris at the base.
const CADUC_GRADIENT = [2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 3, 3, 3, 3] as const

const colorize = (art: string[], gradient: readonly number[], c: ThemeColors): Line[] => {
  const p = [c.primary, c.accent, c.border, c.muted]

  return art.map((text, i) => [p[gradient[i]!] ?? c.muted, text])
}

export const LOGO_WIDTH = Math.max(...LOGO_ART.map(line => line.length))
export const CADUCEUS_WIDTH = Math.max(...CADUCEUS_ART.map(line => line.length))

export const logo = (c: ThemeColors, customLogo?: string): Line[] =>
  customLogo ? parseRichMarkup(customLogo) : colorize(LOGO_ART, LOGO_GRADIENT, c)

export const caduceus = (c: ThemeColors, customHero?: string): Line[] =>
  customHero ? parseRichMarkup(customHero) : colorize(CADUCEUS_ART, CADUC_GRADIENT, c)

export const artWidth = (lines: Line[]) => lines.reduce((m, [, t]) => Math.max(m, t.length), 0)

type Line = [string, string]
