# Yelkenli Yasam Tycoon - Clean Working Tree Preflight Plan

## Task Overview
Bu görevde, mobil oyun "Yelkenli Yasam Tycoon" geliştirme projesi için çalışmadan önce temiz ve beklenen working tree kontrol akislarini tanımlayacağız. Bu, hizmet verimi artırmak ve sorunları erken yakalamak amacıyla gerekli olan bir süreçtir.

## Preflight Checklist

### 1. Repo Yolu Kontrolü
- **Açıklama**: Repo yolu doğru mu? `C:\dev\yelkenli-yasam-tycoon`.
- **Kontroller**: Dosyanın yolunu kontrol edin ve belirtildiği gibi olduğundan emin olun.

### 2. Branch Kontrolü
- **Açıklama**: Beklenen branch (örneğin: `agent/day-01`) ile eleyiyor mu?
- **Kontroller**: Mevcut branch'i kontrol edin ve belirtildiği gibi olduğundan emin olun.

### 3. Working Tree Kontrolü
- **Açıklama**: Working tree temiz mi veya beklenen durumla uyumlu mu? (Önceden bilinen değişiklik listesi var mı?)
- **Kontroller**: Working tree'in içeriğini inceleyin ve belirtildiği gibi olduğundan emin olun.

### 4. Gerekli A10 Dokümanlar
- **Açıklama**: `docs/agent/a10/A10_TASK_TEMPLATE.md`, `docs/agent/a10/A10_STATUS_CODES.md`, `docs/agent/a10/A10_RETRY_TIMEOUT_POLICY.md` ve `docs/agent/a10/A10_LOG_SCHEMA.md` mevcut mu?
- **Kontroller**: Belirtilen dosyaların varlığını kontrol edin.

### 5. Model/Ajan Komutu Erişimi
- **Açıklama**: Model/ajan komutu eriştirilebilir mi? (Komut bulunuyor ve kullanılabilir mi?)
- **Kontroller**: Ajan komutunu deneyimleyerek erişiminizi kontrol edin.

### 6. Log Dizinleri Erişimi
- **Açıklama**: `logs/agent/a10/` ve alt klasörler eriştirilebilir mi?
- **Kontroller**: Belirtilen dizinlere erişimizinizi kontrol edin.

### 7. Output Dizin Erişimi
- **Açıklama**: Output dizini yazılacağın yol hazır mı? (Task komutlarının yazıldığı yolu var mı?)
- **Kontroller**: Output dizininizde yazma yetkisizinizi kontrol edin.

### 8. Beklenmeyen Durumlar
- **Açıklama**: Beklenmeyen durumlar veya hatalar var mı?
- **Kontroller**: Geçmiş çalışmalarda veya mevcut yapıda belirli hataların olup olmadığını kontrol edin.

## Hard Stop Şartları

### 1. Yasak Değişiklikler
- **Açıklama**: Yasak değişiklik tespit edildiğinde run devam etmez; hard stop uygulanır.
- **Kontroller**: Her değişikliğin gerekli kurallara uygun olup olmadığını kontrol edin.

### 2. İhlaller
- **Açıklama**: Ajan uktusunun doğrulaması olmadan gelen ihlalleri erken yakalamak.
- **Kontroller**: Uktu doğrulamasının yapıldığından emin olun.

### 3. Kapsam Aşırısı Yazım
- **Açıklama**: İzinli kapsam aştıysa yazım yapılmaz; "varsayım" ile kapsam genişletilmez.
- **Kontroller**: Yazımın izlenmesini ve kapsamlarının kontrol edilmesini sağlayın.

## Sonuç
Bu preflight checklist, mobil oyun geliştirme sürecinde çalışmadan önce temiz ve beklenen bir working tree oluşturmak için gereklidir. Her belirtildiği gibi kontrolleri gerçekleştirmek ve gerekli düzenlemeleri yapmak önemlidir.

--- 

**Not**: Bu dokümantasyon, A10 Guardrails Checklist'ine uygun olarak hazırlanmıştır ve hizmet verimi artırmak ve sorunları erken yakalamak amacıyla oluşturulmuştur. Her değişiklikten veya hatadan önce bu kontrol listesini uygulayarak gerekli önlemleri alabilirsiniz.