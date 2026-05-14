# T03_UNEXPECTED_FILE_GUARD_PLAN

## Task Overview

Beklenmeyen yeni dosya tespiti ve aksiyon karar ağacını yazmak için bu dokümantasyonu oluşturmamız gerekiyor. Bu, A10 gece vardiyası sırasında gizli veya beklenmeyen dosyaların tespit edilmesi ve uygun reaksiyonlar verilmesi açısından kritik bir görevdir.

## Goals

- Beklenmeyen yeni dosya tespiti ve aksiyon karar ağacının oluşturulması.
- Gereken kontrol listesi ve karar matrisinin tanımlanması.
- Hazır olması için gerekli dosyaların varlığını doğrulama.

## Preflight Checklist

Aşağıdaki kontroller, run bağımsızından önce zorunludur:

1. Repo yolu doğru mu: `C:\dev\yelkenli-yasam-tycoon`.
2. Branch doğru mu: beklenen branch (`agent/day-01` gibi) ile eşleşiyor mu.
3. Working tree temiz mi veya beklenen durumla uyumlu mu (önceden bilinen değişiklik listesi var mı).
4. Gerekli A10 dokümantalarının mevcut mu:
   - `docs/agent/a10/A10_TASK_TEMPLATE.md`
   - `docs/agent/a10/A10_STATUS_CODES.md`
   - `docs/agent/a10/A10_RETRY_TIMEOUT_POLICY.md`
   - `docs/agent/a10/A10_LOG_SCHEMA.md`
5. Model/ajan komutu erişilebilir mi (komut bulunuyor ve çalışabiliyor mu).
6. Log dizinleri erişilebilir mi: `logs/agent/a10/` ve alt klasörleri.
7. Output dizini erişilebilir mi (task komutların yazılacağı yol hazır mı).

## Unexpected File Detection and Action Plan

Beklenmeyen dosya tespiti, gizli veya beklenmeyen dosyaların varlığını tespit etme sürecidir. Bu tespit, genellikle dosyanın özellikleri veya içeriği ile ilgili bilgilere dayanır. Aşağıdaki örnek senaryolar, beklenmeyen dosya tespiti ve uygun aksiyonlar hakkında açıklar.

### Example Scenario 1: Unknown File Detected in Logs

**Tespit:** Bir log dosyası (`logs/agent/a10/example.log`) içerisinde yeni bir dosya (`.log` uzantılı) varlığı tespit edilir.

**Aksiyon:** 
1. Dosyanın içeriğini inceleyin.
2. Dosyanın doğru bir log dosyası mı olduğunu doğrulayın.
3. Dosyanın güvenli olup olmadığını kontrol edin (örneğin, özel bilgiler içeriyor mu?).
4. Dosyayı silin veya uygun bir konuma taşın.

### Example Scenario 2: Unknown File Detected in Project Directory

**Tespit:** Proje dizini (`C:\dev\yelkenli-yasam-tycoon`) içerisinde yeni bir dosya (`.txt` uzantılı) varlığı tespit edilir.

**Aksiyon:**
1. Dosyanın içeriğini inceleyin.
2. Dosyanın proje işlevine uygun olup olmadığını doğrulayın.
3. Dosyayı silin veya uygun bir konuma taşın.
4. Eğer dosya projeye gerekliyse, onu projeye ekleyin ve gerekli değişiklikleri yapın.

## Conclusion

Beklenmeyen yeni dosyanın tespiti ve aksiyon planı, A10 gece vardiyası sırasında güvenliği artırmak için kritik bir adımdır. Bu işlemi doğru bir şekilde uygulayarak, sistemden gizli veya tehlikeli dosyaların tespit edilmesi ve uygun aksiyonlar verilmesi sağlanabilir.

---

Bu dokümantasyon, A10 gece vardiyası sırasında beklenmeyen yeni dosyanın tespiti ve aksiyon planının oluşturulması ve uygulanmasını açıklar. Herhangi bir sorun ya da geri bildirim olursa, lütfen bu bilgilerle ilgili olarak iletişime geçin.