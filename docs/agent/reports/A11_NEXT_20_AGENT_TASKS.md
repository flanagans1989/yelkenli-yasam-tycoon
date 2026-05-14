# A11 Next 20 Agent Tasks

## A11-T01
- Gorev ID: A11-T01
- Gorev adi: Baseline Stabilizasyon Kaniti
- Amac: build/lint/audit durumunu sabitlemek
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: komut sonuc tablosu var
- Calistirilacak komutlar: npm run build, npm run lint, npm run audit:game, npm run audit:mobile-ui
- Beklenen kanit: cikti ozeti + git status -sb
- Risk seviyesi: dusuk
- Kapsam: kucuk

## A11-T02
- Gorev ID: A11-T02
- Gorev adi: Step Transition Contract
- Amac: izinli/izinsiz step gecislerini netlestirmek
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: tum step seti ve illegal liste var
- Calistirilacak komutlar: rg -n "setStep\(|type Step" src
- Beklenen kanit: gecis tablosu
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T03
- Gorev ID: A11-T03
- Gorev adi: Transition Guard Kod Sertlestirme
- Amac: canTransition ve wrapper akisini tamamlamak
- Degistirilecek dosyalar: src/App.tsx
- Dokunulmayacak dosyalar: oyun veri dosyalari
- Kabul kriterleri: build/lint PASS, illegal gecis engelli
- Calistirilacak komutlar: npm run build, npm run lint
- Beklenen kanit: diff + komut ciktilari
- Risk seviyesi: orta
- Kapsam: orta

## A11-T04
- Gorev ID: A11-T04
- Gorev adi: Save Schema Envanteri
- Amac: save alan/fallback listesini cikarmak
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: alan-tip-fallback tablosu
- Calistirilacak komutlar: rg -n "SAVE_KEY|saveObj|localStorage" src
- Beklenen kanit: envanter tablosu
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T05
- Gorev ID: A11-T05
- Gorev adi: Save Failure Standardi
- Amac: parse/checksum/migration fallback standardi
- Degistirilecek dosyalar: src/lib/saveLoad.ts, src/App.tsx
- Dokunulmayacak dosyalar: game-data/**
- Kabul kriterleri: reason tipi + user-facing fallback mesajlari
- Calistirilacak komutlar: npm run build, npm run lint
- Beklenen kanit: diff + test ciktilari
- Risk seviyesi: yuksek
- Kapsam: kucuk

## A11-T06
- Gorev ID: A11-T06
- Gorev adi: Reload Dayaniklilik Senaryolari
- Amac: reload sonrasi kayip riskini checkliste baglamak
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: en az 8 senaryo
- Calistirilacak komutlar: npm run build
- Beklenen kanit: senaryo listesi
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T07
- Gorev ID: A11-T07
- Gorev adi: useEffect Risk Haritasi
- Amac: effect amac ve bagimlilik risklerini cizmek
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: effect listesi tamam
- Calistirilacak komutlar: rg -n "useEffect\(" src/App.tsx
- Beklenen kanit: effect tablosu
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T08
- Gorev ID: A11-T08
- Gorev adi: Timer Cleanup Denetimi
- Amac: setInterval/setTimeout cleanup durumunu denetlemek
- Degistirilecek dosyalar: docs/agent/reports/A11_RISK_REGISTER.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: cleanup eksikleri listelenir
- Calistirilacak komutlar: rg -n "setInterval\(|setTimeout\(|clearInterval\(|clearTimeout\(" src
- Beklenen kanit: timer envanteri
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T09
- Gorev ID: A11-T09
- Gorev adi: CSS Ownership Map
- Amac: selector sahipligini cizmek
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: global ve ekran bazli sahiplik listesi
- Calistirilacak komutlar: rg -n "^\.|@media" src/App.css src/components/*.css
- Beklenen kanit: ownership matrisi
- Risk seviyesi: yuksek
- Kapsam: kucuk

## A11-T10
- Gorev ID: A11-T10
- Gorev adi: Onboarding Collision Audit
- Amac: onboarding-global css cakismalarini bulmak
- Degistirilecek dosyalar: docs/agent/reports/A11_RISK_REGISTER.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: cakisma listesi
- Calistirilacak komutlar: rg -n "ob-|mico-|overflow|screen-actions" src/App.css src/components/Onboarding.css
- Beklenen kanit: collision listesi
- Risk seviyesi: yuksek
- Kapsam: kucuk

## A11-T11
- Gorev ID: A11-T11
- Gorev adi: Viewport Contract
- Amac: hedef viewport davranislarini sabitlemek
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: 390x667, 1366x768, 1600x900 maddeleri var
- Calistirilacak komutlar: npm run audit:mobile-ui
- Beklenen kanit: contract + audit sonucu
- Risk seviyesi: yuksek
- Kapsam: kucuk

## A11-T12
- Gorev ID: A11-T12
- Gorev adi: Layer Z-Index Audit
- Amac: overlay stack risklerini cizmek
- Degistirilecek dosyalar: docs/agent/reports/A11_RISK_REGISTER.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: kritik layer tablosu
- Calistirilacak komutlar: rg -n "z-index|position:\s*(fixed|sticky|absolute)" src/App.css src/components/*.css
- Beklenen kanit: layer tablosu
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T13
- Gorev ID: A11-T13
- Gorev adi: Magic Number Envanteri TSX
- Amac: px/ms sayilarini backloglamak
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: en az 30 item
- Calistirilacak komutlar: rg -n "\b\d{2,4}\b" src/App.tsx src/components/Onboarding.tsx
- Beklenen kanit: sayi listesi
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T14
- Gorev ID: A11-T14
- Gorev adi: Magic Number Envanteri CSS
- Amac: token disi boyutlarin listesi
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: en az 50 item
- Calistirilacak komutlar: rg -n "\b\d+px\b|\b\d+vh\b|\b\d+dvh\b" src/App.css src/components/Onboarding.css
- Beklenen kanit: css envanteri
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T15
- Gorev ID: A11-T15
- Gorev adi: Save Type Guard Plani
- Amac: parse sonrasi type guard planini netlestirmek
- Degistirilecek dosyalar: docs/agent/reports/A11_RISK_REGISTER.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: guard fonksiyon listesi
- Calistirilacak komutlar: rg -n "unknown|any|parsed" src/lib/saveLoad.ts src/App.tsx
- Beklenen kanit: guard plani
- Risk seviyesi: orta
- Kapsam: kucuk

## A11-T16
- Gorev ID: A11-T16
- Gorev adi: Unused Code Style Plani
- Amac: davranis degistirmeden temizlik adaylarini cikarmak
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: en az 15 aday
- Calistirilacak komutlar: npm run lint, rg -n "TODO|FIXME|deprecated" src
- Beklenen kanit: aday listesi
- Risk seviyesi: dusuk
- Kapsam: kucuk

## A11-T17
- Gorev ID: A11-T17
- Gorev adi: App.tsx Parcalama Plani
- Amac: no-behavior-change extraction sirasi
- Degistirilecek dosyalar: docs/agent/reports/A11_NEXT_20_AGENT_TASKS.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: asama sirasi + ownership
- Calistirilacak komutlar: (Get-Content src/App.tsx).Length
- Beklenen kanit: parcalama asamalari
- Risk seviyesi: orta
- Kapsam: orta

## A11-T18
- Gorev ID: A11-T18
- Gorev adi: Runtime Smoke Checklist Standardi
- Amac: PR sonrasi zorunlu smoke standardi
- Degistirilecek dosyalar: docs/agent/reports/A11_TECHNICAL_XRAY.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: 10+ adim checklist
- Calistirilacak komutlar: npm run build, npm run lint
- Beklenen kanit: checklist
- Risk seviyesi: dusuk
- Kapsam: kucuk

## A11-T19
- Gorev ID: A11-T19
- Gorev adi: Agent Task Contract
- Amac: 1 gorev 1 net cikti standardi
- Degistirilecek dosyalar: docs/agent/reports/A11_NEXT_20_AGENT_TASKS.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: zorunlu alanlar yazili
- Calistirilacak komutlar: git status -sb
- Beklenen kanit: contract metni
- Risk seviyesi: dusuk
- Kapsam: kucuk

## A11-T20
- Gorev ID: A11-T20
- Gorev adi: CI Minimum Pipeline Backlog
- Amac: build+lint+audit kapisini CI backloguna cevirmek
- Degistirilecek dosyalar: docs/agent/reports/A11_NEXT_20_AGENT_TASKS.md
- Dokunulmayacak dosyalar: src/**
- Kabul kriterleri: stage listesi + fail policy
- Calistirilacak komutlar: npm run build, npm run lint, npm run audit:game, npm run audit:mobile-ui
- Beklenen kanit: ci backlog
- Risk seviyesi: orta
- Kapsam: kucuk
