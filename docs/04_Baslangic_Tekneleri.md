\# Yelkenli Yaşam Tycoon — Başlangıç Tekneleri V1.0 Taslağı



\## Belge Durumu

- Durum: Kilitlendi
- Sürüm: V1.0
- İlgili ana belge: docs/01_Oyun_Anayasasi.md
- Amaç: Oyuncunun başlangıçta seçeceği tekne sınıflarını oyun sistemi olarak netleştirmek
- Kilit kararı: Bu belge Başlangıç Tekneleri V1.0 olarak kabul edilmiştir.


\---



\## 1. Sistem Amacı



Başlangıç teknesi sistemi, oyuncunun oyuna hangi zorluk seviyesi, hangi ekonomik baskı ve hangi gelişim potansiyeliyle başlayacağını belirler.



Tekne sadece bir araç değildir.  

Yelkenli Yaşam Tycoon’da tekne, oyunun ana karakterlerinden biridir.



Oyuncu teknesine isim verecek, onu geliştirecek, bakımını yapacak, rotalara onunla çıkacak, krizleri onunla yaşayacak ve dünya turuna onu hazırlayacaktır.



Amaç:



1\. Oyuncuya anlamlı başlangıç seçimi sunmak

2\. Her tekne sınıfını farklı oynanış tarzına bağlamak

3\. Tycoon gelişimini tekne parçaları üzerinden hissettirmek

4\. Ekonomi, risk, konfor, sosyal medya ve rota sistemlerini tekne seçimine bağlamak

5\. Oyuncuda “bu tekneyi ben büyüttüm” hissi oluşturmak



\---



\## 2. Ana Tasarım Kuralı



Her başlangıç teknesi şu soruya cevap vermelidir:



> Ben bu tekneyi seçersem oyunu nasıl farklı oynarım?



Eğer tekneler sadece fiyat ve boy olarak farklıysa ama oynanışı değiştirmiyorsa, sistem başarısızdır.



\---



\## 3. Gerçek Marka Kullanım Kuralı



Oyunda gerçek tekne marka ve model isimleri kullanılmayacaktır.



Bunun yerine gerçek tekne sınıflarından, boylarından ve kullanım amaçlarından ilham alan kurgusal tekne isimleri kullanılacaktır.



Amaç:



\- Hukuki riskleri azaltmak

\- Oyuna kendi marka kimliğini kazandırmak

\- Dengeyi gerçek marka beklentisine bağlı kalmadan kurmak

\- Oyuncuya gerçekçi ama özgün bir dünya sunmak



\---



\## 4. Başlangıç Teknesi Sınıfları



İlk MVP’de 3 başlangıç teknesi olacaktır.



| No | Sınıf | Kurgusal İsim | Oyun Rolü |

|---:|---|---|---|

| 1 | 28 ft eski ikinci el yelkenli | Kırlangıç 28 | Zor ama ucuz başlangıç |

| 2 | 34 ft dengeli ikinci el cruiser | Denizkuşu 34 | Dengeli ve önerilen başlangıç |

| 3 | 40 ft modern ocean cruiser | Atlas 40 | Güçlü ama pahalı başlangıç |



\---



\## 5. Tekne Değer Alanları



Her tekne şu değerlerle tanımlanacaktır:



| Alan | Açıklama |

|---|---|

| Satın Alma Maliyeti | Oyuncunun başlangıç bütçesinden düşen bedel |

| Bakım Maliyeti | Teknenin periyodik bakım masrafı |

| Arıza Riski | Seyirde veya beklemede arıza çıkarma ihtimali |

| Hız / Seyir Performansı | Rota süresini ve güvenliğini etkiler |

| Enerji Kapasitesi | Akü, güneş paneli, inverter ve içerik üretimini etkiler |

| Su Kapasitesi | Uzun seyir, konfor ve okyanus hazırlığını etkiler |

| Yakıt Kapasitesi | Motor kullanımı ve acil durum güvenliğini etkiler |

| Konfor | Yaşam içerikleri, aile/lifestyle ve moral etkisi |

| Güvenlik | Fırtına, kriz ve okyanus geçişi hazırlığını etkiler |

| Upgrade Potansiyeli | Teknenin ne kadar geliştirilebilir olduğunu belirler |

| İçerik Çekiciliği | Teknenin sosyal medya içeriklerinde oluşturduğu görsel/algısal etki |



\---



\# 6. Tekne 1 — Kırlangıç 28



\## Genel Tanım



Kırlangıç 28, eski ama karakterli bir ikinci el yelkenlidir.  

Küçük, ucuz, masraflı ve sınırlı kapasitelidir.



Oyuncuya zor ama duygusal bir başlangıç verir.



Bu tekneyle başlayan oyuncu başta çok rahat değildir; fakat zamanla tekneyi parça parça geliştirerek güçlü bir başarı hissi yaşar.



\## Oyun Rolü



Zor başlangıç, düşük bütçe, yüksek emek ve güçlü tycoon gelişimi isteyen oyuncular için uygundur.



\## Başlangıç Değerleri



| Alan | Değer |

|---|---|

| Tekne Boyu | 28 ft |

| Yaş Durumu | Eski ikinci el |

| Satın Alma Maliyeti | Düşük |

| Bakım Maliyeti | Orta-Yüksek |

| Arıza Riski | Yüksek |

| Hız / Seyir Performansı | Düşük-Orta |

| Enerji Kapasitesi | Düşük |

| Su Kapasitesi | Düşük |

| Yakıt Kapasitesi | Düşük |

| Konfor | Düşük |

| Güvenlik | Düşük-Orta |

| Upgrade Potansiyeli | Orta |

| İçerik Çekiciliği | Orta-Güçlü |



\## Ana Avantaj



| Avantaj | Etki |

|---|---|

| Ucuz Başlangıç | Oyuncunun elinde upgrade ve bakım için daha fazla başlangıç bütçesi kalır. |



\## Ana Dezavantaj



| Dezavantaj | Etki |

|---|---|

| Yaşlı Gövde | Arıza, bakım ve konfor sorunları daha sık yaşanır. |



\## Oyun Hissi



Kırlangıç 28, “küçük tekneden büyük hikaye” hissi verir.



Oyuncu bu tekneyi seçtiğinde oyun daha zorlu başlar ama başarı duygusu daha güçlü olur.



\## Sosyal Medya Etkisi



\- Samimi başlangıç hikayeleri için güçlüdür

\- “Eski tekneyi topluyorum” içerikleri iyi çalışır

\- Lüks sponsorlar için başlangıçta zayıftır

\- Teknik ve macera içeriklerinde iyi hikaye üretir



\## Rota Etkisi



\- Kısa Ege ve Akdeniz rotaları için uygundur

\- Uzun okyanus geçişleri için ciddi upgrade ister

\- Fırtına ve uzun seyirlerde risk yüksektir



\## Uygun Oyuncu Profilleri



\- Teknik Usta

\- Eski Kaptan

\- Maceracı Gezgin



\## Oyuncuya Hissettirdiği Şey



> “Elimde mükemmel bir tekne yok ama bu tekneyi kendi emeğimle dünya turuna hazırlayacağım.”



\---



\# 7. Tekne 2 — Denizkuşu 34



\## Genel Tanım



Denizkuşu 34, dengeli bir ikinci el cruiser sınıfıdır.  

Ne çok küçük ne çok pahalıdır.



Yeni başlayan oyuncular için en dengeli teknedir.  

Hem sosyal medya içerikleri hem rota hem de upgrade sistemi için sağlıklı bir başlangıç sunar.



\## Oyun Rolü



Dengeli, kontrollü, öğrenmesi kolay ve tavsiye edilen başlangıç isteyen oyuncular için uygundur.



\## Başlangıç Değerleri



| Alan | Değer |

|---|---|

| Tekne Boyu | 34 ft |

| Yaş Durumu | Dengeli ikinci el |

| Satın Alma Maliyeti | Orta |

| Bakım Maliyeti | Orta |

| Arıza Riski | Orta |

| Hız / Seyir Performansı | Orta |

| Enerji Kapasitesi | Orta |

| Su Kapasitesi | Orta |

| Yakıt Kapasitesi | Orta |

| Konfor | Orta |

| Güvenlik | Orta |

| Upgrade Potansiyeli | Güçlü |

| İçerik Çekiciliği | Güçlü |



\## Ana Avantaj



| Avantaj | Etki |

|---|---|

| Dengeli Cruiser | Seyir, konfor, bakım ve upgrade açısından güvenli orta yol sunar. |



\## Ana Dezavantaj



| Dezavantaj | Etki |

|---|---|

| Hiçbir Alanda Aşırı Güçlü Değil | Lüks, hız veya düşük maliyet açısından özel bir uç avantaj sunmaz. |



\## Oyun Hissi



Denizkuşu 34, oyunun “önerilen başlangıç” teknesidir.



Oyuncuya ne çok kolay ne çok cezalandırıcı bir başlangıç verir.  

İlk kez oynayan oyuncular için ideal seçimdir.



\## Sosyal Medya Etkisi



\- Genel tekne yaşamı içerikleri için uygundur

\- ViewTube ve InstaSea içeriklerinde dengeli çalışır

\- Sponsorlar için kabul edilebilir görünürlük sağlar

\- Aile/lifestyle içeriklerinde yeterli konfor sunar



\## Rota Etkisi



\- Ege ve Akdeniz rotalarında dengelidir

\- Atlantik öncesi orta-ileri upgrade ister

\- Uzun rotalarda doğru hazırlıkla güvenli hale gelir



\## Uygun Oyuncu Profilleri



\- Aile / Yaşam Kanalı

\- İçerik Üreticisi

\- Eski Kaptan

\- Sosyal Girişimci



\## Oyuncuya Hissettirdiği Şey



> “Çok riskli başlamıyorum. Sağlam, dengeli ve büyümeye açık bir teknem var.”



\---



\# 8. Tekne 3 — Atlas 40



\## Genel Tanım



Atlas 40, modern ve güçlü bir ocean cruiser sınıfıdır.  

Daha pahalıdır ama konfor, güvenlik, kapasite ve sosyal medya görünürlüğü açısından güçlü bir başlangıç sunar.



Oyuncuya daha rahat ama ekonomik baskısı yüksek bir oyun başlatır.



\## Oyun Rolü



Güçlü, konforlu, yüksek potansiyelli ama pahalı başlangıç isteyen oyuncular için uygundur.



\## Başlangıç Değerleri



| Alan | Değer |

|---|---|

| Tekne Boyu | 40 ft |

| Yaş Durumu | Modern ikinci el / yeniye yakın |

| Satın Alma Maliyeti | Yüksek |

| Bakım Maliyeti | Yüksek |

| Arıza Riski | Düşük-Orta |

| Hız / Seyir Performansı | Güçlü |

| Enerji Kapasitesi | Güçlü |

| Su Kapasitesi | Güçlü |

| Yakıt Kapasitesi | Güçlü |

| Konfor | Çok Güçlü |

| Güvenlik | Güçlü |

| Upgrade Potansiyeli | Çok Güçlü |

| İçerik Çekiciliği | Çok Güçlü |



\## Ana Avantaj



| Avantaj | Etki |

|---|---|

| Ocean Cruiser Altyapısı | Uzun seyir, konfor, güvenlik ve içerik kalitesi açısından güçlü başlangıç sağlar. |



\## Ana Dezavantaj



| Dezavantaj | Etki |

|---|---|

| Pahalı Yaşam | Satın alma, bakım, marina ve upgrade maliyetleri yüksektir. |



\## Oyun Hissi



Atlas 40, güçlü başlatır ama oyuncunun finansal yönetimini zorlar.



Oyuncu erken dönemde daha güvenli ve prestijli görünür; fakat para yönetimini kötü yaparsa pahalı teknenin yükü altında kalabilir.



\## Sosyal Medya Etkisi



\- InstaSea, ViewTube ve sponsor içerikleri için çok güçlüdür

\- Lüks yaşam, aile, ocean prep ve tekne turu içerikleri yüksek performans verir

\- ClipTok’ta görsel etkisi güçlüdür

\- Teknik dönüşüm hikayesi Kırlangıç 28 kadar samimi değildir



\## Rota Etkisi



\- Ege ve Akdeniz rotalarında rahattır

\- Atlantik hazırlığı için diğer teknelere göre daha avantajlıdır

\- Okyanus geçişine uygun hale getirmek daha kolay ama daha pahalıdır



\## Uygun Oyuncu Profilleri



\- Sosyal Girişimci

\- Aile / Yaşam Kanalı

\- İçerik Üreticisi

\- Eski Kaptan



\## Oyuncuya Hissettirdiği Şey



> “Ben bu yolculuğa güçlü başlıyorum ama bu teknenin masraflarını taşıyacak kadar iyi yönetmeliyim.”



\---



\# 9. Genel Karşılaştırma Tablosu



| Tekne | Ana Güç | Ana Zayıflık | Zorluk | Oyuncu Tipi |

|---|---|---|---|---|

| Kırlangıç 28 | Ucuz başlangıç / güçlü gelişim hissi | Arıza, konfor, kapasite | Zor | Emekle büyümek isteyen |

| Denizkuşu 34 | Denge / öğrenmesi kolay | Özel uç avantajı yok | Kolay-Orta | İlk kez oynayan / dengeli oyuncu |

| Atlas 40 | Konfor / güvenlik / prestij | Pahalı | Orta-Zor | Güçlü ama maliyetli başlangıç isteyen |



\---



\# 10. Başlangıç Bütçesi Mantığı



Ana para birimi henüz ekonomi dosyasında netleşecektir.  

Ancak başlangıç teknesi sistemi, “Kredi” isimli oyun içi para birimiyle tasarlanacaktır.



İlk taslak bütçe mantığı:



| Tekne | Satın Alma Maliyeti | Oyuncuda Kalan Bütçe Hissi |

|---|---:|---|

| Kırlangıç 28 | Düşük | Upgrade ve bakım için yüksek bütçe kalır |

| Denizkuşu 34 | Orta | Dengeli bütçe kalır |

| Atlas 40 | Yüksek | Az bütçe kalır, gelir üretme baskısı artar |



Kesin sayısal değerler ekonomi sistemi dosyasında belirlenecektir.



\---



\# 11. Başlangıç Teknesi ve Oyun Zorluğu



| Tekne | Zorluk Etkisi | Açıklama |

|---|---|---|

| Kırlangıç 28 | Zor başlangıç | Daha çok bakım, daha fazla risk, daha düşük konfor |

| Denizkuşu 34 | Dengeli başlangıç | Oyuncuya sistemi öğrenmek için ideal alan verir |

| Atlas 40 | Ekonomik baskılı başlangıç | Güçlü tekne ama masraf yüksek |



Önemli denge kuralı:



> En pahalı tekne, otomatik en kolay oyun anlamına gelmemelidir.



Atlas 40 güçlüdür ama bakım, marina ve upgrade maliyetleri oyuncuyu ekonomik olarak zorlamalıdır.



\---



\# 12. Tekne ve Profil Uyum Matrisi



| Profil | En Uygun Tekne |

|---|---|

| Eski Kaptan | Kırlangıç 28 / Denizkuşu 34 |

| İçerik Üreticisi | Denizkuşu 34 / Atlas 40 |

| Teknik Usta | Kırlangıç 28 / Denizkuşu 34 |

| Maceracı Gezgin | Kırlangıç 28 / Denizkuşu 34 |

| Sosyal Girişimci | Atlas 40 / Denizkuşu 34 |

| Aile / Yaşam Kanalı | Denizkuşu 34 / Atlas 40 |



\---



\# 13. Tekne ve Marina Uyum Mantığı



Marina seçimi ve tekne seçimi birlikte oyuncunun başlangıç hissini belirlemelidir.



Örnek kombinasyonlar:



| Marina | Tekne | Oyun Hissi |

|---|---|---|

| Yalova + Kırlangıç 28 | Teknik toparlama oyunu | Eski tekneyi ucuza al, tersanede toparla |

| Göcek + Atlas 40 | Premium yaşam oyunu | Lüks başlangıç, sponsor ve konfor baskısı |

| Marmaris + Denizkuşu 34 | Dengeli denizcilik oyunu | Sağlam marina, sağlam tekne, dengeli rota |

| Kaş + Kırlangıç 28 | Zor macera oyunu | Küçük tekne, riskli başlangıç, güçlü hikaye |

| İstanbul + Atlas 40 | Medya ve marka oyunu | Pahalı ama sponsor potansiyeli yüksek |

| Kuşadası + Denizkuşu 34 | Ekonomik Ege oyunu | Dengeli ve düşük riskli başlangıç |



\---



\# 14. Upgrade Potansiyeli



Başlangıç tekneleri upgrade sistemini farklı şekilde etkilemelidir.



| Tekne | Upgrade Potansiyeli | Açıklama |

|---|---|---|

| Kırlangıç 28 | Orta | Her şey takılamaz, alan ve kapasite sınırlı |

| Denizkuşu 34 | Güçlü | Çoğu MVP upgrade için ideal denge |

| Atlas 40 | Çok Güçlü | Büyük sistemleri kaldırabilir ama maliyeti yüksek |



Örnek:



| Upgrade | Kırlangıç 28 | Denizkuşu 34 | Atlas 40 |

|---|---|---|---|

| Küçük güneş paneli | Uygun | Uygun | Uygun |

| Büyük lityum akü bankası | Sınırlı | Uygun | Çok uygun |

| Su yapıcı | Zor / sınırlı | Uygun | Çok uygun |

| Jeneratör | Genelde uygun değil | Sınırlı | Uygun |

| Uydu interneti | Uygun | Uygun | Uygun |

| Klima | Zor | Sınırlı | Uygun |

| Büyük radar sistemi | Sınırlı | Uygun | Çok uygun |



\---



\# 15. Okyanus Hazırlık Etkisi



Final hedeflerinden biri tekneyi okyanus geçişine uygun hale getirmektir.



Başlangıç teknesi bu süreci farklılaştırmalıdır.



| Tekne | Okyanus Hazırlığı |

|---|---|

| Kırlangıç 28 | En zor. Çok upgrade ve bakım ister. |

| Denizkuşu 34 | Orta. Doğru yatırımla hazır hale gelir. |

| Atlas 40 | En kolay. Ancak maliyetleri yüksektir. |



Okyanus hazırlığı şu sistemlere bağlı olacaktır:



1\. Güvenlik seviyesi

2\. Enerji kapasitesi

3\. Su kapasitesi

4\. Navigasyon seviyesi

5\. Bakım durumu

6\. Gövde / yelken durumu

7\. Yakıt ve acil durum hazırlığı



\---



\# 16. Sosyal Medya Etkisi



Tekne, sosyal medya içeriklerinin kalitesini ve algısını etkilemelidir.



| Tekne | Sosyal Medya Algısı |

|---|---|

| Kırlangıç 28 | Samimi, emek, dönüşüm, zorluk hikayesi |

| Denizkuşu 34 | Gerçekçi yaşam, dengeli gezi, aile ve rota içerikleri |

| Atlas 40 | Lüks yaşam, prestij, profesyonel dünya turu hissi |



Bu sayede her tekne sosyal medyada farklı içerik türleriyle güçlü olur.



\---



\# 17. Tekne Seçim Ekranı Kuralları



Tekne seçim ekranı mobilde sade ve karar odaklı olmalıdır.



Her tekne kartında şunlar görünmelidir:



1\. Tekne adı

2\. Tekne sınıfı

3\. Kısa tanım

4\. Ana avantaj

5\. Ana dezavantaj

6\. Zorluk seviyesi

7\. Satın alma maliyeti seviyesi

8\. Upgrade potansiyeli

9\. “Detayları gör” butonu



Örnek kart:



| Alan | Örnek |

|---|---|

| Tekne | Denizkuşu 34 |

| Sınıf | 34 ft dengeli cruiser |

| Tanım | Dengeli, güvenli ve öğrenmesi kolay başlangıç |

| Avantaj | Her sistemde orta-güçlü performans |

| Dezavantaj | Hiçbir alanda uç avantaj sunmaz |

| Zorluk | Kolay-Orta |

| Maliyet | Orta |



\---



\# 18. Tekneye İsim Verme



MVP’de mümkünse oyuncu teknesine özel isim verebilmelidir.



Bu özellik duygusal bağ için önemlidir.



Örnek:



```text

Teknene isim ver:

\[ Mavi Rüya ]

```



Eğer MVP’de süre kısıtı olursa bu özellik sonraki sürüme bırakılabilir.  

Ancak tasarım açısından güçlü öneridir.



\---



\# 19. MVP Kararı



İlk MVP’de tekne sistemi şu kapsamda uygulanacaktır:



| Özellik | MVP Durumu |

|---|---|

| 3 başlangıç teknesi | Dahil |

| Kurgusal tekne isimleri | Dahil |

| Tekne sınıfı / boyu | Dahil |

| Satın alma maliyeti seviyesi | Dahil |

| Avantaj / dezavantaj | Dahil |

| Başlangıç değerleri | Dahil |

| Upgrade potansiyeli | Dahil |

| Okyanus hazırlık etkisi | Dahil |

| Sosyal medya algısı | Dahil |

| Tekneye özel isim verme | Mümkünse dahil |

| Detaylı 3D tekne modeli | MVP dışı |

| Gerçek marka / model | Kullanılmayacak |

| Detaylı iç yerleşim simülasyonu | MVP dışı |

| Tam fiziksel yelken simülasyonu | MVP dışı |



\---



\# 20. Denge Kuralları



Tekne sistemi şu denge kurallarına uymalıdır:



1\. En pahalı tekne otomatik en iyi seçim olmamalıdır.

2\. En ucuz tekne oynanamaz kadar zayıf olmamalıdır.

3\. Her tekne farklı oyuncu profilleriyle anlamlı uyum kurmalıdır.

4\. Küçük tekne güçlü gelişim hikayesi sunmalıdır.

5\. Orta tekne en dengeli öğrenme deneyimini sunmalıdır.

6\. Büyük tekne prestij ve kapasite verirken ekonomik baskı oluşturmalıdır.

7\. Upgrade sistemi tekne seçimine göre farklı hissettirmelidir.

8\. Okyanus hazırlığı her teknede mümkün olmalı ama zorluk farklı olmalıdır.

9\. Sosyal medya sistemi teknenin algısını farklı değerlendirmelidir.

10\. Tekne oyuncuda duygusal bağ oluşturmalıdır.



\---



\# 21. İleri Sürüm Fikirleri



| Fikir | Not |

|---|---|

| Daha fazla başlangıç teknesi | 30 ft, 37 ft, katamaran gibi seçenekler ileri sürümde olabilir. |

| İkinci tekne satın alma | Dünya turu içinde tekne yükseltme sistemi olabilir. |

| Tekne satma / takas sistemi | Ekonomi sistemi olgunlaşınca eklenebilir. |

| Katamaran sınıfı | Konfor ve sosyal medya için güçlü ama çok pahalı seçenek. |

| Performans yelkenlisi | Hızlı ama konforsuz rota odaklı seçenek. |

| Tekne kozmetik mağazası | Renk, yelken deseni, bayrak ve iç dekor satılabilir. |

| Tekne kondisyon raporu | Alım öncesi ekspertiz hissi yaratabilir. |

| Sigorta sistemi | Büyük hasar risklerini yönetmek için eklenebilir. |



\---



\# 22. Kilitlenmeden Önce Kontrol Soruları



Bu belge kilitlenmeden önce şu sorular cevaplanmalıdır:



1\. 3 tekne birbirinden yeterince farklı hissettiriyor mu?

2\. En ucuz tekne zorlu ama oynanabilir mi?

3\. Orta tekne yeni oyuncu için en sağlıklı seçim mi?

4\. En pahalı tekne güçlü ama ekonomik olarak baskı yaratıyor mu?

5\. Tekne seçimi sosyal medya, rota ve upgrade sistemlerini etkiliyor mu?

6\. Her profil için anlamlı tekne seçeneği var mı?

7\. MVP için 3 tekne yeterli mi?

8\. Gerçek marka kullanmadan gerçekçi his yakalanıyor mu?



\---



\# 23. Kilit Kararı

Bu belge Başlangıç Tekneleri V1.0 olarak kabul edilmiş ve kilitlenmiştir.

İlk MVP’de 3 başlangıç teknesi kullanılacaktır:

1. Kırlangıç 28
2. Denizkuşu 34
3. Atlas 40

Bu tekneler gerçek marka/model isimleri kullanılmadan, gerçek tekne sınıflarından ve yelkenli boylarından ilham alınarak tasarlanmıştır.

Tekne seçimi oyuncunun başlangıç ekonomisini, rota riskini, sosyal medya algısını, upgrade potansiyelini, bakım maliyetlerini, konfor seviyesini ve okyanus hazırlık sürecini etkileyecektir.

MVP’de tekne sistemi şu kapsamla uygulanacaktır:

- 3 başlangıç teknesi
- Kurgusal tekne isimleri
- Tekne sınıfı / boyu
- Satın alma maliyeti seviyesi
- Avantaj / dezavantaj
- Başlangıç değerleri
- Upgrade potansiyeli
- Okyanus hazırlık etkisi
- Sosyal medya algısı
- Profil ve tekne uyum matrisi
- Marina ve tekne kombinasyon hissi

Tekneye özel isim verme özelliği mümkünse MVP’ye dahil edilecektir. Süre kısıtı olursa sonraki sürüme bırakılabilir.

Detaylı 3D tekne modeli, gerçek marka/model kullanımı, tam fiziksel yelken simülasyonu, ikinci tekne satın alma, tekne takas sistemi ve katamaran sınıfı MVP dışıdır.

Bu belge kilitlendikten sonra sıradaki ana tasarım bölümü:

> Dünya Rotası V1.0