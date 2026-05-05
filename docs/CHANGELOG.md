# Değişiklik Günlüğü

Tarih formatı: YYYY-MM-DD

---

## [Yayınlanmamış]

### Planlanıyor
- Rozet / başarı sistemi
- Kısa görev sistemi
- Kaynak yenileme (limanda)
- App.tsx bileşen bölünmesi

---

## 2026-05-05

### Eklendi / İyileştirildi
- AI iş akışı dokümantasyonu oluşturuldu (`docs/` klasörü)
- PROJECT_CONTEXT, UI_RULES, GAME_DESIGN_RULES, AI_WORKFLOW, TASK_LIST, CHANGELOG dosyaları hazırlandı

---

## [Önceki Sürüm] — ~2026-05-04

### Commit: `style: unify game UI consistency`
- Tüm ekranlar arasında UI tutarlılığı sağlandı
- Ortak kart, buton ve tipografi stilleri hizalandı

### Commit: `feat(ux): improve game feel and onboarding feedback`
- Onboarding adımlarında animasyon ve görsel geri bildirim iyileştirildi
- Quest kartı ve tab bildirim (kırmızı nokta) sistemi eklendi
- Flash animasyonu (credits / followers) eklendi

### Commit: `style: onboarding ui polish pass`
- Onboarding ekranları mobil uyumluluk düzeltmeleri
- Profile, marina, tekne seçim kartları görsel iyileştirme

### Commit: `style: wave seamless loop fix - no jump on reset`
- Ana menü dalga animasyonu döngü başında atlama sorunu giderildi

---

## Kayıt Kuralları
- Her PR veya commit grubunu bu dosyaya ekle
- Format: `### Eklendi`, `### Değiştirildi`, `### Düzeltildi`, `### Kaldırıldı`
- Oyun mekanik değişiklikleri için GAME_DESIGN_RULES.md da güncellenmeli
- UI değişiklikleri için UI_RULES.md da güncellenmeli
