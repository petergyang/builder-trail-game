#!/usr/bin/env python3
"""Generate a coherent local pixel-art scene pack.

These PNGs are deterministic project assets that replace the blocky canvas
fallbacks while the imagegen final-art workflow is still being reviewed.
They intentionally use the same filenames as the imagegen prompt manifest so
future generated art can be dropped in without code changes.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "scenes"
LOW_SIZE = (256, 144)
TARGET_SIZE = (1536, 864)


PALETTE = {
    "bg": (7, 9, 18),
    "navy": (12, 19, 35),
    "deep": (18, 24, 40),
    "line": (49, 61, 82),
    "blue": (72, 145, 220),
    "cyan": (92, 190, 220),
    "green": (83, 184, 118),
    "amber": (229, 157, 74),
    "gold": (236, 193, 102),
    "red": (219, 83, 75),
    "pink": (218, 113, 136),
    "paper": (221, 208, 175),
    "paper2": (185, 171, 137),
    "wood": (85, 54, 39),
    "wood2": (122, 73, 48),
    "plant": (69, 140, 83),
    "skin": (190, 137, 95),
    "gray": (130, 139, 154),
    "shadow": (3, 5, 10),
}


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(lerp(a[i], b[i], t) for i in range(3))


def rect(draw: ImageDraw.ImageDraw, box, fill, outline=None, width=1):
    draw.rectangle(tuple(round(v) for v in box), fill=fill, outline=outline, width=width)


def line(draw: ImageDraw.ImageDraw, points, fill, width=1):
    draw.line([(round(x), round(y)) for x, y in points], fill=fill, width=width)


def ellipse(draw: ImageDraw.ImageDraw, box, fill, outline=None):
    draw.ellipse(tuple(round(v) for v in box), fill=fill, outline=outline)


def poly(draw: ImageDraw.ImageDraw, points, fill, outline=None):
    draw.polygon([(round(x), round(y)) for x, y in points], fill=fill, outline=outline)


def canvas(top=PALETTE["navy"], bottom=PALETTE["bg"]) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", LOW_SIZE, top)
    draw = ImageDraw.Draw(img)
    for y in range(LOW_SIZE[1]):
      t = y / (LOW_SIZE[1] - 1)
      draw.line([(0, y), (LOW_SIZE[0], y)], fill=mix(top, bottom, t))
    for x in range(0, LOW_SIZE[0], 16):
      line(draw, [(x, 0), (x, LOW_SIZE[1])], (15, 22, 37))
    for y in range(0, LOW_SIZE[1], 16):
      line(draw, [(0, y), (LOW_SIZE[0], y)], (15, 22, 37))
    return img, draw


def floor(draw, color=(20, 17, 23), y=96):
    rect(draw, (0, y, 256, 144), color)
    line(draw, [(0, y), (256, y)], PALETTE["line"], 1)
    for x in range(-30, 256, 28):
      line(draw, [(x, 144), (x + 58, y)], (29, 33, 45))


def window(draw, x, y, w, h, glow=PALETTE["blue"]):
    rect(draw, (x, y, x + w, y + h), (20, 34, 54), PALETTE["line"])
    rect(draw, (x + 2, y + 2, x + w - 2, y + h - 2), mix(glow, PALETTE["bg"], 0.45))
    line(draw, [(x + w / 2, y + 2), (x + w / 2, y + h - 2)], PALETTE["line"])
    line(draw, [(x + 2, y + h / 2), (x + w - 2, y + h / 2)], PALETTE["line"])


def person(draw, x, y, shirt=PALETTE["blue"], pose="stand", scale=1.0):
    s = scale
    ellipse(draw, (x - 4*s, y - 25*s, x + 4*s, y - 17*s), PALETTE["skin"])
    rect(draw, (x - 5*s, y - 16*s, x + 5*s, y - 2*s), shirt)
    if pose == "sit":
      rect(draw, (x - 7*s, y - 2*s, x + 1*s, y + 4*s), (33, 41, 58))
      rect(draw, (x + 1*s, y - 1*s, x + 8*s, y + 4*s), (33, 41, 58))
    else:
      line(draw, [(x - 3*s, y - 2*s), (x - 6*s, y + 9*s)], (33, 41, 58), max(1, round(2*s)))
      line(draw, [(x + 3*s, y - 2*s), (x + 6*s, y + 9*s)], (33, 41, 58), max(1, round(2*s)))
    line(draw, [(x - 5*s, y - 12*s), (x - 10*s, y - 5*s)], shirt, max(1, round(2*s)))
    line(draw, [(x + 5*s, y - 12*s), (x + 10*s, y - 5*s)], shirt, max(1, round(2*s)))


def table(draw, x, y, w, h=8, color=PALETTE["wood"]):
    rect(draw, (x, y, x + w, y + h), color, PALETTE["line"])
    rect(draw, (x + 6, y + h, x + 10, y + 38), mix(color, PALETTE["shadow"], 0.25))
    rect(draw, (x + w - 10, y + h, x + w - 6, y + 38), mix(color, PALETTE["shadow"], 0.25))


def laptop(draw, x, y, w=28, color=(34, 41, 56), glow=PALETTE["cyan"]):
    rect(draw, (x, y, x + w, y + round(w * 0.6)), color, PALETTE["line"])
    rect(draw, (x + 3, y + 3, x + w - 3, y + round(w * 0.6) - 3), mix(glow, PALETTE["bg"], 0.65))
    rect(draw, (x - 2, y + round(w * 0.6), x + w + 3, y + round(w * 0.6) + 4), (24, 28, 39))


def paper(draw, x, y, w, h, marks=True):
    rect(draw, (x, y, x + w, y + h), PALETTE["paper"], PALETTE["paper2"])
    if marks:
      for i, c in enumerate([PALETTE["blue"], PALETTE["red"], PALETTE["green"]]):
        rect(draw, (x + 5, y + 7 + i*8, x + w - 7, y + 9 + i*8), c)


def sticky(draw, x, y, c=PALETTE["gold"]):
    rect(draw, (x, y, x + 13, y + 10), c, mix(c, PALETTE["shadow"], 0.35))


def finish_scene(image: Image.Image) -> Image.Image:
    """Give the deterministic scenes enough light to read in the game UI."""
    image = ImageEnhance.Color(image).enhance(1.18)
    image = ImageEnhance.Contrast(image).enhance(1.22)
    image = ImageEnhance.Brightness(image).enhance(1.16)

    pixels = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            nx = (x / (width - 1)) - 0.5
            ny = (y / (height - 1)) - 0.44
            dist = min(1, (nx * nx * 1.7 + ny * ny * 1.25) ** 0.5)
            spotlight = max(0, 1 - dist * 1.65)
            edge = max(0, dist - 0.42)
            warm = round(20 * spotlight)
            cool = round(10 * spotlight)
            shade = round(28 * edge)
            pixels[x, y] = (
                max(0, min(255, r + warm - shade)),
                max(0, min(255, g + round(warm * 0.75) - shade)),
                max(0, min(255, b + cool - round(shade * 0.75))),
            )

    draw = ImageDraw.Draw(image)
    rect(draw, (2, 2, width - 3, height - 3), None, (84, 101, 130), 1)
    rect(draw, (5, 5, width - 6, height - 6), None, (18, 28, 45), 1)
    return image


def hero():
    img, draw = canvas((10, 18, 32), (7, 8, 16))
    floor(draw, (22, 21, 26), 98)
    rect(draw, (126, 12, 130, 144), (39, 45, 55))
    window(draw, 20, 24, 72, 44, PALETTE["blue"])
    rect(draw, (14, 78, 98, 86), (42, 49, 62))
    table(draw, 26, 88, 54, 6, (70, 54, 44))
    paper(draw, 36, 82, 18, 12, False)
    rect(draw, (148, 25, 235, 94), (29, 36, 45), PALETTE["line"])
    table(draw, 154, 91, 64, 7, PALETTE["wood2"])
    laptop(draw, 176, 72, 24, PALETTE["deep"], PALETTE["green"])
    rect(draw, (154, 55, 166, 72), PALETTE["plant"])
    ellipse(draw, (154, 48, 167, 62), PALETTE["plant"])
    paper(draw, 205, 71, 18, 14, False)
    line(draw, [(128, 15), (128, 132)], PALETTE["gold"])
    return img


def office():
    img, draw = canvas()
    floor(draw, (19, 19, 26), 94)
    window(draw, 172, 20, 54, 40)
    table(draw, 40, 88, 158, 9)
    for x, c in [(70, PALETTE["blue"]), (120, PALETTE["green"]), (166, PALETTE["amber"])]:
      person(draw, x, 84, c, "sit", 0.85)
    paper(draw, 66, 80, 20, 10, False)
    paper(draw, 130, 79, 24, 11, False)
    rect(draw, (31, 68, 35, 82), PALETTE["gold"])
    return img


def okr_maze():
    img, draw = canvas((11, 20, 33), (6, 9, 18))
    floor(draw, (17, 18, 24), 103)
    rect(draw, (40, 22, 184, 85), (224, 231, 218), PALETTE["line"])
    boxes = [(54,35), (89,30), (122,45), (75,61), (143,64)]
    for i, (x, y) in enumerate(boxes):
      rect(draw, (x, y, x + 22, y + 12), [PALETTE["blue"], PALETTE["green"], PALETTE["amber"], PALETTE["red"], PALETTE["cyan"]][i])
    for a, b in [(0,1), (1,2), (0,3), (3,4), (2,4)]:
      x1, y1 = boxes[a]; x2, y2 = boxes[b]
      line(draw, [(x1 + 22, y1 + 6), (x2, y2 + 6)], (59, 68, 78), 1)
    person(draw, 205, 103, PALETTE["blue"], "stand", 0.9)
    person(draw, 226, 103, PALETTE["red"], "stand", 0.9)
    return img


def strategy_summit():
    img, draw = canvas((20, 17, 25), (8, 9, 17))
    floor(draw, (30, 24, 23), 96)
    rect(draw, (32, 22, 224, 68), (22, 29, 44), PALETTE["line"])
    for x in range(45, 205, 24):
      sticky(draw, x, 36, [PALETTE["gold"], PALETTE["green"], PALETTE["pink"]][x % 3])
    table(draw, 36, 88, 180, 10, PALETTE["wood2"])
    for x in [70, 128, 184]:
      person(draw, x, 86, PALETTE["gray"], "sit", 0.75)
    for x in [54, 100, 150]:
      rect(draw, (x, 80, x + 14, 86), PALETTE["paper2"], PALETTE["line"])
    return img


def doc_comments():
    img, draw = canvas((33, 27, 22), (10, 9, 12))
    floor(draw, (54, 38, 28), 0)
    rect(draw, (60, 19, 183, 117), PALETTE["paper"], PALETTE["paper2"])
    for y in [34, 48, 62, 80]:
      line(draw, [(75, y), (142, y)], (134, 124, 100))
    for x, y, c in [(146,31,PALETTE["pink"]), (151,56,PALETTE["gold"]), (39,65,PALETTE["green"]), (170,84,PALETTE["blue"])]:
      sticky(draw, x, y, c)
      line(draw, [(x + 5, y + 10), (135, y + 8)], mix(c, PALETTE["shadow"], 0.35))
    ellipse(draw, (42, 28, 60, 38), (91, 61, 37))
    return img


def vp_review():
    img, draw = canvas((15, 23, 34), (5, 7, 13))
    floor(draw, (18, 18, 25), 104)
    rect(draw, (92, 20, 167, 103), (16, 28, 42), PALETTE["line"])
    rect(draw, (99, 27, 160, 97), (25, 43, 61))
    line(draw, [(130, 27), (130, 97)], PALETTE["line"])
    table(draw, 42, 96, 32, 7, (48, 50, 58))
    paper(draw, 48, 88, 22, 11, False)
    rect(draw, (197, 76, 214, 101), (30, 33, 42), PALETTE["line"])
    rect(draw, (205, 64, 211, 78), PALETTE["plant"])
    ellipse(draw, (199, 54, 214, 68), PALETTE["plant"])
    return img


def reorg():
    img, draw = canvas((13, 18, 28), (8, 8, 15))
    floor(draw, (21, 20, 25), 96)
    rect(draw, (35, 25, 120, 67), (24, 31, 45), PALETTE["line"])
    for x, y in [(51,36), (80,36), (65,52), (94,52)]:
      rect(draw, (x, y, x + 18, y + 8), PALETTE["gray"], PALETTE["line"])
    rect(draw, (145, 85, 190, 113), PALETTE["wood2"], PALETTE["line"])
    rect(draw, (153, 72, 181, 87), PALETTE["paper2"], PALETTE["line"])
    person(draw, 214, 97, PALETTE["blue"], "stand", 0.72)
    person(draw, 230, 97, PALETTE["amber"], "stand", 0.72)
    return img


def demo():
    img, draw = canvas((7, 13, 26), (4, 6, 12))
    floor(draw, (15, 14, 22), 102)
    poly(draw, [(83, 22), (185, 49), (185, 78), (83, 60)], mix(PALETTE["cyan"], PALETTE["bg"], 0.25))
    rect(draw, (174, 24, 229, 78), (18, 32, 48), PALETTE["cyan"])
    rect(draw, (43, 76, 85, 96), PALETTE["wood"], PALETTE["line"])
    person(draw, 64, 77, PALETTE["green"], "stand", 0.88)
    for x in [112, 132, 153]:
      person(draw, x, 108, PALETTE["gray"], "sit", 0.65)
    return img


def team_good():
    img, draw = canvas((18, 28, 34), (8, 11, 17))
    floor(draw, (26, 24, 24), 101)
    rect(draw, (35, 22, 192, 75), (33, 43, 48), PALETTE["line"])
    for x in [51, 71, 100, 129, 157]:
      sticky(draw, x, 38, [PALETTE["gold"], PALETTE["green"], PALETTE["blue"]][x % 3])
    table(draw, 55, 92, 135, 8, PALETTE["wood2"])
    for x, c in [(78, PALETTE["green"]), (121, PALETTE["blue"]), (164, PALETTE["amber"])]:
      person(draw, x, 89, c, "sit", 0.75)
    ellipse(draw, (207, 65, 224, 83), PALETTE["plant"])
    return img


def designer():
    img, draw = canvas((19, 22, 31), (8, 8, 15))
    floor(draw, (22, 19, 22), 101)
    rect(draw, (38, 18, 203, 79), (31, 35, 43), PALETTE["line"])
    for i, (x, c) in enumerate([(54, PALETTE["paper"]), (100, (205, 199, 214)), (146, (191, 218, 205))]):
      rect(draw, (x, 30, x + 32, 54), c, PALETTE["paper2"])
      rect(draw, (x + 5, 59, x + 23, 65), [PALETTE["blue"], PALETTE["pink"], PALETTE["green"]][i])
    table(draw, 62, 94, 120, 8, PALETTE["wood"])
    paper(draw, 83, 84, 28, 13, False)
    laptop(draw, 142, 77, 24, PALETTE["deep"], PALETTE["pink"])
    person(draw, 213, 96, PALETTE["green"], "stand", 0.8)
    return img


def agentic_engineers():
    img, draw = canvas((10, 20, 29), (5, 8, 14))
    floor(draw, (15, 18, 21), 100)
    rect(draw, (40, 23, 157, 79), (23, 35, 39), PALETTE["line"])
    for x in [54, 82, 111, 135]:
      sticky(draw, x, 41, PALETTE["green"])
      rect(draw, (x + 3, 44, x + 10, 48), PALETTE["gold"])
    table(draw, 88, 92, 105, 7, PALETTE["wood"])
    laptop(draw, 126, 75, 30, PALETTE["deep"], PALETTE["green"])
    for x in [88, 178]:
      person(draw, x, 91, PALETTE["blue"], "stand", 0.78)
    for x, y in [(181, 36), (199, 52), (171, 59)]:
      rect(draw, (x, y, x + 12, y + 8), PALETTE["cyan"], PALETTE["green"])
    return img


def late_night():
    img, draw = canvas((7, 9, 17), (3, 4, 9))
    rect(draw, (0, 94, 256, 144), (24, 18, 20))
    window(draw, 171, 24, 44, 45, (25, 37, 62))
    table(draw, 45, 96, 150, 8, PALETTE["wood"])
    laptop(draw, 97, 72, 40, PALETTE["deep"], PALETTE["cyan"])
    rect(draw, (55, 72, 66, 95), PALETTE["amber"])
    ellipse(draw, (51, 58, 70, 78), (240, 177, 92))
    paper(draw, 145, 86, 25, 12, False)
    rect(draw, (178, 78, 196, 93), (49, 55, 68), PALETTE["line"])
    return img


def ship():
    img, draw = canvas((18, 26, 28), (8, 11, 16))
    rect(draw, (0, 96, 256, 144), (38, 30, 28))
    table(draw, 42, 91, 170, 8, PALETTE["wood2"])
    laptop(draw, 144, 67, 34, PALETTE["deep"], PALETTE["green"])
    paper(draw, 77, 78, 33, 17, True)
    for x, y, c in [(45,33,PALETTE["gold"]), (68,48,PALETTE["pink"]), (207,38,PALETTE["green"]), (192,63,PALETTE["blue"]), (117,31,PALETTE["amber"])]:
      rect(draw, (x, y, x + 3, y + 3), c)
    ellipse(draw, (116, 72, 128, 84), PALETTE["gold"])
    rect(draw, (117, 84, 127, 91), PALETTE["paper2"])
    return img


def customer_community():
    img, draw = canvas((22, 19, 24), (8, 10, 15))
    floor(draw, (26, 21, 19), 99)
    table(draw, 48, 88, 160, 9, PALETTE["wood2"])
    for x, c in [(75, PALETTE["green"]), (128, PALETTE["blue"]), (180, PALETTE["amber"])]:
      person(draw, x, 86, c, "sit", 0.8)
    for x in [91, 112, 145]:
      sticky(draw, x, 78, PALETTE["gold"])
    rect(draw, (38, 61, 69, 72), (188, 93, 55), PALETTE["line"])
    ellipse(draw, (211, 51, 228, 70), (236, 173, 92))
    return img


def support_queue():
    img, draw = canvas((10, 14, 24), (5, 6, 12))
    floor(draw, (18, 15, 20), 96)
    table(draw, 38, 88, 176, 9, PALETTE["wood"])
    laptop(draw, 162, 68, 32, PALETTE["deep"], PALETTE["red"])
    for x, y, c in [(55,74,PALETTE["paper"]), (82,70,PALETTE["paper"]), (111,78,PALETTE["paper2"]), (133,67,PALETTE["paper"])]:
      paper(draw, x, y, 20, 13, False)
      rect(draw, (x + 13, y - 3, x + 18, y + 2), PALETTE["red"])
    ellipse(draw, (45, 65, 58, 77), (91, 61, 37))
    return img


def launch_flop():
    img, draw = canvas((16, 16, 24), (7, 7, 13))
    floor(draw, (26, 20, 21), 98)
    table(draw, 58, 88, 140, 8, (74, 51, 43))
    ellipse(draw, (71, 76, 84, 87), (83, 54, 36))
    rect(draw, (97, 78, 126, 84), PALETTE["paper2"], PALETTE["line"])
    rect(draw, (151, 74, 166, 86), (33, 38, 49), PALETTE["line"])
    for x, y, c in [(66,58,PALETTE["gold"]), (187,54,PALETTE["pink"]), (129,63,PALETTE["green"])]:
      rect(draw, (x, y, x + 2, y + 2), c)
    return img


def family():
    img, draw = canvas((28, 21, 20), (10, 9, 12))
    floor(draw, (43, 31, 25), 96)
    table(draw, 46, 86, 160, 8, PALETTE["wood2"])
    paper(draw, 67, 76, 30, 15, False)
    rect(draw, (104, 78, 118, 88), PALETTE["paper2"], PALETTE["line"])
    ellipse(draw, (137, 75, 152, 89), PALETTE["gold"])
    rect(draw, (171, 78, 184, 85), (24, 28, 37), PALETTE["line"])
    ellipse(draw, (30, 67, 42, 78), PALETTE["pink"])
    ellipse(draw, (210, 56, 225, 75), (238, 175, 95))
    return img


def home_repair():
    img, draw = canvas((12, 15, 21), (5, 6, 10))
    floor(draw, (24, 28, 33), 98)
    rect(draw, (59, 32, 103, 94), (92, 94, 89), PALETTE["line"])
    ellipse(draw, (63, 24, 99, 40), (113, 116, 109), PALETTE["line"])
    line(draw, [(103, 70), (139, 70), (139, 101)], PALETTE["cyan"], 2)
    rect(draw, (147, 85, 184, 99), PALETTE["wood"], PALETTE["line"])
    rect(draw, (151, 76, 175, 86), PALETTE["red"], PALETTE["line"])
    for x in range(0, 256, 18):
      line(draw, [(x, 123), (x + 23, 119)], (36, 70, 86))
    rect(draw, (202, 26, 238, 70), (73, 52, 32))
    return img


def burnout():
    img, draw = canvas((6, 7, 13), (2, 3, 7))
    floor(draw, (16, 13, 17), 101)
    rect(draw, (44, 80, 128, 104), (34, 34, 45), PALETTE["line"])
    rect(draw, (60, 66, 104, 84), (42, 44, 56), PALETTE["line"])
    ellipse(draw, (164, 78, 177, 89), (73, 48, 34))
    rect(draw, (184, 74, 202, 88), (32, 37, 48), PALETTE["line"])
    rect(draw, (88, 54, 103, 66), PALETTE["red"])
    rect(draw, (207, 50, 217, 92), (207, 137, 72))
    ellipse(draw, (199, 38, 225, 58), (236, 172, 88))
    return img


def ending_builder():
    img, draw = canvas((28, 37, 39), (9, 12, 16))
    rect(draw, (0, 96, 256, 144), (34, 27, 22))
    window(draw, 164, 18, 58, 48, PALETTE["gold"])
    table(draw, 44, 91, 154, 9, PALETTE["wood2"])
    laptop(draw, 129, 68, 34, PALETTE["deep"], PALETTE["green"])
    paper(draw, 70, 78, 28, 14, False)
    ellipse(draw, (54, 66, 65, 79), PALETTE["plant"])
    rect(draw, (55, 79, 64, 91), PALETTE["plant"])
    rect(draw, (101, 77, 112, 88), PALETTE["gold"], PALETTE["line"])
    rect(draw, (181, 70, 201, 87), (48, 54, 64), PALETTE["line"])
    return img


SCENES = {
    "hero": hero,
    "office": office,
    "okr-maze": okr_maze,
    "strategy-summit": strategy_summit,
    "doc-comments": doc_comments,
    "vp-review": vp_review,
    "reorg": reorg,
    "demo": demo,
    "team-good": team_good,
    "designer": designer,
    "agentic-engineers": agentic_engineers,
    "late-night": late_night,
    "ship": ship,
    "customer-community": customer_community,
    "support-queue": support_queue,
    "launch-flop": launch_flop,
    "family": family,
    "home-repair": home_repair,
    "burnout": burnout,
    "ending-builder": ending_builder,
}


def save_scene(scene_id: str, image: Image.Image) -> None:
    image = finish_scene(image)
    high = image.resize(TARGET_SIZE, Image.Resampling.NEAREST)
    # Add a tiny letterbox-safe vignette on the low-res source before scaling is
    # avoided so the edges stay crisp and game-like.
    high.save(OUT_DIR / f"{scene_id}.png", "PNG", optimize=True)


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for scene_id, factory in SCENES.items():
        save_scene(scene_id, factory())
    print(f"Wrote {len(SCENES)} local pixel-art scene PNGs to {OUT_DIR.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
