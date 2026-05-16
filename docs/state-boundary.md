# State Boundary (Persisted vs Transient)

Bu doküman, `src/App.tsx` içinde state sahipliğini netleştirir.

## Persisted State (Reducer / Save'e girer)

- Kaynak: `gameState` (`useReducer` + `gameReducer`)
- Persist mekanizması: `buildSaveSnapshot(gameState)` + `useAutoSave`
- Kural: Oyun ilerleyişini etkileyen kalıcı alanlar reducer içinde tutulur.

Örnek persisted alanlar:
- Ekonomi: `credits`, `tokens`, `followers`
- Oyun ilerleyişi: `step`, `activeTab`, `worldProgress`, `completedRouteIds`
- Kaynaklar: `energy`, `water`, `fuel`, `boatCondition`
- İçerik/sponsor/upgrade/captain alanları

## Transient UI State (Reducer dışı / Save'e girmez)

Bu alanlar yalnızca oturum içi UI davranışı içindir:

- Onboarding/UI geçici alanları:
  - `marinaFilter`
  - `onboardingMessage`
  - `memberPassword`
  - `hasSave`
  - `saveBoatName`
- Geçici efekt/animasyon:
  - `showMicoFarewell`
  - `showSailAnimation`
  - `contentCooldownTick`
  - `marinaRestCooldownTick`
- Modal/flow kontrolü:
  - `pendingUpgradeConfirmId`
  - `pendingWelcomeBackReward`
  - `comingFromRotaMissing`
  - `shouldOpenRotaReadiness`
  - `shouldOpenRoutePreparationGuide`
  - `tavsiyeDismissed`
- Geçici seçim/cache:
  - `recentSeaEventIds`
  - `lastUsedPlatformId`
  - `lastUsedContentType`
- Session-only gameplay flag:
  - `isPrestigeVoyage`

## Pratik Kural

Yeni state eklerken:

1. Oyun kapanıp açıldığında korunmalıysa reducer (`gameState`) içine ekle.
2. Sadece o anki ekran etkileşimi/animasyonu içinse `useState` içinde bırak.
3. `GAME/INITIALIZE` ve `GAME/LOAD` sonrası reducer state'ini setter zinciriyle tekrar yazma.
