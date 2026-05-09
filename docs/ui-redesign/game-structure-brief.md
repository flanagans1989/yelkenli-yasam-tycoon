# Yelkenli Yaşam Tycoon — Game Structure Brief
## For UX/UI Redesign Reference

**Document status:** Read-only reference. Do not redesign or modify anything based on this document alone.  
**Source:** Generated from full codebase inspection on 2026-05-10.  
**Purpose:** Give a senior UX/UI designer a complete, accurate picture of the game before any redesign work begins.

---

## 1. Game Overview

| Field | Value |
|---|---|
| **Game Name** | Yelkenli Yaşam Tycoon |
| **Genre** | Mobile Tycoon / Life Simulation |
| **Platform** | Mobile-first browser game + Android (via Capacitor) |
| **Orientation** | Portrait only |
| **Language** | Turkish throughout |
| **Tech Stack** | React 19, TypeScript, Vite, Capacitor for Android |

### Core Fantasy

The player becomes a sailing content creator who starts with a boat in a Turkish marina and works their way around the world. The two parallel journeys are:

1. **The World Tour** — 17 sequential sailing routes from Turkey to around the world and back.
2. **The Creator Career** — growing followers, producing content, attracting sponsors, and building a recognizable brand around the sailing lifestyle.

Both journeys are intertwined: better routes mean better content opportunities, which means more followers, which unlocks better sponsors, which means more money, which means better boat upgrades, which allows harder routes.

### Target Player Experience

The player should feel like a real-life sailing captain who is documenting their journey for the internet. The progression from small-time content creator in a Turkish marina to recognized world-tour sailing personality should feel earned. Each route should feel like an expedition. Each sponsor deal should feel like a career milestone.

---

## 2. Player Journey

### Full Flow from First Launch

```
App loads
  └─ MAIN_MENU
       ├─ [New Game] → PICK_PROFILE → PICK_MARINA → PICK_BOAT → NAME_BOAT → HUB
       └─ [Continue] (if save exists) → HUB (restores all state)
```

### Onboarding Steps (5 steps, all in Onboarding.tsx)

**Step 1 — MAIN_MENU**  
Cinematic screen with animated ocean scene (stars, horizon glow, wave layers, boat silhouette). Shows game title, "Yeni Oyun" button, and "Devam Et" button (only if a save exists, showing saved boat name).

**Step 2 — PICK_PROFILE (1/5)**  
Player selects a captain archetype. 6 profiles available, displayed in a carousel (left/right navigation buttons). Each profile shows: name, tagline, an icon, top 3 skill ratings as bars, one advantage and one disadvantage. The choice affects skill bonuses, platform fit, sea risk, and sponsor unlock speed.

**Step 3 — PICK_MARINA (2/5)**  
Player selects a starting marina. 10 Turkish marinas available. Filterable by region: Ege, Akdeniz, Marmara, or All. Shows marina list on top, selected marina detail sheet at bottom (tagline, bonus, disadvantage, first route options). The starting marina sets the initial location name.

**Step 4 — PICK_BOAT (3/5)**  
Player selects a boat from 3 options, switched via tabs showing length in feet (28, 34, 40). Each boat shows: class label, a brief description, 4 stat bars (Maliyet, Dayanıklılık, Konfor, Açık Deniz), who the boat is best for, a budget calculator (starting budget minus boat cost = remaining), and advantage/disadvantage text.

**Step 5 — NAME_BOAT (4/5)**  
Player types a name for their boat. Live preview shown in styled text. A random name generator button provides suggestions from 8 options. The name is used throughout the rest of the game.

*Note: Step 5 in the UI header says "4 — Son Hazırlık" (Final Preparation), and pressing "⚓ Denize İndir" launches the game.*

---

### In-Game Flow After Onboarding

After finalizing the game:
- Credits are set to `starting budget − boat cost` (75,000–115,000 TL depending on boat)
- All resources start at 100%
- Current location is set to the selected marina name
- Current route is set to "greek_islands" (second route; the tutorial route "turkiye_start" is skipped)
- Player enters the HUB step, Liman tab active

**Normal session loop:**
```
HUB (any tab)
  ↓
Content production (İçerik tab) → wait 30-minute cooldown → produce again
  ↓
Route check (Rota tab) → verify readiness → start voyage
  ↓
SEA_MODE (Liman tab shows sea view, other tabs accessible)
  → advance days one at a time
  → sometimes: sea decision event appears (30% chance per day)
  → days reach 0 → auto-navigate to ARRIVAL_SCREEN
  ↓
ARRIVAL_SCREEN
  → shows reward summary → player taps "Limana Dön" → HUB, Liman tab
```

---

## 3. Core Game Loop

```
1. PRODUCE CONTENT
   Select platform → select content type → tap "İçerik Üret"
   → gain followers + credits + XP
   → 30-minute real-time cooldown starts

2. GAIN FOLLOWERS / MONEY / XP
   Content production, route completion, sea decisions, and daily goals
   all feed followers, credits, and captain XP.

3. PREPARE ROUTE
   Open Rota tab → check 6 readiness requirements (ocean readiness + 5 upgrade stats)
   Buy needed upgrades in Tekne tab (real-time installation wait)
   All requirements met → "Rotaya Çık" button enabled

4. START VOYAGE
   Tap "Rotaya Çık" → step changes to SEA_MODE
   Days counter set (random within route's min-max range)

5. ADVANCE SEA DAYS
   Tap "Bir Gün İlerle" button each day
   Each advance: resources drop (energy, water, fuel), boat condition may drop slightly

6. SEA DECISION EVENTS (30% chance per day)
   Two-choice branching event appears
   Each choice has tradeoffs (credits/resources/time)
   Resolving earns +30 XP

7. ARRIVE
   Days reach 0 → ARRIVAL_SCREEN
   Shows: port name, credits reward, followers reward, world tour progress update, next route name
   Player taps "Limana Dön" → handleArrival runs:
   → world progress updated, completed routes list updated, location updated
   → rewards applied (+credits, +followers, +80 XP)
   → daily goal "complete_route" marked done
   → next route ID set automatically

8. COLLECT REWARDS
   Credits and followers added automatically on arrival
   Sponsor offers may now unlock (if follower threshold reached)
   Achievements may unlock

9. UPGRADE BOAT
   Tekne tab: select upgrade category, buy upgrade
   Upgrade install timer starts (installDays × 30 min real-time)
   On completion: stat bonuses applied, daily goal "buy_upgrade" marked done

10. UNLOCK SPONSORS / ACHIEVEMENTS
    Sponsors: check offers manually via "Teklifleri Kontrol Et" button
    Achievements: unlock automatically based on tracked metrics, toast notification fires

11. REPEAT
    Captain XP accumulated → level-up gives credits bonus
    Daily goals reset at midnight UTC → new theme, +2,500 TL on 3/3
    World tour progresses through 17 routes
    Final win: complete all 17 routes + reach 1,000,000 followers (per design docs; not fully coded yet)
```

---

## 4. Main Screens and Their Purpose

### 4.1 Main Menu (MAIN_MENU)

**What the player sees:**  
A cinematic ocean scene: animated star layer, horizon glow div, boat silhouette SVG, water reflection, two wave SVG layers with horizontal scroll animation, water shimmer overlays. Over this scene: the game title "Yelkenli Yaşam / TYCOON", a decorative divider, and the action buttons.

**What the player does:**  
Taps "YENİ OYUN" to begin onboarding, or taps "DEVAM ET" (with their saved boat name shown inline) to continue a previous game.

**Main CTA:** "YENİ OYUN" button (primary, large)  
**Secondary action:** "DEVAM ET" (secondary, large) — only visible if save exists  
**Important state shown:** Saved boat name (if save exists); a social proof line "47.000 kaptan denizde" (hardcoded, not dynamic)

**Intended emotional feeling:** The player should feel drawn in — the ocean is alive, the tone is cinematic and aspirational. Before a single decision is made, they should want to be part of this world.

---

### 4.2 Onboarding — Captain Selection (PICK_PROFILE)

**What the player sees:**  
Step indicator "1/5" + 5 progress dots, heading "Kaptanını Seç". A large profile card in a carousel with prev/next navigation arrows. Card shows: profile icon (emoji), name, tagline in quotes, top 3 skill bars with values, one advantage (green), one disadvantage (amber).

**What the player does:**  
Swipes through 6 profiles via buttons, selects one by tapping "Limanlara Bak →".

**Main CTA:** "Limanlara Bak →" (advance to next step)  
**Secondary:** "Geri" button (back to main menu)  
**Important state:** The marina selection screen highlights marinas "recommended" for the chosen profile.

**Profiles available:**
| ID | Name | Difficulty |
|---|---|---|
| old_captain | Eski Kaptan | easy_medium |
| content_creator | İçerik Üreticisi | medium_hard |
| technical_master | Teknik Usta | medium |
| adventure_traveler | Maceracı Gezgin | hard |
| social_entrepreneur | Sosyal Girişimci | medium |
| family_lifestyle | Aile / Yaşam Kanalı | easy_medium |

Each profile has 6 skills scored 1–5: seamanship, content, technical, sponsor, riskManagement, lifestyle.

**Intended emotional feeling:** The player identifies with a persona, not just selects stats.

---

### 4.3 Onboarding — Marina Selection (PICK_MARINA)

**What the player sees:**  
Step "2/5". Region filter chips (Tümü/Ege/Akdeniz/Marmara) at top. A scrollable list of marinas matching the filter. At bottom: a "detail sheet" that slides up showing the selected marina's name, region badge, tagline, bonus card, disadvantage card, and first route options.

**What the player does:**  
Filters by region, taps a marina to select it, then advances.

**Main CTA:** "Tekne Seçimine Geç →"  
**Secondary:** "Geri" button  
**Important state:** "ÖNERİLEN" (Recommended) badge shown on marinas that match the chosen captain profile.

**10 marinas available:** marmaris, gocek, fethiye, kas, bodrum, kusadasi, cesme, antalya, istanbul, yalova

**Intended emotional feeling:** The player imagines their starting location, anchoring the journey geographically.

---

### 4.4 Onboarding — Boat Selection (PICK_BOAT)

**What the player sees:**  
Step "3/5". Three tab buttons showing boat lengths (28ft, 34ft, 40ft). A large card for the selected boat showing: class badge, length, name, tone description, summary, an SVG boat illustration with glow effect, age condition badge, 4 decision stats with progress bars, fit panel (who it suits / game role), budget calculator (starting budget 150,000 TL − purchase cost = remaining), and advantage/disadvantage.

**What the player does:**  
Tabs between 3 boats, compares, selects.

**Main CTA:** "Bu Tekneyi Seç"  
**Secondary:** "Geri"  
**Important state:** Budget calculator updates live with each boat selection.

**Boats:**
| ID | Name | Cost | Remaining Budget | Class |
|---|---|---|---|---|
| kirlangic_28 | Kırlangıç 28 | 35,000 TL | 115,000 TL | Kıyı Sınıfı |
| denizkusu_34 | Denizkuşu 34 | 60,000 TL | 90,000 TL | Dengeli Cruiser |
| atlas_40 | Atlas 40 | 85,000 TL | 65,000 TL | Ocean Cruiser |

**Intended emotional feeling:** The player makes their first major strategic commitment — and feels it.

---

### 4.5 Onboarding — Boat Naming (NAME_BOAT)

**What the player sees:**  
Step "4/5", title "Son Hazırlık". Boat SVG illustration (large), heading "Tekneye İsim Ver", explanatory text. A text input field, a live name preview (formatted as « NAME »), and a random name suggestion button.

**What the player does:**  
Types or generates a name, taps "⚓ Denize İndir".

**Main CTA:** "⚓ Denize İndir" — finalizes the game and enters HUB  
**Secondary:** "Geri" (back to boat selection), random name button  
**Validation:** If name is empty, an error message appears in `onboardingMessage`, the step does not advance.

**Intended emotional feeling:** The boat now has an identity. It belongs to the player. This is the moment of emotional ownership.

---

### 4.6 Liman / Hub Tab (HUB step, liman tab)

**What the player sees:**  
A **Daily Goals card** rendered above the LimanTab content (always first). Then:
- A **Quest card** — pulsing button linking to either the İçerik tab (if no content produced yet) or the Rota tab (if content done)
- A **Hub Center Visual** — SVG boat animation above a water line, with location name below
- **Two progress cards** side by side: "Dünya Turu" (world tour %) and "Okyanus Hazırlığı" (ocean readiness %)
- A **Başlangıç Rehberi** (beginner guide) card with 3 checklist items that track first content, first route prep, and first route completion, plus a guidance message
- A **Marina Servisi** card showing 4 resource values (energy, water, fuel, boat condition as percentages), a status message, "Marina'da Dinlen" button (+30 energy/water, +20 fuel, +10 boat condition), and "Tekneyi Onar - 250 TL" button (+35 boat condition, costs 250 TL)
- An **Event Log** card showing the last 5 game events

**Top bar (persistent across all tabs):** Boat name + boat model name on the left; credit amount and follower count with flash animation on the right  
**Progress strip (below top bar, HUB only):** Captain level, XP, followers, world tour route count; plus a "Kaptan Tavsiyesi" next-action card that intelligently suggests what to do next based on game state

**Main CTA:** Quest card button  
**Secondary actions:** Marina rest, boat repair, tab navigation  
**Important state shown:** World progress %, ocean readiness %, all 4 resource values, event log, daily goals

**Intended emotional feeling:** "This is my home base. I'm ready to set sail."

---

### 4.7 İçerik / Content Tab (HUB or SEA_MODE)

**What the player sees:**  
A stats header (followers + credits). Two sub-tab buttons: "İçerik Üret" and "Sponsorluklar".

**Produce Content sub-tab:**  
- Content Career card (title + motivational text + current followers + sponsor threshold highlight)
- A helper hint
- If no current result: route content hint (at sea only), platform selection grid (4 platform cards), content type pills (6-8 types, with ✓ match indicator), and a produce button. If on cooldown, button shows "X dk sonra tekrar üret" and is disabled.
- If result exists: a result card showing platform, quality score, followers gained, credits gained, viral badge (if triggered), a thematic comment quote, and a "Yeni İçerik Üret" button to reset.

**Sponsor sub-tab:**  
- Sponsor Career card (brand trust /100, tier level if unlocked, progress bar toward next tier, follower target)
- "Teklifleri Kontrol Et" button — manually triggers sponsor offer check
- "Gelen Teklifler" section — list of available offers, each with brand name, tier, reward range, "Kabul Et" button
- "Aktif Sponsorlar" section — accepted sponsor name badges

**Main CTA:** "🎬 İçerik Üret" button (produce sub-tab)  
**Navigation notification:** Tab shows a notification badge if no content has been produced yet (`!firstContentDone`)

**Content Production Notes:**
- 4 active platforms: ViewTube, ClipTok, InstaSea, FacePort (LiveWave is listed as "simple" status and shown in selection)
- 6–8 content types depending on whether player is in sea mode
- Quality score: 0–100, calculated from base 40 + skill + platform match + upgrade bonus + location + random ±10
- Viral chance: 3% (quality≥40), 10% (quality≥70), 25% (quality≥85)
- On viral: followers ×3, credits ×2

**Intended emotional feeling:** "I'm building something real. Every post matters."

---

### 4.8 Rota / Route Tab (HUB or SEA_MODE)

**What the player sees:**  
Label "Navigasyon Masası", heading "Sıradaki Rotalar". A **route card** for the current route showing: name, risk level badge (colored by risk), difficulty label, route description, route "feeling" quote, duration range (days), and content potential label. Below that: a **Readiness section** — if all 6 requirements met, shows "✅ Tüm gereksinimler karşılandı"; otherwise lists only the failing requirements with current/required values and a hint. The "Rotaya Çık" button is disabled if currently at sea.

Below the main route card: an optional **next route preview** showing the route name, feeling, and a note about world tour progression.

A helper hint at the bottom: "Rotalar dünya turu ilerlemeni artırır."

**6 Readiness checks:**
| Check | Source |
|---|---|
| Okyanus Hazırlığı | Base (by boat) + sum of oceanReadiness upgrade effects |
| Enerji | Sum of energy upgrade effects |
| Su | Sum of water upgrade effects |
| Güvenlik | Sum of safety upgrade effects |
| Navigasyon | Sum of navigation upgrade effects |
| Bakım | Sum of maintenance upgrade effects |

Note: The readiness check compares upgrade **stat bonuses** (not current resource bars) against route minimum requirements. Failing readiness does NOT block the voyage — it increases risk penalty (more resource drain per day).

**Main CTA:** "Rotaya Çık" button  
**Navigation notification:** Tab shows badge if first content done and no routes completed yet  
**Important state:** Current route name, readiness status, next route preview

**Intended emotional feeling:** "I'm choosing my next destination. I want to be ready."

---

### 4.9 Sea Mode (SEA_MODE step, liman tab shows sea view)

**What the player sees:**  
The top bar switches to a "sea topbar" showing only boat name and current route info (name: from → to). The progress strip is hidden. The liman tab content is replaced by SeaModeTab:

- A boat SVG animation (same boat as hub, but now labeled "boat-animation" class)
- A sea status card: days remaining counter, a progress bar (% of voyage complete), and current sea event text
- A critical resource banner (if any resource < 25%, says critical; if any = 0, says depleted)
- A 2×2 resource grid: 4 cards (Enerji, Su, Yakıt, Tekne Durumu), each with label, percentage value, and a color-coded progress bar (green > 50%, amber 25-50%, red < 25%, with "critical-pulse" animation below 25%)
- Either: a **sea decision card** (when pendingDecision exists) with event title, description, and two choice buttons (choiceA = secondary style, choiceB = primary style)
- Or: the **"Bir Gün İlerle"** button with pulse animation

Other tabs (İçerik, Rota, Tekne, Kaptan) remain accessible during sea mode.

**Main CTA:** "Bir Gün İlerle" OR the two sea decision choice buttons  
**Important state:** Days remaining, all 4 resource bars, active sea event text

**Resource drain per day advance:**
- Energy: 3–5% drop (reduced if upgradeEnergyBonus > 10/20)
- Water: 2–4% drop (reduced if upgradeWaterBonus > 10/20)
- Fuel: 3–4% drop
- Boat condition: random 1–3 damage (when random > 0.7–0.85 threshold), or –4 if any resource reaches 0

**Sea decision events (10 total, 30% trigger chance):**
Each has a title, description, two choices, and effects on credits/followers/energy/water/fuel/boatCondition/remainingDays. Resolving earns +30 captain XP. Events cover: fuel crisis, approaching storm, technical failure, content opportunity, wind shift, night fatigue, cove anchoring, risky camera shot, fisherman encounter, equipment issue.

**Intended emotional feeling:** "I'm at sea. Every day is an adventure. Every choice matters."

---

### 4.10 Arrival / Reward Screen (ARRIVAL_SCREEN step)

**What the player sees:**  
Full-screen cinematic card on the same dark background. Shows: an anchor icon, "Varış!" heading, arrival port name, the route's feeling quote, "Rota Tamamlandı" highlight badge, a progress section (world tour % and route count), a reward grid (credits + followers earned from route), a world tour summary card (narrative milestone text + progress bar + next route name), and the "Limana Dön" button.

**What the player does:**  
Reads the results, taps "Limana Dön" to trigger handleArrival() and return to HUB.

**What handleArrival() does:**
- Updates world progress %
- Adds route to completedRouteIds
- Updates current location name
- Applies credit + follower rewards (with flash animations)
- Sets current route ID to next route in sequence
- Logs the event
- Awards +80 captain XP
- Marks daily goal "complete_route" as done
- Clears any pending sea decision
- Sets step to "HUB", tab to "liman"

**Route completion rewards (from getRouteCompletionRewards):**
- Credits: `5,000 × riskLevel multiplier` (low=0.8× to final=2.5×)
- Followers: `2,500 × contentPotential multiplier` (low=0.75× to very_high=2×)

**Main CTA:** "Limana Dön" button  
**Intended emotional feeling:** "I made it. This was worth it."

---

### 4.11 Tekne / Boat Upgrades Tab (HUB or SEA_MODE)

**What the player sees:**  
A boat summary card: SVG boat visual, boat name, boat model + length, current credit amount, ocean readiness bar. Below that: a 4-stat grid (Enerji Puanı, Su/Yaşam, Güvenlik, Navigasyon — showing accumulated upgrade bonus points, not resource bars). A helper hint. A horizontal scrollable category pill bar (10 categories). If an upgrade is currently installing: a "detail box" with name and remaining time label. Then: a list of upgrade cards for the selected category.

**Each upgrade card shows:**
- Name + "ALINDI" badge if purchased
- Description + strategy hint for the category
- Details grid: install days + marina requirement
- Warning badge if efficiency is "limited" for current boat
- Error badge if upgrade is incompatible with current boat
- Effect badges: each effect with its +value (e.g., "Enerji: +8")
- Purchase button with cost, or disabled states:
  - "Kurulumda" (currently installing this one)
  - "Kurulum Bekleniyor" (another upgrade is installing)
  - "Yetersiz Bütçe" (not enough credits)

**Upgrade installation:**
- Only 1 upgrade can install at a time
- Duration: `installDays × 30 minutes` real-time
- Progress checked every 30 seconds via setInterval
- On completion: effects applied to energy/water/boatCondition, toast fires, logs updated

**Main CTA:** Purchase button on desired upgrade  
**10 upgrade categories:** Enerji Sistemi, Navigasyon, Güvenlik, Yelken/Hız, Motor/Mekanik, Su/Yaşam, Konfor, İçerik Ekipmanı, Gövde/Bakım, Yardımcı Denizcilik  
**27 upgrades total** (2–3 per category), ranging from 2,500 TL to 28,000 TL

**Intended emotional feeling:** "I'm building my dream boat, piece by piece."

---

### 4.12 Kaptan / Captain Profile Tab (HUB or SEA_MODE)

**What the player sees:**  
- Captain header: profile icon (emoji) + profile name + tagline
- Career card: "Kaptan Kariyeri" label, rank label (6 rank names based on level), career narrative text, and a meta line showing level / XP / completed routes
- Skills mini-grid: 6 skill boxes (seamanship, content, technical, sponsor, riskManagement, lifestyle), each with skill name, value /5, and mini progress bar
- Career goals section: two goal bars — Dünya Turu (world %) and Takipçi Hedefi 1M (followers / 10,000 capped at 100%)
- Achievements showcase card: title "Başarı Yolculuğu", motivational text, "X/13 rozet açıldı" count, all 13 achievement badges as chips (unlocked = 🏅 + title chip, locked = ○ + title chip, all have title attribute with description)
- Event log (last 5 events)

**Captain ranks by level:**
| Level | Rank |
|---|---|
| 1 | Acemi Kaptan |
| 2–3 | Kıyı Seyircisi |
| 4–5 | Açık Deniz Adayı |
| 6–8 | Deneyimli Kaptan |
| 9–12 | Okyanus Yolcusu |
| 13–15 | Dünya Turu Kaptanı |

**Captain level thresholds (XP required for each level):**
1:0, 2:100, 3:250, 4:500, 5:900, 6:1400, 7:2100, 8:3000, 9:4200, 10:6000, 11:8200, 12:11000, 13:14500, 14:19000, 15:25000

**Level-up bonus:** `newLevel × 500 TL` added to credits automatically; logged to event log.

**Main CTA:** None (informational tab)  
**Intended emotional feeling:** "I can see how far I've come."

---

### 4.13 Achievements

Achievements are shown within the Kaptan tab. There is no separate achievements screen. 13 achievements total, evaluated against `AchievementProgress` data.

| ID | Title | Condition |
|---|---|---|
| first_content | İlk İçerik | Produce 1 content |
| first_route | İlk Rota | Complete 1 route |
| first_upgrade | İlk Upgrade | Start 1 upgrade |
| first_sponsor | İlk Anlaşma | Accept 1 sponsor |
| followers_1k | Bin Takipçi | 1,000 followers |
| rising_captain | Yükselen Kaptan | Reach level 3 |
| locked_in | Hedefe Kilitlen | Complete 3/3 daily goals once |
| sea_dog | Deniz Kurdu | Complete 5 routes |
| steady_creator | İstikrarlı Üretici | Produce 10 content |
| followers_10k | On Bin Takipçi | 10,000 followers |
| content_machine | İçerik Makinesi | Produce 25 content |
| atlantic_done | Atlantik Kaptanı | Complete "atlantic_crossing" route |
| world_tour_done | Dünya Turu Kaptanı | Complete all 17 routes |

Achievements unlock automatically. No reward is given on unlock other than a toast notification.

---

### 4.14 Notifications / Toast System

A single toast appears at a time, displayed at the top of the screen. The system uses a queue — toasts fire one after another, never simultaneously.

**Toast types and triggers:**
| Type | When triggered |
|---|---|
| `upgrade` | Upgrade installation completes |
| `achievement` | Achievement newly unlocked |
| `sponsor` | New sponsor offer arrives |
| `content` | Content production completes |
| `voyage` | Voyage starts |
| `sea_decision` | Sea decision resolved |

**Toast lifecycle:**
- Appears immediately when activated from queue
- Displayed for 3.5 seconds total
- "Leaving" animation triggers at 3.2 seconds
- Player can tap toast to dismiss early

**Visual:** The toast uses CSS class `game-toast game-toast--{type}` with a `leaving` modifier. It shows a title and body text. It is positioned fixed at top.

---

### 4.15 Settings / Save-Load

**There is no explicit settings screen.** Save and load are automatic and silent.

**Auto-save behavior:**
- Every time any of ~35 state variables changes (via a large `useEffect` dependency array)
- Only saves when step is `HUB`, `SEA_MODE`, or `ARRIVAL_SCREEN` (never during onboarding)
- Storage key: `yelkenli_save` in `localStorage`
- Save version: 2 (migration from v1 handled)

**Load behavior:**
- On main menu load: checks for save, shows "Devam Et" if present
- On "Devam Et" tap: `loadGame()` restores all state
- Offline income: computes `min(elapsed minutes, 480) × 15 TL` passive income
- Upgrade completion: if upgrade install timer expired while offline, it completes on load
- Migration: v1 saves handled with `migrateSave()`

**What is saved:** All 35+ state variables including: step, activeTab, profileIndex, marinaIndex, boatIndex, boatName, credits, followers, energy, water, fuel, boatCondition, currentRouteId, completedRouteIds, voyageDays, sea event state, content state, sponsor state, upgrade state, captain XP/level, daily goals, timestamps.

---

## 5. Game Systems

### 5.1 Resources

Four real-time resources tracked during voyages:

| Resource | Variable | Start | Min | Replenish method |
|---|---|---|---|---|
| Enerji | `energy` | 100% | 0% | Marina rest (+30), upgrade effects, sea decisions |
| Su | `water` | 100% | 0% | Marina rest (+30), upgrade effects, sea decisions |
| Yakıt | `fuel` | 100% | 0% | Marina rest (+20), sea decisions (limited) |
| Tekne Durumu | `boatCondition` | 100% | 0% | Marina rest (+10), boat repair (-250 TL, +35), upgrade effects |

Resources only drain during sea mode (each "advance day" click). In hub mode they do not change unless the player rests or repairs.

---

### 5.2 Money / Credits

- Turkish Lira (TL) throughout
- Starting amount: 150,000 TL minus boat purchase cost
- Sources: content production, route completion rewards, sponsor deals, daily goals bonus (+2,500 TL), captain level-up bonus (level × 500 TL), offline passive income (15 TL/min)
- Spending: boat upgrades (2,500–28,000 TL), boat repair (250 TL), sea decision events (can cost credits)
- Displayed in top bar with flash animation on gain

---

### 5.3 Followers

- Represents social media audience
- Sources: content production, route completion rewards, ambient daily events during sea mode (small random gains)
- Sea decisions can give follower gains (e.g., content opportunity event: +220 followers)
- No follower loss mechanism currently
- Used to unlock sponsor tiers and as a career goal metric (target: 1,000,000)

---

### 5.4 Captain XP and Level

- XP earned: content production (+20), sea decision resolved (+30), route completed (+80)
- Level determined by XP threshold lookup from CAPTAIN_LEVEL_THRESHOLDS array
- 15 levels total (max XP for max level: 25,000)
- Level-up detected via `useEffect` on `captainXp` change
- On level-up: `newLevel × 500 TL` bonus credited, logged to event log
- No toast on level-up (currently — this is a UX gap)

---

### 5.5 Daily Goals

- 3 goals per day: produce_content, complete_route, buy_upgrade
- Theme rotates daily (date-based hash from DAILY_GOAL_THEMES array, 3 themes: "Büyüme Günü", "Tekne Hazırlığı", "Sponsor Yolculuğu")
- Reset happens when `step === "HUB"` and current date ≠ `lastDailyReset`
- On reset: goals regenerated fresh, `dailyRewardClaimed` set to false
- On 3/3 completion: +2,500 TL reward, `dailyRewardClaimed` set to true, `hasCompletedDailyGoalsOnce` set to true
- Daily goals card is rendered at the top of the Liman tab, always visible
- Visual states: uncompleted (○), completed (✓), all done card gets `.daily-goals-done` class

---

### 5.6 Content Production

- Triggered manually by player from the İçerik tab
- Requires: platform selected + content type selected + cooldown elapsed
- 30-minute real-time cooldown after each production
- Quality score calculation (0–100):
  - Base: 40
  - + Captain content skill × 5 (max +25)
  - + 10 if content type is in platform's `bestContentTypes`
  - + 10 for specific platform/type combos (viewTube+boat_tour/maintenance/sailing, clipTok+nature_bay/sailing/storm, instaSea+marina/city/nature, facePort+marina/boat/diary)
  - + `upgradeContentBonus` (sum of all purchased upgrade contentQuality effects)
  - + 5 at marina, +5/+10/+15 depending on route contentPotential when at sea
  - ± random 0–25 (can subtract up to 10, add up to 15)
  - Clamped to 0–100
- Platform multipliers on gains:
  - viewTube: credits ×1.5, followers ×1.0
  - clipTok: credits ×0.8, followers ×1.8
  - instaSea: credits ×1.1, followers ×1.3
  - facePort: credits ×1.0, followers ×1.1
- On viral (if triggered): followers ×3, credits ×2
- A rich comment text is selected from CONTENT_COMMENTS based on content type and quality band (low/medium/high/viral), 64 possible comments total

---

### 5.7 Content Cooldown

- 30 minutes real-time (`CONTENT_COOLDOWN_MS = 30 * 60 * 1000`)
- Tracked via `lastContentAt` timestamp (null = no cooldown active)
- A `setInterval` ticks every 30 seconds to refresh the cooldown display
- Cooldown state check: `Date.now() - lastContentAt < CONTENT_COOLDOWN_MS`
- Remaining time displayed in button text: "X dk sonra tekrar üret"
- If player tries to produce while on cooldown: a log message appears but nothing happens

---

### 5.8 Platforms and Content Types

**4 active platforms:**
| ID | Name | Best for |
|---|---|---|
| viewTube | ViewTube | High revenue, long video, sponsor trust |
| clipTok | ClipTok | Fast follower growth, viral |
| instaSea | InstaSea | Lifestyle, sponsor matching, visual |
| facePort | FacePort | Loyal audience, community |

**8 content types (6 always, +2 in sea mode):**
| ID | Label | Sea Only |
|---|---|---|
| marina_life | Marina Yaşamı | No |
| boat_tour | Tekne Turu | No |
| maintenance_upgrade | Bakım / Upgrade | No |
| city_trip | Şehir Gezisi | No |
| nature_bay | Koy / Doğa | No |
| sailing_vlog | Seyir Vlogu | No |
| ocean_diary | Deniz Günlüğü | Yes |
| storm_vlog | Fırtına / Olay | Yes |

The UI shows a green "✓" indicator on content types that match the selected platform's `bestContentTypes` list.

---

### 5.9 Route Readiness

The Rota tab compares 6 stat values against the current route's minimum requirements. The 6 values are all derived from **purchased upgrades**, not from current resource bars:

| Check | Derived from |
|---|---|
| Okyanus Hazırlığı | `base (by boat) + sum(upgrade.effects.oceanReadiness)` |
| Enerji | `sum(upgrade.effects.energy)` |
| Su | `sum(upgrade.effects.water)` |
| Güvenlik | `sum(upgrade.effects.safety)` |
| Navigasyon | `sum(upgrade.effects.navigation)` |
| Bakım | `sum(upgrade.effects.maintenance)` |

Failing readiness does not prevent the voyage from starting. It increases the `readinessPenalty` multiplier that causes slightly more resource drain per sea day.

---

### 5.10 Sea Day Progression

Each "Bir Gün İlerle" click:
1. 30% chance: triggers a random sea decision event (blocks advance until resolved)
2. Otherwise: reduces voyageDaysRemaining by 1, applies resource drain
3. Resource drain formula (per day):
   - Energy: 5% base, −1 if upgradeEnergyBonus > 10, −2 if > 20; +1 if readinessPenalty > 0
   - Water: 4% base, −1 if upgradeWaterBonus > 10, −2 if > 20; +1 if readinessPenalty > 1
   - Fuel: 3% base; +1 if readinessPenalty > 2
4. If any resource reaches 0: boatCondition −4
5. Random boat condition event (15–30% chance of 1–3 damage, reduced by upgradeRiskReduction)
6. Random ambient event selected from 6–7 events (good or bad flavor text)
7. If voyageDaysRemaining ≤ 0: step changes to ARRIVAL_SCREEN

---

### 5.11 Sea Decision Events

10 events defined in `SEA_DECISION_EVENTS`. Each has two choices with different effect tradeoffs. Trigger: 30% chance when advancing a day.

Summary of event themes and typical tradeoffs:
| Event | Choice A | Choice B |
|---|---|---|
| Yakıt Krizi | +fuel, −credits, +days | −fuel, −boat (save time) |
| Fırtına Yaklaşıyor | −energy, +days (safe route) | −boat, −water (push through) |
| Teknik Arıza | −credits, −energy (fix now) | −boat (ignore) |
| İçerik Fırsatı | −energy, +followers, +credits | +energy (rest) |
| Ani Rüzgar Değişimi | −energy, +days, +boat | −boat, −energy (push) |
| Gece Vardiyası | +energy, +days | −energy, −water |
| Koyda Demirleme | +water, +energy, +days | −energy, −boat |
| Riskli Çekim | +followers, +credits, −energy, −boat | +boat, +energy |
| Balıkçı Teknesi | −credits, +boat, +fuel | −fuel, −boat |
| Ekipman Sabitleme | −energy, +boat | −boat, −days (boat condition +1 from negative days delta) |

---

### 5.12 Arrival Rewards

Computed by `getRouteCompletionRewards()`:
- Credits: `5,000 × riskLevel multiplier`
- Followers: `2,500 × contentPotential multiplier`

Risk multipliers: low=0.8, low_medium=0.9, medium=1.0, medium_high=1.25, high=1.5, very_high=2.0, final=2.5  
Content multipliers: low=0.75, low_medium=0.9, medium=1.0, medium_high=1.25, high=1.5, very_high=2.0

---

### 5.13 Sponsor Offers

- Player taps "Teklifleri Kontrol Et" to manually check for offers
- `getSponsorTierByFollowers()` finds the highest tier the player qualifies for (followers + brandTrust)
- If tier found: creates a new offer object with a random brand name, the tier's reward range, and adds to `sponsorOffers` array
- If no tier: logs "no offer available" message
- Accepting a sponsor: random reward within tier range, credits credited, brand name added to `acceptedSponsors`, `sponsoredContentCount` incremented
- Every 3rd accepted sponsor: negative flavor log (audience saturation warning) instead of brandTrust increase
- Otherwise: `brandTrust += 2` on each acceptance
- Brand Trust starts at 10, increases slowly via sponsor acceptance

**5 Sponsor Tiers:**
| Tier | Name | Min Followers | Min Trust | Reward Range |
|---|---|---|---|---|
| micro | Mikro Sponsor | 800 | 10 | 2,000–8,000 TL |
| small | Küçük Sponsor | 8,000 | 20 | 8,000–25,000 TL |
| medium | Orta Sponsor | 100,000 | 35 | 25,000–80,000 TL |
| large | Büyük Sponsor | 300,000 | 55 | 80,000–250,000 TL |
| global | Global Sponsor | 750,000 | 75 | 250,000–750,000 TL |

---

### 5.14 Active Sponsors

Accepted sponsor names are stored as strings in the `acceptedSponsors` array. The most recent one is displayed in the content career card. All accepted sponsors are shown as badges in the sponsor sub-tab. There is no active sponsor mechanic (no ongoing requirement or duration) beyond the name display.

---

### 5.15 Boat Upgrades

- 27 upgrades across 10 categories
- Each upgrade has: name, cost, installDays, marinaRequirement, effects (up to ~4 stats), compatibility notes per boat
- Installation is real-time: `installDays × 30 minutes`
- Checked every 30 seconds via `setInterval`
- Only one upgrade can be installing at a time
- `purchasedUpgradeIds` array tracks completed upgrades (these affect all stat calculations)
- Effects applied to `energy`, `water`, `boatCondition` as immediate % increases; other stats (safety, navigation, etc.) are computed derivations used for readiness

**Upgrade size types:** small (no or 0 installDays), medium, large, ocean  
**Marina requirement types:** any, medium, large, shipyard (note: marina requirement is displayed but not currently enforced in game logic — it is informational only)

---

### 5.16 Upgrade Installation Time

Real-time wait, computed from `getUpgradeInstallMs()`:
- If `installDays > 0`: `installDays × 30 minutes`
- Fallback by cost/size if installDays is 0: large/ocean or cost≥15,000 → 30 min; medium or cost≥7,000 → 15 min; else 5 min

Timer tracked via `upgradeInProgress.completesAt` timestamp. On load: if timer expired offline, upgrade completes immediately.

---

### 5.17 Boat Condition

`boatCondition` is a 0–100% value. It is:
- Drained by: sea day random damage, resource depletion at sea, negative sea decisions
- Replenished by: marina rest (+10), boat repair (+35, costs 250 TL), some upgrade effects
- There is no game-over when it reaches 0, but it means the boat takes extra damage and voyages become harder

---

### 5.18 Achievements

See Section 4.13 above. Auto-unlocked when conditions are met. Toast notification fires. No credit/XP reward. The `hasCompletedDailyGoalsOnce` boolean unlocks the "Hedefe Kilitlen" achievement.

---

### 5.19 Notifications (Toasts)

See Section 4.14. One toast at a time, queued. No rich formatting, no tier system currently — all notifications use the same flat toast component.

---

### 5.20 Save / Load

See Section 4.15. Auto-save on every state change. Single save slot. `localStorage` only. No cloud save. Offline passive income credited on load.

---

## 6. Data and State Map

### App-Level State (in App.tsx, ~35 variables)

**Game flow:**
- `step: Step` — current screen/phase ("MAIN_MENU" | "PICK_PROFILE" | "PICK_MARINA" | "PICK_BOAT" | "NAME_BOAT" | "HUB" | "SEA_MODE" | "ARRIVAL_SCREEN")
- `activeTab: Tab` — active hub tab ("liman" | "icerik" | "rota" | "tekne" | "kaptan")

**Onboarding selections:**
- `profileIndex` — index into PLAYER_PROFILES array (0–5)
- `marinaIndex` — index into STARTING_MARINAS array (0–9)
- `marinaFilter` — "all" | "ege" | "akdeniz" | "marmara"
- `boatIndex` — index into STARTING_BOATS array (0–2)
- `boatName` — string, player-chosen boat name

**Economy:**
- `credits` — number, current TL balance
- `followers` — number, current follower count
- `captainXp` — number, accumulated XP
- `captainLevel` — number 1–15 (derived from XP but stored separately)

**Voyage / Sea:**
- `voyageTotalDays` / `voyageDaysRemaining` — duration set on voyage start
- `currentLocationName` — string, last port name
- `currentRouteId` — RouteId string
- `completedRouteIds` — string array
- `worldProgress` — number (set to currentRoute.worldProgressPercent on arrival)
- `energy`, `water`, `fuel`, `boatCondition` — 0–100

**Sea events:**
- `currentSeaEvent` — current event text displayed in sea mode
- `pendingDecisionId` — string | null (ID of active sea decision event)

**Content:**
- `selectedPlatformId` — PlatformKey | null
- `selectedContentType` — ContentType | null
- `contentResult` — ContentResult | null (shown after production)
- `lastContentAt` — timestamp | null (for cooldown)
- `totalContentProduced` — count for achievements
- `firstContentDone` — boolean (simpler check, used for early guidance)

**Upgrades:**
- `purchasedUpgradeIds` — string array of completed upgrade IDs
- `upgradeInProgress` — { upgradeId, completesAt } | null
- `selectedUpgradeCategory` — UpgradeCategoryId

**Sponsors:**
- `brandTrust` — 0–100 (starts at 10)
- `sponsorOffers` — array of offer objects { id, brandName, tierName, tierId, minReward, maxReward }
- `acceptedSponsors` — string array of accepted brand names
- `sponsoredContentCount` — count for saturation warning logic
- `icerikSubTab` — "produce" | "sponsor"

**Daily goals:**
- `dailyGoals` — DailyGoal[] (3 items with id, title, type, completed)
- `lastDailyReset` — date string "YYYY-MM-DD"
- `dailyRewardClaimed` — boolean
- `hasCompletedDailyGoalsOnce` — boolean (for achievement)

**UI/feedback:**
- `flashCredits` / `flashFollowers` — boolean (600ms animation triggers)
- `toastQueue` — ToastItem[]
- `activeToast` / `isToastLeaving` — active toast management
- `logs` — string[] (last 5 event log entries)
- `hasSave` / `saveBoatName` — for main menu "Continue" button

### Derived / Computed Values (not stored, recalculated each render)

- `purchasedUpgradeObjects` — upgrade objects from purchasedUpgradeIds
- `currentOceanReadiness` — baseOcean + sum(upgrade.oceanReadiness), capped 100
- `upgradeEnergyBonus`, `upgradeWaterBonus`, `upgradeSafetyBonus`, `upgradeNavigationBonus`, `upgradeMaintenanceBonus`, `upgradeContentBonus`, `upgradeRiskReduction` — each is sum of corresponding effect from purchased upgrades
- `currentRouteReadinessItems` — array of 6 {current, required} objects
- `currentRouteReadinessGapCount` / `hasRouteReadinessGap` — readiness failure flags
- `totalRoutesCompleted` / `totalUpgradesStarted` — for achievements
- `achievementStatuses` — full 13-item array with unlocked boolean evaluated each render

---

## 7. File and Component Map

### Application Shell
| File | Role |
|---|---|
| `src/main.tsx` | React entry point, renders `<App />` |
| `src/App.tsx` | Root component (~2,210 lines): all state, game logic, render functions for 3 tabs inline |
| `src/App.css` | Main stylesheet (~3,000+ lines): all visual rules |
| `src/index.css` | Global reset + base rules |

### Screen/Component Files
| File | Controls |
|---|---|
| `src/components/Onboarding.tsx` | Main menu, profile selection, marina selection, boat selection, boat naming |
| `src/components/HubScreen.tsx` | Hub/sea wrapper, top bar, bottom tab navigation |
| `src/components/LimanTab.tsx` | Liman tab content (hub mode only) |
| `src/components/SeaModeTab.tsx` | Sea mode content (replaces Liman tab in SEA_MODE) |
| `src/components/RotaTab.tsx` | Rota tab content |
| `src/components/KaptanTab.tsx` | Kaptan tab content (captain profile + achievements) |

**Note:** İçerik tab and Tekne tab are rendered inline in `App.tsx` via `renderIcerikTab()` and `renderTekneTab()`. They are not separate component files. The Daily Goals card and Progress Strip are also rendered inline in `App.tsx`.

### Game Data Files (in `/game-data/`)
| File | Contains |
|---|---|
| `game-data/playerProfiles.ts` | 6 captain profiles with skills, advantage/disadvantage, platform fit |
| `game-data/marinas.ts` | 10 starting marinas with bonus, disadvantage, first route options |
| `game-data/boats.ts` | 3 starting boats with stats, costs, compatibility; STARTING_BUDGET = 150,000 |
| `game-data/routes.ts` | 17 world routes with requirements, rewards, duration, descriptions, feelings |
| `game-data/economy.ts` | Currency definitions, sponsor tiers, content income ranges, token rules |
| `game-data/socialPlatforms.ts` | 5 platforms with best content types, revenue/viral/follower power ratings |
| `game-data/upgrades.ts` | 27 upgrades across 10 categories with effects, cost, install time, compatibility |

### UI Label/Icon Mapping Files (in `/src/data/`)
| File | Contains |
|---|---|
| `src/data/labels.ts` | skillLabels (6 skill names in Turkish), profileIcons (emoji per profile), ratingToScore |
| `src/data/marinas.ts` | marinaIcons (emoji per marina ID) |
| `src/data/boats.ts` | boatClassMeta (label, tone, summary per boat size class) |

### Types
| File | Contains |
|---|---|
| `src/types/game.ts` | Step, Tab, ContentResult, MarinaFilter type definitions |

### Inline Type Definitions (inside App.tsx)
- `UpgradeInProgress`, `SeaDecisionEffect`, `SeaDecisionChoice`, `SeaDecisionEvent`
- `DailyGoal`, `ToastType`, `ToastItem`
- `AchievementProgress`, `AchievementDefinition`

### Assets
| Path | Description |
|---|---|
| `src/assets/hero.png` | Image file (usage in CSS not confirmed in current read) |
| `public/favicon.svg` | App favicon |
| `public/icons.svg` | Icon sprite (exact usage not confirmed in current read) |

---

## 8. Current UX/UI Problems Based on the Code

The following are structural and visual problems identifiable directly from the code. This section does not propose solutions — it only documents what the code reveals.

### Visual Hierarchy

- **All dark cards look the same.** The Liman tab stacks: daily goals card, quest card, boat visual, 2 progress cards, guide checklist card, marina service card, event log card — all with similar dark backgrounds and similar text density. No card has significantly more visual weight than any other.
- **The "Kaptan Tavsiyesi" next-action card** is a good concept (intelligent next step), but it lives in the progress strip beneath the top bar, which is a low-attention area. It is easily missed.
- **Route readiness shows obstacles, not destinations.** The first thing a player sees in the Rota tab is a list of failing requirements — before they even see where they are going.
- **The arrival reward screen** uses `transparent-card centered arrival-screen-card` within the same cinematic background as onboarding. It is better than a toast, but the content is laid out as a text card, not as a celebration.

### Card Clutter

- The Liman tab has 5–6 distinct cards visible simultaneously, plus a bottom nav bar. On a 390px screen this requires significant scrolling.
- The Tekne tab shows all upgrade cards for the selected category at once — some categories have 3 cards, each with description, strategy hint, details grid, warning badge, effect badges, and a buy button. This is dense.
- The İçerik tab combines platform selection grid, content type pills, content career card, helper hint, and a produce button — all before any interaction.

### Too Much Text

- The content career card always shows a title + text + meta + highlight, which totals 3–4 lines of small text for contextual information.
- Upgrade cards have: name, description, strategy hint (a second description), details grid, warning badge (sometimes), effect badges, and button. A minimum of 5–6 text elements per card.
- The route card shows: name, risk badge, difficulty label, description, feeling quote, duration, content potential, readiness section, button. Nearly the full route spec is printed.
- The captain career card shows: rank label, career narrative text, level + XP + routes meta line — all as plain text.

### Weak Emotional Reward Moments

- **Level-up** has no toast notification. Credits are added and a log line appears. There is no visual moment. A level-up is currently completely invisible to the player unless they happen to see the event log update.
- **Sponsor acceptance** adds credits and shows a log line. There is no toast for the acceptance itself (there is a toast when a *new offer arrives*, but not when one is accepted).
- **Achievement unlocks** fire a toast but have no visual treatment beyond the badge changing from ○ to 🏅 in the Kaptan tab.
- **Daily goals 3/3** credits 2,500 TL and adds a log line. The card shows "Tüm görevler tamamlandı!" but there is no celebratory animation or sound.

### Unclear Next Action

- Outside of the "Kaptan Tavsiyesi" card in the progress strip, there is no persistent in-context guidance. If the player dismisses or scrolls past the strip, they are on their own.
- The bottom tab bar has notification badges only for İçerik (if first content not done) and Rota (if first content done but no routes done). No badge for sponsor offers, upgrade completion, or level-up.
- In sea mode, the other tabs (İçerik, Rota, Tekne) still appear in the nav bar, which may confuse players who do not know they can still produce content while at sea.

### Route Fantasy Visibility

- The world tour has 17 routes with beautifully written `description` and `feeling` fields in the data. However, the route card renders only the description (as "Yolculuk Notu") and feeling (as a quoted section). There is no visual map, no geographic illustration, no route progress dots.
- `worldProgress` is tracked as a percentage but displayed only as a raw number. There is no arc or map showing where in the world the player is.
- The next route preview below the current route card is small and styled the same as secondary content.

### Notification Weakness

- Single-tier toast system handles all notifications. Level-up (a major milestone) gets the same visual treatment as "İçerik yayınlandı" (a routine action).
- Toast queue means multiple simultaneous events (route complete + achievement unlock + level-up all firing at once) are serialized and can feel slow or missed.
- Toasts appear at the **top** of the screen (fixed position), which may be under system UI on some Android devices.

### Onboarding Clarity

- The 6 captain profiles each show 3 skill bars with numeric values (1–5). For a new player, "Denizcilik: 5" and "İçerik: 2" requires understanding what those skills do before the choice is meaningful.
- The profile cards show advantage and disadvantage text, but the tradeoff impact on gameplay is abstract — a new player cannot feel what "viral şans başlangıçta düşüktür" actually means.
- The boat selection shows a budget calculator, but the financial implication (65,000 TL remaining for the Atlas 40 vs. 115,000 TL for the Kırlangıç) is not framed in terms of how many upgrades or routes that means.
- The step label says "5 adım" (5 steps) but there are effectively 4 meaningful choices (profile, marina, boat, name) — the main menu is listed as step 0 implicitly, making the "1/5" label on the profile screen slightly off by convention.

### Mobile Readability

- The bottom tab bar uses raw emoji (🏠 📹 🗺️ 🔧 👤) as tab icons. On different Android browsers and versions, emoji rendering varies significantly and can feel inconsistent.
- Tab labels are text strings ("Liman", "İçerik", "Rota", "Tekne", "Kaptan") displayed below the emoji. Combined with the icon, this creates a tall touch target but the visual hierarchy between icon and label is unclear.
- The main font is `system-ui` — on Android, this maps to Roboto; on iOS, to San Francisco. No explicit font is loaded, meaning rendering varies by platform.
- No specific handling of Android bottom navigation bar safe area is confirmed in the current CSS review.

---

## 9. UX/UI Redesign Constraints

The following must remain fully intact and functional through any redesign process. These are not changeable as part of a UX/UI redesign:

### Must NOT be broken:
- **Save/load system** — `yelkenli_save` localStorage key, version 2, all state variables, offline income calculation, upgrade completion on load
- **Economy values** — starting budget 150,000 TL, boat prices, upgrade costs, route rewards, sponsor tier thresholds, daily goal bonus, captain level bonuses, content income formula
- **Progression logic** — achievement unlock conditions, captain XP thresholds and level calculations, world tour route order and progress percentages
- **Daily goal logic** — goal types, theme rotation, reset timing, 3/3 reward
- **Content cooldown** — 30-minute timer, lastContentAt timestamp, per-session tick logic
- **Route readiness system** — the 6 upgrade-stat-vs-requirement comparison, the gap-count-based resource drain penalty
- **Sea mode logic** — resource drain per day, decision event trigger probability, advanceDay mechanics
- **Sponsor unlock logic** — tier requirements, brand trust accumulation, offer generation, saturation warning at every 3rd acceptance
- **Achievement unlock logic** — all 13 conditions
- **Content quality formula** — base score, skill bonus, platform match bonus, upgrade bonus, location bonus, random variance, viral chance thresholds

### May be redesigned (visual/UX only, no logic changes):
- All visual styling (CSS)
- Component layout and ordering within screens
- Card styles, typography, colors, spacing
- Navigation structure (within same 5-tab framework unless logic also changes)
- Toast visual treatment (can add tiers, but underlying pushToast calls must stay)
- Onboarding visual presentation (not the step order or logic)
- How readiness information is displayed (can be reordered, collapsed, etc.)
- How rewards are presented (can be a modal instead of inline card)

---

## 10. Suggested Redesign Approach

A redesign should be done in safe, independent batches so that each batch can be tested and committed separately. No batch should require another batch to be complete first (except Batch 1 which establishes visual foundations used by all later batches).

### Batch 1: Global Visual Foundation
**Goal:** Establish the core visual language before touching any screens.  
**What this includes:**
- New color token definitions in CSS (warm gold for primary CTAs, deeper navy for backgrounds, copper/sunset tones for warnings)
- New button classes (warm gold primary, ghost secondary, disabled states)
- Updated card base styles (glass card with top-rim light catch, consistent border-radius system)
- Ambient ocean background extracted from onboarding and made available as a persistent app-level layer
- New typography scale if any font changes are needed
- CSS animation vocabulary standardized (entrance animations, glow pulses, flash states)  
**Risk:** Low — pure CSS, no logic.

### Batch 2: Main Menu and Onboarding
**Goal:** Make the first impression cinematic and the profile/boat choices feel like identity choices, not stat selection.  
**What this includes:**
- Main menu visual polish and button treatment
- Profile selection — replace skill bars with plain-language strengths/weaknesses
- Marina selection — improved visual hierarchy, better selected state
- Boat selection — cleaner card layout, budget framing improved
- Boat naming screen — visual improvements only  
**Risk:** Low — Onboarding.tsx visual changes only.

### Batch 3: Hub (Liman Tab)
**Goal:** Make the hub feel like home, with the boat as the visual hero and a clear "what's next" anchor.  
**What this includes:**
- Boat visual elevated in prominence
- Daily goals card redesigned to feel like a primary action, not a secondary card
- Quest card (next action) redesigned with clearer hierarchy
- Progress cards (world tour %, ocean readiness) improved visual treatment
- Marina service section condensed or made collapsible
- Event log collapsed by default  
**Risk:** Low-medium — LimanTab.tsx + renderDailyGoalsCard visual changes.

### Batch 4: Route Selection and Sea Mode
**Goal:** Make routes feel like real destinations and sea mode feel like being at sea.  
**What this includes:**
- Route card redesigned as a destination hero card (atmospheric treatment)
- Readiness items condensed to scannable status indicators
- World tour progress visualized as route dots or a journey arc (not just %)
- Sea mode: boat animation more prominent, resources condensed to single row
- Sea decision event card redesigned as a dramatic full-attention moment  
**Risk:** Low-medium — RotaTab.tsx and SeaModeTab.tsx visual changes.

### Batch 5: Reward and Notification System
**Goal:** Make every milestone feel earned. Create a three-tier notification hierarchy.  
**What this includes:**
- Arrival screen redesigned as a full celebration with animated reward numbers
- Level-up toast/moment added (currently missing)
- Daily goals 3/3 celebration moment
- Three notification tiers: ambient pill (minor gains), full-width banner (milestones), full-screen modal (route complete, level-up)
- Toast component updated with richer visual treatment  
**Risk:** Medium — requires adding new UI states and wiring into existing logic trigger points.

### Batch 6: Content, Sponsor, Upgrade, and Captain Tabs
**Goal:** Reduce text load, improve visual hierarchy within each tab.  
**What this includes:**
- İçerik tab: cooldown state as a visible card (not as disabled button text), platform/type selection cleaned up
- Sponsor tab: remove manual "check offers" button pattern, show tier progress more emotionally
- Tekne tab: upgrade cards condensed, category pill bar reduced from 10 to ~4 visible priority categories, boat readiness more prominent
- Kaptan tab: replace skill bars with career stats, achievement badges improved, locked badges as silhouettes  
**Risk:** Medium — multiple inline render functions in App.tsx affected.

### Batch 7: Final Polish
**Goal:** Cross-cutting improvements after core redesign batches are complete.  
**What this includes:**
- Replace emoji tab icons with consistent SVG icon set
- Staggered card entrance animations applied consistently
- Review all mobile touch targets (minimum 44px)
- Test on 360×800 and 390×667 screen sizes
- Verify safe area handling for bottom nav bar on Android  
**Risk:** Low.

---

*End of Game Structure Brief*  
*Source: Full codebase inspection, May 2026*  
*This document is read-only. Do not implement any changes based on this document alone.*
