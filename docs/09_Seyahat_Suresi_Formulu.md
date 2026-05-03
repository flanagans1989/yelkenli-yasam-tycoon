\# Yelkenli Yaşam Tycoon — Seyahat Süresi Formülü V1.0



\## Belge Durumu



\- Durum: Kilitlendi

\- Sürüm: V1.0

\- İlgili ana belge: docs/01\_Oyun\_Anayasasi.md

\- Amaç: Rota sürelerinin tekne, hava, skill, bakım, donanım ve risk durumuna göre nasıl hesaplanacağını netleştirmek



\---



\## 1. Sistem Amacı



Seyahat süresi sistemi, deniz modunun temel hesaplama sistemidir.



Oyuncu bir rotaya çıktığında yolculuk süresi sabit olmamalıdır.  

Süre; tekne sınıfı, yelken performansı, motor durumu, hava koşulları, kaptanlık becerisi, bakım seviyesi, enerji durumu, rota zorluğu ve risk olaylarına göre değişmelidir.



Amaç:



1\. Rota seçimini stratejik hale getirmek

2\. Tekne upgrade sistemini seyir süresine bağlamak

3\. Oyuncu profili seçimini deniz modunda anlamlı yapmak

4\. Bakım ihmalinin sonucunu hissettirmek

5\. Hava ve risk olaylarını oyuna etki eden sistem yapmak

6\. Oyuncuya “hazırlıklı çıkarsam daha hızlı ve güvenli giderim” hissi vermek



\---



\## 2. Ana Tasarım Kuralı



Seyahat süresi sistemi şu soruya cevap vermelidir:



> Oyuncunun tekne, hazırlık ve rota kararları seyir sonucunu gerçekten değiştiriyor mu?



Eğer her rota her zaman aynı sürede bitiyorsa sistem başarısızdır.



\---



\## 3. Basit Ana Formül



MVP için kullanılacak temel mantık:



```text

Gerçekleşen Seyahat Süresi =

Temel Rota Süresi

× Tekne Performans Çarpanı

× Hava Çarpanı

× Rota Risk Çarpanı

× Bakım Durumu Çarpanı

× Enerji / Yakıt Durumu Çarpanı

× Oyuncu Skill Çarpanı

× Olay Çarpanı

```



Ama oyuncuya bu karmaşık formül gösterilmeyecektir.



Oyuncuya sade sonuç gösterilir:



```text

Tahmini Süre: 5-7 oyun günü

Risk: Orta

Hazırlık: Yeterli

Hava Etkisi: Hafif gecikme olabilir

```



\---



\## 4. Temel Rota Süresi



Her rota önce sabit bir temel süreye sahip olur.



Bu süre gerçek dünya hissinden ilham alır ama mobil oyun temposuna göre oyunlaştırılır.



| Rota Tipi | Temel Süre Hissi |

|---|---|

| Çok kısa kıyı rotası | 1 oyun günü |

| Kısa ada / marina rotası | 1-3 oyun günü |

| Orta açık deniz rotası | 3-7 oyun günü |

| Uzun Akdeniz geçişi | 7-12 oyun günü |

| Büyük hazırlık rotası | 10-15 oyun günü |

| Atlantik geçişi | 18-25 oyun günü |

| Pasifik uzun etapları | 20-30 oyun günü |

| Hint Okyanusu geçişi | 18-28 oyun günü |



\---



\## 5. Tekne Performans Çarpanı



Tekne sınıfı seyahat süresini doğrudan etkiler.



| Tekne | Performans Hissi | Süre Etkisi |

|---|---|---|

| Kırlangıç 28 | Yavaş / sınırlı | Süre +%10 ila +%20 |

| Denizkuşu 34 | Dengeli | Standart süre |

| Atlas 40 | Güçlü / modern | Süre -%5 ila -%15 |



Not:



Atlas 40 her zaman bedava avantaj vermez.  

Bakım maliyeti, marina maliyeti ve upgrade maliyeti daha yüksek olacağı için ekonomik baskı oluşturur.



\---



\## 6. Yelken / Hız Sistemi Etkisi



Yelken sistemi iyiyse rota süresi kısalır.  

Yelken sistemi kötüyse süre uzar ve arıza riski artar.



| Yelken Durumu | Süre Etkisi |

|---|---|

| Kötü | Süre +%15 |

| Orta | Etki yok |

| İyi | Süre -%7 |

| Çok iyi | Süre -%12 |

| Okyanus hazır | Süre -%15 ve risk azalır |



Yelken upgrade etkileri:



| Upgrade | Etki |

|---|---|

| Ana yelken bakımı | Süre azalır, fırtına riski düşer |

| Yeni ana yelken | Performans artar |

| Yeni cenova | Hafif/orta havada hız artar |

| Gennaker | Uygun havada hız ve içerik değeri artar |

| Halat yenileme | Arıza riski düşer |

| Direk kontrolü | Büyük rota güvenliği artar |



\---



\## 7. Motor / Mekanik Etkisi



Motor sistemi, özellikle düşük rüzgar, marina giriş/çıkış, acil rota değişimi ve kriz anlarında süreyi etkiler.



| Motor Durumu | Süre Etkisi |

|---|---|

| Kötü | Süre +%10, arıza riski yüksek |

| Orta | Etki yok |

| İyi | Süre -%5 |

| Çok iyi | Süre -%8 |

| Revizyonlu / güçlü | Acil durumlarda büyük avantaj |



Motor arızası olursa:



| Olay | Sonuç |

|---|---|

| Küçük motor sorunu | Süre +1 oyun günü |

| Orta motor arızası | Süre +2-4 oyun günü |

| Büyük motor arızası | Yakın limana sapma veya yüksek tamir maliyeti |

| Teknik Usta profili | Bu etkileri azaltabilir |



\---



\## 8. Hava Çarpanı



Hava durumu seyahat süresini ve riskleri etkiler.



| Hava Durumu | Süre Etkisi | Risk Etkisi | İçerik Etkisi |

|---|---:|---:|---|

| Çok uygun hava | Süre -%10 | Risk düşük | Normal |

| Uygun hava | Süre -%5 | Risk düşük | Normal |

| Değişken hava | Süre +%5 | Risk orta | İçerik potansiyeli artar |

| Sert hava | Süre +%15 | Risk yüksek | Viral şans artar |

| Fırtına | Süre +%25 | Risk çok yüksek | Viral şans çok artar ama hasar riski yüksek |



Önemli kural:



> Kötü hava sadece ceza olmamalıdır. Riskli hava aynı zamanda güçlü içerik fırsatı da yaratmalıdır.



\---



\## 9. Rota Risk Çarpanı



Her rotanın temel risk seviyesi vardır.



| Risk Seviyesi | Süre Etkisi | Açıklama |

|---|---:|---|

| Düşük | Etki yok | Kısa ve güvenli rota |

| Orta | Süre +%5 | Normal açık deniz etkisi |

| Yüksek | Süre +%10 | Hava, mesafe veya hazırlık riski |

| Çok yüksek | Süre +%20 | Okyanus veya zor geçiş |

| Kritik | Süre +%25+ | Hazırlıksız çıkışta büyük risk |



Rota riski şunlardan etkilenir:



1\. Mesafe

2\. Açık deniz seviyesi

3\. Hava ihtimali

4\. Yardım alma zorluğu

5\. Marina aralığı

6\. Okyanus geçişi olup olmaması

7\. Oyuncunun hazırlık seviyesi



\---



\## 10. Bakım Durumu Çarpanı



Bakım seviyesi, süre ve arıza riskini doğrudan etkiler.



| Bakım Seviyesi | Süre Etkisi | Risk Etkisi |

|---|---:|---|

| Çok kötü | Süre +%20 | Arıza riski çok yüksek |

| Kötü | Süre +%12 | Arıza riski yüksek |

| Orta | Etki yok | Normal |

| İyi | Süre -%5 | Arıza riski düşük |

| Çok iyi | Süre -%8 | Arıza riski çok düşük |



Bakım sistemi oyuncuya şu kararı verdirmelidir:



> Şimdi bakım masrafı yapayım mı, yoksa riski göze alıp rotaya çıkayım mı?



\---



\## 11. Enerji Durumu Etkisi



Enerji, navigasyon, içerik ekipmanı, uydu iletişimi, buzdolabı, laptop ve canlı yayın gibi sistemleri etkiler.



| Enerji Durumu | Seyir Etkisi |

|---|---|

| Çok düşük | Navigasyon ve içerik riski, süre +%10 |

| Düşük | İçerik üretimi kısıtlanır, süre +%5 |

| Yeterli | Etki yok |

| İyi | İçerik ve navigasyon güvenliği artar |

| Çok iyi | Uzun rotalarda risk azalır |



Enerji upgrade’leri:



\- Güneş paneli

\- Lityum akü

\- İnverter

\- Rüzgar jeneratörü

\- Hidro jeneratör

\- Jeneratör



\---



\## 12. Su ve Yaşam Durumu Etkisi



Su sistemi uzun rotalarda kritik hale gelir.



| Su Durumu | Etki |

|---|---|

| Çok düşük | Moral düşer, risk artar, rota sapması gerekebilir |

| Düşük | Uzun rotalarda süre ve risk artar |

| Yeterli | Etki yok |

| İyi | Uzun rotalarda güvenli seyir |

| Çok iyi | Okyanus geçişlerinde büyük avantaj |



Su yapıcı, büyük okyanus geçişlerinde çok değerli bir upgrade olacaktır.



\---



\## 13. Yakıt Durumu Etkisi



Yakıt, motor desteği ve acil durumlar için önemlidir.



| Yakıt Durumu | Etki |

|---|---|

| Çok düşük | Acil motor desteği zayıf, risk yüksek |

| Düşük | Rota uzarsa sorun çıkarabilir |

| Yeterli | Normal |

| İyi | Acil durumda avantaj |

| Çok iyi | Uzun rota güvenliği artar |



Yakıt tek başına oyunu çözmemelidir.  

Yelkenli oyununda ana mantık hâlâ yelken, hazırlık ve rota yönetimi olmalıdır.



\---



\## 14. Oyuncu Skill Çarpanı



Oyuncu profili ve skill değerleri seyahat süresini etkiler.



| Skill | Etki |

|---|---|

| Denizcilik | Rota süresi, fırtına yönetimi, rota sapması |

| Teknik | Arıza etkisi, motor/enerji krizi, tamir |

| Risk Yönetimi | Kriz kararı, güvenli rota, hasar azaltma |

| İçerik | Deniz içeriği kalitesi, viral fırsat |

| Sponsor | Seyahat süresine doğrudan az etki, liman fırsatlarına etki |

| Yaşam / Konfor | Uzun seyirde moral ve içerik kalitesi |



Profil etkileri:



| Profil | Seyahat Süresi Etkisi |

|---|---|

| Eski Kaptan | Zor rotalarda süre ve risk azalır |

| İçerik Üreticisi | Süre avantajı düşük, içerik avantajı yüksek |

| Teknik Usta | Arıza kaynaklı gecikmeleri azaltır |

| Maceracı Gezgin | Riskli rotalarda içerik bonusu alır, ama karar riski yüksek olabilir |

| Sosyal Girişimci | Seyirde direkt zayıf, liman/sponsor tarafında güçlü |

| Aile / Yaşam Kanalı | Güvenli rota ve moral yönetiminde avantajlı |



\---



\## 15. Olay Çarpanı



Deniz modunda rastgele veya şartlara bağlı olaylar süreyi değiştirebilir.



| Olay | Süre Etkisi | Ek Etki |

|---|---:|---|

| Uygun rüzgar yakalandı | Süre -1 oyun günü | İçerik fırsatı |

| Hafif teknik sorun | Süre +1 oyun günü | Küçük tamir maliyeti |

| Sert hava | Süre +1-3 oyun günü | Hasar ve viral şans |

| Rota sapması | Süre +2 oyun günü | Yakıt/su tüketimi artar |

| Enerji krizi | Süre +1 oyun günü | İçerik üretimi düşer |

| Yelken hasarı | Süre +2-4 oyun günü | Limanda tamir ihtiyacı |

| Büyük fırtına | Süre +3-6 oyun günü | Büyük risk, büyük viral fırsat |

| Harika içerik fırsatı | Süre değişmeyebilir | Takipçi artışı |



\---



\## 16. Hazırlık Kontrolü



Oyuncu rotaya çıkmadan önce hazırlık kontrolü görmelidir.



Kontrol edilen alanlar:



1\. Bakım

2\. Enerji

3\. Su

4\. Yakıt

5\. Navigasyon

6\. Güvenlik

7\. Yelken durumu

8\. Motor durumu

9\. Hava riski

10\. İçerik ekipmanı



Hazırlık sonucu:



| Sonuç | Açıklama |

|---|---|

| Güvenli | Rota için hazırlık iyi |

| Dikkatli çık | Bazı riskler var |

| Riskli | Arıza/gecikme ihtimali yüksek |

| Çok riskli | Büyük masraf ve hasar ihtimali |

| Çıkış engelli | Büyük okyanus geçişi için şartlar yetersiz |



\---



\## 17. Oyuncuya Gösterilecek Basit Rota Tahmini



Oyuncuya karmaşık formül değil, anlaşılır özet gösterilir.



Örnek rota kartı:



| Alan | Örnek |

|---|---|

| Rota | Girit → Malta |

| Temel Süre | 6 oyun günü |

| Tahmini Süre | 6-8 oyun günü |

| Risk | Orta |

| Hava | Değişken |

| Tekne Uygunluğu | Yeterli |

| Hazırlık | Dikkatli çık |

| İçerik Potansiyeli | Güçlü |

| Uyarı | Bakım seviyesi orta. Sert hava süreni uzatabilir. |



\---



\## 18. Süre Hesabı MVP Basitleştirme



MVP’de tam detaylı matematik yerine sade bir puanlama sistemi kullanılabilir.



Önerilen MVP yaklaşımı:



```text

1\. Rota temel süresi alınır.

2\. Tekne sınıfı süreye etki eder.

3\. Hazırlık puanı hesaplanır.

4\. Hava durumu rastgele veya rota bazlı belirlenir.

5\. Bakım ve enerji durumuna göre süre artar/azalır.

6\. Deniz olayı varsa son süre güncellenir.

```



Basit örnek:



```text

Temel süre: 6 gün

Tekne etkisi: +1 gün

Hava etkisi: +1 gün

Bakım etkisi: 0 gün

Eski Kaptan bonusu: -1 gün



Sonuç: 7 oyun günü

```



\---



\## 19. Okyanus Geçiş Süre Mantığı



Okyanus geçişleri normal rotalardan farklıdır.



Okyanus geçişlerinde süre kadar hazırlık puanı da kritik olmalıdır.



| Geçiş | Temel Süre | Özel Gereksinim |

|---|---:|---|

| Atlantik Geçişi | 18-25 oyun günü | Güvenlik, su, enerji, navigasyon, bakım |

| Pasifik Uzun Etapları | 20-30 oyun günü | Kaynak yönetimi, yedek parça, moral |

| Hint Okyanusu | 18-28 oyun günü | Güçlü güvenlik, bakım, su, enerji |



Okyanus geçişinde:



\- Süre uzun olmalıdır

\- Kaynak tüketimi anlamlı olmalıdır

\- İçerik fırsatı çok güçlü olmalıdır

\- Hazırlıksız çıkış engellenmeli veya çok ağır risk taşımalıdır



\---



\## 20. Token ve Seyahat Süresi



Token sistemi seyahati tamamen ortadan kaldırmamalıdır.



Token kullanım alanları:



| Token Kullanımı | Etki |

|---|---|

| Seyahat hızlandırma | Sürenin bir kısmını azaltır |

| Acil enerji paketi | Enerji kaynaklı gecikmeyi azaltır |

| Acil yakıt desteği | Motor desteği sağlar |

| Acil su paketi | Su riskini düşürür |

| Kriz müdahalesi | Hasarı azaltır ama riski tamamen silmez |



Token ile yapılamayacaklar:



1\. Okyanus geçişini anında bitirmek

2\. Hazırlık şartlarını tamamen atlamak

3\. Rota riskini sıfırlamak

4\. Dünya turunu doğrudan tamamlamak

5\. Oyunu kazanmak



\---



\## 21. Sosyal Medya ve Seyahat Süresi Bağlantısı



Süre uzaması her zaman kötü değildir.



Bazı gecikmeler içerik fırsatı doğurabilir.



| Durum | Sosyal Medya Etkisi |

|---|---|

| Güzel hava, hızlı seyir | Normal rota vlogu |

| Beklenmedik gecikme | Hikaye ve drama |

| Fırtına | Viral fırsat |

| Teknik sorun | ViewTube teknik içerik |

| Enerji krizi | Kriz yönetimi içeriği |

| Okyanus yalnızlığı | Belgesel etkisi |



Tasarım kuralı:



> Süre uzaması oyuncuyu sadece cezalandırmamalı; bazen yeni hikaye üretmelidir.



\---



\## 22. Denge Kuralları



Seyahat süresi sistemi şu kurallara uymalıdır:



1\. Rota süresi oyuncu kararlarından etkilenmelidir.

2\. Tekne seçimi süreyi değiştirmelidir.

3\. Bakım ihmali süre ve risk olarak geri dönmelidir.

4\. Hava kötüleşirse süre uzamalı ama içerik fırsatı doğmalıdır.

5\. Skill sistemi süreye anlamlı ama aşırı olmayan etki vermelidir.

6\. Upgrade sistemi seyahat süresini iyileştirmelidir.

7\. Okyanus geçişleri sıradan rota gibi hissettirmemelidir.

8\. Token süreyi azaltabilir ama oyunu kazandırmamalıdır.

9\. Oyuncuya karmaşık formül değil, net tahmin gösterilmelidir.

10\. Süre uzamaları bazen sosyal medya hikayesi yaratmalıdır.



\---



\## 23. MVP Kapsamı



İlk MVP’de seyahat süresi sistemi şu kapsamda uygulanacaktır:



| Özellik | MVP Durumu |

|---|---|

| Temel rota süreleri | Dahil |

| Tekne sınıfı etkisi | Dahil |

| Bakım etkisi | Dahil |

| Basit hava etkisi | Dahil |

| Enerji / su / yakıt etkisi | Basit düzeyde dahil |

| Oyuncu profili etkisi | Basit düzeyde dahil |

| Deniz olayı etkisi | Dahil |

| Okyanus geçiş özel kontrolü | Dahil |

| Token ile süre hızlandırma | Basit düzeyde dahil |

| Gerçek hava verisi | MVP dışı |

| Gerçek deniz mili hesabı | MVP dışı |

| Tam fiziksel yelken simülasyonu | MVP dışı |

| Detaylı meteoroloji modeli | MVP dışı |



\---



\## 24. Kilit Kararı



Bu belge Seyahat Süresi Formülü V1.0 olarak kabul edilmiş ve kilitlenmiştir.



Seyahat süresi; temel rota süresi, tekne performansı, yelken/motor durumu, hava, rota riski, bakım, enerji, su, yakıt, oyuncu skill’i ve deniz olaylarına göre hesaplanacaktır.



Oyuncuya karmaşık formül gösterilmeyecek; sade rota tahmini, risk seviyesi ve hazırlık uyarısı gösterilecektir.



Bu belge kilitlendikten sonra sıradaki ana tasarım bölümü:



> Token Sistemi V1.0

