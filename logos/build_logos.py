"""Generates 10 typographic logo options as transparent SVGs (text converted to outlines,
so they look identical everywhere and need no fonts installed).

Run:  python logos/build_logos.py <folder with the font files>
"""
import os
import sys
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FONTS = sys.argv[1]
OUT = os.path.dirname(os.path.abspath(__file__))
INK = "#161616"
CREAM = "#f6f4f0"


def load(name, axes=None):
    font = TTFont(os.path.join(FONTS, name))
    if axes:
        font = instancer.instantiateVariableFont(font, axes)
    return font


class Run:
    """A line of text turned into outlines at a given size and letter-spacing (in em)."""

    def __init__(self, font, text, size, track=0.0, upper=False):
        self.font, self.size, self.track = font, size, track
        self.text = text.upper() if upper else text
        self.cmap = font.getBestCmap()
        self.gs = font.getGlyphSet()
        self.scale = size / font["head"].unitsPerEm
        self.glyphs = [self.cmap.get(ord(c)) for c in self.text]
        self.adv = [self.gs[g].width * self.scale if g else size * 0.3 for g in self.glyphs]

    def natural(self):
        return sum(self.adv)

    def width(self):
        return self.natural() + self.track * self.size * (len(self.text) - 1)

    def fit(self, target):
        """Set the letter-spacing so the line is exactly `target` wide."""
        self.track = (target - self.natural()) / (self.size * (len(self.text) - 1))
        return self

    def svg(self, x, baseline, fill):
        parts, cx = [], x
        for g, adv in zip(self.glyphs, self.adv):
            if g:
                pen = SVGPathPen(self.gs)
                self.gs[g].draw(pen)
                d = pen.getCommands()
                if d:
                    parts.append(
                        f'<path transform="translate({cx:.2f} {baseline:.2f}) scale({self.scale:.5f} {-self.scale:.5f})" d="{d}"/>'
                    )
            cx += adv + self.track * self.size
        return f'<g fill="{fill}">' + "".join(parts) + "</g>"


def centered(lines, pad=40):
    """lines: [(Run, baseline_y)] -> (width, builder(fill))"""
    w = max(r.width() for r, _ in lines)
    return w + pad * 2, lambda fill: "".join(r.svg(pad + (w - r.width()) / 2, y, fill) for r, y in lines)


def write(name, width, height, build):
    for suffix, fill in (("", INK), ("-light", CREAM)):
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height:.0f}" '
            f'width="{width:.0f}" height="{height:.0f}">{build(fill)}</svg>'
        )
        with open(os.path.join(OUT, f"{name}{suffix}.svg"), "w", encoding="utf-8") as f:
            f.write(svg)
    print("wrote", name)


corm = lambda w: load("CormorantGaramond[wght].ttf", {"wght": w})
cormi = lambda w: load("CormorantGaramond-Italic[wght].ttf", {"wght": w})

# 01 Classic: light Cormorant capitals, wide tracking
r = Run(corm(300), "adamatasjalan", 120, 0.34, upper=True)
w, b = centered([(r, 150)])
write("logo-01-classic-caps", w, 220, b)

# 02 Stacked: small caps / large italic / small caps
top = Run(corm(400), "adam", 52, 0.5, upper=True)
mid = Run(cormi(300), "atas", 230)
bot = Run(corm(400), "jalan", 52, 0.5, upper=True)
mid_w = mid.width()
top.fit(mid_w * 0.92)
bot.fit(mid_w * 0.92)
w, b = centered([(top, 70), (mid, 250), (bot, 340)])
write("logo-02-stacked-italic", w, 400, b)

# 03 Script: Great Vibes, flowing single word
r = Run(load("GreatVibes-Regular.ttf"), "adamatasjalan", 190, 0.0)
w, b = centered([(r, 190)], pad=60)
write("logo-03-script", w, 330, b)

# 04 Playfair: regular with an italic middle word
pf, pfi = load("PlayfairDisplay[wght].ttf", {"wght": 400}), load("PlayfairDisplay-Italic[wght].ttf", {"wght": 400})
a, m, j = Run(pf, "Adam", 140, 0.01), Run(pfi, "atas", 140, 0.01), Run(pf, "Jalan", 140, 0.01)
gap = 36
total = a.width() + m.width() + j.width() + gap * 2
pad = 40


def build04(fill):
    return a.svg(pad, 170, fill) + m.svg(pad + a.width() + gap, 170, fill) + j.svg(pad + a.width() + m.width() + gap * 2, 170, fill)


write("logo-04-playfair-mixed", total + pad * 2, 250, build04)

# 05 Bodoni: high-contrast capitals with an italic "atas"
bo = load("BodoniModa[opsz,wght].ttf", {"wght": 500, "opsz": 18})
r1, r2, r3 = Run(bo, "adam", 110, 0.14, upper=True), Run(bo, "atas", 110, 0.04), Run(bo, "jalan", 110, 0.14, upper=True)
gap = 44


def build05(fill):
    x = pad
    out = r1.svg(x, 160, fill)
    x += r1.width() + gap
    out += r2.svg(x, 160, fill)
    x += r2.width() + gap
    return out + r3.svg(x, 160, fill)


write("logo-05-bodoni", pad * 2 + r1.width() + r2.width() + r3.width() + gap * 2, 240, build05)

# 06 Italiana: airy display capitals
r = Run(load("Italiana-Regular.ttf"), "adamatasjalan", 120, 0.3, upper=True)
w, b = centered([(r, 150)])
write("logo-06-italiana", w, 220, b)

# 07 Cinzel: ADAM large, ATAS JALAN spread to the same width
ci = load("Cinzel[wght].ttf", {"wght": 500})
big = Run(ci, "adam", 190, 0.1)
small = Run(ci, "atas jalan", 56, 0.0).fit(big.width())
w, b = centered([(big, 190), (small, 285)])
write("logo-07-cinzel-stacked", w, 340, b)

# 08 Script + sans: Allura "adam", Tenor Sans "ATAS JALAN"
sc = Run(load("Allura-Regular.ttf"), "adam", 260)
sans = Run(load("TenorSans-Regular.ttf"), "atas jalan", 52, 0.0, upper=True).fit(sc.width() * 0.8)
w, b = centered([(sc, 230), (sans, 310)])
write("logo-08-script-sans", w, 370, b)

# 09 Josefin: geometric lowercase, very open spacing, three words
jo = load("JosefinSans[wght].ttf", {"wght": 200})
r = Run(jo, "adam atas jalan", 90, 0.5)
w, b = centered([(r, 120)])
write("logo-09-geometric", w, 190, b)

# 10 Italic with an oversized opening "a" and closing "n"
it = cormi(400)
head, body, tail = Run(it, "a", 300), Run(it, "damatasjala", 130, 0.02), Run(it, "n", 300)
gap = 6


def build10(fill):
    x = pad
    out = head.svg(x, 250, fill)
    x += head.width() + gap
    out += body.svg(x, 250, fill)
    x += body.width() + gap
    return out + tail.svg(x, 250, fill)


write("logo-10-italic-monogram", pad * 2 + head.width() + body.width() + tail.width() + gap * 2, 320, build10)
