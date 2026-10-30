import qrcode
from PIL import Image, ImageDraw, ImageFont
import os
import shutil
import math

# Target website URL encoded into the QR code
url = "https://sari67.github.io/codemint-technology-project/birthday.html"

# 1. Generate High-Res Standard QR Code (Clean & 100% Scannable)
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=3,
)
qr.add_data(url)
qr.make(fit=True)

qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
qr_output_path = os.path.abspath("birthday_qr_code.png")
qr_img.save(qr_output_path)
print(f"Standard QR Code generated: {qr_output_path} ({qr_img.size})")

# 2. Generate a Cute, Romantic Presentation Card (GitHub Link and Music Info Hidden)
card_w = 900
card_h = 1260
card = Image.new("RGBA", (card_w, card_h), (13, 4, 23, 255)) # Romantic dark midnight #0d0417

# Ambient glowing orbs
glow = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
glow_draw.ellipse((-80, -80, 500, 500), fill=(255, 67, 110, 65))
glow_draw.ellipse((460, 800, 1050, 1380), fill=(247, 208, 112, 50))
glow_draw.ellipse((220, 280, 780, 840), fill=(192, 132, 252, 45))
card = Image.alpha_composite(card, glow)
draw = ImageDraw.Draw(card)

# White rounded card frame for QR Code
box_w = 660
box_h = 660
box_x = (card_w - box_w) // 2
box_y = 340
draw.rounded_rectangle(
    [box_x, box_y, box_x + box_w, box_y + box_h],
    radius=32,
    fill=(255, 255, 255, 255),
    outline=(247, 208, 112, 220),
    width=4
)

# Place QR code centered inside white frame
qr_resized = qr_img.resize((580, 580), Image.Resampling.LANCZOS)
qr_x = (card_w - 580) // 2
qr_y = box_y + (box_h - 580) // 2
card.paste(qr_resized, (qr_x, qr_y), qr_resized)

# Helper function to draw cute vector hearts
def draw_heart(d, cx, cy, size, color):
    points = []
    for t_deg in range(0, 360, 4):
        t = math.radians(t_deg)
        x = 16 * (math.sin(t) ** 3)
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        points.append((cx + x * (size / 16.0), cy + y * (size / 16.0)))
    d.polygon(points, fill=color)

# Fonts configuration
font_title = None
font_sub = None
font_inst = None
font_sub_inst = None
font_footer = None

for font_path in [
    "C:/Windows/Fonts/georgiab.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/arial.ttf",
]:
    if os.path.exists(font_path):
        try:
            font_title = ImageFont.truetype(font_path, 44)
            font_sub = ImageFont.truetype(font_path, 25)
            font_inst = ImageFont.truetype(font_path, 27)
            font_sub_inst = ImageFont.truetype(font_path, 22)
            font_footer = ImageFont.truetype(font_path, 22)
            break
        except Exception:
            pass

if not font_title:
    font_title = font_sub = font_inst = font_sub_inst = font_footer = ImageFont.load_default()

def draw_centered(text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((card_w - tw) // 2, y), text, font=font, fill=fill)
    return tw

# 1. Top Decorative Golden Heart
draw_heart(draw, card_w // 2, 95, 14, (247, 208, 112, 255))

# 2. Header Title with Flanking Pink Hearts
title_text = "Happy Birthday Bharath!"
t_bbox = draw.textbbox((0, 0), title_text, font=font_title)
tw = t_bbox[2] - t_bbox[0]
tx = (card_w - tw) // 2
ty = 155
draw.text((tx, ty), title_text, font=font_title, fill=(255, 255, 255, 255))
draw_heart(draw, tx - 36, ty + 24, 18, (255, 67, 110, 255))
draw_heart(draw, tx + tw + 36, ty + 24, 18, (255, 67, 110, 255))

# 3. Subtitle
draw_centered("A Sweet Storybook Celebration Just For You", 235, font_sub, (247, 208, 112, 255))

# 4. Instructions (GitHub Link and Music Information Hidden)
draw_centered("Scan with your phone camera to open", 1040, font_inst, (255, 255, 255, 255))
draw_centered("Open camera on iPhone or Android and point at QR code", 1090, font_sub_inst, (247, 208, 112, 230))

# 5. Romantic Footer with Hearts
footer_txt = "Forever & Always  |  October 31"
bbox_f = draw.textbbox((0, 0), footer_txt, font=font_footer)
tw_f = bbox_f[2] - bbox_f[0]
fx = (card_w - tw_f) // 2
fy = 1165

draw.text((fx, fy), footer_txt, font=font_footer, fill=(247, 208, 112, 240))
draw_heart(draw, fx - 28, fy + 12, 12, (255, 67, 110, 255))
draw_heart(draw, fx + tw_f + 28, fy + 12, 12, (255, 67, 110, 255))

# Save romantic QR presentation card
card_output_path = os.path.abspath("birthday_qr_card.png")
card.save(card_output_path)
print(f"Romantic QR Presentation Card generated: {card_output_path}")

# Copy to conversation artifact directory if available
current_artifact_dir = r"C:\Users\Sarika\.gemini\antigravity\brain\b7f77f99-5e28-469f-a23b-96613526af9d"
if os.path.exists(current_artifact_dir):
    shutil.copy(qr_output_path, os.path.join(current_artifact_dir, "birthday_qr_code.png"))
    shutil.copy(card_output_path, os.path.join(current_artifact_dir, "birthday_qr_card.png"))
    print("Files successfully copied to conversation artifact directory.")
