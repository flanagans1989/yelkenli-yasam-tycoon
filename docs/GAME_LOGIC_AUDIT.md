# Yelkenli Yaşam Tycoon — Game Logic Audit

> Purpose: This document defines the invariants the game must satisfy before ship-ready changes are accepted.

---

## 1. Route Progression Rules

### 1.1 All Routes Must Have Requirements
Every `WorldRoute` in `WORLD_ROUTES` must include a `requirements` object with at least:
- `minSafety`
- `minNavigation`
- `minEnergy`
- `minWater`
- `minMaintenance`

### 1.2 Route Order Must Be Contiguous
Routes must remain ordered `1..N` with no gaps.

### 1.3 Total Pool Must Be Satisfiable
For every required stat, the total upgrade pool must be able to meet or exceed the highest route requirement.

### 1.4 Phase Access Must Also Be Satisfiable
The audit now checks route phases, not just global totals.

Expected access ladder:
- Route 1–3: `any` marina upgrades must be enough.
- Route 4–7: `any + medium` upgrades must be enough.
- Route 8–9: `any + medium + large` upgrades must be enough.
- Route 10+: late/ocean upgrades may be required.

### 1.5 Maintenance Must Have Buffer
`Bakım / maintenance` should not sit on exact impossible edges. Early and mid routes must have reachable maintenance headroom beyond the exact requirement.

---

## 2. Upgrade Progression Rules

### 2.1 Each Required Stat Needs Real Providers
If a route requires a stat, at least one upgrade must provide that stat.

### 2.2 Important Categories Need Early Access
Categories that gate early routes must have at least one `marinaRequirement: "any"` card.

### 2.3 Upgrade Ladder Must Exist
Core route-gating stats should follow a reachable ladder:
- `any`
- `medium`
- `large`
- `shipyard/ocean`

### 2.4 Readiness Target Categories Must Be Useful
If the Route screen sends the player to a category for a missing stat, that category must contain useful upgrades for that stat at the relevant phase.

This is especially important for:
- `Bakım` → must point to a category with reachable maintenance upgrades
- `Enerji`
- `Su`
- `Güvenlik`
- `Navigasyon`

---

## 3. Category Coverage Rules

The following categories must continue to exist:

| Category ID | Main Stat Role |
|---|---|
| `hull_maintenance` | `maintenance` |
| `engine_mechanical` | `maintenance` secondary |
| `safety` | `safety` |
| `navigation` | `navigation` |
| `energy` | `energy` |
| `water_life` | `water` |
| `sail_speed` | speed / support |
| `comfort` | support |
| `content_equipment` | content |
| `auxiliary_seamanship` | mixed support |

---

## 4. Sea Event Classification Rules

### 4.1 Priority Order
`getEventCategory()` must check in this order:
1. `opportunity`
2. `technical`
3. `danger`
4. `neutral`

This prevents false danger matches such as `kazandırır` containing `kaza`.

### 4.2 Critical Event Expectations
- `content_opportunity` must be `opportunity`
- `technical_noise` must be `technical`
- `equipment_loose` must be `technical`
- `mild_storm_signs` must be `danger`
- `fuel_stop` must be `technical`
- `sudden_wind_shift` must be `neutral`

---

## 5. Save/Load Compatibility Rules

### 5.1 Required Save Discipline
All new persisted fields must:
1. be added to `saveObj`
2. load with a safe `?? defaultValue` fallback

### 5.2 Known Tracked Fields

| Field | Type | Default | Required Fallback |
|---|---|---|---|
| `firstVoyageEventTriggered` | `boolean` | `false` | `?? false` |
| `testMode` | `boolean` | `false` | `?? false` |
| `hasReceivedFirstSponsor` | `boolean` | `false` | `?? false` |
| `activeStoryHook` | `object \| null` | `null` | `?? null` |

---

## 6. First Voyage Event Rules

### 6.1 Guaranteed Teaching Event
The first voyage must always show `content_opportunity` before the route can complete.

### 6.2 One-Time Safety
`firstVoyageEventTriggered` must:
- guard the forced event
- be set immediately when the forced event is queued
- persist with `?? false`

---

## 7. Encoding / Mojibake Audit

Turkish text and emoji integrity are mandatory.

### Rules
- Mojibake sequences must fail audit.
- Turkish letters are valid.
- Suspicious broken sequences are not valid.

Examples that must fail:
- broken UTF-8 Turkish text such as a mis-decoded `Gün`
- broken UTF-8 uppercase `İ`
- mis-decoded arrows or emoji sequences
- suspicious emoji mojibake prefixes such as the common broken `g`-prefixed emoji bytes
- replacement artifacts such as the Unicode replacement character

### Commands
- `npm run audit:encoding`
- `npm run audit:game`

---

## 8. Manual QA Checklist

### Route / Upgrade
- [ ] Open Route tab and confirm requirements render cleanly.
- [ ] If requirements are missing, CTA should clearly say the player must complete missing work first.
- [ ] Tap a missing requirement and confirm it opens a useful upgrade category.
- [ ] Confirm `Bakım` has a visible reachable solution when a route is short on maintenance.

### Sea Mode
- [ ] Fresh save → first route → first `Bir Gün İlerle` shows `content_opportunity`.
- [ ] Resource chips show clean icons and labels with no mojibake.
- [ ] Resolve the first event once and confirm it does not loop.

### Arrival / Story Hook
- [ ] Finish route → Arrival screen shows rewards.
- [ ] Primary CTA remains `Marinaya Giriş Yap`.
- [ ] After entering marina, Content tab shows the `Yolculuk Hikâyesi` card ready.

### Encoding
- [ ] No broken Turkish characters or emoji appear in Sea Mode, Route, Arrival, or Tekne screens.

---

## 9. Mobile UI Consistency Checklist

- [ ] `390x667` is a required manual smoke-test size.
- [ ] Primary CTA must remain visible at `390x667` on critical onboarding and arrival screens.
- [ ] Sticky CTAs must never cover the final readable content.
- [ ] Helper copy should use shared helper styles instead of one-off text blocks.
- [ ] Route not-ready helper block should match the premium navy/cyan/glass UI rhythm.
- [ ] Arrival helper note should remain subtle and support `Marinaya Giriş Yap`.
- [ ] `Tekneni Seç` must keep the selected boat CTA visible for `28 ft`, `34 ft`, and `40 ft`.
- [ ] `Tekneni Seç` must keep the final summary readable and reachable above the CTA.
- [ ] Sea event choices must show the expected outcome before tap.
- [ ] `npm run audit:mobile-ui` is a static guardrail, manual visual testing is still required.

---

## 10. Definition of Done

A gameplay batch is done when:
1. `npm run audit:encoding` passes
2. `npm run audit:game` passes
3. `npm run build` passes
4. Manual QA items relevant to the touched systems pass
5. New save fields use safe fallbacks
6. Route progression is reachable in the expected phase, not only in total theory
