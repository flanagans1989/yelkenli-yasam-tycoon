# Notification Refactor Plan

## Goal

Replace the current 6 separate banner states with a single, shared notification area.

This plan is NOT yet implemented. It is a reference for when the refactor is scheduled.

---

## Current Problem

Each notification type requires:
1. A separate `string` state in App.tsx
2. A separate `useEffect` for auto-dismiss
3. A separate `div` in JSX
4. A separate CSS class with a fixed `top` position

Adding a new notification type costs ~25 lines across App.tsx and App.css.

---

## Proposed New Type

```typescript
type ActiveNotification = {
  id: string;          // unique per fire (e.g. Date.now().toString())
  title: string;
  text: string;
  timeoutMs?: number;  // default 3500
};
```

---

## Proposed New State

Replace all 6 banner states with:

```typescript
const [activeNotification, setActiveNotification] = useState<ActiveNotification | null>(null);
```

And one shared dismiss effect:

```typescript
useEffect(() => {
  if (!activeNotification) return;
  const id = window.setTimeout(
    () => setActiveNotification(null),
    activeNotification.timeoutMs ?? 3500
  );
  return () => window.clearTimeout(id);
}, [activeNotification?.id]);
```

---

## Proposed Render

One shared notification banner area at the top:

```tsx
{activeNotification && (
  <div className="notification-banner" role="status" aria-live="polite">
    <div className="notification-title">{activeNotification.title}</div>
    <div className="notification-text">{activeNotification.text}</div>
  </div>
)}
```

---

## Migration Strategy (safe, gradual)

Convert one notification at a time. Run `npm run build` and smoke test after each conversion.

### Order of conversion:

1. `voyageStartBannerText` → `setActiveNotification({ title: "Seyir Başladı!", text: ... })`
2. `contentPublishedBannerText` → same pattern
3. `upgradeCompleteBannerText` → same pattern
4. `sponsorOfferBannerText` → same pattern
5. `achievementUnlockedBannerText` → same pattern
6. `seaDecisionResultBannerText` → same pattern

Each conversion: remove the old state, remove the old useEffect, remove the old JSX, update the setter call site.

---

## CSS Changes

Replace individual `.x-banner` / `.x-title` / `.x-text` classes with:

```css
.notification-banner {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 30;
  /* shared visual style */
}
.notification-title { ... }
.notification-text { ... }
```

Individual color theming per notification type can be done via a `data-type` attribute if needed.

---

## Rules for the Refactor Task

- Do not change notification visuals and gameplay behavior in the same commit.
- Convert one notification type at a time, committing after each.
- Run smoke test (see `docs/smoke-test.md`) after all conversions are complete.
- Do not change notification text content during refactor.
- Do not add new notifications during refactor.

---

## When to Schedule

This refactor is safe when:
- App.tsx is otherwise stable.
- No other large feature is in progress.
- A full smoke test pass is possible after the refactor.
