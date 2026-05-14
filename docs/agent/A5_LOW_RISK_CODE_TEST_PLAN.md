\# Agent Batch A5 — İlk Düşük Riskli Kod/CSS Test Planı



\## Amaç



Bu batch’in amacı lokal scriptli AI ajan sistemini ilk kez çok düşük riskli bir kod/CSS işiyle test etmektir.



Bu batch doğrudan oyun mantığını değiştirmez. Hedef, ajanın küçük ve sınırlı bir UI/CSS düzeltmesini yapıp build alabilecek hale gelip gelmediğini test etmektir.



\## Neden Önce Plan?



A4 docs-only otonom test başarıyla tamamlandı. Ancak kod değişikliğine geçmeden önce izinli dosyalar, yasak dosyalar, build kuralı ve durma koşulları netleşmelidir.



\## İlk Düşük Riskli Test Adayı



Önerilen ilk kod testi:



Ana menü / onboarding / küçük UI spacing düzeltmesi gibi yalnızca görsel etki yapan, oyun state veya ekonomi mantığına dokunmayan bir CSS polish işi.



\## İzinli Dosya Adayları



İlk gerçek kod testinde yalnızca şu tip dosyalara izin verilebilir:



\- src/App.css

\- veya tek bir component CSS/className düzeltmesi gerekiyorsa önceden açıkça seçilen tek component dosyası



\## Yasak Dosyalar



İlk düşük riskli kod testinde aşağıdaki dosyalara dokunulmaz:



\- src/App.tsx

\- package.json

\- package-lock.json

\- vite.config.ts

\- tsconfig.json

\- public/

\- index.html

\- save/load mantığı içeren dosyalar

\- route/sea mode/upgrade timer/sponsor ekonomi akışları



\## Korunacak Kritik Akışlar



Aşağıdaki sistemler kesinlikle değiştirilmemelidir:



\- save/load

\- autosave

\- advanceDay

\- handleArrival

\- handleStartVoyage

\- sea mode

\- route selection

\- upgrade timer

\- publishContent

\- handleProduceContentV2

\- handleCheckSponsorOffers

\- handleAcceptSponsor

\- sponsor economy

\- core money/follower economy

\- localStorage save structure



\## Build Kuralı



Kod veya CSS değişikliği yapılırsa script mutlaka şunu çalıştırmalıdır:



```powershell

npm run build

