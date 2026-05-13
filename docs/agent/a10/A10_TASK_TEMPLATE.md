# A10 Gece Vardiyası Görev Kartı Şablonu

Bu belge, A10 gece vardiyasında kullanılacak standart görev kartı şablonunu tanımlar.

## Zorunlu Alanlar

### 1) Task ID
- Görevin benzersiz kimliği.
- Format önerisi: `A10-TASK-XXXX`

### 2) Batch ID
- Görevin bağlı olduğu parti (batch) kimliği.
- Format önerisi: `A10-BATCH-XX`

### 3) Title
- Görevin kısa ve açık başlığı.

### 4) Goal
- Görevin hedefi ve beklenen etkisi.

### 5) Task Type
- Görev sınıfı.
- Kanonik değerler: `docs-only`, `css-patch-proposal`, `css-patch-apply`, `script-only`, `build-check`, `audit/checklist`

### 6) Allowed Output File
- Çıktının yazılmasına izin verilen dosya(lar).
- Tek dosya kuralı varsa açıkça belirtilmelidir.

### 7) Allowed Input Context
- Ajanın okuyabileceği kaynakların sınırı.
- Örnek: `docs/`, belirli log özeti, belirli teknik notlar.

### 8) Forbidden Scope
- Dokunulması yasak alanlar.
- Örnek: `src/`, `scripts/`, `package*.json`, mevcut görev geçmişi dosyaları.

### 9) Agent Command Type
- Ajanın komut yürütme davranışı.
- Örnek değerler: `read-only`, `docs-write`, `proposal-only`

### 10) Validation Rule
- Görev tamamlanınca hangi doğrulama kuralının uygulanacağı.
- Örnek: dosya yolu doğrulaması, kapsam dışı değişiklik kontrolü.

### 11) Minimum Output Rule
- En düşük kabul edilebilir çıktı koşulu.
- Örnek: en az 1 başlık + 3 madde + 1 örnek.

### 12) Soft Fail Rule
- Görev kısmi yürütülemediğinde uygulanacak yumuşak hata kuralı.
- Örnek: veri eksikliği nedeniyle öneri seviyesinde kalma.

### 13) Hard Stop Rule
- Görevin derhal durdurulmasını gerektiren durumlar.
- Örnek: yasak kapsamda dosya değişikliği ihtiyacı.

### 14) Manual Review Requirement
- İnsan incelemesi gerekip gerekmediği ve hangi koşulda zorunlu olduğu.

### 15) Rollback Note
- Geri alma notu.
- Görev yanlış uygulanırsa nasıl geri dönüleceği kısa biçimde belirtilir.

### 16) Expected Commit Recommendation
- Beklenen commit yaklaşımı (öneri düzeyinde).
- Örnek: `docs: add A10 task card for batch X`

---

## Önerilen Kart Formatı

```md
Task ID: A10-TASK-0001
Batch ID: A10-BATCH-01
Title: Başlık
Goal: Amaç
Task Type: docs-only
Allowed Output File: docs/agent/a10/ORNEK.md
Allowed Input Context: docs/agent/a10/, decisions/
Forbidden Scope: src/, scripts/, package*.json
Agent Command Type: docs-write
Validation Rule: Sadece izinli dosya değişmiş olmalı
Minimum Output Rule: En az 5 madde ve 1 örnek içermeli
Soft Fail Rule: Eksik bağlamda SOFT_FAIL ve not düş
Hard Stop Rule: Yasak alana ihtiyaç varsa HARD_STOP
Manual Review Requirement: Kritik yönerge varsa zorunlu
Rollback Note: Dosyayı silerek geri al
Expected Commit Recommendation: docs: add A10 example card
```

---

## docs-only Görev Örneği

```md
Task ID: A10-TASK-0101
Batch ID: A10-BATCH-03
Title: A10 durum sözlüğünü güncelle
Goal: Durum kodlarının açıklamalarını netleştirmek
Task Type: docs-only
Allowed Output File: docs/agent/a10/A10_STATUS_CODES.md
Allowed Input Context: docs/agent/a10/
Forbidden Scope: src/, scripts/, package*.json
Agent Command Type: docs-write
Validation Rule: Tek dosya değişikliği kontrolü
Minimum Output Rule: Her kod için anlam + kullanım + örnek log
Soft Fail Rule: Kod listesi eksikse SOFT_FAIL
Hard Stop Rule: Ek dosya gereksinimi çıkarsa HARD_STOP
Manual Review Requirement: Kod tanımları değiştiyse evet
Rollback Note: İlgili md dosyasını önceki sürüme döndür
Expected Commit Recommendation: docs: refine A10 status code descriptions
```

## css-patch-proposal Görev Örneği

```md
Task ID: A10-TASK-0204
Batch ID: A10-BATCH-04
Title: Gece modu kontrast iyileştirme önerisi
Goal: Kontrast sorunlarını kod değiştirmeden önermek
Task Type: css-patch-proposal
Allowed Output File: docs/agent/a10/CSS_PATCH_PROPOSAL_0204.md
Allowed Input Context: ekran görüntüsü notu, mevcut stil rehberi
Forbidden Scope: src/, assets/, scripts/, package*.json
Agent Command Type: proposal-only
Validation Rule: Kod dosyasında değişiklik olmamalı
Minimum Output Rule: En az 3 öneri + etki/risk analizi
Soft Fail Rule: Tasarım girdisi yetersizse SOFT_FAIL
Hard Stop Rule: Doğrudan CSS değişikliği istenirse HARD_STOP
Manual Review Requirement: UI sahibi onayı zorunlu
Rollback Note: Öneri belgesi kaldırılarak geri alınır
Expected Commit Recommendation: docs: add css patch proposal for night contrast
```

---

## Kötü Görev Örnekleri

```md
Task ID: task1
Title: Bir şeyleri düzelt
Goal: Daha iyi olsun
Task Type: fix
```

Neden kötü:
- Belirsiz kimlik ve batch bağı yok.
- İzinli/yasak kapsam tanımlı değil.
- Doğrulama ve hata kuralları yok.

```md
Task ID: A10-TASK-0999
Batch ID: A10-BATCH-99
Title: Her yeri düzenle
Goal: Tüm projeyi toparla
Task Type: docs-only
Allowed Output File: *
Forbidden Scope: yok
```

Neden kötü:
- Kapsam aşırı geniş ve kontrolsüz.
- `docs-only` ile çelişen serbest çıktı tanımı var.
- Hard stop ve manuel inceleme şartı yok.

## İyi Görev Örnekleri

```md
Task ID: A10-TASK-0312
Batch ID: A10-BATCH-05
Title: A10 görev kartı söz dizimini standartlaştır
Goal: Kartların makine ve insan tarafından tutarlı okunması
Task Type: docs-only
Allowed Output File: docs/agent/a10/A10_TASK_TEMPLATE.md
Allowed Input Context: docs/agent/a10/
Forbidden Scope: src/, scripts/, package*.json, logs/
Agent Command Type: docs-write
Validation Rule: Sadece hedef md dosyası değişmeli
Minimum Output Rule: 16 alanın tamamı açıklanmalı
Soft Fail Rule: Eksik alan varsa SOFT_FAIL ve eksik listesi
Hard Stop Rule: Şablon dışı dosya ihtiyacı doğarsa HARD_STOP
Manual Review Requirement: Evet, yayın öncesi zorunlu
Rollback Note: Dosya geri alınarak önceki şablona dön
Expected Commit Recommendation: docs: standardize A10 task template
```

```md
Task ID: A10-TASK-0410
Batch ID: A10-BATCH-06
Title: Yasak kapsam denetim örnekleri yaz
Goal: Ajanların kapsam ihlalini erkenden yakalamak
Task Type: audit/checklist
Allowed Output File: docs/agent/a10/SCOPE_VALIDATION_NOTES.md
Allowed Input Context: docs/agent/a10/, errors_log özetleri
Forbidden Scope: src/, scripts/, package*.json, dist/
Agent Command Type: docs-write
Validation Rule: Forbidden path denetimi zorunlu
Minimum Output Rule: En az 5 ihlal senaryosu
Soft Fail Rule: Log erişimi yoksa SOFT_FAIL
Hard Stop Rule: Gerçek kod düzeltmesi istenirse HARD_STOP
Manual Review Requirement: Evet
Rollback Note: Not dosyasını kaldır
Expected Commit Recommendation: docs: add A10 scope validation notes
```
