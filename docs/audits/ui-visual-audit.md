# UI Visual Audit — Yelkenli Yaşam Tycoon

**Task:** UI-VISUAL-AUDIT-01  
**Date:** 2026-05-15  
**Auditor method:** Read-only code/CSS review + automated Playwright screenshots + `npm run build` / `lint` / `audit:game` / `audit:mobile-ui`  
**Dev server:** `http://localhost:5174/` (Vite)  
**Evidence folder:** `docs/audits/screenshots/` (suffix `390x844`, `390x640`, `1280x720` where captured)

---

## Audit coverage statement

| Area | Status |
|------|--------|
| Onboarding (welcome → gender) | **Rendered** — multiple screenshots |
| Main menu | **Rendered** |
| HUB tabs (liman, içerik, rota, tekne, kaptan) | **Rendered** (v2 set, post–celebration dismiss) |
| Content result | **Rendered** — `hub-content-result-v2-390x844.png` |
| Arrival screen | **Rendered** — `arrival-v2-390x844.png`, `arrival-v2-1280x720.png` |
| Tutorial Miço overlay | **Rendered** — `hub-liman-fresh-390x844.png` |
| Sea Mode (in-voyage UI + decision) | **Not reliably rendered** — automated save load returned HUB Liman (`sea-mode-v2-390x844.png` matches liman). **Manual device pass required before release.** |
| Achievement / sponsor / level-up modals | **Partial** — modals captured in failed hub runs; v2 used low XP to avoid most popups |
| Viewport matrix A–G | **Partial** — primary: 390×844, short: 390×640, desktop frame: 1280×720. **Not captured this run:** 430×932, 390×700, 412×915, 1440×900 |
| DEV test panel (`testMode`) | **Not exercised** — marked DEV-ONLY below |

**This audit is evidence-based for captured screens. It does not claim “all clear” for Sea Mode or every viewport without screenshots.**

---

## Tooling results (non-UI, context only)

| Command | Result |
|---------|--------|
| `npm run build` | PASS |
| `npm run lint` | **FAIL** — 2× `react-hooks/rules-of-hooks` on `grantTokens` in `App.tsx` (~1994, ~2156) |
| `npm run audit:game` | PASS (2 route-balance WARN, out of UI scope) |
| `npm run audit:mobile-ui` | PASS (CSS guardrails for boat CTA, sea choice preview, helper classes) |

---

## 1. Executive summary

The game has a **coherent nautical dark theme**, usable onboarding, and a **strong main menu + arrival moment** that already feel closer to a mobile game than a generic web panel. Typography tokens (Sora/Inter), glass cards, and ocean palette in `src/styles/tokens.css` show intentional art direction.

However, **release-ready App Store / Play visual quality is not met yet.** The HUB still reads as a **stacked dashboard** (daily bonus + progress strip + “Kaptan Tavsiyesi” + large hero) rather than a focused captain’s bridge. Several **production-facing polish leaks** (developer “Mobil İpucu” on boat pick, `v1.0` debug affordance, placeholder main-menu corner buttons) undermine trust. **Route tab on short viewports** likely hides the primary voyage CTA below heavy meta lists. **Sea Mode was not visually verified** in this run.

**Honest verdict:** Solid mid-production mobile UI with clear improvement path; **not shippable on visual quality alone** until P0 items below are fixed and Sea Mode is screenshot-verified on real devices.

---

## 2. Top 10 release-blocking / near-blocking UI problems

| # | ID | Severity | Problem | Evidence |
|---|-----|----------|---------|----------|
| 1 | UI-P0-001 | **P0** | **“Mobil İpucu” meta copy on boat selection** — explains scroll/CTA implementation to players; breaks immersion and screams prototype. | `onb-pick-boat-390x844.png` |
| 2 | UI-P0-002 | **P0** | **Main menu corner buttons (Ayarlar / Mağaza / Başarım / Sosyal)** appear as full UI but only `console.log` — players will tap and nothing happens. | `02-main-menu-390x844.png`, `Onboarding.tsx` |
| 3 | UI-P0-003 | **P0** | **HUB header vertical overload** — Daily login bonus + progress strip + next-action card consume ~35–40% of 390×844 before tab content; on 390×640 route list fills screen with **no visible “Rotaya Çık” CTA**. | `hub-liman-v2-390x844.png`, `hub-rota-v2-390x640.png` |
| 4 | UI-P0-004 | **P0** | **“Kaptan Tavsiyesi” title truncates** (“İlk içerik za…”) on Liman — primary guidance unreadable. | `hub-liman-v2-390x844.png` |
| 5 | UI-P0-005 | **P0** | **Sea Mode UI not validated in rendered audit** — cannot sign off voyage loop visuals, decision cards, resource bar, or advance-day CTA. | `sea-mode-v2-390x844.png` (shows Liman, not sea) |
| 6 | UI-P1-001 | **P1** | **`v1.0` fixed bottom-left control** doubles as hidden dev toggle — looks like debug build on every screen including store-first onboarding. | All screenshots |
| 7 | UI-P1-002 | **P1** | **Tekne tab stat grid shows all zeros** without “henüz yükseltme yok” empty state — reads broken, not “starter boat”. | `hub-tekne-v2-390x844.png` |
| 8 | UI-P1-003 | **P1** | **Tutorial first load shows “Yükleniyor…”** in content area before paint — first-impression jank. | `hub-liman-fresh-390x844.png` |
| 9 | UI-P1-004 | **P1** | **Onboarding step count inconsistency** — gender screen “ADIM 5 / 5” while boat is “ADIM 3 / 4”. | `onb-pick-gender-390x844.png`, `onb-pick-boat-390x844.png` |
| 10 | UI-P1-005 | **P1** | **Content → money → upgrade → route loop not obvious from Liman alone** — player must discover tabs; rota has orange dot but no single “career map” moment. | `hub-liman-v2-390x844.png` |

---

## 3. Screen-by-screen audit

Legend: ratings 1–10. Status: **PASS** / **NEEDS POLISH** / **BAD** / **RELEASE BLOCKER**

---

### SCREEN: Miço welcome (`WELCOME`)
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 8 |
| Typography | 8 |
| Mobile fit | 9 |
| Game feel | 8 |
| Clarity | 8 |

**Evidence:** `onb-welcome-slide0-390x844.png` (and slides 1–2 in batch)

**Findings:**
1. Strong character intro, typewriter, clear “Devam →” CTA — feels like a game opener.
2. `v1.0` in corner reduces polish (see UI-P1-001).

**Top 3 fixes:**
1. Hide or restyle version label for release builds.
2. Ensure slide text never clips on 390×640 (not captured — verify).
3. Add subtle motion on background (already starfield) — optional.

**Release verdict:** Should polish — acceptable for beta, not final store hero.

---

### SCREEN: Ana menü (`MAIN_MENU`)
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 8 |
| Typography | 9 |
| Mobile fit | 8 |
| Game feel | 8 |
| Clarity | 7 |

**Evidence:** `02-main-menu-390x844.png`, `onb-main-menu-390x844.png`

**Findings:**
1. **Best store screenshot candidate** — title, boat hero, gold CTA hierarchy work.
2. **P0:** Four corner buttons look production-ready but are non-functional placeholders.
3. Continue + New Game hierarchy is clear when save exists.

**Top 3 fixes:**
1. Remove or wire corner buttons; if future, show “Yakında” lock state.
2. Reduce hero vertical % on 390×640 so CTAs stay above fold.
3. Soften “Topluluk büyüyor” pill — reads filler.

**Release verdict:** Should polish before store listing (corner buttons).

---

### SCREEN: Profil seçimi (`PICK_PROFILE`)
**Overall status:** PASS  

| Criterion | Score |
|-----------|-------|
| Layout | 8 |
| Typography | 8 |
| Mobile fit | 8 |
| Game feel | 7 |
| Clarity | 8 |

**Evidence:** `03-pick-profile-390x844.png`, `onb-pick-profile-390x844.png`

**Findings:**
1. Miço bubble + swipe hint + stat bars = clear choice screen.
2. Slight **web-dashboard** feel from dense stat rows — acceptable for onboarding.
3. CTA “LİMANLARA BAK →” visible on 844 and 640.

**Top 3 fixes:**
1. Tighten Miço bubble height on short screens.
2. Animate profile swipe affordance (chevrons).
3. Reduce duplicate step screens in analytics naming.

**Release verdict:** Can ship with minor polish.

---

### SCREEN: Marina seçimi (`PICK_MARINA`)
**Overall status:** PASS  

| Criterion | Score |
|-----------|-------|
| Layout | 7 |
| Typography | 7 |
| Mobile fit | 7 |
| Game feel | 8 |
| Clarity | 7 |

**Evidence:** `04-pick-marina-390x844.png`, `onb-pick-marina-390x844.png`

**Findings:**
1. Map + tabs + detail sheet — strong **marina fantasy**.
2. **Dense** — many data rows (weather, stars, perks) fight for space; risk on 390×640 for CTA visibility (sticky actions exist in CSS — verify on device).
3. Search placeholder “Çıkış limanı” without working search — minor confusion.

**Top 3 fixes:**
1. Collapse detail sheet sections on short heights.
2. Sticky “SEÇİLEN LİMANI ONAYLA” — confirm safe-area on iOS.
3. Mark search as “Yakında” or remove.

**Release verdict:** Should polish density on short phones.

---

### SCREEN: Tekne seçimi (`PICK_BOAT`)
**Overall status:** RELEASE BLOCKER  

| Criterion | Score |
|-----------|-------|
| Layout | 7 |
| Typography | 7 |
| Mobile fit | 8 |
| Game feel | 6 |
| Clarity | 6 |

**Evidence:** `onb-pick-boat-390x844.png`, `onb-pick-boat-short-390x640.png`

**Findings:**
1. **P0:** Visible **“Mobil İpucu”** card is developer-facing copy in player UI.
2. Hero + stat grid + compat panel = high quality information design.
3. Sticky “BU TEKNEYİ SEÇ →” present; `audit:mobile-ui` guardrails PASS.

**Top 3 fixes:**
1. Remove `ui-helper-note` from production boat screen (or gate behind `import.meta.env.DEV`).
2. Replace with one-line player tip: “Kaydırarak diğer tekneleri gör.”
3. Reduce hero SVG height 10–15% on `max-height: 700px`.

**Release verdict:** Must fix before release.

---

### SCREEN: Tekne adı (`NAME_BOAT`)
**Overall status:** PASS  

| Criterion | Score |
|-----------|-------|
| Layout | 8 |
| Typography | 8 |
| Mobile fit | 8 |
| Game feel | 8 |
| Clarity | 9 |

**Evidence:** `onb-name-boat-390x844.png`

**Findings:**
1. Disabled “Devam” until name entered — good UX.
2. Random name pill is delightful.
3. Miço copy fits tone.

**Top 3 fixes:**
1. Show name preview earlier (already appears when typing).
2. Increase contrast on disabled CTA (still readable).
3. Align step label with gender step numbering.

**Release verdict:** Can ship.

---

### SCREEN: Cinsiyet seçimi (`PICK_GENDER`)
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 7 |
| Typography | 8 |
| Mobile fit | 8 |
| Game feel | 7 |
| Clarity | 8 |

**Evidence:** `onb-pick-gender-390x844.png`

**Findings:**
1. “DENİZE İNDİR” — excellent game verb.
2. **P1:** Step label **5/5** vs **3/4** elsewhere — breaks trust.
3. Gender options readable; default selection state subtle.

**Top 3 fixes:**
1. Unify step counter across onboarding.
2. Pre-select “Belirtmek istemiyorum” or highlight first tap target.
3. Reduce dead space above options on 640px height.

**Release verdict:** Should polish.

---

### SCREEN: HUB — Liman tab
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 6 |
| Typography | 7 |
| Mobile fit | 6 |
| Game feel | 6 |
| Clarity | 7 |

**Evidence:** `hub-liman-v2-390x844.png`, `hub-liman-fresh-390x844.png`

**Findings:**
1. **Dashboard stack:** login bonus + strip + tavsiye + hero boat + progress + next move + 2×2 resources.
2. Tavsiye **truncated** on this viewport.
3. Tutorial overlay (`hub-liman-fresh`) is warm but overlaps content; “Yükleniyor…” flash hurts.
4. Resource mini-cards are clear and colorful — good game feedback.

**Top 3 fixes:**
1. Collapse daily bonus to icon/badge after day 1 claim.
2. Merge progress strip + tavsiye OR dismiss tavsiye permanently after first tap.
3. Shrink hub boat hero 20% on hub tabs.

**Release verdict:** Should polish — not store hero until simplified.

---

### SCREEN: Progress strip + Kaptan Tavsiyesi
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 6 |
| Typography | 6 |
| Mobile fit | 5 |
| Game feel | 6 |
| Clarity | 6 |

**Evidence:** `hub-liman-v2-390x844.png`, `hub-rota-v2-390x844.png`

**Findings:**
1. Strip is **crowded** (level, XP, followers, 17 routes) at 11px — readable but busy.
2. Next-action card duplicates tutorial goals — cognitive overlap.
3. On 390 width, strip wraps to 2 lines — acceptable; on 640 height, pushes tab content down.

**Top 3 fixes:**
1. Iconify strip segments (anchor, users, globe).
2. Single “next best action” system (tutorial OR tavsiye, not both).
3. Increase strip font to 12px with fewer words (“Tur: 0/17”).

**Release verdict:** Should polish.

---

### SCREEN: Daily login bonus (banner)
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 7 |
| Typography | 7 |
| Mobile fit | 6 |
| Game feel | 7 |
| Clarity | 8 |

**Evidence:** All `hub-*-v2` screenshots

**Findings:**
1. Clear reward communication.
2. Competes with first-session tutorial for attention.
3. No screenshot of dismiss/claim interaction — verify animation.

**Top 3 fixes:**
1. Show only on claimable days; shrink after claim.
2. Move to modal on day 1, chip on later days.
3. Avoid covering safe-area on notched phones.

**Release verdict:** Should polish.

---

### SCREEN: Tutorial Miço (HUB overlay)
**Overall status:** PASS  

| Criterion | Score |
|-----------|-------|
| Layout | 7 |
| Typography | 7 |
| Mobile fit | 7 |
| Game feel | 8 |
| Clarity | 9 |

**Evidence:** `hub-liman-fresh-390x844.png`

**Findings:**
1. Copy is friendly, not a text wall.
2. “İçerik Üret →” + tab lock — clear forced path.
3. “Eğitimi Geç” visible — good escape hatch.

**Top 3 fixes:**
1. Remove loading placeholder behind overlay.
2. Slightly reduce avatar scale on 640 height (CSS exists — verify).
3. Pulse on İçerik tab in addition to dot.

**Release verdict:** Can ship with loading fix.

---

### SCREEN: Alt tab bar
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 7 |
| Typography | 6 |
| Mobile fit | 7 |
| Game feel | 6 |
| Clarity | 8 |

**Evidence:** All hub v2 screenshots

**Findings:**
1. Five tabs fit 390 width; labels readable.
2. Emoji icons consistent but **not premium** vs custom SVG set.
3. Notification dots (rota) work; locked tabs during tutorial OK.
4. `min-height: 44px` on short breakpoint — good touch targets.

**Top 3 fixes:**
1. Custom monochrome tab icons (active = cyan fill).
2. Shorten “Kaptan” → icon only on <360px if ever supported.
3. Safe-area padding — already in CSS; verify iOS home indicator.

**Release verdict:** Should polish for store tier.

---

### SCREEN: İçerik üretim (`icerik` tab)
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 7 |
| Typography | 7 |
| Mobile fit | 6 |
| Game feel | 7 |
| Clarity | 7 |

**Evidence:** `hub-icerik-v2-390x844.png`

**Findings:**
1. “Kaptan Medya Odası” + stats = **creator theme** lands.
2. Platform section starts below fold — player may not see platforms without scroll.
3. Sub-tab “İçerik Üret / Sponsorluklar” clear.

**Top 3 fixes:**
1. Reduce media room card height; platforms above fold.
2. Show one recommended platform pre-highlighted.
3. Cooldown state screenshot — **not captured**; verify separately.

**Release verdict:** Should polish.

---

### SCREEN: İçerik sonucu (`ContentResultCard`)
**Overall status:** PASS  

| Criterion | Score |
|-----------|-------|
| Layout | 8 |
| Typography | 8 |
| Mobile fit | 7 |
| Game feel | 8 |
| Clarity | 8 |

**Evidence:** `hub-content-result-v2-390x844.png`

**Findings:**
1. **VİRAL** badge + quality score — satisfying payoff visible.
2. Bottom of card near tab bar — confirm scroll on small screens.
3. Comment list not fully visible in capture — verify readability.

**Top 3 fixes:**
1. Brief confetti already in modal system — tie to result card.
2. Sticky “Yeni içerik” CTA above tab bar.
3. Larger quality number for screenshot moments.

**Release verdict:** Can ship — good reward moment.

---

### SCREEN: Rota tab
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 6 |
| Typography | 7 |
| Mobile fit | 5 |
| Game feel | 7 |
| Clarity | 6 |

**Evidence:** `hub-rota-v2-390x844.png`, `hub-rota-v2-390x640.png`

**Findings:**
1. World tour dots + upcoming list — **progression fantasy** works.
2. **390×640 capture shows no hero/CTA** — only meta cards; **P0 risk** that “Rotaya Çık” is off-screen.
3. Risk pills (Düşük-Orta, Orta Risk) — readable, game-like.
4. Route story quote on hero (when visible) — good flavor; not seen in short capture.

**Top 3 fixes:**
1. Pin `rt-cta-zone` sticky above tab bar on route tab.
2. Collapse “Önümüzdeki Rotalar” to 1 row until first voyage complete.
3. Open readiness sheet automatically when CTA locked.

**Release verdict:** Must fix short-viewport CTA visibility before release.

---

### SCREEN: Tekne / Upgrade tab
**Overall status:** NEEDS POLISH  

| Criterion | Score |
|-----------|-------|
| Layout | 7 |
| Typography | 7 |
| Mobile fit | 6 |
| Game feel | 6 |
| Clarity | 6 |

**Evidence:** `hub-tekne-v2-390x844.png`

**Findings:**
1. Ocean readiness 30% bar — good long-term goal.
2. **All upgrade stats show 0** — confusing; needs empty copy.
3. Upgrade cards / in-progress row **not in screenshot** — requires scroll audit.
4. Token speedup buttons — **not captured**.

**Top 3 fixes:**
1. Empty state: “İlk yükseltmeni al — rota için gerekli.”
2. Show one affordable upgrade pinned at top.
3. In-progress install timer visual test on device.

**Release verdict:** Should polish.

---

### SCREEN: Kaptan tab
**Overall status:** PASS  

| Criterion | Score |
|-----------|-------|
| Layout | 8 |
| Typography | 8 |
| Mobile fit | 8 |
| Game feel | 8 |
| Clarity | 8 |

**Evidence:** `hub-kaptan-v2-390x844.png`

**Findings:**
1. Strong **identity** screen — rank, XP bar, follower milestone.
2. Skills/achievements below fold — acceptable.
3. Readable hierarchy; not dashboard-flat.

**Top 3 fixes:**
1. Link achievement tease to unlock popup quality (not captured).
2. Reduce duplicate stats (strip vs tab).
3. Add captain portrait variation by gender.

**Release verdict:** Can ship — good retention screen.

---

### SCREEN: Sea Mode
**Overall status:** BAD (unverified)  

| Criterion | Score |
|-----------|-------|
| Layout | ? |
| Typography | ? |
| Mobile fit | ? |
| Game feel | ? |
| Clarity | ? |

**Evidence:** Automated capture **failed** (loaded HUB). Code review: `SeaModeTab.tsx` has choice preview pills, resource warnings, day dots — likely acceptable **if** layout matches CSS.

**Findings:**
1. **Cannot grade without screenshot** — release blocker for audit sign-off.
2. `audit:mobile-ui` confirms choice preview CSS exists.

**Top 3 fixes:**
1. Manual screenshot pass: event card, advance day, depleted resources, 390×640.
2. Ensure sea tab uses wave background distinct from liman.
3. Sticky advance-day CTA above tab bar.

**Release verdict:** Must fix / must verify before release.

---

### SCREEN: Varış (`ARRIVAL_SCREEN`)
**Overall status:** PASS  

| Criterion | Score |
|-----------|-------|
| Layout | 9 |
| Typography | 8 |
| Mobile fit | 8 |
| Game feel | 9 |
| Clarity | 8 |

**Evidence:** `arrival-v2-390x844.png`, `arrival-v2-1280x720.png`

**Findings:**
1. **Second-best store screenshot** — gold title, reward cards, world tour dots.
2. Count-up animation (code) — premium feel.
3. Story helper note slightly utilitarian but OK.
4. Desktop: centered 390px frame — good marketing crop.

**Top 3 fixes:**
1. Tune `ar-feeling` quote line-height for long Turkish strings.
2. Ensure prestige variant tested visually.
3. Button “Marinaya giriş yap” — confirm contrast on OLED low brightness.

**Release verdict:** Can ship — polish copy spacing only.

---

### SCREEN: Celebration modals (sponsor / level-up)
**Overall status:** NEEDS POLISH (component quality OK)  

| Criterion | Score |
|-----------|-------|
| Layout | 8 |
| Typography | 8 |
| Mobile fit | 8 |
| Game feel | 7 |
| Clarity | 9 |

**Evidence:** `hub-rota-390x844.png` (sponsor), `hub-rota-clear-390x844.png` (level-up) from blocked runs

**Findings:**
1. Sponsor modal copy is clear; handshake emoji fine.
2. Level-up modal readable — gold circle works.
3. Risk: **modal stacking** on load if save triggers multiple celebrations.

**Top 3 fixes:**
1. Queue celebrations; never block tab navigation silently.
2. Replace emoji with branded icon set.
3. Add haptic/sound hook on dismiss (platform).

**Release verdict:** Should polish queue behavior.

---

### DEV-ONLY: Test panel (`testMode`)
**Overall status:** IGNORE FOR RELEASE UI  

Toggled via `v1.0` button (`App.tsx` ~3119). Red “TEST ACTIONS” panel with economy cheats. **Do not judge app quality by this panel.** Ensure release builds disable tap or hide control.

---

## 4. Mobile viewport audit (partial matrix)

| Viewport | Tested | Key findings |
|----------|--------|--------------|
| **A 390×844** | Yes | Primary reference. HUB dense; onboarding OK; arrival strong. |
| **B 430×932** | No | — |
| **C 390×700** | No | Boat onboarding has CSS `@media (max-height: 700px)` — guardrail only. |
| **D 390×640** | Yes | Route tab: **CTA not visible** in capture. Onboarding boat CTA still present. |
| **E 412×915** | No | — |
| **F 1280×720** | Yes | `.game-wrapper { max-width: 390px }` — letterboxed phone frame; OK for dev, use phone crops for store. |
| **G 1440×900** | No | — |

**Cross-viewport patterns:**
- Sticky bottom tab bar: consistent.
- Safe-area: referenced in CSS (`env(safe-area-inset-*)`) — not device-tested.
- Turkish long strings: truncation on tavsiye card confirmed.

---

## 5. Design system audit

### Extracted tokens (`src/styles/tokens.css`)

| Token | Values |
|-------|--------|
| Ocean palette | `--ocean-deep` #06182c, `--ocean-mid`, `--ocean-rim` |
| Accents | `--cyan-glow` #5eeaf8, `--gold-bright` #ffd982 |
| Semantic | `--success-green`, `--warning-amber`, `--danger-red` |
| Text | `--text-primary` #f4f8ff, secondary, muted |
| Spacing | 4px grid `--space-1` … `--space-10` |
| Radius | 10 / 14 / 18 / 20 / pill |
| Shadows | card, glow-sm/md/hero, button |
| Fonts | Sora (display), Inter (body) |

### Consistency verdict

| Aspect | Assessment |
|--------|------------|
| Color | **Mostly consistent** in HUB/onboarding; many **hardcoded hex** in `App.css` alongside tokens |
| Typography | **Two-font system works**; size scale drifts (10–11px strips vs 15px cards) |
| Cards | `glass-card` + rim gradient — **consistent language** |
| Buttons | **Split brain:** `.btn-primary` / `.primary-button` / `.secondary-button` used interchangeably |
| Radius | Generally 12–18px — good |
| Emoji icons | **Consistent but amateur** vs custom SVG boats |
| Mobile strategy | `game-wrapper` max 390px + `@media (max-width: 390px)` — **clear** |
| Per-screen CSS | Large `App.css` (~6k lines) + tab CSS files — some **duplication** (e.g. `.progress-strip` in `LimanTab.css`) |

**Conclusion:** A design language **exists** and is strongest in onboarding + arrival. HUB tabs feel like **feature dashboards** bolted to the same theme, not one unified “captain bridge” layout system.

---

## 6. Game feel audit

| Dimension | Score (1–10) | Notes |
|-----------|--------------|-------|
| Nautical identity | 8 | Marina map, boat SVG, route quotes, Miço |
| Creator fantasy | 7 | İçerik tab media room; viral result |
| Progression visibility | 7 | World tour dots; weak on liman |
| Upgrade satisfaction | 5 | Not seen in capture; zeros on tekne |
| Voyage excitement | 6 | Arrival great; sea unverified |
| Overall mobile game feel | **6.5/10** | Above web prototype, below polished tycoon reference |

**Web dashboard risk:** HUB liman + rota lists + stat grids = **management UI**. Reduce cards, enlarge one emotional visual per tab.

---

## 7. UX loop clarity audit

| Step | Status | Notes |
|------|--------|-------|
| 1. Enter game | Clear | Welcome + menu |
| 2. What to do | Clear (tutorial) | Forced içerik path |
| 3–6. Onboarding | Clear | Marina/boat/name/gender flow works |
| 7. Start playing | Confusing | “Yükleniyor…” + many banners |
| 8. Produce content | Clear | Tutorial points to tab |
| 9. Earn money | Weak visibility | Credits in header small |
| 10. Upgrade | Confusing | Tekne zeros; link from rota not shown in capture |
| 11. Open route | Moderate | Orange dot helps |
| 12. Understand gaps | Moderate | Readiness system in code; not visible in short rota shot |
| 13. Start voyage | **Risk: unclear on 640** | CTA not in screenshot |
| 14. Sea mode | **Unverified** | — |

**Loop visible in UI?** Partially — needs **one “career path” strip** tying içerik → para → tekne → rota without four competing cards.

---

## 8. Store screenshot readiness

| Screen | Store ready? | Priority to fix |
|--------|--------------|-----------------|
| Main menu | **Yes** | Corner buttons |
| Arrival reward | **Yes** | Minor copy |
| Boat selection | **No** | Remove Mobil İpucu |
| HUB liman | **No** | Simplify header |
| Content result (viral) | **Maybe** | Needs crop without tab bar clutter |
| Rota tab | **No** | CTA + density |
| Sea mode | **Unknown** | Capture first |
| Kaptan profile | **Maybe** | Secondary slide |

**Marketing recommendation:** Lead with **main menu** + **arrival** + **viral content result** after P0 fixes; avoid HUB liman until simplified.

---

## 9. DO NOT TOUCH list (systems)

Do not change as part of UI-only work:

- Economy formulas and reward amounts  
- Route gate / readiness logic thresholds  
- Token earn/spend rules  
- Offline income calculation  
- Save/load schema and checksum  
- Captain level XP thresholds  
- Upgrade costs / durations  
- Marina fee economy  

UI tasks may **rephrase** readiness messages or **reorder** UI only.

---

## 10. Issue register (selected, full format)

### UI-P0-001
- **Screen:** Boat Selection  
- **Viewport:** 390×844  
- **Severity:** P0  
- **Evidence:** `docs/audits/screenshots/onb-pick-boat-390x844.png`  
- **Problem:** “Mobil İpucu” developer copy visible to players.  
- **Why it matters:** Instant “unfinished app” signal; kills store conversion.  
- **Suggested fix direction:** Remove or gate `ui-helper-note` on `PICK_BOAT` to dev builds; replace with one player-facing swipe hint.  
- **Risk if ignored:** Onboarding drop-off and negative reviews citing “beta.”

### UI-P0-002
- **Screen:** Main Menu  
- **Viewport:** 390×844  
- **Severity:** P0  
- **Evidence:** `docs/audits/screenshots/02-main-menu-390x844.png`  
- **Problem:** Ayarlar / Mağaza / Başarım / Sosyal buttons render as live UI but do not navigate.  
- **Why it matters:** Broken taps on first screen erode trust immediately.  
- **Suggested fix direction:** Hide until implemented, or show locked “Yakında” modal.  
- **Risk if ignored:** 1-star “buttons don’t work” reviews.

### UI-P0-003
- **Screen:** HUB Liman + global header  
- **Viewport:** 390×844, 390×640  
- **Severity:** P0  
- **Evidence:** `hub-liman-v2-390x844.png`, `hub-rota-v2-390x640.png`  
- **Problem:** Too many stacked header cards; primary tab content pushed down; route CTA not visible at 640.  
- **Why it matters:** Players cannot find main actions on small phones.  
- **Suggested fix direction:** Collapse bonus + merge strip/tavsiye; sticky route CTA; shrink hero.  
- **Risk if ignored:** Mid-game churn, “can’t start voyage.”

### UI-P0-004
- **Screen:** HUB — Kaptan Tavsiyesi  
- **Viewport:** 390×844  
- **Severity:** P0  
- **Evidence:** `hub-liman-v2-390x844.png`  
- **Problem:** Title truncates (“İlk içerik za…”).  
- **Why it matters:** Guidance card fails its only job.  
- **Suggested fix direction:** `line-clamp: 2`, smaller eyebrow, or horizontal layout with more width.  
- **Risk if ignored:** Players ignore guidance system.

### UI-P0-005
- **Screen:** Sea Mode  
- **Viewport:** All  
- **Severity:** P0 (audit gap)  
- **Evidence:** `sea-mode-v2-390x844.png` shows wrong screen  
- **Problem:** Sea Mode UI not validated in this audit.  
- **Why it matters:** Core fantasy loop unseen for release sign-off.  
- **Suggested fix direction:** Manual screenshot matrix + fix load path for test saves.  
- **Risk if ignored:** Ship broken or ugly sea UX.

### UI-P1-001
- **Screen:** Global  
- **Viewport:** All  
- **Severity:** P1  
- **Evidence:** All screenshots (bottom-left `v1.0`)  
- **Problem:** Version label visible; doubles as dev mode toggle.  
- **Why it matters:** Looks like sideload/debug APK.  
- **Suggested fix direction:** `__DEV__` only, or settings menu entry.  
- **Risk if ignored:** Store rejection questions / brand damage.

### UI-P1-002
- **Screen:** Tekne tab  
- **Viewport:** 390×844  
- **Severity:** P1  
- **Evidence:** `hub-tekne-v2-390x844.png`  
- **Problem:** All stat values 0 with no explanation.  
- **Why it matters:** Reads as broken save or bug.  
- **Suggested fix direction:** Empty state + CTA to first upgrade.  
- **Risk if ignored:** Players avoid upgrade loop.

---

## 11. Recommended task breakdown

### UI-FIX-01 — Remove production dev copy (boat screen)
- **Kaynak Task:** UI-VISUAL-AUDIT-01  
- **Öncelik:** P0  
- **Model:** Sonnet / Codex (small UI)  
- **Neden:** Player-facing dev strings are release blockers.  
- **Amaç:** Remove `Mobil İpucu` from onboarding boat UI.  
- **Dosyalar:** `src/components/Onboarding.tsx`, `src/components/Onboarding.css`  
- **Kabul:** No `ui-helper` dev copy on `PICK_BOAT` in production build.  
- **Test:** Onboarding boat on 390×640; CTA visible.  
- **Commit:** `fix(ui): remove dev-only boat selection hint from release`

### UI-FIX-02 — Main menu placeholder corners
- **Kaynak Task:** UI-VISUAL-AUDIT-01  
- **Öncelik:** P0  
- **Model:** Sonnet  
- **Amaç:** Hide or implement corner menu buttons.  
- **Dosyalar:** `src/components/Onboarding.tsx`, `Onboarding.css`  
- **Kabul:** No dead taps on main menu.  
- **Test:** Tap each corner control.  
- **Commit:** `fix(ui): disable unimplemented main menu corner actions`

### UI-FIX-03 — HUB header density simplification
- **Öncelik:** P0  
- **Model:** Opus (layout judgment)  
- **Amaç:** Reduce stacked banners; keep one guidance channel.  
- **Dosyalar:** `App.tsx`, `App.css`, `HubScreen.tsx`, `LimanTab.tsx`  
- **Kabul:** On 390×640, liman shows resource grid OR hero without losing tab content scroll.  
- **Test:** Viewports A, C, D.  
- **Commit:** `fix(ui): simplify hub header stack for short screens`

### UI-FIX-04 — Route tab sticky CTA
- **Öncelik:** P0  
- **Model:** Sonnet  
- **Amaç:** `Rotaya Çık` / locked state always visible above tab bar.  
- **Dosyalar:** `RotaTab.tsx`, `RotaTab.css`  
- **Kabul:** 390×640 screenshot shows CTA without scrolling.  
- **Test:** Locked + ready states.  
- **Commit:** `fix(ui): sticky route voyage CTA on small viewports`

### UI-FIX-05 — Next-action card truncation
- **Öncelik:** P0  
- **Model:** Sonnet  
- **Amaç:** Full title visible on all phone widths.  
- **Dosyalar:** `App.css` (`.next-action-card`)  
- **Kabul:** No ellipsis on “İlk içerik zamanı”.  
- **Test:** 390×844 liman screenshot.  
- **Commit:** `fix(ui): prevent captain advice card title truncation`

### UI-FIX-06 — Sea Mode visual verification pass
- **Öncelik:** P0  
- **Model:** Human QA + Sonnet for fixes  
- **Amaç:** Capture and fix Sea Mode layout issues.  
- **Dosyalar:** `SeaModeTab.tsx`, `SeaModeTab.css`, `App.css`  
- **Kabul:** Screenshot set for sea + decision + 390×640.  
- **Test:** Start voyage from fresh save.  
- **Commit:** `fix(ui): sea mode mobile layout polish` (as needed)

### UI-FIX-07 — Tekne tab empty stats state
- **Öncelik:** P1  
- **Model:** Sonnet  
- **Amaç:** Explain zero stats; guide to first upgrade.  
- **Dosyalar:** `TekneTab.tsx`, `TekneTab.css`  
- **Kabul:** Copy + visual empty state when all values 0.  
- **Test:** New game tekne tab.  
- **Commit:** `fix(ui): tekne tab zero-stat empty state`

### UI-FIX-08 — Hide v1.0 dev toggle in release
- **Öncelik:** P1  
- **Model:** Sonnet  
- **Amaç:** Dev mode not discoverable in production.  
- **Dosyalar:** `App.tsx`  
- **Kabul:** Production build has no visible dev trigger (or settings-only).  
- **Test:** Production build flag.  
- **Commit:** `chore(ui): hide dev mode entry from release builds`

### UI-FIX-09 — Onboarding step numbering
- **Öncelik:** P2  
- **Model:** Sonnet  
- **Amaç:** Consistent step counts across onboarding.  
- **Dosyalar:** `Onboarding.tsx`  
- **Kabul:** Gender screen step matches flow.  
- **Test:** Full new game path.  
- **Commit:** `fix(ui): align onboarding step indicators`

### UI-FIX-10 — Store screenshot polish pass
- **Öncelik:** P1  
- **Model:** Opus (art direction)  
- **Amaç:** Export 6.7" and 5.5" store sets from menu, arrival, viral result.  
- **Dosyalar:** Marketing assets only  
- **Kabul:** 5 PNGs × required sizes, no debug UI.  
- **Test:** App Store Connect preview.  
- **Commit:** N/A (assets)

### UI-FIX-11 — Tab icon system (optional)
- **Öncelik:** P2  
- **Model:** Opus  
- **Amaç:** Replace emoji tab icons with SVG set.  
- **Dosyalar:** `HubScreen.tsx`, `App.css`  
- **Kabul:** Visual consistency across tabs.  
- **Test:** All tabs active/inactive.  
- **Commit:** `feat(ui): custom tab bar icons`

### UI-FIX-12 — Tutorial loading flash
- **Öncelik:** P1  
- **Model:** Sonnet  
- **Amaç:** No “Yükleniyor…” under Miço on first hub paint.  
- **Dosyalar:** `App.tsx`, tab lazy imports  
- **Kabul:** First hub frame shows liman content or skeleton, not loading text.  
- **Test:** New game → hub.  
- **Commit:** `fix(ui): remove hub loading flash during tutorial`

---

## 12. Final verdict

**“Bu oyun şu an App Store / Google Play’e görsel kalite olarak gönderilmeli mi?”**

### **NO — needs P0 UI fixes**

Teknik build ve CSS guardrail auditleri geçiyor; ancak **oyuncuya görünen yüzeyde** hâlâ prototip izleri (dev ipucu, sahte menü köşeleri, aşırı kalabalık HUB, kısa ekranda rota CTA riski, Sea Mode görsel onayı yok) var. Onboarding ve varış ekranları **güçlü çekirdek** gösteriyor; 2–3 haftalık odaklı UI polish ile store kalitesine yaklaşabilir.

---

## Appendix A — Screenshot index (this audit)

| File | Screen |
|------|--------|
| `onb-welcome-slide0-390x844.png` | Welcome |
| `02-main-menu-390x844.png` | Main menu |
| `onb-pick-profile-390x844.png` | Profile |
| `onb-pick-marina-390x844.png` | Marina |
| `onb-pick-boat-390x844.png` | Boat |
| `onb-pick-boat-short-390x640.png` | Boat short |
| `onb-name-boat-390x844.png` | Name boat |
| `onb-pick-gender-390x844.png` | Gender |
| `hub-liman-fresh-390x844.png` | Tutorial hub |
| `hub-liman-v2-390x844.png` | Liman |
| `hub-icerik-v2-390x844.png` | İçerik |
| `hub-rota-v2-390x844.png` | Rota |
| `hub-rota-v2-390x640.png` | Rota short |
| `hub-tekne-v2-390x844.png` | Tekne |
| `hub-kaptan-v2-390x844.png` | Kaptan |
| `hub-content-result-v2-390x844.png` | Content result |
| `arrival-v2-390x844.png` | Arrival |
| `arrival-v2-1280x720.png` | Arrival desktop frame |

## Appendix B — Screenshots still needed from founder/QA

Please capture on a real device or emulator and add to `docs/audits/screenshots/`:

1. Sea Mode — idle voyage (`SEA_MODE`, no pending decision) — 390×844, 390×640  
2. Sea Mode — decision event with choice preview pills — 390×844  
3. Sea Mode — advance day + low resources warning  
4. Rota — readiness locked + “Önce Eksikleri Tamamla” — 390×640 (scroll if needed)  
5. Tekne — upgrade in progress + completed card  
6. İçerik — cooldown state + publish disabled  
7. Welcome-back / rewarded ad placeholder (if shown)  
8. Achievement celebration modal (full frame)  
9. Viewports: 430×932, 390×700, 412×915  

---

*End of audit. No source code was modified except this document and screenshot artifacts.*
