# A11 Risk Register

Tarih: 2026-05-14

## Risk 1 - Step gecis daginikligi
- Dosya: src/App.tsx, src/components/Onboarding.tsx
- Sebep: cok sayida gecis noktasi
- Etki: illegal step sicrama riski
- Seviye: yuksek
- Cozum: merkezi transition guard (kismen uygulandi)
- Agent gorevi: evet

## Risk 2 - Save/load reason standardi
- Dosya: src/lib/saveLoad.ts, src/App.tsx
- Sebep: parse/checksum/migration hatalari daginik
- Etki: kullaniciya belirsiz hata
- Seviye: yuksek
- Cozum: reason type + net fallback mesajlari (kismen uygulandi)
- Agent gorevi: evet

## Risk 3 - Monolit App.tsx
- Dosya: src/App.tsx
- Sebep: state/effect/render tek dosyada
- Etki: regresyon riski
- Seviye: yuksek
- Cozum: davranis degistirmeden parcalama plani
- Agent gorevi: evet

## Risk 4 - Monolit App.css
- Dosya: src/App.css
- Sebep: global selector yogunlugu
- Etki: ekranlar arasi yan etki
- Seviye: yuksek
- Cozum: selector ownership map
- Agent gorevi: evet

## Risk 5 - Responsive edge case tekrari
- Dosya: src/App.css, src/components/Onboarding.css
- Sebep: breakpoint sozlesmesi zayifligi
- Etki: CTA kaybi / tasma
- Seviye: yuksek
- Cozum: viewport contract + smoke matrix
- Agent gorevi: evet
