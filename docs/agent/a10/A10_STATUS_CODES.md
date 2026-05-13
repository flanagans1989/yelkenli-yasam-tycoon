# A10 Durum Kodları

Bu belge, A10 görev yürütümünde kullanılacak standart durum kodlarını tanımlar.

## SUCCESS
- Meaning: Görev tanımlı kapsamda başarıyla tamamlandı.
- When used: Tüm doğrulama kuralları geçtiğinde ve yasak değişiklik yoksa.
- Should batch continue?: Evet.
- Should human review?: Genelde hayır; politika gerektiriyorsa evet.
- Example log line: `[A10][SUCCESS] task=A10-TASK-0101 output=docs/agent/a10/A10_STATUS_CODES.md`

## SOFT_FAIL
- Meaning: Görev tamamlanamadı ama sistemsel/kritik ihlal oluşmadı.
- When used: Girdi eksikliği, belirsiz bağlam veya kısmi engel durumlarında.
- Should batch continue?: Evet, sonraki görev denenebilir.
- Should human review?: Evet, sebep analizi için önerilir.
- Example log line: `[A10][SOFT_FAIL] task=A10-TASK-0204 reason=insufficient_context`

## HARD_STOP
- Meaning: Görev derhal durdurulmalı; devam etmek riskli veya kurala aykırı.
- When used: Yasak kapsam zorunluluğu, güvenlik/politika ihlali, kritik çelişki.
- Should batch continue?: Hayır, batch durmalı.
- Should human review?: Evet, zorunlu.
- Example log line: `[A10][HARD_STOP] task=A10-TASK-0312 reason=forbidden_scope_required`

## SKIPPED
- Meaning: Görev bilinçli olarak atlandı.
- When used: Önkoşul sağlanmadığında veya görev artık geçersiz olduğunda.
- Should batch continue?: Evet.
- Should human review?: Duruma bağlı; çoğunlukla evet.
- Example log line: `[A10][SKIPPED] task=A10-TASK-0410 reason=prerequisite_missing`

## SKIP_VALID
- Meaning: Atlama kararı doğrulama kurallarına göre geçerli.
- When used: Hedef çıktı zaten mevcutsa ve doğrulama kontrollerini geçiyorsa.
- Should batch continue?: Evet.
- Should human review?: Genelde hayır.
- Example log line: `[A10][SKIP_VALID] task=A10-TASK-0410 reason=output_already_valid`

## SKIP_WITH_NOTE
- Meaning: Görev bilinçli olarak atlandı ve risk/gerekçe notu zorunlu yazıldı.
- When used: Tekrarlayan düşük değerli retry, desteklenmeyen görev tipi veya tekrar denemesi anlamlı olmayan durumlarda.
- Should batch continue?: Evet.
- Should human review?: Evet, sabah raporunda not üzerinden.
- Example log line: `[A10][SKIP_WITH_NOTE] task=A10-TASK-0520 reason=low_value_retry note=kept_for_morning_review`

## TIMEOUT
- Meaning: Görev ayrılan sürede tamamlanamadı.
- When used: Komut/işlem süre sınırını aştığında.
- Should batch continue?: Duruma bağlı; varsayılan evet ama yeniden planlama gerekir.
- Should human review?: Evet, tekrarlayan timeout varsa zorunlu.
- Example log line: `[A10][TIMEOUT] task=A10-TASK-0503 limit=900s`

## VALIDATION_FAIL
- Meaning: Çıktı üretildi ancak doğrulama başarısız oldu.
- When used: Biçim, kapsam, içerik veya kural kontrolleri geçmediğinde.
- Should batch continue?: Genelde evet, fakat aynı tip hatada durdurma değerlendirilmeli.
- Should human review?: Evet.
- Example log line: `[A10][VALIDATION_FAIL] task=A10-TASK-0101 rule=single_output_file`

## BUILD_FAIL
- Meaning: Derleme/çalıştırma doğrulaması başarısız oldu.
- When used: Görev akışında build adımı varsa ve hata dönerse.
- Should batch continue?: Genelde hayır, bağımlı görevler için risklidir.
- Should human review?: Evet.
- Example log line: `[A10][BUILD_FAIL] task=A10-TASK-0602 step=build error=tsc_exit_2`

## FORBIDDEN_CHANGE
- Meaning: Yasak alanda değişiklik tespit edildi.
- When used: Görev kartındaki Forbidden Scope ihlal edildiğinde.
- Should batch continue?: Hayır.
- Should human review?: Evet, zorunlu.
- Example log line: `[A10][FORBIDDEN_CHANGE] task=A10-TASK-0204 path=src/ui/theme.css`

## MANUAL_REVIEW_REQUIRED
- Meaning: Otomasyon tamamlandı ancak insan onayı olmadan kapatılamaz.
- When used: Politika, risk veya iş kuralı gereği manuel kontrol şart olduğunda.
- Should batch continue?: Evet, ama bu görev "tamamlandı" sayılmaz.
- Should human review?: Evet, zorunlu.
- Example log line: `[A10][MANUAL_REVIEW_REQUIRED] task=A10-TASK-0312 reviewer=ui-owner`
