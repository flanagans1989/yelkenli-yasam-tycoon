# A10 Night Shift Safe Queue 01

## 1. Queue Amacı

Bu kuyruk, A10 gece vardiyası için ilk güvenli başlangıç kuyruğudur ve yalnızca dokümantasyon çıktısı üretir. Kaynak kod, paket, oyun mantığı ve CSS uygulama değişikliği içermez.

## 2. Genel Güvenlik Kuralları

- kaynak kod düzenlemesi yok
- package dosyası düzenlemesi yok
- ileride açıkça planlanmadıkça script düzenlemesi yok
- otomatik commit/push yok
- bir görev = bir çıktı dosyası
- her görevde doğrulama zorunlu
- yasak değişiklikte hard stop

## 3. Queue Task List

### Task 01 — Branch Safety Check Plan

- Batch önerisi: Batch 8
- Task type: audit/checklist
- Goal: Branch doğrulama adımlarını standartlaştırmak ve yanlış branch riskini sıfıra indirmek.
- Allowed output file: docs/agent/a10/night-shift-01/T01_BRANCH_SAFETY_CHECK_PLAN.md
- Allowed input context: A10_GUARDRAILS_CHECKLIST.md, A10_STATUS_CODES.md
- Forbidden scope: src/**, scripts/**, package*.json, docs/agent/a10 dışı dosyalar
- Agent command type: read-only analysis + markdown output
- Validation rule: Branch kontrol adımları, fail koşulları ve örnek komutlar başlıklarla bulunmalı.
- Minimum output rule: En az 25 satır ve 3 kontrol adımı.
- Soft fail rule: İçerik kısa/eksikse SOFT_FAIL, aynı dosyada düzeltme notu ile tekrar üretim.
- Hard stop rule: Hedef çıktı yolu dışında dosya üretimi tespitinde HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 6 dk
- Risk level: Düşük
- Why this is safe: Sadece doküman üretir, kod tabanına yazmaz.
- Expected commit message: docs(a10): add branch safety check plan

### Task 02 — Clean Working Tree Preflight Plan

- Batch önerisi: Batch 8
- Task type: audit/checklist
- Goal: Çalıştırma öncesi temiz/beklenen working tree kontrol akışını tanımlamak.
- Allowed output file: docs/agent/a10/night-shift-01/T02_CLEAN_WORKING_TREE_PREFLIGHT_PLAN.md
- Allowed input context: A10_GUARDRAILS_CHECKLIST.md, A10_LOG_SCHEMA.md
- Forbidden scope: src/**, scripts/**, package*.json, logs/** üzerinde değişiklik
- Agent command type: read-only analysis + markdown output
- Validation rule: preflight check listesi, beklenen kirli durum örnekleri ve hard stop şartı yer almalı.
- Minimum output rule: En az 30 satır, en az 8 checklist maddesi.
- Soft fail rule: Checklist eksikse SOFT_FAIL ve tamamlanacak maddeler notlanır.
- Hard stop rule: Doküman dışı dosya yazımı veya mevcut dosya düzenlemesi HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 7 dk
- Risk level: Düşük
- Why this is safe: Salt prosedür metni üretir.
- Expected commit message: docs(a10): add clean working tree preflight plan

### Task 03 — Unexpected File Guard Plan

- Batch önerisi: Batch 8
- Task type: audit/checklist
- Goal: Beklenmeyen yeni dosya tespiti ve aksiyon karar ağacını yazmak.
- Allowed output file: docs/agent/a10/night-shift-01/T03_UNEXPECTED_FILE_GUARD_PLAN.md
- Allowed input context: A10_GUARDRAILS_CHECKLIST.md, A10_RETRY_TIMEOUT_POLICY.md
- Forbidden scope: src/**, scripts/**, package*.json, public/**, dist/**
- Agent command type: read-only analysis + markdown output
- Validation rule: Tespit yöntemi, sınıflandırma ve hard stop/soft fail ayrımı açık olmalı.
- Minimum output rule: En az 28 satır, en az 2 örnek senaryo.
- Soft fail rule: Senaryo sayısı yetersizse SOFT_FAIL.
- Hard stop rule: Yasak alanlara atıfla değişiklik önerisi yazılması HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 6 dk
- Risk level: Düşük
- Why this is safe: Operasyonel güvenlik dokümantasyonu üretir.
- Expected commit message: docs(a10): add unexpected file guard plan

### Task 05 — Dry-Run Final Report Improvement Plan

- Batch önerisi: Batch 8
- Task type: docs-only
- Goal: Dry-run final raporun daha hızlı sabah incelemesine uygun iyileştirme önerilerini sunmak.
- Allowed output file: docs/agent/a10/night-shift-01/T05_DRY_RUN_FINAL_REPORT_IMPROVEMENT_PLAN.md
- Allowed input context: A10_NIGHT_SHIFT_FINAL_REPORT_TEMPLATE.md, A10_LOG_SCHEMA.md
- Forbidden scope: src/**, scripts/**, package*.json, mevcut A10 dosyalarını düzenleme
- Agent command type: read-only analysis + markdown output
- Validation rule: Öneriler alan-bazlı olmalı ve mevcut şablonla eşleme içermeli.
- Minimum output rule: En az 35 satır, en az 5 net iyileştirme maddesi.
- Soft fail rule: Öneriler ölçülebilir değilse SOFT_FAIL.
- Hard stop rule: Şablon dosyasını değiştirmeye kalkışma HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 8 dk
- Risk level: Düşük
- Why this is safe: Sadece öneri dokümanı üretir.
- Expected commit message: docs(a10): add dry-run final report improvement plan

### Task 07 — Stop Reason Codes Plan

- Batch önerisi: Batch 8
- Task type: docs-only
- Goal: Stop reason kodlarının kullanım kuralını ve örneklerini standardize etmek.
- Allowed output file: docs/agent/a10/night-shift-01/T07_STOP_REASON_CODES_PLAN.md
- Allowed input context: A10_STATUS_CODES.md, A10_LOG_SCHEMA.md, A10_GUARDRAILS_CHECKLIST.md
- Forbidden scope: src/**, scripts/**, package*.json, mevcut status dokümanını düzenleme
- Agent command type: read-only analysis + markdown output
- Validation rule: Canonical kodlar, kullanım bağlamı ve yanlış kullanım örnekleri listelenmeli.
- Minimum output rule: En az 30 satır, en az 10 reason-code satırı.
- Soft fail rule: Kod/ad eşlemesi eksikse SOFT_FAIL.
- Hard stop rule: Canonical set dışı yeni resmi status önermek HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 7 dk
- Risk level: Düşük
- Why this is safe: Terim netliği sağlar, kodu etkilemez.
- Expected commit message: docs(a10): add stop reason codes plan

### Task 09 — Task Queue Schema v1

- Batch önerisi: Batch 8
- Task type: docs-only
- Goal: Gece kuyruğu görev kartları için v1 alan şemasını tanımlamak.
- Allowed output file: docs/agent/a10/night-shift-01/T09_TASK_QUEUE_SCHEMA_V1.md
- Allowed input context: A10_TASK_TEMPLATE.md, A10_LOG_SCHEMA.md, A10_STATUS_CODES.md
- Forbidden scope: src/**, scripts/**, package*.json, mevcut queue dosyalarını düzenleme
- Agent command type: read-only analysis + markdown output
- Validation rule: Zorunlu alanlar, alan tipi ve validasyon kuralları tabloyla verilmiş olmalı.
- Minimum output rule: En az 40 satır, en az 12 alan tanımı.
- Soft fail rule: Alan tipi/örnek eksikse SOFT_FAIL.
- Hard stop rule: Çıktı dosyası dışında dosya üretilirse HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 9 dk
- Risk level: Düşük
- Why this is safe: Veri sözleşmesi dokümanı üretir.
- Expected commit message: docs(a10): add task queue schema v1

### Task 10 — Task Card Validation Plan

- Batch önerisi: Batch 8
- Task type: audit/checklist
- Goal: Task card doğrulama adımlarını otomasyona hazır kontrol listesine dönüştürmek.
- Allowed output file: docs/agent/a10/night-shift-01/T10_TASK_CARD_VALIDATION_PLAN.md
- Allowed input context: A10_TASK_TEMPLATE.md, A10_GUARDRAILS_CHECKLIST.md, A10_DOCS_CONSISTENCY_AUDIT.md
- Forbidden scope: src/**, scripts/**, package*.json, config dosyaları
- Agent command type: read-only analysis + markdown output
- Validation rule: Her doğrulama kuralı için pass/fail kriteri yazılmalı.
- Minimum output rule: En az 32 satır, en az 10 kontrol maddesi.
- Soft fail rule: Pass/fail kriteri net değilse SOFT_FAIL.
- Hard stop rule: Script üretimi veya script değişikliği öneren çıktı HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 8 dk
- Risk level: Düşük
- Why this is safe: Sadece doğrulama planı dokümante eder.
- Expected commit message: docs(a10): add task card validation plan

### Task 14 — Single Output File Contract

- Batch önerisi: Batch 8
- Task type: docs-only
- Goal: "1 task = 1 output file" sözleşmesini örneklerle netleştirmek.
- Allowed output file: docs/agent/a10/night-shift-01/T14_SINGLE_OUTPUT_FILE_CONTRACT.md
- Allowed input context: A10_TASK_TEMPLATE.md, A10_LOG_SCHEMA.md, A10_STATUS_CODES.md
- Forbidden scope: src/**, scripts/**, package*.json, mevcut A10 sözleşme dosyalarını değiştirme
- Agent command type: read-only analysis + markdown output
- Validation rule: Sözleşme kuralı, ihlal örnekleri ve hard stop bağlantısı açık olmalı.
- Minimum output rule: En az 26 satır, en az 3 ihlal örneği.
- Soft fail rule: İhlal örnekleri yetersizse SOFT_FAIL.
- Hard stop rule: Çoklu output dosya öneren görev akışı HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 6 dk
- Risk level: Düşük
- Why this is safe: Sadece süreç kuralı metni üretir.
- Expected commit message: docs(a10): add single output file contract

### Task 17 — Final Report Sample v1

- Batch önerisi: Batch 8
- Task type: docs-only
- Goal: Güvenli docs-only gece vardiyası için kısa ama gerçekçi final rapor örneği üretmek.
- Allowed output file: docs/agent/a10/night-shift-01/T17_FINAL_REPORT_SAMPLE_V1.md
- Allowed input context: A10_NIGHT_SHIFT_FINAL_REPORT_TEMPLATE.md, A10_LOG_SCHEMA.md, A10_STATUS_CODES.md
- Forbidden scope: src/**, scripts/**, package*.json, build çıktıları
- Agent command type: read-only analysis + markdown output
- Validation rule: Şablon alanlarıyla uyumlu mini rapor bölümleri yer almalı.
- Minimum output rule: En az 30 satır, run özeti + durum dağılımı + karar alanı içermeli.
- Soft fail rule: Zorunlu alanlardan biri eksikse SOFT_FAIL.
- Hard stop rule: Hard stop olayını gizleyen/atlayan örnek üretimi HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 7 dk
- Risk level: Düşük
- Why this is safe: Örnek rapor metni üretir, sistemi değiştirmez.
- Expected commit message: docs(a10): add final report sample v1

### Task 21 — Evidence Checklist for Morning Review

- Batch önerisi: Batch 8
- Task type: audit/checklist
- Goal: Sabah incelemesinde commit/rollback kararı için kanıt checklist’i tanımlamak.
- Allowed output file: docs/agent/a10/night-shift-01/T21_EVIDENCE_CHECKLIST_FOR_MORNING_REVIEW.md
- Allowed input context: A10_LOG_SCHEMA.md, A10_GUARDRAILS_CHECKLIST.md, A10_NIGHT_SHIFT_FINAL_REPORT_TEMPLATE.md
- Forbidden scope: src/**, scripts/**, package*.json, mevcut log dosyaları üzerinde düzenleme
- Agent command type: read-only analysis + markdown output
- Validation rule: Kanıt türleri ve karar etkisi (commit/rollback/manual review) eşlemesi içermeli.
- Minimum output rule: En az 34 satır, en az 12 checklist maddesi.
- Soft fail rule: Karar etkisi sütunu eksikse SOFT_FAIL.
- Hard stop rule: Kanıtsız "SUCCESS" öneren metin HARD_STOP.
- Manual review requirement: Var
- Estimated runtime: 8 dk
- Risk level: Düşük
- Why this is safe: İnsan incelemesini güçlendiren doküman üretir.
- Expected commit message: docs(a10): add morning evidence checklist

## 4. Çalıştırma Sırası

1. Task 01 — Branch Safety Check Plan
2. Task 02 — Clean Working Tree Preflight Plan
3. Task 03 — Unexpected File Guard Plan
4. Task 14 — Single Output File Contract
5. Task 09 — Task Queue Schema v1
6. Task 10 — Task Card Validation Plan
7. Task 07 — Stop Reason Codes Plan
8. Task 05 — Dry-Run Final Report Improvement Plan
9. Task 17 — Final Report Sample v1
10. Task 21 — Evidence Checklist for Morning Review

## 5. Hard Stop Conditions for This Queue

- `docs/agent/a10/night-shift-01/` dışında çıktı üretimi
- herhangi bir `src/**` dosyasına dokunma girişimi
- herhangi bir `scripts/**` dosyasına dokunma girişimi
- `package.json` veya `package-lock.json` değişikliği
- mevcut A9R/A10 dosyalarını düzenleme girişimi
- otomatik commit/push komutu önerisi veya çalıştırma girişimi
- tek görevde birden fazla çıktı dosyası üretimi

## 6. Morning Review Checklist

- Her görev için tek çıktı dosyası var mı?
- Tüm dosyalar `docs/agent/a10/night-shift-01/` altında mı?
- Her görev kartında validation kuralı var mı?
- Soft fail ve hard stop kuralları yazılı mı?
- Yasak kapsam ihlali var mı?
- Final rapor örneği, log şemasıyla tutarlı mı?
- Commit/push kararı hâlâ manuel mi?

## 7. Queue Acceptance Criteria

- 10 görev listelenmiş olmalı
- her görev için tek output dosyası tanımlı olmalı
- tüm output’lar `docs/agent/a10/night-shift-01/` altında olmalı
- hiçbir görev source code’a dokunmamalı
- hiçbir görev package dosyasına dokunmamalı
- hiçbir görev build gerektirmemeli
- hiçbir görev commit/push içermemeli
- her görevde validation rule olmalı
- her görevde soft fail ve hard stop rule olmalı
