# CLAUDE.md

Read SYSTEMS.md before touching any system. Read DESIGN.md before adding features.

**Yelkenli Yaşam Tycoon** — mobile-first sailing-life tycoon game. Türkiye'den Dünya Turuna.

## Tech Stack

- React
- TypeScript
- Vite
- Mobile-first browser/game UI
- Local state and save/load logic
- Android debug build as part of the development workflow

## Development Rules

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

## Completed Systems

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

## Git Workflow

- Use small commits.
- Commit messages should be short and in English.
- Before suggesting a commit, summarize what changed.
- Do not push unless explicitly asked.
- If the user asks to push, run `git status` first and confirm the branch.

## File Map (read this before reading any source file)

Before reading App.tsx or App.css in full, check here first.

### Key file locations
| Task | File | Approx. line |
|------|------|--------------|
| All state declarations | App.tsx | ~190–350 |
| useEffects (achievements, sponsors, save, timers) | App.tsx | ~359–660 |
| finalizeGame (new game reset) | App.tsx | 663 |
| loadGame (load from localStorage) | App.tsx | 708 |
| publishContent | App.tsx | 1015 |
| handleResolveSeaDecision | App.tsx | 1110 |
| handleArrival | App.tsx | 1178 |
| handleStartVoyage | App.tsx | 1429 |
| handleBuyUpgrade | App.tsx | 1462 |
| Render functions | App.tsx | ~1529–2161 |
| Save/load pure logic | src/lib/saveLoad.ts | — |
| Content quality/reward calc | src/lib/gameLogic.ts | — |
| Static event data | src/data/seaEvents.ts | — |
| Static achievements | src/data/achievements.ts | — |
| Content comment pools | src/data/contentComments.ts | — |
| Captain XP / cooldowns | src/data/captainData.ts | — |

### App.css — never read the whole file
Use Grep to find a class: search `.classname {` before reading.

### game-data/ — static data only
routes.ts, boats.ts, marinas.ts, upgrades.ts, playerProfiles.ts, economy.ts, socialPlatforms.ts
Do not modify these without a specific reason.
