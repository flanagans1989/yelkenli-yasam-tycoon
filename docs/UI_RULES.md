# UI Kuralları

## Genel Yön
Dopamin-zengin, premium, animasyonlu, modern, mobil-öncelikli tasarım. Her sayfa görsel olarak tutarlı olmalı.

## Renk Paleti
| Kullanım | Değer |
|---|---|
| Ana mavi | `#0e64a0` |
| Koyu deniz | `#071d2e` |
| Vurgu yeşil | `#2ec4a0` |
| Uyarı sarı | `#f5a623` |
| Tehlike kırmızı | `#e05252` |
| Kart arka planı | `rgba(255,255,255,0.07)` |

## Tipografi
- Başlıklar: büyük, bold, letter-spacing ile
- Alt etiketler: `card-label` sınıfı — küçük, uppercase, hafif opaklık
- Rakamlar: `toLocaleString("tr-TR")` ile formatla (örn. `47.000`)

## Bileşen Sınıfları (App.css'te tanımlı)
| Sınıf | Kullanım |
|---|---|
| `btn-primary` | Ana eylem butonu |
| `btn-secondary` | Geri / alternatif eylem |
| `btn-text` | Metin linkleri |
| `fade-in` | Sayfa/kart geçiş animasyonu |
| `pulse` / `pulse-btn` | Dikkat çeken eylem |
| `flash-green` | Kaynak artışı flash efekti |
| `transparent-card` | Yarı saydam cam kart |
| `slide-up` | Alt sheet animasyonu |

## Animasyon İlkeleri
- Yeni ekranda her zaman `fade-in` kullan
- Kaynak kazanımında `flash-green` sınıfını 600ms tetikle
- Ana eylem butonu `pulse` ile vurgula (ilk görevde)
- Geçiş: CSS transition, JS animasyon kütüphanesi kullanma

## Mobil Öncelik
- Minimum dokunma hedefi: 44px
- Alt navigasyon bar sabit, 5 sekme: Liman / İçerik / Rota / Tekne / Kaptan
- Liste öğeleri tam genişlik, scroll edilebilir
- Modal yerine alt sheet veya yerinde açılan kart kullan

## Kaynak Barları (Sea Mode)
- `%25` altında: kırmızı (`#e05252`)
- `%25–50`: sarı (`#f5a623`)
- `%50+`: tematik renk (enerji=yeşil, su=mavi, yakıt=gri-mavi)

## Bildirim Sistemi
- Tab üzerinde kırmızı nokta: `tab-notif` sınıfı
- Görev kartı: `quest-card` — tamamlandığında `done` sınıfı ekle
- Log girişleri: `event-log-compact` > `log-entry` — en fazla 5 satır göster

## Yeni Ekran Eklerken Kontrol Listesi
- [ ] `fade-in` sınıfı var mı?
- [ ] Mobilde kaydırma çalışıyor mu?
- [ ] Boş durum mesajı var mı?
- [ ] Türkçe karakter hatası yok mu? (`toLocaleLowerCase("tr-TR")`)
