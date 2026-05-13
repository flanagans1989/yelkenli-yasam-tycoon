# A10 Retry / Timeout / Skip Politikası

## 1. Amaç
Bu politika, A10 gece vardiyası çalıştırmalarında görevlerin ne zaman yeniden deneneceğini, ne zaman atlanacağını ve ne zaman durdurulacağını netleştirir. Amaç, yerel model maliyetini/süresini kontrol altında tutarken A9R yaklaşımının üstüne güvenlik ve standardizasyon katmaktır.

## 2. Temel İlke
- Retry varsayılan davranış değildir.
- Yerel küçük modellerin uzun döngülerde takılmasına izin verilmez.
- Her retry kararı görev tipi ve doğrulama sonucu ile gerekçelendirilir.
- `1 task = 1 agent call = 1 output file` ilkesi korunur.
- Ajan taşeron, script saha şefi, kullanıcı patron, ChatGPT uygulama koçudur.

## 3. Görev Tipine Göre Timeout Politikası
Önerilen üst süreler (tek deneme için):
- `docs-only`: 120 sn
- `audit/checklist`: 180 sn
- `css-patch-proposal`: 180 sn
- `css-patch-apply`: 240 sn
- `script-only`: 240 sn
- `build-check`: 420 sn

Notlar:
- Bu süreler üst sınırdır; erken hata varsa beklemeden sonlandırılır.
- Aynı batch içinde sistem yüküne göre +%20 tolerans yalnızca manuel onayla uygulanır.

## 4. Retry Kuralları
Retry izinli durumlar:
- Doğrulama hatası düzeltilebilir ve daraltılmış ikinci istemle çözülebilir görünüyorsa.
- Çıktı üretildi fakat format/başlık/işaretleyici eksikliği varsa.
- Geçici timeout oluştuysa ve görev kritik değilse.

Retry yasak durumlar:
- Forbidden scope ihlali.
- `src/`, `scripts/`, `package*.json` gibi yasak alanlarda değişiklik.
- Çıktı yolu izinli path dışında.
- Ajanın geniş erişim istemesi veya belirsiz/yıkıcı komut önermesi.

Sınırlar:
- Maksimum retry sayısı: `1` (ilk deneme + en fazla bir ikinci deneme).
- İkinci deneme mutlaka daha dar prompt ile yapılır: yalnızca eksik kalan doğrulama maddesi hedeflenir.

Tekrarlayan başarısızlık:
- İkinci denemede de geçmezse sonuç `SKIP_WITH_NOTE` veya `SOFT_FAIL` olur.
- Kritik olmayan görevlerde öncelik `SKIP_WITH_NOTE`, kritik görevlerde `SOFT_FAIL`.

## 5. SKIP Kuralları
- `SKIP_VALID`: Görevin atlanması kurala uygun ve gerekçesi doğrulanmış.
  - Örnek: Hedef çıktı dosyası zaten güncel ve valid.
- `SKIPPED`: Görev çalıştırılmadı ama geçerlilik doğrulaması tamamlanmadı.
  - Örnek: Önkoşul verisi yok, doğrulama yapılamadı.
- `SKIP_WITH_NOTE`: Görev bilinçli atlandı ve sebep + risk notu rapora yazıldı.
  - Örnek: İkinci deneme sonrası yine düşük kalite docs çıktısı.

## 6. Soft Fail Karar Ağacı
Batch devam edebilir (SOFT_FAIL/skip sınıfı) durumlar:
- Çıktı beklenenden kısa ama temel başlıklar mevcut.
- Opsiyonel rapor bölümü eksik.
- Kritik olmayan `docs-only` görevinde timeout.
- Dokümantasyon kalitesi zayıf (dil/akış problemi) fakat kapsam ihlali yok.
- Placeholder tespit edildi (`TODO`, `TBD`, `Lorem ipsum`) ve içerik kurtarılabilir değil.

Karar:
- Kritik olmayan görevse `SOFT_FAIL` veya `SKIP_WITH_NOTE` ver, batch devam etsin.
- Aynı batch içinde ardışık 2+ soft fail oluşursa sabah raporunda "batch kalite riski" notu zorunlu.

## 7. Hard Stop Karar Ağacı
Aşağıdaki durumlarda batch durmalıdır:
- Forbidden file change.
- `package.json` / `package-lock.json` gibi paket dosyası değişikliği.
- İzin olmadan kaynak dosya (`src/`) değişikliği.
- `build-check` görevinde net build failure.
- Yasak CSS deseni (ör. global reset kırıcı, güvenli olmayan `!important` yığını, kapsam dışı selector taşması).
- Çıktının izinli path dışında üretilmesi.
- Ajanın geniş/belirsiz erişim istemesi.
- Bilinmeyen yıkıcı komut önerisi (`rm -rf`, `git reset --hard`, kapsam dışı silme/taşıma vb.).

Kural:
- Hard stop sonucu hiçbir koşulda başarıya çevrilmez.
- Önce durdur, sonra manuel inceleme.

## 8. Reflection Loop Politikası
- Yerel modeller için `--max-reflections 1` tercih edilir.
- Uzun reflection döngüleri çoğunlukla aynı hatayı tekrarlatır, süreyi ve enerji maliyetini artırır.
- A10 hedefi hızlı ve denetlenebilir gece üretimidir; sınırsız düşünme döngüsü değildir.
- Gelecekte artırma koşulu:
  - Daha güçlü model,
  - Ölçülmüş başarı artışı,
  - Batch süre bütçesini bozmayan kanıtlı profil.

## 9. Output Validation Politikası
Zorunlu kontroller:
- Minimum byte eşiği:
  - `docs-only`: en az 600 byte
  - `css-patch-proposal`: en az 800 byte
- Zorunlu başlıklar: görev tipine göre beklenen bölüm başlıkları eksiksiz olmalı.
- CSS patch işaretleyicileri (görev tipi uygunsa):
  - `/* A10_PATCH_START */`
  - `/* A10_PATCH_END */`
- Forbidden pattern kontrolleri:
  - Kapsam dışı dosya yolu,
  - Tehlikeli komut kalıpları,
  - Yasak selector/desenler.
- Placeholder tespiti: `TODO`, `TBD`, `FIXME`, `Lorem ipsum`.
- Yinelenen/tekrarlı içerik uyarısı:
  - Aynı paragrafın anlamsız tekrarında sonuç `SOFT_FAIL` veya `SKIP_WITH_NOTE`.

## 10. Final Rapor Davranışı
Sabah final raporunda her görev için şu alanlar görünmelidir:
- `Task ID`
- `Status`
- `Attempt Count`
- `Timeout Used`
- `Retry Reason` (varsa)
- `Skip Reason` (varsa)
- `Validation Summary`
- `Manual Review Flag`

Ek rapor kuralları:
- Retry/timeout/skip kararları saklanmaz, açık yazılır.
- Hard stop oluştuysa batch kapanış satırında ayrı alarm olarak verilir.
- "Başarılı" satırı, önceki soft fail/hard stop geçmişini gizleyemez.

## 11. Örnek Karar Senaryoları
1. Docs çıktısı çok kısa:
- Durum: 320 byte, başlıklar eksik.
- Karar: 1 dar retry.
- Sonuç: Düzelmezse `SOFT_FAIL`.

2. CSS patch marker eksik:
- Durum: İçerik var ama `A10_PATCH_START/END` yok.
- Karar: Marker odaklı dar retry.
- Sonuç: Düzelmezse `SKIP_WITH_NOTE`.

3. CSS patch içinde yasak desen:
- Durum: Kapsam dışı global selector ve aşırı `!important` zinciri.
- Karar: Anında durdur.
- Sonuç: `HARD_STOP`.

4. Build exit code okunamıyor ama error marker yok:
- Durum: Çıkış kodu belirsiz, logda net hata imzası yok.
- Karar: Tek retry veya kısa yeniden doğrulama.
- Sonuç: Hâlâ belirsizse `SOFT_FAIL` + manuel inceleme.

5. Aider timeout ve çıktı yok:
- Durum: Süre doldu, dosya üretilmedi.
- Karar: Görev kritik değilse tek retry.
- Sonuç: Yine yoksa `SKIP_WITH_NOTE`.

6. Mevcut çıktı zaten valid:
- Durum: Hedef dosya güncel ve tüm doğrulamalar geçiyor.
- Karar: Yeniden üretme yok.
- Sonuç: `SKIP_VALID`.

7. Yanlış branch:
- Durum: Çalışma dalı beklenen batch dalı değil.
- Karar: Üretimi başlatma.
- Sonuç: `SKIPPED` (gerekçe: branch önkoşulu sağlanmadı).

8. Forbidden dosya değişti:
- Durum: `src/` altında beklenmeyen değişiklik tespit edildi.
- Karar: Anında durdur.
- Sonuç: `HARD_STOP` + manuel inceleme.

## 12. Kabul Kriteri
- Her görev bir statü ile kapanır.
- Gizli başarısızlık bırakılmaz.
- Hard stop hiçbir zaman success'e çevrilmez.
- Tekrarlayan soft fail açık ve izlenebilir raporlanır.
- Commit/push öncesi manuel inceleme zorunluluğu korunur.
