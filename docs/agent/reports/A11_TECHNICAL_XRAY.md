# A11 Technical X-Ray - Yelkenli Yasam Tycoon

Tarih: 2026-05-14
Branch: agent/day-02

## 1) Baseline
- npm run build: PASS
- npm run lint: PASS
- npm run audit:game: PASS
- npm run audit:mobile-ui: PASS

## 2) Repo Haritasi
- Giris: src/main.tsx, src/App.tsx
- Ana akis: src/components/Onboarding.tsx
- Oyun kabugu: src/components/HubScreen.tsx
- Save/load: src/lib/saveLoad.ts
- Oyun mantigi: src/lib/gameLogic.ts
- Global stil: src/App.css

## 3) Kritik Akislar
- Ilk acilis: WELCOME -> MAIN_MENU
- Kaptan secimi: PICK_PROFILE
- Liman secimi: PICK_MARINA
- Tekne secimi: PICK_BOAT
- Oyun girisi: HUB
- Rota/Seyir: SEA_MODE
- Varis: ARRIVAL_SCREEN -> HUB

## 4) Step Contract
Step tipi: WELCOME, ACCOUNT_SETUP, MAIN_MENU, PICK_PROFILE, PICK_MARINA, PICK_BOAT, NAME_BOAT, PICK_GENDER, HUB, SEA_MODE, ARRIVAL_SCREEN.

Kurallar:
- Onboarding step -> runtime step gecisinde sadece HUB izinli.
- Runtime step -> onboarding step gecisi engelli.
- Ayni step tekrari izinli.

## 5) Save/Load Failure Path
Mevcut korumalar:
- Checksum validation
- Migration
- Safe step load
- Upgrade queue normalize

Yeni standardizasyon:
- Save load failure reason tipi eklendi.
- loadGame icinde checksum, migration ve parse hatalari icin net fallback log/toast eklendi.

## 6) Effect/Timer Risk
- App.tsx icinde yogun useEffect ve timer var.
- Interval bloklari cleanup ile kapanıyor.
- Risk: buyuk dosya nedeniyle effect bagimliliklari zor takip ediliyor.

## 7) CSS/Viewport Guvenligi
- audit:mobile-ui artik PASS.
- Sticky CTA + short-screen + narrow-width kontrati App.css icinde sabitlendi.

## 8) Buyuk Dosya Riski
- App.tsx ~2500 satir
- App.css ~5900 satir
- Onboarding.tsx ~1000 satir

## 9) Runtime Smoke Checklist
1. Uygulama WELCOME ile acilir.
2. MAIN_MENU -> PICK_PROFILE calisir.
3. PICK_PROFILE CTA gorunur.
4. PICK_MARINA -> PICK_BOAT -> NAME_BOAT -> PICK_GENDER zinciri calisir.
5. HUB acilir ve tablar tepki verir.
6. Ilk icerik tutorial lock kuralina gore akar.
7. Rota baslatma SEA_MODE acilir.
8. Varis ekrani HUB'a doner.
9. Reload sonrasi save yuklenir.
10. Bozuk save crash yaratmaz.

## 10) Faz Durumu
- Faz 1 Stabilizasyon: TAMAM
- Faz 2 State sertlestirme: DEVAM (guard wrapper uygulandi)
- Faz 3 CSS izolasyon: KRITIK KISIM TAMAM
- Faz 4 Component temizlik: BASLAMADI
- Faz 5 Operasyon kapisi: BASLAMADI
