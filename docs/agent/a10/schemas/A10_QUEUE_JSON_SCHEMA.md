# A10 Queue JSON Schema

## 1. Amaç

Bu şema, A10 gece vardiyası çalıştırmaları için makine tarafından okunabilir görev kuyruğu formatını tanımlar.

## 2. Neden JSON?

- Markdown insan için okunabilir olsa da parse tarafında kırılgan olabilir.
- JSON, PowerShell içinde `ConvertFrom-Json` ile doğal ve doğrudan kullanılabilir.
- JSON, görev doğrulamasını deterministik hale getirir.

## 3. Üst Seviye JSON Alanları

- `queue_id`
  - type: `string`
  - required?: `evet`
  - meaning: Kuyruğun benzersiz kimliği.
- `queue_title`
  - type: `string`
  - required?: `evet`
  - meaning: Kuyruğun insan tarafından okunur adı.
- `version`
  - type: `string`
  - required?: `evet`
  - meaning: Kuyruk format/sürüm bilgisi.
- `created_for_branch`
  - type: `string`
  - required?: `evet`
  - meaning: Kuyruğun hedeflediği branch.
- `safety_level`
  - type: `string`
  - required?: `evet`
  - meaning: Kuyruğun güvenlik sınıfı.
- `purpose`
  - type: `string`
  - required?: `evet`
  - meaning: Kuyruğun operasyonel amacı.
- `global_rules`
  - type: `array[string]`
  - required?: `evet`
  - meaning: Kuyruk genelinde geçerli güvenlik/işletim kuralları.
- `tasks`
  - type: `array[object]`
  - required?: `evet`
  - meaning: Çalıştırılacak görev kartları listesi.
- `acceptance_criteria`
  - type: `array[string]`
  - required?: `evet`
  - meaning: Kuyruğun tamamlanma/kabul kriterleri.

## 4. Task Alanları

- `task_id`
  - type: `string`
  - required?: `evet`
  - meaning: Görevin kimliği (örn. `Task 01`).
- `title`
  - type: `string`
  - required?: `evet`
  - meaning: Görev başlığı.
- `batch_suggestion`
  - type: `string`
  - required?: `evet`
  - meaning: Önerilen batch bilgisi.
- `task_type`
  - type: `string`
  - required?: `evet`
  - meaning: Canonical görev tipi.
- `goal`
  - type: `string`
  - required?: `evet`
  - meaning: Görevin beklenen çıktısının amacı.
- `allowed_output_file`
  - type: `string`
  - required?: `evet`
  - meaning: Tek izinli çıktı dosya yolu.
- `allowed_input_context`
  - type: `array[string]`
  - required?: `evet`
  - meaning: Görevin okuyabileceği bağlam dosyaları.
- `forbidden_scope`
  - type: `array[string]`
  - required?: `evet`
  - meaning: Dokunulması yasak dosya/klasör kapsamı.
- `agent_command_type`
  - type: `string`
  - required?: `evet`
  - meaning: Ajanın komut çalışma tipi.
- `validation_rule`
  - type: `string`
  - required?: `evet`
  - meaning: Görev çıktısı için doğrulama kuralı.
- `minimum_output_rule`
  - type: `string`
  - required?: `evet`
  - meaning: Minimum içerik/kalite şartı.
- `soft_fail_rule`
  - type: `string`
  - required?: `evet`
  - meaning: Soft fail durumunda izlenecek kural.
- `hard_stop_rule`
  - type: `string`
  - required?: `evet`
  - meaning: Hard stop tetikleyen ihlal kuralı.
- `manual_review_requirement`
  - type: `string`
  - required?: `evet`
  - meaning: Manuel inceleme gereksinimi.
- `estimated_runtime`
  - type: `string`
  - required?: `evet`
  - meaning: Tahmini çalışma süresi.
- `risk_level`
  - type: `string`
  - required?: `evet`
  - meaning: Risk seviyesi.
- `why_this_is_safe`
  - type: `string`
  - required?: `evet`
  - meaning: Görevin neden güvenli olduğunun kısa açıklaması.
- `expected_commit_message`
  - type: `string`
  - required?: `evet`
  - meaning: Sabah manuel commit için önerilen mesaj.

## 5. Canonical Task Types

- `docs-only`
- `css-patch-proposal`
- `css-patch-apply`
- `script-only`
- `build-check`
- `audit/checklist`

## 6. Canonical Status Codes

- `SUCCESS`
- `SOFT_FAIL`
- `HARD_STOP`
- `SKIPPED`
- `SKIP_VALID`
- `SKIP_WITH_NOTE`
- `TIMEOUT`
- `VALIDATION_FAIL`
- `BUILD_FAIL`
- `FORBIDDEN_CHANGE`
- `MANUAL_REVIEW_REQUIRED`

## 7. Validation Rules

- Kuyruk, `tasks` adında bir dizi içermelidir.
- Her görev tam olarak bir `allowed_output_file` tanımlamalıdır.
- `allowed_output_file` yolu `docs/agent/a10/night-shift-01/` altında olmalıdır.
- Hiçbir görev `src`, `scripts`, package dosyaları, `App.css` veya `App.tsx` hedefleyemez.
- Hiçbir görev commit/push isteyemez.
- Her görevde `validation_rule`, `soft_fail_rule`, `hard_stop_rule` zorunludur.

## 8. Example JSON Snippet

```json
{
  "task_id": "Task 01",
  "title": "Branch Safety Check Plan",
  "batch_suggestion": "Batch 8",
  "task_type": "audit/checklist",
  "goal": "Branch doğrulama adımlarını standartlaştırmak.",
  "allowed_output_file": "docs/agent/a10/night-shift-01/T01_BRANCH_SAFETY_CHECK_PLAN.md",
  "allowed_input_context": [
    "docs/agent/a10/A10_GUARDRAILS_CHECKLIST.md",
    "docs/agent/a10/A10_STATUS_CODES.md"
  ],
  "forbidden_scope": [
    "src/**",
    "scripts/**",
    "package.json",
    "package-lock.json",
    "src/App.css",
    "src/App.tsx"
  ],
  "agent_command_type": "read-only analysis + markdown output",
  "validation_rule": "Branch kontrol adımları ve fail koşulları başlıklarla bulunmalı.",
  "minimum_output_rule": "En az 25 satır.",
  "soft_fail_rule": "İçerik kısa/eksikse SOFT_FAIL.",
  "hard_stop_rule": "Hedef çıktı dışına yazım HARD_STOP.",
  "manual_review_requirement": "Var",
  "estimated_runtime": "6 dk",
  "risk_level": "Düşük",
  "why_this_is_safe": "Sadece dokümantasyon üretir.",
  "expected_commit_message": "docs(a10): add branch safety check plan"
}
```
