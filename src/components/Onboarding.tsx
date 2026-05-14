import { useRef, useState } from "react";
import type { Dispatch, SetStateAction, TouchEvent as ReactTouchEvent } from "react";
import { MicoSvg, MicoGuide } from "./MicoGuide";
import type { Step, MarinaFilter, Gender } from "../types/game";
import { PLAYER_PROFILES } from "../../game-data/playerProfiles";
import { STARTING_MARINAS } from "../../game-data/marinas";
import { STARTING_BOATS, STARTING_BUDGET } from "../../game-data/boats";
import { skillLabels, profileIcons, ratingToScore } from "../data/labels";
import { boatClassMeta } from "../data/boats";

const getMarinaFilterCategory = (region: string): MarinaFilter => {
  const normalized = region.toLocaleLowerCase("tr-TR");
  if (normalized.includes("marmara")) return "marmara";
  if (normalized.includes("akdeniz") || normalized.includes("antalya")) return "akdeniz";
  return "ege";
};

export const getBoatSvg = (boatId: string) => {
  if (boatId === "kirlangic_28") {
    return (
      <svg viewBox="0 0 100 100" fill="currentColor" width="100%" height="100%">
        <path d="M 50 10 L 50 70 L 90 70 Z M 45 20 L 20 70 L 45 70 Z M 10 75 Q 50 90 90 75 L 80 85 Q 50 100 20 85 Z" />
      </svg>
    );
  }
  if (boatId === "denizkusu_34") {
    return (
      <svg viewBox="0 0 100 100" fill="currentColor" width="100%" height="100%">
        <path d="M 45 5 L 45 65 L 95 65 Z M 40 15 L 10 65 L 40 65 Z M 5 70 Q 50 95 95 70 L 85 85 Q 50 105 15 85 Z" />
      </svg>
    );
  }
  if (boatId === "atlas_40") {
    return (
      <svg viewBox="0 0 100 100" fill="currentColor" width="100%" height="100%">
        <path d="M 35 5 L 35 60 L 70 60 Z M 30 15 L 5 60 L 30 60 Z M 75 10 L 75 60 L 95 60 Z M 5 65 L 95 65 L 90 85 L 10 85 Z" />
      </svg>
    );
  }
  return <span>⛵</span>;
};

interface OnboardingProps {
  step: Step;
  setStep: (step: Step) => void;
  profileIndex: number;
  setProfileIndex: Dispatch<SetStateAction<number>>;
  marinaIndex: number;
  setMarinaIndex: (i: number) => void;
  marinaFilter: MarinaFilter;
  setMarinaFilter: (f: MarinaFilter) => void;
  boatIndex: number;
  setBoatIndex: (i: number) => void;
  boatName: string;
  setBoatName: (name: string) => void;
  onboardingMessage?: string;
  hasSave: boolean;
  saveBoatName: string;
  onLoadGame: () => void;
  onFinalizeGame: () => void;
  gender: Gender;
  onSetGender: (g: Gender) => void;
}

const WELCOME_SLIDES = [
  "Kaptan, hoşgeldin! Ben Miço — senin güverte arkadaşın. Şehirden sıkıldın mı?",
  "Denizler seni bekliyor. Türkiye'den başlayıp dünyayı dolaşacağız. Her adımda yanında olacağım!",
  "Haydi başlayalım. Önce seni tanıyayım...",
];

const MICO_MESSAGES: Partial<Record<string, string>> = {
  PICK_PROFILE:
    "Her kaptanın kendi güçlü yönü vardır. Hangi tip seni en iyi tanımlıyor? Sola veya sağa kaydır ve bak!",
  PICK_MARINA:
    "Çıkış limanın senin üssün olacak, Kaptan. İyi seç — buradan dünyaya açılacaksın!",
  PICK_BOAT:
    "İşte en önemli karar! Bu tekne yol arkadaşın. Seninle her fırtınayı göğüsleyecek. Acele etme!",
  NAME_BOAT:
    "Teknen seni bekliyor! Ona güzel bir isim ver — artık senin, kimsenin değil.",
};

export function Onboarding({
  step, setStep,
  profileIndex, setProfileIndex,
  marinaIndex, setMarinaIndex,
  marinaFilter, setMarinaFilter,
  boatIndex, setBoatIndex,
  boatName, setBoatName,
  onboardingMessage,
  hasSave, saveBoatName,
  onLoadGame, onFinalizeGame,
  gender, onSetGender,
}: OnboardingProps) {
  const [welcomeSlide, setWelcomeSlide] = useState(0);
  const selectedProfile = PLAYER_PROFILES[profileIndex];
  const selectedMarina = STARTING_MARINAS[marinaIndex];
  const selectedBoat = STARTING_BOATS[boatIndex];
  const nextProfile = () => setProfileIndex((i) => (i + 1) % PLAYER_PROFILES.length);
  const prevProfile = () => setProfileIndex((i) => (i - 1 + PLAYER_PROFILES.length) % PLAYER_PROFILES.length);
  const captainSwipeStart = useRef<{ x: number; y: number } | null>(null);
  const marinaSwipeStart = useRef<{ x: number; y: number } | null>(null);
  const boatSwipeStart = useRef<{ x: number; y: number } | null>(null);

  const handleCaptainTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    captainSwipeStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleCaptainTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    const start = captainSwipeStart.current;
    captainSwipeStart.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 40 || absDx <= absDy) return;
    if (dx < 0) nextProfile();
    else prevProfile();
  };

  const handleMarinaTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    marinaSwipeStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleMarinaTouchEnd = (
    e: ReactTouchEvent<HTMLDivElement>,
    onPrev: () => void,
    onNext: () => void,
  ) => {
    const start = marinaSwipeStart.current;
    marinaSwipeStart.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 40 || absDx <= absDy) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  const updateMarinaSelection = (index: number) => {
    setMarinaIndex(index);
  };

  const handleBoatTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    boatSwipeStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleBoatTouchEnd = (
    e: ReactTouchEvent<HTMLDivElement>,
    onPrev: () => void,
    onNext: () => void,
  ) => {
    const start = boatSwipeStart.current;
    boatSwipeStart.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 40 || absDx <= absDy) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  const renderWelcome = () => {
    const isLast = welcomeSlide >= WELCOME_SLIDES.length - 1;
    return (
      <div className="mico-welcome">
        <div className="mico-welcome-stage">
          <div className="mico-welcome-glow" aria-hidden="true" />
          <div className="mico-welcome-rings" aria-hidden="true">
            <span className="ob-ring ob-ring--outer-gold" />
            <span className="ob-ring ob-ring--mid-cyan" />
          </div>
          <MicoSvg size={112} />
        </div>

        <div className="mico-welcome-card glass-card fade-in" key={welcomeSlide}>
          <span className="mico-welcome-name">Miço</span>
          <p className="mico-welcome-text">{WELCOME_SLIDES[welcomeSlide]}</p>
          <div className="mico-welcome-dots" aria-hidden="true">
            {WELCOME_SLIDES.map((_, i) => (
              <span key={i} className={`mico-dot ${i === welcomeSlide ? "mico-dot--active" : ""}`} />
            ))}
          </div>
        </div>

        <button
          className="primary-button primary-button--pulse mico-welcome-btn"
          onClick={() => {
            if (isLast) {
              setWelcomeSlide(0);
              setStep("MAIN_MENU");
            } else {
              setWelcomeSlide((s) => s + 1);
            }
          }}
        >
          {isLast ? "⚓ Başlayalım!" : "Devam →"}
        </button>
      </div>
    );
  };

  const renderMainMenu = () => (
    <div className="ob-main-menu ob-main-menu-v2">
      <div className="ob-corners">
        <button className="ob-corner-btn" aria-label="Ayarlar" onClick={() => console.log("settings")}>
          <span className="ob-corner-icon">⚙</span>
          <span className="ob-corner-label">AYARLAR</span>
        </button>
        <button className="ob-corner-btn" aria-label="Mağaza" onClick={() => console.log("store")}>
          <span className="ob-corner-icon">🏪</span>
          <span className="ob-corner-label">MAĞAZA</span>
        </button>
        <button className="ob-corner-btn" aria-label="Başarımlar" onClick={() => console.log("achievements")}>
          <span className="ob-corner-icon">🏆</span>
          <span className="ob-corner-label">BAŞARIM</span>
        </button>
        <button className="ob-corner-btn" aria-label="Sosyal" onClick={() => console.log("social")}>
          <span className="ob-corner-icon">👥</span>
          <span className="ob-corner-label">SOSYAL</span>
        </button>
      </div>

      <div className="ob-menu-hero">
        <div className="ob-menu-eyebrow">⚓ YENİ MACERA SENİ BEKLİYOR</div>
        <div className="ob-menu-boat-stage">
          <div className="ob-menu-boat-glow" aria-hidden="true" />
          <div className="ob-ring-stack" aria-hidden="true">
            <span className="ob-ring ob-ring--outer-gold" />
            <span className="ob-ring ob-ring--mid-cyan" />
            <span className="ob-ring ob-ring--inner-dot" />
          </div>
          <div className="ob-menu-boat-svg ob-boat-bob">
            {getBoatSvg("denizkusu_34")}
          </div>
        </div>
      </div>

      <div className="ob-menu-copy">
        <h1 className="ob-menu-title">Yelkenli Yaşam</h1>
        <div className="ob-menu-tycoon">TYCOON</div>
        <p className="ob-menu-subtitle">Türkiye'den Dünya Turuna</p>
      </div>

      <div className="ob-menu-actions">
        {hasSave ? (
          <>
            <button className="primary-button primary-button--pulse" onClick={onLoadGame}>
              🧭 DEVAM ET · {saveBoatName}
            </button>
            <button className="secondary-button" onClick={() => setStep("PICK_PROFILE")}>
              ⚓ YENİ OYUN
            </button>
          </>
        ) : (
          <button className="primary-button primary-button--pulse" onClick={() => setStep("PICK_PROFILE")}>
            ⚓ YENİ OYUN
          </button>
        )}
      </div>

      <div className="ob-social-proof">Topluluk büyüyor</div>
    </div>
  );

  const renderProfileSelection = () => {
    const topSkills = Object.entries(selectedProfile.skills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return (
      <div className="ob-profile-screen ob-profile-screen-v2">
        <div className="ob-step-header">
          <div className="ob-step-eyebrow">ADIM 1 / 4</div>
          <h2 className="ob-step-title">KAPTANINI SEÇ</h2>
        </div>
        <MicoGuide message={MICO_MESSAGES.PICK_PROFILE!} visible />

        <div
          className="ob-captain-carousel"
          onTouchStart={handleCaptainTouchStart}
          onTouchEnd={handleCaptainTouchEnd}
          onTouchCancel={() => { captainSwipeStart.current = null; }}
        >
          <button className="ob-tap-zone ob-tap-zone--left" onClick={prevProfile} aria-label="Önceki kaptan" />
          <button className="ob-tap-zone ob-tap-zone--right" onClick={nextProfile} aria-label="Sonraki kaptan" />

          <div className="ob-captain-card ob-captain-card--active fade-in" key={selectedProfile.id}>
            <div className="ob-portrait-stage">
              <span className="ob-ring-halo" aria-hidden="true" />
              <div className="ob-portrait-ring-outer" aria-hidden="true" />
              <div className="ob-portrait-ring-inner" aria-hidden="true" />
              <span className="ob-ring ob-ring--inner-dot ob-ring--dot-on-portrait" aria-hidden="true" />
              <div className="ob-portrait-circle">
                <span className="ob-portrait-emoji">{profileIcons[selectedProfile.id] || "👤"}</span>
              </div>
            </div>

            <h3 className="ob-captain-name">{selectedProfile.name}</h3>
            <p className="ob-captain-tagline">"{selectedProfile.tagline}"</p>

            <div className="ob-skills">
              {topSkills.map(([k, v]) => (
                <div key={k} className="ob-skill-row">
                  <span className="ob-skill-label">{skillLabels[k] ?? k}</span>
                  <div className="ob-skill-bar">
                    <div className="ob-skill-fill" style={{ width: `${v * 20}%` }} />
                  </div>
                  <span className="ob-skill-score">{v}/5</span>
                </div>
              ))}
            </div>

            <div className="ob-chips">
              <div className="ob-chip ob-chip--pro">
                <span>✓</span> {selectedProfile.advantage.title}
              </div>
              <div className="ob-chip ob-chip--con">
                <span>⚠</span> {selectedProfile.disadvantage.title}
              </div>
            </div>
          </div>
        </div>

        <div className="ob-pagination-dots" aria-hidden="true">
          {PLAYER_PROFILES.map((_, i) => (
            <span key={i} className={`ob-dot ${i === profileIndex ? "ob-dot--active" : ""}`} />
          ))}
        </div>
        <div className="ob-screen-actions">
          <button className="secondary-button" onClick={() => setStep("MAIN_MENU")}>Geri</button>
          <button className="primary-button" onClick={() => setStep("PICK_MARINA")}>LİMANLARA BAK →</button>
        </div>
      </div>
    );
  };

  const renderMarinaSelection = () => {
    const filteredMarinas = STARTING_MARINAS.filter((marina) =>
      marinaFilter === "all" ? true : getMarinaFilterCategory(marina.region) === marinaFilter
    );

    const handleMarinaFilterChange = (filter: MarinaFilter) => {
      setMarinaFilter(filter);
      if (filter === "all") return;
      const activeStillVisible = getMarinaFilterCategory(selectedMarina.region) === filter;
      if (activeStillVisible) return;
      const nextMarina = STARTING_MARINAS.find((marina) => getMarinaFilterCategory(marina.region) === filter);
      if (!nextMarina) return;
      const nextIndex = STARTING_MARINAS.findIndex((marina) => marina.id === nextMarina.id);
      if (nextIndex >= 0) updateMarinaSelection(nextIndex);
    };

    const MARINA_COORDS: Record<string, { cx: number; cy: number }> = {
      cesme:    { cx: 38,  cy: 54  },
      kusadasi: { cx: 52,  cy: 78  },
      bodrum:   { cx: 74,  cy: 106 },
      gocek:    { cx: 100, cy: 122 },
      marmaris: { cx: 126, cy: 134 },
      fethiye:  { cx: 154, cy: 126 },
      kas:      { cx: 182, cy: 138 },
      antalya:  { cx: 248, cy: 152 },
      istanbul: { cx: 310, cy: 24  },
      yalova:   { cx: 328, cy: 40  },
    };

    const ROUTE_PATHS: Array<{ d: string; key: string }> = [
      { key: "ist-yalova",   d: "M 310 24  Q 320 32  328 40" },
      { key: "ist-cesme",    d: "M 310 24  Q 220 28  120 34  Q 72 40  38 54" },
      { key: "cesme-kus",    d: "M 38  54  Q 44 66   52 78" },
      { key: "kus-bodrum",   d: "M 52  78  Q 62 92   74 106" },
      { key: "bodrum-gocek", d: "M 74  106 Q 88 116  100 122" },
      { key: "gocek-marm",   d: "M 100 122 Q 112 130 126 134" },
      { key: "marm-fethiye", d: "M 126 134 Q 140 132 154 126" },
      { key: "fethiye-kas",  d: "M 154 126 Q 168 132 182 138" },
      { key: "kas-antalya",  d: "M 182 138 Q 216 146 248 152" },
    ];

    const filteredIndices = STARTING_MARINAS
      .map((m, i) => ({ id: m.id, idx: i }))
      .filter(({ id }) => filteredMarinas.some((fm) => fm.id === id));

    const cyclePrev = () => {
      if (filteredIndices.length === 0) return;
      const cur = filteredIndices.findIndex(({ idx }) => idx === marinaIndex);
      const prev = cur <= 0 ? filteredIndices.length - 1 : cur - 1;
      updateMarinaSelection(filteredIndices[prev].idx);
    };
    const cycleNext = () => {
      if (filteredIndices.length === 0) return;
      const cur = filteredIndices.findIndex(({ idx }) => idx === marinaIndex);
      const next = cur < 0 || cur >= filteredIndices.length - 1 ? 0 : cur + 1;
      updateMarinaSelection(filteredIndices[next].idx);
    };

    const score = (rating: string): number => {
      const v = ratingToScore[rating] ?? 4;
      return Math.max(1, Math.min(5, Math.round((v / 7) * 5)));
    };

    const ulasimDots = score(selectedMarina.routeAdvantage);
    const guzellikStars = score(selectedMarina.contentPotential);

    const weatherForRegion = (region: string): { temp: string; icon: string; label: string } => {
      const r = region.toLocaleLowerCase("tr-TR");
      if (r.includes("marmara") || r.includes("istanbul") || r.includes("yalova")) {
        return { temp: "19°C", icon: "⛅", label: "Bulutlu" };
      }
      if (r.includes("akdeniz") || r.includes("antalya") || r.includes("kaş") || r.includes("kas")) {
        return { temp: "26°C", icon: "☀️", label: "Güneşli" };
      }
      return { temp: "24°C", icon: "☀️", label: "Güneşli" };
    };
    const weather = weatherForRegion(selectedMarina.region);

    return (
      <div className="ob-marina-screen ob-marina-screen-v2 ob-marina-screen-v3">
        <div className="ob-step-header">
          <div className="ob-step-eyebrow">ADIM 2 / 4</div>
          <h2 className="ob-step-title">ÇIKIŞ LİMANINI SEÇ</h2>
        </div>
        <MicoGuide message={MICO_MESSAGES.PICK_MARINA!} visible />

        <div className="ob-region-filter">
          {(["all", "ege", "akdeniz", "marmara"] as MarinaFilter[]).map((f) => (
            <button
              key={f}
              className={`ob-filter-pill ${marinaFilter === f ? "ob-filter-pill--active" : ""}`}
              onClick={() => handleMarinaFilterChange(f)}
            >
              {f === "all" ? "Tümü" : f === "ege" ? "Ege" : f === "akdeniz" ? "Akdeniz" : "Marmara"}
            </button>
          ))}
        </div>

        <div
          className="ob-marina-map-wrap"
          onTouchStart={handleMarinaTouchStart}
          onTouchEnd={(e) => handleMarinaTouchEnd(e, cyclePrev, cycleNext)}
          onTouchCancel={() => { marinaSwipeStart.current = null; }}
        >
          <button
            className="ob-map-arrow ob-map-arrow--left"
            onClick={cyclePrev}
            aria-label="Önceki liman"
            type="button"
          >‹</button>
          <button
            className="ob-map-arrow ob-map-arrow--right"
            onClick={cycleNext}
            aria-label="Sonraki liman"
            type="button"
          >›</button>

          <svg
            className="ob-marina-map"
            viewBox="0 0 380 170"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Türkiye marina haritası"
          >
            <defs>
              <filter id="ob-map-route-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              className="ob-map-land"
              d="M 25 78 Q 38 46 65 54 Q 78 70 84 102 Q 100 120 118 127 Q 138 133 155 126 Q 185 136 250 152 Q 295 158 350 148 L 370 120 L 370 20 Q 345 14 315 22 Q 295 32 278 50 Q 258 66 235 70 Q 205 74 180 70 Q 150 64 115 60 Q 82 54 60 64 Z"
            />
            <path
              className="ob-map-coast"
              d="M 25 78 Q 38 46 65 54 Q 78 70 84 102 Q 100 120 118 127 Q 138 133 155 126 Q 185 136 250 152 Q 295 158 350 148"
              fill="none"
            />

            <g className="ob-map-routes" filter="url(#ob-map-route-glow)">
              {ROUTE_PATHS.map((r) => (
                <path key={r.key} className="ob-map-route" d={r.d} fill="none" />
              ))}
            </g>

            {STARTING_MARINAS.map((marina) => {
              const coords = MARINA_COORDS[marina.id];
              if (!coords) return null;
              const idx = STARTING_MARINAS.findIndex((m) => m.id === marina.id);
              const isActive = idx === marinaIndex;
              const isRecommended = marina.bestProfiles.includes(selectedProfile.id);
              const isVisible = filteredMarinas.some((m) => m.id === marina.id);

              return (
                <g
                  key={marina.id}
                  className={`ob-map-pin-group${isActive ? " ob-map-pin-group--active" : ""}${!isVisible ? " ob-map-pin-group--hidden" : ""}${isRecommended ? " ob-map-pin-group--rec" : ""}`}
                  onClick={() => updateMarinaSelection(idx)}
                  role="button"
                  aria-label={marina.name}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") updateMarinaSelection(idx); }}
                >
                  {isActive && (
                    <circle cx={coords.cx} cy={coords.cy - 6} r={12} className="ob-map-pin-ring" />
                  )}
                  <circle
                    cx={coords.cx}
                    cy={coords.cy - 6}
                    r={9}
                    className="ob-map-pin-halo"
                  />
                  <circle
                    cx={coords.cx}
                    cy={coords.cy - 6}
                    r={7}
                    className="ob-map-pin-disc"
                  />
                  <text
                    x={coords.cx}
                    y={coords.cy - 3}
                    className="ob-map-pin-anchor"
                    textAnchor="middle"
                  >⚓</text>
                  <g className="ob-map-pin-premium" transform={`translate(${coords.cx}, ${coords.cy - 18})`}>
                    <rect x={-15} y={-5} width={30} height={8} rx={2} className="ob-map-pin-premium-bg" />
                    <text x={0} y={1} className="ob-map-pin-premium-text" textAnchor="middle">PREMIUM</text>
                  </g>
                  <text
                    x={coords.cx}
                    y={coords.cy + 9}
                    className="ob-map-pin-label"
                    textAnchor="middle"
                  >{marina.name.toUpperCase()}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div
          className="ob-marina-sheet-v3 glass-card"
          onTouchStart={handleMarinaTouchStart}
          onTouchEnd={(e) => handleMarinaTouchEnd(e, cyclePrev, cycleNext)}
          onTouchCancel={() => { marinaSwipeStart.current = null; }}
          key={selectedMarina.id}
        >
          <div className="ob-sheet-v3-row">
            <div className="ob-sheet-photo" aria-hidden="true">
              <span className="ob-sheet-photo-sky" />
              <span className="ob-sheet-photo-sun" />
              <span className="ob-sheet-photo-mountains" />
              <span className="ob-sheet-photo-sea" />
              <span className="ob-sheet-photo-boat">⛵</span>
              {selectedMarina.bestProfiles.includes(selectedProfile.id) && (
                <span className="ob-sheet-photo-rec">ÖNERİLEN</span>
              )}
            </div>
            <div className="ob-sheet-v3-id">
              <h3 className="ob-sheet-v3-name">{selectedMarina.name.toUpperCase()}</h3>
              <span className="ob-sheet-v3-sub">Limanı Detayları</span>
            </div>
          </div>

          <div className="ob-sheet-v3-stats">
            <div className="ob-sheet-stat">
              <span className="ob-sheet-stat-key">Konum</span>
              <span className="ob-sheet-stat-val">{selectedMarina.region}</span>
            </div>
            <div className="ob-sheet-stat">
              <span className="ob-sheet-stat-key">Ulaşım</span>
              <span className="ob-sheet-stat-dots">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`ob-sheet-dot${i < ulasimDots ? " ob-sheet-dot--on" : ""}`} />
                ))}
                <span className="ob-sheet-stat-tail">{ulasimDots} of 5</span>
              </span>
            </div>
            <div className="ob-sheet-stat">
              <span className="ob-sheet-stat-key">Güzellik</span>
              <span className="ob-sheet-stat-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`ob-sheet-star${i < guzellikStars ? " ob-sheet-star--on" : ""}`}>★</span>
                ))}
                <span className="ob-sheet-stat-tail">{guzellikStars} of 5</span>
              </span>
            </div>
            <div className="ob-sheet-stat">
              <span className="ob-sheet-stat-key">Hava Durumu</span>
              <span className="ob-sheet-stat-val ob-sheet-weather">
                <span className="ob-sheet-weather-icon">{weather.icon}</span>
                {weather.temp}, {weather.label}
              </span>
            </div>
          </div>

          <div className="ob-sheet-v3-perks">
            <span className="ob-sheet-v3-perks-label">Yerel İmkanlar</span>
            {selectedMarina.firstRouteOptions.slice(0, 2).map((route, i) => (
              <div key={i} className="ob-sheet-perk">
                <span className="ob-sheet-perk-check">✓</span>
                <span className="ob-sheet-perk-text">{route}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ob-screen-actions">
          <button className="secondary-button" onClick={() => setStep("PICK_PROFILE")}>Geri</button>
          <button className="primary-button" onClick={() => setStep("PICK_BOAT")}>🧭 SEÇİLEN LİMANI ONAYLA →</button>
        </div>
      </div>
    );
  };

  const renderBoatSelection = () => {
    const selectedBoatClass = boatClassMeta[selectedBoat.sizeClass];
    const remainingBudget = STARTING_BUDGET - selectedBoat.purchaseCost;
    const prevBoat = () => setBoatIndex((boatIndex - 1 + STARTING_BOATS.length) % STARTING_BOATS.length);
    const nextBoat = () => setBoatIndex((boatIndex + 1) % STARTING_BOATS.length);
    const budgetTier =
      remainingBudget >= 50000 ? "Rahat upgrade alanı"
      : remainingBudget >= 25000 ? "Dengeli upgrade alanı"
      : "Sıkı bütçe başlangıcı";

    const boatDecisionStats = [
      { label: "Maliyet",     score: 8 - (ratingToScore[selectedBoat.stats.maintenanceCost] ?? 4) },
      { label: "Dayanıklılık", score: 8 - (ratingToScore[selectedBoat.stats.breakdownRisk] ?? 4) },
      { label: "Konfor",      score: ratingToScore[selectedBoat.stats.comfort] ?? 4 },
      { label: "Açık Deniz",  score: ratingToScore[selectedBoat.stats.safety] ?? 4 },
    ];

    return (
      <div className="ob-boat-screen ob-boat-screen-v2">
        <div className="ob-boat-scroll">
        <div className="ob-step-header">
          <div className="ob-step-eyebrow">ADIM 3 / 4</div>
          <h2 className="ob-step-title">TEKNENİ SEÇ</h2>
        </div>
        <MicoGuide message={MICO_MESSAGES.PICK_BOAT!} visible />

        <div className="ob-boat-tabs">
          {STARTING_BOATS.map((boat, idx) => (
            <button
              key={boat.id}
              className={`ob-boat-tab${idx === boatIndex ? " ob-boat-tab--active" : ""}`}
              onClick={() => setBoatIndex(idx)}
            >
              {boat.lengthFt} ft
            </button>
          ))}
        </div>

        <div
          className="ob-boat-hero-card glass-card"
          key={selectedBoat.id}
          onTouchStart={handleBoatTouchStart}
          onTouchEnd={(e) => handleBoatTouchEnd(e, prevBoat, nextBoat)}
          onTouchCancel={() => { boatSwipeStart.current = null; }}
        >
          <div className="ob-boat-info-col">
            <div className="ob-boat-badges">
              <span className="ob-badge ob-badge--class">{selectedBoatClass.label}</span>
              <span className="ob-badge ob-badge--length">{selectedBoat.lengthFt} ft</span>
            </div>
            <h3 className="ob-boat-name">{selectedBoat.name}</h3>
            <p className="ob-boat-tagline">{selectedBoatClass.tone}</p>
            <p className="ob-boat-summary">{selectedBoatClass.summary}</p>
          </div>
          <div className="ob-boat-visual-col">
            <div className="ob-boat-hero-glow" aria-hidden="true" />
            <div className="ob-ring-stack ob-ring-stack--boat" aria-hidden="true">
              <span className="ob-ring ob-ring--outer-gold" />
              <span className="ob-ring ob-ring--mid-cyan" />
              <span className="ob-ring ob-ring--inner-dot" />
            </div>
            <div className="ob-boat-hero-svg ob-boat-bob">{getBoatSvg(selectedBoat.id)}</div>
            <span className="ob-boat-age-chip">{selectedBoat.ageCondition}</span>
          </div>
        </div>

        <div className="ob-stat-grid">
          {boatDecisionStats.map((stat) => (
            <div key={stat.label} className="ob-stat-cell">
              <span className="ob-stat-label">{stat.label}</span>
              <strong className="ob-stat-value">{stat.score}/7</strong>
              <div className="ob-stat-bar">
                <div className="ob-stat-fill" style={{ width: `${(stat.score / 7) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="ob-compat-panel">
          <span className="ob-compat-label">Uyum</span>
          <div className="ob-compat-profiles">
            {selectedBoat.bestProfiles.map((id) => (
              <span key={id} className="ob-compat-icon">{profileIcons[id] ?? "👤"}</span>
            ))}
          </div>
          <span className="ob-compat-note">{selectedBoat.gameRole}</span>
        </div>

        <div className="ob-budget-line">
          <span>{remainingBudget.toLocaleString("tr-TR")} TL ile başlarsın</span>
          <span className="ob-budget-tier">{budgetTier}</span>
        </div>
        </div>

        <div className="ob-screen-actions">
          <button className="secondary-button" onClick={() => setStep("PICK_MARINA")}>Geri</button>
          <button className="primary-button" onClick={() => setStep("NAME_BOAT")}>BU TEKNEYİ SEÇ →</button>
        </div>
      </div>
    );
  };

  const generateRandomName = () => {
    const names = ["Mavi Rüya", "Poyraz", "Rüzgar Gülü", "Derin Mavi", "Özgürlük", "Kuzey Yıldızı", "Ege Ruhu", "Atlantis"];
    setBoatName(names[Math.floor(Math.random() * names.length)]);
  };

  const renderBoatNaming = () => (
    <div className="ob-naming-screen">
      <MicoGuide message={MICO_MESSAGES.NAME_BOAT!} visible />
      <div className="ob-naming-hero-header">
        <h2 className="ob-naming-title">SON HAZIRLIK</h2>
        <div className="ob-step-eyebrow">ADIM 4 / 4</div>
      </div>

      <div className="ob-naming-hero">
        <div className="ob-naming-ring ob-naming-ring--outer" aria-hidden="true" />
        <div className="ob-naming-ring ob-naming-ring--inner" aria-hidden="true" />
        <div className="ob-naming-boat-svg">{getBoatSvg(selectedBoat.id)}</div>
        <div className="ob-naming-particles" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`ob-particle ob-particle--${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="ob-naming-form">
        <label className="ob-naming-label" htmlFor="ob-boat-name-input">TEKNEYE İSİM VER</label>
        <input
          id="ob-boat-name-input"
          className="ob-glass-input"
          type="text"
          placeholder="Teknenin adını yaz..."
          value={boatName}
          onChange={(e) => setBoatName(e.target.value)}
          autoFocus
          maxLength={32}
        />
        <button className="ob-random-pill secondary-button" type="button" onClick={generateRandomName}>
          🎲 Rastgele İsim Öner
        </button>
        {boatName.trim() && (
          <div className="ob-name-preview" key={boatName}>« {boatName} »</div>
        )}
        {onboardingMessage && <p className="ob-onboarding-msg">{onboardingMessage}</p>}
      </div>

      <div className="ob-screen-actions">
        <button className="secondary-button" onClick={() => setStep("PICK_BOAT")}>Geri</button>
        <button
          className="primary-button primary-button--pulse"
          onClick={() => setStep("PICK_GENDER")}
          disabled={!boatName.trim()}
        >
          Devam →
        </button>
      </div>
    </div>
  );

  const renderPickGender = () => (
    <div className="ob-screen fade-in">
      <MicoGuide
        message="Son bir şey, Kaptan — seni daha iyi tanımak istiyorum. Nasıl hitap edeyim?"
        visible
      />
      <div className="ob-gender-options">
        {([
          { value: "male" as const, label: "Kaptan (Erkek)", icon: "👨‍✈️" },
          { value: "female" as const, label: "Kaptan (Kadın)", icon: "👩‍✈️" },
          { value: "unspecified" as const, label: "Belirtmek İstemiyorum", icon: "⚓" },
        ] as const).map((opt) => (
          <button
            key={opt.value}
            className={`ob-gender-btn${gender === opt.value ? " ob-gender-btn--active" : ""}`}
            onClick={() => onSetGender(opt.value)}
          >
            <span className="ob-gender-icon">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
      <div className="ob-screen-actions">
        <button className="secondary-button" onClick={() => setStep("NAME_BOAT")}>Geri</button>
        <button className="primary-button primary-button--pulse" onClick={onFinalizeGame}>
          ⚓ DENİZE İNDİR
        </button>
      </div>
    </div>
  );

  if (step === "WELCOME") return renderWelcome();
  if (step === "MAIN_MENU") return renderMainMenu();
  if (step === "PICK_PROFILE") return renderProfileSelection();
  if (step === "PICK_MARINA") return renderMarinaSelection();
  if (step === "PICK_BOAT") return renderBoatSelection();
  if (step === "NAME_BOAT") return renderBoatNaming();
  if (step === "PICK_GENDER") return renderPickGender();
  return null;
}
