# GAME GUARDRAILS

Bu belge, oyunun core loop'unda suistimali (exploit) azaltmak için uygulanacak temel güvenlik kurallarını ve her yeni mekanik sonrası zorunlu kontrol listesini tanımlar.

## Scope

- Karakter hareketleri / rota ilerleme
- Envanter ve kaynak (yakıt, su, enerji, kredi, takipçi)
- Ödül akışı (arrival, görev, günlük hedef, sponsor, içerik üretimi)
- Kayıt yükleme (`save/load`) ve offline ilerleme

## Core Guardrails

1. Sunum Katmanı Ödül Yazmamalı
- UI sadece state gösterir.
- Ödül dağıtımı tek bir iş kuralı katmanından geçmelidir.
- Aynı aksiyona bağlı birden fazla `setState` ödül yazımı yapılmamalıdır.

2. Tekil Ödül Commit Kuralı (Idempotency)
- Her ödül olayı benzersiz bir `eventId` ile işlenmelidir.
- İşlenen `eventId` tekrar gelirse ödül ikinci kez yazılmamalıdır.
- Arrival, görev, günlük ödül ve sponsor ödülleri bu kurala dahildir.

3. Arrival Ekranı Çakışma Koruması
- Varış ödülü, tek bir commit kilidi ile korunmalıdır (re-entrancy yok).
- `ARRIVAL_SCREEN` tekrar render/geri dönüşlerinde yeniden ödül yazımı olmamalıdır.
- Rota tamamlanma kaydı ile ödül yazımı atomik olarak ele alınmalıdır.

4. Offline Saat Manipülasyonu Sınırı
- Offline süre pozitif ve üst sınırla clamp edilmelidir.
- Geriye alınmış saat (`now < lastSavedAt`) durumda ödül `0` olmalıdır.
- Offline ödülü ayrı bir üst limite sahip olmalıdır (oyun açıkça tanımlı cap).

5. Cooldown ve Timer Güvenliği
- Cooldown kontrolü sadece UI disabled ile sınırlı kalmamalı; handler tarafında da doğrulanmalıdır.
- Negatif veya taşmış süreler `Math.max(0, x)` ile normalize edilmelidir.
- Test/debug modunda cooldown bypass yalnızca açık bir flag ile ve üretimde kapalı olmalıdır.

6. Save Tampering Dayanıklılığı
- `migrateSave` sonrası tüm kritik alanlar tip/doğrulama filtresinden geçmelidir.
- Beklenmeyen alanlar yok sayılmalı, invalid değerler güvenli default'a dönmelidir.
- Satın alım listeleri, upgrade kuyrukları ve step/state geçişleri whitelist ile sınırlandırılmalıdır.

7. Kaynak Alt/Üst Limit Kuralları
- Kaynaklar (yakıt/su/enerji/tekne kondisyonu) [0,100] aralığında clamp edilmelidir.
- Kredi, takipçi, XP gibi değerler negatifleşmemeli; overflow riski kontrol edilmelidir.
- Bir aksiyon kaynak düşürürken aynı frame'de ikinci aksiyonla çifte harcama oluşmamalıdır.

8. Envanter ve Ödül Akışı Tutarlılığı
- Upgrade satın alımında "ödeme alındı ama item eklenmedi" veya tersi durum atomik korunmalıdır.
- Upgrade bitişleri offline işlemde sadece bir kez tamamlanmalıdır.
- Görev tamamlanma ödülü ile günlük toplam ödül birbirini tekrar tetiklememelidir.

9. State Geçiş Beyaz Listesi
- Sadece izinli adımlar arası geçiş yapılmalıdır.
- Geçersiz `step` değerleri güvenli fallback'e düşmelidir.
- `SEA_MODE` -> `ARRIVAL_SCREEN` -> `HUB` akışında geri dönüşler ödül semantiğini bozmamalıdır.

10. Log ve Gözlemlenebilirlik
- Ödül yazan tüm kritik event'ler loglanmalıdır (eventId, kaynak, miktar, timestamp).
- "Ödül verildi" ve "ödül atlandı (duplicate/invalid)" ayrımı izlenebilir olmalıdır.

## Riskli Edge Case Listesi

1. Uygulamayı arka plana alıp cihaz saatini ileri sarma, sonra tekrar açma.
2. Arrival ekranında hızlı çoklu tap / geri-ileri / yeniden mount senaryosu.
3. Save dosyasında `credits`, `followers`, `lastSavedAt`, `step` değerlerini manuel oynama.
4. Cooldown devam ederken handler'a doğrudan çağrı (UI bypass).
5. Aynı görevin iki farklı callback'ten tamamlanması.
6. Upgrade bitiş anında save/load yarış durumu.
7. Gün değişiminde daily reset ile reward claim çakışması.

## Anti-Exploit Smoke Test (Her Yeni Mekanikte Zorunlu)

Bu bölüm, her yeni mekanik eklendiğinde minimum güvenlik regresyonu için uygulanır.

1. Double-Trigger Test
- Aynı aksiyonu 5-10 kez hızlı tetikle.
- Beklenen: Ödül/harcama yalnızca bir kez commit olur.

2. Remount / Navigation Test
- Ekranı kapat-aç, step değiştir, geri dön.
- Beklenen: Tamamlanmış event yeniden ödül vermez.

3. Offline Time Warp Test
- Save al, cihaz saatini ileri al, geri al, tekrar aç.
- Beklenen: Clamp dışında ekstra ödül yok, negatif sürede ödül yok.

4. Save Tampering Test
- Kritik alanlara (kredi, takipçi, step, cooldown, upgrade queue) invalid değer enjekte et.
- Beklenen: Uygulama crash etmez; değerler sanitize edilip güvenli default'a döner.

5. Resource Bounds Test
- Kaynak tüketim ve doldurma aksiyonlarını sınırda çalıştır (0, 1, 99, 100).
- Beklenen: Alt/üst limit dışına çıkış yok.

6. Concurrent Reward Sources Test
- Aynı turda birden fazla ödül kaynağını tetikle (arrival + görev + günlük).
- Beklenen: Çifte yazım yok, toplamlar deterministik.

7. Production Flag Test
- Debug/test menüsü açıkken ve kapalıyken aynı senaryoyu çalıştır.
- Beklenen: Üretim davranışı debug bypass içermiyor.

## Release Gate (Go/No-Go)

Yeni mekanik aşağıdaki koşullar sağlanmadan release'e çıkmamalıdır:

1. Anti-Exploit Smoke Test'in tüm maddeleri geçti.
2. Ödül ve harcama akışı için duplicate koruması doğrulandı.
3. Save/load migrasyonu invalid input ile test edildi.
4. Offline hesaplama üst limit ve saat geri sarma senaryosu doğrulandı.

