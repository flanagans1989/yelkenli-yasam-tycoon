\# Yelkenli Yaşam Tycoon — Tasarım Backlog



\## Dosya Amacı



Bu dosya, oyunun kodlamaya geçmeden önce tamamlanması gereken tasarım işlerini takip etmek için kullanılır.



Ana kural:



> Önce tasarım netleşir, sonra kod yazılır.



Bu listedeki her iş tamamlandığında ilgili `docs/` dosyasına işlenecek ve gerekirse `decisions/` klasöründe karar kaydı oluşturulacaktır.



\---



\## Durum Etiketleri



| Durum | Anlamı |

|---|---|

| Bekliyor | Henüz başlanmadı |

| Devam | Üzerinde çalışılıyor |

| İnceleme | Son kontrol aşamasında |

| Kilitlendi | V1.0 olarak kabul edildi |

| Ertelendi | İleri sürüme bırakıldı |

| İptal | Oyundan çıkarıldı |



\---



\## Öncelik Etiketleri



| Öncelik | Anlamı |

|---|---|

| Kritik | Ana oyun omurgası için şart |

| Yüksek | MVP için güçlü şekilde gerekli |

| Orta | İlk sürümde olabilir ama zorunlu değil |

| Düşük | İleri sürüm fikri olabilir |



\---



\## Ana Tasarım İşleri



| No | Tasarım İşi | İlgili Dosya | Öncelik | Durum | Not |

|---:|---|---|---|---|---|

| 1 | Oyun Anayasası V1.0 | docs/01\_Oyun\_Anayasasi.md | Kritik | Kilitlendi | Ana yön belirlendi. |

| 2 | Oyuncu Profilleri V1.0 | docs/02\_Oyuncu\_Profilleri.md | Kritik | Bekliyor | Sıradaki ana çalışma. |

| 3 | Başlangıç Marinaları V1.0 | docs/03\_Baslangic\_Marinalari.md | Kritik | Bekliyor | Türkiye başlangıç noktaları netleşecek. |

| 4 | Başlangıç Tekneleri V1.0 | docs/04\_Baslangic\_Tekneleri.md | Kritik | Bekliyor | 28 ft, 34 ft, 40 ft sınıfları dengelenecek. |

| 5 | Dünya Rotası V1.0 | docs/05\_Dunya\_Rotasi.md | Kritik | Bekliyor | Etap etap dünya turu kurulacak. |

| 6 | Liman ve Deniz Modu V1.0 | docs/06\_Liman\_ve\_Deniz\_Modu.md | Kritik | Bekliyor | Oyunun iki ana modu ayrılacak. |

| 7 | Tekne Upgrade Sistemi V1.0 | docs/07\_Tekne\_Upgrade\_Sistemi.md | Kritik | Bekliyor | Gerçek denizcilik parçalarıyla tycoon sistemi kurulacak. |

| 8 | Sosyal Medya Sistemi V1.0 | docs/08\_Sosyal\_Medya\_Sistemi.md | Kritik | Bekliyor | Takipçi, gelir, viral, sponsor dengesi kurulacak. |

| 9 | Seyahat Süresi Formülü V1.0 | docs/09\_Seyahat\_Suresi\_Formulu.md | Yüksek | Bekliyor | Tekne, hava, skill ve donanım etkileri hesaplanacak. |

| 10 | Token Sistemi V1.0 | docs/10\_Token\_Sistemi.md | Yüksek | Bekliyor | Pay-to-win olmayan hızlandırma sistemi netleşecek. |

| 11 | Ekonomi Sistemi V1.0 | docs/11\_Ekonomi\_Sistemi.md | Kritik | Bekliyor | Kredi, gelir, gider, bakım, sponsor ve upgrade dengesi kurulacak. |

| 12 | Kazanma Şartları V1.0 | docs/12\_Kazanma\_Sartlari.md | Kritik | Bekliyor | Dünya turu + 1M takipçi + okyanus hazır tekne ölçülecek. |

| 13 | Mobil Mağaza Stratejisi V1.0 | docs/13\_Mobil\_Magaza\_Stratejisi.md | Yüksek | Bekliyor | Google Play / App Store hedefi için ticari kurallar netleşecek. |

| 14 | MVP Yapım Planı V1.0 | docs/14\_MVP\_Yapim\_Plani.md | Kritik | Bekliyor | Hangi özellik önce kodlanacak belirlenecek. |



\---



\## Detay Tasarım Alt İşleri



\### 1. Oyuncu Profilleri



| No | İş | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 1.1 | 6 profilin kısa hikayesini yaz | Kritik | Bekliyor | Eski Kaptan, İçerik Üreticisi, Teknik Usta, Maceracı Gezgin, Sosyal Girişimci, Aile / Yaşam Kanalı |

| 1.2 | Her profilin başlangıç skill değerlerini belirle | Kritik | Bekliyor | Denizcilik, içerik, teknik, sponsor, risk, konfor gibi değerler |

| 1.3 | Her profilin avantajını belirle | Kritik | Bekliyor | Oyuncuya net seçim sebebi vermeli |

| 1.4 | Her profilin dezavantajını belirle | Kritik | Bekliyor | Denge için şart |

| 1.5 | Her profilin oynanış tarzını yaz | Yüksek | Bekliyor | Oyuncu seçmeden önce nasıl oynayacağını anlamalı |

| 1.6 | Skill ağacı taslağı çıkar | Yüksek | Bekliyor | MVP’de basit olabilir, ileri sürümde büyür |

| 1.7 | Profil seçiminin sosyal medya etkisini belirle | Yüksek | Bekliyor | Platform uyumu profil bazlı değişmeli |

| 1.8 | Profil seçiminin deniz modu etkisini belirle | Yüksek | Bekliyor | Risk, rota, arıza ve kriz etkisi |



\---



\### 2. Başlangıç Marinaları



| No | İş | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 2.1 | MVP başlangıç marina listesini belirle | Kritik | Bekliyor | Marmaris, Göcek, Fethiye, Kaş, Bodrum, Kuşadası, Çeşme, Antalya, İstanbul, Yalova |

| 2.2 | Her marinanın başlangıç bonusunu yaz | Kritik | Bekliyor | Sponsor, bakım, içerik, rota veya parça bonusu |

| 2.3 | Her marinanın zorluğunu belirle | Yüksek | Bekliyor | Başlangıç ekonomisi ve rota etkisi |

| 2.4 | Marina özel içerik türlerini belirle | Orta | Bekliyor | Şehir, lifestyle, bakım, marina yaşamı |

| 2.5 | Marina özel fırsat sistemini tasarla | Yüksek | Bekliyor | Günlük geri dönüş sebebi üretir |



\---



\### 3. Başlangıç Tekneleri



| No | İş | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 3.1 | 28 ft sınıfını tasarla | Kritik | Bekliyor | Zor ama ucuz başlangıç |

| 3.2 | 34 ft sınıfını tasarla | Kritik | Bekliyor | Dengeli başlangıç |

| 3.3 | 40 ft sınıfını tasarla | Kritik | Bekliyor | Güçlü ama pahalı başlangıç |

| 3.4 | Kurgusal tekne isimleri üret | Yüksek | Bekliyor | Gerçek marka kullanılmayacak |

| 3.5 | Her teknenin kapasite değerlerini belirle | Kritik | Bekliyor | Enerji, su, yakıt, güvenlik, konfor, hız |

| 3.6 | Her teknenin upgrade potansiyelini belirle | Yüksek | Bekliyor | Küçük teknede sınır, büyük teknede kapasite |



\---



\### 4. Dünya Rotası



| No | İş | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 4.1 | Ana dünya rotasını etaplara böl | Kritik | Bekliyor | Türkiye’den dönüş rotasına kadar |

| 4.2 | Her etap için zorluk seviyesi belirle | Kritik | Bekliyor | Kolay, orta, zor, okyanus |

| 4.3 | Her etap için içerik potansiyeli belirle | Yüksek | Bekliyor | Viral ve sponsor etkisi |

| 4.4 | Her etap için minimum tekne hazırlığı belirle | Kritik | Bekliyor | Özellikle Atlantik ve Pasifik |

| 4.5 | Etap sürelerini oyunlaştırılmış şekilde belirle | Yüksek | Bekliyor | Gerçekçi hissedecek ama sıkmayacak |



\---



\### 5. Liman ve Deniz Modu



| No | İş | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 5.1 | Liman modunda yapılacak aksiyonları belirle | Kritik | Bekliyor | Upgrade, bakım, sponsor, alışveriş, şehir içeriği |

| 5.2 | Deniz modunda yapılacak aksiyonları belirle | Kritik | Bekliyor | Seyir, hava, kriz, tüketim, deniz vlogu |

| 5.3 | Limanda yapılabilen ama denizde yapılamayan işleri belirle | Kritik | Bekliyor | Büyük upgrade, ağır tamir |

| 5.4 | Deniz modu risk olaylarını tasarla | Yüksek | Bekliyor | Fırtına, arıza, enerji krizi, rota sapması |

| 5.5 | Liman modu fırsat olaylarını tasarla | Yüksek | Bekliyor | İndirim, sponsor, etkinlik, özel lokasyon |



\---



\### 6. Tekne Upgrade Sistemi



| No | İş | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 6.1 | Upgrade kategorilerini kesinleştir | Kritik | Bekliyor | Enerji, navigasyon, güvenlik, yelken, motor, su, konfor, içerik ekipmanı |

| 6.2 | Her kategori için MVP parçalarını seç | Kritik | Bekliyor | İlk sürümde çok fazla parça olmayacak |

| 6.3 | Her parçanın etkisini belirle | Kritik | Bekliyor | En az 2-3 sisteme etkisi olmalı |

| 6.4 | Büyük marina gerektiren parçaları belirle | Yüksek | Bekliyor | Radar, jeneratör, su yapıcı gibi |

| 6.5 | Upgrade süre ve maliyet mantığını kur | Yüksek | Bekliyor | Para + zaman |

| 6.6 | Tekne kesiti ekran mantığını tasarla | Orta | Bekliyor | Oyuncu parçaları görsel olarak hissetmeli |



\---



\### 7. Sosyal Medya Sistemi



| No | İş | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 7.1 | Platformları kesinleştir | Kritik | Bekliyor | ViewTube, ClipTok, InstaSea, FacePort, LiveWave |

| 7.2 | Her platformun rolünü belirle | Kritik | Bekliyor | Gelir, viral, sponsor, sadakat |

| 7.3 | İçerik türlerini belirle | Kritik | Bekliyor | Liman, deniz, şehir, özel lokasyon |

| 7.4 | İçerik kalitesi formülünü tasarla | Yüksek | Bekliyor | Profil + ekipman + lokasyon + trend |

| 7.5 | Viral olma mantığını tasarla | Yüksek | Bekliyor | Tamamen rastgele olmamalı |

| 7.6 | Sponsor uyumu mantığını tasarla | Yüksek | Bekliyor | Profil ve platform uyumuna göre |



\---



\### 8. Ekonomi ve Token



| No | İş | Öncelik | Durum | Not |

|---:|---|---|---|---|

| 8.1 | Ana para birimini netleştir | Kritik | Bekliyor | Kredi öneriliyor |

| 8.2 | Gelir kaynaklarını belirle | Kritik | Bekliyor | İçerik, sponsor, bağış, görev |

| 8.3 | Gider kaynaklarını belirle | Kritik | Bekliyor | Bakım, marina, yakıt, su, upgrade, tamir |

| 8.4 | Token kullanım alanlarını belirle | Yüksek | Bekliyor | Hızlandırma ve kolaylık |

| 8.5 | Token ile yapılamayacak şeyleri yaz | Kritik | Bekliyor | Başarı satın alınamaz |

| 8.6 | İlk balans değerlerini belirle | Orta | Bekliyor | MVP sonrası testle değişir |



\---



\## Sıradaki Aktif Tasarım İşi



Şu anda aktif sıradaki iş:



> Oyuncu Profilleri V1.0



Bu iş tamamlanmadan sonraki ana bölüme geçilmeyecektir.



\---



\## Kilit Kuralı



Bir bölüm tamamlandığında durum şu şekilde güncellenecektir:



```text

Kilitlendi

