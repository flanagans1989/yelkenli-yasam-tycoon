# Mobile Smoke Test Checklist

Developer-facing checklist for real-device or browser mobile testing after changes.

---

## Pre-Test

- [ ] `npm run build` passes with no errors
- [ ] Open on a mobile browser or emulated mobile (375px wide, Chrome DevTools)

---

## 1. New Game Start

- [ ] Main menu loads with ocean background
- [ ] "Yeni Oyun" starts onboarding
- [ ] Profile selection works
- [ ] Marina selection and filter work
- [ ] Boat selection works
- [ ] Boat name input works
- [ ] Finalizing starts the game at HUB

## 2. Profile / Marina / Boat Selection

- [ ] All profiles show skills and tagline correctly
- [ ] Marina filter (tümü / ege / akdeniz / atlantik / karadeniz) filters correctly
- [ ] Boat cards show name, length, cost, and SVG icon
- [ ] Selected items are visually highlighted

## 3. Produce Content

- [ ] İçerik tab loads cleanly
- [ ] Helper hint is visible but not dominant
- [ ] Platform selection works (4 platforms)
- [ ] Content type selection works
- [ ] "İçerik Üret" button enables only when both are selected
- [ ] Content result card shows quality score, followers gained, credits gained
- [ ] Cooldown timer appears after producing content
- [ ] "Yeni İçerik Üret" button resets the flow

## 4. See Content Published Notification

- [ ] Banner appears at top with "İçerik Yayınlandı!" title
- [ ] Banner includes follower gain and platform name
- [ ] Banner auto-dismisses after ~3.5 seconds

## 5. See Sponsor Progress

- [ ] Sponsor sub-tab shows brand trust, career card, and progress bar
- [ ] Progress bar fills relative to follower threshold
- [ ] Helper hint "Sponsorlar, içerik kariyerini..." is visible
- [ ] "Teklifleri Kontrol Et" button is present

## 6. Start Route

- [ ] Rota tab loads with current route name and risk badge
- [ ] "Yolculuk Notu" and "Rota Hissi" sections show route description and feeling
- [ ] Difficulty label is shown
- [ ] Readiness checklist shows current vs required stats
- [ ] "Rotaya Çık" button starts the voyage

## 7. See Voyage Start Briefing

- [ ] Banner appears with "Seyir Başladı!" title
- [ ] Banner includes route name and feeling
- [ ] Banner auto-dismisses after ~3.5 seconds
- [ ] Game switches to SEA_MODE view

## 8. Make Sea Decision

- [ ] "Gün İlerlet" button is available in sea mode
- [ ] Sea decision event appears with title, description, and two choices
- [ ] Choosing an option applies effects
- [ ] Current sea event text updates

## 9. See Decision Result Notification

- [ ] Banner appears with "Karar Uygulandı" title
- [ ] Banner includes choice label and effect summary (e.g., "+220 takipçi · +200 TL")
- [ ] Banner auto-dismisses after ~3.5 seconds

## 10. Complete Route

- [ ] Continue advancing days until remaining days reach 0
- [ ] Game transitions to ARRIVAL_SCREEN
- [ ] Arrival screen shows port name, reward credits, reward followers
- [ ] World tour milestone text updates based on progress
- [ ] "Limana Dön" button returns to HUB

## 11. See Arrival Summary

- [ ] Arrival screen shows route name, credits, followers
- [ ] Progress bar shows world tour completion percent
- [ ] Milestone text matches completion percentage

## 12. Start Upgrade

- [ ] Tekne tab loads with boat stats and ocean readiness bar
- [ ] Helper hint is visible
- [ ] Category pills filter upgrades correctly
- [ ] Incompatible upgrades show error badge
- [ ] "Satın Al" button deducts credits and starts installation timer
- [ ] Installation timer displays correctly

## 13. See Upgrade Completion Notification

- [ ] After install timer expires, banner appears with "Upgrade tamamlandı!" title
- [ ] Banner shows upgrade name
- [ ] Banner auto-dismisses

## 14. Unlock Achievement

- [ ] Complete enough actions to unlock an achievement (e.g., produce 1 content)
- [ ] Check Kaptan tab for achievement list

## 15. See Achievement Notification

- [ ] Banner appears with "Rozet Kazanıldı!" title
- [ ] Banner includes achievement name
- [ ] Banner auto-dismisses

## 16. Mobile Layout Check

- [ ] No horizontal scrolling on 375px width
- [ ] Bottom tab bar is fully visible and tappable
- [ ] All cards fit within screen without overflow
- [ ] Progress strip is readable
- [ ] Sponsor offer cards are readable (career line + reward line + accept button)

## 17. Notification Overlap Check

- [ ] If multiple notifications fire close together, they appear at different vertical positions
- [ ] Banners do not visually overlap each other
- [ ] All banners dismiss cleanly after 3.5 seconds

## 18. Final Build / Preflight

- [ ] `npm run build` still passes after all testing
- [ ] No TypeScript errors
- [ ] No console errors in browser during normal gameplay
