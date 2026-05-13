# Yelkenli Yasam Tycoon Gece Vardiyası Kanıt Listesi

## Genel Bakış
Bu kanıt liste, sabah incelemesinde commit/rollback kararları alırken gereklilikleri ve önceliklerini belirtmek için oluşturulmuştur. Bu liste, devamlı izleme, denetim ve güvenliği sağlamak amacıyla kullanılır.

## 1. Genel Kanıt Listesi
- [ ] Gece çalıştırmanın başlangıç zamanı (ISO 8601 formatında)
- [ ] Gece çalıştırmanın bitiş zamanı (ISO 8601 formatında)
- [ ] Gece çalıştırması gerçekleştirilen branche

## 2. Log Dosya Kontrolü
- [ ] Log dosyalarının doğru klasörlerde saklanması (`logs/agent/a10/`)
- [ ] Her task için bir final satırı varlığını kontrol etmek
- [ ] Durdurma nedeni belirtilmiş olup olmadığını kontrol etmek (retry, skip, hard stop, manual review)

## 3. Commit/Kaydetme Kanıtları
- [ ] Gece çalıştırması sonucunda oluşan her commitin detaylarının içerildiği kanıt
- [ ] Kaydedilen dosyaların listesi ve değişiklik türlerinin belirlendiği kanıt

## 4. Güvenlik Kontrolleri
- [ ] Preflight checklist'inin tamamlanıp tamamlanmadığını kontrol etmek
- [ ] Model/ajan komutu erişim durumunu kontrol etmek
- [ ] Log ve output dizinlerinin erişilebilir olup olmadığını kontrol etmek

## 5. Durumu Değerlendirme
- [ ] Gece çalıştırması sonucu oluşan her taskin statüsünün belirlendiği kanıt
- [ ] Task loglarının toplamları ile durum tablosunun birebir eşleştiğinin kontrolü

## 6. Sorumluluk ve Notlar
- [ ] Her görevin sorumlusu ve ilgili notların içeriğini içeren kanıt
- [ ] Manuel incelemeye gerekli olan görevlerin belirlendiği kanıt

Bu kanıt listesi, sabah incelemelerinde tüm gereklilikleri ve öncelikleri karşılamak için kullanılacak. Bu, güvenliği ve qualité kontrolünü sağlamak amacıyla temel bir referans sunmaktadır.