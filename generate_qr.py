import qrcode
from PIL import Image, ImageDraw, ImageFont
import os
import shutil
import math

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

# 2. Generate a Cute, Romantic Presentation Card
card_w = 900
card_h = 1260
card = Image.new("RGBA", (card_w, card_h), (13, 4, 23, 255)) # Dark romantic #0d0417

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
box_y = 350
draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h], radius=32, fill=(255, 255, 255, 255), outline=(247, 208, 112, 220), width=4)

# Place QR code
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
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        points.append((cx + x * (size / 16.0), cy + y * (size / 16.0)))
    d.polygon(points, fill=color)

# Draw decorative hearts around header
draw_heart(draw, 140, 170, 22, (255, 67, 110, 255))
draw_heart(draw, 760, 170, 22, (255, 67, 110, 255))
draw_heart(draw, 450, 100, 16, (247, 208, 112, 255))

# Load clean fonts
font_title = None
font_sub = None
font_inst = None
font_footer = None

for font_path in [
    "C:/Windows/Fonts/georgiab.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]:
    if os.path.exists(font_path):
        try:
            font_title = ImageFont.truetype(font_path, 44)
            font_sub = ImageFont.truetype(font_path, 26)
            font_inst = ImageFont.truetype(font_path, 25)
            font_footer = ImageFont.truetype(font_path, 21)
            break
        except Exception:
            pass

if not font_title:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_inst = ImageFont.load_default()
    font_footer = ImageFont.load_default()

def draw_centered(text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((card_w - tw) // 2, y), text, font=font, fill=fill)

draw_centered("Happy Birthday Bharath!", 150, font_title, (255, 255, 255, 255))
draw_centered("A Sweet Storybook Celebration Just For You", 230, font_sub, (247, 208, 112, 255))

draw_centered("Scan with your phone camera to open", 1045, font_inst, (255, 220, 235, 255))
draw_centered("sari67.github.io/codemint-technology-project/birthday.html", 1095, font_footer, (200, 190, 220, 255))

# Footer with cleanly framed hearts
footer_txt = "Forever & Always  |  October 31"
bbox_f = draw.textbbox((0, 0), footer_txt, font=font_footer)
tw_f = bbox_f[2] - bbox_f[0]
fx = (card_w - tw_f) // 2
fy = 1165

draw.text((fx, fy), footer_txt, font=font_footer, fill=(247, 208, 112, 240))
draw_heart(draw, fx - 26, fy + 12, 11, (255, 67, 110, 255))
draw_heart(draw, fx + tw_f + 26, fy + 12, 11, (255, 67, 110, 255))

card_output_path = os.path.abspath("birthday_qr_card.png")
card.save(card_output_path)
print(f"Romantic QR Presentation Card generated: {card_output_path}")

# Copy to artifacts directory
artifact_dir = r"C:\Users\Sarika\.gemini\antigravity\brain\f7a88468-03c5-444d-872c-f24c5d80e7af"
if os.path.exists(artifact_dir):
    shutil.copy(qr_output_path, os.path.join(artifact_dir, "birthday_qr_code.png"))
    shutil.copy(card_output_path, os.path.join(artifact_dir, "birthday_qr_card.png"))
    print("Files successfully copied to artifact directory.")
