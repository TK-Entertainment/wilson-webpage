# 足跡地圖的打卡點

一個打卡點一個 `.yaml` 檔，檔名就是這個點的代號（英文、數字、連字號）。
新增一個點＝在這個資料夾加一個檔案；縣市會依座標自動判斷，不用填。

```yaml
name: 小琉球・花瓶岩        # 必填：地圖與清單上顯示的名稱
category: trip              # 必填：trip 旅行／life 生活／work 出差／wild 野外
date: "2026-08-20"          # 選填：可以只寫年份 "2025" 或年月 "2025-07"，沒寫就顯示「日期待補」
lat: 22.34                  # 必填：緯度
lng: 120.37                 # 必填：經度
text: 高中小琉球旅遊。      # 選填：一兩句話
album: xiaoliuqiu-2026      # 選填：連到「生活影像」的相簿（content/gallery 的檔名）
post: self-introduction     # 選填：連到「日常碎念」的文章（content/blog 的檔名）
url: https://example.com    # 選填：其他連結
```

座標可以在 Google 地圖對地點按右鍵複製，或用 OpenStreetMap 查。

## iPhone 捷徑「足跡打卡」

手機打卡用的捷徑由 `scripts/shortcut/build-checkin-shortcut.py` 產生：
拍照或選照片 → 抓位置（照片沒有位置就用目前位置）→ 名稱、分類、一句話 →
照片縮成 1600px JPEG（去掉 GPS 等資訊）上傳到 `public/img/places/<代號>/1.jpg…`，
最後把打卡資料寫成 `content/places/<代號>.json`，直接推到 Release。

- 代號是打卡時間，例如 `2026-10-26-153012`
- 照片會自動出現在地圖卡片，以及「生活影像」的月份打卡相簿（/gallery/checkins-2026-10）
- 資料有缺（例如沒抓到位置）只會跳過那一筆，不會讓網站建置失敗
