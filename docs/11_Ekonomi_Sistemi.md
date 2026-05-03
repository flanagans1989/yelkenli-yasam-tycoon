\# Yelkenli Yaşam Tycoon — Ekonomi Sistemi V1.0



\## Belge Durumu



\- Durum: Kilitlendi

\- Sürüm: V1.0

\- İlgili ana belge: docs/01\_Oyun\_Anayasasi.md

\- Amaç: Oyundaki ana para birimi, gelir kaynakları, gider kaynakları, bakım/upgrade maliyetleri ve ekonomik denge kurallarını netleştirmek



\---



\## 1. Sistem Amacı



Ekonomi sistemi, Yelkenli Yaşam Tycoon’un tycoon tarafını çalıştıran ana omurgadır.



Oyuncu sosyal medya içerikleri üretir, takipçi kazanır, sponsor anlaşmaları yapar ve gelir elde eder.  

Bu gelirle teknesini geliştirir, bakım yapar, marina ücretlerini öder, kaynaklarını tamamlar ve dünya turunda ilerler.



Ekonomi sisteminin amacı:



1\. Oyuncuya para kazanma motivasyonu vermek

2\. Harcamaları stratejik karar haline getirmek

3\. Upgrade sistemini anlamlı hale getirmek

4\. Bakım erteleme riskini ekonomiye bağlamak

5\. Sosyal medya ve sponsor sistemini gelir motoru yapmak

6\. Oyuncuya “paramı nereye yatırmalıyım?” kararı verdirmek

7\. Mobil oyuncuyu sıkmadan uzun vadeli ilerleme hissi vermek



\---



\## 2. Ana Tasarım Kuralı



Ekonomi sistemi şu soruya cevap vermelidir:



> Oyuncu her para kazandığında ve harcadığında anlamlı bir karar verdiğini hissediyor mu?



Sadece para biriktirip pahalı butonlara basmak yeterli değildir.



Oyuncu şunlar arasında seçim yapmak zorunda kalmalıdır:



\- Bakım mı yapayım, kamera mı alayım?

\- Güneş paneli mi takayım, sponsor içeriği için drone mu alayım?

\- Marina ücretini ödeyip bekleyeyim mi, yoksa riskli şekilde denize mi çıkayım?

\- Eski teknemi toparlayayım mı, büyük tekne masrafına mı gireyim?



\---



\## 3. Ana Para Birimi



Oyunun ana para birimi:



```text

Kredi

```



olarak kabul edilmiştir.



Sebep:



1\. Gerçek TL / Euro fiyatları sürekli değişir

2\. Mobil oyun dengesi gerçek fiyatlara bağlanmamalıdır

3\. Global pazarda anlaşılır ve sade kalır

4\. Geliştirme ve balans ayarı kolaylaşır

5\. Token sistemiyle net ayrılır



\---



\## 4. Para Birimleri



| Birim | Rol |

|---|---|

| Kredi | Ana oyun içi para birimi |

| Token | Hızlandırma ve kolaylık birimi |

| Takipçi | Kazanma hedefi ve sponsor gücü |

| İtibar / Marka Güveni | Sponsor ve sadakat için yardımcı değer |

| Okyanus Hazırlık Puanı | Final şartlarından biri |



Kredi ve token birbirine karıştırılmamalıdır.



```text

Kredi = oyun emeği ve gelir

Token = zaman ve kolaylık

```



\---



\## 5. Başlangıç Ekonomisi



Oyuncu oyuna belirli bir başlangıç bütçesiyle başlar.



MVP için başlangıç bütçesi taslağı:



```text

Başlangıç Bütçesi: 100.000 Kredi

```



Bu değer kesin balans değildir. Testlerle değiştirilebilir.



\---



\## 6. Başlangıç Teknesi Maliyeti



| Tekne | Maliyet Hissi | Taslak Kredi | Oyuncuda Kalan Bütçe |

|---|---|---:|---:|

| Kırlangıç 28 | Düşük | 35.000 | 65.000 |

| Denizkuşu 34 | Orta | 60.000 | 40.000 |

| Atlas 40 | Yüksek | 85.000 | 15.000 |



Tasarım mantığı:



\- Kırlangıç 28 ucuzdur ama bakım ve risk maliyeti yüksektir.

\- Denizkuşu 34 dengeli başlangıçtır.

\- Atlas 40 güçlüdür ama oyuncuyu erken ekonomik baskıya sokar.



Önemli kural:



> En pahalı tekne otomatik en kolay oyun olmamalıdır.



\---



\## 7. Ana Gelir Kaynakları



| Gelir Kaynağı | Açıklama | Öncelik |

|---|---|---|

| Sosyal medya içerik geliri | ViewTube, ClipTok, InstaSea, FacePort gelirleri | Kritik |

| Sponsor geliri | Marka anlaşmaları, kampanyalar, sponsorlu içerik | Kritik |

| Rota başarı ödülü | Belirli etapları tamamlayınca gelir | Orta |

| Günlük görev ödülü | Oyuncunun geri dönmesini sağlar | Orta |

| Marina / lokasyon görevleri | Limana özel küçük görevler | Orta |

| LiveWave bağışları | Canlı yayın gelirleri | İleri sürüm |

| Etkinlik gelirleri | Sezonluk etkinlik ve kampanya ödülleri | İleri sürüm |



\---



\## 8. Sosyal Medya Gelirleri



Sosyal medya geliri platforma göre değişir.



| Platform | Gelir Gücü | Takipçi Gücü | Not |

|---|---|---|---|

| ViewTube | Yüksek | Orta-Güçlü | Uzun video ana gelir motorudur |

| ClipTok | Düşük-Orta | Çok Güçlü | Viral büyütür ama gelir düşük olabilir |

| InstaSea | Orta | Güçlü | Sponsor uyumu yüksektir |

| FacePort | Orta | Orta | Sadık topluluk geliri verir |

| LiveWave | Değişken | Orta | Bağış ve canlı yayın odaklıdır |



\---



\## 9. İçerik Geliri Taslak Mantığı



Basit MVP formülü:



```text

İçerik Geliri =

Platform Baz Geliri

× İçerik Kalitesi

× Takipçi Çarpanı

× Lokasyon Bonusu

× Ekipman Bonusu

× Viral Bonusu

```



Oyuncuya formül gösterilmez.



Oyuncuya gösterilecek sonuç:



```text

İçerik yayınlandı.

Kalite: 78/100

Takipçi: +4.200

Gelir: +1.650 Kredi

Sponsor ilgisi: Hafif arttı

```



\---



\## 10. Sponsor Gelirleri



Sponsor sistemi, ekonominin büyük sıçrama alanıdır.



Sponsor gelirleri şu değerlere göre oluşur:



1\. Toplam takipçi

2\. Platform dağılımı

3\. Profil uyumu

4\. Tekne algısı

5\. İçerik kalitesi

6\. Marina / rota lokasyonu

7\. Marka güveni

8\. Sponsorlu içerik geçmişi



\---



\## 11. Sponsor Seviye Taslağı



| Sponsor Seviyesi | Gereken Takipçi Hissi | Gelir Hissi |

|---|---:|---|

| Mikro sponsor | 5.000+ | Düşük |

| Küçük sponsor | 25.000+ | Orta |

| Orta sponsor | 100.000+ | Güçlü |

| Büyük sponsor | 300.000+ | Çok güçlü |

| Global sponsor | 750.000+ | Çok yüksek |



Not:



Takipçi tek başına yeterli değildir. Marka uyumu da önemlidir.



\---



\## 12. Rota Başarı Ödülleri



Bazı büyük etaplar tamamlandığında oyuncu ek gelir veya sponsor ilgisi kazanabilir.



| Etap | Ödül Hissi |

|---|---|

| İlk uluslararası rota | Küçük kredi + takipçi |

| Girit geçişi | Orta takipçi + içerik bonusu |

| Cebelitarık | Sponsor ilgisi |

| Atlantik geçişi | Büyük takipçi + yüksek içerik geliri |

| Karayipler varış | Sponsor ve lifestyle gelirleri |

| Panama | Dünya turu prestiji |

| Pasifik etapları | Belgesel / keşif geliri |

| Türkiye dönüş | Final ödülü ve marka değeri |



\---



\## 13. Ana Gider Kaynakları



| Gider Kaynağı | Açıklama | Öncelik |

|---|---|---|

| Tekne satın alma | Başlangıçta büyük gider | Kritik |

| Marina ücreti | Limanda kalma maliyeti | Kritik |

| Bakım | Arıza riskini azaltır | Kritik |

| Tamir | Hasar ve arıza sonrası zorunlu gider | Kritik |

| Upgrade | Tekneyi geliştirir | Kritik |

| Yakıt | Motor ve acil durum desteği | Yüksek |

| Su / gıda / yaşam | Uzun seyir ve konfor | Yüksek |

| İçerik ekipmanı | Sosyal medya büyümesi | Yüksek |

| Kanal / geçiş maliyetleri | Panama gibi özel noktalar | Orta |

| Sigorta | İleri sürüm risk yönetimi | İleri sürüm |



\---



\## 14. Marina Maliyetleri



Marina maliyeti şu değerlere göre değişir:



1\. Marina tipi

2\. Tekne boyu

3\. Kalınan oyun günü

4\. Sezon / etkinlik

5\. Marina prestiji

6\. Oyuncunun sponsor / üyelik avantajları



Taslak marina maliyet hissi:



| Marina Tipi | Günlük Maliyet Hissi |

|---|---|

| Ekonomik marina | Düşük |

| Dengeli marina | Orta |

| Premium marina | Yüksek |

| Büyük şehir marinası | Çok yüksek |

| Teknik tersane bölgesi | Hizmete göre değişken |



\---



\## 15. Tekne Boyu ve Marina Maliyeti



Tekne büyüdükçe marina maliyeti artmalıdır.



| Tekne | Marina Maliyet Çarpanı |

|---|---:|

| Kırlangıç 28 | 0.8x |

| Denizkuşu 34 | 1.0x |

| Atlas 40 | 1.4x |



Bu sayede Atlas 40 güçlü ama pahalı hissettirir.



\---



\## 16. Bakım Ekonomisi



Bakım sistemi oyuncuya gerçek karar verdirmelidir.



Bakım yapmamak kısa vadede para kazandırır ama uzun vadede risk yaratır.



Bakım türleri:



| Bakım | Etki |

|---|---|

| Motor bakımı | Motor arızası riskini azaltır |

| Elektrik bakımı | Enerji krizi riskini azaltır |

| Yelken bakımı | Seyir süresi ve fırtına riskini iyileştirir |

| Gövde bakımı | Hasar ve su alma riskini azaltır |

| Navigasyon kontrolü | Rota sapması riskini azaltır |

| Güvenlik kontrolü | Büyük rota ve okyanus hazırlığı için önemlidir |



\---



\## 17. Bakım Maliyeti Mantığı



| Tekne | Bakım Maliyet Hissi |

|---|---|

| Kırlangıç 28 | Parça ucuz ama sık bakım ister |

| Denizkuşu 34 | Dengeli bakım maliyeti |

| Atlas 40 | Bakım pahalı ama arıza riski daha düşük |



Önemli kural:



> Ucuz tekne sık masraf çıkarır, pahalı tekne seyrek ama pahalı masraf çıkarır.



\---



\## 18. Tamir Ekonomisi



Tamir, bakım ihmalinin veya deniz olaylarının sonucudur.



Tamir türleri:



| Tamir | Sebep | Etki |

|---|---|---|

| Küçük motor tamiri | Bakımsızlık / deniz olayı | Kredi + zaman |

| Elektrik tamiri | Enerji sistemi sorunu | İçerik ve navigasyon etkilenir |

| Yelken tamiri | Fırtına / eski yelken | Rota süresi artar |

| Gövde tamiri | Sert hava / çarpma | Büyük maliyet |

| İçerik ekipmanı tamiri | Riskli çekim / deniz etkisi | Sosyal medya zayıflar |



\---



\## 19. Upgrade Ekonomisi



Upgrade, oyuncunun ana yatırım alanıdır.



Upgrade maliyet seviyeleri:



| Upgrade Seviyesi | Maliyet Hissi | Süre Hissi |

|---|---|---|

| Küçük | Düşük | Aynı gün / 1 gün |

| Orta | Orta | 1-3 gün |

| Büyük | Yüksek | 3-7 gün |

| Okyanus seviyesi | Çok yüksek | 5-10 gün |



Upgrade kategorileri:



1\. Enerji

2\. Navigasyon

3\. Güvenlik

4\. Yelken / hız

5\. Motor / mekanik

6\. Su / yaşam

7\. Konfor

8\. İçerik ekipmanı

9\. Gövde / bakım

10\. Yardımcı denizcilik



\---



\## 20. Kaynak Ekonomisi



Deniz modunda tüketilen ana kaynaklar:



| Kaynak | Kullanım |

|---|---|

| Enerji | Navigasyon, içerik, konfor, iletişim |

| Su | Yaşam, konfor, uzun rota |

| Yakıt | Motor, acil durum, düşük rüzgar |

| Gıda / yaşam malzemesi | Uzun seyir ve moral |

| Yedek parça | Küçük krizleri çözme |



Kaynaklar limanda tamamlanır.  

Denizde sadece sınırlı acil destek alınabilir.



\---



\## 21. Enerji Ekonomisi



Enerji sistemi hem deniz güvenliği hem sosyal medya için önemlidir.



Enerji tüketen sistemler:



\- Navigasyon

\- Uydu interneti

\- Kamera / drone / laptop

\- Buzdolabı

\- Klima

\- Canlı yayın sistemi

\- Aydınlatma ve yaşam sistemleri



Enerji üretimi:



\- Güneş paneli

\- Rüzgar jeneratörü

\- Hidro jeneratör

\- Jeneratör

\- Motor şarjı



\---



\## 22. Su Ekonomisi



Su uzun seyirlerde kritik hale gelir.



Su kaynakları:



\- Su tankı

\- Limanda su doldurma

\- Su yapıcı

\- Acil su paketi



Su yetersizse:



\- Moral düşer

\- Uzun rota riski artar

\- Okyanus geçişi engellenebilir

\- Aile / yaşam içerikleri zayıflar



\---



\## 23. Yakıt Ekonomisi



Yakıt, yelkenli oyununun ana ilerleme kaynağı değildir ama güvenlik desteğidir.



Yakıt kullanımı:



\- Marina giriş/çıkış

\- Düşük rüzgar desteği

\- Acil rota değişimi

\- Motorla ilerleme

\- Jeneratör kullanımı



Yakıt pahalı olmalıdır ama oyunu kilitlememelidir.



\---



\## 24. Okyanus Geçiş Ekonomisi



Büyük geçişler ciddi hazırlık maliyeti gerektirmelidir.



Örnek hazırlık harcamaları:



| Harcama | Neden |

|---|---|

| Güvenlik ekipmanı | Okyanus şartı |

| Enerji sistemi | Uzun seyir |

| Su sistemi | Uzun rota |

| Navigasyon | Açık deniz güvenliği |

| Gövde / yelken bakımı | Hasar riskini azaltma |

| Yedek parça | Arıza riski |

| Gıda / yaşam stoğu | Uzun seyir |

| Uydu iletişimi | Güvenlik ve içerik |



Okyanus geçişi oyuncuya şu hissi vermelidir:



> “Bu büyük geçiş için gerçekten hazırlık yapmam gerekiyor.”



\---



\## 25. Panama / Kanal ve Özel Geçiş Maliyetleri



Bazı rota noktaları özel maliyet yaratabilir.



Örnek:



| Bölge | Maliyet Türü |

|---|---|

| Panama | Kanal geçiş ücreti / bekleme |

| Büyük şehir marinaları | Yüksek marina ücreti |

| Teknik tersaneler | Pahalı ama kaliteli hizmet |

| Premium turizm bölgeleri | Yüksek yaşam ve marina maliyeti |

| Uzak okyanus adaları | Kaynak maliyeti yüksek |



Bu maliyetler oyuna gerçek dünya turu hissi verir.



\---



\## 26. Gelir-Gider Denge Döngüsü



Ana ekonomi döngüsü:



```text

İçerik üret

↓

Takipçi ve kredi kazan

↓

Sponsor aç

↓

Tekneye yatırım yap

↓

Daha büyük rotalara çık

↓

Daha güçlü içerik üret

↓

Daha büyük gelir kazan

```



Gider döngüsü:



```text

Tekne büyür

↓

Marina ve bakım maliyeti artar

↓

Daha güçlü gelir gerekir

↓

Sosyal medya ve sponsor sistemi daha önemli olur

```



\---



\## 27. Oyuncu Karar Örnekleri



Ekonomi sistemi oyuncuya şu kararları verdirmelidir:



| Karar | Risk / Sonuç |

|---|---|

| Bakımı ertele, drone al | İçerik artar ama arıza riski yükselir |

| Güneş paneli al, sponsor içeriğini ertele | Enerji güvenliği artar ama gelir gecikir |

| Premium marinada kal | Sponsor şansı artar ama para azalır |

| Ekonomik marinaya git | Para korunur ama sponsor potansiyeli düşer |

| Atlas 40 al | Prestij artar ama nakit baskısı oluşur |

| Kırlangıç 28 al | Para kalır ama tamir ve risk artar |



\---



\## 28. Borç / Negatif Bakiye Kuralı



MVP’de negatif bakiye önerilmez.



Oyuncu parasız kalırsa:



\- Büyük upgrade alamaz

\- Marina borcu birikebilir

\- Basit görevler / içerikler ile toparlanabilir

\- Sponsor teklifleri bekleyebilir

\- Küçük rota / küçük içeriklerle gelir kazanabilir



İleri sürümde borç veya kredi sistemi düşünülebilir ama MVP’de karmaşık olabilir.



\---



\## 29. Parası Azalan Oyuncuya Toparlanma Yolu



Oyuncu kötü karar verirse oyun bitmemelidir.



Toparlanma yolları:



1\. Düşük maliyetli içerik üretimi

2\. Küçük sponsor görevleri

3\. Ekonomik marina seçimi

4\. Bakım yerine geçici çözüm

5\. Günlük görev ödülleri

6\. Reklam ödülü / küçük token

7\. Küçük rota gelirleri

8\. Teknik Usta avantajı gibi profil destekleri



Kural:



> Ekonomi oyuncuyu cezalandırmalı ama oyundan koparmamalıdır.



\---



\## 30. Günlük Görev ve Retention Ekonomisi



Günlük görevler küçük ödüller vermelidir.



Örnek görevler:



| Görev | Ödül |

|---|---|

| Bugün bir liman içeriği üret | Kredi + küçük takipçi |

| Tekne bakım durumunu kontrol et | Küçük kredi / token |

| Bir sponsor teklifini incele | Kredi |

| Rota planı yap | Kredi |

| Günlük trend içeriği üret | Takipçi bonusu |

| Tekne sistemlerinden birini iyileştir | Kredi / token |



Bu sistem oyuncuya ertesi gün dönme sebebi verir.



\---



\## 31. Reklam Ödülü Ekonomisi



Reklam izleme isteğe bağlı olmalıdır.



Reklam ödülleri:



| Ödül | Etki |

|---|---|

| Küçük kredi | Günlük destek |

| Küçük token | Hızlandırma |

| Bakım indirimi | Kısa süreli avantaj |

| İçerik gelir bonusu | Bir sonraki içerikte küçük bonus |

| Marina fırsatı yenileme | Yeni teklif görme |



Reklam izlemeyen oyuncu cezalandırılmamalıdır.



\---



\## 32. Token ve Ekonomi Dengesi



Token ekonomisi kredi ekonomisini bozmamalıdır.



| Sistem | Rol |

|---|---|

| Kredi | Asıl ilerleme |

| Token | Zaman / kolaylık |

| Sponsor | Büyük gelir sıçraması |

| İçerik | Düzenli gelir |

| Rota | İlerleme ve fırsat |



Token ile:



\- Kredi doğrudan sınırsız alınmamalıdır

\- 1 milyon takipçi alınmamalıdır

\- Okyanus hazırlığı atlanmamalıdır

\- Dünya turu tamamlanmamalıdır



\---



\## 33. İlk Balans Taslağı



Bu değerler kesin değildir. İlk prototipte test için kullanılır.



| Alan | Taslak Değer |

|---|---:|

| Başlangıç bütçesi | 100.000 Kredi |

| Kırlangıç 28 | 35.000 Kredi |

| Denizkuşu 34 | 60.000 Kredi |

| Atlas 40 | 85.000 Kredi |

| Küçük içerik geliri | 200 - 1.000 Kredi |

| Orta içerik geliri | 1.000 - 5.000 Kredi |

| Viral içerik geliri | 5.000 - 25.000 Kredi |

| Mikro sponsor | 2.000 - 8.000 Kredi |

| Küçük sponsor | 8.000 - 25.000 Kredi |

| Orta sponsor | 25.000 - 80.000 Kredi |

| Büyük sponsor | 80.000+ Kredi |



Not:



Bu değerler oyun dengesi testinde mutlaka güncellenecektir.



\---



\## 34. Ekonomi ve Oyuncu Profili Bağlantısı



| Profil | Ekonomi Etkisi |

|---|---|

| Eski Kaptan | Risk ve hasar maliyeti azalır |

| İçerik Üreticisi | İçerik gelirleri ve takipçi artışı güçlüdür |

| Teknik Usta | Bakım ve tamir maliyetleri düşer |

| Maceracı Gezgin | Riskli içeriklerden büyük gelir potansiyeli |

| Sosyal Girişimci | Sponsor gelirleri ve anlaşma kalitesi artar |

| Aile / Yaşam Kanalı | Sadık kitle ve lifestyle sponsorları güçlüdür |



\---



\## 35. Ekonomi ve Marina Bağlantısı



| Marina Tipi | Ekonomi Etkisi |

|---|---|

| Göcek / Bodrum / İstanbul | Sponsor güçlü, maliyet yüksek |

| Marmaris / Antalya | Dengeli maliyet ve hizmet |

| Kuşadası / Yalova | Daha ekonomik başlangıç |

| Kaş / Fethiye | İçerik güçlü, teknik hizmet sınırlı olabilir |

| Çeşme | Lifestyle içerik güçlü, maliyet orta-yüksek |



\---



\## 36. Ekonomi ve Tekne Bağlantısı



| Tekne | Ekonomi Hissi |

|---|---|

| Kırlangıç 28 | Ucuz alım, sık bakım, düşük marina maliyeti |

| Denizkuşu 34 | Dengeli alım ve bakım |

| Atlas 40 | Pahalı alım, yüksek prestij, yüksek bakım/marina maliyeti |



\---



\## 37. MVP Kapsamı



İlk MVP’de ekonomi sistemi şu kapsamda uygulanacaktır:



| Özellik | MVP Durumu |

|---|---|

| Kredi para birimi | Dahil |

| Başlangıç bütçesi | Dahil |

| Tekne satın alma maliyeti | Dahil |

| İçerik geliri | Dahil |

| Sponsor geliri | Basit düzeyde dahil |

| Marina maliyeti | Dahil |

| Bakım maliyeti | Dahil |

| Tamir maliyeti | Dahil |

| Upgrade maliyeti | Dahil |

| Kaynak maliyeti | Basit düzeyde dahil |

| Günlük görev ödülü | Basit düzeyde dahil |

| Token ayrımı | Dahil |

| Borç sistemi | MVP dışı |

| Sigorta sistemi | MVP dışı |

| Detaylı piyasa dalgalanması | MVP dışı |

| Gerçek para fiyatları | Kullanılmayacak |



\---



\## 38. Denge Kuralları



Ekonomi sistemi şu kurallara uymalıdır:



1\. Oyuncu her oturumda küçük de olsa gelir hissi almalıdır.

2\. Büyük upgrade’ler hedef olarak pahalı hissettirmelidir.

3\. Bakım ihmal edilebilir ama sonucu olmalıdır.

4\. Oyuncu parasız kalınca tamamen kilitlenmemelidir.

5\. Sponsor gelirleri önemli ama tek gelir kaynağı olmamalıdır.

6\. Sosyal medya düzenli gelir motoru olmalıdır.

7\. Tekne büyüdükçe masraf da büyümelidir.

8\. Premium başlangıç ekonomik baskı yaratmalıdır.

9\. Ucuz başlangıç daha çok risk ve bakım getirmelidir.

10\. Token kredi ekonomisini öldürmemelidir.

11\. Oyuncu para harcamadan oyunu tamamlayabilmelidir.

12\. Ekonomi mobil oyuncuyu sıkmamalı ama karar verdirmelidir.



\---



\## 39. İleri Sürüm Fikirleri



| Fikir | Not |

|---|---|

| Sigorta sistemi | Büyük hasar maliyetlerini yönetir |

| Borç / kredi sistemi | Riskli finansal kararlar ekler |

| Marina üyeliği | Bazı marina zincirlerinde indirim sağlar |

| Parça pazarı | İkinci el veya sponsorlu upgrade |

| Sezonluk fiyat değişimleri | Yaz/kış, turizm sezonu etkisi |

| Global sponsor pazarı | Ülke/bölge bazlı sponsorlar |

| Kanal yönetim giderleri | Editör, ekip, medya ajansı gibi ileri sistem |

| Vergi / resmi masraf | MVP için ağır olabilir, ileri sürümde hafif eklenebilir |

| Tekne satış / takas | Dünya turunda tekne yükseltme |

| Premium kozmetik ekonomisi | Tekne rengi, bayrak, yelken deseni |



\---



\## 40. Kilit Kararı



Bu belge Ekonomi Sistemi V1.0 olarak kabul edilmiş ve kilitlenmiştir.



Oyunun ana para birimi Kredi olacaktır.  

Token başarı değil, zaman ve kolaylık sağlayan ayrı destek birimi olarak kalacaktır.



Ekonomi sistemi; sosyal medya gelirleri, sponsor gelirleri, marina maliyetleri, bakım/tamir, upgrade, kaynak yönetimi ve büyük rota hazırlıklarını birbirine bağlayacaktır.



Bu belge kilitlendikten sonra sıradaki ana tasarım bölümü:



> Kazanma Şartları V1.0

