#!/usr/bin/env python3
"""Crop text-free regions from the seven reference images into optimised web assets.

Source images are 1672x941 PNGs with typography baked into the pixels.
Each crop below was audited visually to exclude baked text wherever possible.
Residual baked UI icons are documented in docs/CLAIMS-AND-EVIDENCE.md (asset audit).
"""
import glob, os, sys
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "references", "Seven presentation images")
OUT = os.path.join(ROOT, "public", "images")
os.makedirs(OUT, exist_ok=True)

files = sorted(glob.glob(os.path.join(SRC, "*.png")), key=lambda p: int(p.rsplit("-", 1)[1].split(".")[0]))
assert len(files) == 7, f"expected 7 reference images, found {len(files)}"
imgs = {i + 1: Image.open(p).convert("RGB") for i, p in enumerate(files)}

def inpaint(img, rect, sample, blur=8):
    """Replace a baked-text/icon rectangle with a stretched, blurred copy of a nearby clean region."""
    l, t, r, b = rect
    patch = img.crop(sample).resize((r - l, b - t), Image.LANCZOS).filter(ImageFilter.GaussianBlur(blur))
    img.paste(patch, (l, t))

# Remove baked headline/paragraph remnants that would otherwise sit inside our crops
inpaint(imgs[1], (560, 95, 786, 592), (780, 95, 792, 592), 6)      # image 1: title + tagline + paragraph area left of the character
inpaint(imgs[1], (1432, 104, 1498, 176), (1432, 24, 1498, 96), 5)      # image 1: jar icon near the shelf
inpaint(imgs[1], (1358, 488, 1432, 562), (1358, 408, 1432, 482), 5)    # image 1: coffee-cup icon above the kettle
inpaint(imgs[6], (700, 70, 818, 300), (818, 70, 830, 300), 6)      # image 6: "...le, / ...ple" headline remnants
inpaint(imgs[3], (172, 312, 352, 447), (175, 285, 350, 311), 16)    # image 3: "Help me make coffee" bubble (replaced by HTML bubble)
inpaint(imgs[2], (1284, 124, 1356, 196), (1180, 100, 1252, 172), 5) # image 2: key icon
inpaint(imgs[2], (1566, 484, 1642, 562), (1478, 484, 1554, 562), 5) # image 2: bin icon
inpaint(imgs[2], (1588, 120, 1650, 176), (1588, 180, 1650, 236), 6)   # image 2: milk icon
inpaint(imgs[7], (988, 52, 1048, 108), (1052, 52, 1112, 108), 5)   # image 7: house icon above person A
inpaint(imgs[2], (1085, 60, 1101, 362), (1068, 60, 1083, 362), 4)   # image 2: tile border sliver beside the kettle

# name: (image index, box (l, t, r, b), max width)
CROPS = {
    # Chapter 1 hero: character reaching into pantry; kettle, cup, cane, phone (title area inpainted above)
    "ch1-kitchen-hero": (1, (560, 0, 1672, 941), 1600),
    "ch1-kitchen-ambient": (1, (560, 0, 1672, 941), 960),
    # Verification: character's hand reaching to a jar on the pantry shelf (high-res region of image 1)
    "ch1-hand-jar": (1, (1180, 0, 1672, 640), 900),
    # Chapter 2: pouring the kettle (portrait) and close-up of the pour
    "ch2-pouring": (2, (845, 0, 1100, 720), 800),
    "ch2-pour-detail": (2, (725, 330, 1100, 720), 900),
    "tile-keys": (2, (1090, 95, 1360, 250), 800),
    "tile-fridge-milk": (2, (1385, 125, 1645, 250), 800),
    "tile-pantry-hand": (2, (30, 440, 300, 650), 800),
    "tile-laundry": (2, (380, 440, 640, 650), 800),
    "tile-bin": (2, (1270, 420, 1560, 595), 800),
    # Chapter 3: character speaking to phone (bubble inpainted; our HTML bubble sits in the same place)
    "ch3-voice-request": (3, (35, 335, 365, 705), 800),
    "ch3-complete-cup": (3, (1350, 335, 1672, 705), 800),
    # Pantry camera "feed" (clean shelf inset from image 4)
    "pantry-feed": (4, (842, 480, 1084, 606), 800),
    # Chapter 4 stage cards
    "ch4-mobile": (4, (35, 290, 362, 790), 800),
    "ch4-room-camera": (4, (592, 320, 1090, 790), 1000),
    "ch4-home-cameras": (4, (1145, 320, 1650, 790), 1000),
    # Chapter 6 co-design group (headline inpainted)
    "ch6-codesign": (6, (720, 0, 1672, 505), 1400),
    # Chapter 7 portraits (label pills excluded)
    "ch7-owner-cup": (7, (470, 300, 790, 740), 800),
    "ch7-person-a": (7, (995, 60, 1185, 195), 480),
    "ch7-person-b": (7, (1460, 90, 1680, 255), 480),
    "ch7-person-c": (7, (1040, 370, 1230, 500), 480),
    "ch7-person-d": (7, (1470, 485, 1680, 595), 480),
    "ch7-house": (7, (735, 350, 880, 500), 480),
}

def save(name, im, max_w, quality=84):
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + ".jpg"), "JPEG", quality=quality, optimize=True, progressive=True)
    im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=quality - 4, method=6)
    return im

report = []
for name, (idx, box, max_w) in CROPS.items():
    im = imgs[idx].crop(box)
    if name == "ch1-kitchen-ambient":
        im = im.filter(ImageFilter.GaussianBlur(18))
    out = save(name, im, max_w)
    report.append(f"{name:22s} <- image {idx} box={box} -> {out.width}x{out.height}")

# Soft-blurred backdrops for text-heavy chapters (keeps the house visually coherent)
for name, idx, box in [("bg-kitchen-soft", 1, (560, 0, 1672, 941)), ("bg-codesign-soft", 6, (720, 0, 1672, 505)), ("bg-homes-soft", 7, (780, 0, 1672, 720))]:
    im = imgs[idx].crop(box).filter(ImageFilter.GaussianBlur(10))
    out = save(name, im, 1400, 70)
    report.append(f"{name:22s} <- image {idx} box={box} blurred -> {out.width}x{out.height}")

print("\n".join(report))
total = sum(os.path.getsize(p) for p in glob.glob(os.path.join(OUT, "*")))
print(f"total asset size: {total/1024/1024:.2f} MB")
