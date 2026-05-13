# A10 Gece Vardiyas? G?rev Kart? ?ablonu - Task 14: Single Output File Contract

## Zorunlu Alanlar

### 1) Task ID
- **Format:** `A10-TASK-XXXX`
- **Örnek:** `A10-TASK-1234`

### 2) Batch ID
- **Format:** `A10-BATCH-XX`
- **Örnek:** `A10-BATCH-01`

### 3) Title
- **Görevin kısa ve açık ba?l???**
- **Örnek:** "Single Output File Contract"

### 4) Goal
- **Görevin hedefi ve beklenen etkisi**
- **Örnek:** "Bir görevin bir çıktı dosyası sözleşmesini örneklerle netleştirme"

### 5) Task Type
- **Görev türü**
- **Kanonik değerler: `docs-only`**
- **Örnek:** `docs-only`

### 6) Allowed Output File
- **İzin verilen dosya(lar)**
- **Tek dosya kuralı varsa a?ka belirtilmelidir.**
- **Örnek:** `docs/agent/a10/night-shift-01/T14_SINGLE_OUTPUT_FILE_CONTRACT.md`

### 7) Allowed Input Context
- **Ajanın okuyabileceği kaynaklar?n s?n?r?**
- **Örnek:** `docs/`, belirli log ?zeti, belirli teknik notlar

### 8) Forbidden Scope
- **Dokunulmas? yasak alanlar**
- **Örnek:** `src/**`, `scripts/**`, `package.json`, `package-lock.json`, `src/App.css`, `src/App.tsx`

### 9) Agent Command Type
- **Ajanın komut y?r?tme davran???**
- **Örnek de?erler: `read-only`**
- **Örnek:** `read-only`

### 10) Validation Rule
- **Görev tamamlan?nca hangi do?rulama kural?n?n uygulanaca??**
- **Örnek:** dosya yolu do?rulamas?, kapsam d??? de?i?iklik kontrol?

### 11) Minimum Output Rule
- **En az d???k kabul edilebilir ??kt? ko?ulu**
- **Örnek:** en az 1 ba?l?k + 3 madde + 1 ?rnek

### 12) Soft Fail Rule
- **Görev k?smi y?r?t?lemedi?inde uygulanacak yumu?ak hata kural?**
- **Örnek:** veri eksikli?i nedeniyle ?neri seviyesinde kalma

## İhlal Örnekleri ve Hard Stop Bağlantısı

1. **İhlal Örneği 1: Yanlış Task ID Formatı**
   - **Özellikler:** Task ID, `A10-TASK-XXXX` formatına uygun değil.
   - **Hata Mesajı:** `[A10][HARD_STOP] task=A10-TASK-0123 reason=invalid_task_id_format`
   - **Açıklama:** Task ID'nin doğru formatta olması gerekmektedir.

2. **İhlal Örneği 2: Yasak Kapsam**
   - **Özellikler:** `src/App.css` dosyasına yazma yetkisi verilmiştir.
   - **Hata Mesajı:** `[A10][HARD_STOP] task=A10-TASK-0123 reason=forbidden_scope_required`
   - **Açıklama:** Task, yasak kapsam alanlarına (src/**, scripts/**) yazma yetkisi verilmemelidir.

3. **İhlal Örneği 3: Dosya Adı Yanlış**
   - **Özellikler:** Oluşturulan dosya adı `T14_SINGLE_OUTPUT_FILE_CONTRACT.md` yerine `T14_Single_Output_File_Contract.md` şeklindedir.
   - **Hata Mesajı:** `[A10][HARD_STOP] task=A10-TASK-0123 reason=incorrect_filename`
   - **Açıklama:** Dosya adı küçük harf ile yazılmalıdır.

## Sonuç

Bu görev, bir görevin bir çıktı dosyası sözleşmesini örneklerle netleştirme konusunda yardımcı olacaktır. Bu, özellikle teknik belgeleri ve protokollerde kullanılabilir. Herhangi bir ihlal veya sorun olduğunda, uygun hata mesajı ve neden verilmelidir.