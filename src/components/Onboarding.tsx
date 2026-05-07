import type { Dispatch, SetStateAction } from "react";
import type { Step, MarinaFilter } from "../types/game";
import { PLAYER_PROFILES } from "../../game-data/playerProfiles";
import { STARTING_MARINAS } from "../../game-data/marinas";
import { STARTING_BOATS, STARTING_BUDGET } from "../../game-data/boats";
import { skillLabels, profileIcons, ratingToScore } from "../data/labels";
import { marinaIcons } from "../data/marinas";
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
}

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
}: OnboardingProps) {
  const selectedProfile = PLAYER_PROFILES[profileIndex];
  const selectedMarina = STARTING_MARINAS[marinaIndex];
  const selectedBoat = STARTING_BOATS[boatIndex];

  const nextProfile = () => setProfileIndex((i) => (i + 1) % PLAYER_PROFILES.length);
  const prevProfile = () => setProfileIndex((i) => (i - 1 + PLAYER_PROFILES.length) % PLAYER_PROFILES.length);

  const renderStepHeader = (current: number, title: string) => (
    <div className="progress-header fade-in">
      <div className="progress-indicator">
        {current}/5
      </div>
      <h2>{title}</h2>
    </div>
  );

  const renderMainMenu = () => (
    <div className="menu-container fade-in cinematic-bg">
      <div className="menu-top-teaser">
        <span>⚓</span> YENİ MACERA SENİ BEKLİYOR
      </div>
      <div className="menu-ocean-scene">
        <div className="stars-layer"></div>
        <div className="horizon-glow"></div>
        <div className="menu-boat-silhouette">{getBoatSvg("denizkusu_34")}</div>
        <div className="water-reflection"></div>
        <svg className="wave-layer w1" viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="M0 40 Q150 0 300 40 Q450 80 600 40 Q750 0 900 40 Q1050 80 1200 40 Q1350 0 1500 40 Q1650 80 1800 40 Q1950 0 2100 40 Q2250 80 2400 40 V80 H0Z" fill="rgba(14,100,160,0.85)"/></svg>
        <svg className="wave-layer w2" viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="M0 50 Q150 15 300 50 Q450 85 600 50 Q750 15 900 50 Q1050 85 1200 50 Q1350 15 1500 50 Q1650 85 1800 50 Q1950 15 2100 50 Q2250 85 2400 50 V80 H0Z" fill="rgba(10,70,120,0.6)"/></svg>
        <div className="water-shimmer shimmer-1"></div>
        <div className="water-shimmer shimmer-2"></div>
        <div className="water-shimmer shimmer-3"></div>
      </div>
      <div className="hero-copy">
        <div className="hero-title-block">
          <h1>Yelkenli Yaşam</h1>
          <span className="title-sub">TYCOON</span>
          <p className="hero-text">Türkiye'den dünya turuna</p>
        </div>
        <div className="hero-divider"></div>

        <div className="menu-actions">
          <button className="btn-primary large" onClick={() => setStep("PICK_PROFILE")}>
            <span>⚓</span> YENİ OYUN
          </button>

          {hasSave && (
            <button className="btn-secondary large" onClick={onLoadGame}>
              <span>🧭</span> DEVAM ET <span className="dot-sep">·</span> <span className="save-name">{saveBoatName}</span>
            </button>
          )}
        </div>

        <div className="social-proof">
          <span>🚢</span> 47.000 kaptan denizde
        </div>
      </div>
    </div>
  );

  const renderProfileSelection = () => {
    const topSkills = Object.entries(selectedProfile.skills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return (
      <div className="selection-screen profile-selection-screen fade-in">
        <div className="profile-selection-header">
          <div className="profile-selection-topline">
            <div className="profile-step-indicator">{"1 / 5"}</div>
            <div className="profile-step-dots" aria-hidden="true">
              <span className="profile-step-dot active"></span>
              <span className="profile-step-dot"></span>
              <span className="profile-step-dot"></span>
              <span className="profile-step-dot"></span>
              <span className="profile-step-dot"></span>
            </div>
          </div>
          <h2>Kaptanını Seç</h2>
        </div>

        <div className="profile-carousel">
          <button className="nav-btn profile-nav-btn" onClick={prevProfile} aria-label="Önceki kaptan">‹</button>

          <article className="profile-card big-card fade-in" key={selectedProfile.id}>
            <div className="profile-icon">{profileIcons[selectedProfile.id] || "👤"}</div>
            <h2>{selectedProfile.name}</h2>
            <p className="tagline">"{selectedProfile.tagline}"</p>

            <div className="skills-mini">
              {topSkills.map(([k, v]) => (
                <div key={k} className="skill-row">
                  <span>{skillLabels[k] ?? k}</span>
                  <div className="skill-bar"><div className="skill-fill" data-skill={k} style={{width: `${v*20}%`}}></div></div>
                  <strong className={`skill-value skill-${k}`}>{v}</strong>
                </div>
              ))}
            </div>

            <div className="pros-cons">
              <div className="pro"><span className="pro-icon">✓</span> <strong>{selectedProfile.advantage.title}</strong></div>
              <div className="con"><span className="con-icon">⚠</span> <strong>{selectedProfile.disadvantage.title}</strong></div>
            </div>
          </article>

          <button className="nav-btn profile-nav-btn" onClick={nextProfile} aria-label="Sonraki kaptan">›</button>
        </div>

        <div className="step-actions profile-step-actions mt-20">
          <button className="btn-secondary" onClick={() => setStep("MAIN_MENU")}>Geri</button>
          <button className="btn-primary large" onClick={() => setStep("PICK_MARINA")}>Limanlara Bak →</button>
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
      if (nextIndex >= 0) setMarinaIndex(nextIndex);
    };

    return (
      <div className="selection-screen marina-selection-screen fade-in">
        <div className="marina-selection-header">
          <div className="marina-selection-topline">
            <div className="marina-step-indicator">2 / 5</div>
            <div className="marina-step-dots" aria-hidden="true">
              <span className="marina-step-dot"></span>
              <span className="marina-step-dot active"></span>
              <span className="marina-step-dot"></span>
              <span className="marina-step-dot"></span>
              <span className="marina-step-dot"></span>
            </div>
          </div>
          <h2>Başlangıç Marinası</h2>
        </div>

        <div className="marina-filters" role="tablist" aria-label="Marina bölge filtresi">
          <button className={`marina-filter-chip ${marinaFilter === "all" ? "active" : ""}`} onClick={() => handleMarinaFilterChange("all")}>Tümü</button>
          <button className={`marina-filter-chip ${marinaFilter === "ege" ? "active" : ""}`} onClick={() => handleMarinaFilterChange("ege")}>Ege</button>
          <button className={`marina-filter-chip ${marinaFilter === "akdeniz" ? "active" : ""}`} onClick={() => handleMarinaFilterChange("akdeniz")}>Akdeniz</button>
          <button className={`marina-filter-chip ${marinaFilter === "marmara" ? "active" : ""}`} onClick={() => handleMarinaFilterChange("marmara")}>Marmara</button>
        </div>

        <div className="marina-list">
          {filteredMarinas.map((marina) => {
            const idx = STARTING_MARINAS.findIndex((item) => item.id === marina.id);
            const isActive = idx === marinaIndex;
            const isRecommended = marina.bestProfiles.includes(selectedProfile.id);

            return (
              <button
                key={marina.id}
                className={`marina-list-item ${isActive ? "active" : ""}`}
                onClick={() => setMarinaIndex(idx)}
              >
                <div className="marina-list-icon">{marinaIcons[marina.id] ?? "⚓"}</div>
                <div className="marina-list-copy">
                  <div className="marina-list-title-row">
                    <strong>{marina.name}</strong>
                    {isRecommended && <span className="marina-rec-badge">ÖNERİLEN</span>}
                  </div>
                  <span>{marina.region}</span>
                </div>
                <div className="marina-list-status" aria-hidden="true"></div>
              </button>
            );
          })}
        </div>

        <div className="marina-detail-sheet slide-up">
          <div className="marina-detail-header">
            <h3>{selectedMarina.name}</h3>
            <span className="marina-region-badge">{selectedMarina.region}</span>
          </div>
          <p className="marina-tagline">"{selectedMarina.tagline}"</p>

          <div className="marina-detail-cards">
            <div className="marina-detail-card bonus">
              <span>✓</span>
              <strong>{selectedMarina.bonus.title}</strong>
            </div>
            <div className="marina-detail-card warning">
              <span>⚠</span>
              <strong>{selectedMarina.disadvantage.title}</strong>
            </div>
          </div>

          <p className="marina-routes">{selectedMarina.firstRouteOptions.join(" · ")}</p>
        </div>

        <div className="step-actions marina-step-actions">
          <button className="btn-secondary" onClick={() => setStep("PICK_PROFILE")}>Geri</button>
          <button className="btn-primary large" onClick={() => setStep("PICK_BOAT")}>Tekne Seçimine Geç →</button>
        </div>
      </div>
    );
  };

  const renderBoatSelection = () => {
    const selectedBoatClass = boatClassMeta[selectedBoat.sizeClass];
    const remainingBudget = STARTING_BUDGET - selectedBoat.purchaseCost;
    const budgetTier =
      remainingBudget >= 50000 ? "Rahat upgrade alanı"
      : remainingBudget >= 25000 ? "Dengeli upgrade alanı"
      : "Sıkı bütçe başlangıcı";

    const boatDecisionStats = [
      { label: "Maliyet", score: 8 - (ratingToScore[selectedBoat.stats.maintenanceCost] ?? 4) },
      { label: "Dayanıklılık", score: 8 - (ratingToScore[selectedBoat.stats.breakdownRisk] ?? 4) },
      { label: "Konfor", score: ratingToScore[selectedBoat.stats.comfort] ?? 4 },
      { label: "Açık Deniz", score: ratingToScore[selectedBoat.stats.safety] ?? 4 },
    ];

    return (
      <div className="selection-screen boat-selection-screen fade-in">
        {renderStepHeader(3, "Tekneni Seç")}

        <div className="boat-layout">
          <div className="boat-tabs">
            {STARTING_BOATS.map((boat, idx) => (
              <button
                key={boat.id}
                className={`boat-tab ${idx === boatIndex ? "active" : ""}`}
                onClick={() => setBoatIndex(idx)}
              >
                {boat.lengthFt} ft
              </button>
            ))}
          </div>

          <article className="boat-card premium-boat-card fade-in" key={selectedBoat.id}>
            <div className="boat-hero-panel">
              <div className="boat-hero-copy">
                <div className="boat-size-row">
                  <span className="boat-class-badge">{selectedBoatClass.label}</span>
                  <span className="boat-length-badge">{selectedBoat.lengthFt} ft</span>
                </div>
                <h2>{selectedBoat.name}</h2>
                <p className="boat-tone">{selectedBoatClass.tone}</p>
                <p className="boat-hero-summary">{selectedBoatClass.summary}</p>
              </div>

              <div className="boat-visual-stage">
                <div className="boat-stage-glow"></div>
                <div className="boat-silhouette premium">{getBoatSvg(selectedBoat.id)}</div>
                <div className="boat-age-badge">{selectedBoat.ageCondition}</div>
              </div>
            </div>

            <div className="boat-decision-grid">
              {boatDecisionStats.map((stat) => (
                <div key={stat.label} className="boat-stat-card">
                  <span>{stat.label}</span>
                  <strong>{stat.score}/7</strong>
                  <div className="boat-stat-bar">
                    <div className="boat-stat-fill" style={{ width: `${(stat.score / 7) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="boat-fit-panel">
              <div className="boat-fit-card positive">
                <small>Bu tekne kim için?</small>
                <strong>{selectedBoat.bestProfiles.map((id) => profileIcons[id] ?? "👤").join(" ")} için güçlü seçim</strong>
              </div>
              <div className="boat-fit-card neutral">
                <small>Oyun stili</small>
                <strong>{selectedBoat.gameRole}</strong>
              </div>
            </div>

            <div className="budget-calculator premium">
              <div className="budget-header">
                <h3>Bütçe Etkisi</h3>
                <span>{budgetTier}</span>
              </div>
              <div className="budget-row"><span>Başlangıç Bütçesi</span> <span>{STARTING_BUDGET.toLocaleString("tr-TR")} TL</span></div>
              <div className="budget-row"><span>Tekne Fiyatı</span> <span>- {selectedBoat.purchaseCost.toLocaleString("tr-TR")} TL</span></div>
              <div className="budget-row total"><span>Kalan Bütçe</span> <span>{remainingBudget.toLocaleString("tr-TR")} TL</span></div>
              <p className="budget-note">{selectedBoat.remainingBudgetFeeling}</p>
            </div>

            <div className="boat-tradeoff-row">
              <div className="boat-tradeoff positive">
                <span>✓</span>
                <div>
                  <small>Avantaj</small>
                  <strong>{selectedBoat.advantage.title}</strong>
                </div>
              </div>
              <div className="boat-tradeoff negative">
                <span>⚠</span>
                <div>
                  <small>Dikkat</small>
                  <strong>{selectedBoat.disadvantage.title}</strong>
                </div>
              </div>
            </div>
          </article>

          <div className="step-actions onboarding-step-actions">
            <button className="btn-secondary" onClick={() => setStep("PICK_MARINA")}>Geri</button>
            <button className="btn-primary large" onClick={() => setStep("NAME_BOAT")}>Bu Tekneyi Seç</button>
          </div>
        </div>
      </div>
    );
  };

  const generateRandomName = () => {
    const names = ["Mavi Rüya", "Poyraz", "Rüzgar Gülü", "Derin Mavi", "Özgürlük", "Kuzey Yıldızı", "Ege Ruhu", "Atlantis"];
    setBoatName(names[Math.floor(Math.random() * names.length)]);
  };

  const renderBoatNaming = () => (
    <div className="selection-screen naming-selection-screen fade-in">
      {renderStepHeader(4, "Son Hazırlık")}

      <div className="naming-box centered transparent-card">
        <div className="boat-silhouette big">{getBoatSvg(selectedBoat.id)}</div>
        <h2>Tekneye İsim Ver</h2>
        <p>{"Denizlerdeki yeni yuvana bir isim koy."}</p>

        <div className="naming-input-group">
          <input
            type="text"
            placeholder="Teknenin adını yaz..."
            value={boatName}
            onChange={(e) => setBoatName(e.target.value)}
            autoFocus
          />
        </div>

        {onboardingMessage && <p>{onboardingMessage}</p>}

        <div className={`name-live-preview ${boatName.trim() ? 'visible' : ''}`}>
          « {boatName || '...'} »
        </div>

        <button className="btn-text" onClick={generateRandomName}>🎲 Rastgele İsim Öner</button>
      </div>

      <div className="step-actions onboarding-step-actions">
        <button className="btn-secondary" onClick={() => setStep("PICK_BOAT")}>Geri</button>
        <button className="btn-primary large" onClick={onFinalizeGame}>⚓ Denize İndir</button>
      </div>
    </div>
  );

  if (step === "MAIN_MENU") return renderMainMenu();
  if (step === "PICK_PROFILE") return renderProfileSelection();
  if (step === "PICK_MARINA") return renderMarinaSelection();
  if (step === "PICK_BOAT") return renderBoatSelection();
  if (step === "NAME_BOAT") return renderBoatNaming();
  return null;
}
