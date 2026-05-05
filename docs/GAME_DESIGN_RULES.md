# Oyun Tasarım Kuralları

## Hedef Kitle
ADHD dostu oyun hissi: görünür ilerleme, kısa görevler, anlık ödül, net eylem-sonuç döngüsü. Her eylem beklenmeden anında geri bildirim vermeli.

## Temel Döngü
```
İçerik Üret → Takipçi & Kredi Kazan → Tekne Upgrade Al → Rotaya Çık → Yeni Limana Var → Tekrar
```

## 6 Kaptan Profili
| ID | Güçlü | Zayıf |
|---|---|---|
| old_captain | Denizcilik | İçerik |
| content_creator | İçerik | Bakım maliyeti |
| technical_master | Teknik | Sponsor |
| adventure_traveler | Risk Yönetimi | Konfor |
| social_entrepreneur | Sponsor | Denizcilik |
| family_lifestyle | Yaşam Tarzı | Hız |

## 3 Tekne Sınıfı
| Sınıf | Uzunluk | Rol |
|---|---|---|
| small_28ft (Kırlangıç) | 28 ft | Yüksek emek, düşük maliyet |
| balanced_34ft (Deniz Kuşu) | 34 ft | En güvenli başlangıç |
| ocean_40ft (Atlas) | 40 ft | Premium, pahalı, güçlü |

## İçerik Kalite Sistemi
Kalite (0–100) şu faktörlerden hesaplanır:
- Baz: 40
- Profil content skoru × 5
- Platform + içerik türü eşleşmesi: +10 bonus
- Özel platform eşleşmesi (ViewTube/vlog, ClipTok/fırtına vb.): +10 bonus
- Satın alınan upgrade bonusları
- Rota içerik potansiyeli: `very_high`=+15, `high`=+10, `medium_high`=+5
- Rastgele: ±10

Viral şansı: kalite ≥85 → %25, ≥70 → %10, ≥40 → %3

## Sponsor Sistemi
- Brand Trust (0–100): içerik üretiminde artar, aşırı sponsorlukta düşer
- Her 3 sponsorlukta bir takipçi tepkisi eklenir
- Katmanlar: `economy.ts`'teki `getSponsorTierByFollowers()` fonksiyonu

## Kaynak Yönetimi (Sea Mode)
| Kaynak | Günlük düşüş | Kritik eşik |
|---|---|---|
| Enerji | 5 (upgrade ile 3) | %25 |
| Su | 4 (upgrade ile 2) | %25 |
| Yakıt | 3 | %25 |
| Tekne Durumu | Rastgele (upgrade azaltır) | %25 |

## Okyanus Hazırlığı
- Baz: Kırlangıç=%15, Deniz Kuşu=%30, Atlas=%45
- Upgrade bonusları eklenir, max %100
- Bu değer rotaya çıkabilmek için kritik eşik görevi görecek (henüz zorunlu değil)

## Dünya Rotası İlerlemesi
Rotalar sıralı: Yunan Adaları → Adriyatik → ... → Okyanusa
Her rota tamamlandığında `worldProgress` güncellenir.

## Ödül Tasarım İlkeleri
- Her eylemden hemen sonra TL veya takipçi flash animasyonu göster
- Quest kartı görünür ve tıklanabilir olmalı
- Yeni limana varışta kutlama ekranı (ARRIVAL_SCREEN)
- Viral içerik özel rozet ile işaretlenmeli
- Rozet / başarı sistemi: henüz yok → eklenmesi planlanıyor (bkz. TASK_LIST.md)

## Denge Notları
- Başlangıç bütçesi: `STARTING_BUDGET` (boats.ts'te)
- İlk içerik üretilmeden rota sekmesi bildirim göstermez
- social_entrepreneur profili sponsor ödülünü ×1.1 alır
