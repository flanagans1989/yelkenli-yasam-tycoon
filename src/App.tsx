import { useState, useEffect } from "react";
import "./App.css";

import { PLAYER_PROFILES } from "../game-data/playerProfiles";
import type { PlayerProfile } from "../game-data/playerProfiles";
import { STARTING_MARINAS } from "../game-data/marinas";
import type { StartingMarina } from "../game-data/marinas";
import { STARTING_BOATS, STARTING_BUDGET } from "../game-data/boats";
import type { StartingBoat } from "../game-data/boats";
import { WORLD_ROUTES } from "../game-data/routes";

type Step =
  | "MAIN_MENU"
  | "PICK_PROFILE"
  | "PICK_MARINA"
  | "PICK_BOAT"
  | "NAME_BOAT"
  | "HUB";

const skillLabels: Record<string, string> = {
  seamanship: "Denizcilik",
  content: "İçerik",
  technical: "Teknik",
  sponsor: "Sponsor",
  riskManagement: "Risk",
  lifestyle: "Yaşam",
};

// Basit ikon map
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
  const [profileIndex, setProfileIndex] = useState(0);
  const [marinaIndex, setMarinaIndex] = useState(0);
  const [boatIndex, setBoatIndex] = useState(0);
  const [boatName, setBoatName] = useState("");
  
  const [credits, setCredits] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [firstContentDone, setFirstContentDone] = useState(false);

  const [hasSave, setHasSave] = useState(false);
  const [saveBoatName, setSaveBoatName] = useState("");
  const selectedProfile: PlayerProfile = PLAYER_PROFILES[profileIndex];
  const selectedMarina: StartingMarina = STARTING_MARINAS[marinaIndex];
  const selectedBoat: StartingBoat = STARTING_BOATS[boatIndex];

  const firstRealRoute = WORLD_ROUTES.find((route) => route.order === 2);

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
        hasSave: true,
      };
      localStorage.setItem("yelkenli_save", JSON.stringify(saveObj));
      setHasSave(true);
      setSaveBoatName(boatName);
    }
  }, [step, profileIndex, marinaIndex, boatIndex, boatName, credits, followers, firstContentDone, logs]);

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
    setLogs(["Kariyer başladı. Limana giriş yapıldı."]);
    setStep("HUB");
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
        setStep("HUB");
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
    // Get top 3 skills
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

  const handleProduceContent = () => {
    setCredits(prev => prev + 500);
    setFollowers(prev => prev + 250);
    setFirstContentDone(true);
    setLogs(prev => ["İlk içerik üretildi! +500 TL, +250 Takipçi.", ...prev]);
  };

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
            <strong>{selectedBoat.oceanReadiness}</strong>
          </div>
        </div>

        {!firstContentDone ? (
          <button className="quest-card pulse" onClick={handleProduceContent}>
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

        <div className="event-log">
          {logs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
        </div>
      </main>

      <nav className="bottom-tab-bar">
        <button className="tab active"><span>🏠</span> Liman</button>
        <button className="tab"><span>📹</span> İçerik</button>
        <button className="tab"><span>🗺️</span> Rota</button>
        <button className="tab"><span>🔧</span> Tekne</button>
        <button className="tab"><span>👤</span> Kaptan</button>
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