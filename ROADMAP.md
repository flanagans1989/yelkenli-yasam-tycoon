\# Yelkenli Yaşam Tycoon — Roadmap



\## Roadmap Durumu



\- Proje yönü: Kilitlendi

\- Oyun Anayasası: V1.0

\- Geliştirme yaklaşımı: Önce tasarım, sonra kod

\- Hedef: Mobil mağazalara çıkabilecek tycoon / simulation oyunu



\---



\## Ana Çalışma Kuralı



Bu projede her bölüm sırayla geliştirilecektir.



Çalışma akışı:



1\. Bölüm tartışılır

2\. Kurallar netleşir

3\. Bölüm V1.0 olarak kilitlenir

4\. İlgili markdown dosyasına işlenir

5\. Gerekirse ADR karar kaydı oluşturulur

6\. GitHub’a commit edilir

7\. Bir sonraki bölüme geçilir



Ana kural:



> Konuşulur, netleştirilir, kilitlenir, GitHub’a işlenir.



GitHub’a işlenmeyen karar kalıcı kabul edilmez.



\---



\## Faz 0 — Proje Deposu ve Doküman Sistemi



Amaç: Projeyi konuşma içinde kaybolmayan, GitHub üzerinden takip edilen gerçek bir ürün deposuna çevirmek.



| No | İş | Durum |

|---:|---|---|

| 0.1 | GitHub private repo oluştur | Tamam |

| 0.2 | Doküman klasör yapısını kur | Tamam |

| 0.3 | README dosyasını oluştur | Tamam |

| 0.4 | ROADMAP dosyasını oluştur | Devam |

| 0.5 | Oyun Anayasası dosyasını doldur | Devam |

| 0.6 | Oyun Anayasası ADR kaydını doldur | Devam |

| 0.7 | Fikir havuzu ve backlog dosyalarını başlat | Bekliyor |



\---



\## Faz 1 — Ana Tasarım Dokümanı



Amaç: Oyunun bütün ana sistemlerini kodlamaya geçmeden önce netleştirmek.



| No | Bölüm | Dosya | Durum |

|---:|---|---|---|

| 1.1 | Oyun Anayasası | docs/01\_Oyun\_Anayasasi.md | Kilitlendi |

| 1.2 | Oyuncu Profilleri | docs/02\_Oyuncu\_Profilleri.md | Sırada |

| 1.3 | Başlangıç Marinaları | docs/03\_Baslangic\_Marinalari.md | Bekliyor |

| 1.4 | Başlangıç Tekneleri | docs/04\_Baslangic\_Tekneleri.md | Bekliyor |

| 1.5 | Dünya Rotası | docs/05\_Dunya\_Rotasi.md | Bekliyor |

| 1.6 | Liman ve Deniz Modu | docs/06\_Liman\_ve\_Deniz\_Modu.md | Bekliyor |

| 1.7 | Tekne Upgrade Sistemi | docs/07\_Tekne\_Upgrade\_Sistemi.md | Bekliyor |

| 1.8 | Sosyal Medya Sistemi | docs/08\_Sosyal\_Medya\_Sistemi.md | Bekliyor |

| 1.9 | Seyahat Süresi Formülü | docs/09\_Seyahat\_Suresi\_Formulu.md | Bekliyor |

| 1.10 | Token Sistemi | docs/10\_Token\_Sistemi.md | Bekliyor |

| 1.11 | Ekonomi Sistemi | docs/11\_Ekonomi\_Sistemi.md | Bekliyor |

| 1.12 | Kazanma Şartları | docs/12\_Kazanma\_Sartlari.md | Bekliyor |

| 1.13 | Mobil Mağaza Stratejisi | docs/13\_Mobil\_Magaza\_Stratejisi.md | Bekliyor |

| 1.14 | MVP Yapım Planı | docs/14\_MVP\_Yapim\_Plani.md | Bekliyor |



\---



\## Faz 2 — Oyun Verisi Taslağı



Amaç: Tasarımda netleşen sistemleri oyun verisi haline getirmek.



Bu fazda henüz büyük UI kodlaması yapılmayacak. Önce veri modelleri hazırlanacak.



| No | İş | Dosya | Durum |

|---:|---|---|---|

| 2.1 | Oyuncu profilleri data taslağı | game-data/playerProfiles.ts | Bekliyor |

| 2.2 | Marina data taslağı | game-data/marinas.ts | Bekliyor |

| 2.3 | Tekne data taslağı | game-data/boats.ts | Bekliyor |

| 2.4 | Rota data taslağı | game-data/routes.ts | Bekliyor |

| 2.5 | Upgrade data taslağı | game-data/upgrades.ts | Bekliyor |

| 2.6 | Ekonomi data taslağı | game-data/economy.ts | Bekliyor |

| 2.7 | Sosyal platform data taslağı | game-data/socialPlatforms.ts | Bekliyor |



\---



\## Faz 3 — Web Prototip Dönüşümü



Amaç: Mevcut React + Vite + TypeScript prototipi yeni konsepte dönüştürmek.



| No | İş | Durum |

|---:|---|---|

| 3.1 | Eski ana menüyü yeni konsepte göre güncelle | Bekliyor |

| 3.2 | Oyuncu profili seçim ekranı | Bekliyor |

| 3.3 | Başlangıç marinası seçim ekranı | Bekliyor |

| 3.4 | Başlangıç teknesi seçim ekranı | Bekliyor |

| 3.5 | Yeni oyun başlangıç akışı | Bekliyor |

| 3.6 | Liman modu ana ekranı | Bekliyor |

| 3.7 | Deniz modu ana ekranı | Bekliyor |

| 3.8 | Sosyal medya içerik üretim ekranı | Bekliyor |

| 3.9 | Tekne upgrade ekranı | Bekliyor |

| 3.10 | Rota ekranı | Bekliyor |

| 3.11 | Event log sistemi güncellemesi | Bekliyor |

| 3.12 | Save / load sistemi güncellemesi | Bekliyor |



\---



\## Faz 4 — Mobil MVP



Amaç: Oyunu mobil cihazlarda oynanabilir hale getirmek.



| No | İş | Durum |

|---:|---|---|

| 4.1 | Mobil öncelikli UI düzeni | Bekliyor |

| 4.2 | Tek elle oynanabilir ana akış | Bekliyor |

| 4.3 | Kısa oturum oyun döngüsü | Bekliyor |

| 4.4 | Günlük görev / günlük fırsat sistemi | Bekliyor |

| 4.5 | Basit reklam ödül sistemi tasarımı | Bekliyor |

| 4.6 | Token kullanım noktaları | Bekliyor |

| 4.7 | Mobil performans kontrolü | Bekliyor |



\---



\## Faz 5 — Store Ready Build



Amaç: Google Play ve App Store için uygun ticari sürüm hazırlamak.



| No | İş | Durum |

|---:|---|---|

| 5.1 | Uygulama adı ve kısa açıklama | Bekliyor |

| 5.2 | Store açıklama metni | Bekliyor |

| 5.3 | Uygulama ikon konsepti | Bekliyor |

| 5.4 | Screenshot planı | Bekliyor |

| 5.5 | Privacy policy | Bekliyor |

| 5.6 | Data safety beyan hazırlığı | Bekliyor |

| 5.7 | In-app purchase ürün listesi | Bekliyor |

| 5.8 | Reklam politikası kontrolü | Bekliyor |

| 5.9 | Test kullanıcılarıyla kapalı test | Bekliyor |

| 5.10 | Google Play kapalı test yayını | Bekliyor |

| 5.11 | App Store TestFlight yayını | Bekliyor |



\---



\## Faz 6 — LiveOps ve Uzun Ömür



Amaç: Oyuncunun oyuna geri dönmesini sağlayan canlı operasyon sistemleri kurmak.



| No | İş | Durum |

|---:|---|---|

| 6.1 | Günlük liman fırsatları | Bekliyor |

| 6.2 | Haftalık rota etkinlikleri | Bekliyor |

| 6.3 | Sezon sistemi | Bekliyor |

| 6.4 | Kaptan Pass sistemi | Bekliyor |

| 6.5 | Yeni tekne sınıfları | Bekliyor |

| 6.6 | Yeni rota paketleri | Bekliyor |

| 6.7 | Özel sponsor etkinlikleri | Bekliyor |

| 6.8 | Oyuncu istatistik ekranı | Bekliyor |



\---



\## Sıradaki Net İş



Sıradaki tasarım bölümü:



> Oyuncu Profilleri V1.0



Bu bölümde 6 oyuncu profilinin hikayesi, başlangıç skilleri, avantajları, dezavantajları, oynanış tarzı ve skill ağacı netleştirilecektir.



Sıra:



1\. Eski Kaptan

2\. İçerik Üreticisi

3\. Teknik Usta

4\. Maceracı Gezgin

5\. Sosyal Girişimci

6\. Aile / Yaşam Kanalı



\---



\## Not



Bu roadmap yaşayan bir belgedir.



Ancak ana sıra korunacaktır.



Yeni fikirler doğrudan roadmap’i bozmayacak; önce backlog veya fikir havuzuna yazılacaktır.

