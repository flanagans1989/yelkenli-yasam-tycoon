\# Yelkenli Yaşam Tycoon — MVP Yapım Planı V1.0



\## Belge Durumu



\- Durum: Kilitlendi

\- Sürüm: V1.0

\- İlgili ana belge: docs/01\_Oyun\_Anayasasi.md

\- Amaç: Ana tasarım dokümanlarında netleşen oyunu geliştirilebilir MVP iş planına çevirmek



\---



\## 1. MVP Amacı



Bu MVP’nin amacı, Yelkenli Yaşam Tycoon’un ana oyun döngüsünü çalışan, test edilebilir ve mobil uyumlu bir prototip haline getirmektir.



MVP, oyunun tüm hayallerini değil, çekirdek oynanışını göstermelidir.



MVP sonunda oyuncu şunları yapabilmelidir:



1\. Yeni oyun başlatmak

2\. Oyuncu profili seçmek

3\. Başlangıç marinası seçmek

4\. Başlangıç teknesi seçmek

5\. Liman modunda hazırlık yapmak

6\. İçerik üretmek

7\. Takipçi ve kredi kazanmak

8\. Tekne upgrade’i yapmak

9\. Rota seçmek

10\. Denize çıkmak

11\. Deniz modu risklerini yaşamak

12\. Yeni limana varmak

13\. Dünya turu ilerlemesini görmek

14\. 1 milyon takipçi ve okyanus hazırlık hedefini takip etmek



\---



\## 2. Ana Tasarım Kuralı



MVP şu soruya cevap vermelidir:



> Bu oyunun çekirdek döngüsü eğlenceli mi ve oyuncu bir tur daha oynamak istiyor mu?



MVP’de her şeyi yapmak zorunda değiliz.



Ama mutlaka şu his verilmelidir:



```text

İçerik üret → gelir kazan → tekneyi geliştir → rotaya çık → risk yaşa → yeni limana ulaş → büyü

```



\---



\## 3. MVP’de Olacak Ana Sistemler



| Sistem | MVP Durumu | Not |

|---|---|---|

| Yeni oyun başlangıç akışı | Dahil | Profil + marina + tekne seçimi |

| Oyuncu profilleri | Dahil | 6 profil |

| Başlangıç marinaları | Dahil | 10 marina |

| Başlangıç tekneleri | Dahil | 3 tekne |

| Liman modu | Dahil | Ana hub olarak |

| Deniz modu | Dahil | Rota ilerleme ve risk |

| Sosyal medya sistemi | Dahil | İçerik, takipçi, gelir |

| Tekne upgrade sistemi | Dahil | Basit ama hissedilir |

| Ekonomi sistemi | Dahil | Kredi, gelir, gider |

| Token sistemi | Simüle dahil | Gerçek ödeme yok |

| Kazanma şartları | Dahil | 3 hedef paneli |

| Save/load | Dahil | localStorage |

| Mobil uyum | Dahil | Responsive layout |

| Store ödeme sistemi | MVP dışı | İleri mobil sürüm |

| Gerçek reklam | MVP dışı | İleri mobil sürüm |

| 3D tekne modeli | MVP dışı | Gereksiz ağır |

| Multiplayer | MVP dışı | Öncelik değil |



\---



\## 4. MVP’de Olmayacaklar



MVP kapsamını büyütmemek için şu özellikler ilk sürümde yapılmayacaktır:



| Özellik | Neden MVP Dışı? |

|---|---|

| Gerçek ödeme / IAP | Önce oyun döngüsü test edilecek |

| Gerçek reklam entegrasyonu | Önce retention ve core loop |

| Loot box | İlk sürümde bilinçli olarak yok |

| Tam skill ağacı | Basit profil bonusları yeterli |

| Profil özel görevleri | Sonra eklenebilir |

| Profil özel final | Sonra eklenebilir |

| Gerçek zamanlı hava verisi | Karmaşık ve gereksiz |

| Tam fiziksel yelken simülasyonu | MVP için fazla ağır |

| Detaylı 3D tekne kesiti | Sonra görselleştirilebilir |

| Mürettebat yönetimi | Ana döngüyü karıştırır |

| Borç / kredi sistemi | Ekonomi fazla karmaşıklaşır |

| Sigorta sistemi | İleri sürüm |

| Kaptan Pass | MVP sonrası |

| LiveOps sezon sistemi | MVP sonrası |

| Global dil desteği | İlk temel Türkçe |



\---



\## 5. MVP Fazları



MVP yapımı 8 ana faza ayrılır.



| Faz | Amaç |

|---:|---|

| Faz 1 | Mevcut projeyi temizle ve yeni veri yapısını kur |

| Faz 2 | Yeni oyun başlangıç akışını oluştur |

| Faz 3 | Liman modunu kur |

| Faz 4 | Sosyal medya ve ekonomi döngüsünü kur |

| Faz 5 | Upgrade sistemini kur |

| Faz 6 | Rota ve deniz modunu kur |

| Faz 7 | Kazanma hedef panelini ve save/load’u tamamla |

| Faz 8 | Mobil uyum, test ve build kontrolü |



\---



\# 6. Faz 1 — Proje Temizliği ve Data Yapısı



\## Amaç



Eski prototip çöpe atılmayacak.  

Mevcut React + Vite + TypeScript altyapısı korunacak ama yeni dünya turu konseptine göre dönüştürülecek.



\## Yapılacaklar



| No | İş | Öncelik | Durum |

|---:|---|---|---|

| 1.1 | Mevcut dosya yapısını incele | Kritik | Bekliyor |

| 1.2 | Eski konsept metinlerini tespit et | Kritik | Bekliyor |

| 1.3 | Kullanılacak eski bileşenleri işaretle | Kritik | Bekliyor |

| 1.4 | Silinecek / dönüştürülecek yapıları belirle | Yüksek | Bekliyor |

| 1.5 | Ana game state modelini tasarla | Kritik | Bekliyor |

| 1.6 | Data dosyalarını oluştur | Kritik | Bekliyor |

| 1.7 | İlk build kontrolü yap | Kritik | Bekliyor |



\## Data Dosyaları



İlk oluşturulacak dosyalar:



```text

game-data/playerProfiles.ts

game-data/marinas.ts

game-data/boats.ts

game-data/routes.ts

game-data/upgrades.ts

game-data/socialPlatforms.ts

game-data/economy.ts

```



\## Faz 1 Çıkışı



Bu faz sonunda:



\- Proje çalışıyor olmalı

\- Build hatasız olmalı

\- Ana veri dosyaları hazır olmalı

\- Yeni oyun state modeli belirlenmiş olmalı



\---



\# 7. Faz 2 — Yeni Oyun Başlangıç Akışı



\## Amaç



Oyuncu yeni oyuna başladığında sırayla profil, marina ve tekne seçebilmeli.



\## Ekran Akışı



```text

Ana Menü

↓

Yeni Oyun

↓

Profil Seçimi

↓

Marina Seçimi

↓

Tekne Seçimi

↓

Tekneye İsim Ver

↓

Oyun Başlat

↓

Liman Modu

```



\## Yapılacaklar



| No | İş | Öncelik | Durum |

|---:|---|---|---|

| 2.1 | Ana menüyü yeni konsepte göre güncelle | Kritik | Bekliyor |

| 2.2 | Profil seçim ekranı oluştur | Kritik | Bekliyor |

| 2.3 | Profil detay modalı oluştur | Yüksek | Bekliyor |

| 2.4 | Marina seçim ekranı oluştur | Kritik | Bekliyor |

| 2.5 | Marina detay modalı oluştur | Yüksek | Bekliyor |

| 2.6 | Tekne seçim ekranı oluştur | Kritik | Bekliyor |

| 2.7 | Tekne detay modalı oluştur | Yüksek | Bekliyor |

| 2.8 | Tekneye isim verme alanı ekle | Orta | Bekliyor |

| 2.9 | Yeni oyun state’ini oluştur | Kritik | Bekliyor |

| 2.10 | Yeni oyunu localStorage’a kaydet | Kritik | Bekliyor |



\## MVP Profil Verisi



İlk sürümde 6 profil:



1\. Eski Kaptan

2\. İçerik Üreticisi

3\. Teknik Usta

4\. Maceracı Gezgin

5\. Sosyal Girişimci

6\. Aile / Yaşam Kanalı



\## MVP Marina Verisi



İlk sürümde 10 marina:



1\. Marmaris

2\. Göcek

3\. Fethiye

4\. Kaş

5\. Bodrum

6\. Kuşadası

7\. Çeşme

8\. Antalya

9\. İstanbul

10\. Yalova



\## MVP Tekne Verisi



İlk sürümde 3 tekne:



1\. Kırlangıç 28

2\. Denizkuşu 34

3\. Atlas 40



\---



\# 8. Faz 3 — Liman Modu



\## Amaç



Eski Hub sistemi yeni konseptte Liman Modu’na dönüştürülecek.



Liman modu oyuncunun ana karar ekranıdır.



\## Liman Modu Ana Blokları



| Blok | Açıklama |

|---|---|

| Marina bilgisi | Oyuncunun bulunduğu yer |

| Tekne özeti | Bakım, enerji, su, yakıt, güvenlik |

| Ana aksiyonlar | Upgrade, bakım, içerik, sponsor, rota |

| Günlük fırsat | Retention hissi |

| Son gelişmeler | Event log |

| Hedef paneli | Dünya turu, takipçi, okyanus hazırlığı |



\## Yapılacaklar



| No | İş | Öncelik | Durum |

|---:|---|---|---|

| 3.1 | Hub ekranını Liman Modu olarak güncelle | Kritik | Bekliyor |

| 3.2 | Marina bilgi kartı ekle | Kritik | Bekliyor |

| 3.3 | Tekne durum özeti ekle | Kritik | Bekliyor |

| 3.4 | Ana aksiyon kartlarını ekle | Kritik | Bekliyor |

| 3.5 | Bakım aksiyonu ekle | Yüksek | Bekliyor |

| 3.6 | Upgrade aksiyonu ekle | Kritik | Bekliyor |

| 3.7 | İçerik üret aksiyonu ekle | Kritik | Bekliyor |

| 3.8 | Sponsor alanı ekle | Orta | Bekliyor |

| 3.9 | Rota planla aksiyonu ekle | Kritik | Bekliyor |

| 3.10 | Event log’u liman olaylarına bağla | Yüksek | Bekliyor |



\## Faz 3 Çıkışı



Oyuncu limanda:



\- Tekne durumunu görebilmeli

\- İçerik üretebilmeli

\- Upgrade yapabilmeli

\- Bakım yapabilmeli

\- Rota seçmeye hazırlanabilmeli



\---



\# 9. Faz 4 — Sosyal Medya ve Ekonomi Döngüsü



\## Amaç



Oyuncu içerik üreterek takipçi ve kredi kazanabilmeli.



Bu faz, oyunun ilk gerçek “tycoon döngüsünü” kurar.



\## Platformlar



MVP’de aktif platformlar:



1\. ViewTube

2\. ClipTok

3\. InstaSea

4\. FacePort



LiveWave:



\- MVP’de pasif olabilir

\- veya basit “canlı yayın etkinliği” olarak sınırlı eklenebilir



\## Yapılacaklar



| No | İş | Öncelik | Durum |

|---:|---|---|---|

| 4.1 | Sosyal medya state yapısını kur | Kritik | Bekliyor |

| 4.2 | Platform takipçi değerlerini ekle | Kritik | Bekliyor |

| 4.3 | İçerik üretim ekranı oluştur | Kritik | Bekliyor |

| 4.4 | Platform seçimi ekle | Kritik | Bekliyor |

| 4.5 | İçerik türü seçimi ekle | Kritik | Bekliyor |

| 4.6 | İçerik kalite hesaplaması yap | Kritik | Bekliyor |

| 4.7 | Takipçi kazanımı hesapla | Kritik | Bekliyor |

| 4.8 | Kredi geliri hesapla | Kritik | Bekliyor |

| 4.9 | Viral şans sistemi ekle | Yüksek | Bekliyor |

| 4.10 | İçerik sonuç ekranı ekle | Kritik | Bekliyor |

| 4.11 | Event log kaydı oluştur | Yüksek | Bekliyor |



\## Basit İçerik Formülü



MVP için:



```text

İçerik Sonucu =

Profil Bonusu

\+ Platform Uyumu

\+ Lokasyon Bonusu

\+ Ekipman Bonusu

\+ Rastgelelik

```



\## Faz 4 Çıkışı



Oyuncu:



\- İçerik üretebilmeli

\- Takipçi kazanabilmeli

\- Kredi kazanabilmeli

\- Platform bazlı büyümeyi görebilmeli

\- İçerik sonucundan tatmin olmalı



\---



\# 10. Faz 5 — Tekne Upgrade Sistemi



\## Amaç



Oyuncu kazandığı krediyi teknesini geliştirmek için harcayabilmeli.



Upgrade sistemi oyunun ana tycoon motorudur.



\## MVP Upgrade Kategorileri



İlk MVP’de tüm 10 kategori olabilir ama her kategoride sınırlı parça kullanılmalıdır.



| Kategori | MVP Parça Sayısı |

|---|---:|

| Enerji | 3-4 |

| Navigasyon | 3 |

| Güvenlik | 3-4 |

| Yelken / Hız | 2-3 |

| Motor / Mekanik | 2-3 |

| Su / Yaşam | 2-3 |

| Konfor | 2-3 |

| İçerik Ekipmanı | 4 |

| Gövde / Bakım | 2-3 |

| Yardımcı Denizcilik | 2-3 |



\## Yapılacaklar



| No | İş | Öncelik | Durum |

|---:|---|---|---|

| 5.1 | Upgrade data dosyasını doldur | Kritik | Bekliyor |

| 5.2 | Upgrade kategorileri ekranı oluştur | Kritik | Bekliyor |

| 5.3 | Upgrade kartları oluştur | Kritik | Bekliyor |

| 5.4 | Maliyet kontrolü ekle | Kritik | Bekliyor |

| 5.5 | Satın alma işlemi ekle | Kritik | Bekliyor |

| 5.6 | Upgrade etkisini state’e uygula | Kritik | Bekliyor |

| 5.7 | Kurulum süresi mantığı ekle | Yüksek | Bekliyor |

| 5.8 | Büyük marina gereksinimi ekle | Orta | Bekliyor |

| 5.9 | Token hızlandırma simülasyonu ekle | Orta | Bekliyor |

| 5.10 | Okyanus hazırlık puanı etkisini bağla | Kritik | Bekliyor |



\## Faz 5 Çıkışı



Oyuncu:



\- Kredi harcayarak upgrade alabilmeli

\- Upgrade etkisini hissedebilmeli

\- Teknesinin daha iyi hale geldiğini görebilmeli

\- Okyanus hazırlık puanının arttığını fark edebilmeli



\---



\# 11. Faz 6 — Rota ve Deniz Modu



\## Amaç



Oyuncu rota seçip denize çıkabilmeli.  

Denizde süre, kaynak tüketimi, risk ve olaylar yaşanmalı.



\## Rota Akışı



```text

Rota seç

↓

Hazırlık kontrolünü gör

↓

Denize çık

↓

Seyir ilerler

↓

Risk / olay oluşur

↓

İçerik fırsatı doğar

↓

Varış ekranı

↓

Yeni liman

```



\## Yapılacaklar



| No | İş | Öncelik | Durum |

|---:|---|---|---|

| 6.1 | Rota data dosyasını doldur | Kritik | Bekliyor |

| 6.2 | Rota seçim ekranı oluştur | Kritik | Bekliyor |

| 6.3 | Hazırlık kontrol sistemi ekle | Kritik | Bekliyor |

| 6.4 | Denize çık butonu ve state geçişi ekle | Kritik | Bekliyor |

| 6.5 | Deniz modu ekranı oluştur | Kritik | Bekliyor |

| 6.6 | Seyir süresi hesaplaması ekle | Kritik | Bekliyor |

| 6.7 | Kaynak tüketimi ekle | Yüksek | Bekliyor |

| 6.8 | Basit deniz olayları ekle | Kritik | Bekliyor |

| 6.9 | Deniz içeriği üretme aksiyonu ekle | Yüksek | Bekliyor |

| 6.10 | Varış ekranı ekle | Kritik | Bekliyor |

| 6.11 | Dünya turu ilerlemesini güncelle | Kritik | Bekliyor |



\## MVP Deniz Olayları



İlk MVP’de 6-8 basit olay yeterlidir:



| Olay | Etki |

|---|---|

| Uygun rüzgar | Süre azalır |

| Değişken hava | Süre artabilir |

| Sert hava | Hasar riski + viral fırsat |

| Enerji düşüşü | İçerik ve navigasyon etkilenir |

| Küçük motor sorunu | Süre ve bakım etkisi |

| Yelken aşınması | Performans düşer |

| Harika görüntü fırsatı | Sosyal medya bonusu |

| Rota sapması | Süre ve kaynak tüketimi artar |



\## Faz 6 Çıkışı



Oyuncu:



\- Rota seçebilmeli

\- Hazırlık seviyesini görebilmeli

\- Denize çıkabilmeli

\- Deniz olayları yaşayabilmeli

\- Yeni limana varabilmeli

\- Dünya turu ilerlemesini görebilmeli



\---



\# 12. Faz 7 — Hedef Paneli, Kazanma Kontrolü ve Save/Load



\## Amaç



Oyuncunun uzun vadeli hedeflerini görmesi ve oyunun kaydedilmesi sağlanır.



\## Ana Hedef Paneli



Oyuncuya sürekli 3 hedef gösterilir:



```text

Dünya Turu: %...

Takipçi: ... / 1.000.000

Okyanus Hazırlığı: ... / 100

```



\## Yapılacaklar



| No | İş | Öncelik | Durum |

|---:|---|---|---|

| 7.1 | Dünya turu ilerleme yüzdesi hesapla | Kritik | Bekliyor |

| 7.2 | Toplam takipçi hesapla | Kritik | Bekliyor |

| 7.3 | Okyanus hazırlık puanı hesapla | Kritik | Bekliyor |

| 7.4 | Hedef paneli oluştur | Kritik | Bekliyor |

| 7.5 | Kazanma kontrol fonksiyonu yaz | Kritik | Bekliyor |

| 7.6 | Basit final ekranı oluştur | Yüksek | Bekliyor |

| 7.7 | Save/load sistemini güncelle | Kritik | Bekliyor |

| 7.8 | Yeni oyun / devam et akışını test et | Kritik | Bekliyor |

| 7.9 | Reset game seçeneği ekle | Orta | Bekliyor |



\## Faz 7 Çıkışı



Oyuncu:



\- Oyunu kapatıp devam edebilmeli

\- Hedeflerini görebilmeli

\- Kazanma şartlarına ne kadar kaldığını anlayabilmeli

\- Üçlü final hedefini takip edebilmeli



\---



\# 13. Faz 8 — Mobil UI, Test ve Build



\## Amaç



Oyun mobilde kullanılabilir hale getirilir ve build hataları temizlenir.



\## Mobil UI Kuralları



1\. Ana aksiyonlar kart yapısıyla gösterilir

2\. Butonlar parmakla rahat basılabilir olur

3\. TopBar sadeleştirilir

4\. Kritik değerler ikon/renk/metinle anlaşılır olur

5\. Sayfalar aşırı uzun ve boğucu olmaz

6\. Modal içerikleri kısa ve net olur

7\. İlk 5 dakika akıcı olur



\## Yapılacaklar



| No | İş | Öncelik | Durum |

|---:|---|---|---|

| 8.1 | Tüm ekranlarda mobil responsive kontrol yap | Kritik | Bekliyor |

| 8.2 | Ana aksiyon butonlarını mobil uyumlu yap | Kritik | Bekliyor |

| 8.3 | TopBar sadeleştir | Yüksek | Bekliyor |

| 8.4 | Kart boyutlarını düzenle | Yüksek | Bekliyor |

| 8.5 | Modal taşmalarını kontrol et | Yüksek | Bekliyor |

| 8.6 | İlk 5 dakika akış testi yap | Kritik | Bekliyor |

| 8.7 | Save/load testi yap | Kritik | Bekliyor |

| 8.8 | Ekonomi dengesi hızlı test yap | Yüksek | Bekliyor |

| 8.9 | Deniz modu test yap | Kritik | Bekliyor |

| 8.10 | `npm run build` çalıştır | Kritik | Bekliyor |

| 8.11 | Build hatalarını düzelt | Kritik | Bekliyor |



\## Faz 8 Çıkışı



Oyun:



\- Mobilde oynanabilir olmalı

\- Build hatasız olmalı

\- Yeni oyun başlatılabilmeli

\- Save/load çalışmalı

\- Ana döngü kopmadan ilerlemeli



\---



\# 14. MVP İlk 5 Dakika Akışı



Oyuncu ilk 5 dakikada oyunun vaadini görmelidir.



\## Akış



| Dakika | Oyuncu Ne Yapar? |

|---|---|

| 0:00 | Ana menüde oyunun vaadini görür |

| 0:30 | Profil seçer |

| 1:00 | Marina seçer |

| 1:30 | Tekne seçer |

| 2:00 | Teknesine isim verir |

| 2:30 | Liman moduna girer |

| 3:00 | İlk içeriğini üretir |

| 3:30 | Takipçi ve kredi kazanır |

| 4:00 | Tekne durumunu görür |

| 4:30 | İlk bakım/upgrade kararını verir |

| 5:00 | İlk rotaya hazırlanır |



İlk 5 dakika sonunda oyuncu şunu hissetmelidir:



> “Bu tekneyi geliştirip dünya turuna çıkaracağım.”



\---



\# 15. MVP Core Loop Testi



MVP tamamlandığında şu döngü sorunsuz çalışmalıdır:



```text

Yeni oyun başlat

↓

Profil seç

↓

Marina seç

↓

Tekne seç

↓

Liman moduna gir

↓

İçerik üret

↓

Kredi kazan

↓

Upgrade yap

↓

Rota seç

↓

Denize çık

↓

Risk yaşa

↓

İçerik üret

↓

Varış yap

↓

Yeni limanda devam et

```



Bu döngü çalışmıyorsa MVP tamam sayılmaz.



\---



\# 16. En Kritik MVP Ekranları



| Ekran | Öncelik |

|---|---|

| Ana Menü | Kritik |

| Profil Seçimi | Kritik |

| Marina Seçimi | Kritik |

| Tekne Seçimi | Kritik |

| Liman Modu | Kritik |

| İçerik Üretimi | Kritik |

| Upgrade Ekranı | Kritik |

| Rota Seçimi | Kritik |

| Deniz Modu | Kritik |

| Varış Ekranı | Kritik |

| Hedef Paneli | Kritik |

| Final Ekranı | Yüksek |

| Sponsor Ekranı | Orta |

| Günlük Görev Ekranı | Orta |



\---



\# 17. Kodlama Öncelik Sırası



Kodlama başladığında sıra şu olacaktır:



1\. Data dosyaları

2\. Game state modeli

3\. Yeni oyun başlangıç akışı

4\. Profil/marina/tekne seçim ekranları

5\. Liman modu

6\. Sosyal medya içerik üretimi

7\. Ekonomi / kredi sistemi

8\. Upgrade sistemi

9\. Rota seçimi

10\. Deniz modu

11\. Varış sistemi

12\. Hedef paneli

13\. Save/load

14\. Mobil UI düzenleme

15\. Build/test



\---



\# 18. Test Senaryoları



\## Test 1 — Yeni Oyun



Oyuncu:



1\. Yeni oyun başlatır

2\. Profil seçer

3\. Marina seçer

4\. Tekne seçer

5\. Tekneye isim verir

6\. Liman moduna girer



Beklenen sonuç:



\- Game state oluşur

\- Seçimler doğru kaydedilir

\- Kredi doğru hesaplanır

\- Save oluşur



\---



\## Test 2 — İçerik ve Gelir



Oyuncu:



1\. Limanda içerik üretir

2\. Platform seçer

3\. Sonuç alır



Beklenen sonuç:



\- Takipçi artar

\- Kredi artar

\- Event log kaydı oluşur

\- Platform bazlı değer güncellenir



\---



\## Test 3 — Upgrade



Oyuncu:



1\. Upgrade ekranına girer

2\. Parça satın alır

3\. Kredi düşer

4\. Tekne değeri artar



Beklenen sonuç:



\- Upgrade state’e işlenir

\- Kredi doğru azalır

\- Okyanus hazırlık puanı etkilenir



\---



\## Test 4 — Rota ve Deniz



Oyuncu:



1\. Rota seçer

2\. Hazırlık kontrolünü görür

3\. Denize çıkar

4\. Deniz olayı yaşar

5\. Varış yapar



Beklenen sonuç:



\- Rota ilerler

\- Kaynaklar değişir

\- Event log çalışır

\- Yeni liman güncellenir

\- Dünya turu yüzdesi artar



\---



\## Test 5 — Save / Load



Oyuncu:



1\. Oyun başlatır

2\. Birkaç aksiyon yapar

3\. Sayfayı kapatır

4\. Tekrar açar

5\. Devam eder



Beklenen sonuç:



\- Tüm ana veriler korunur

\- Seçilen profil/marina/tekne kaybolmaz

\- Takipçi/kredi/upgrade/rota verisi korunur



\---



\# 19. Başarı Kriterleri



MVP başarılı sayılmak için:



| Kriter | Hedef |

|---|---|

| Core loop çalışıyor | Evet |

| Yeni oyun akışı tamam | Evet |

| Sosyal medya gelir veriyor | Evet |

| Upgrade anlamlı etki ediyor | Evet |

| Rota ve deniz modu çalışıyor | Evet |

| Save/load çalışıyor | Evet |

| Mobilde kullanılabilir | Evet |

| Build hatasız | Evet |

| İlk 5 dakika sıkıcı değil | Evet |

| Oyuncu “bir tur daha” hissi alıyor | Evet |



\---



\# 20. MVP Sonrası İlk Genişletmeler



MVP çalıştıktan sonra öncelik sırası:



1\. Sponsor sistemi derinleştirme

2\. Günlük görevler

3\. Günlük marina fırsatları

4\. Günlük içerik trendleri

5\. Daha fazla deniz olayı

6\. Daha fazla upgrade

7\. Daha iyi rota haritası

8\. Final ekranını güçlendirme

9\. Basit rozet sistemi

10\. Mobil test build hazırlığı



\---



\# 21. MVP Denge Notları



İlk değerler kesin olmayacaktır.



Testte özellikle şunlara bakılacak:



1\. Başlangıç bütçesi yeterli mi?

2\. Kırlangıç 28 çok zor mu?

3\. Atlas 40 çok kolay mı?

4\. İçerik gelirleri fazla mı?

5\. Upgrade’ler çok pahalı mı?

6\. Rota süreleri sıkıcı mı?

7\. Deniz olayları çok sık mı?

8\. Okyanus hazırlık puanı çok kolay mı?

9\. 1 milyon takipçi hedefi ulaşılabilir mi?

10\. Oyuncu parasız kalınca toparlanabiliyor mu?



\---



\# 22. MVP İçin Net Kesim Kararları



MVP sırasında kapsam şişerse şu kesimler yapılabilir:



| Kesilecek Özellik | Neden |

|---|---|

| LiveWave | İlk MVP için ertelenebilir |

| Sponsor detayları | Basit sistem yeter |

| Tam upgrade süresi | Direkt satın al + etki uygulanabilir |

| Büyük marina gereksinimi | Basit kontrol yapılabilir |

| Günlük görev | İkinci prototipe kalabilir |

| Final ekranı detayları | Basit final yeter |

| Okyanus detayları | Ana puan sistemi yeter |

| Token detayları | Simüle ve sınırlı kalabilir |



Ama şu sistemler kesilmemelidir:



1\. Profil seçimi

2\. Marina seçimi

3\. Tekne seçimi

4\. Liman modu

5\. İçerik üretimi

6\. Kredi kazanma

7\. Upgrade

8\. Rota seçimi

9\. Deniz modu

10\. Save/load



\---



\# 23. Geliştirme Disiplini



Kodlama sırasında her büyük değişiklikten sonra:



```text

npm run build

```



çalıştırılacaktır.



Her tamamlanan iş için commit atılacaktır.



Commit örnekleri:



```text

data: oyuncu profilleri eklendi

data: marina verileri eklendi

data: tekne verileri eklendi

feat: profil secim ekrani eklendi

feat: liman modu eklendi

feat: icerik uretim sistemi eklendi

feat: upgrade sistemi eklendi

feat: deniz modu eklendi

fix: save load hatasi duzeltildi

docs: mvp plani guncellendi

```



\---



\# 24. GitHub Project Önerisi



Kodlamaya geçmeden önce GitHub Projects panosu kurulabilir.



Kolonlar:



1\. Backlog

2\. Hazır

3\. Kodda

4\. Test

5\. Tamam



İlk kartlar:



\- Data dosyaları

\- Game state modeli

\- Profil seçim ekranı

\- Marina seçim ekranı

\- Tekne seçim ekranı

\- Liman modu

\- Sosyal medya sistemi

\- Upgrade sistemi

\- Rota sistemi

\- Deniz modu

\- Save/load

\- Mobil test

\- Build kontrol



\---



\# 25. Kodlamaya Geçme Şartı



Kodlamaya başlamadan önce şu dokümanlar tamamlanmış olmalıdır:



| Dosya | Durum |

|---|---|

| docs/01\_Oyun\_Anayasasi.md | Tamam |

| docs/02\_Oyuncu\_Profilleri.md | Tamam |

| docs/03\_Baslangic\_Marinalari.md | Tamam |

| docs/04\_Baslangic\_Tekneleri.md | Tamam |

| docs/05\_Dunya\_Rotasi.md | Tamam |

| docs/06\_Liman\_ve\_Deniz\_Modu.md | Tamam |

| docs/07\_Tekne\_Upgrade\_Sistemi.md | Tamam |

| docs/08\_Sosyal\_Medya\_Sistemi.md | Tamam |

| docs/09\_Seyahat\_Suresi\_Formulu.md | Tamam |

| docs/10\_Token\_Sistemi.md | Tamam |

| docs/11\_Ekonomi\_Sistemi.md | Tamam |

| docs/12\_Kazanma\_Sartlari.md | Tamam |

| docs/13\_Mobil\_Magaza\_Stratejisi.md | Tamam |

| docs/14\_MVP\_Yapim\_Plani.md | Tamam |



\---



\# 26. Kilit Kararı



Bu belge MVP Yapım Planı V1.0 olarak kabul edilmiş ve kilitlenmiştir.



MVP’nin ana hedefi, Yelkenli Yaşam Tycoon’un çekirdek oynanış döngüsünü çalışan bir prototipe çevirmektir.



MVP şu döngüyü mutlaka çalıştırmalıdır:



```text

Profil seç → Marina seç → Tekne seç → Limanda hazırlan → İçerik üret → Kredi kazan → Upgrade yap → Rota seç → Denize çık → Risk yaşa → Yeni limana var → Büyü

```



Bu belge tamamlandıktan sonra ana tasarım dokümanlarının V1.0 seti tamamlanmış kabul edilir.



Sonraki ana aşama:



> Kodlamaya geçmeden önce GitHub proje durumunu kontrol etmek ve ardından game-data dosyalarını oluşturmaya başlamak.

