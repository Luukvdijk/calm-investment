# -*- coding: utf-8 -*-
"""Zet het oude Calm Investments logo (PNG) om naar een schoon SVG-vectorbestand."""
import numpy as np
import potrace
from PIL import Image

SRC = "Weblogo-Calm-Investments.png"
GREEN = "#135029"
SCALE = 4  # oversample voor vloeiendere curves


def to_bitmap(path, scale):
    im = Image.open(path).convert("RGBA")
    # op wit zetten, zodat transparantie niet als vorm wordt getraceerd
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    im = Image.alpha_composite(bg, im).convert("L")
    w, h = im.size
    im = im.resize((w * scale, h * scale), Image.LANCZOS)
    arr = np.array(im)
    # potracer volgt de beeldconventie: False (0) is de vorm, True is achtergrond.
    # De groene inkt is donker, dus lichte pixels zijn hier de achtergrond.
    return arr >= 128, im.size


def xy(p):
    return (p.x, p.y)


def svg_path(curves):
    out = []
    for curve in curves:
        sx, sy = xy(curve.start_point)
        d = ["M %.2f %.2f" % (sx, sy)]
        for seg in curve.segments:
            if seg.is_corner:
                cx, cy = xy(seg.c)
                ex, ey = xy(seg.end_point)
                d.append("L %.2f %.2f L %.2f %.2f" % (cx, cy, ex, ey))
            else:
                c1x, c1y = xy(seg.c1)
                c2x, c2y = xy(seg.c2)
                ex, ey = xy(seg.end_point)
                d.append("C %.2f %.2f %.2f %.2f %.2f %.2f" % (c1x, c1y, c2x, c2y, ex, ey))
        d.append("Z")
        out.append(" ".join(d))
    return " ".join(out)


data, (w, h) = to_bitmap(SRC, SCALE)
bmp = potrace.Bitmap(data)
path = bmp.trace(turdsize=2, alphamax=1.0, opticurve=True, opttolerance=0.2)
d = svg_path(path)

vb_w, vb_h = w / SCALE, h / SCALE
tpl = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.0f %.0f" '
    'role="img" aria-label="Calm Investments">\n'
    '  <g transform="scale(%.6f)">\n'
    '    <path fill="%s" fill-rule="evenodd" d="%s"/>\n'
    '  </g>\n'
    '</svg>\n'
)

with open("logo.svg", "w", encoding="utf-8") as f:
    f.write(tpl % (vb_w, vb_h, 1.0 / SCALE, GREEN, d))
with open("logo-cream.svg", "w", encoding="utf-8") as f:
    f.write(tpl % (vb_w, vb_h, 1.0 / SCALE, "#FAF9F5", d))

print("viewBox   : %.0f x %.0f" % (vb_w, vb_h))
print("curves    : %d" % len(list(path)))
print("pad-tekens: %d" % len(d))
