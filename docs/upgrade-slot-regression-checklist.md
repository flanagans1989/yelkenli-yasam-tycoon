# Upgrade Slot Regression Checklist (B3)

Bu checklist, 3 paralel tekne upgrade slot sistemi için manuel regresyon doğrulaması içindir.

## Scope

- 3 paralel upgrade slot davranışı
- Tamamlanma, reload/offline, legacy save uyumluluğu
- Tekne ekranı install status görünürlüğü
- İlgisiz sistemlerde regresyon kontrolü

## Preconditions

- Oyunda Tekne sekmesine erişilebilen bir kayıt/senaryo.
- Birden fazla upgrade başlatabilecek kadar kredi.
- Mümkünse kısa süreli upgrade kombinasyonları (hızlı doğrulama için).

## Test Cases

### 1) Tek upgrade başlatma
- [ ] Tekne sekmesinden bir uyumlu upgrade başlat.
- [ ] Upgrade aktif slot listesinde görünür.
- [ ] Kredi doğru düşer.
- [ ] Slot satırında kalan süre görünür.

### 2) 2 paralel upgrade başlatma
- [ ] Farklı bir ikinci upgrade başlat.
- [ ] Slot 1 ve Slot 2 ayrı satırlarda görünür.
- [ ] Her ikisinin timer’ı bağımsız ilerler.

### 3) 3 paralel upgrade başlatma
- [ ] Üçüncü farklı upgrade başlat.
- [ ] 3 slot da dolu görünür.
- [ ] Üç satır da ad + süre ile okunur.

### 4) 4. upgrade engeli
- [ ] 3 slot doluyken yeni bir upgrade başlatmayı dene.
- [ ] Başlatma engellenir (`Slot Dolu` veya eşdeğer disabled durum).
- [ ] Ek kredi düşümü olmaz.

### 5) Aynı upgrade’i iki kez başlatma engeli
- [ ] Aktif kurulumdaki bir upgrade kartında tekrar başlatmayı dene.
- [ ] Aynı upgrade ikinci kez başlamaz.
- [ ] Slot sayısı artmaz, kredi tekrar düşmez.

### 6) Active upgrade varken refresh/reload
- [ ] 1-3 upgrade aktifken sayfayı yenile.
- [ ] Aktif upgrade satırları geri yüklenir.
- [ ] Kalan süreler mantıklı görünür (negatif/bozuk değil).

### 7) Bir upgrade tamamlanırken diğerlerinin devam etmesi
- [ ] Bir slot tamamlanana kadar bekle.
- [ ] Tamamlanan upgrade purchased olur.
- [ ] Diğer aktif upgrade satırları korunur ve devam eder.

### 8) Aynı interval içinde birden fazla tamamlanma
- [ ] Süreleri yakın iki upgrade başlat (veya bekleme ile eşzamanlı tamamlanma yakala).
- [ ] İkisi de tamamlanır, ikisi de purchased olur.
- [ ] Aynı upgrade effect’i/log/toast tekrar etmez.

### 9) Offline completion (uygulamayı kapatıp sonra açma)
- [ ] 1-3 aktif upgrade varken oyunu kapat.
- [ ] Tamamlanma süresini geçecek kadar bekleyip tekrar aç.
- [ ] Süresi dolanların hepsi tamamlanmış olur.
- [ ] Offline log mesajı tekil/çoğul tamamlanmayı doğru yansıtır.

### 10) Legacy save uyumluluğu (`upgradeInProgress`)
- [ ] Eski tek-slot save (legacy `upgradeInProgress`) yükle.
- [ ] Aktif upgrade slot 0’a güvenli şekilde dönüştürülür.
- [ ] Tamamlanma akışı bozulmadan devam eder.

### 11) Purchased upgrade tekrar satın alınamaması
- [ ] Tamamlanmış bir upgrade kartında tekrar satın alma dene.
- [ ] CTA blocked/owned durumda kalır, tekrar satın alınamaz.

### 12) Upgrade effect’lerinin tek sefer uygulanması
- [ ] Bir upgrade tamamlandığında ilgili stat etkisini not et.
- [ ] Reload / interval sonrası aynı upgrade için ikinci kez artış olmadığını doğrula.

### 13) Tekne install card satır okunabilirliği
- [ ] `KURULUM SÜRÜYOR` kartında her slot satırı düzenli görünür.
- [ ] Format: `Slot N · Upgrade Adı` + alt satırda `X dakika kaldı`.
- [ ] Satırlar birbirine yapışık veya kayık görünmez.

### 14) Progress strip / tavsiye davranışı
- [ ] Slotlar dolu değilken upgrade önerisi akışının normal çalıştığını doğrula.
- [ ] Slotlar doluyken öneri/aksiyonların çelişkili duruma düşmediğini doğrula.

### 15) İlgisiz sistem regresyonu
- [ ] İçerik üretim cooldown akışı normal.
- [ ] Rota başlatma/varış akışı normal.
- [ ] Sponsor teklif/accept akışı normal.
- [ ] Sea mode ve onboarding akışı normal.

## Known Risks To Watch

- Aynı upgrade’in farklı completion yoluyla (interval + reload/offline) iki kez uygulanması.
- Slot doluyken yanlışlıkla kredi düşümü.
- Offline toplu tamamlanmada log/toast metninin tek upgrade gibi görünmesi.
- Legacy save dönüşümünde geçersiz `upgradeId` veya hatalı `completesAt` kaynaklı sessiz bozulma.

## How To Test On Mobile

- 390x667 ve 360x800 viewport’ta test et.
- Tekne sekmesinde 1/2/3 aktif slot satırının kart içinde taşmadan okunduğunu doğrula.
- CTA butonlarının alt navigasyon arkasına düşmediğini kontrol et.
- Reload sonrası slot satırlarının mobilde de doğru hizalandığını doğrula.
