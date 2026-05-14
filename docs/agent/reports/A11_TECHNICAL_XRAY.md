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

## 12) Faz 3 - CSS Izolasyon Kaniti

### Selector Ownership Map (ozet)
- Global shell ve ortak UI: src/App.css
- Onboarding ekran ailesi: src/components/Onboarding.css
- Feature tab stilleri: src/components/*Tab.css

Ownership kurali:
- `.ob-*` selectorlari onboarding alanina ait.
- `.hub-*`, `.sea-*`, `.rt-*`, `.tk-*`, `.kp-*`, `.lh-*` selectorlari ilgili ekranlara ait.
- Ortak utility/helper kurallari sadece global dosyada tanimli tutulur.

### Onboarding Collision Audit (ozet)
- Riskli ortak siniflar: `.ui-helper-*`, `.ob-screen-actions`, `.primary-button`, `.secondary-button`
- Mevcut durum: mobile guardrail icin helper siniflar App.css tarafinda da tanimli.
- Kural: onboarding ozel varyantlar `.ob-profile-screen-v2 ...` scope'u ile override edilir.

### Viewport Contract
- 390x667: onboarding CTA her zaman gorunur, boat secimde sticky action aktif.
- 1366x768: body scrollbar yok, wrapper viewport icinde.
- 1600x900: layout tasmasi yok, ana CTA gorunur.

### Layer/Z-Index Audit (kritik)
- Toast: z-index 30
- Celebration modal: z-index 300
- Global floaters: z-index 9999
- Onboarding sticky actions: z-index 4-6

Kural:
- Overlay > screen action > content hiyerarsisi korunur.
- Yeni z-index eklenirse mevcut kritik katmanlarin ustune cikmamalidir (floaters haric).

### Faz 3 Cikis Durumu
- npm run audit:mobile-ui -> PASS
- build/lint/audit:game -> PASS
- Scroll/tasma/overlay regresyonu bu kontratta kapsandi.

## 13) Faz 4 - Component Temizlik (Davranis Degistirmeden)

### Buyuk Dosya Envanteri (guncel)
- src/App.tsx: 2566 satir
- src/App.css: 5991 satir
- src/components/Onboarding.tsx: 1005 satir
- src/components/Onboarding.css: 1983 satir

### Parcalama Sirasi (uygulama backlog)
1. App.tsx -> useGameProgressController (route, voyage, arrival)
2. App.tsx -> useEconomyController (credits, followers, sponsor)
3. App.tsx -> useSaveLoadController (save/load/fallback)
4. App.css -> onboarding/hub/sea katmanlari olarak fiziksel bolme

### Magic Number Backlog (ornekler)
- Timeouts: 5000, 2800, 30000
- Caps: 100, 50_000_000, 5_000_000
- Layout: 390px, 430px, 700px, 100dvh
- Onboarding map/path koordinatlari (tasarim sabiti olarak korunacak)

### Unused/Temizlik Adaylari
- App.css icinde A9R bloklari (a9r- prefiksi) ayrik dosyaya tasinabilir.
- Tekrarlayan media query bloklari birlestirme adayi.
- Global + onboarding helper sinif ciftleri ownership notu ile sadeleştirilebilir.

### Faz 4 Cikis Durumu
- Davranis degisikligi uygulanmadi.
- Envanter ve uygulanabilir parcalama backlogu olustu.
- build/lint/audit kapilari PASS.

## 14) Faz 5 - Operasyon ve Kalite Kapisi

Tamamlananlar:
- CI minimum pipeline eklendi: .github/workflows/ci.yml
- Asamalar: lint -> build -> audit:game -> audit:mobile-ui
- Trigger: push + pull_request

Task contract zorunlu alanlari:
- Gorev ID
- Net amac
- Dokunulacak dosyalar
- Dokunulmayacak dosyalar
- Kabul kriteri
- Calisacak komutlar
- Beklenen kanit paketi (komut sonucu + git status + degisen dosya listesi)

Faz 5 Cikis Durumu:
- Teslim sureci kisiye bagimli olmaktan cikarildi.
- Otomatik kalite kapisi tanimlandi.
