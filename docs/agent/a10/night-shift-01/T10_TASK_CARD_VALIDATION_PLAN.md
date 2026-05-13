# Task Card Validation Plan

## 1. Genel Hedef

Bu kontrollerle A10 gece vardiyas? g?rev kart? do?rulama adimlar?n? otomasyonlu bir yoldan yapmaya uygun kontrol listesi olu?turmak.

## 2. Task ID Kontrolü
- **Pass/Fail Kriteri**: Task ID format? i?in (`A10-TASK-XXXX`) ve benzersizlik kontrol edilmeli.
- **Kontrol Maddesi**: `Task ID` alan?n? kontrol etmek.

## 3. Batch ID Kontrolü
- **Pass/Fail Kriteri**: Batch ID format? i?in (`A10-BATCH-XX`) ve benzersizlik kontrol edilmeli.
- **Kontrol Maddesi**: `Batch ID` alan?n? kontrol etmek.

## 4. Title Kontrolü
- **Pass/Fail Kriteri**: Task k?sas?? a??k ba?l??? olmalı ve en az bir kelime içermelidir.
- **Kontrol Maddesi**: `Title` alan?n? kontrol etmek.

## 5. Goal Kontrolü
- **Pass/Fail Kriteri**: Task hedefi belirli olmalı ve beklenen etkisi açıklayıcı olmalı.
- **Kontrol Maddesi**: `Goal` alan?n? kontrol etmek.

## 6. Task Type Kontrolü
- **Pass/Fail Kriteri**: Geçerli kanonik de?erlerden biri olmalı (`docs-only`, `css-patch-proposal`, `css-patch-apply`, `script-only`, `build-check`, `audit/checklist`).
- **Kontrol Maddesi**: `Task Type` alan?n? kontrol etmek.

## 7. Allowed Output File Kontrolü
- **Pass/Fail Kriteri**: Belirtilen dosya yolu ve formatta olmalı.
- **Kontrol Maddesi**: `Allowed Output File` alan?n? kontrol etmek.

## 8. Allowed Input Context Kontrolü
- **Pass/Fail Kriteri**: Belirtilen kaynaklar s?n?r?s? içinde olmalı.
- **Kontrol Maddesi**: `Allowed Input Context` alan?n? kontrol etmek.

## 9. Forbidden Scope Kontrolü
- **Pass/Fail Kriteri**: Yasak kapsam listesinde belirtilmeyen alanlar olmalı.
- **Kontrol Maddesi**: `Forbidden Scope` alan?n? kontrol etmek.

## 10. Agent Command Type Kontrolü
- **Pass/Fail Kriteri**: Geçerli kanonik de?erlerden biri olmalı (`read-only`, `docs-write`, `proposal-only`).
- **Kontrol Maddesi**: `Agent Command Type` alan?n? kontrol etmek.

## 11. Validation Rule Kontrolü
- **Pass/Fail Kriteri**: Geçerli kanonik de?erlerden biri olmalı (`dosya yolu do?rulamas?, kapsam d??? de?i?iklik kontrol?`).
- **Kontrol Maddesi**: `Validation Rule` alan?n? kontrol etmek.

## 12. Minimum Output Rule Kontrolü
- **Pass/Fail Kriteri**: En az 1 ba?l?k + 3 madde + 1 ?rnek olmalı.
- **Kontrol Maddesi**: `Minimum Output Rule` alan?n? kontrol etmek.

## 13. Soft Fail Rule Kontrolü
- **Pass/Fail Kriteri**: G?rev k?smi y?r?t?lemedi?inde uygulanacak yumu?ak hata kural? olmalı.
- **Kontrol Maddesi**: `Soft Fail Rule` alan?n? kontrol etmek.

## 14. Task ID Format Kontrolü
- **Pass/Fail Kriteri**: Task ID format? i?in (`A10-TASK-XXXX`) ve benzersizlik kontrol edilmeli.
- **Kontrol Maddesi**: `Task ID` alan?n? kontrol etmek.

## 15. Batch ID Format Kontrolü
- **Pass/Fail Kriteri**: Batch ID format? i?in (`A10-BATCH-XX`) ve benzersizlik kontrol edilmeli.
- **Kontrol Maddesi**: `Batch ID` alan?n? kontrol etmek.

## 16. Title Length Kontrolü
- **Pass/Fail Kriteri**: Task k?sas?? en az bir kelime içermelidir.
- **Kontrol Maddesi**: `Title` alan?n? kontrol etmek.

## 17. Goal Clarity Kontrolü
- **Pass/Fail Kriteri**: Task hedefi belirli olmalı ve beklenen etkisi açıklayıcı olmalı.
- **Kontrol Maddesi**: `Goal` alan?n? kontrol etmek.

## 18. Task Type Validity Kontrolü
- **Pass/Fail Kriteri**: Geçerli kanonik de?erlerden biri olmalı (`docs-only`, `css-patch-proposal`, `css-patch-apply`, `script-only`, `build-check`, `audit/checklist`).
- **Kontrol Maddesi**: `Task Type` alan?n? kontrol etmek.

## 19. Allowed Output File Format Kontrolü
- **Pass/Fail Kriteri**: Belirtilen dosya yolu ve formatta olmalı.
- **Kontrol Maddesi**: `Allowed Output File` alan?n? kontrol etmek.

## 20. Allowed Input Context Scope Kontrolü
- **Pass/Fail Kriteri**: Belirtilen kaynaklar s?n?r?s? içinde olmalı.
- **Kontrol Maddesi**: `Allowed Input Context` alan?n? kontrol etmek.

## 21. Forbidden Scope Validity Kontrolü
- **Pass/Fail Kriteri**: Yasak kapsam listesinde belirtilmeyen alanlar olmalı.
- **Kontrol Maddesi**: `Forbidden Scope` alan?n? kontrol etmek.

## 22. Agent Command Type Validity Kontrolü
- **Pass/Fail Kriteri**: Geçerli kanonik de?erlerden biri olmalı (`read-only`, `docs-write`, `proposal-only`).
- **Kontrol Maddesi**: `Agent Command Type` alan?n? kontrol etmek.

## 23. Validation Rule Validity Kontrolü
- **Pass/Fail Kriteri**: Geçerli kanonik de?erlerden biri olmalı (`dosya yolu do?rulamas?, kapsam d??? de?i?iklik kontrol?`).
- **Kontrol Maddesi**: `Validation Rule` alan?n? kontrol etmek.

## 24. Minimum Output Rule Validity Kontrolü
- **Pass/Fail Kriteri**: En az 1 ba?l?k + 3 madde + 1 ?rnek olmalı.
- **Kontrol Maddesi**: `Minimum Output Rule` alan?n? kontrol etmek.

## 25. Soft Fail Rule Validity Kontrolü
- **Pass/Fail Kriteri**: G?rev k?smi y?r?t?lemedi?inde uygulanacak yumu?ak hata kural? olmalı.
- **Kontrol Maddesi**: `Soft Fail Rule` alan?n? kontrol etmek.

## 26. Task ID Uniqueness Kontrolü
- **Pass/Fail Kriteri**: Task ID benzersiz olmalı ve aynen kullanılmış olan bir Task ID tekrarlanmamalıdır.
- **Kontrol Maddesi**: `Task ID` alan?n? kontrol etmek.

## 27. Batch ID Uniqueness Kontrolü
- **Pass/Fail Kriteri**: Batch ID benzersiz olmalı ve aynen kullanılmış olan bir Batch ID tekrarlanmamalıdır.
- **Kontrol Maddesi**: `Batch ID` alan?n? kontrol etmek.

## 28. Title Specificity Kontrolü
- **Pass/Fail Kriteri**: Task k?sas?? daha spesifik ve belirli olmalı.
- **Kontrol Maddesi**: `Title` alan?n? kontrol etmek.

## 29. Goal Achievability Kontrolü
- **Pass/Fail Kriteri**: Task hedefinin elde edilebilir olması gerekmeli.
- **Kontrol Maddesi**: `Goal` alan?n? kontrol etmek.

## 30. Task Type Applicability Kontrolü
- **Pass/Fail Kriteri**: Belirtilen task tipi belirli bir durumda uygun olmalı.
- **Kontrol Maddesi**: `Task Type` alan?n? kontrol etmek.

## 31. Allowed Output File Relevance Kontrolü
- **Pass/Fail Kriteri**: Belirtilen dosya, taskin sonuçlarını içermeli ve ilgili format olmalı.
- **Kontrol Maddesi**: `Allowed Output File` alan?n? kontrol etmek.

## 32. Allowed Input Context Relevance Kontrolü
- **Pass/Fail Kriteri**: Belirtilen kaynaklar taskin gerektirdiği bilgiyi içermeli ve ilgili format olmalı.
- **Kontrol Maddesi**: `Allowed Input Context` alan?n? kontrol etmek.

## 33. Forbidden Scope Accuracy Kontrolü
- **Pass/Fail Kriteri**: Yasak kapsam listesi doğru bir şekilde tanımlanmış olmalı.
- **Kontrol Maddesi**: `Forbidden Scope` alan?n? kontrol etmek.

## 34. Agent Command Type Efficiency Kontrolü
- **Pass/Fail Kriteri**: Geçerli kanonik de?erlerden biri olmalı (`read-only`, `docs-write`, `proposal-only`) ve taskin gereksinimlerine uygun olmalı.
- **Kontrol Maddesi**: `Agent Command Type` alan?n? kontrol etmek.

## 35. Validation Rule Accuracy Kontrolü
- **Pass/Fail Kriteri**: Geçerli kanonik de?erlerden biri olmalı (`dosya yolu do?rulamas?, kapsam d??? de?i?iklik kontrol?`) ve taskin gereksinimlerine uygun olmalı.
- **Kontrol Maddesi**: `Validation Rule` alan?n? kontrol etmek.

## 36. Minimum Output Rule Specificity Kontrolü
- **Pass/Fail Kriteri**: En az 1 ba?l?k + 3 madde + 1 ?rnek olmalı ve taskin ihtiyaçlarına uygun olmalı.
- **Kontrol Maddesi**: `Minimum Output Rule` alan?n? kontrol etmek.

## 37. Soft Fail Rule Relevance Kontrolü
- **Pass/Fail Kriteri**: G?rev k?smi y?r?t?lemedi?inde uygulanacak yumu?ak hata kural?, taskin gereksinimlerine uygun olmalı.
- **Kontrol Maddesi**: `Soft Fail Rule` alan?n? kontrol etmek.

## 38. Task ID Format Consistency Kontrolü
- **Pass/Fail Kriteri**: Tüm tasklar için benzer format kullanılmalı.
- **Kontrol Maddesi**: `Task ID` alan?n? kontrol etmek.

## 39. Batch ID Format Consistency Kontrolü
- **Pass/Fail Kriteri**: Tüm batchlar için benzer format kullanılmalı.
- **Kontrol Maddesi**: `Batch ID` alan?n? kontrol etmek.

## 40. Title Length Consistency Kontrolü
- **Pass/Fail Kriteri**: Tüm tasklar için en az bir kelime içermeli.
- **Kontrol Maddesi**: `Title` alan?n? kontrol etmek.

Bu kontrol listesi, A10 gece vardiyas? g?rev kart? do?rulama adimlar?n? otomasyonlu olarak kontrol etmek için kullanılabilecek bir yol sunmaktadır.