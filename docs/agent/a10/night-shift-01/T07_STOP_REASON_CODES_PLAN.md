# Task 07 - Stop Reason Codes Plan

Bu bölümde, Yelkenli Yaşam Tycoon mobil oyun geliştirmesi sırasında kullanılacak durum kodları ve durdurma nedenleri hakkında ayrıntılı bilgiler sunulmaktadır.

## Genel Kurallar
1. **Kullanım Bağlamı**: Durum kodları ve durdurma nedenleri, görevlerin tamamlanması sırasında çeşitli durumlarda kullanılacak.
2. **Örnekler**: Hangi durumda hangi kodun kullanıldığını belirtmek için örnekler verilmiştir.

## Durum Kodları ve Durdurma Nedenleri

### 1. Success
- **Anlamı**: Görev, görev tanımlamasının kapsamında başarıyla tamamlandı.
- **Kullanım Durumu**: Tüm doğrulama kurallarını geçti ve yasak değişiklikler yoksa.
- **Batch Devam Durumu**: Evet
- ** İnsan İncelemesi Gerekiyor mu?**: Genelde Hayır, ancak politika gerektiriyorsa Evet
- **Örnek Log Satırı**:
  ```
  [A10][SUCCESS] task=A10-TASK-0101 output=docs/agent/a10/A10_STATUS_CODES.md
  ```

### 2. Soft Fail
- **Anlamı**: Görev tamamlanamadı ama sistemsel/kritik ihlal oluşturmadı.
- **Kullanım Durumu**: Girdi eksikliği, belirsiz bağımlılık veya kısmi engel durumlarında.
- **Batch Devam Durumu**: Evet, sonraki görev denenebilir.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, sebep analizi için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][SOFT_FAIL] task=A10-TASK-0204 reason=insufficient_context
  ```

### 3. Hard Stop
- **Anlamı**: Görev derhal durdurulmalı; devam etmek riskli veya kurala aykırı.
- **Kullanım Durumu**: Yasak kapsam zorunluluğu, güvenlik/politika ihlali, kritik başarısızlık.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, zorunlu.
- **Örnek Log Satırı**:
  ```
  [A10][HARD_STOP] task=A10-TASK-0312 reason=forbidden_scope_required
  ```

### 4. Skipped
- **Anlamı**: Görev bilinçli olarak atlandı.
- **Kullanım Durumu**: Koşul sağlanmadığından veya görev artık geçersiz olduğunda.
- **Batch Devam Durumu**: Evet
- **İnsan İncelemesi Gerekiyor mu?**: Duruma göre; zorunlu olabilir.
- **Örnek Log Satırı**:
  ```
  [A10][SKIPPED] task=A10-TASK-0410 reason=prerequisite_missing
  ```

### 5. Skip Valid
- **Anlamı**: Atlama kararı doğrulandı.
- **Kullanım Durumu**: Koşullar sağlandığından ve geçerli olduğu durumlarda.
- **Batch Devam Durumu**: Evet
- **İnsan İncelemesi Gerekiyor mu?**: Evet, genellikle zorunlu.
- **Örnek Log Satırı**:
  ```
  [A10][SKIP_VALID] task=A10-TASK-0502 reason=conditional_skip
  ```

### 6. Retry
- **Anlamı**: Görev tekrar denenecek.
- **Kullanım Durumu**: İlk deneme başarısız olduğunda veya belirli koşullarda yeniden deneyilmek gerektiğinde.
- **Batch Devam Durumu**: Evet, görevin tekrarı için devam eder.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve sonuçları kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][RETRY] task=A10-TASK-0603 reason=initial_failure
  ```

### 7. Incomplete
- **Anlamı**: Görev tamamlanamadı ve devam edemez.
- **Kullanım Durumu**: Görevin tamamlanamadığından veya yasak durumlar olduğunda.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, zorunlu.
- **Örnek Log Satırı**:
  ```
  [A10][INCOMPLETE] task=A10-TASK-0704 reason=task_unreachable
  ```

### 8. Timeout
- **Anlamı**: Görev zaman aşımı nedeniyle durduruldu.
- **Kullanım Durumu**: Görevin tamamlanması belirli süre içinde gerçekleştirilmediğinde.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve çözümü kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][TIMEOUT] task=A10-TASK-0805 reason=execution_timeout
  ```

### 9. Maintenance Mode
- **Anlamı**: Görev devre dışı bırakıldı ve bakım modunda.
- **Kullanım Durumu**: Sistemin bakım veya yeniden başlatılması gerektiğinde.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve çözümü kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][MAINTENANCE_MODE] task=A10-TASK-0906 reason=maintenance_required
  ```

### 10. Invalid Input
- **Anlamı**: Girdi geçerli değil.
- **Kullanım Durumu**: Kullanıcı girişinin veya sistem tarafından oluşturulan verinin geçersiz olduğunda.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve çözümü kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][INVALID_INPUT] task=A10-TASK-1007 reason=input_validation_failed
  ```

### 11. Resource Unavailable
- **Anlamı**: Gerekli kaynaklar mevcut değil.
- **Kullanım Durumu**: Görevin çalışması için gereken kaynakların (örneğin, hafıza, CPU) bulunmadığında.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve çözümü kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][RESOURCE_UNAVAILABLE] task=A10-TASK-1108 reason=resource_shortage
  ```

### 12. External Dependency Failure
- **Anlamı**: Dış bağımlılık hala mevcut değil.
- **Kullanım Durumu**: Görevin çalışması için gereken dış bağımlılığın (örneğin, API) bulunmadığında veya başarısız olduğunda.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve çözümü kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][EXTERNAL_DEPENDENCY_FAILURE] task=A10-TASK-1209 reason=external_service_unavailable
  ```

### 13. Configuration Error
- **Anlamı**: Yapılandırma hatası.
- **Kullanım Durumu**: Görevin çalışması için gereken yapılandırma ayarlarının doğru olduğunda değil.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve çözümü kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][CONFIGURATION_ERROR] task=A10-TASK-1310 reason=config_error
  ```

### 14. Security Breach
- **Anlamı**: Güvenlik ihlali.
- **Kullanım Durumu**: Sistemin güvenliği tehlikeye atılmış olduğunda.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve çözümü kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][SECURITY_BREACH] task=A10-TASK-1411 reason=security_vulnerability
  ```

### 15. Unknown Error
- **Anlamı**: Bilinmeyen hata.
- **Kullanım Durumu**: Görevin çalışması sırasında bilinmeyen bir hatayla karşılaştığında.
- **Batch Devam Durumu**: Hayır, batch durmalıdır.
- **İnsan İncelemesi Gerekiyor mu?**: Evet, nedeni ve çözümü kontrol etmek için isterilir.
- **Örnek Log Satırı**:
  ```
  [A10][UNKNOWN_ERROR] task=A10-TASK-1512 reason=unhandled_exception
  ```

Bu durum kodları ve durdurma nedenleri, Yelkenli Yaşam Tycoon oyunu geliştirme sırasında görevlerin yönetimini daha etkili hale getirir. Her durum kodu ve nedeni ayrıntılı olarak tanımlanmıştır, böylece herhangi bir durumu hızlıca belirleyebilir ve uygun eylem alabiliriz.