# iOS Capacitor Build Yolu

Bu proje icin iOS native klasoru `ios/` altinda Capacitor ile uretilir ve guncellenir.

## Senkronizasyon

Web varliklarini iOS projesine kopyalamak icin:

```bash
npm run mobile:sync:ios
```

Alternatif olarak dogrudan:

```bash
npx cap sync ios
```

## Xcode ile acma

macOS uzerinde proje kokunden su dosyayi ac:

```bash
npx cap open ios
```

Elle acmak istersen Xcode proje yolu:

```text
ios/App/App.xcodeproj
```

## Build kontrolu

1. Xcode icinde `App` target'ini sec.
2. Bir simulator veya bagli cihaz sec.
3. `Product > Build` ile derleme kontrolu yap.
4. Gerekirse `Product > Run` ile uygulamayi simulator uzerinde baslat.

## Notlar

- Bu Windows ortaminda `cap add ios` ve `cap sync ios` calistirildi.
- Xcode build dogrulamasi yalnizca macOS + Xcode ortaminda tamamlanabilir.
- Web tarafinda degisiklikten sonra yeniden `npm run mobile:sync:ios` calistir.
