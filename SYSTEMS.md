# SYSTEMS.md — System Internals

Read this before touching any system.

## Save/Load
- Trigger: any state change while `step` is `HUB`, `SEA_MODE`, or `ARRIVAL_SCREEN`
- Key: `yelkenli_save` in localStorage, version 2
- `loadGame()` called on "Devam Et" click → sets all ~40 state fields with `?? default`
- `finalizeGame()` resets ALL state to new-game defaults (called on new game start)
- Offline income applied in `loadGame()`: `(now - lastSavedAt) / 60000 * 15 TL + 1 follower`, max 480 min
- Upgrades completing offline: detected in `loadGame()` by comparing `completesAt` to `Date.now()`
- Adding new state: useState → saveObj → loadGame setter → dependency array → finalizeGame reset

## Content Production (`publishContent` in App.tsx)
- Flow: platform select → content type select → publish → result card
- Quality = 40 (base) + platform match +10 + type match +10 + upgrade bonuses + location bonus + sea bonus + random(-10..+15), capped 100
- Rewards: followers = quality×5 × platform multiplier, credits = quality×8 × platform multiplier
- Viral check: quality≥85 → 25%, ≥70 → 10%, ≥40 → 3%; viral = followers×3, credits×2
- Cooldown set at publish time via `lastContentAt = Date.now()`; gated by `getContentCooldownMs(captainLevel)`
- XP: +15 per publish; daily goal `produce_content` marked complete

## Route & Sea Mode
- `handleStartVoyage()`: checks readiness (oceanReadiness, energy, water, safety, nav, maintenance) → sets `step="SEA_MODE"`, resets voyage resources
- Sea events: random from `SEA_DECISION_EVENTS` pool, triggered every few days remaining
- `handleResolveSeaDecision()`: applies effect deltas to resources + XP +30
- `handleArrival()`: credits + followers + XP +80, marks route complete, advances `worldProgress`
- Route readiness thresholds checked live — player cannot start if any stat too low

## Upgrade System
- `handleBuyUpgrade(upgradeId)`: deducts cost, pushes to `upgradesInProgress[]` with `completesAt = now + duration`
- Duration = `getBoatUpgradeDurationMs(captainLevel)` scaled by upgrade cost tier
- Max 3 parallel slots; timer checked every 30s (`UPGRADE_INSTALL_CHECK_INTERVAL_MS`)
- On complete: upgrade ID moves to `purchasedUpgradeIds[]`, effects added to boat stats
- Daily goal `buy_upgrade` marked complete on purchase

## Captain System
- XP sources: content +15, route arrival +80, sea decision +30, level-up gives level×500 TL bonus
- `getCaptainLevel(xp)` walks `CAPTAIN_LEVEL_THRESHOLDS` array backward
- Level-up detected in `publishContent`/`handleArrival` by comparing old vs new level
- Rank labels: Acemi → Kıyı → Açık Deniz → Deneyimli → Okyanus → Dünya Turu Kaptanı

## Daily Goals
- 3 goals: `produce_content`, `complete_route`, `buy_upgrade`
- Theme rotates by date seed (3 themes in `captainData.ts`)
- Reset: `lastDailyReset` stored as YYYY-MM-DD; on app load, if date changed → `makeDailyGoals()` called
- 3/3 bonus: +2,500 TL, `hasCompletedDailyGoalsOnce` set true (achievement trigger)

## Sponsor System
- Offers generated when followers cross tier threshold (`getSponsorTierByFollowers` in economy.ts)
- `handleCheckSponsorOffers()`: generates new offers if eligible
- `handleAcceptSponsor()`: adds to `acceptedSponsors[]`, rewards per content produced afterward
- `brandTrust` increases with each accepted sponsor; used for tier eligibility

## Tutorial (Miço Guide)
- `tutorialStep`: 0=show content hint, 1=show upgrade hint, 2=show route hint, 3=done (hidden)
- Auto-advances via useEffects: step0→1 when `firstContentDone`, 1→2 when `upgradesInProgress.length>0`, 2→3 when `step==="SEA_MODE"`
- Farewell animation plays when step 2→3 (Miço waves goodbye on first voyage)

## Marina Rest Service
- `marinaRestInProgress`: `{startedAt, completesAt, durationMs}` — 2 minutes
- On complete: energy+30, water+30, fuel+20, boatCondition+10
- UI shows progress bar; button disabled while active
