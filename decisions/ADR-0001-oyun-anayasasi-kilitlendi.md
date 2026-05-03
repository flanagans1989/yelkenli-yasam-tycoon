\# ADR-0001 — Oyun Anayasası V1.0 Kilitlendi



\## Durum



Kabul edildi / Kilitlendi



\## Tarih



03.05.2026



\## Bağlam



Yelkenli Yaşam Tycoon projesi ilk aşamada React + Vite + TypeScript tabanlı bir browser tycoon oyunu olarak geliştirilmişti.



Eski prototipte ana menü, hub, rota, içerik, mağaza, sponsor, kayıt, event log, modal sistemi ve localStorage gibi altyapılar oluşturulmuştu.



Ancak proje daha güçlü, daha ticari ve mobil mağazalara uygun bir yöne çevrilmiştir.



Yeni ana yön:



Türkiye’den seçilen bir marinadan başlayan, oyuncu profili ve başlangıç teknesi seçimiyle ilerleyen, sosyal medya içerikleri üreterek gelir kazanan, teknesini gerçek denizcilik sistemlerine dayalı parçalarla geliştiren ve dünya turuna çıkan mobil odaklı tycoon / simulation oyunu.



Hedef platformlar:



\- Web prototip

\- Google Play

\- App Store



\## Karar



Yelkenli Yaşam Tycoon için “Oyun Anayasası V1.0” kabul edilmiş ve kilitlenmiştir.



Ana oyun omurgası şu şekilde kabul edilmiştir:



1\. Oyun Türkiye’den başlar.

2\. Oyuncu başlangıçta profil seçer.

3\. Oyuncu Türkiye’de bir marina seçer.

4\. Oyuncu başlangıç teknesi seçer.

5\. Başlangıçta 3 tekne sınıfı olur:

&#x20;  - 28 ft eski ikinci el yelkenli

&#x20;  - 34 ft dengeli ikinci el cruiser

&#x20;  - 40 ft modern ocean cruiser

6\. Gerçek marka / model isimleri yerine kurgusal isimler kullanılır.

7\. Dünya rotası gerçekçi ama oyunlaştırılmış olur.

8\. Oyun liman modu ve deniz modu olarak iki ana akışa ayrılır.

9\. Tekne upgrade sistemi gerçek denizcilik parçalarına dayanır.

10\. Sosyal medya sistemi oyunun ana gelir ve büyüme motorlarından biridir.

11\. Token sistemi pay-to-win olmayacaktır.

12\. Token sadece zaman hızlandırma ve kolaylık sağlayacaktır.

13\. Oyunun ana hedefi:

&#x20;   - Dünya turunu tamamlamak

&#x20;   - 1 milyon takipçiye ulaşmak

&#x20;   - Tekneyi okyanus geçişine uygun seviyeye getirmek

14\. Mevcut kod altyapısı çöpe atılmayacak, yeni konsepte göre dönüştürülecektir.



\## Ana Tasarım Sorusu



Her özellik, ekran, görev, karar ve sistem şu soruya göre değerlendirilecektir:



> Oyuncu bu kararı verdikten sonra ilerleme, merak, risk veya ödül hissediyor mu; ve oyunu yarın tekrar açmak için bir sebebi var mı?



Kısa tasarım filtresi:



> Oyuncu bunu gördükten sonra bir tur daha oynamak ister mi?



\## Sonuçlar



Bu karar ile birlikte proje artık fikir aşamasından ürünleşme aşamasına geçmiştir.



Bundan sonra oyun tasarımı şu sırayla geliştirilecektir:



1\. Oyuncu profilleri

2\. Başlangıç marinaları

3\. Başlangıç tekneleri

4\. Dünya rotası

5\. Liman / deniz modu

6\. Tekne kesiti ve upgrade sistemi

7\. Sosyal medya sistemi

8\. Seyahat süresi formülü

9\. Token sistemi

10\. Ekonomi sistemi

11\. Kazanma şartı

12\. Yeni yapım planı



\## Değişiklik Kuralı



Bu karar ancak güçlü bir gerekçe varsa değiştirilebilir.



Değişiklik yapılacaksa önce yeni bir ADR dosyası açılmalıdır.



Örnek:



\- ADR-0004 — Oyun Anayasası V1.1 Revizyonu

\- ADR-0005 — Monetizasyon Modeli Revizyonu



\## Not



Bu belge oyunun yönünü kilitlemek için oluşturulmuştur.



Kodlama başlamadan önce ana tasarım bölümleri tek tek tamamlanacak ve ilgili markdown dosyalarına işlenecektir.

