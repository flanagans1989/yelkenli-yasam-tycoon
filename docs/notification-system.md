# Notification System — Current State

## Overview

The game uses a pattern of separate banner states for temporary notifications. Each notification has its own React state, dismiss effect, and absolutely-positioned CSS overlay.

---

## Current Notifications

| Name | State variable | CSS class | Position (top) | Trigger |
|---|---|---|---|---|
| Upgrade complete | `upgradeCompleteBannerText` | `.upgrade-complete-banner` | 14px | `completeUpgradeInstallation()` |
| Achievement unlocked | `achievementUnlockedBannerText` | `.achievement-unlocked-banner` | 84px | useEffect watching `achievementStatuses` |
| Sponsor offer | `sponsorOfferBannerText` | `.sponsor-offer-banner` | 154px | useEffect watching `sponsorOffers` |
| Content published | `contentPublishedBannerText` | `.content-published-banner` | 224px | `handleProduceContentV2()` |
| Voyage start | `voyageStartBannerText` | `.voyage-start-banner` | 294px | `handleStartVoyage()` |
| Sea decision result | `seaDecisionResultBannerText` | `.sea-decision-result-banner` | 364px | `handleResolveSeaDecision()` |

---

## Architecture

**Pattern:** 6 independent string states in App.tsx.

Each follows this pattern:

```tsx
// State
const [xBannerText, setXBannerText] = useState("");

// Dismiss effect
useEffect(() => {
  if (!xBannerText) return;
  const id = window.setTimeout(() => setXBannerText(""), 3500);
  return () => window.clearTimeout(id);
}, [xBannerText]);

// Render (in return JSX)
{xBannerText && (
  <div className="x-banner">
    <div className="x-title">Title</div>
    <div className="x-text">{xBannerText}</div>
  </div>
)}
```

---

## Known Behavior

- Each banner auto-dismisses after 3500ms.
- Banners are `position: absolute` within `.game-wrapper` at fixed y positions (70px apart).
- Banners do **not** visually overlap each other (different fixed positions).
- If all 6 trigger simultaneously, the stack reaches ~424px from the top, which overlays most game content on small screens — but this is extremely unlikely in normal gameplay.
- Each banner has its own color scheme to aid visual distinction.

---

## Known Risks

- App.tsx owns 6 separate state + effect pairs for notifications. This inflates file size and makes future additions require 3 additions per notification.
- If a new notification type is added, the developer must: add a state, add a useEffect, add JSX, add CSS, and calculate a new y position.
- Simultaneous notifications (e.g., content published + achievement unlocked) result in two visible banners at once. Currently safe and non-overlapping, but could feel cluttered.
- No notification priority or queue exists.

---

## Current Assessment

**Safe to leave as-is** for now. The system is functional, visually non-overlapping, and has no gameplay bugs. The main cost is code verbosity in App.tsx.

---

## Recommendation

Leave the current system in place. Refactor to a unified notification system in a future dedicated task.

See: `docs/notification-refactor-plan.md` for the planned refactor approach.
