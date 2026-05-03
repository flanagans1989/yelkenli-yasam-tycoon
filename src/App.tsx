import { useState } from "react";
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

function App() {
  const [step, setStep] = useState<Step>("MAIN_MENU");
  const [profileIndex, setProfileIndex] = useState(0);
  const [marinaIndex, setMarinaIndex] = useState(0);
  const [boatIndex, setBoatIndex] = useState(0);
  const [boatName, setBoatName] = useState("");

  const selectedProfile: PlayerProfile = PLAYER_PROFILES[profileIndex];
  const selectedMarina: StartingMarina = STARTING_MARINAS[marinaIndex];
  const selectedBoat: StartingBoat = STARTING_BOATS[boatIndex];

  const remainingBudget = STARTING_BUDGET - selectedBoat.purchaseCost;

  const firstRealRoute = WORLD_ROUTES.find((route) => route.order === 2);

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
    setStep("HUB");
  };

  const renderMainMenu = () => (
    <div className="menu-container fade-in">
      <div className="hero-copy centered">
        <p className="eyebrow">Okyanus Tycoon Simülasyonu</p>
        <h1>Yelkenli Yaşam</h1>
        <p className="hero-text">
          Denizlere açılmaya, içerik üretmeye ve dünyayı keşfetmeye hazır mısın?
        </p>
        <div className="menu-actions">
          <button className="btn-primary large" onClick={startNewGame}>
            Yeni Oyun
          </button>
          <button className="btn-secondary large disabled" title="Çok Yakında">
            Ayarlar
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfileSelection = () => (
    <div className="selection-screen fade-in">
      <div className="screen-header">
        <h1>Kaptanını Seç</h1>
        <p>Her profilin kendine has yetenekleri ve başlangıç bonusları vardır.</p>
      </div>

      <div className="selection-layout">
        <div className="list-panel">
          {PLAYER_PROFILES.map((profile, index) => (
            <button
              key={profile.id}
              className={index === profileIndex ? "choice active" : "choice"}
              onClick={() => setProfileIndex(index)}
            >
              <strong>{profile.name}</strong>
              <small>{profile.tagline}</small>
            </button>
          ))}
        </div>

        <div className="detail-panel">
          <article className="detail-card full-height">
            <span className="card-label">Profil Detayı</span>
            <h2>{selectedProfile.name}</h2>
            <p>{selectedProfile.story}</p>
            <div className="skills">
              {Object.entries(selectedProfile.skills).map(([key, value]) => (
                <div key={key}>
                  <span>{skillLabels[key] ?? key}</span>
                  <strong>{value}/5</strong>
                </div>
              ))}
            </div>
            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep("MAIN_MENU")}>
                Geri
              </button>
              <button className="btn-primary" onClick={goToMarina}>
                Devam Et
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );

  const renderMarinaSelection = () => (
    <div className="selection-screen fade-in">
      <div className="screen-header">
        <h1>Başlangıç Marinası</h1>
        <p>Hangi limandan yola çıkacaksın? Her bölgenin avantajları farklıdır.</p>
      </div>

      <div className="selection-layout">
        <div className="list-panel">
          {STARTING_MARINAS.map((marina, index) => (
            <button
              key={marina.id}
              className={index === marinaIndex ? "choice active" : "choice"}
              onClick={() => setMarinaIndex(index)}
            >
              <strong>{marina.name}</strong>
              <small>{marina.tagline}</small>
            </button>
          ))}
        </div>

        <div className="detail-panel">
          <article className="detail-card full-height">
            <span className="card-label">Marina Detayı</span>
            <h2>{selectedMarina.name}</h2>
            <p>{selectedMarina.description}</p>
            <div className="info-list">
              <div>
                <span>Bonus</span>
                <strong>{selectedMarina.bonus.title}</strong>
              </div>
              <div>
                <span>Dezavantaj</span>
                <strong>{selectedMarina.disadvantage.title}</strong>
              </div>
            </div>
            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep("PICK_PROFILE")}>
                Geri
              </button>
              <button className="btn-primary" onClick={goToBoat}>
                Limanı Seç
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );

  const renderBoatSelection = () => (
    <div className="selection-screen fade-in">
      <div className="screen-header">
        <h1>Tekneni Seç</h1>
        <p>Bütçene ve hedeflerine uygun tekneyi belirle. Kalan kredi ekipman için kullanılacak.</p>
      </div>

      <div className="selection-layout">
        <div className="list-panel">
          {STARTING_BOATS.map((boat, index) => (
            <button
              key={boat.id}
              className={index === boatIndex ? "choice active" : "choice"}
              onClick={() => setBoatIndex(index)}
            >
              <strong>{boat.name}</strong>
              <small>{boat.lengthFt} ft · {boat.purchaseCost.toLocaleString("tr-TR")} Kredi</small>
            </button>
          ))}
        </div>

        <div className="detail-panel">
          <article className="detail-card full-height">
            <span className="card-label">Tekne Detayı</span>
            <h2>{selectedBoat.name}</h2>
            <p>{selectedBoat.description}</p>
            <div className="info-list">
              <div>
                <span>Avantaj</span>
                <strong>{selectedBoat.advantage.title}</strong>
              </div>
              <div>
                <span>Kalan Bütçe</span>
                <strong>{remainingBudget.toLocaleString("tr-TR")} Kredi</strong>
              </div>
            </div>
            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep("PICK_MARINA")}>
                Geri
              </button>
              <button className="btn-primary" onClick={goToNaming}>
                Tekneyi Al
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );

  const renderBoatNaming = () => (
    <div className="menu-container fade-in">
      <div className="hero-copy centered naming-box">
        <span className="card-label">Son Hazırlık</span>
        <h1>Tekneye İsim Ver</h1>
        <p>Yeni hayatına eşlik edecek yelkenlinin adı ne olsun?</p>
        
        <div className="naming-input-group">
          <input
            type="text"
            placeholder="Mavi Yolcu..."
            value={boatName}
            onChange={(e) => setBoatName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="menu-actions">
          <button className="btn-secondary" onClick={() => setStep("PICK_BOAT")}>
            Geri
          </button>
          <button className="btn-primary large" onClick={finalizeGame}>
            Oyunu Başlat
          </button>
        </div>
      </div>
    </div>
  );

  const renderHub = () => (
    <main className="app-shell hub-screen fade-in">
      <header className="hub-header">
        <div className="hub-title">
          <span className="card-label">{selectedMarina.name} Limanı</span>
          <h1>{boatName}</h1>
          <p>{selectedBoat.name} · {selectedBoat.lengthFt} ft</p>
        </div>
        <div className="hub-stats-main">
          <div className="stat-pill">
            <span>Bütçe</span>
            <strong>{remainingBudget.toLocaleString("tr-TR")} TL</strong>
          </div>
          <div className="stat-pill highlight">
            <span>Takipçi</span>
            <strong>0</strong>
          </div>
        </div>
      </header>

      <section className="hub-grid">
        <article className="hub-panel profile-summary">
          <h2>{selectedProfile.name}</h2>
          <p>{selectedProfile.tagline}</p>
          <div className="mini-skills">
            {Object.entries(selectedProfile.skills).map(([key, value]) => (
              <div key={key} className="skill-item">
                <span>{skillLabels[key] ?? key}</span>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: `${(value / 5) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="hub-panel game-progress">
          <div className="progress-item">
            <div className="progress-info">
              <span>Dünya Turu</span>
              <strong>%0</strong>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: "0%" }}></div>
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-info">
              <span>Okyanus Hazırlığı</span>
              <strong>{selectedBoat.oceanReadiness}</strong>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: "0%" }}></div>
            </div>
          </div>
        </article>

        <article className="hub-panel next-goal">
          <span className="card-label">İlk Görev</span>
          <h2>Rota: {firstRealRoute?.name || "Yunan Adaları"}</h2>
          <p>Yolculuğa başlamadan önce tekneni kontrol et ve içerik planını yap.</p>
          <button className="btn-primary full-width disabled">Seyre Çık (Yakında)</button>
        </article>
      </section>

      <div className="hub-footer">
        <p>Liman Modu · Erken Erişim Prototipi</p>
      </div>
    </main>
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