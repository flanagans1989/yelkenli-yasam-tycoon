# A10 Gece Vardiyası Final Rapor Şablonu

## 1. Rapor Amacı

Bu rapor, kullanıcının sabah ilk okuyacağı ana karar belgesidir. Hızlı incelenebilir kadar kısa olmalı, ancak commit / rollback / manuel inceleme kararı verebilmek için yeterli kanıtı içermelidir. Rapor; sonuç, risk ve önerilen aksiyonu tek bakışta göstermelidir.

## 2. Run Özeti

Aşağıdaki alanlar zorunludur:

- `Run ID`:
- `Date / time started`:
- `Date / time finished`:
- `Branch`:
- `Repo path`:
- `Model / agent`:
- `Runner version`:
- `Total tasks`:
- `Final status`:

## 3. Durum Dağılımı

| Metrik | Değer |
| --- | --- |
| SUCCESS count |  |
| SOFT_FAIL count |  |
| HARD_STOP count |  |
| SKIPPED count |  |
| SKIP_VALID count |  |
| SKIP_WITH_NOTE count |  |
| TIMEOUT count |  |
| MANUAL_REVIEW_REQUIRED count |  |

Not: Bu tablo, task log toplamları ile birebir eşleşmelidir.
Ek not: `BUILD_FAIL`, `FORBIDDEN_CHANGE` ve `VALIDATION_FAIL` durumları görev sonuç tablosunda ayrı status olarak görünmeli; `HARD_STOP` üst-kategori bilgisini gizlememelidir.

## 4. Değişen Dosyalar

| File path | Change type | Related task ID | Reason | Review priority |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Kural: Tabloda yer almayan hiçbir değişiklik commit değerlendirmesine girmemelidir.

## 5. Görev Sonuçları

| Task ID | Title | Status | Output file | Validation result | Duration | Notes |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

Kural: Her task için tek bir final satırı olmalıdır.

## 6. Soft Fail Listesi

Soft fail kayıtları ayrı listelenir ve run’ı otomatik durdurmaz. Bu alanın amacı, kritik olmayan ama kalite/eksiklik içeren durumları görünür tutmaktır.

Önerilen format:

- `Task ID`:
- `Soft fail nedeni`:
- `Retry sayısı`:
- `Sabah aksiyon önerisi`:

Örnek nedenler: kısa çıktı, opsiyonel rapor eksikliği, tekrar eden metin, opsiyonel task timeout.

## 7. Hard Stop / Incident Alanı

Aşağıdaki alanlar incident başına zorunludur:

- `Incident ID`:
- `Task ID`:
- `Trigger`:
- `Reason`:
- `Affected files`:
- `Recommended action`:
- `Rollback note`:

Kural: Hard stop hiçbir koşulda özet satırına gizlenemez; ayrı incident kaydı şarttır.

## 8. Build / Test Sonucu

Aşağıdaki alanlar zorunludur:

- `Was build run?`:
- `Build command`:
- `Build status`:
- `Build log path`:
- `Manual test required?`:
- `Manual test checklist path`:

Not: Kod/CSS değiştiyse build bilgisi boş bırakılamaz.

## 9. Manuel İnceleme Checklist’i

- [ ] `git status` kontrol edildi.
- [ ] Değişen dosyalar task kapsamı ile karşılaştırıldı.
- [ ] Final rapor sayıları task loglarıyla doğrulandı.
- [ ] Run/task/incident logları incelendi.
- [ ] Build sonucu doğrulandı.
- [ ] CSS değiştiyse UI smoke test yapıldı.
- [ ] Rollback gereksinimi değerlendirildi.
- [ ] Commit kararı insan tarafından verildi.

## 10. Commit Önerisi

- `recommended commit message`:
- `files recommended for commit`:
- `files excluded from commit`:
- `reason`:

Kural: Bu bölüm öneridir; commit/push otomatik yapılmaz.

## 11. Rollback Planı

- `docs-only rollback`:
  - Doküman değişiklikleri için ilgili dosyaları `git restore` ile geri al.
- `CSS patch rollback`:
  - Yalnızca etkilenen CSS/stil dosyalarını geri al, ardından smoke test tekrar et.
- `script rollback`:
  - Script değişikliğini geri al, yan etkileri (üretilen geçici dosyalar) temizle.
- `full batch rollback`:
  - Batch içindeki tüm izinli değişiklikleri toplu geri al, incident notu düş.
- `when to use git restore`:
  - İzlenen dosyada istenmeyen veya izin dışı değişiklik varsa.
- `when to delete untracked files`:
  - Sadece geçici/yanlış üretilmiş ve gerekli olmadığı doğrulanmış untracked dosyalarda.

## 12. Sabah Karar Alanı

- [ ] Commit accepted
- [ ] Manual test needed
- [ ] Partial rollback needed
- [ ] Full rollback needed
- [ ] Continue with next batch
- [ ] Stop and review with ChatGPT

## 13. Örnek Mini Final Rapor

Aşağıdaki mini örnek, başarılı bir docs-only gece vardiyası için kısa referanstır:

- `Run ID`: `A10-RUN-2026-05-13-001`
- `Date / time started`: `2026-05-13 01:10 +03:00`
- `Date / time finished`: `2026-05-13 01:24 +03:00`
- `Branch`: `agent/day-01`
- `Repo path`: `C:\dev\yelkenli-yasam-tycoon`
- `Model / agent`: `gpt-5-codex`
- `Runner version`: `a10-runner v0.4.0`
- `Total tasks`: `3`
- `Final status`: `SUCCESS`

Durum dağılımı:

- `SUCCESS`: `3`
- `SOFT_FAIL`: `0`
- `HARD_STOP`: `0`
- `SKIPPED`: `0`
- `SKIP_VALID`: `0`
- `SKIP_WITH_NOTE`: `0`
- `TIMEOUT`: `0`
- `MANUAL_REVIEW_REQUIRED`: `0`

Görev sonuç özeti:

- `A10-T-201 | A10_LOG_SCHEMA.md güncellemesi | SUCCESS | docs/agent/a10/A10_LOG_SCHEMA.md | OK | 46s | tek denemede tamamlandı`
- `A10-T-202 | Guardrails checklist | SUCCESS | docs/agent/a10/A10_GUARDRAILS_CHECKLIST.md | OK | 58s | kapsam ihlali yok`
- `A10-T-203 | Final report template | SUCCESS | docs/agent/a10/A10_NIGHT_SHIFT_FINAL_REPORT_TEMPLATE.md | OK | 41s | format doğrulandı`

Commit önerisi:

- `recommended commit message`: `docs(a10): add night shift final report template`
- `files recommended for commit`: `docs/agent/a10/A10_NIGHT_SHIFT_FINAL_REPORT_TEMPLATE.md`
- `files excluded from commit`: `-`
- `reason`: `Sadece docs-only kapsamındaki hedef dosya üretildi; hard stop ve soft fail yok.`

---

Kabul notu:

- Bu şablon commit vs rollback kararını hızlandıracak kanıt alanlarını zorunlu tutar.
- Hard stop kayıtları ayrı ve görünürdür.
- Soft fail kayıtları ayrıştırılmıştır.
- Commit/push manuel zorunluluk olarak korunur.
- Hem insan incelemesine hem script üretimine uygun sabit alanlar içerir.
