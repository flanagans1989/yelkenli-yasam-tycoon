# Yelkenli Yaşam Tycoon — Project Memory

## 1. Project Vision
Yelkenli Yaşam Tycoon is a mobile-first sailing + creator/vlogger + tycoon game.

Core fantasy:
Start with a small boat, create content, gain followers, find sponsors, upgrade the boat, complete routes, and work toward a world tour.

The game mixes:
- Tycoon progression
- Creator/vlogger career
- Sailing fantasy
- Route preparation
- Sea Mode decisions
- Light survival/resource management

## 2. Current Product Direction
The game already has a strong core loop and premium mobile UI.

Visual identity:
- Dark navy / cyan theme
- Glassmorphism cards
- Mobile-first layout
- Bottom navigation
- Premium, polished sailing atmosphere

Current priority:
Do not add more big features yet.
Focus on making existing actions feel more alive, dramatic, rewarding, and testable.

Main product principle:
“Feature count is enough for now. The game needs more feeling, juice, drama, and retention polish.”

## 3. Completed Product Strategy Work
Gemini playtest report:
- Found the game promising.
- UI, core loop, route preparation, and mobile usability were strong.
- Main weaknesses were lack of Sea Mode drama, weak reward feedback, limited celebration, and slow testing due to timers.

Opus product review:
- Confirmed the game is a solid internal-playtest prototype.
- Biggest risk is feature creep.
- Recommended focusing on first-session retention, emotional feedback, and avoiding premature features like map redesign, swipe cards, or dynamic boat SVG.

## 4. Completed Batch 1 — First-Session Retention Polish
Completed changes:
- Sea Mode decision cards now have visual variants:
  - danger
  - opportunity
  - technical
- Lv.1 content cooldown was reduced to 90 seconds.
- Lv.1 boat upgrade base duration was reduced to 60 seconds.
- Offline progress now gives followers as well as credits.
- Offline message mentions both TL and followers.
- Cooldown explanation helper text was added to the content screen.
- First voyage now guarantees one safe/tutorial “content_opportunity” Sea Mode event.
- The first voyage event loop bug was fixed with firstVoyageEventTriggered.
- “İçerik Fırsatı” classification was fixed so it appears as opportunity, not danger.

Important bugfix notes:
- “İçerik Fırsatı” was incorrectly classified as danger because “kazandırır” contained “kaza”.
- getEventCategory priority was changed so opportunity terms are checked before danger terms.
- firstVoyageEventTriggered is a boolean save field with safe fallback:
  parsed.firstVoyageEventTriggered ?? false

## 5. Internal Test Mode / Dev Mode
Internal test mode was added to speed up manual testing.

How to activate:
- Hidden small “v1.0” button in the lower-left corner.
- Clicking it enables DEV MODE / TEST MODE.
- Test mode persists in save.
- Default is false for old and normal saves.

When test mode is ON:
- Content cooldown becomes 3 seconds.
- Boat upgrade duration becomes 5 seconds.
- Marina rest becomes 3 seconds.
- Normal mode formulas remain unchanged when test mode is OFF.

Debug panel actions:
- +10K TL
- +1K followers
- Fill Resources
- Reset Content CD
- Finish Upgrades
- Finish Marina Rest
- Trigger Sea Event
- +500 XP

Important:
Test mode is internal only.
It must stay default off.
It must not accidentally affect normal mode or release balance.

## 6. Current Roadmap
Next planned phase:
Batch 2 — Retention & Juice

Batch 2 goals:
Make every major action feel more rewarding and alive.

Planned tasks:
- Floating text for content/reward gains.
- CelebrationModal particles.
- Critical resource pulse/blink.
- First sponsor special celebration.
- Sea to Arrival transition polish.
- Optional: better visual feedback for upgrade completion.

## 7. Deferred Features
Do not work on these yet unless explicitly requested:
- Full route map redesign
- Swipe decision cards
- Dynamic boat SVG upgrades
- New routes
- New upgrade systems
- Major economy redesign
- Store publishing polish

Reason:
The current risk is feature creep. The game needs stronger feeling and retention polish before expanding feature scope.

## 8. Working Rules for AI Agents
Before editing:
- Always run git status.
- If working tree is dirty, stop and report unless user explicitly approves.
- Understand the current task before editing.

While editing:
- Keep changes small and controlled.
- Do not redesign unrelated screens.
- Preserve save/load compatibility.
- Use safe fallback defaults for new save fields.
- Keep 390x667 mobile viewport in mind.
- Maintain dark navy/cyan/glassmorphism style.
- Do not remove existing gameplay systems.
- Do not bypass real game logic except inside test mode.

After editing:
- Run npm run build.
- Run git status.
- Report changed files, summary, risks, and build result.
- Do not commit or push unless the user explicitly asks.

## 9. Current Known Cautions
- Test mode must not affect normal mode.
- New save fields must always use safe fallback defaults.
- First voyage event should happen only once per new game/first voyage.
- Sea Mode events should not loop or soft-lock the player.
- Opportunity events must not be classified as danger.
- Avoid large refactors.
- Avoid feature creep.

## 10. Current Stable Checkpoint
Current checkpoint:
- Batch 1 retention polish completed.
- Internal test mode completed.
- Build passes.
- Git working tree was clean after commit/push.
- Next recommended work is Batch 2: Retention & Juice.
