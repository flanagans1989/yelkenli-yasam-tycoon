# CLAUDE.md

## 1. Project Identity

**Yelkenli Yaşam Tycoon** is a mobile-first tycoon / simulation game built around the fantasy of growing a small sailing-life business into a larger media and travel empire. The player starts small and expands through content production, sailing routes, upgrades, sponsorships, daily goals, captain XP, follower growth, and world-tour style progression.

This is not just a small prototype. It is the first serious game project of a future AI-assisted solo game studio. Work on this repository should be treated as production-minded game development with an emphasis on stability, quality, and forward progress.

The long-term goal is to finish the game with quality and publish it on both the App Store and Google Play.

## 2. Tech Stack

- React
- TypeScript
- Vite
- Mobile-first browser/game UI
- Local state and save/load logic
- Android debug build as part of the development workflow

## 3. Current Completed Systems

The following systems are already completed and should be treated as existing project memory:

- Sea Mode decision events
- Route rewards balancing
- Starting budget correction
- Offline passive income
- Upgrade installation duration system
- Critical resource warning
- Improved arrival reward screen
- Early-game sponsor thresholds lowered
- Content production cooldown system with save/load support
- Sea decisions redesigned as real dilemmas with advantage/cost balance
- Global progress strip showing captain level, followers, and world-tour progress
- Captain level + XP system
- Level-up bonuses
- Daily goals system
  - produce 1 content
  - complete 1 route
  - start 1 upgrade
  - daily reset
  - 3/3 completion gives +2,500 TL bonus
  - save/load integration
  - daily goals card in Liman tab

## 4. Development Rules

- Do not break existing save/load behavior.
- When adding new game state, update the save/load logic.
- Keep the game mobile-first.
- Avoid overcomplicating systems.
- Prefer small, safe, testable changes.
- Do not rewrite the whole app unless explicitly asked.
- Preserve existing working systems.
- Do not remove completed features.
- Do not change economy values randomly without explaining why.
- When editing React state, check related derived UI and persistence.
- Keep code readable and practical.

## 5. Game Design Direction

- The game should feel like a progression-based sailing-life tycoon.
- Early game should feel active and rewarding.
- The player should not go bankrupt too easily early on.
- Content production should be useful but not spammable.
- Sea decisions should involve meaningful trade-offs.
- Upgrades should create long-term goals.
- Daily goals should improve retention without feeling like chores.
- Captain XP and level should make the player feel long-term growth.
- World tour progress should feel like the big meta goal.

## 6. Testing Checklist

After changes, check:

- `npm run build`
- Browser mobile layout
- Content production
- Content cooldown
- Starting a route
- Sea decision event
- Route completion
- Arrival reward screen
- Upgrade start and timer
- Daily goals progress
- Daily goals 3/3 bonus
- Save/load persistence
- Captain XP and level-up
- Global progress strip
- Android debug build when relevant

## 7. Git Workflow

- Use small commits.
- Commit messages should be short and in English.
- Before suggesting a commit, summarize what changed.
- Do not push unless explicitly asked.
- If the user asks to push, run `git status` first and confirm the branch.

## 8. File Map (read this before reading any source file)

Before reading App.tsx or App.css in full, check here first.

### Key file locations
| Task | File | Approx. line |
|------|------|--------------|
| Save/load logic | App.tsx | 610–1390 |
| Content production | App.tsx | 1613 (`publishContent`) |
| Route start | App.tsx | 2076 (`handleStartVoyage`) |
| Upgrade purchase | App.tsx | 2109 (`handleBuyUpgrade`) |
| Sea decisions | App.tsx | 1747 (`handleResolveSeaDecision`) |
| Arrival handler | App.tsx | 1825 (`handleArrival`) |
| Tutorial step logic | App.tsx | ~1038 (useEffects) |
| All state declarations | App.tsx | 674–775 |
| Render functions | App.tsx | 2149–2640 |
| Static event data | src/data/seaEvents.ts | — |
| Static achievements | src/data/achievements.ts | — |
| Content comment pools | src/data/contentComments.ts | — |
| Captain XP thresholds | src/data/captainData.ts | — |

### App.css — never read the whole file
Use Grep to find a class: search `.classname {` before reading.

### game-data/ — static data only
routes.ts, boats.ts, marinas.ts, upgrades.ts, playerProfiles.ts, economy.ts, socialPlatforms.ts
Do not modify these without a specific reason.

## 9. System Internals (read before touching any system)

### Save/Load
- Trigger: any state change while `step` is `HUB`, `SEA_MODE`, or `ARRIVAL_SCREEN`
- Key: `yelkenli_save` in localStorage, version 2
- `loadGame()` called on "Devam Et" click → sets all ~40 state fields with `?? default`
- `finalizeGame()` resets ALL state to new-game defaults (called on new game start)
- Offline income applied in `loadGame()`: `(now - lastSavedAt) / 60000 * 15 TL + 1 follower`, max 480 min
- Upgrades completing offline: detected in `loadGame()` by comparing `completesAt` to `Date.now()`
- Adding new state: useState → saveObj → loadGame setter → dependency array → finalizeGame reset

### Content Production (`publishContent` in App.tsx)
- Flow: platform select → content type select → publish → result card
- Quality = 40 (base) + platform match +10 + type match +10 + upgrade bonuses + location bonus + sea bonus + random(-10..+15), capped 100
- Rewards: followers = quality×5 × platform multiplier, credits = quality×8 × platform multiplier
- Viral check: quality≥85 → 25%, ≥70 → 10%, ≥40 → 3%; viral = followers×3, credits×2
- Cooldown set at publish time via `lastContentAt = Date.now()`; gated by `getContentCooldownMs(captainLevel)`
- XP: +15 per publish; daily goal `produce_content` marked complete

### Route & Sea Mode
- `handleStartVoyage()`: checks readiness (oceanReadiness, energy, water, safety, nav, maintenance) → sets `step="SEA_MODE"`, resets voyage resources
- Sea events: random from `SEA_DECISION_EVENTS` pool, triggered every few days remaining
- `handleResolveSeaDecision()`: applies effect deltas to resources + XP +30
- `handleArrival()`: credits + followers + XP +80, marks route complete, advances `worldProgress`
- Route readiness thresholds checked live — player cannot start if any stat too low

### Upgrade System
- `handleBuyUpgrade(upgradeId)`: deducts cost, pushes to `upgradesInProgress[]` with `completesAt = now + duration`
- Duration = `getBoatUpgradeDurationMs(captainLevel)` scaled by upgrade cost tier
- Max 3 parallel slots; timer checked every 30s (`UPGRADE_INSTALL_CHECK_INTERVAL_MS`)
- On complete: upgrade ID moves to `purchasedUpgradeIds[]`, effects added to boat stats
- Daily goal `buy_upgrade` marked complete on purchase

### Captain System
- XP sources: content +15, route arrival +80, sea decision +30, level-up gives level×500 TL bonus
- `getCaptainLevel(xp)` walks `CAPTAIN_LEVEL_THRESHOLDS` array backward
- Level-up detected in `publishContent`/`handleArrival` by comparing old vs new level
- Rank labels: Acemi → Kıyı → Açık Deniz → Deneyimli → Okyanus → Dünya Turu Kaptanı

### Daily Goals
- 3 goals: `produce_content`, `complete_route`, `buy_upgrade`
- Theme rotates by date seed (3 themes in `captainData.ts`)
- Reset: `lastDailyReset` stored as YYYY-MM-DD; on app load, if date changed → `makeDailyGoals()` called
- 3/3 bonus: +2,500 TL, `hasCompletedDailyGoalsOnce` set true (achievement trigger)

### Sponsor System
- Offers generated when followers cross tier threshold (`getSponsorTierByFollowers` in economy.ts)
- `handleCheckSponsorOffers()`: generates new offers if eligible
- `handleAcceptSponsor()`: adds to `acceptedSponsors[]`, rewards per content produced afterward
- `brandTrust` increases with each accepted sponsor; used for tier eligibility

### Tutorial (Miço Guide)
- `tutorialStep`: 0=show content hint, 1=show upgrade hint, 2=show route hint, 3=done (hidden)
- Auto-advances via useEffects: step0→1 when `firstContentDone`, 1→2 when `upgradesInProgress.length>0`, 2→3 when `step==="SEA_MODE"`
- Farewell animation plays when step 2→3 (Miço waves goodbye on first voyage)

### Marina Rest Service
- `marinaRestInProgress`: `{startedAt, completesAt, durationMs}` — 2 minutes
- On complete: energy+30, water+30, fuel+20, boatCondition+10
- UI shows progress bar; button disabled while active

## 10. AI Agent Behavior

- Act like a professional game studio assistant.
- First understand the existing code before editing.
- Explain risky changes before making them.
- Prefer step-by-step implementation.
- Keep the founder's vision in mind:
  This game is the foundation of a future AI-powered solo game studio focused only on game development.
