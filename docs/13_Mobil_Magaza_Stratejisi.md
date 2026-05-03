\# Yelkenli Yaşam Tycoon — Mobil Mağaza Stratejisi V1.0



\## Belge Durumu



\- Durum: Kilitlendi

\- Sürüm: V1.0

\- İlgili ana belge: docs/01\_Oyun\_Anayasasi.md

\- Amaç: Oyunun Google Play ve App Store hedefiyle ticari mobil ürün olarak nasıl konumlandırılacağını netleştirmek



\---



\## 1. Sistem Amacı



Bu belge, Yelkenli Yaşam Tycoon’un sadece çalışan bir prototip değil, mobil mağazalara çıkabilecek ticari bir oyun ürünü olarak tasarlanmasını sağlar.



Oyunun hedefi:



\- Web prototip olarak geliştirilmek

\- Mobil oynanışa uygun hale getirilmek

\- Google Play’e hazırlanmak

\- App Store’a hazırlanmak

\- Pay-to-win olmayan gelir modeli kurmak

\- Günlük geri dönüş sebebi oluşturmak

\- Uzun vadeli güncellemelere uygun yapı kurmak



\---



\## 2. Ana Ürün Konumu



Yelkenli Yaşam Tycoon şu şekilde konumlandırılır:



```text

Türkiye’den başlayıp dünya turuna çıkan,

sosyal medya içerikleriyle büyüyen,

teknesini gerçek denizcilik sistemleriyle geliştiren

mobil tycoon / simulation oyunu.

```



Kısa mağaza vaadi:



```text

Küçük bir yelkenliyle Türkiye’den başla, içerik üret, takipçi kazan, tekneni geliştir ve dünya turunu tamamla.

```



\---



\## 3. Hedef Platformlar



| Platform | Durum | Not |

|---|---|---|

| Web Prototip | İlk geliştirme hedefi | React + Vite + TypeScript |

| Android | İlk mobil yayın hedefi | Google Play |

| iOS | İkinci mobil yayın hedefi | App Store |

| Tablet | İleri optimizasyon | Daha geniş UI avantajı |

| Steam / PC | İleri olasılık | Şimdilik öncelik değil |



\---



\## 4. Ürün Tipi



Oyun şu modelle tasarlanacaktır:



```text

Free-to-play

\+ isteğe bağlı reklam ödülü

\+ oyun içi token sistemi

\+ kozmetik ürünler

\+ ileri sürümde sezon / kaptan pass

```



Ana karar:



> Oyun ücretsiz indirilebilir olmalıdır.



Sebep:



1\. Mobilde daha geniş oyuncu kitlesine ulaşır

2\. Oyuncu önce deneyip bağ kurabilir

3\. Tycoon/simulation oyunlarda uzun vadeli gelir modeli daha uygundur

4\. Reklam, token, kozmetik ve sezon sistemi için alan açar



\---



\## 5. Monetizasyon Ana Kuralı



Ana kural:



```text

Başarı satılmaz.

Zaman, konfor ve kozmetik satılır.

```



Oyuncu para harcamadan da:



1\. Dünya turunu tamamlayabilmeli

2\. 1 milyon takipçiye ulaşabilmeli

3\. Teknesini okyanus geçişine hazırlayabilmeli



Satın alma yapan oyuncu ise:



\- Daha hızlı bekleyebilir

\- Bazı krizleri daha rahat atlatabilir

\- Kozmetik olarak farklılaşabilir

\- Reklamları kaldırabilir

\- Sezon etkinliklerinde ek ödüller kazanabilir



\---



\## 6. Gelir Kaynakları



| Gelir Kaynağı | MVP Durumu | Açıklama |

|---|---|---|

| Token paketleri | İleri mobil sürüm | Süre hızlandırma ve kolaylık |

| İsteğe bağlı reklam ödülü | Mobil MVP / sonrası | Zorunlu olmayan ödüllü reklam |

| Reklam kaldırma paketi | İleri sürüm | Premium rahatlık |

| Kozmetik tekne paketleri | İleri sürüm | Renk, yelken deseni, bayrak |

| Başlangıç destek paketi | İleri sürüm | Az token + küçük kozmetik + küçük destek |

| Kaptan Pass | MVP sonrası | Sezonluk görev ve ödül sistemi |

| Rota genişleme paketi | İleri sürüm | Alternatif rotalar |

| Premium tema paketleri | İleri sürüm | Marina/arayüz/tekne temaları |



\---



\## 7. Token Ürün Stratejisi



Token ürünleri başarı satmamalıdır.



Token satılabilecek alanlar:



| Alan | Uygun mu? | Not |

|---|---|---|

| Upgrade süresi hızlandırma | Evet | Sağlıklı kullanım |

| Bakım süresi hızlandırma | Evet | Sağlıklı kullanım |

| Tamir süresi hızlandırma | Evet | Sağlıklı kullanım |

| Acil enerji / su / yakıt desteği | Evet | Sınırlı kullanılmalı |

| Günlük fırsat yenileme | Evet | Limitli olmalı |

| Seyahat süresi azaltma | Evet | Okyanusu anında bitirmemeli |

| Takipçi satın alma | Hayır | Pay-to-win |

| Viral başarı satın alma | Hayır | Oyun dengesini bozar |

| Dünya turunu bitirme | Hayır | Ana başarı satılamaz |

| Okyanus şartını atlama | Hayır | Simulation yapısını bozar |



\---



\## 8. Reklam Stratejisi



Reklam sistemi isteğe bağlı olmalıdır.



Ana kural:



```text

Reklam izlemeyen oyuncu cezalandırılmaz.

Reklam izleyen oyuncu küçük kolaylık kazanır.

```



Ödüllü reklam kullanım alanları:



| Reklam Ödülü | Açıklama |

|---|---|

| Küçük token | Günlük sınırlı |

| Küçük kredi | Oyuncuyu toparlar |

| Bakım süresi azaltma | Küçük kolaylık |

| İçerik gelir bonusu | Bir sonraki içerikte küçük bonus |

| Marina fırsatı yenileme | Günlük sınırlı |

| Acil enerji desteği | Deniz modunda sınırlı |



Kullanılmayacak reklam tipi:



\- Zorunlu her ekran geçişi reklamı

\- Oyuncuyu kilitleyen reklam

\- Başarı şartı için zorunlu reklam

\- Sürekli pop-up reklam



\---



\## 9. Reklam Kaldırma Paketi



İleri sürümde tek seferlik premium ürün olabilir.



Paket mantığı:



```text

Reklamları Kaldır

```



Etkisi:



\- İsteğe bağlı reklam teklifleri kaldırılır veya reklamsız ödül alternatifi verilir

\- Oyun daha temiz oynanır

\- Pay-to-win değildir



Not:



Reklam kaldırma, token veya başarı paketiyle karıştırılmamalıdır.



\---



\## 10. Kozmetik Ürün Stratejisi



Kozmetik ürünler güvenli gelir alanıdır.



Satılabilecek kozmetikler:



| Kozmetik | Açıklama |

|---|---|

| Tekne gövde rengi | Görsel kişiselleştirme |

| Yelken deseni | Tekne kimliği |

| Bayrak / flama | Oyuncu tarzı |

| İç dekor teması | Lifestyle içerik hissi |

| Profil çerçevesi | Oyuncu kartı görünümü |

| Marina arka plan teması | UI hissi |

| Özel rota rozeti | Başarım görünümü |



Kural:



> Kozmetik ürünler oyunu kazandırmaz, oyuncunun teknesine ve profil kimliğine bağ kurmasını sağlar.



\---



\## 11. Kaptan Pass / Sezon Sistemi



MVP sonrası düşünülecek sistemdir.



Kaptan Pass şunları içerebilir:



\- Sezonluk görevler

\- Özel kozmetik ödüller

\- Özel rozetler

\- Ek günlük görevler

\- Sezon temalı marina etkinlikleri

\- Özel sponsor görevleri

\- Özel rota meydan okumaları



Kaptan Pass şu şeyleri vermemelidir:



\- Direkt 1 milyon takipçi

\- Direkt dünya turu ilerlemesi

\- Direkt okyanus hazırlığı

\- Ana oyunu kıracak büyük avantaj



\---



\## 12. Mağaza Ürün Örnekleri



İleri sürüm ürün taslakları:



| Ürün | Tür | Not |

|---|---|---|

| Küçük Token Paketi | IAP | Birkaç hızlandırma |

| Orta Token Paketi | IAP | Bakım ve upgrade desteği |

| Büyük Token Paketi | IAP | Uzun vadeli kolaylık |

| Reklamları Kaldır | IAP | Premium rahatlık |

| Başlangıç Destek Paketi | IAP | Küçük token + kozmetik |

| Yelken Deseni Paketi | Kozmetik | Pay-to-win değil |

| Premium Gövde Rengi | Kozmetik | Görsel ürün |

| Kaptan Pass Sezon 1 | Sezon | MVP sonrası |

| Akdeniz Kozmetik Paketi | Kozmetik | Tema odaklı |

| Dünya Turu Rozet Paketi | Kozmetik | Profil görünümü |



\---



\## 13. Store Sayfası Konumlandırması



Store sayfasında oyuncuya şunlar net gösterilmelidir:



1\. Türkiye’den başlayan dünya turu

2\. Tekne geliştirme sistemi

3\. Sosyal medya içerik üretimi

4\. Takipçi ve sponsor büyümesi

5\. Gerçekçi ama eğlenceli denizcilik hissi

6\. Rota, hava, bakım ve risk yönetimi

7\. Mobil tycoon ilerlemesi

8\. Pay-to-win olmayan sistem



\---



\## 14. Kısa Açıklama Taslakları



Türkçe kısa açıklama alternatifleri:



```text

Kendi yelkenlinle Türkiye’den dünya turuna çık, içerik üret, takipçi kazan ve tekneni geliştir.

```



```text

Yelkenli yaşamını tycoon oyununa çevir: rota planla, içerik üret, sponsor bul, dünya turunu tamamla.

```



```text

Küçük bir tekneden 1 milyon takipçili dünya turu markasına dönüş.

```



Global İngilizce isim ve açıklama daha sonra ayrıca değerlendirilecektir.



\---



\## 15. Uzun Açıklama Taslağı



Store uzun açıklaması için temel metin:



```text

Yelkenli Yaşam Tycoon’da Türkiye’de seçtiğin bir marinadan başla, kendi tekneni seç, sosyal medya içerikleri üret, takipçi kazan, sponsor anlaşmaları yap ve dünya turuna çık.



Limanlarda tekneni geliştir, bakım yap, ekipman al ve içerik planla. Denizde hava durumuyla, enerjiyle, suyla, yakıtla, arızalarla ve rota riskleriyle mücadele et.



ViewTube, ClipTok, InstaSea ve FacePort gibi kurgusal platformlarda büyü. Tekneni güneş paneli, lityum akü, radar, otopilot, güvenlik ekipmanları, su yapıcı, drone ve daha birçok sistemle geliştir.



Final hedefin:

Dünya turunu tamamla.

1 milyon takipçiye ulaş.

Tekneni okyanus geçişine hazır hale getir.

```



\---



\## 16. Store Görsel Planı



Store screenshot’ları şu ekranları göstermelidir:



| Görsel | Amaç |

|---|---|

| Profil seçimi | Oyuncu kimliğini gösterir |

| Marina seçimi | Türkiye başlangıcını gösterir |

| Tekne seçimi | Tycoon ana karakterini gösterir |

| Liman modu | Upgrade ve hazırlık hissi |

| Deniz modu | Risk ve seyir hissi |

| Sosyal medya ekranı | Takipçi ve gelir sistemi |

| Rota haritası | Dünya turu hedefi |

| Upgrade ekranı | Tekne gelişimi |

| Final hedef paneli | Dünya turu + 1M takipçi + okyanus hazırlığı |



\---



\## 17. Store Video Fragman Planı



15-30 saniyelik kısa tanıtım videosu hedeflenir.



Sahne akışı:



1\. Türkiye marinasında başlangıç

2\. Oyuncu profili seçimi

3\. Tekne seçimi

4\. İlk içerik üretimi

5\. Takipçi artışı

6\. Upgrade takılması

7\. Denize çıkış

8\. Fırtına / kriz

9\. Atlantik / dünya rotası

10\. 1 milyon takipçi hedefi

11\. Final slogan



Fragman sloganı:



```text

Küçük bir tekneden dünya turu markasına.

```



\---



\## 18. İlk 5 Dakika Stratejisi



Mobil oyuncu ilk 5 dakikada oyunun vaadini anlamalıdır.



İlk 5 dakika hedefleri:



1\. Oyuncu profilini seçer

2\. Başlangıç marinasını seçer

3\. Başlangıç teknesini seçer

4\. Teknesine isim verir

5\. İlk içeriğini üretir

6\. İlk takipçilerini kazanır

7\. İlk küçük upgrade veya bakım kararını verir

8\. İlk kısa rotaya hazırlanır



Oyuncu ilk 5 dakika sonunda şunu hissetmelidir:



> “Ben bu tekneyi büyütüp dünya turuna çıkaracağım.”



\---



\## 19. Günlük Geri Dönüş Stratejisi



Oyuncunun ertesi gün oyunu açması için nedenler olmalıdır.



Günlük dönüş sebepleri:



| Sistem | Örnek |

|---|---|

| Günlük marina fırsatı | Bugün bakım indirimi var |

| Günlük içerik trendi | ClipTok’ta fırtına videoları trend |

| Günlük görev | Bugün bir liman içeriği üret |

| Sponsor bildirimi | Yeni marka teklifi geldi |

| Bakım raporu | Teknenin motor bakımı yaklaşıyor |

| Rota fırsatı | Hava bugün daha uygun |

| Günlük küçük token | Oyuncuyu geri çağırır |



\---



\## 20. Retention İlkeleri



Mobil oyunda oyuncunun geri dönmesi için şu ilkeler uygulanır:



1\. Her oturumda küçük ilerleme

2\. Günlük görev

3\. Günlük fırsat

4\. Takipçi artışı bildirimi

5\. Sponsor ilgisi

6\. Yeni rota merakı

7\. Upgrade tamamlanma bildirimi

8\. Bakım / risk uyarısı

9\. Haftalık etkinlik fikri

10\. Sezonluk hedefler



\---



\## 21. Tutorial Stratejisi



Tutorial uzun metinlerle değil, yaptırarak ilerlemelidir.



Tutorial akışı:



| Adım | Oyuncuya Yaptırılacak |

|---|---|

| 1 | Profil seç |

| 2 | Marina seç |

| 3 | Tekne seç |

| 4 | Tekneye isim ver |

| 5 | İlk içerik üret |

| 6 | Takipçi sonucunu gör |

| 7 | Tekne durumunu kontrol et |

| 8 | Küçük bakım veya upgrade yap |

| 9 | İlk rotayı seç |

| 10 | Denize çık |



Tutorial kuralı:



> Oyuncu oyunu dinleyerek değil, oynayarak öğrenmelidir.



\---



\## 22. Mobil UX İlkeleri



Mobil ekranlar sade olmalıdır.



Kurallar:



1\. Ana ekranda fazla buton olmayacak

2\. En önemli aksiyonlar başparmak erişiminde olacak

3\. Kart sistemi kullanılacak

4\. Sayılar anlaşılır gösterilecek

5\. Teknik detaylar arka planda kalacak

6\. Kritik uyarılar sade metinle verilecek

7\. Her aksiyonun sonucu önceden gösterilecek

8\. Oyuncu 3-7 dakikalık oturumda ilerleme hissedecek



\---



\## 23. Performans Stratejisi



Mobil cihazlarda performans önceliklidir.



Kurallar:



1\. Gereksiz ağır animasyon kullanılmayacak

2\. İlk MVP’de 3D zorunlu olmayacak

3\. Harita görseli sade tutulacak

4\. Çok büyük veri dosyaları bölünecek

5\. Local save hızlı çalışacak

6\. Düşük segment Android cihazlar düşünülerek UI tasarlanacak

7\. Build her büyük değişiklikten sonra kontrol edilecek



\---



\## 24. Veri ve Gizlilik Stratejisi



Yayın aşamasında gizlilik politikası hazırlanmalıdır.



Toplanabilecek veri türleri ileride netleştirilecektir:



\- Cihaz bilgisi

\- Oyun ilerleme verisi

\- Reklam etkileşimi

\- Satın alma bilgisi

\- Analytics eventleri

\- Crash / hata raporları



MVP web prototipte:



\- Local save kullanılabilir

\- Hesap sistemi şart değildir

\- Gerçek ödeme yoktur

\- Gerçek reklam yoktur



Mobil yayın öncesi:



\- Privacy Policy hazırlanacaktır

\- Data Safety / gizlilik beyanları güncel resmi kaynaklardan kontrol edilecektir

\- Kullanıcı verisi minimum tutulacaktır



\---



\## 25. Analytics Stratejisi



Oyuncu davranışları ölçülmelidir.



Ölçülecek temel eventler:



| Event | Neden? |

|---|---|

| Tutorial başladı | İlk giriş ölçümü |

| Profil seçildi | Profil tercihleri |

| Marina seçildi | Başlangıç tercihi |

| Tekne seçildi | Ekonomi dengesi |

| İlk içerik üretildi | Sosyal medya döngüsü |

| İlk upgrade yapıldı | Tycoon döngüsü |

| İlk rota başladı | Deniz modu aktivasyonu |

| İlk rota tamamlandı | Retention kalitesi |

| Oyuncu çıktı | Hangi aşamada kayıp var |

| Token kullanıldı | Monetizasyon dengesi |

| Reklam izlendi | Reklam ödülü dengesi |

| Sponsor alındı | Gelir sistemi |

| Okyanus geçişi başladı | Ana hedef ilerlemesi |

| Oyun kazanıldı | Final tamamlama |



MVP’de gerçek analytics şart değildir ama event isimleri şimdiden düşünülmelidir.



\---



\## 26. Yaş Kitlesi ve İçerik Tonu



Oyun çocuklara özel oyun olarak konumlandırılmayacaktır.



Hedef:



\- Genel mobil oyuncu

\- Tycoon sevenler

\- Simulation sevenler

\- Denizcilik / gezi / sosyal medya temalı oyun sevenler



İçerik tonu:



\- Sıcak

\- Macera hissi veren

\- Doğal Türkçe

\- Fazla teknik olmayan

\- Gerektiğinde denizcilik gerçekliği veren

\- Yapay zekâ kokmayan



\---



\## 27. Global Pazar Stratejisi



İlk tasarım Türkçe ilerleyebilir.



Ancak konsept global pazara uygundur.



Global pazar için ileride:



\- İngilizce oyun adı

\- İngilizce UI

\- Global store açıklaması

\- İngilizce platform isimleri

\- Türkiye başlangıcını “exotic sailing start” gibi güçlü pazarlama unsuru yapma

\- Akdeniz ve dünya turu temasıyla global oyuncuya açılma



değerlendirilecektir.



Olası İngilizce isim fikirleri ileri dosyada ayrıca çalışılacaktır.



\---



\## 28. Marka / İsim Notu



“Yelkenli Yaşam Tycoon” çalışma adı olarak kabul edilmiştir.



Yayın öncesi şu kontroller yapılmalıdır:



1\. App Store’da benzer isim var mı?

2\. Google Play’de benzer isim var mı?

3\. Alan adı / sosyal medya adı uygun mu?

4\. Global isim gerekli mi?

5\. Türkçe isim mi, İngilizce isim mi daha güçlü?

6\. Logo ve ikon isimle uyumlu mu?



\---



\## 29. Store Uyum Kontrolü



Yayın aşamasına gelindiğinde şu konular güncel resmi kaynaklardan kontrol edilecektir:



1\. Uygulama içi satın alma kuralları

2\. Dijital ürün ve token satışı kuralları

3\. Reklam SDK kuralları

4\. Gizlilik politikası zorunlulukları

5\. Data safety / veri beyanları

6\. Yaş derecelendirme formları

7\. Çocuklara yönelik içerik kuralları

8\. Loot box / rastgele ödül kuralları

9\. Abonelik / sezon pass kuralları

10\. TestFlight ve Google Play kapalı test süreçleri



Not:



Bu belge yayın aşamasında resmi mağaza kurallarına göre tekrar güncellenecektir.



\---



\## 30. MVP Yayın Stratejisi



İlk hedef doğrudan tam store yayını değil, kontrollü ilerleme olmalıdır.



Önerilen sıra:



```text

1\. Web prototip

2\. Mobil uyumlu web prototip

3\. Android test build

4\. Kapalı test

5\. Ekonomi / retention testi

6\. Store görselleri

7\. Gizlilik ve mağaza hazırlığı

8\. Google Play kapalı test

9\. Geri bildirim düzeltmeleri

10\. Geniş yayın

11\. iOS / App Store hazırlığı

```



\---



\## 31. Minimum Store Ready Şartları



Store test yayınına çıkmadan önce minimum şartlar:



| No | Şart |

|---:|---|

| 1 | Yeni oyun başlangıç akışı çalışıyor |

| 2 | Profil seçimi çalışıyor |

| 3 | Marina seçimi çalışıyor |

| 4 | Tekne seçimi çalışıyor |

| 5 | Liman modu çalışıyor |

| 6 | Deniz modu çalışıyor |

| 7 | Sosyal medya içerik üretimi çalışıyor |

| 8 | Temel upgrade sistemi çalışıyor |

| 9 | Save / load çalışıyor |

| 10 | Mobil ekranlar kullanılabilir |

| 11 | Build hatasız |

| 12 | Oyun crash vermiyor |

| 13 | Kısa tutorial var |

| 14 | Store açıklaması hazır |

| 15 | Uygulama ikonu hazır |

| 16 | Privacy Policy hazır |

| 17 | Test kullanıcıları oyunu denedi |



\---



\## 32. İlk Gün Yayın Sonrası Plan



Oyun yayınlandıktan sonra ilk gün takip edilecekler:



1\. Crash var mı?

2\. Oyuncular tutorial’da çıkıyor mu?

3\. Profil seçiminden sonra devam ediyorlar mı?

4\. İlk içerik üretiliyor mu?

5\. İlk rota başlatılıyor mu?

6\. Save/load çalışıyor mu?

7\. Mobilde butonlar rahat mı?

8\. Store yorumları ne diyor?

9\. Ekonomi çok zor mu?

10\. Reklam/token sistemi baskı yaratıyor mu?



\---



\## 33. İlk 30 Gün Planı



İlk 30 gün hedefi:



| Hafta | Odak |

|---|---|

| 1. Hafta | Hata düzeltme, tutorial, crash |

| 2. Hafta | Ekonomi dengesi, takipçi kazancı |

| 3. Hafta | Görevler, günlük dönüş, içerik çeşitliliği |

| 4. Hafta | İlk etkinlik / sezon hazırlığı |



Amaç:



> Oyuncunun neden bıraktığını anlamak ve ilk güncellemeyi hızlı yapmak.



\---



\## 34. LiveOps Stratejisi



MVP sonrası oyun canlı operasyonla büyütülecektir.



LiveOps fikirleri:



| Sistem | Örnek |

|---|---|

| Günlük marina fırsatı | Marmaris’te bakım indirimi |

| Haftalık rota etkinliği | Akdeniz Keşif Haftası |

| Sponsor kampanyası | Drone markası özel görevi |

| Sezon hedefi | Atlantik Hazırlık Sezonu |

| Özel kozmetik | Sezonluk yelken deseni |

| Takipçi etkinliği | 100K takipçi meydan okuması |

| Fırtına haftası | Riskli ama yüksek içerik bonusu |



\---



\## 35. Riskler



| Risk | Önlem |

|---|---|

| Oyun fazla karmaşık olabilir | İlk MVP sade tutulacak |

| Ekonomi çok yavaş olabilir | İlk testlerde balans yapılacak |

| Token pay-to-win algısı verebilir | Başarı satılmayacak |

| Deniz modu bekleme ekranına dönebilir | Olay ve karar sistemi olacak |

| Sosyal medya sistemi sayı kasmaya dönebilir | İçerik türü, platform ve lokasyon etkisi olacak |

| Store politikaları değişebilir | Yayın öncesi güncel resmi kontrol yapılacak |

| Mobil performans zayıf olabilir | 3D ve ağır animasyon MVP dışı tutulacak |

| İlk 5 dakika sıkıcı olabilir | Hızlı profil/tekne/içerik/rota akışı kurulacak |



\---



\## 36. MVP Kapsamı



Mobil mağaza stratejisinde MVP kapsamı:



| Özellik | MVP Durumu |

|---|---|

| Web prototip | Dahil |

| Mobil uyumlu UI | Dahil |

| Free-to-play yapı | Tasarımda dahil |

| Gerçek IAP | MVP dışı |

| Gerçek reklam | MVP dışı / mobil test sonrası |

| Token sistemi | Simüle edilmiş dahil |

| Store açıklama taslağı | Dahil |

| Privacy policy hazırlığı | Store öncesi |

| İkon / görsel planı | Dahil |

| Kaptan Pass | MVP sonrası |

| Kozmetik mağaza | MVP sonrası |

| LiveOps | Basit fikir düzeyinde |



\---



\## 37. Kilit Kararı



Bu belge Mobil Mağaza Stratejisi V1.0 olarak kabul edilmiş ve kilitlenmiştir.



Yelkenli Yaşam Tycoon, ücretsiz indirilebilir, pay-to-win olmayan, mobil odaklı tycoon / simulation oyunu olarak tasarlanacaktır.



Ana gelir modeli:



1\. Token ile süre ve kolaylık

2\. İsteğe bağlı reklam ödülleri

3\. Reklam kaldırma paketi

4\. Kozmetik ürünler

5\. MVP sonrası Kaptan Pass / sezon sistemi



Oyuncuya başarı satılmayacak; dünya turu, 1 milyon takipçi ve okyanus hazır tekne hedefleri oynanışla kazanılacaktır.



Bu belge kilitlendikten sonra sıradaki ana tasarım bölümü:



> MVP Yapım Planı V1.0

