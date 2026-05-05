# Görev Listesi

Son güncelleme: 2026-05-05

## Durum Göstergeleri
- `[ ]` Bekliyor
- `[~]` Devam ediyor
- `[x]` Tamamlandı

---

## Aktif Görevler

### Oyun Mekaniği
- [ ] **Rozet / Başarı sistemi** — İlk içerik, ilk viral, ilk rota, 1K/10K/100K takipçi gibi başarılar. ADHD dostu görünürlük.
- [ ] **Kısa görev sistemi** — Her limanda 2–3 mini görev (örn. "Bu haftaki içeriğini yayınla", "Tekneyi doldur"). Tamamlanınca ödül.
- [ ] **Okyanus hazırlığı zorunluluğu** — `%60` altında rotaya çıkmayı engelle veya uyarı ver.
- [ ] **Kaynak yenileme** — Limandayken enerji/su/yakıt yenileme butonu (maliyetli).
- [ ] **Tekne hasarı onarımı** — Boatcondition `%40` altında limanda onarım seçeneği.

### İçerik & Ekonomi
- [ ] **İçerik geçmişi** — Son 10 içeriğin platformu, kalitesi ve kazancını gösteren liste.
- [ ] **Sponsor zorunluluğu takibi** — Kabul edilen sponsorun içerik yükümlülüğünü takip et.
- [ ] **Takipçi milestone kutlaması** — 1K, 10K, 100K geçişlerinde kutlama ekranı/banner.

### UI / UX
- [ ] **Avatar büyümesi** — Kaptan sekmesinde takipçi ve dünya ilerlemeye göre görsel rozet/rank göster.
- [ ] **Onboarding turu** — İlk oyunun ilk 2 dakikasında adım adım ipucu balonu.
- [ ] **Dark mode tutarlılığı** — Tüm kart renklerinin kontrast kontrolü.

### Teknik
- [ ] **App.tsx component bölünmesi** — 1400+ satır tek dosya; `HubScreen`, `SeaMode`, `Onboarding` gibi ayrı bileşenlere taşı.
- [ ] **Route guard** — `SEA_MODE`'a sadece geçerli rota varken geçilebilmeli.
- [ ] **localStorage migration** — save şeması değiştiğinde eski kayıt bozulmaması için versiyon ekle.

---

## Tamamlananlar

- [x] Ana menü + dalga animasyonu
- [x] Onboarding akışı (5 adım: profil → marina → tekne → isim → hub)
- [x] İçerik üretim V2 (platform + tür seçimi, kalite hesaplama)
- [x] Sponsor sistemi MVP (brand trust, tier sistemi, teklif kabul)
- [x] Tekne upgrade sistemi V2 (kategoriler, uyumluluk, efekt sistemi)
- [x] Sea Mode MVP (gün ilerletme, kaynak yönetimi, olaylar)
- [x] Varış ekranı + rota ilerlemesi
- [x] localStorage kayıt/yükleme sistemi
- [x] Flash animasyonu (kredi ve takipçi artışı)
- [x] Tab bildirim sistemi (kırmızı nokta)
- [x] Marina bölge filtresi (Ege / Akdeniz / Marmara)
