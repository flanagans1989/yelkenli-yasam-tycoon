\# Yelkenli Yaşam Tycoon — Liman ve Deniz Modu V1.0



\## Belge Durumu



\- Durum: Kilitlendi

\- Sürüm: V1.0

\- İlgili ana belge: docs/01\_Oyun\_Anayasasi.md

\- Amaç: Oyunun iki ana oynanış modunu netleştirmek



\---



\## 1. Sistem Amacı



Yelkenli Yaşam Tycoon’da oyun iki ana moda ayrılır:



1\. Liman Modu

2\. Deniz Modu



Bu ayrım oyunun ritmini oluşturur.



Liman oyuncunun hazırlık, geliştirme, bakım, sponsor, alışveriş ve içerik üretim merkezidir.



Deniz ise seyir, risk, hava durumu, tüketim, kriz, rota ilerlemesi ve deniz içeriği merkezidir.



Amaç:



1\. Oyuncunun nerede ne yapabileceğini netleştirmek

2\. Limanı güvenli karar alanı yapmak

3\. Denizi risk ve hikaye alanı yapmak

4\. Tekne upgrade sistemini limana bağlamak

5\. Seyir ve rota sistemini denize bağlamak

6\. Oyunda “hazırlık → yolculuk → sonuç” döngüsü kurmak



\---



\## 2. Ana Tasarım Kuralı



Liman ve deniz modu şu soruya cevap vermelidir:



> Oyuncu şu anda hazırlık mı yapıyor, yoksa kararlarının sonucunu denizde mi yaşıyor?



Liman modu sadece menü ekranı olmamalıdır.  

Deniz modu sadece bekleme ekranı olmamalıdır.



\---



\## 3. Ana Oyun Ritmi



Oyunun temel ritmi şudur:



```text

Limana var

↓

Durumu kontrol et

↓

Bakım / upgrade / içerik / sponsor kararları al

↓

Yeni rotaya hazırlan

↓

Denize çık

↓

Seyir süresi işler

↓

Hava, tüketim, kriz ve içerik olayları yaşanır

↓

Yeni limana var

↓

Ödül, gelir, takipçi ve yeni fırsatlar açılır

```



Kısa döngü:



```text

Hazırlan → Seyre çık → Risk yaşa → Hikaye üret → Limana ulaş → Büyü

```



\---



\## 4. Modların Genel Karşılaştırması



| Alan | Liman Modu | Deniz Modu |

|---|---|---|

| Ana his | Hazırlık ve karar | Risk ve sonuç |

| Upgrade | Yapılır | Yapılamaz |

| Büyük tamir | Yapılır | Yapılamaz |

| Hafif acil çözüm | Sınırlı | Yapılabilir |

| Sponsor görüşmesi | Yapılır | Genelde yapılamaz |

| Sosyal medya içeriği | Şehir, marina, tekne yaşamı | Seyir, fırtına, kriz, deniz vlogu |

| Kaynak tüketimi | Düşük | Yüksek |

| Risk | Düşük | Orta-Yüksek |

| Oyun ilerlemesi | Hazırlık | Rota ilerlemesi |

| Oyuncu kararı | Planlama | Kriz yönetimi |



\---



\# 5. Liman Modu



\## 5.1 Genel Tanım



Liman modu, oyuncunun güvenli karar alanıdır.



Oyuncu burada teknesini geliştirir, bakım yapar, sponsorlarla görüşür, içerik üretir, alışveriş yapar ve yeni rotaya hazırlanır.



Liman oyuncuya şu hissi vermelidir:



> “Şimdi doğru hazırlığı yaparsam denizde daha güçlü olurum.”



\---



\## 5.2 Liman Modunda Yapılabilecek Ana Aksiyonlar



| No | Aksiyon | Açıklama |

|---:|---|---|

| 1 | Tekne Durumunu Kontrol Et | Enerji, su, yakıt, bakım, güvenlik ve upgrade durumu görülür. |

| 2 | Upgrade Yap | Tekne parçaları satın alınır ve takılır. |

| 3 | Bakım / Tamir Yap | Arıza riski düşürülür, hasarlar giderilir. |

| 4 | Sosyal Medya İçeriği Üret | Marina, şehir, tekne yaşamı veya hazırlık içeriği üretilir. |

| 5 | Sponsor Görüş | Sponsor teklifleri incelenir veya anlaşma yapılır. |

| 6 | Alışveriş Yap | Yakıt, su, gıda, yedek parça ve küçük ekipman alınır. |

| 7 | Rota Planla | Bir sonraki rota seçilir ve riskler görülür. |

| 8 | Mürettebat / Yaşam Hazırlığı | Moral, konfor ve yaşam düzeni kontrol edilir. |

| 9 | Günlük Marina Fırsatını İncele | İndirim, özel görev veya sponsor fırsatı görülebilir. |

| 10 | Denize Çık | Hazırlık yeterliyse seyir başlatılır. |



\---



\## 5.3 Liman Modu Ana Ekranı



Liman modu ana ekranında oyuncuya fazla bilgi yığılmamalıdır.



Mobilde ana ekran şu bloklardan oluşmalıdır:



1\. Bulunulan marina

2\. Tekne genel durumu

3\. Ana aksiyon butonları

4\. Günlük fırsat / sponsor / trend alanı

5\. Bir sonraki önerilen rota

6\. Event log / son gelişmeler



Örnek ana aksiyonlar:



| Buton | İşlev |

|---|---|

| Tekneyi Kontrol Et | Sistem durumunu açar |

| Upgrade Yap | Parça geliştirme ekranına gider |

| İçerik Üret | Sosyal medya ekranına gider |

| Rota Planla | Dünya rotası ekranına gider |

| Denize Çık | Seçilen rotayı başlatır |



\---



\## 5.4 Limanda Upgrade Kuralı



Büyük upgrade’ler sadece limanda yapılabilir.



Örnek büyük upgrade’ler:



\- Güneş paneli sistemi

\- Lityum akü bankası

\- Inverter / şarj sistemi

\- Radar

\- AIS

\- Otopilot

\- Su yapıcı

\- Jeneratör

\- Büyük güvenlik ekipmanı

\- Klima

\- Uydu interneti

\- Gövde bakım işleri



Bazı upgrade’ler her limanda yapılamaz.



Örnek:



| Upgrade | Küçük Marina | Büyük Marina |

|---|---|---|

| Basit bakım | Yapılır | Yapılır |

| Güneş paneli | Sınırlı | Yapılır |

| Su yapıcı | Genelde yapılamaz | Yapılır |

| Radar | Sınırlı | Yapılır |

| Jeneratör | Yapılamaz | Yapılır |

| Büyük gövde bakımı | Yapılamaz | Yapılır |



\---



\## 5.5 Limanda Bakım / Tamir



Bakım sistemi oyuncuya ertelenebilir ama riskli karar vermelidir.



Oyuncu bakım yapmazsa kısa vadede para kalır.  

Ama denizde arıza, gecikme ve daha büyük masraf riski artar.



Bakım türleri:



| Bakım Türü | Etki |

|---|---|

| Motor bakımı | Motor arızası riskini azaltır |

| Elektrik bakımı | Enerji krizi riskini azaltır |

| Yelken bakımı | Seyir performansı ve fırtına direnci sağlar |

| Gövde bakımı | Su alma / hasar riskini azaltır |

| Navigasyon kontrolü | Rota sapması riskini azaltır |

| Güvenlik kontrolü | Büyük rota izinleri ve okyanus hazırlığı için önemlidir |



\---



\## 5.6 Limanda İçerik Üretimi



Limanda üretilebilecek içerik türleri:



| İçerik Türü | Güçlü Platform |

|---|---|

| Marina yaşamı | InstaSea / FacePort |

| Tekne turu | ViewTube / InstaSea |

| Bakım ve hazırlık | ViewTube / FacePort |

| Şehir gezisi | InstaSea / ClipTok |

| Sponsorlu ürün tanıtımı | InstaSea / ViewTube |

| Alışveriş / ekipman hazırlığı | ViewTube / ClipTok |

| Dünya turu güncellemesi | FacePort / ViewTube |



Liman içerikleri daha güvenlidir ama deniz içerikleri kadar riskli/viral olmayabilir.



\---



\## 5.7 Limanda Sponsor Sistemi



Sponsor görüşmeleri çoğunlukla limanda yapılır.



Sponsorlar şu kriterlere göre gelir:



1\. Toplam takipçi

2\. Platform gücü

3\. Oyuncu profili

4\. Marina tipi

5\. Tekne algısı

6\. İçerik kalitesi

7\. Marka uyumu



Örnek:



| Profil | Daha Uygun Sponsor |

|---|---|

| İçerik Üreticisi | Kamera, drone, sosyal medya ekipmanı |

| Eski Kaptan | Denizcilik ekipmanı, güvenlik markaları |

| Teknik Usta | Motor, bakım, enerji sistemleri |

| Maceracı Gezgin | Outdoor, aksiyon kamera, keşif markaları |

| Sosyal Girişimci | Premium yaşam, marina, teknoloji |

| Aile / Yaşam Kanalı | Konfor, mutfak, yaşam, aile dostu markalar |



\---



\## 5.8 Liman Maliyeti



Limanda kalmanın maliyeti olmalıdır.



Bu maliyet şu alanlara göre değişir:



\- Marina tipi

\- Tekne boyu

\- Kalınan gün

\- Sezon / etkinlik

\- Marina prestiji

\- Oyuncunun sponsor/üyelik avantajları



Örnek:



| Marina Tipi | Maliyet Hissi |

|---|---|

| Ekonomik marina | Düşük-Orta |

| Dengeli marina | Orta |

| Premium marina | Yüksek |

| Büyük şehir marinası | Çok yüksek |

| Teknik tersane bölgesi | Hizmete göre değişken |



\---



\# 6. Deniz Modu



\## 6.1 Genel Tanım



Deniz modu, oyuncunun limanda aldığı kararların sonucunu yaşadığı alandır.



Oyuncu denize çıktığında artık her şeyi özgürce değiştiremez.  

Hazırlık eksikse bunun bedelini denizde hisseder.



Deniz modu oyuncuya şu hissi vermelidir:



> “Şimdi hazırlığımın gerçekten yeterli olup olmadığını göreceğim.”



\---



\## 6.2 Deniz Modunda Yapılabilecek Ana Aksiyonlar



| No | Aksiyon | Açıklama |

|---:|---|---|

| 1 | Seyri Takip Et | Rota ilerleme yüzdesi ve tahmini varış görülür. |

| 2 | Hava Durumunu İzle | Hava riski ve rota etkisi takip edilir. |

| 3 | Kaynakları Yönet | Enerji, su, yakıt ve moral durumu kontrol edilir. |

| 4 | Deniz İçeriği Üret | Seyir, manzara, fırtına veya kriz vlogu çekilir. |

| 5 | Krize Müdahale Et | Arıza, hava, enerji veya rota sorunu çözülür. |

| 6 | Rota Kararı Ver | Devam et, yavaşla, alternatif rota seç veya limana dön. |

| 7 | Acil Paket Kullan | Token veya kredi ile sınırlı acil çözüm kullanılabilir. |

| 8 | Varışa İlerle | Seyir tamamlandığında yeni limana ulaşılır. |



\---



\## 6.3 Deniz Modunda Yapılamayacak İşler



Denizde yapılamayacak veya çok sınırlı yapılacak işler:



| İş | Deniz Modunda Durum |

|---|---|

| Büyük upgrade | Yapılamaz |

| Büyük motor tamiri | Yapılamaz |

| Gövde bakımı | Yapılamaz |

| Büyük elektrik sistemi kurulumu | Yapılamaz |

| Yeni sponsor anlaşması | Genelde yapılamaz |

| Büyük alışveriş | Yapılamaz |

| Marina hizmeti | Yapılamaz |



Sadece küçük acil çözümler yapılabilir:



\- Geçici motor müdahalesi

\- Enerji tasarrufu modu

\- Yelken onarımı

\- Su tüketimini azaltma

\- Acil rota değişimi

\- Uydu destek çağrısı

\- Acil enerji/su/yakıt paketi



\---



\## 6.4 Deniz Modu Ana Ekranı



Deniz modu ana ekranı şu bilgileri göstermelidir:



1\. Mevcut rota

2\. Varış noktası

3\. Rota ilerlemesi

4\. Tahmini kalan süre

5\. Hava riski

6\. Enerji

7\. Su

8\. Yakıt

9\. Bakım / hasar durumu

10\. İçerik fırsatı

11\. Olası kriz uyarısı



Mobilde çok fazla detay aynı anda verilmemeli; oyuncuya net karar sunulmalıdır.



\---



\## 6.5 Deniz Modu Riskleri



| Risk | Açıklama | Olası Sonuç |

|---|---|---|

| Fırtına | Hava sertleşir | Hasar, gecikme, viral içerik fırsatı |

| Enerji Krizi | Akü düşer | İçerik üretimi azalır, navigasyon riski artar |

| Su Azalması | Uzun seyirde kaynak biter | Moral ve güvenlik düşer |

| Yakıt Azalması | Motor desteği sınırlanır | Varış süresi uzar |

| Motor Arızası | Mekanik sorun çıkar | Gecikme veya tamir maliyeti |

| Yelken Hasarı | Seyir performansı düşer | Süre uzar, risk artar |

| Navigasyon Sorunu | Rota sapması olur | Gecikme, ekstra tüketim |

| İçerik Ekipmanı Sorunu | Kamera/drone/laptop aksar | İçerik kalitesi düşer |

| Moral Düşüşü | Uzun seyir yorar | İçerik ve karar kalitesi düşer |



\---



\## 6.6 Deniz Modunda İçerik Üretimi



Denizde içerik üretimi daha riskli ama daha güçlü etki verebilir.



İçerik türleri:



| İçerik Türü | Etki |

|---|---|

| Seyir vlogu | Dengeli takipçi ve gelir |

| Fırtına vlogu | Yüksek viral şans, yüksek risk |

| Gün doğumu / gün batımı | InstaSea ve FacePort uyumu |

| Teknik kriz içeriği | ViewTube ve niş takipçi |

| Okyanus yalnızlığı | ViewTube belgesel etkisi |

| Canlı yayın | LiveWave için güçlü, enerji tüketir |

| Rota günlüğü | Sadık takipçi üretir |



Deniz içeriği şu değerlerden etkilenir:



1\. Oyuncu profili

2\. İçerik ekipmanı

3\. Hava durumu

4\. Rota zorluğu

5\. Tekne durumu

6\. Platform seçimi

7\. Trend sistemi

8\. Risk seviyesi



\---



\## 6.7 Deniz Modunda Karar Seçenekleri



Denizde oyuncuya kriz anında 2-4 net seçenek sunulmalıdır.



Örnek olay:



> Hava sertleşiyor. Rüzgar beklenenden güçlü. Ne yapacaksın?



Seçenekler:



| Seçenek | Sonuç |

|---|---|

| Rotaya devam et | Süre korunur ama hasar riski artar |

| Yavaşla ve güvenli seyret | Süre uzar ama risk azalır |

| Yakındaki limana sap | Para ve zaman kaybı ama güvenli |

| Fırtına vlogu çek | Viral şans artar ama ekipman/hasar riski yükselir |



Bu yapı oyuna gerçek karar hissi verir.



\---



\## 6.8 Varış Sistemi



Deniz seyri tamamlandığında oyuncu yeni limana ulaşır.



Varışta şu sonuçlar gösterilir:



1\. Harcanan oyun günü

2\. Kullanılan enerji / su / yakıt

3\. Oluşan hasar veya bakım etkisi

4\. Üretilen içerik sonucu

5\. Kazanılan takipçi

6\. Kazanılan gelir

7\. Sponsor etkisi

8\. Açılan yeni fırsatlar

9\. Bir sonraki önerilen rota



Varış ekranı oyuncuya ödül hissi vermelidir.



\---



\# 7. Limandan Denize Geçiş Kuralı



Oyuncu denize çıkmadan önce rota hazırlık kontrolü görmelidir.



Kontrol alanları:



| Kontrol | Açıklama |

|---|---|

| Bakım seviyesi | Tekne seyir için yeterli mi? |

| Enerji | Seyir boyunca yeterli mi? |

| Su | Mürettebat/yaşam için yeterli mi? |

| Yakıt | Acil motor desteği için yeterli mi? |

| Navigasyon | Rota için yeterli mi? |

| Güvenlik | Rota riskine uygun mu? |

| Hava | Risk seviyesi kabul edilebilir mi? |

| İçerik hazırlığı | Kamera/drone/laptop hazır mı? |



Oyuncu hazırlıksızsa uyarı almalıdır:



> Bu rotaya çıkabilirsin ama risk yüksek. Hazırlıksız seyir arıza, gecikme veya büyük masraf doğurabilir.



Bazı büyük okyanus geçişlerinde ise minimum gereksinimler karşılanmadan çıkış engellenebilir.



\---



\# 8. Denizden Limana Dönüş Kuralı



Oyuncu rotayı tamamladığında veya acil durumda limana döndüğünde liman moduna geçer.



Liman dönüşünde şu alanlar güncellenir:



1\. Bulunulan marina

2\. Tekne bakım durumu

3\. Kaynak seviyeleri

4\. Takipçi sayısı

5\. Gelir

6\. Sponsor ilgisi

7\. Event log

8\. Rota ilerlemesi

9\. Dünya turu yüzdesi



\---



\# 9. Zaman Sistemi



Oyun içi zaman, gerçek zamanla birebir olmak zorunda değildir.



MVP için öneri:



\- Limandaki her büyük aksiyon oyun günü tüketebilir

\- Denizde her rota belirli oyun günü sürer

\- Upgrade ve bakım işlemleri süre ister

\- Token sistemi bazı süreleri hızlandırabilir

\- Reklam ödülü küçük süre avantajı verebilir



Örnek:



| Aksiyon | Süre Hissi |

|---|---|

| Kısa içerik üretimi | Aynı gün |

| Büyük video üretimi | 1 oyun günü |

| Küçük bakım | 1 oyun günü |

| Büyük bakım | 2-4 oyun günü |

| Küçük upgrade | 1-2 oyun günü |

| Büyük upgrade | 3-7 oyun günü |

| Kısa rota | 1-3 oyun günü |

| Uzun rota | 7-15 oyun günü |

| Okyanus geçişi | 15-30 oyun günü |



\---



\# 10. Token Kullanım Noktaları



Token sistemi başarı satmayacaktır.



Ancak liman ve deniz modunda kolaylık sağlayabilir.



| Kullanım | Mod | Açıklama |

|---|---|---|

| Upgrade süresi hızlandır | Liman | Kurulum daha hızlı tamamlanır |

| Bakım süresi hızlandır | Liman | Bakım daha hızlı biter |

| Tamir süresi hızlandır | Liman | Tamir daha hızlı tamamlanır |

| Acil enerji paketi | Deniz | Enerji krizi geçici çözülür |

| Acil su paketi | Deniz | Su riski geçici azaltılır |

| Acil yakıt desteği | Deniz | Motor desteği sağlanır |

| Kriz müdahale desteği | Deniz | Hasarı azaltabilir ama tamamen yok etmez |



Token ile yapılamayacaklar:



1\. Dünya turunu doğrudan bitirmek

2\. 1 milyon takipçiyi satın almak

3\. Okyanus hazırlık şartını tamamen atlamak

4\. Büyük rotaları risksiz hale getirmek

5\. Oyunu otomatik kazandırmak



\---



\# 11. Mobil UX Kuralları



Liman ve deniz modu mobilde hızlı anlaşılmalıdır.



Kurallar:



1\. Ana ekranda en fazla 3-5 ana aksiyon görünmelidir.

2\. Kritik değerler renk/ikon ile anlaşılır olmalıdır.

3\. Oyuncu tek bakışta “ne yapmalıyım?” sorusunun cevabını görmelidir.

4\. Deniz modunda kriz anlarında uzun metin yerine net seçenekler sunulmalıdır.

5\. Liman modunda aksiyonlar kart yapısıyla gösterilmelidir.

6\. Her aksiyonun sonucu önceden belirtilmelidir.

7\. Gereksiz teknik detaylar arka planda hesaplanmalı, oyuncuya sade sonuç gösterilmelidir.



\---



\# 12. MVP Kapsamı



İlk MVP’de liman ve deniz modu şu kapsamda uygulanacaktır:



| Özellik | MVP Durumu |

|---|---|

| Liman modu ana ekranı | Dahil |

| Deniz modu ana ekranı | Dahil |

| Limanda upgrade | Dahil |

| Limanda bakım | Dahil |

| Limanda içerik üretimi | Dahil |

| Limanda rota planlama | Dahil |

| Denizde seyir ilerlemesi | Dahil |

| Denizde kaynak tüketimi | Dahil |

| Denizde basit risk olayları | Dahil |

| Denizde içerik üretimi | Dahil |

| Varış ekranı | Dahil |

| Hazırlık kontrolü | Dahil |

| Büyük marina gereksinimi | Basit düzeyde dahil |

| Gerçek zamanlı hava entegrasyonu | MVP dışı |

| Tam fiziksel yelken simülasyonu | MVP dışı |

| Detaylı mürettebat yönetimi | MVP dışı |

| Multiplayer liman sistemi | MVP dışı |



\---



\# 13. Denge Kuralları



Liman ve deniz modu şu denge kurallarına uymalıdır:



1\. Liman güvenli ama maliyetli olmalıdır.

2\. Deniz riskli ama ilerleme ve hikaye üretmelidir.

3\. Oyuncu limanda iyi hazırlanırsa denizde avantaj hissetmelidir.

4\. Hazırlıksız denize çıkmak mümkün olabilir ama riskli olmalıdır.

5\. Büyük okyanus geçişleri hazırlıksız yapılamamalıdır.

6\. Deniz modu bekleme ekranı olmamalı; olay ve karar üretmelidir.

7\. Liman modu sadece mağaza ekranı olmamalı; stratejik hazırlık hissi vermelidir.

8\. Her seyir sonunda oyuncuya sonuç ve ödül gösterilmelidir.

9\. Her limana varış yeni fırsat hissi yaratmalıdır.

10\. Oyuncu bir sonraki rotaya çıkmak için motive olmalıdır.



\---



\# 14. İleri Sürüm Fikirleri



| Fikir | Not |

|---|---|

| Günlük marina fırsatları | Retention için güçlü sistem |

| Detaylı hava tahmin sistemi | Rota kararlarını derinleştirir |

| Mürettebat / aile moral sistemi | Aile yaşam profili için anlamlı olabilir |

| Marina itibarı | Oyuncu bazı limanlarda tanındıkça avantaj kazanabilir |

| Acil kurtarma sistemi | Kriz yönetimi ve token sistemiyle bağlanabilir |

| Seyir günlüğü | Her rota sonrası otomatik günlük oluşabilir |

| Liman özel görevleri | Her limanı farklı hissettirebilir |

| Mevsimsel rota riskleri | Okyanus geçişlerini daha gerçekçi yapar |



\---



\# 15. Kilit Kararı



Bu belge Liman ve Deniz Modu V1.0 olarak kabul edilmiş ve kilitlenmiştir.



Oyunun ana ritmi şu iki mod üzerine kurulacaktır:



1\. Liman Modu: hazırlık, upgrade, bakım, sponsor, alışveriş, içerik ve rota planlama

2\. Deniz Modu: seyir, risk, hava, tüketim, kriz, deniz içeriği ve varış



Bu sistem, oyunun tycoon ve simulation yapısını birbirine bağlayan ana oynanış omurgasıdır.



Bu belge kilitlendikten sonra sıradaki ana tasarım bölümü:



> Tekne Upgrade Sistemi V1.0

