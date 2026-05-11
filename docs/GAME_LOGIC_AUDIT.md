# Yelkenli Yaşam Tycoon — Game Logic Audit

> **Purpose:** This document defines the invariants the game must always satisfy.  
> Future developers and AI assistants must consult this before making any change to routes, upgrades, sea events, or save/load logic.

---

## 1. Route Progression Rules

### 1.1 All Routes Must Have Requirements
Every `WorldRoute` in `WORLD_ROUTES` must have a `requirements` object with at least `minSafety`, `minNavigation`, `minEnergy`, `minWater`, and `minMaintenance` fields.

### 1.2 Route Order Must Be Contiguous
Routes must be ordered 1 through N without gaps. Adding a new route requires checking order uniqueness.

### 1.3 Requirements Must Be Satisfiable
For every stat field in every route requirement, the **total possible gain from all upgrade cards** must be ≥ the required value. A route must never have a gate that is mathematically impossible to meet even with all upgrades purchased.

| Stat | Upgrade Effect Field |
|---|---|
| `minSafety` | `effects.safety` |
| `minNavigation` | `effects.navigation` |
| `minEnergy` | `effects.energy` |
| `minWater` | `effects.water` |
| `minMaintenance` | `effects.maintenance` |
| `minOceanReadiness` | `effects.oceanReadiness` |

### 1.4 Early Routes Must Be Solvable With "Any" Marina
Routes 1–4 must be achievable without requiring medium/large marina upgrades. All required stats for routes 1–4 must be satisfiable from upgrades with `marinaRequirement: "any"` alone.

---

## 2. Upgrade Progression Rules

### 2.1 Each Required Stat Must Have At Least One Upgrade
If a route requires a stat (e.g., `minMaintenance`), at least one upgrade in `BOAT_UPGRADES` must have a positive value for the corresponding effect field (`maintenance`).

### 2.2 Early Access — "Any" Marina Cards
Every stat category that gates a route in the first 4 routes must have **at least one** upgrade card with `marinaRequirement: "any"`. This ensures players cannot get permanently stuck at the very start.

### 2.3 Upgrade Ladder
Each important stat category should follow the ladder: `any` marina → `medium` → `large` → `shipyard/ocean`. Players should always have a reachable next step.

---

## 3. Category Coverage Rules

The following upgrade categories must always have cards:

| Category ID | Affects Route Stat | Needs "any" Marina Card |
|---|---|---|
| `hull_maintenance` | `minMaintenance` | ✅ Yes |
| `safety` | `minSafety` | ✅ Yes |
| `navigation` | `minNavigation` | ✅ Yes |
| `energy` | `minEnergy` | ✅ Yes |
| `water_life` | `minWater` | ✅ Yes |
| `engine_mechanical` | `minMaintenance` (secondary) | ✅ Yes |
| `sail_speed` | Speed only (no direct route gate) | Optional |
| `comfort` | No route gate | Optional |
| `content_equipment` | No route gate | Optional |
| `auxiliary_seamanship` | Mixed effects | Optional |

---

## 4. Sea Event Classification Rules

### 4.1 Classification Priority Order
The `getEventCategory()` function in `SeaModeTab.tsx` must always check in this order:

1. **opportunity** — içerik, çekim, hazine, fırsat, yunus, manzara, ada, ticaret, kurtarma
2. **technical** — motor, arıza, yakıt, sızıntı, teknik, telsiz, ekipman, sabitle
3. **danger** — fırtına, korsan, tehlike, hasar, kaza, kayalık, hastalık
4. **neutral** — fallback

> [!IMPORTANT]
> **Opportunity is checked FIRST** to prevent "kazandırır" (contains "kaza") from triggering danger.  
> **Technical is checked BEFORE danger** to prevent "hasar" in mechanical event descriptions from triggering danger.

### 4.2 Critical Event Classifications

| Event ID | Expected Category | Reason |
|---|---|---|
| `content_opportunity` | `opportunity` | Must never be danger |
| `technical_noise` | `technical` | "arıza" checked before "hasar" |
| `equipment_loose` | `technical` | "ekipman" checked before "hasar" |
| `mild_storm_signs` | `danger` | Clear danger event |
| `fuel_stop` | `technical` | Motor/fuel keywords |
| `sudden_wind_shift` | `neutral` | "rüzgar" intentionally removed from opportunity keywords |

### 4.3 Known Substring Pitfalls
- `"kazandırır"` contains `"kaza"` — prevented by checking opportunity before danger
- `"hasar"` appears in mechanical/equipment event descriptions — prevented by checking technical before danger
- `"rüzgar"` was previously an opportunity keyword but caused Ani Rüzgar Değişimi to be misclassified — removed

---

## 5. Save/Load Compatibility Rules

### 5.1 Required Fields
All new `boolean` state fields added to gameplay must be:
1. **Added to `saveObj`** in the save `useEffect`
2. **Loaded with a safe fallback** using `?? defaultValue` pattern

### 5.2 Known Tracked Fields

| Field | Type | Default | Saved | Has Fallback |
|---|---|---|---|---|
| `firstVoyageEventTriggered` | `boolean` | `false` | ✅ | ✅ `?? false` |
| `testMode` | `boolean` | `false` | ✅ | ✅ `?? false` |
| `hasReceivedFirstSponsor` | `boolean` | `false` | ✅ | ✅ `?? false` |

### 5.3 Old Save Compatibility
Never change the meaning of an existing save field. If a field is renamed or its type changes, create a migration function in `migrateSave()`.

---

## 6. Test Mode Safety Rules

### 6.1 Default Must Be False
`testMode` must initialize with `useState(false)`. Never default to `true`.

### 6.2 Timer Acceleration Must Be Guarded
All timer acceleration in test mode must go through the `isTestMode` parameter or a direct `testMode` condition check. Do not use inline `testMode ?` checks inside formulas that can accidentally bleed into other calculations.

### 6.3 Known Timer Guards

| System | Guard Location |
|---|---|
| Content cooldown | `getContentCooldownMs(captainLevel, testMode)` |
| Upgrade duration | `getUpgradeInstallMs()` checks `if (testMode) return 5000` |
| Marina rest | `testMode ? 3000 : MARINA_REST_DURATION_MS` |

---

## 7. First Voyage Event Rules

### 7.1 Content Opportunity Must Fire Once
The first voyage (when `completedRouteIds.length === 0`) must trigger the `content_opportunity` event on the first eligible advance day call.

### 7.2 Infinite Loop Prevention
The flag `firstVoyageEventTriggered` must be:
- Checked with `!firstVoyageEventTriggered` before triggering the guaranteed event
- Set to `true` via `setFirstVoyageEventTriggered(true)` immediately after triggering
- Persisted in save with fallback `?? false`

---

## 8. Manual QA Checklist

Run this checklist after every batch of changes:

### Route/Upgrade
- [ ] Open HUB screen → Route tab
- [ ] Confirm current route requirements are visible
- [ ] Buy the cheapest maintenance upgrade (Düzenli Servis Paketi — "any" marina)
- [ ] Confirm maintenance readiness bar updates
- [ ] Confirm route readiness percentage changes
- [ ] Attempt to start Route 2 (Yunan Adaları) with 0 upgrades — should be blocked
- [ ] Buy engine_service + regular_service_pack → Route 2 maintenance gate should pass

### Sea Events
- [ ] Enter Sea Mode → press "Bir Gün İlerle"
- [ ] On first voyage, confirm "İçerik Fırsatı" event appears as FIRSAT (green), not TEHLIKE (red)
- [ ] Confirm pressing either choice on "İçerik Fırsatı" does NOT repeat the event on next day
- [ ] Trigger "Teknik Arıza" via Dev Mode → confirm it shows as SORUN not TEHLIKE
- [ ] Check that a second voyage can trigger storm/danger events

### Celebration/Sponsor
- [ ] Accept first sponsor offer → confirm special pink celebration modal appears
- [ ] Accept a second sponsor offer → confirm normal flow (no second celebration)

### Test Mode
- [ ] Click "v1.0" in bottom left → confirm red DEV MODE ON button
- [ ] Confirm content cooldown is ~3 seconds
- [ ] Click again → confirm normal mode restored, cooldown returns to 90s (Lv.1)
- [ ] Reload page → confirm testMode state is saved

---

## 9. Definition of Done (for Future Batches)

A batch of changes is considered **done** when:

1. `npm run audit:game` exits with code 0 (zero failures)
2. `npm run build` exits with code 0
3. All manual QA checklist items are confirmed
4. No new save fields are added without safe fallback `?? default`
5. No route requirements are added that exceed the achievable upgrade total
6. No event classification order is changed without updating `EXPECTED_CLASSIFICATIONS` in the audit script
7. `git status` shows only intentionally modified files

---

## 10. Audit Script Reference

**Location:** `scripts/audit-game-logic.mjs`  
**Run:** `npm run audit:game`  
**Exit codes:** `0` = pass (may have warnings), `1` = at least one failure

### What It Checks
| Section | Checks |
|---|---|
| Route Progression | All routes have requirements, contiguous order, stat satisfiability |
| Achievability | Every route's required stats can be met by the total upgrade pool |
| Maintenance Deep Audit | Early routes (1–4) are solvable with "any"-marina maintenance upgrades |
| Category Coverage | Every stat category has cards; early stats have "any"-marina accessible cards |
| Sea Event Classification | All 10 events classify correctly per expected table |
| Substring Safety | "kazandırır" and "hasar" do not cause false-positive danger classification |
| Save/Load | All known save fields are persisted and have safe load fallbacks |
| Test Mode Safety | testMode defaults false, timer guards exist for all 3 systems |
| First Voyage Safety | firstVoyageEventTriggered is set on fire and guarded on repeat |

### Extending The Script
When adding:
- A new sea event → add to `SEA_DECISION_EVENTS` and `EXPECTED_CLASSIFICATIONS`
- A new save field → add to `KNOWN_SAVE_FIELDS`
- A new upgrade category → add to `categoryStatMap`
- A new route → no script change needed (extracted automatically)
