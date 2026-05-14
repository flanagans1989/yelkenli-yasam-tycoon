# Yelkenli Yasam Tycoon Mobil Oyun Geliştirme Projesi Branch Güvenliği Kontrol Planı

## Branch Kontrol Adımları:

1. **Branch Doğrulama**
   - **Açıklama:** Gece vardiyası sırasında çalışacak olan branchların doğru olarak belirlenmesini kontrol edin.
   - **Kontrol Adımı:**
     ```
     git branch --show-current
     ```
   - **Fail Koşulu:** Eğer branch `agent/day-01` veya benzeri beklenen branch değilse, hata durumunu rapor edin.
   
2. **Working Tree Kontrolü**
   - **Açıklama:** Working tree'in temiz olup olmadığını ve belirlenen durumu uyumlu olup olmadığını kontrol edin.
   - **Kontrol Adımı:**
     ```
     git status
     ```
   - **Fail Koşulu:** Eğer değişiklikler veya filtrelenmiş dosyalar varsa, hata durumunu rapor edin.

3. **Necessary Dokümanların Varlığı Kontrolü**
   - **Açıklama:** Projenin çalışması için gerekli tüm dokümanların mevcut olup olmadığını kontrol edin.
   - **Kontrol Adımı:**
     ```
     ls docs/agent/a10/
     ```
   - **Fail Koşulu:** Eğer `docs/agent/a10/A10_TASK_TEMPLATE.md`, `docs/agent/a10/A10_STATUS_CODES.md` gibi belirtilen dokümanlar yoksa, hata durumunu rapor edin.

4. **Model/Ajan Komutu Erişimi Kontrolü**
   - **Açıklama:** Model veya ajan komutunun erişimini kontrol edin.
   - **Kontrol Adımı:**
     ```
     which model
     which agent_command
     ```
   - **Fail Koşulu:** Eğer `model` veya `agent_command` komutları bulunmuyorsa, hata durumunu rapor edin.

5. **Log Dizinleri Erişimi Kontrolü**
   - **Açıklama:** Log dizinlerinin erişimini kontrol edin.
   - **Kontrol Adımı:**
     ```
     ls logs/agent/a10/
     ```
   - **Fail Koşulu:** Eğer `logs/agent/a10/` dizini yoksa veya erişimimiz sağlanmıyorsa, hata durumunu rapor edin.

6. **Output Dizininin Hazırlığı Kontrolü**
   - **Açıklama:** Output dizininin hazır olup olmadığını kontrol edin.
   - **Kontrol Adımı:**
     ```
     ls docs/agent/a10/
     ```
   - **Fail Koşulu:** Eğer output dizini yoksa veya erişimimiz sağlanmıyorsa, hata durumunu rapor edin.

7. **Yasak kapsamın ayağlanması kontrolü:**
   - **Açıklama:** Yasak kapsam (src/**, scripts/**, package.json, package-lock.json, src/App.css, src/App.tsx) erişimi kısıtlamalı olmalıdır.
   - **Kontrol Adımı:**
     ```
     ls src/ scripts/ package.json package-lock.json src/App.css src/App.tsx
     ```
   - **Fail Koşulu:** Yasak kapsamın ayağlanması durumunda, hata durumunu rapor edin.

## Fail Durumları ve Ornek Komutlar:

1. **Branch Doğrulama Hatası**
   - **Örnek Komut:**
     ```
     [A10][HARD_STOP] task=branch-check reason=unexpected_branch
     ```

2. **Working Tree Kontrolü Hatası**
   - **Örnek Komut:**
     ```
     [A10][SOFT_FAIL] task=working-tree-check reason=unclean_working_tree
     ```

3. **Necessary Dokümanlar Hatası**
   - **Örnek Komut:**
     ```
     [A10][HARD_STOP] task=document-check reason=missing_documents
     ```

4. **Model/Ajan Komutu Erişimi Hatası**
   - **Örnek Komut:**
     ```
     [A10][HARD_STOP] task=model-access-check reason=command_not_found
     ```

5. **Log Dizinleri Erişimi Hatası**
   - **Örnek Komut:**
     ```
     [A10][SOFT_FAIL] task=log-directory-check reason=directory_access_denied
     ```

6. **Output Dizininin Hazırlığı Hatası**
   - **Örnek Komut:**
     ```
     [A10][HARD_STOP] task=output-directory-check reason=directory_not_found
     ```

7. **Yasak kapsamın ayağlanması Hatası**
   - **Örnek Komut:**
     ```
     [A10][HARD_STOP] task=forbidden-scope-access-check reason=access_to_forbidden_scope
     ```