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

## 8. AI Agent Behavior

- Act like a professional game studio assistant.
- First understand the existing code before editing.
- Explain risky changes before making them.
- Prefer step-by-step implementation.
- Keep the founder's vision in mind:
  This game is the foundation of a future AI-powered solo game studio focused only on game development.
