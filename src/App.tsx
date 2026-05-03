import { useMemo, useState } from "react";
import "./App.css";

import { PLAYER_PROFILES } from "../game-data/playerProfiles";
import { STARTING_MARINAS } from "../game-data/marinas";
import { STARTING_BOATS, STARTING_BUDGET } from "../game-data/boats";
import { WORLD_ROUTES } from "../game-data/routes";
import { SOCIAL_PLATFORMS } from "../game-data/socialPlatforms";
import { STARTING_ECONOMY } from "../game-data/economy";

const skillLabels: Record<string, string> = {
  seamanship: "Denizcilik",
  content: "İçerik",
  technical: "Teknik",
  sponsor: "Sponsor",
  riskManagement: "Risk",
  lifestyle: "Yaşam",
};

function App() {
  const [profileIndex, setProfileIndex] = useState(0);
  const [marinaIndex, setMarinaIndex] = useState(0);
  const [boatIndex, setBoatIndex] = useState(1);

  const selectedProfile = PLAYER_PROFILES[profileIndex];
  const selectedMarina = STARTING_MARINAS[marinaIndex];
  const selectedBoat = STARTING_BOATS[boatIndex];

  const remainingBudget = STARTING_BUDGET - selectedBoat.purchaseCost;

  const activePlatforms = useMemo(
    () => SOCIAL_PLATFORMS.filter((platform) => platform.mvpStatus === "active"),
    []
  );

  const firstRealRoute = WORLD_ROUTES.find((route) => route.order === 2);
  const oceanRoutes = WORLD_ROUTES.filter((route) => route.isOceanCrossing);

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Mobil Tycoon / Simulation Prototipi</p>
          <h1>Yelkenli Yaşam Tycoon</h1>
          <p className="hero-text">
            Türkiye’den bir marinada başla, tekneni seç, içerik üret, takipçi
            kazan, upgrade yap ve dünya turuna çık.
          </p>

          <div className="target-row">
            <div>
              <span>Dünya Turu</span>
              <strong>%0</strong>
            </div>
            <div>
              <span>Takipçi Hedefi</span>
              <strong>{STARTING_ECONOMY.followerGoal.toLocaleString("tr-TR")}</strong>
            </div>
            <div>
              <span>Okyanus Hazırlığı</span>
              <strong>{STARTING_ECONOMY.oceanReadinessGoal}/100</strong>
            </div>
          </div>
        </div>

        <div className="captain-card">
          <span className="card-label">Seçili Başlangıç</span>
          <h2>{selectedProfile.name}</h2>
          <p>{selectedProfile.tagline}</p>
          <div className="budget-box">
            <span>Kalan Bütçe</span>
            <strong>{remainingBudget.toLocaleString("tr-TR")} Kredi</strong>
          </div>
        </div>
      </section>

      <section className="selection-grid">
        <article className="panel">
          <div className="panel-header">
            <span>1</span>
            <div>
              <h2>Oyuncu Profili</h2>
              <p>Oynanış tarzını seç.</p>
            </div>
          </div>

          <div className="button-list">
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
        </article>

        <article className="panel">
          <div className="panel-header">
            <span>2</span>
            <div>
              <h2>Başlangıç Marinası</h2>
              <p>İlk ekonomi ve rota hissini belirle.</p>
            </div>
          </div>

          <div className="button-list">
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
        </article>

        <article className="panel">
          <div className="panel-header">
            <span>3</span>
            <div>
              <h2>Başlangıç Teknesi</h2>
              <p>Risk, konfor ve bütçeni belirle.</p>
            </div>
          </div>

          <div className="button-list">
            {STARTING_BOATS.map((boat, index) => (
              <button
                key={boat.id}
                className={index === boatIndex ? "choice active" : "choice"}
                onClick={() => setBoatIndex(index)}
              >
                <strong>{boat.name}</strong>
                <small>
                  {boat.lengthFt} ft · {boat.purchaseCost.toLocaleString("tr-TR")} Kredi
                </small>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
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
        </article>

        <article className="detail-card">
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
            <div>
              <span>İlk Rotalar</span>
              <strong>{selectedMarina.firstRouteOptions.join(", ")}</strong>
            </div>
          </div>
        </article>

        <article className="detail-card">
          <span className="card-label">Tekne Detayı</span>
          <h2>{selectedBoat.name}</h2>
          <p>{selectedBoat.description}</p>

          <div className="info-list">
            <div>
              <span>Avantaj</span>
              <strong>{selectedBoat.advantage.title}</strong>
            </div>
            <div>
              <span>Dezavantaj</span>
              <strong>{selectedBoat.disadvantage.title}</strong>
            </div>
            <div>
              <span>Okyanus Hazırlığı</span>
              <strong>{selectedBoat.oceanReadiness}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="roadmap-panel">
        <div>
          <span className="card-label">İlk Oynanabilir Akış</span>
          <h2>Sıradaki hedef: Yeni Oyun Başlangıç Akışı</h2>
          <p>
            Bu ekran şu anda game-data dosyalarının doğru okunduğunu gösteren
            ilk çalışan prototip ekranıdır. Sonraki adımda bunu gerçek
            “Yeni Oyun → Profil → Marina → Tekne → Liman Modu” akışına
            çevireceğiz.
          </p>
        </div>

        <div className="mini-stats">
          <div>
            <span>Profil</span>
            <strong>{PLAYER_PROFILES.length}</strong>
          </div>
          <div>
            <span>Marina</span>
            <strong>{STARTING_MARINAS.length}</strong>
          </div>
          <div>
            <span>Tekne</span>
            <strong>{STARTING_BOATS.length}</strong>
          </div>
          <div>
            <span>Rota</span>
            <strong>{WORLD_ROUTES.length}</strong>
          </div>
          <div>
            <span>Aktif Platform</span>
            <strong>{activePlatforms.length}</strong>
          </div>
          <div>
            <span>Okyanus Geçişi</span>
            <strong>{oceanRoutes.length}</strong>
          </div>
        </div>

        {firstRealRoute && (
          <div className="next-route">
            <span>Sıradaki ilk rota</span>
            <strong>{firstRealRoute.name}</strong>
            <small>{firstRealRoute.feeling}</small>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;