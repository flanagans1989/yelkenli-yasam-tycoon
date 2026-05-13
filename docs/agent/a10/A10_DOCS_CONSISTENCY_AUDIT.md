# A10 Docs Consistency Audit

## Batch 7 Terminology Fix Applied

Batch 7 kapsamında terminoloji normalize edildi ve dokümanlar kanonik sözlüğe hizalandı.

Kanonik status kodları:
- SUCCESS
- SOFT_FAIL
- HARD_STOP
- SKIPPED
- SKIP_VALID
- SKIP_WITH_NOTE
- TIMEOUT
- VALIDATION_FAIL
- BUILD_FAIL
- FORBIDDEN_CHANGE
- MANUAL_REVIEW_REQUIRED

Kanonik task type seti:
- docs-only
- css-patch-proposal
- css-patch-apply
- script-only
- uild-check
- udit/checklist
## 1. Audit Amacı

Bu audit, A10 için mevcut altı dokümanın birbiriyle uyumunu, çelişkilerini, eksik kurallarını ve script implementasyonu öncesi hazır olma seviyesini değerlendirmek için hazırlanmıştır. Amaç, runner script planına geçmeden önce kavram setini ve karar akışlarını sabitlemektir.

## 2. İncelenen Dosyalar

- `docs/agent/a10/A10_TASK_TEMPLATE.md`
- `docs/agent/a10/A10_STATUS_CODES.md`
- `docs/agent/a10/A10_RETRY_TIMEOUT_POLICY.md`
- `docs/agent/a10/A10_LOG_SCHEMA.md`
- `docs/agent/a10/A10_GUARDRAILS_CHECKLIST.md`
- `docs/agent/a10/A10_NIGHT_SHIFT_FINAL_REPORT_TEMPLATE.md`

## 3. Genel Tutarlılık Sonucu

**Verdict: NEEDS_DOC_FIXES_FIRST**

Gerekçe:

- Çekirdek terimlerde adlandırma uyuşmazlığı var (`BUILD_FAIL` vs `BUILD_FAILED`, `MANUAL_REVIEW_REQUIRED` vs `MANUAL_REVIEW`).
- Durum kodları, log şeması ve final rapor sayaçları birebir map edilemiyor (`TIMEOUT`, `SKIP_WITH_NOTE`, `VALIDATION_FAIL` ekseninde).
- Görev tipi listesi dokümanlar arasında tam hizalı değil (`analysis-only`, `test-plan` sadece task template’te var).
- Hard stop mantığı güçlü ve büyük ölçüde tutarlı, ancak script planı için önce sözlük normalizasyonu gerekli.

## 4. Kavram Tutarlılığı Kontrolü

Aşağıdaki terimler için durum:

- `SUCCESS`: Tutarlı, tüm ilgili dokümanlarda karşılığı var.
- `SOFT_FAIL`: Tutarlı, status/policy/log/final report zincirinde karşılığı var.
- `HARD_STOP`: Tutarlı, status/policy/guardrails/log/final report ile uyumlu.
- `SKIPPED`: Tutarlı ama alt varyantlarla (SKIP_VALID/SKIP_WITH_NOTE) birlikte netleştirilmeli.
- `SKIP_VALID`: Status/policy/final report’ta var; log run alanlarında ayrı sayaç karşılığı yok.
- `TIMEOUT`: Status/final report’ta ayrı metrik; log şemasında task status olarak tanımlı değil, `TIMEOUT_NO_OUTPUT` validator sonucu olarak geçiyor.
- `VALIDATION_FAIL`: Status kodlarında var; log validator kod setinde birebir `VALIDATION_FAIL` yok (yerine alt kodlar var: `MISSING_MARKER`, `OUTPUT_TOO_SHORT` vb.).
- `BUILD_FAIL`: Status kodlarında var.
- `FORBIDDEN_CHANGE`: Tutarlı (status/policy/log/guardrails).
- `MANUAL_REVIEW_REQUIRED`: Status/final report/policy’de var; log task status alanında `MANUAL_REVIEW` kullanılmış.
- `SKIP_WITH_NOTE`: Retry policy’de var; status codes, log schema ve final report dağılım alanlarında açık karşılığı yok.

Not edilen açık farklar:

- `BUILD_FAIL` (status) vs `BUILD_FAILED` (log validator + incident_type) adlandırma çakışması.
- `MANUAL_REVIEW_REQUIRED` (status/final report) vs `MANUAL_REVIEW` (task log status) çakışması.
- `TIMEOUT` ayrı status gibi tanımlanmış, fakat task log status listesinde yok.
- `SKIP_WITH_NOTE` tek dokümanlı kavram kalmış (policy merkezli, diğerlerinde eksik).

## 5. Görev Tipi Tutarlılığı Kontrolü

Beklenen görev tipleri:

- `docs-only`: Tutarlı.
- `css-patch-proposal`: Tutarlı.
- `css-patch-apply`: Retry policy + guardrails’ta var; task template örnek setinde açıkça örneklenmiyor.
- `script-only`: Retry policy + guardrails’ta var; task template örnek setinde açık eşleşme zayıf.
- `build-check`: Retry policy + guardrails’ta var; task template örneklerinde zayıf.
- `audit/checklist`: Retry policy + guardrails’ta var; task template’te aynı adla yok.

Ek farklar:

- Task template içinde `analysis-only` ve `test-plan` var; diğer dokümanlarda standart görev tipi olarak taşınmıyor.

Sonuç:

- Görev tipi sözlüğü tek kaynakta normalize edilmeli; aksi halde script routing/timeout seçimi belirsiz kalır.

## 6. Hard Stop Kuralları Kontrolü

Genel uyum iyi:

- Forbidden file change, package değişikliği, izinsiz `src/` değişikliği, output path ihlali, build fail, yıkıcı komut, geniş repo erişim talebi, validator crash, repeated timeout tetikleyicileri policy ve guardrails arasında uyumlu.
- Log şeması incident alanları hard stop kayıtlaması için yeterli.
- Final rapor şablonu hard stop/incident alanını görünür ve ayrı tutuyor.

Düzeltilmesi gereken nokta:

- Build kaynaklı hard stop adı policy/status/log arasında tek kodda sabitlenmeli (`BUILD_FAIL` veya `BUILD_FAILED`, biri seçilmeli).

## 7. Soft Fail / Skip Kuralları Kontrolü

Kısmi uyum var:

- Soft fail senaryoları policy ve guardrails’ta pratik ve uyumlu.
- Final raporda soft fail ayrı alanla görünür.

Tutarsızlıklar:

- `SKIP_VALID` final raporda sayaç olarak var; log run alanlarında yok.
- `SKIP_WITH_NOTE` policy’de kritik bir çıkış kodu olarak var; status sözlüğünde açık bir status satırı ve log/final report sayacı yok.
- `TIMEOUT` bazen status, bazen validator sonucu, bazen soft fail nedeni olarak kullanılıyor.

## 8. Log ve Final Rapor Uyumu

Mevcut map kısmen mümkün, tam değil.

Uyumlu alanlar:

- `run_id` ↔ `Run ID`
- `started_at` / `finished_at` ↔ tarih/saat alanları
- `branch`, `repo_path`, `model`, `runner_version`, `task_count`, `final_status` ↔ run özeti
- Task satırı alanları (`task_id`, `status`, `output_path`, `validator_result`, `duration_sec`, `note`) ↔ görev sonuç tablosu

Eksik/uyumsuz alanlar:

- Final raporda `SKIP_VALID count` ve `TIMEOUT count` isteniyor; run log alanlarında karşılık yok.
- Final rapor `MANUAL_REVIEW_REQUIRED count` diyor; run log alanı `manual_review_count` (map olur), ama task status terimi logda `MANUAL_REVIEW` geçiyor.
- Final rapor soft fail listesinde retry bilgisi bekliyor; task log formatında `retry_count` var, bu uyumlu.

Sonuç:

- Script üretimi için alan eşlemesi yapılabilir ama sayaç/terim normalize edilmeden hata riski yüksek.

## 9. Eksik veya Belirsiz Noktalar

- Tekil ve resmi status enum listesi tek kaynaktan yönetilmiyor.
- `TIMEOUT`’un status mü yoksa validator/reason kodu mu olduğu net değil.
- `SKIP_WITH_NOTE` için log formatında ayrı alan/işaret kuralı tanımlı değil.
- Task type canonical listesi bir yerde sabit değil.
- Final rapordaki tüm dağılım metriklerinin run log’da nasıl hesaplanacağı tam yazılmamış.
- Incident `incident_type` ile status code sözlüğü arasında birebir eşleme tablosu yok.

## 10. Script’e Geçmeden Önce Gerekli Düzeltmeler

### Must fix before script

- Durum kodlarını normalize et: `BUILD_FAIL` vs `BUILD_FAILED` tekleştir.
- `MANUAL_REVIEW_REQUIRED` ve `MANUAL_REVIEW` adlarını tek status modelinde birleştir.
- `TIMEOUT` kullanımını sabitle: status/reason/validator rolü netleştir.
- `SKIP_WITH_NOTE` için status sözlüğü + log/final report karşılığı ekle veya kaldırıp alternatifini netleştir.
- Task type canonical listesi oluştur: altı tip (`docs-only`, `css-patch-proposal`, `css-patch-apply`, `script-only`, `build-check`, `audit/checklist`) tüm dokümanlarda aynı geçsin.
- Final rapor dağılımındaki tüm sayaçlar için run log alanlarıyla birebir mapping tanımla.

### Can fix later

- Task ID/Batch ID formatlarının tek regex ile dokümante edilmesi.
- Incident trigger kodlarının enum olarak ayrı kısa tabloya bağlanması.
- Soft fail neden kodlarının sınıflandırılması (serbest metin yerine kod+not).

### Optional polish

- Tüm dokümanlarda ortak bir “Terminoloji” bölümü.
- Örnek log satırlarında aynı task ID biçiminin kullanılması.
- Morning report mini örneğinin validator kodlarıyla zenginleştirilmesi.

## 11. A10 Batch 7 İçin Öneri

Öneri: **Batch 7’yi runner implementasyonu değil, docs/script-plan normalizasyon adımı** olarak planla.

Önerilen kapsam:

- Tek “A10 canonical enum + mapping” dokümanı üret.
- Status/task type/validator/incident/final-report sayaçlarının 1:1 eşlemesini tablo halinde sabitle.
- Ardından Batch 8’de runner script planına geç.

## 12. Net Karar

**Do A10 Docs Fix Batch first**

