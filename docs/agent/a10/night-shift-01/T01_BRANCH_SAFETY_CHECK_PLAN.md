# T01 Branch Safety Check Plan

## 1. AmaÃ§
Bu belge A10 Batch 9 deterministic placeholder execution Ã§Ä±ktÄ±sÄ±dÄ±r.
AmaÃ§, gece koÅŸusunda branch gÃ¼venliÄŸini tek gÃ¶revlik kontrollÃ¼ adÄ±mla doÄŸrulamaktÄ±r.

## 2. Kontrol Edilecek Åeyler
Aktif branch adÄ± kesin olarak agent/day-01 olmalÄ±dÄ±r.
Repo yolu doÄŸrulanmalÄ± ve .git klasÃ¶rÃ¼ mevcut olmalÄ±dÄ±r.
GÃ¶rev sadece docs kapsamÄ±ndadÄ±r; kaynak kod alanlarÄ± kapsam dÄ±ÅŸÄ±dÄ±r.

## 3. BaÅŸarÄ±lÄ± Durum
Branch agent/day-01 ise kontrol baÅŸarÄ±lÄ± kabul edilir.
Queue iÃ§indeki Task 01 allowed_output_file deÄŸeri sabit hedefle eÅŸleÅŸmelidir.
Ã‡Ä±ktÄ± dosyasÄ± tek dosya olarak yazÄ±lÄ±r ve doÄŸrulama kurallarÄ±nÄ± karÅŸÄ±lar.

## 4. Hata DurumlarÄ±
Branch farklÄ±ysa iÅŸlem derhal baÅŸarÄ±sÄ±z olur.
Task 01 queue iÃ§inde bulunamazsa Ã§alÄ±ÅŸma durdurulur.
Ã‡Ä±ktÄ± yolu beklenen deÄŸerden farklÄ±ysa hard stop uygulanÄ±r.

## 5. Hard Stop KurallarÄ±
YanlÄ±ÅŸ branch hard stop sebebidir.
Kaynak kod veya package deÄŸiÅŸikliÄŸi bu gÃ¶revde yasaktÄ±r.
No source/package changes are allowed in this controlled execution step.
Beklenmeyen output path veya Ã§oklu gÃ¶rev denemesi hard stop sebebidir.

## 6. Sabah Ä°nceleme Notu
KullanÄ±cÄ± sabah yalnÄ±zca log ve final raporu Ã¼zerinden karar verir.
Manual commit/push zorunluluÄŸu devam eder.
Bu Ã§Ä±ktÄ± gerÃ§ek AI Ã¼retimi deÄŸil, deterministic A10 Batch 9 placeholder execution Ã¶rneÄŸidir.
