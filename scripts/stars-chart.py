# 知識星圖的星點位置：取自保井（澀川）春海〈天文分野之圖〉1677，京都大學數學教室圖書室所藏。
# 只用星的排列，網頁上不放掃描圖（使用者覺得紙底太亂）。
#
#   python3 scripts/stars-chart.py      （手動跑一次就好，需要 numpy、scipy、Pillow）
#
# 1. 從京都大學貴重資料數位典藏（IIIF）抓圓形星圖那一塊
# 2. 找出紙上印好的星點（黑點、朱點）：先用圓盤形的「開運算」去掉細線和筆畫，
#    再留下夠圓、夠實心、四周不擠（不是漢字）的墨點
# 3. 輸出星點座標 data/star-chart.json（以寬 2400 的裁切圖為準）
#    名詞要放在哪顆星，由 scripts/stars-data.mjs 在建置時決定
#
# 使用條件（京都大学数学教室貴重書ライブラリ利用上の注意 2024.01）：
# 教育・研究・學習（非營利）可以自由使用，不用申請；要標示
# 「京都大学理学研究科数学・数理解析専攻数学教室図書室所蔵」。
import io
import json
import subprocess

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

RECORD = "https://rmda.kulib.kyoto-u.ac.jp/item/rb00028825"
IIIF = "https://rmda.kulib.kyoto-u.ac.jp/iiif/3/RB00028825%2FRB00028825_00001_0.ptif"
REGION = (118, 1003, 6000, 6000)  # 原圖（6558×11583）上圓形星圖的範圍
WORK = 3000  # 偵測用的解析度
CROP = (150, 72, 2960, 2940)  # 在偵測圖上裁掉左邊的比例尺和襯紙、上下的框線
CENTER = (1468, 1463)  # 偵測圖上圓盤的中心（北極）與星區外圈半徑，量過
EDGE = 1236
OUT_W = 2400

url = f"{IIIF}/{','.join(map(str, REGION))}/{WORK},/0/default.jpg"
# 用 curl 抓（macOS 的 python.org 版 Python 沒有內建憑證）
raw = subprocess.run(["curl", "-sfL", "--max-time", "180", "-A", "Mozilla/5.0", url], check=True, capture_output=True).stdout
img = Image.open(io.BytesIO(raw)).convert("RGB")
im = np.asarray(img).astype(np.int16)
R, G, B = im[..., 0], im[..., 1], im[..., 2]
dark = im.min(axis=2) < 125  # 墨和朱都算（朱色的 G、B 很低）


def disk(r):
    y, x = np.ogrid[-r : r + 1, -r : r + 1]
    return x * x + y * y <= r * r


op = ndi.binary_opening(dark, structure=disk(3))
lab, n = ndi.label(op)
objs = ndi.find_objects(lab)
area = ndi.sum(op, lab, range(1, n + 1))
com = ndi.center_of_mass(op, lab, range(1, n + 1))
yy, xx = np.mgrid[-40:41, -40:41]
rad = np.hypot(xx, yy)
cx0, cy0 = CENTER
pts = []
for i, sl in enumerate(objs):
    h, w, a = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start, area[i]
    if not (40 <= a <= 520) or max(h, w) / max(1, min(h, w)) > 1.4 or a / (h * w) < 0.6:
        continue
    sy, sx = com[i]
    if np.hypot(sx - cx0, sy - cy0) > EDGE - 22:
        continue
    r0 = np.sqrt(a / np.pi)
    iy, ix = int(round(sy)), int(round(sx))
    win = dark[iy - 40 : iy + 41, ix - 40 : ix + 41]
    if win.shape != rad.shape:
        continue
    dens = win[(rad > r0 * 1.7 + 2) & (rad < r0 * 1.7 + 12)].mean()  # 旁邊擠滿墨＝漢字
    if dens > 0.14:
        continue
    m = lab[sl] == i + 1
    red = (R[sl][m].mean() - G[sl][m].mean()) > 35
    pts.append((sx, sy, r0, red))

# 太近的兩點只留一個
pts.sort(key=lambda p: -p[2])
keep = []
for p in pts:
    if all((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 > 12**2 for q in keep):
        keep.append(p)

x0, y0, x1, y1 = CROP
k = OUT_W / (x1 - x0)
P = sorted(
    [[round((p[0] - x0) * k, 1), round((p[1] - y0) * k, 1), round(p[2] * k, 1), 1 if p[3] else 0] for p in keep],
    key=lambda p: (p[1], p[0]),
)
chart = {
    "title": "天文分野之圖",
    "author": "保井春海（澀川春海）",
    "year": 1677,
    "credit": "京都大学理学研究科数学・数理解析専攻数学教室図書室所蔵",
    "source": RECORD,
    "size": OUT_W,  # 寬
    "h": round(OUT_W * (y1 - y0) / (x1 - x0)),
    "cx": round((cx0 - x0) * k, 1),
    "cy": round((cy0 - y0) * k, 1),
    "edge": round(EDGE * k, 1),
    "points": P,  # [x, y, 半徑, 朱點?]，座標以寬 size 的圖為準
}
with open("data/star-chart.json", "w") as fp:
    json.dump(chart, fp, ensure_ascii=False, separators=(",", ":"))
print(f"star-chart: {len(P)} 顆星點（朱 {sum(p[3] for p in P)}）")
