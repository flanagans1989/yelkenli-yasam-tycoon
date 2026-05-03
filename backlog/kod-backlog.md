\# Yelkenli Yaşam Tycoon — Kod Backlog



\## Dosya Amacı



Bu dosya, Yelkenli Yaşam Tycoon projesinde ileride kodlanacak işleri takip etmek için kullanılır.



Ana kural:



> Tasarım netleşmeden kod yazılmaz.



Bu backlog, tasarım dokümanları V1.0 olarak kilitlendikten sonra kodlama sırasını belirlemek için kullanılacaktır.



\---



\## Mevcut Teknik Yön



\- Ana teknoloji: React + Vite + TypeScript

\- İlk hedef: Browser prototip

\- İleri hedef: Mobil mağazalara uygun sürüm

\- Hedef platformlar:

&#x20; - Web prototip

&#x20; - Google Play

&#x20; - App Store



Mevcut eski prototip tamamen çöpe atılmayacaktır.



Korunacak / dönüştürülecek eski sistemler:



| Sistem | Durum |

|---|---|

| Ana menü | Yeni konsepte göre dönüştürülecek |

| GameShell | Korunacak ve güncellenecek |

| TopBar | Yeni ekonomi / takipçi / rota bilgilerine göre güncellenecek |

| Hub | Liman modu ana ekranına dönüştürülecek |

| Rota sistemi | Dünya turu rotasına dönüştürülecek |

| İçerik sistemi | Sosyal medya sistemine dönüştürülecek |

| Sponsor sistemi | Profil ve platform uyumuna göre genişletilecek |

| Mağaza sistemi | Tekne upgrade ve token sistemiyle genişletilecek |

| Event Log | Deniz seyri, kriz, içerik ve sponsor olayları için korunacak |

| Modal sistemi | Korunacak |

| localStorage | İlk save sistemi olarak korunacak, ileride cloud save’e uygun tasarlanacak |



\---



\## Durum Etiketleri



| Durum | Anlamı |

|---|---|

| Bekliyor | Henüz başlanmadı |

| Hazır | Tasarımı netleşti, kodlanabilir |

| Kodda | Üzerinde çalışılıyor |

| Test | Kodlandı, test ediliyor |

| Tamam | Kodlandı ve test edildi |

| Ertelendi | İleri sürüme bırakıldı |

| İptal | Kodlanmayacak |



\---



\## Öncelik Etiketleri



| Öncelik | Anlamı |

|---|---|

| Kritik | Oyun çalışması için şart |

| Yüksek | MVP için gerekli |

| Orta | İlk sürümde olabilir |

| Düşük | İleri sürüm işi |



\---



\## Faz 1 — Proje Temizliği ve Hazırlık



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 1.1 | Mevcut dosya yapısını incele | Kritik | Bekliyor | Eski prototipin hangi parçaları kalacak belirlenecek. |

| 1.2 | Eski konsept metinlerini tespit et | Yüksek | Bekliyor | Yeni dünya turu konseptine uymayan metinler değişecek. |

| 1.3 | Ana state yapısını incele | Kritik | Bekliyor | Oyuncu profili, marina, tekne, rota, ekonomi verisi için temel hazırlanacak. |

| 1.4 | localStorage save yapısını incele | Kritik | Bekliyor | Eski kayıt sistemi yeni oyun verisine uyarlanacak. |

| 1.5 | Build kontrolü yap | Kritik | Bekliyor | Her büyük değişiklikten önce ve sonra `npm run build`. |



\---



\## Faz 2 — Game Data Dosyaları



Amaç: Oyunun temel verilerini koddan ayırmak ve düzenli data dosyalarında tutmak.



| No | Kod İşi | Dosya | Öncelik | Durum | Not |

|---:|---|---|---|---|---|

| 2.1 | Oyuncu profilleri data dosyasını oluştur | game-data/playerProfiles.ts | Kritik | Bekliyor | 6 profil burada tanımlanacak. |

| 2.2 | Başlangıç marinaları data dosyasını oluştur | game-data/marinas.ts | Kritik | Bekliyor | Türkiye marinaları ve bonusları. |

| 2.3 | Başlangıç tekneleri data dosyasını oluştur | game-data/boats.ts | Kritik | Bekliyor | 28 ft, 34 ft, 40 ft tekneler. |

| 2.4 | Dünya rotası data dosyasını oluştur | game-data/routes.ts | Kritik | Bekliyor | Etaplar, risk, süre, gereksinimler. |

| 2.5 | Tekne upgrade data dosyasını oluştur | game-data/upgrades.ts | Kritik | Bekliyor | Enerji, navigasyon, güvenlik, motor, su, konfor, içerik ekipmanı. |

| 2.6 | Sosyal medya platformları data dosyasını oluştur | game-data/socialPlatforms.ts | Kritik | Bekliyor | ViewTube, ClipTok, InstaSea, FacePort, LiveWave. |

| 2.7 | Ekonomi data dosyasını oluştur | game-data/economy.ts | Kritik | Bekliyor | Kredi, gelir, gider, token, bakım, marina. |



\---



\## Faz 3 — Yeni Oyun Başlangıç Akışı



Amaç: Oyuncunun yeni oyuna başladığında profil, marina ve tekne seçerek oyuna girmesini sağlamak.



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 3.1 | Yeni oyun başlat ekranını güncelle | Kritik | Bekliyor | Eski ana menü yeni konsepte göre değişecek. |

| 3.2 | Oyuncu profili seçim ekranı oluştur | Kritik | Bekliyor | 6 profil kartı olacak. |

| 3.3 | Profil detay modalı oluştur | Yüksek | Bekliyor | Hikaye, avantaj, dezavantaj, skill gösterilecek. |

| 3.4 | Başlangıç marinası seçim ekranı oluştur | Kritik | Bekliyor | Türkiye başlangıç noktaları. |

| 3.5 | Başlangıç teknesi seçim ekranı oluştur | Kritik | Bekliyor | 3 tekne sınıfı. |

| 3.6 | Yeni oyun state’ini oluştur | Kritik | Bekliyor | Seçilen profil + marina + tekne kayda geçecek. |

| 3.7 | İlk oyun kaydını localStorage’a yaz | Kritik | Bekliyor | Oyuncu çıkıp girince oyun devam etmeli. |



\---



\## Faz 4 — Liman Modu



Amaç: Hub ekranını yeni konseptte “Liman Modu” ana ekranına dönüştürmek.



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 4.1 | Hub ekranını Liman Modu olarak yeniden adlandır | Kritik | Bekliyor | Eski Hub yeni liman merkezi olacak. |

| 4.2 | Liman aksiyon kartlarını ekle | Kritik | Bekliyor | Upgrade, bakım, içerik, sponsor, alışveriş, rota. |

| 4.3 | Marina bilgisini göster | Yüksek | Bekliyor | Oyuncunun bulunduğu marina. |

| 4.4 | Günlük marina fırsatı alanı ekle | Orta | Bekliyor | LiveOps temeli. |

| 4.5 | Liman içeriği üret butonu ekle | Yüksek | Bekliyor | Sosyal medya sistemine bağlanacak. |

| 4.6 | Limanda upgrade yapma akışı ekle | Kritik | Bekliyor | Büyük upgrade sadece limanda. |



\---



\## Faz 5 — Deniz Modu



Amaç: Rota ve seyir sistemini “Deniz Modu” haline getirmek.



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 5.1 | Rota seçme ekranını güncelle | Kritik | Bekliyor | Dünya turu etapları gösterilecek. |

| 5.2 | Seyre çıkma butonu oluştur | Kritik | Bekliyor | Limandan denize geçiş. |

| 5.3 | Deniz Modu ekranı oluştur | Kritik | Bekliyor | Seyir süresi, hava, enerji, su, yakıt, risk. |

| 5.4 | Seyir ilerleme sistemi ekle | Kritik | Bekliyor | Zaman / etap ilerlemesi. |

| 5.5 | Deniz olayı üretme sistemi ekle | Yüksek | Bekliyor | Fırtına, arıza, rota sapması, viral fırsat. |

| 5.6 | Deniz vlogu üretme aksiyonu ekle | Yüksek | Bekliyor | Riskli içerik fırsatı. |

| 5.7 | Varış sistemi ekle | Kritik | Bekliyor | Yeni limana ulaşıldığında state güncellenecek. |



\---



\## Faz 6 — Sosyal Medya Sistemi



Amaç: İçerik üretimi, takipçi, gelir ve sponsor büyümesini çalışır hale getirmek.



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 6.1 | Platform listesi UI’ı oluştur | Kritik | Bekliyor | ViewTube, ClipTok, InstaSea, FacePort. |

| 6.2 | İçerik üretme aksiyonu ekle | Kritik | Bekliyor | Platform + içerik türü seçimi. |

| 6.3 | İçerik sonucu hesaplama fonksiyonu yaz | Kritik | Bekliyor | Takipçi, gelir, kalite, viral şans. |

| 6.4 | Platform bazlı takipçi değerlerini state’e ekle | Kritik | Bekliyor | Her platform ayrı büyümeli. |

| 6.5 | Toplam takipçi hesaplama sistemi ekle | Kritik | Bekliyor | Kazanma şartına bağlanacak. |

| 6.6 | İçerik geçmişi / event log entegrasyonu yap | Yüksek | Bekliyor | Oyuncu ne ürettiğini görmeli. |

| 6.7 | Sponsor uygunluk kontrolü ekle | Yüksek | Bekliyor | Takipçi + platform + profil uyumu. |



\---



\## Faz 7 — Tekne Upgrade Sistemi



Amaç: Oyuncunun teknesini gerçek denizcilik parçalarıyla geliştirmesini sağlamak.



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 7.1 | Upgrade kategorileri ekranı oluştur | Kritik | Bekliyor | Enerji, navigasyon, güvenlik, motor, su, konfor, içerik. |

| 7.2 | Upgrade kartları oluştur | Kritik | Bekliyor | Maliyet, süre, etki, gereksinim. |

| 7.3 | Upgrade satın alma fonksiyonu yaz | Kritik | Bekliyor | Kredi düşer, kurulum başlar. |

| 7.4 | Upgrade kurulum süresi sistemi ekle | Yüksek | Bekliyor | Token hızlandırmaya bağlanabilir. |

| 7.5 | Büyük marina gereksinimi kontrolü ekle | Yüksek | Bekliyor | Bazı parçalar her yerde takılamaz. |

| 7.6 | Tekne hazır olma puanı hesapla | Kritik | Bekliyor | Okyanus geçiş şartına bağlanacak. |

| 7.7 | Tekne kesiti / sistem durumu ekranı taslağı ekle | Orta | Bekliyor | Görsel tycoon hissini artırır. |



\---



\## Faz 8 — Ekonomi Sistemi



Amaç: Kredi, gider, gelir, bakım ve token mantığını çalışır hale getirmek.



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 8.1 | Ana para birimini state’e ekle | Kritik | Bekliyor | Kredi öneriliyor. |

| 8.2 | Gelir ekleme fonksiyonu yaz | Kritik | Bekliyor | İçerik, sponsor, görev. |

| 8.3 | Gider düşme fonksiyonu yaz | Kritik | Bekliyor | Bakım, marina, upgrade, yakıt, su. |

| 8.4 | Marina günlük maliyeti sistemi ekle | Yüksek | Bekliyor | Limanda kalmanın bedeli. |

| 8.5 | Bakım maliyeti sistemi ekle | Yüksek | Bekliyor | Bakımı ertelemek risk artırır. |

| 8.6 | Token state’i ekle | Orta | Bekliyor | İlk MVP’de gerçek ödeme yok. |

| 8.7 | Token harcama noktalarını bağla | Orta | Bekliyor | Hızlandırma ve kolaylık. |



\---



\## Faz 9 — Kazanma ve İlerleme Sistemi



Amaç: Oyuncunun ana hedeflere doğru ilerlemesini ölçmek.



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 9.1 | Dünya turu ilerleme yüzdesi hesapla | Kritik | Bekliyor | Rota etaplarına göre. |

| 9.2 | 1 milyon takipçi hedefini bağla | Kritik | Bekliyor | Toplam takipçi üzerinden. |

| 9.3 | Okyanus hazır tekne puanı hesapla | Kritik | Bekliyor | Güvenlik, enerji, su, navigasyon, bakım. |

| 9.4 | Kazanma kontrol fonksiyonu yaz | Kritik | Bekliyor | 3 şart birlikte tamamlanmalı. |

| 9.5 | Final ekranı tasarla | Orta | Bekliyor | Profil bazlı final ileride eklenebilir. |



\---



\## Faz 10 — Mobil Hazırlık



Amaç: Web prototipi mobil cihazlarda oynanabilir hale getirmek.



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 10.1 | Mobil responsive layout kontrolü | Kritik | Bekliyor | Telefon ekranında rahat kullanılmalı. |

| 10.2 | Ana aksiyon butonlarını mobil öncelikli düzenle | Kritik | Bekliyor | Tek elle kullanım. |

| 10.3 | TopBar mobil sadeleştirme | Yüksek | Bekliyor | Çok sayı boğmamalı. |

| 10.4 | Kart boyutlarını mobil uyumlu yap | Yüksek | Bekliyor | Kaydırma rahat olmalı. |

| 10.5 | Performans kontrolü yap | Yüksek | Bekliyor | Düşük cihazlarda akıcı olmalı. |



\---



\## Faz 11 — Test ve Build



| No | Kod İşi | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 11.1 | Her büyük değişiklik sonrası build al | Kritik | Bekliyor | `npm run build` |

| 11.2 | Yeni oyun başlatma testi yap | Kritik | Bekliyor | Profil + marina + tekne seçimi. |

| 11.3 | Save / load testi yap | Kritik | Bekliyor | localStorage çalışmalı. |

| 11.4 | Liman modu aksiyon testi yap | Yüksek | Bekliyor | Upgrade, içerik, sponsor. |

| 11.5 | Deniz modu aksiyon testi yap | Yüksek | Bekliyor | Seyir, risk, varış. |

| 11.6 | Mobil görünüm testi yap | Kritik | Bekliyor | Chrome devtools ve gerçek cihaz. |



\---



\## Şu Anki Kodlama Durumu



Kodlama şu anda başlamayacaktır.



Önce şu tasarım dosyaları tamamlanmalıdır:



1\. docs/02\_Oyuncu\_Profilleri.md

2\. docs/03\_Baslangic\_Marinalari.md

3\. docs/04\_Baslangic\_Tekneleri.md

4\. docs/05\_Dunya\_Rotasi.md

5\. docs/06\_Liman\_ve\_Deniz\_Modu.md

6\. docs/07\_Tekne\_Upgrade\_Sistemi.md

7\. docs/08\_Sosyal\_Medya\_Sistemi.md

8\. docs/09\_Seyahat\_Suresi\_Formulu.md

9\. docs/10\_Token\_Sistemi.md

10\. docs/11\_Ekonomi\_Sistemi.md

11\. docs/12\_Kazanma\_Sartlari.md

12\. docs/14\_MVP\_Yapim\_Plani.md



\---



\## Kodlamaya Geçme Şartı



Kodlamaya geçmeden önce en az şu bölümler V1.0 olarak kilitlenmelidir:



| Bölüm | Zorunlu mu? |

|---|---|

| Oyun Anayasası | Evet |

| Oyuncu Profilleri | Evet |

| Başlangıç Marinaları | Evet |

| Başlangıç Tekneleri | Evet |

| Dünya Rotası | Evet |

| Liman / Deniz Modu | Evet |

| Tekne Upgrade Sistemi | Evet |

| Sosyal Medya Sistemi | Evet |

| Ekonomi Sistemi | Evet |

| MVP Yapım Planı | Evet |



\---



\## Not



Bu dosya kodlama sırasını kontrol altında tutmak için oluşturulmuştur.



Yeni bir kod fikri geldiğinde önce `backlog/fikir-havuzu.md` veya `backlog/tasarim-backlog.md` içinde değerlendirilir.  

Kod backlog’a sadece uygulanabilir hale gelmiş işler eklenir.

