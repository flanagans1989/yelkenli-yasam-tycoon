# Proje Bağlamı

## Oyun Özeti
**Yelkenli Yaşam Tycoon** — Türkiye limanlarından başlayıp dünya turuna çıkan bir yelkenli yaşam simülasyonu. Oyuncu; kaptan profili seçer, marina ve tekne belirler, içerik üretir, sponsor anlaşmaları yapar ve rotaları tamamlayarak dünya turunu bitirir.

## Teknoloji Yığını
- **Framework:** React 19 + TypeScript (Vite)
- **Stil:** Tek CSS dosyası (`src/App.css`) — utility sınıflar + BEM benzeri bileşen sınıfları
- **State:** React useState, localStorage kayıt sistemi
- **Oyun Verisi:** `game-data/` klasöründe TS modülleri (boats, marinas, routes, economy, socialPlatforms, upgrades)

## Klasör Yapısı
```
src/
  App.tsx          ← tüm oyun mantığı ve UI tek dosyada
  App.css          ← tüm stiller
  main.tsx         ← React mount noktası
game-data/
  boats.ts         ← 3 tekne, başlangıç bütçesi
  marinas.ts       ← 10 marina (Ege, Akdeniz, Marmara)
  routes.ts        ← dünya rotaları (Yunan adaları → okyanusa)
  economy.ts       ← sponsor katmanları
  socialPlatforms.ts ← ViewTube, ClipTok, InstaSea, FacePort
  playerProfiles.ts  ← 6 kaptan profili
  upgrades.ts      ← tekne upgrade sistemi
docs/              ← AI iş akışı dokümantasyonu (bu klasör)
```

## Oyun Akışı (Step Makinesi)
```
MAIN_MENU → PICK_PROFILE → PICK_MARINA → PICK_BOAT → NAME_BOAT → HUB ↔ SEA_MODE → ARRIVAL_SCREEN
```

## Kayıt Sistemi
localStorage anahtarı: `yelkenli_save` — tüm state JSON olarak saklanır, her HUB/SEA_MODE değişiminde otomatik kaydedilir.

## Build Komutu
```bash
npm run build   # tsc -b && vite build
npm run dev     # geliştirme sunucusu
```
