\# Yelkenli Yaşam Tycoon — Kazanma Şartları V1.0



\## Belge Durumu



\- Durum: Kilitlendi

\- Sürüm: V1.0

\- İlgili ana belge: docs/01\_Oyun\_Anayasasi.md

\- Amaç: Oyunun ana hedeflerini, final koşullarını, ilerleme ölçümünü ve kazanma sonrası devam mantığını netleştirmek



\---



\## 1. Sistem Amacı



Kazanma şartları, oyuncunun uzun vadeli hedefini belirler.



Yelkenli Yaşam Tycoon’da oyuncu sadece para biriktirerek veya sadece tekneyi geliştirerek oyunu kazanamaz.



Oyunu kazanmak için üç ana hedef birlikte tamamlanmalıdır:



1\. Dünya turunu tamamlamak

2\. 1 milyon takipçiye ulaşmak

3\. Tekneyi okyanus geçişine uygun seviyeye getirmek



Amaç:



1\. Oyuncuya net final hedefi vermek

2\. Rota, sosyal medya ve tekne upgrade sistemlerini birbirine bağlamak

3\. Oyunu sadece para kasma oyunundan çıkarmak

4\. Oyuncuya hem denizci hem içerik üreticisi hem de tekne yöneticisi olduğunu hissettirmek

5\. Final anını güçlü ve ödüllendirici hale getirmek



\---



\## 2. Ana Tasarım Kuralı



Kazanma sistemi şu soruya cevap vermelidir:



> Oyuncu oyunu kazanırken gerçekten dünya turu yapan, kitle büyüten ve teknesini okyanusa hazırlayan biri gibi hissetti mi?



Eğer oyuncu sadece tek bir sayıyı büyüterek oyunu bitiriyorsa sistem başarısızdır.



\---



\## 3. Ana Kazanma Şartı



Oyunu kazanmak için üç şart aynı anda tamamlanmalıdır.



```text

Kazanma =

Dünya Turu Tamamlandı

\+ Toplam Takipçi ≥ 1.000.000

\+ Okyanus Hazırlık Puanı yeterli

```



Bu üç şarttan biri eksikse oyun bitmez.



\---



\## 4. Kazanma Şartı 1 — Dünya Turunu Tamamlamak



Oyuncu Türkiye’den başlar ve dünya turu rotasını tamamlayarak tekrar Türkiye’ye döner.



Ana rota omurgası:



```text

Türkiye

→ Yunan Adaları

→ Girit

→ Malta

→ Sicilya

→ Sardinya

→ Balear Adaları

→ Cebelitarık

→ Kanarya Adaları

→ Atlantik Geçişi

→ Karayipler

→ Panama

→ Pasifik Adaları

→ Avustralya

→ Hint Okyanusu

→ Dönüş Rotası

→ Türkiye

```



Dünya turu tamamlanmadan oyun kazanılamaz.



\---



\## 5. Dünya Turu İlerleme Sistemi



Her rota etabı oyuncuya ilerleme yüzdesi kazandırır.



Örnek MVP ilerleme mantığı:



| Etap | Dünya Turu İlerlemesi |

|---|---:|

| Türkiye başlangıç hazırlığı | %0 |

| Yunan Adaları | %5 |

| Girit | %10 |

| Malta | %15 |

| Sicilya | %20 |

| Sardinya | %25 |

| Balear Adaları | %30 |

| Cebelitarık | %35 |

| Kanarya Adaları | %40 |

| Atlantik Geçişi | %50 |

| Karayipler | %58 |

| Panama | %65 |

| Pasifik Adaları | %75 |

| Avustralya | %82 |

| Hint Okyanusu | %90 |

| Dönüş Rotası | %97 |

| Türkiye’ye dönüş | %100 |



Bu değerler oyun dengesi sırasında değiştirilebilir.



\---



\## 6. Kazanma Şartı 2 — 1 Milyon Takipçiye Ulaşmak



Oyuncu toplamda en az 1.000.000 takipçiye ulaşmalıdır.



Toplam takipçi şu platformlardan hesaplanır:



1\. ViewTube

2\. ClipTok

3\. InstaSea

4\. FacePort

5\. LiveWave



MVP formülü:



```text

Toplam Takipçi =

ViewTube takipçi

\+ ClipTok takipçi

\+ InstaSea takipçi

\+ FacePort takipçi

\+ LiveWave takipçi

```



LiveWave MVP’de pasif veya basit kalırsa toplam takipçiye sınırlı katkı verebilir.



\---



\## 7. Takipçi Hedefinin Oyun Rolü



1 milyon takipçi hedefi, oyuncunun sosyal medya sistemini ciddiye almasını sağlar.



Oyuncu sadece seyir yaparak oyunu bitiremez.



Takipçi hedefi şu sistemleri anlamlı hale getirir:



| Sistem | Etki |

|---|---|

| İçerik üretimi | Ana takipçi kaynağıdır |

| Platform seçimi | Hangi kitlenin büyüyeceğini belirler |

| İçerik ekipmanı | Kalite ve viral şansı artırır |

| Rota lokasyonları | İçerik potansiyeli verir |

| Sponsor sistemi | Takipçiye bağlı açılır |

| Oyuncu profili | Sosyal medya büyümesini etkiler |

| Tekne algısı | İçerik performansını etkiler |



\---



\## 8. Takipçi Seviye Eşikleri



Oyuncunun büyümesi sadece finalde hissedilmemelidir.



Ara takipçi eşikleri oyuncuya ilerleme hissi vermelidir.



| Seviye | Takipçi Aralığı | Oyuncu Hissi |

|---|---:|---|

| Yeni Başlayan | 0 - 10.000 | İlk izleyiciler geliyor |

| Büyüyen Kanal | 10.000 - 100.000 | Yolculuk dikkat çekiyor |

| Tanınan Denizci | 100.000 - 300.000 | Sponsorlar ilgilenmeye başlıyor |

| Bölgesel Fenomen | 300.000 - 500.000 | Marka değeri oluşuyor |

| Global Yelkenli Marka | 500.000 - 1.000.000 | Büyük sponsorlar açılıyor |

| Dünya Turu Fenomeni | 1.000.000+ | Final şartı tamamlanıyor |



\---



\## 9. Kazanma Şartı 3 — Okyanus Hazır Tekne



Oyuncunun teknesi okyanus geçişine uygun seviyeye gelmelidir.



Bu şart oyunun tekne upgrade ve bakım sistemlerini final hedefe bağlar.



Okyanus hazır tekne demek:



\- Güvenli

\- Bakımlı

\- Enerji açısından yeterli

\- Su açısından yeterli

\- Navigasyon açısından yeterli

\- Gövde ve yelken açısından sağlam

\- Uzun seyir risklerine hazır



bir tekne demektir.



\---



\## 10. Okyanus Hazırlık Puanı



Okyanus hazırlık puanı 0-100 arası bir değer olarak hesaplanabilir.



MVP hedefi:



```text

Okyanus Hazırlık Puanı ≥ 80

```



Bu değer testlerle değiştirilebilir.



\---



\## 11. Okyanus Hazırlık Puanı Kategorileri



| Kategori | Ağırlık | Neden Önemli? |

|---|---:|---|

| Güvenlik | Çok yüksek | Can salı, EPIRB, telsiz, fırtına ekipmanı |

| Navigasyon | Çok yüksek | GPS, chartplotter, AIS, radar, otopilot |

| Enerji | Yüksek | Uzun seyirde elektrik ve iletişim |

| Su / Yaşam | Yüksek | Su kapasitesi ve su yapıcı |

| Gövde / Bakım | Çok yüksek | Teknenin fiziksel dayanıklılığı |

| Motor / Mekanik | Orta-Yüksek | Acil destek ve güvenilirlik |

| Yelken / Hız | Orta-Yüksek | Performans ve rota güvenliği |

| Yardımcı Denizcilik | Orta | Bot, çapa, yedek parça |

| Konfor | Orta | Uzun seyirde moral ve yaşam |

| İçerik Ekipmanı | Düşük-Orta | Kazanma şartı için değil ama büyüme için önemli |



\---



\## 12. Okyanus Hazırlık Seviyeleri



| Puan | Seviye | Anlamı |

|---:|---|---|

| 0-30 | Hazır Değil | Kısa rotalar dışında riskli |

| 31-50 | Zayıf Hazırlık | Akdeniz içinde sınırlı güvenlik |

| 51-65 | Orta Hazırlık | Orta rotalar için yeterli |

| 66-79 | Güçlü Hazırlık | Atlantik öncesi yaklaşır |

| 80-89 | Okyanus Hazır | Final şartı için yeterli |

| 90-100 | Dünya Turu Seviyesi | Güvenli ve güçlü hazırlık |



\---



\## 13. Üçlü Hedef Sistemi



Oyuncunun ilerleme ekranında üç ana hedef ayrı ayrı gösterilmelidir.



Örnek:



| Hedef | Durum |

|---|---|

| Dünya Turu | %72 tamamlandı |

| Takipçi | 642.000 / 1.000.000 |

| Okyanus Hazırlığı | 76 / 100 |



Bu ekran oyuncuya sürekli şunu hatırlatmalıdır:



> Sadece rota yetmez. Sadece takipçi yetmez. Sadece tekne yetmez. Üçünü birlikte tamamlamalısın.



\---



\## 14. Kazanma Kontrolü



MVP için basit kazanma kontrolü:



```text

Eğer:

Dünya turu ilerlemesi >= %100

ve

Toplam takipçi >= 1.000.000

ve

Okyanus hazırlık puanı >= 80



O zaman:

Oyun kazanıldı.

```



Oyuncu Türkiye’ye dönmüş ama takipçisi 1 milyon değilse oyun devam eder.



Oyuncu 1 milyon takipçiye ulaşmış ama dünya turunu bitirmemişse oyun devam eder.



Oyuncu dünya turunu bitirmiş ama tekne yeterince hazır değilse final tamamlanmaz.



\---



\## 15. Neden Üç Şart Var?



Tek şartlı kazanma sistemi oyunu zayıflatır.



| Tek Şart Olsaydı | Sorun |

|---|---|

| Sadece dünya turu | Sosyal medya ve upgrade önemsizleşir |

| Sadece 1 milyon takipçi | Denizcilik ve rota önemsizleşir |

| Sadece güçlü tekne | İçerik ve macera önemsizleşir |

| Sadece para | Oyun düz tycoon’a döner |



Üçlü şart oyunun tüm ana sistemlerini bağlar:



```text

Rota + Sosyal Medya + Tekne Gelişimi = Gerçek Final

```



\---



\## 16. Ara Hedefler



Oyuncu finalden önce küçük ve orta hedeflerle ödüllendirilmelidir.



| Ara Hedef | Ödül Hissi |

|---|---|

| İlk 10.000 takipçi | İlk topluluk |

| İlk sponsor | Para kazanma heyecanı |

| İlk uluslararası rota | Dünya turu başladı hissi |

| İlk büyük upgrade | Tekne gelişimi |

| Girit geçişi | İlk ciddi seyir |

| Cebelitarık | Atlantik kapısına yaklaşma |

| Atlantik geçişi | Büyük başarı |

| Karayipler’e varış | Ödül bölgesi |

| Panama geçişi | Dünya turu dönüm noktası |

| 500.000 takipçi | Global marka hissi |

| Okyanus hazırlık 80 | Tekne artık ciddi hazır |

| Türkiye dönüşü | Final duygusu |



\---



\## 17. Başarım / Rozet Sistemi



MVP’de basit başarım sistemi olabilir veya ileri sürüme bırakılabilir.



Örnek rozetler:



| Rozet | Açıklama |

|---|---|

| İlk Seyir | İlk rotanı tamamla |

| İlk Sponsor | İlk sponsor anlaşmanı yap |

| Gerçek Denizci | İlk fırtına olayını atlat |

| Atlantik Kaptanı | Atlantik geçişini tamamla |

| Teknik Kurtarıcı | Büyük arızayı tamir et |

| Viral Denizci | Bir içeriği viral yap |

| 1 Milyonluk Kaptan | 1 milyon takipçiye ulaş |

| Dünya Turu Tamamlandı | Türkiye’ye geri dön |

| Okyanus Hazır | Tekneyi 80+ hazırlık puanına getir |



\---



\## 18. Profil Bazlı Final Hissi



Her profil oyunu bitirdiğinde final metni farklı hissedebilir.



MVP’de tek final ekranı yeterlidir.  

İleri sürümde profil bazlı final metinleri eklenebilir.



Örnek:



| Profil | Final Hissi |

|---|---|

| Eski Kaptan | Gerçek denizci dünya turunu tamamladı |

| İçerik Üreticisi | Yolculuk global içerik markasına dönüştü |

| Teknik Usta | Eski/orta tekne emekle dünya turu teknesine çevrildi |

| Maceracı Gezgin | Riskler hikayeye dönüştü |

| Sosyal Girişimci | Yolculuk global markaya dönüştü |

| Aile / Yaşam Kanalı | Samimi tekne yaşamı milyonlara ulaştı |



\---



\## 19. Final Ekranı



Oyuncu kazandığında final ekranı güçlü olmalıdır.



Final ekranında şunlar gösterilmelidir:



1\. Dünya turu tamamlandı mesajı

2\. Toplam rota ilerlemesi

3\. Toplam takipçi

4\. En güçlü platform

5\. Tekne adı

6\. Okyanus hazırlık puanı

7\. Kullanılan tekne sınıfı

8\. Başlangıç marinası

9\. Seçilen oyuncu profili

10\. En büyük sponsor

11\. En viral içerik

12\. Toplam oyun günü

13\. Final unvanı



Örnek final metni:



> Türkiye’den küçük bir marinada başlayan yolculuk, dünya turunu tamamlayan 1 milyon takipçili bir denizcilik markasına dönüştü.



\---



\## 20. Final Unvanları



Oyuncunun final başarısına göre farklı unvanlar verilebilir.



| Koşul | Unvan |

|---|---|

| Sadece minimum şartları tamamladı | Dünya Turu Kaptanı |

| 1.5M+ takipçi | Global Denizcilik Fenomeni |

| Okyanus hazırlık 90+ | Okyanus Ustası |

| Az hasarla tamamladı | Güvenli Seyir Ustası |

| Çok sponsorla tamamladı | Denizcilik Markası |

| Kırlangıç 28 ile tamamladı | Küçük Tekne Büyük Dünya |

| Teknik Usta profiliyle düşük maliyetli tamamladı | Kendi Teknesini Kendi Yapan |

| Maceracı Gezgin ile çok riskli tamamladı | Fırtınadan Hikaye Çıkaran |



\---



\## 21. Kazanma Sonrası Devam



Oyun kazanıldığında tamamen bitmemelidir.



Oyuncuya devam seçenekleri verilebilir:



1\. Serbest Dünya Turu Modu

2\. Yeni sezon

3\. Yeni tekneyle başla

4\. Prestige sistemi

5\. Yeni rota paketleri

6\. Daha yüksek takipçi hedefi

7\. Yeni sponsor hedefleri

8\. Tekneyi müze / marka haline getirme



MVP’de sadece basit “Devam Et” seçeneği yeterli olabilir.



\---



\## 22. Prestige Sistemi



Prestige sistemi ileri sürüm fikridir.



Oyuncu dünya turunu bitirdiğinde yeni kariyere bazı bonuslarla başlayabilir.



Örnek prestige bonusları:



| Bonus | Açıklama |

|---|---|

| Tecrübeli Başlangıç | Yeni oyunda küçük skill bonusu |

| Marka Bilinirliği | İlk takipçi eşiği daha hızlı geçilir |

| Sponsor Geçmişi | İlk sponsor daha erken gelir |

| Kaptan Rozeti | Profil kartında özel işaret |

| Özel Kozmetik | Tekne bayrağı / yelken deseni |



MVP’de zorunlu değildir.



\---



\## 23. Kaybetme Var mı?



MVP’de sert “game over” önerilmez.



Oyuncu kötü kararlar verirse:



\- Para kaybedebilir

\- Takipçi büyümesi yavaşlayabilir

\- Tekne hasar alabilir

\- Rota uzayabilir

\- Sponsor kaybedebilir

\- Limana dönmek zorunda kalabilir



Ama oyun tamamen bitmemelidir.



Ana kural:



> Oyuncu düşebilir ama toparlanma yolu olmalıdır.



\---



\## 24. Başarısızlık Durumları



Oyuncu bazı durumlarda geri düşer.



| Durum | Sonuç |

|---|---|

| Büyük arıza | Tamir maliyeti ve zaman kaybı |

| Hazırlıksız rota | Hasar, gecikme, kaynak kaybı |

| Çok düşük kalite içerik | Gelir ve takipçi yavaşlar |

| Fazla sponsorlu içerik | Sadakat düşer |

| Parasız kalma | Küçük görevlerle toparlanma gerekir |

| Okyanus şartını karşılamama | Büyük geçişe çıkamaz |

| Takipçi hedefinin gerisinde kalma | İçerik stratejisi değiştirmesi gerekir |



\---



\## 25. Toparlanma Mekanikleri



Oyuncu kötü duruma düşerse çıkış yolları olmalıdır.



| Toparlanma Yolu | Açıklama |

|---|---|

| Küçük içerik üretimi | Az gelir ama oyunu açar |

| Günlük görev | Küçük kredi veya token |

| Ekonomik marina | Maliyet düşer |

| Basit bakım | Arıza riski azalır |

| Mikro sponsor | Küçük gelir fırsatı |

| Reklam ödülü | İsteğe bağlı küçük destek |

| Teknik Usta avantajı | Tamir maliyeti düşer |

| Riskli viral içerik | Tehlikeli ama büyük çıkış sağlayabilir |



\---



\## 26. Kazanma Şartları ve Token Bağlantısı



Token kazanma şartlarını doğrudan tamamlayamaz.



Token yardımcı olabilir:



\- Upgrade süresini hızlandırır

\- Tamiri hızlandırır

\- Enerji/su/yakıt krizini hafifletir

\- Seyahat süresini sınırlı azaltır



Token yapamaz:



\- Dünya turunu tamamlamak

\- 1 milyon takipçi satın almak

\- Okyanus hazırlığını tek başına sağlamak

\- Final ekranını açmak

\- Riskleri tamamen yok etmek



\---



\## 27. Kazanma Şartları ve Ekonomi Bağlantısı



Ekonomi sistemi final şartlarını destekler.



| Ekonomi Kararı | Final Etkisi |

|---|---|

| İçerik ekipmanına yatırım | 1M takipçi hedefini kolaylaştırır |

| Güvenlik upgrade’i | Okyanus hazırlığını artırır |

| Enerji sistemi | Uzun rota ve içerik üretimi sağlar |

| Bakım yapmak | Dünya turunu güvenli tamamlatır |

| Sponsor almak | Büyük upgrade’leri finanse eder |

| Pahalı tekne seçmek | Güçlü ama ekonomik baskılı başlangıç yaratır |

| Ucuz tekne seçmek | Daha çok bakım ama güçlü gelişim hikayesi verir |



\---



\## 28. Kazanma Şartları ve Profil Bağlantısı



| Profil | Final Yolculuğu |

|---|---|

| Eski Kaptan | Dünya turu ve güvenli seyirde avantajlı, takipçiyi sonradan büyütmeli |

| İçerik Üreticisi | Takipçi hedefinde güçlü, denizcilik ve güvenliği geliştirmeli |

| Teknik Usta | Tekne hazırlığında güçlü, sponsor ve sosyal büyümeyi geliştirmeli |

| Maceracı Gezgin | Riskli rota ve viral içerikte güçlü, bakım ve konfora dikkat etmeli |

| Sosyal Girişimci | Sponsor ve gelirde güçlü, teknik hazırlığa yatırım yapmalı |

| Aile / Yaşam Kanalı | Sadık kitle ve yaşam içeriklerinde güçlü, okyanus için güvenlik hazırlığı yapmalı |



\---



\## 29. Oyuncuya Gösterilecek Hedef Paneli



Ana ekranda veya ilerleme ekranında sade hedef paneli olmalıdır.



Örnek:



```text

Dünya Turu: %48

Takipçi: 318.000 / 1.000.000

Okyanus Hazırlığı: 61 / 100

Sıradaki Büyük Hedef: Atlantik için hazırlık puanını 75’e çıkar

```



Bu panel oyuncuya ne yapması gerektiğini açıkça göstermelidir.



\---



\## 30. Oyuncuya Verilecek Yönlendirme



Oyuncu hedeflerden birinde geri kalmışsa oyun öneri vermelidir.



| Eksik Alan | Öneri |

|---|---|

| Takipçi düşük | Daha güçlü lokasyonlarda içerik üret, ekipman geliştir |

| Okyanus hazırlığı düşük | Güvenlik, enerji, su ve navigasyon upgrade’i yap |

| Dünya turu geride | Rota planla ve denize çık |

| Para düşük | Küçük içerik, mikro sponsor ve ekonomik marina kullan |

| Bakım düşük | Büyük rotaya çıkmadan bakım yap |

| Sponsor yok | Platform ve profil uyumlu içerik üret |



\---



\## 31. MVP Kapsamı



İlk MVP’de kazanma şartları şu kapsamda uygulanacaktır:



| Özellik | MVP Durumu |

|---|---|

| Dünya turu ilerleme yüzdesi | Dahil |

| Toplam takipçi hedefi | Dahil |

| 1.000.000 takipçi şartı | Dahil |

| Okyanus hazırlık puanı | Dahil |

| Üçlü kazanma kontrolü | Dahil |

| Basit final ekranı | Dahil |

| Hedef paneli | Dahil |

| Ara hedef bildirimleri | Basit düzeyde dahil |

| Rozet sistemi | Basit / ileri sürüm |

| Profil bazlı final | MVP dışı |

| Prestige sistemi | MVP dışı |

| Gelişmiş devam modu | MVP sonrası |



\---



\## 32. Denge Kuralları



Kazanma sistemi şu kurallara uymalıdır:



1\. Oyuncu sadece para biriktirerek kazanamamalıdır.

2\. Oyuncu sadece takipçi kasarak kazanamamalıdır.

3\. Oyuncu sadece tekne upgrade ederek kazanamamalıdır.

4\. Dünya turu mutlaka tamamlanmalıdır.

5\. 1 milyon takipçi mutlaka gerçek içerik stratejisiyle gelmelidir.

6\. Okyanus hazırlığı gerçek upgrade ve bakım kararlarına bağlı olmalıdır.

7\. Token final şartlarını atlatmamalıdır.

8\. Oyuncu kötü kararlarla geri düşebilir ama toparlanabilmelidir.

9\. Final anı güçlü ve duygusal hissettirmelidir.

10\. Oyun kazanıldıktan sonra devam etme motivasyonu kalmalıdır.



\---



\## 33. İleri Sürüm Fikirleri



| Fikir | Not |

|---|---|

| Profil bazlı final hikayesi | Her profil için özel final metni |

| Dünya turu belgeseli | Oyuncunun rota günlüğünden otomatik final özeti |

| Prestige sistemi | Yeni oyuna bonusla başlama |

| Yeni hedefler | 5 milyon takipçi, ikinci dünya turu |

| Alternatif final rotaları | Kuzey rotası, yarış rotası |

| Sponsor final anlaşmaları | Büyük markayla sezon finali |

| Tekne müzesi / galeri | Oyuncunun eski teknelerini saklama |

| Dünya sıralaması | İleri sürümde leaderboard |

| Sezon final etkinlikleri | LiveOps için güçlü alan |

| Final videosu simülasyonu | En iyi içeriklerin özet ekranı |



\---



\## 34. Kilit Kararı



Bu belge Kazanma Şartları V1.0 olarak kabul edilmiş ve kilitlenmiştir.



Oyunu kazanmak için oyuncu şu üç şartı birlikte tamamlamalıdır:



1\. Dünya turunu tamamlamak

2\. Toplamda en az 1.000.000 takipçiye ulaşmak

3\. Tekneyi okyanus geçişine uygun seviyeye getirmek



Bu üçlü hedef; rota, sosyal medya, ekonomi, tekne upgrade, bakım, token ve oyuncu profili sistemlerini tek final çatısı altında birleştirir.



Bu belge kilitlendikten sonra sıradaki ana tasarım bölümü:



> Mobil Mağaza Stratejisi V1.0

