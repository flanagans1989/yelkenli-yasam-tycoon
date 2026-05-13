# A10 Guardrails Checklist ve Hard Stop Matrisi

## 1. Amaç

Bu doküman, A10 gece vardiyası koşularında güvenlik sınırlarını netleştirmek, ihlalleri erken yakalamak ve gerektiğinde koşuyu kontrollü şekilde durdurmak için kullanılacak kontrol listesini ve karar matrislerini tanımlar. Hedef; hızdan önce izlenebilirlik, geri alınabilirlik ve güvenli değişiklik disiplinidir.

## 2. Guardrail Temel İlkesi

- Üretkenlikten önce güvenlik gelir; hızlı ama denetimsiz çıktı kabul edilmez.
- Ajan çıktısı doğrulama olmadan güvenilir sayılmaz; her çıktı validator ve kapsam kontrolünden geçer.
- İzinli kapsam açıkça yazılmalıdır; "varsayım" ile kapsam genişletilemez.
- Yasak değişiklik tespit edildiğinde run devam etmez; hard stop uygulanır.

## 3. Preflight Checklist

Run başlamadan önce aşağıdaki kontroller zorunludur:

- Repo yolu doğru mu: `C:\dev\yelkenli-yasam-tycoon`.
- Branch doğru mu: beklenen branch (`agent/day-01` gibi) ile eşleşiyor mu.
- Working tree temiz mi veya beklenen durumla uyumlu mu (önceden bilinen değişiklik listesi var mı).
- Gerekli A10 dokümanları mevcut mu:
  - `docs/agent/a10/A10_TASK_TEMPLATE.md`
  - `docs/agent/a10/A10_STATUS_CODES.md`
  - `docs/agent/a10/A10_RETRY_TIMEOUT_POLICY.md`
  - `docs/agent/a10/A10_LOG_SCHEMA.md`
- Model/ajan komutu erişilebilir mi (komut bulunuyor ve çağrılabiliyor mu).
- Log dizinleri erişilebilir mi: `logs/agent/a10/` ve alt klasörleri.
- Output dizini erişilebilir mi (task çıktılarının yazılacağı yol hazır mı).
- Beklenmeyen untracked dosya var mı; varsa run öncesi sınıflandırılıp not edildi mi.

## 4. Allowed Scope Checklist

Task türüne göre izinli kapsam açık seçik tanımlanır:

- `docs-only`
  - Yalnızca görevde belirtilen doküman yolu değişebilir.
  - `src/`, `scripts/`, paket dosyaları ve config dosyaları kapsam dışıdır.
- `css-patch-proposal`
  - Kod dosyası doğrudan değiştirilmez; yalnızca öneri/patch dokümanı üretilir.
  - Hedef dışı dosya yazımı yasaktır.
- `css-patch-apply`
  - Sadece onaylı CSS/ilgili stil dosyaları değişebilir.
  - Değişiklik listesi task başında açıkça yazılmalıdır.
- `script-only`
  - Yalnızca açıkça izin verilen script dosyaları değişebilir.
  - Doküman ve uygulama koduna dokunulmaz.
- `build-check`
  - Amaç doğrulama çalıştırmaktır; dosya değişikliği olmamalıdır.
  - Build çıktısı loglanır, kalıcı dosya üretimi sınırlandırılır.
- `audit/checklist`
  - Sadece rapor/checklist çıktısı üretilir.
  - Repo içeriğinde kapsam dışı düzenleme yapılmaz.

## 5. Forbidden Scope Checklist

Açık onay yoksa aşağıdakiler yasaktır:

- `src/App.tsx`
- `package.json`
- `package-lock.json`
- `node_modules`
- `dist`
- `public`
- Config dosyaları (`*.config.*`, `tsconfig*`, `vite.config.*` vb.)
- Gizli bilgileri içeren dosyalar (`.env*`, secret anahtar dosyaları)
- Task ile ilgisiz dokümanlar
- Mevcut A9R/A10 dosyaları (açık izin olmadıkça)

## 6. Hard Stop Matrix

| Trigger | Example | Detection method | Action | Rollback note |
| --- | --- | --- | --- | --- |
| forbidden file changed | `docs/agent/a10/A10_STATUS_CODES.md` izinsiz değişti | `git status --short` + izinli dosya listesi karşılaştırması | Run derhal durdurulur, incident açılır | İzin dışı dosya `git restore` ile geri alınır |
| package file changed | `package.json` değişti | package dosya watch listesi | Hard stop + incident | Değişiklik geri alınır, task yeniden sınırlandırılır |
| source file changed without permission | `src/game/*.ts` değişti | izinli scope denetimi | Hard stop | İzin yoksa tüm source değişiklikleri geri alınır |
| output outside allowed path | Çıktı `C:\tmp\...` yerine repo dışına yazıldı | output path whitelist kontrolü | Hard stop | Yetkisiz çıktı silinir, neden raporlanır |
| CSS forbidden pattern | `!important`/global override yasağına takılan patch | regex/pattern validator | Hard stop veya policy gereği blok | Patch uygulanmışsa geri alınır |
| build failure | `npm run build` exit code 1 | build exit code + log parse | Hard stop (zorunlu build taskında) | Kod/CSS değişikliği geri alınana kadar commit yok |
| wrong branch | `main` üzerinde run başladı | `git branch --show-current` | Run başlamadan durdur | Rollback gerekmez, doğru branch’e geçilir |
| unexpected new file | Beklenmeyen `tmp_notes.md` oluştu | untracked diff kontrolü | Hard stop veya manuel blok | Dosya sınıflandırılır; gereksizse silinir |
| agent asks for broad repo access | "Tüm repoyu düzenlemem gerek" talebi | prompt/output guardrail parser | Talep reddedilir, task durdurulur | Rollback yok; yetki genişletilmez |
| destructive command requested | `git reset --hard`, toplu silme talebi | komut güvenlik filtresi | Hard stop + manuel onay zorunlu | Komut çalıştırılmadı notu düşülür |
| missing final report | run bitti ama final rapor dosyası yok | run completion checklist | Hard stop benzeri kapanış blokajı | Rapor üretilmeden run kapatılmaz |
| validator script crashed | validator process exception verdi | process exit code/stderr | Hard stop, validator sorunu incident | Değişiklikler beklemeye alınır |
| repeated timeout | aynı task ardışık timeout sınırını aştı | retry/timeout sayaç kontrolü | Hard stop + manual review | Kısmi çıktılar güvenilmez kabul edilir |

## 7. Soft Fail Matrix

| Trigger | Example | Detection method | Action | Morning report note |
| --- | --- | --- | --- | --- |
| optional docs output too short | İsteğe bağlı not 5 satırda kaldı | min length validator | `SOFT_FAIL` ver, retry veya manuel genişletme | "Opsiyonel çıktı kısa" olarak işaretle |
| non-critical report missing | İkincil özet dosyası üretilmedi | expected optional output kontrolü | Run devam eder, task soft fail | "Kritik olmayan rapor eksik" notu düş |
| weak text quality | tekrar eden ve düşük netlikte metin | kalite kontrol checklisti | soft fail + yeniden üretim öner | "Metin kalitesi zayıf" |
| timeout on optional docs task | opsiyonel görevde süre aşıldı | timeout policy kontrolü | `SOFT_FAIL`, run devam | "Opsiyonel görev timeout" |
| duplicate/repetitive output | aynı paragraf çoklu tekrar | tekrar analizi/pattern check | soft fail + revizyon iste | "Tekrarlı çıktı" |
| skipped because output already valid | mevcut dosya zaten kabul kriterini sağlıyor | içerik hash/validator eşleşmesi | `SKIPPED` (başarısızlık değil) | "Mevcut çıktı geçerli, task atlandı" |

## 8. Manual Review Checklist

Koşu sonunda insan denetimi için:

- `git status` ve `git status --short` çıktısını incele.
- Değişen dosyaların task kapsamıyla uyumunu tek tek doğrula.
- Final raporda sayıların (success/soft fail/hard stop/skip) loglarla tutarlılığını kontrol et.
- Run/task/incident loglarını örneklemeli değil, tam kapsam gözden geçir.
- Kod veya CSS değiştiyse build çalıştır ve sonucu kaydet.
- Etkilenen UI alanlarını manuel test et (kritik ekran akışları dahil).
- Commit/rollback kararını insan verir; otomatik commit/push yapılmaz.

## 9. Rollback Checklist

- Docs-only rollback:
  - Yanlış doküman değişikliğinde ilgili dosya(lar) `git restore` ile geri alınır.
- CSS patch rollback:
  - Onaysız veya başarısız CSS değişikliği sadece etkilenen stil dosyalarında geri alınır.
- Script rollback:
  - Script görevinde oluşan yan etkiler temizlenir, script dosyası önceki hale döndürülür.
- Full batch rollback:
  - Kapsam ihlali yaygınsa batch boyunca yapılan tüm değişiklikler geri alınır.
- `git restore` ne zaman:
  - İzlenen dosyada izin dışı değişiklik varsa birincil yöntem olarak kullanılır.
- Untracked dosya silme ne zaman:
  - Sadece açıkça gereksiz/geçici olduğu doğrulanan ve task çıktısı olmayan dosyalar silinir.

## 10. Acceptance Criteria

- Hard stop olayları gizlenemez; her biri incident ve log kaydıyla görünürdür.
- Beklenmeyen her dosya oluşumu araştırılır ve sonucu notlanır.
- Değişen her dosya, task kapsamı içinde açıklanabilir olmalıdır.
- Kod/CSS değişikliği varsa build başarılı olmadan tamamlandı sayılmaz.
- Commit/push kararını insan verir; süreç manuel kalır.
