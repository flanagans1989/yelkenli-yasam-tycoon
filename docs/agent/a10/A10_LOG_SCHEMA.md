# A10 Log Şeması

## 1. Amaç

Bu doküman, A10 gece vardiyası çalıştırmalarında üretilen logların tek tip, denetlenebilir ve otomasyona uygun olmasını tanımlar. Amaç; her task sonucunun, her kritik kararın ve her durdurma nedeninin sabah incelemesinde tartışmasız şekilde görülebilmesidir.

## 2. Loglama Temel İlkesi

- Loglar süs değil, kanıttır. Her satır bir kararın veya bir sonucun ispatı olmalıdır.
- Her task için zorunlu bir durum satırı bulunur; task "görünmez" tamamlanamaz.
- Önemli kararlar (retry, skip, hard stop, manual review) izlenebilir gerekçe ile yazılır.
- Loglar hem insan hem script tarafından okunabilir olmalıdır: sabit alanlar, düzenli ayraç, kısa ve net not.

## 3. Log Dosya Yapısı

Önerilen dizin yapısı:

- `logs/agent/a10/`
- `logs/agent/a10/runs/`
- `logs/agent/a10/tasks/`
- `logs/agent/a10/incidents/`

Klasörlerin rolü:

- `logs/agent/a10/`: A10 için kök log alanı; run, task ve incident loglarını aynı standarda bağlar.
- `logs/agent/a10/runs/`: Her gece çalıştırmasının run-özet kaydı. Sayaçlar ve final durum burada tutulur.
- `logs/agent/a10/tasks/`: Task bazlı satır logları. Her task için tek final satır zorunludur.
- `logs/agent/a10/incidents/`: Hard stop, yasak değişiklik veya build hatası gibi olayların detay kayıtları.

## 4. Run Log Alanları

Run seviyesinde zorunlu alanlar:

- `run_id`: Çalıştırmanın benzersiz kimliği (ör. tarih-saat + branch).
- `started_at`: Run başlangıç zamanı (ISO 8601 önerilir).
- `finished_at`: Run bitiş zamanı.
- `branch`: Çalıştırmanın yapıldığı git branch adı.
- `repo_path`: Depo mutlak yolu.
- `model`: Task üretiminde kullanılan model etiketi.
- `runner_version`: A10 runner/script sürümü.
- `task_count`: Planlanan toplam task sayısı.
- `success_count`: Başarıyla tamamlanan task sayısı.
- `soft_fail_count`: Soft fail ile sonuçlanan task sayısı.
- `hard_stop_count`: Hard stop nedeniyle duran task sayısı.
- `skipped_count`: Kural gereği atlanan task sayısı.
- `skip_valid_count`: Çıktı zaten valid olduğu için atlanan task sayısı.
- `skip_with_note_count`: Gerekçe notu ile bilinçli atlanan task sayısı.
- `timeout_count`: `TIMEOUT` statüsü ile kapanan task sayısı.
- `validation_fail_count`: `VALIDATION_FAIL` statüsü ile kapanan task sayısı.
- `build_fail_count`: `BUILD_FAIL` statüsü ile kapanan task sayısı.
- `forbidden_change_count`: `FORBIDDEN_CHANGE` statüsü ile kapanan task sayısı.
- `manual_review_required_count`: `MANUAL_REVIEW_REQUIRED` statüsü ile kapanan task sayısı.
- `final_status`: Run genel sonucu (`SUCCESS`, `PARTIAL`, `HARD_STOP`, `FAILED`).

## 5. Task Log Satırı Formatı

Zorunlu format:

`task_id | status | duration_sec | output_path | validator_result | retry_count | note`

Alan açıklamaları:

- `task_id`: Task kimliği (ör. `A10-T-003`).
- `status`: Task son durumu (`SUCCESS`, `SOFT_FAIL`, `HARD_STOP`, `SKIPPED`, `SKIP_VALID`, `SKIP_WITH_NOTE`, `TIMEOUT`, `VALIDATION_FAIL`, `BUILD_FAIL`, `FORBIDDEN_CHANGE`, `MANUAL_REVIEW_REQUIRED`).
- `duration_sec`: Task süresi (saniye, tam sayı).
- `output_path`: Üretilen çıktı dosyası; yoksa `-`.
- `validator_result`: Doğrulama sonucu kodu.
- `retry_count`: Bu task için yapılan retry sayısı.
- `note`: Kısa, denetlenebilir bağlam notu (neden/karar/istisna).

## 6. Incident Log Formatı

Hard stop / forbidden change / build failure olaylarında incident kaydı zorunludur.

Alanlar:

- `incident_id`: Olayın benzersiz kimliği.
- `task_id`: Olayın bağlı olduğu task.
- `incident_type`: Olay türü (`HARD_STOP`, `FORBIDDEN_CHANGE`, `BUILD_FAIL`).
- `detected_at`: Tespit zamanı.
- `reason`: Kısa teknik neden.
- `affected_files`: Etkilenen dosyalar listesi.
- `recommended_action`: Sonraki güvenli adım önerisi.
- `rollback_note`: Geri alma veya geri alma gereksizliği notu.

## 7. Validator Result Formatı

`validator_result` alanı aşağıdaki kodlardan biri olmalıdır:

- `OK`
- `OUTPUT_TOO_SHORT`
- `MISSING_MARKER`
- `FORBIDDEN_PATTERN`
- `FORBIDDEN_CHANGE`
- `BUILD_FAIL`
- `TIMEOUT_NO_OUTPUT`
- `MANUAL_REVIEW_REQUIRED`

Kısa örnekler:

- `OK`: Çıktı kural setini geçti.
- `OUTPUT_TOO_SHORT`: Minimum satır/karakter eşiği karşılanmadı.
- `MISSING_MARKER`: Zorunlu başlık/marker bulunamadı.
- `FORBIDDEN_PATTERN`: Yasak içerik deseni yakalandı.
- `FORBIDDEN_CHANGE`: İzin verilmeyen dosya/dizin değişikliği tespit edildi.
- `BUILD_FAIL`: İlgili doğrulama build aşamasında hata verdi.
- `TIMEOUT_NO_OUTPUT`: Süre doldu, geçerli çıktı üretilmedi.
- `MANUAL_REVIEW_REQUIRED`: Otomatik karar yerine insan onayı gerekiyor.

## 8. Örnek Log Satırları

Aşağıdaki örnekler task log formatındadır:

- `A10-T-001 | SUCCESS | 42 | docs/agent/a10/A10_LOG_SCHEMA.md | OK | 0 | docs görevi tek denemede tamamlandı`
- `A10-T-002 | SUCCESS | 95 | proposals/ui/button-spacing.patch.md | OK | 1 | CSS patch önerisi retry sonrası geçti`
- `A10-T-003 | SKIP_VALID | 3 | docs/agent/a10/A10_STATUS_CODES.md | OK | 0 | hedef çıktı zaten geçerli olduğu için task atlandı`
- `A10-T-004 | SOFT_FAIL | 28 | outputs/A10-T-004.md | OUTPUT_TOO_SHORT | 2 | çıktı uzunluğu eşik altı kaldı`
- `A10-T-005 | TIMEOUT | 300 | - | TIMEOUT_NO_OUTPUT | 1 | ajan çağrısı zaman aşımına uğradı`
- `A10-T-006 | SOFT_FAIL | 51 | outputs/A10-T-006.md | MISSING_MARKER | 1 | zorunlu "## Kabul Kriteri" başlığı yok`
- `A10-T-007 | HARD_STOP | 17 | - | FORBIDDEN_CHANGE | 0 | src/ altında izinsiz değişiklik denemesi`
- `A10-T-008 | BUILD_FAIL | 64 | - | BUILD_FAIL | 0 | doğrulama build adımı exit code 1 döndü`
- `A10-T-009 | SKIP_WITH_NOTE | 15 | - | MANUAL_REVIEW_REQUIRED | 1 | tekrar denemesi düşük değerli bulundu, sabah incelemeye bırakıldı`

Incident örnekleri:

- `INC-20260513-01 | A10-T-007 | FORBIDDEN_CHANGE | 2026-05-13T02:14:11+03:00 | src/ klasöründe değişiklik tespit edildi | src/ui/MainMenu.tsx | değişikliği geri al, taskı docs kapsamına çek | otomatik rollback yapılmadı, manuel doğrulama gerekli`
- `INC-20260513-02 | A10-T-008 | BUILD_FAIL | 2026-05-13T02:26:40+03:00 | npm run build başarısız | package-lock.json, src/game/engine.ts | build log analiz edilip task yeniden sınırlandırılsın | rollback gerekmiyor, çıktı üretilmedi`

## 9. Final Raporla İlişki

Sabah final raporu, doğrudan run ve task loglarından üretilir. Toplam task, başarı, soft fail, hard stop, skip ve manual review sayıları run özetindeki sayaçlarla birebir eşleşmelidir. Final raporda yer alan her problem maddesi, task satırı ve gerekiyorsa incident kaydı ile izlenebilir olmalıdır.

## 10. Kabul Kriteri

- Her task için tam bir final log satırı vardır.
- Her başarısızlık satırında açık bir neden bulunur.
- Her hard stop için incident kaydı vardır.
- Gizli/atlanmış başarısızlık yoktur.
- Final rapor toplamları task logları ile birebir tutarlıdır.
- Commit/push süreci manuel kalır; log sistemi otomatik commit/push yapmaz.
