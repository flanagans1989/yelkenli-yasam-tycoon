# Prestige Voyage Upgrade Reset Review

## Current Behavior

- Prestige voyage only unlocks after `hasCompletedWorldTour === true`.
- The player can replay already completed routes from the route screen.
- Prestige voyage grants `1.5x` credit and follower rewards.
- Prestige voyage does **not** grant route-completion tokens.
- Prestige voyage does **not** update `completedRouteIds`.
- Prestige voyage does **not** advance `worldProgress`.
- Prestige voyage currently does **not** touch `purchasedUpgradeIds` or `upgradesInProgress`.

Relevant code paths:

- `src/components/RotaTab.tsx`
- `src/App.tsx` in `handleStartPrestigeVoyage`
- `src/App.tsx` in `handleArrival`
- `src/lib/buildSaveSnapshot.ts`
- `src/lib/saveLoad.ts`

## Audit Result

The current prestige voyage implementation is a safe optional endgame replay loop, not an NG+ reset system.

That is good for the live game because:

- the main 17-route progression remains intact
- completed-route history is preserved
- world-tour completion is preserved
- player upgrades are not deleted
- save/load already persists the relevant route and upgrade state

## Why Full Upgrade Reset Is Risky Right Now

Adding a real upgrade reset directly into the current save model is risky because the game has only one primary progression state:

- `purchasedUpgradeIds`
- `upgradesInProgress`
- `completedRouteIds`
- `worldProgress`
- `hasCompletedWorldTour`
- captain progression and economy state

A destructive reset would need to answer all of these safely:

- Are all upgrades removed, or only route-readiness upgrades?
- Are in-progress installs cancelled, refunded, or converted?
- Does route readiness drop immediately while prestige replay remains available?
- Does the player keep current marina/location/resource state?
- What happens if the player saves mid-prestige?
- What happens if a future patch changes upgrade ids or route requirements?

Without a separate prestige-specific save layer, a reset action could accidentally damage the main run.

## Recommended Safe Design

If upgrade reset is implemented later, it should be **opt-in, reversible in data shape, and isolated from the base run**.

Recommended approach:

1. Keep the current prestige voyage replay loop unchanged.
2. Add a new save object branch instead of mutating the base progression in place.
3. Store reset state in explicit fields such as:
   - `prestigeModeActive`
   - `prestigeRunId`
   - `prestigeBasePurchasedUpgradeIds`
   - `prestigeResetPurchasedUpgradeIds`
   - `prestigeResetStartedAt`
4. Allow reset only from HUB, never during sea travel or while upgrades are installing.
5. Require a typed confirmation UI that explicitly shows:
   - which upgrades are temporarily disabled
   - that main world-tour completion remains preserved
   - that this mode is optional
6. Keep the original `purchasedUpgradeIds` recoverable until the prestige run is explicitly finalized.

## Minimal Infrastructure Recommendation

The safest first implementation step is **not** to delete upgrades yet.

Instead, add only:

- a prestige reset capability flag in save data
- a UI entry point that stays disabled or marked "coming soon"
- migration-safe default values

This gives room to build the feature later without risking live player saves now.

## Save Risk

Save risk is the main blocker for a direct implementation in this task.

Specific risks:

- accidental permanent loss of `purchasedUpgradeIds`
- corrupted `upgradesInProgress` if reset happens during installation
- mismatch between `worldProgress`, `completedRouteIds`, and reduced readiness
- loading older saves that do not understand prestige-reset fields
- future migrations having to reconstruct a half-reset account state

## Recommendation For This Task

Do **not** implement destructive upgrade reset behavior yet.

Safe outcome for this task:

- keep current prestige voyage logic as-is
- add regression tests that prove save/load and upgrade ownership stay intact
- document the reset design and save risks before any production rollout
