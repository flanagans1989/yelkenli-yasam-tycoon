import { useState, useEffect } from "react";
import "./App.css";

import { PLAYER_PROFILES } from "../game-data/playerProfiles";
import type { PlayerProfile } from "../game-data/playerProfiles";
import { STARTING_MARINAS } from "../game-data/marinas";
import type { StartingMarina } from "../game-data/marinas";
import { STARTING_BOATS, STARTING_BUDGET } from "../game-data/boats";
import type { StartingBoat } from "../game-data/boats";
import { WORLD_ROUTES } from "../game-data/routes";
import { SOCIAL_PLATFORMS } from "../game-data/socialPlatforms";
import { BOAT_UPGRADES } from "../game-data/upgrades";

type Step =
  | "MAIN_MENU"
  | "PICK_PROFILE"
  | "PICK_MARINA"
  | "PICK_BOAT"
  | "NAME_BOAT"
  | "HUB";

type Tab = "liman" | "icerik" | "rota" | "tekne" | "kaptan";

const skillLabels: Record<string, string> = {
  seamanship: "Denizcilik",
  content: "İçerik",
  technical: "Teknik",
  sponsor: "Sponsor",
  riskManagement: "Risk",
  lifestyle: "Yaşam",
};

const profileIcons: Record<string, string> = {
  old_captain: "⚓",
  content_creator: "📹",
  technical_master: "🔧",
  adventure_traveler: "🗺️",
  social_entrepreneur: "💼",
  family_lifestyle: "👨‍👩‍👧",
};

function App() {
  const [step, setStep] = useState<Step>("MAIN_MENU");
  const [activeTab, setActiveTab] = useState<Tab>("liman");
  const [profileIndex, setProfileIndex] = useState(0);
  const [marinaIndex, setMarinaIndex] = useState(0);
  const [boatIndex, setBoatIndex] = useState(0);
  const [boatName, setBoatName] = useState("");
  
  const [credits, setCredits] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [firstContentDone, setFirstContentDone] = useState(false);
  const [purchasedUpgradeIds, setPurchasedUpgradeIds] = useState<string[]>([]);

  const [hasSave, setHasSave] = useState(false);
  const [saveBoatName, setSaveBoatName] = useState("");

  const selectedProfile: PlayerProfile = PLAYER_PROFILES[profileIndex];
  const selectedMarina: StartingMarina = STARTING_MARINAS[marinaIndex];
  const selectedBoat: StartingBoat = STARTING_BOATS[boatIndex];

  const firstRealRoute = WORLD_ROUTES.find((route) => route.order === 2);

  // Dynamic calculations
  const currentOceanReadiness = selectedBoat.oceanReadiness + purchasedUpgradeIds.reduce((total, id) => {
    const upg = BOAT_UPGRADES.find(u => u.id === id);
    return total + (upg?.effects.oceanReadiness || 0);
  }, 0);

  // Load save on mount
  useEffect(() => {
    const saved = localStorage.getItem("yelkenli_save");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.hasSave) {
          setHasSave(true);
          setSaveBoatName(parsed.boatName || "Bilinmeyen Tekne");
        }
      } catch (e) {
        console.error("Save load error", e);
      }
    }
  }, []);

  // Save game when hub states change
  useEffect(() => {
    if (step === "HUB") {
      const saveObj = {
        profileIndex,
        marinaIndex,
        boatIndex,
        boatName,
        credits,
        followers,
        firstContentDone,
        logs,
        purchasedUpgradeIds,
        hasSave: true,
      };
      localStorage.setItem("yelkenli_save", JSON.stringify(saveObj));
      setHasSave(true);
      setSaveBoatName(boatName);
    }
  }, [step, profileIndex, marinaIndex, boatIndex, boatName, credits, followers, firstContentDone, logs, purchasedUpgradeIds]);

  // Flow handlers
  const startNewGame = () => setStep("PICK_PROFILE");
  const goToMarina = () => setStep("PICK_MARINA");
  const goToBoat = () => setStep("PICK_BOAT");
  const goToNaming = () => setStep("NAME_BOAT");
  const finalizeGame = () => {
    if (boatName.trim() === "") {
      alert("Lütfen teknenize bir isim verin.");
      return;
    }
    setCredits(STARTING_BUDGET - selectedBoat.purchaseCost);
    setFollowers(0);
    setPurchasedUpgradeIds([]);
    setLogs(["Kariyer başladı. Limana giriş yapıldı."]);
    setStep("HUB");
    setActiveTab("liman");
  };

  const loadGame = () => {
    const saved = localStorage.getItem("yelkenli_save");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfileIndex(parsed.profileIndex ?? 0);
        setMarinaIndex(parsed.marinaIndex ?? 0);
        setBoatIndex(parsed.boatIndex ?? 0);
        setBoatName(parsed.boatName ?? "");
        setCredits(parsed.credits ?? 0);
        setFollowers(parsed.followers ?? 0);
        setFirstContentDone(parsed.firstContentDone ?? false);
        setLogs(parsed.logs ?? []);
        setPurchasedUpgradeIds(parsed.purchasedUpgradeIds ?? []);
        setStep("HUB");
        setActiveTab("liman");
      } catch (e) {
        console.error("Load error", e);
      }
    }
  };

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
      <div className="hero-copy centered transparent-card">
        <h1>Yelkenli Yaşam Tycoon</h1>
        <p className="hero-text">Türkiye’den dünya turuna</p>
        <div className="menu-actions">
          <button className="btn-primary large" onClick={startNewGame}>
            ⚓ Yeni Oyun
          </button>
          <button 
            className={`btn-secondary large ${!hasSave ? "disabled" : ""}`} 
            onClick={hasSave ? loadGame : undefined}
          >
            📖 Devam Et
          </button>
          {hasSave && <p style={{fontSize: "13px", color: "#8aafcc", marginTop: "8px", fontWeight: 600}}>Kayıt bulundu: {saveBoatName}</p>}
        </div>
      </div>
    </div>
  );

  const renderProfileSelection = () => {
    const topSkills = Object.entries(selectedProfile.skills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return (
      <div className="selection-screen fade-in">
        {renderStepHeader(1, "Kaptanını Seç")}
        
        <div className="profile-carousel">
          <button className="nav-btn" onClick={prevProfile}>◀</button>
          
          <article className="profile-card big-card fade-in" key={selectedProfile.id}>
            <div className="profile-icon">{profileIcons[selectedProfile.id] || "👤"}</div>
            <h2>{selectedProfile.name}</h2>
            <p className="tagline">"{selectedProfile.tagline}"</p>
            
            <div className="skills-mini">
              {topSkills.map(([k, v]) => (
                <div key={k} className="skill-row">
                  <span>{skillLabels[k] ?? k}</span>
                  <div className="skill-bar"><div className="skill-fill" style={{width: `${v*20}%`}}></div></div>
                </div>
              ))}
            </div>

            <div className="pros-cons">
              <div className="pro"><strong>+</strong> {selectedProfile.advantage.title}</div>
              <div className="con"><strong>-</strong> {selectedProfile.disadvantage.title}</div>
            </div>
          </article>
          
          <button className="nav-btn" onClick={nextProfile}>▶</button>
        </div>

        <div className="step-actions centered-actions mt-20">
          <button className="btn-secondary" onClick={() => setStep("MAIN_MENU")}>Geri</button>
          <button className="btn-primary large" onClick={goToMarina}>Limanlara Bak</button>
        </div>
      </div>
    );
  };

  const renderMarinaSelection = () => (
    <div className="selection-screen fade-in">
      {renderStepHeader(2, "Başlangıç Marinası")}

      <div className="marina-layout">
        <div className="map-area">
          {STARTING_MARINAS.map((marina, idx) => {
            const isRecommended = marina.bestProfiles.includes(selectedProfile.id);
            return (
              <button 
                key={marina.id} 
                className={`map-dot ${idx === marinaIndex ? "active" : ""}`}
                onClick={() => setMarinaIndex(idx)}
              >
                <div className="dot"></div>
                <span>{marina.name} {isRecommended && "⭐"}</span>
              </button>
            );
          })}
        </div>

        <div className="marina-bottom-sheet slide-up">
          <h2>{selectedMarina.name} <span className="region-badge">{selectedMarina.region}</span></h2>
          <p>"{selectedMarina.tagline}"</p>
          
          <div className="marina-details">
            <div className="detail-box"><strong>Bonus:</strong> {selectedMarina.bonus.title}</div>
            <div className="detail-box warning"><strong>Dezavantaj:</strong> {selectedMarina.disadvantage.title}</div>
          </div>
          <p className="route-hint">İlk Rotalar: {selectedMarina.firstRouteOptions.join(", ")}</p>

          <div className="step-actions">
            <button className="btn-secondary" onClick={() => setStep("PICK_PROFILE")}>Geri</button>
            <button className="btn-primary" onClick={goToBoat}>Tekne Seçimine Geç</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBoatSelection = () => (
    <div className="selection-screen fade-in">
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

        <article className="boat-card big-card fade-in" key={selectedBoat.id}>
          <div className="boat-silhouette">⛵</div>
          <h2>{selectedBoat.name}</h2>
          <p className="tagline">"{selectedBoat.tagline}"</p>
          
          <div className="budget-calculator">
            <div className="budget-row"><span>Başlangıç Bütçesi:</span> <span>{STARTING_BUDGET.toLocaleString("tr-TR")} TL</span></div>
            <div className="budget-row"><span>Tekne Maliyeti:</span> <span>- {selectedBoat.purchaseCost.toLocaleString("tr-TR")} TL</span></div>
            <div className="budget-row total"><span>Kalan Bütçe:</span> <span>{(STARTING_BUDGET - selectedBoat.purchaseCost).toLocaleString("tr-TR")} TL</span></div>
          </div>

          <div className="pros-cons">
            <div className="pro"><strong>+</strong> {selectedBoat.advantage.title}</div>
            <div className="con"><strong>-</strong> {selectedBoat.disadvantage.title}</div>
          </div>

          <div className="step-actions mt-20">
            <button className="btn-secondary" onClick={() => setStep("PICK_MARINA")}>Geri</button>
            <button className="btn-primary" onClick={goToNaming}>Bu Tekneyi Al</button>
          </div>
        </article>
      </div>
    </div>
  );

  const generateRandomName = () => {
    const names = ["Mavi Rüya", "Poyraz", "Rüzgar Gülü", "Derin Mavi", "Özgürlük", "Kuzey Yıldızı", "Ege Ruhu", "Atlantis"];
    setBoatName(names[Math.floor(Math.random() * names.length)]);
  };

  const renderBoatNaming = () => (
    <div className="selection-screen fade-in">
      {renderStepHeader(4, "Son Hazırlık")}
      
      <div className="naming-box centered transparent-card">
        <div className="boat-silhouette big">⛵</div>
        <h2>Tekneye İsim Ver</h2>
        <p>Denizlerdeki yeni yuvana bir isim koy.</p>
        
        <div className="naming-input-group">
          <input
            type="text"
            placeholder="Teknenin adını yaz..."
            value={boatName}
            onChange={(e) => setBoatName(e.target.value)}
            autoFocus
          />
        </div>
        
        <button className="btn-text" onClick={generateRandomName}>🎲 Rastgele İsim Öner</button>

        <div className="step-actions centered-actions mt-20">
          <button className="btn-secondary" onClick={() => setStep("PICK_BOAT")}>Geri</button>
          <button className="btn-primary large" onClick={finalizeGame}>⚓ Denize İndir</button>
        </div>
      </div>
    </div>
  );

  const handleProduceContent = (platformId?: string) => {
    let gainCredits = 300;
    let gainFollowers = 150;
    let logMsg = "İçerik üretildi.";

    if (platformId === "clipTok") {
      gainFollowers = 250;
      logMsg = "ClipTok için viral içerik üretildi!";
    } else if (platformId === "viewTube") {
      gainCredits = 500;
      logMsg = "ViewTube için detaylı içerik üretildi!";
    }

    setCredits(prev => prev + gainCredits);
    setFollowers(prev => prev + gainFollowers);
    setFirstContentDone(true);
    setLogs(prev => [`${logMsg} +${gainCredits} TL, +${gainFollowers} Takipçi.`, ...prev.slice(0, 4)]);
  };

  const handlePrepareRoute = () => {
    setLogs(prev => [`${firstRealRoute?.name || "Yunan Adaları"} rotası incelendi.`, ...prev.slice(0, 4)]);
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = BOAT_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (credits < upgrade.cost) {
      alert("Yetersiz bütçe!");
      return;
    }

    setCredits(prev => prev - upgrade.cost);
    setPurchasedUpgradeIds(prev => [...prev, upgradeId]);
    setLogs(prev => [`${upgrade.name} satın alındı ve kuruldu.`, ...prev.slice(0, 4)]);
  };

  const renderLimanTab = () => (
    <div className="tab-content fade-in">
      <div className="hub-center-visual">
        <div className="visual-circle">
          <span className="visual-icon">⛵</span>
        </div>
        <h3>{selectedMarina.name} Limanı</h3>
      </div>

      <div className="hub-progress-cards">
        <div className="prog-card">
          <span>Dünya Turu</span>
          <strong>%0</strong>
        </div>
        <div className="prog-card">
          <span>Okyanus Hazırlığı</span>
          <strong>{currentOceanReadiness} / 100</strong>
        </div>
      </div>

      {!firstContentDone ? (
        <button className="quest-card pulse" onClick={() => handleProduceContent()}>
          <div className="quest-icon">🎬</div>
          <div className="quest-texts">
            <h3>İlk içeriğini üret</h3>
            <p>Ödül: +500 TL, +250 Takipçi</p>
          </div>
        </button>
      ) : (
        <div className="quest-card done">
          <div className="quest-icon">✅</div>
          <div className="quest-texts">
            <h3>Sıradaki Görev Bekleniyor</h3>
            <p>Rota: {firstRealRoute?.name || "Yunan Adaları"}</p>
          </div>
        </div>
      )}

      <div className="event-log-compact">
        <span className="card-label">Son Olaylar</span>
        {logs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
      </div>
    </div>
  );

  const renderIcerikTab = () => (
    <div className="tab-content fade-in">
      <span className="card-label">Sosyal Medya Stüdyosu</span>
      <h2>İçerik Üret</h2>
      <p className="tab-desc">Doğru platformda doğru içerik paylaşarak büyü.</p>

      <div className="platform-grid">
        {SOCIAL_PLATFORMS.filter(p => p.mvpStatus === "active").map(platform => (
          <button key={platform.id} className="platform-card" onClick={() => handleProduceContent(platform.id)}>
            <div className="platform-header">
              <strong>{platform.name}</strong>
              <span>{platform.id === "viewTube" ? "💰+" : platform.id === "clipTok" ? "👥+" : ""}</span>
            </div>
            <small>{platform.tagline}</small>
          </button>
        ))}
      </div>

      <div className="content-types-list">
        <h3>İçerik Türleri</h3>
        <div className="type-pills">
          <span>Marina Yaşamı</span>
          <span>Tekne Turu</span>
          <span>Seyir Vlogu</span>
          <span>Bakım / Upgrade</span>
        </div>
      </div>
    </div>
  );

  const renderRotaTab = () => (
    <div className="tab-content fade-in">
      <span className="card-label">Navigasyon Masası</span>
      <h2>Sıradaki Rotalar</h2>
      
      {firstRealRoute && (
        <article className="route-card">
          <div className="route-header">
            <h3>{firstRealRoute.name}</h3>
            <span className="risk-badge" data-risk={firstRealRoute.riskLevel}>{firstRealRoute.riskLevel.toUpperCase()}</span>
          </div>
          <p>{firstRealRoute.description}</p>
          
          <div className="route-stats">
            <div><span>Süre:</span> <strong>{firstRealRoute.baseDurationDays.min}-{firstRealRoute.baseDurationDays.max} Gün</strong></div>
            <div><span>İçerik:</span> <strong>{firstRealRoute.contentPotential.toUpperCase()}</strong></div>
          </div>

          <button className="btn-primary full-width mt-20" onClick={handlePrepareRoute}>Rotaya Hazırlan</button>
        </article>
      )}
    </div>
  );

  const renderTekneTab = () => {
    const availableUpgrades = BOAT_UPGRADES.filter(u => 
      u.compatibility.some(c => c.boatId === selectedBoat.id && c.compatible) &&
      !purchasedUpgradeIds.includes(u.id)
    ).slice(0, 6);

    return (
      <div className="tab-content fade-in">
        <span className="card-label">Tekne ve Ekipman</span>
        <h2>{boatName}</h2>
        <p>{selectedBoat.name} · {selectedBoat.lengthFt} ft</p>

        <div className="hub-progress-cards">
          <div className="prog-card">
            <span>Hazırlık</span>
            <strong>{currentOceanReadiness}%</strong>
          </div>
          <div className="prog-card">
            <span>Kredi</span>
            <strong>{credits.toLocaleString("tr-TR")} TL</strong>
          </div>
        </div>

        <div className="upgrade-list">
          <h3>Mevcut Upgrade'ler</h3>
          {availableUpgrades.map(upgrade => (
            <div key={upgrade.id} className="upgrade-card">
              <div className="upgrade-info">
                <strong>{upgrade.name}</strong>
                <p>{upgrade.description}</p>
                <div className="upgrade-effect">Okyanus Hazırlığı: +{upgrade.effects.oceanReadiness || 0}</div>
              </div>
              <button 
                className={`btn-buy ${credits < upgrade.cost ? "disabled" : ""}`}
                onClick={() => handleBuyUpgrade(upgrade.id)}
              >
                {upgrade.cost.toLocaleString("tr-TR")} TL
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderKaptanTab = () => (
    <div className="tab-content fade-in">
      <span className="card-label">Kaptan Dosyası</span>
      <div className="captain-header">
        <div className="captain-avatar">{profileIcons[selectedProfile.id]}</div>
        <div className="captain-title">
          <h2>{selectedProfile.name}</h2>
          <p>{selectedProfile.tagline}</p>
        </div>
      </div>

      <div className="mini-skills-grid">
        {Object.entries(selectedProfile.skills).map(([key, value]) => (
          <div key={key} className="skill-box">
            <span>{skillLabels[key] ?? key}</span>
            <strong>{value}/5</strong>
          </div>
        ))}
      </div>

      <div className="career-goals">
        <h3>Kariyer Hedefleri</h3>
        <div className="goal-item">
          <span>Dünya Turu</span>
          <div className="goal-bar"><div className="goal-fill" style={{width: "0%"}}></div></div>
        </div>
        <div className="goal-item">
          <span>Takipçi Hedefi (1M)</span>
          <div className="goal-bar"><div className="goal-fill" style={{width: `${Math.min(followers/10000, 100)}%`}}></div></div>
        </div>
      </div>

      <div className="event-log-compact mt-20">
        <span className="card-label">Son Olaylar</span>
        {logs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
      </div>
    </div>
  );

  const renderHub = () => (
    <div className="hub-wrapper fade-in">
      <header className="hub-topbar">
        <div className="hub-boat-info">
          <h2>{boatName}</h2>
          <small>{selectedBoat.name}</small>
        </div>
        <div className="hub-stats">
          <div className="stat"><span>💰</span> {credits.toLocaleString("tr-TR")}</div>
          <div className="stat"><span>👥</span> {followers.toLocaleString("tr-TR")}</div>
        </div>
      </header>

      <main className="hub-content">
        {activeTab === "liman" && renderLimanTab()}
        {activeTab === "icerik" && renderIcerikTab()}
        {activeTab === "rota" && renderRotaTab()}
        {activeTab === "tekne" && renderTekneTab()}
        {activeTab === "kaptan" && renderKaptanTab()}
      </main>

      <nav className="bottom-tab-bar">
        <button className={`tab ${activeTab === "liman" ? "active" : ""}`} onClick={() => setActiveTab("liman")}>
          <span>🏠</span> Liman
        </button>
        <button className={`tab ${activeTab === "icerik" ? "active" : ""}`} onClick={() => setActiveTab("icerik")}>
          <span>📹</span> İçerik
        </button>
        <button className={`tab ${activeTab === "rota" ? "active" : ""}`} onClick={() => setActiveTab("rota")}>
          <span>🗺️</span> Rota
        </button>
        <button className={`tab ${activeTab === "tekne" ? "active" : ""}`} onClick={() => setActiveTab("tekne")}>
          <span>🔧</span> Tekne
        </button>
        <button className={`tab ${activeTab === "kaptan" ? "active" : ""}`} onClick={() => setActiveTab("kaptan")}>
          <span>👤</span> Kaptan
        </button>
      </nav>
    </div>
  );

  return (
    <div className="game-wrapper">
      {step === "MAIN_MENU" && renderMainMenu()}
      {step === "PICK_PROFILE" && renderProfileSelection()}
      {step === "PICK_MARINA" && renderMarinaSelection()}
      {step === "PICK_BOAT" && renderBoatSelection()}
      {step === "NAME_BOAT" && renderBoatNaming()}
      {step === "HUB" && renderHub()}
    </div>
  );
}

export default App;