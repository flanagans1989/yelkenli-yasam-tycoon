import { useState, useEffect } from "react";
import "./App.css";

import { PLAYER_PROFILES } from "../game-data/playerProfiles";
import type { PlayerProfile } from "../game-data/playerProfiles";
import { STARTING_MARINAS } from "../game-data/marinas";
import type { StartingMarina } from "../game-data/marinas";
import { STARTING_BOATS, STARTING_BUDGET } from "../game-data/boats";
import type { StartingBoat } from "../game-data/boats";
import { WORLD_ROUTES, getNextRoute } from "../game-data/routes";
import type { RouteId } from "../game-data/routes";
import { SOCIAL_PLATFORMS } from "../game-data/socialPlatforms";
import { BOAT_UPGRADES, UPGRADE_CATEGORIES } from "../game-data/upgrades";
import type { UpgradeCategoryId } from "../game-data/upgrades";

type Step =
  | "MAIN_MENU"
  | "PICK_PROFILE"
  | "PICK_MARINA"
  | "PICK_BOAT"
  | "NAME_BOAT"
  | "HUB"
  | "SEA_MODE"
  | "ARRIVAL_SCREEN";

type Tab = "liman" | "icerik" | "rota" | "tekne" | "kaptan";

interface ContentResult {
  platform: string;
  type: string;
  quality: number;
  viral: boolean;
  followersGained: number;
  creditsGained: number;
  comment: string;
}

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

const getBaseOceanReadiness = (boatId: string) => {
  if (boatId === "kirlangic_28") return 15;
  if (boatId === "denizkusu_34") return 30;
  if (boatId === "atlas_40") return 45;
  return 0;
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

  // Sea Mode MVP states
  const [currentLocationName, setCurrentLocationName] = useState("");
  const [worldProgress, setWorldProgress] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [water, setWater] = useState(100);
  const [fuel, setFuel] = useState(100);
  const [boatCondition, setBoatCondition] = useState(100);
  
  const [currentRouteId, setCurrentRouteId] = useState<string>("greek_islands");
  const [completedRouteIds, setCompletedRouteIds] = useState<string[]>([]);
  
  const [voyageTotalDays, setVoyageTotalDays] = useState(0);
  const [voyageDaysRemaining, setVoyageDaysRemaining] = useState(0);
  const [currentSeaEvent, setCurrentSeaEvent] = useState("");

  // Content V2 States
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [contentResult, setContentResult] = useState<ContentResult | null>(null);

  // Upgrade V2 State
  const [selectedUpgradeCategory, setSelectedUpgradeCategory] = useState<UpgradeCategoryId>("energy");

  const [hasSave, setHasSave] = useState(false);
  const [saveBoatName, setSaveBoatName] = useState("");

  const selectedProfile: PlayerProfile = PLAYER_PROFILES[profileIndex];
  const selectedMarina: StartingMarina = STARTING_MARINAS[marinaIndex];
  const selectedBoat: StartingBoat = STARTING_BOATS[boatIndex];

  const currentRoute = WORLD_ROUTES.find((route) => route.id === currentRouteId);

  // Dynamic calculations for Upgrades V2
  const purchasedUpgradeObjects = purchasedUpgradeIds.map(id => BOAT_UPGRADES.find(u => u.id === id)).filter(Boolean) as typeof BOAT_UPGRADES;

  const baseOcean = getBaseOceanReadiness(selectedBoat?.id || "");
  const upgradeOceanBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.oceanReadiness || 0), 0);
  const currentOceanReadiness = Math.min(100, baseOcean + upgradeOceanBonus);

  const upgradeContentBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.contentQuality || 0), 0);
  const upgradeEnergyBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.energy || 0), 0);
  const upgradeWaterBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.water || 0), 0);
  const upgradeSafetyBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.safety || 0), 0);
  const upgradeNavigationBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.navigation || 0), 0);
  const upgradeRiskReduction = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.riskReduction || 0), 0);

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

  // Save game when hub/sea states change
  useEffect(() => {
    if (["HUB", "SEA_MODE", "ARRIVAL_SCREEN"].includes(step)) {
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
        step,
        activeTab,
        
        currentLocationName,
        worldProgress,
        energy,
        water,
        fuel,
        boatCondition,
        currentRouteId,
        completedRouteIds,
        voyageTotalDays,
        voyageDaysRemaining,
        currentSeaEvent,
        
        selectedPlatformId,
        selectedContentType,
        contentResult,
        selectedUpgradeCategory,
        
        hasSave: true,
      };
      localStorage.setItem("yelkenli_save", JSON.stringify(saveObj));
      setHasSave(true);
      setSaveBoatName(boatName);
    }
  }, [
    step, profileIndex, marinaIndex, boatIndex, boatName, credits, followers, firstContentDone, 
    logs, purchasedUpgradeIds, activeTab, currentLocationName, worldProgress, energy, water, 
    fuel, boatCondition, currentRouteId, completedRouteIds, voyageTotalDays, voyageDaysRemaining, 
    currentSeaEvent, selectedPlatformId, selectedContentType, contentResult, selectedUpgradeCategory
  ]);

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
    
    // Init Game State
    setCurrentLocationName(selectedMarina.name);
    setWorldProgress(0);
    setEnergy(100);
    setWater(100);
    setFuel(100);
    setBoatCondition(100);
    setCompletedRouteIds([]);
    setCurrentRouteId("greek_islands");
    
    setContentResult(null);
    setSelectedPlatformId(null);
    setSelectedContentType(null);
    setSelectedUpgradeCategory("energy");
    
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
        
        setCurrentLocationName(parsed.currentLocationName ?? "");
        setWorldProgress(parsed.worldProgress ?? 0);
        setEnergy(parsed.energy ?? 100);
        setWater(parsed.water ?? 100);
        setFuel(parsed.fuel ?? 100);
        setBoatCondition(parsed.boatCondition ?? 100);
        setCurrentRouteId(parsed.currentRouteId ?? "greek_islands");
        setCompletedRouteIds(parsed.completedRouteIds ?? []);
        setVoyageTotalDays(parsed.voyageTotalDays ?? 0);
        setVoyageDaysRemaining(parsed.voyageDaysRemaining ?? 0);
        setCurrentSeaEvent(parsed.currentSeaEvent ?? "");

        setSelectedPlatformId(parsed.selectedPlatformId ?? null);
        setSelectedContentType(parsed.selectedContentType ?? null);
        setContentResult(parsed.contentResult ?? null);
        setSelectedUpgradeCategory(parsed.selectedUpgradeCategory ?? "energy");

        setStep(parsed.step && ["HUB", "SEA_MODE", "ARRIVAL_SCREEN"].includes(parsed.step) ? parsed.step : "HUB");
        setActiveTab(parsed.activeTab ?? "liman");
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

  const handleStartVoyage = () => {
    if (!currentRoute) return;
    
    const minD = currentRoute.baseDurationDays.min;
    const maxD = currentRoute.baseDurationDays.max;
    const days = Math.floor(Math.random() * (maxD - minD + 1)) + minD;
    
    setVoyageTotalDays(days);
    setVoyageDaysRemaining(days);
    setCurrentSeaEvent("Rotaya çıkıldı. Rüzgar kolayına.");
    setLogs(prev => [`${currentRoute.name} rotasına çıkıldı.`, ...prev.slice(0, 4)]);
    setStep("SEA_MODE");
    setActiveTab("liman"); // Switch back to sea mode view
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
    
    let effectText = "";
    if (upgrade.effects.oceanReadiness) effectText = "Okyanus hazırlığı arttı.";
    else if (upgrade.effects.contentQuality) effectText = "İçerik kalitesi arttı.";
    else effectText = "Tekne donanımı güçlendi.";
    
    setLogs(prev => [`${upgrade.name} satın alındı. ${effectText}`, ...prev.slice(0, 4)]);
  };

  const advanceDay = () => {
    setVoyageDaysRemaining(prev => {
      const newDays = prev - 1;
      
      let energyDrop = 5;
      if (upgradeEnergyBonus > 20) energyDrop = 3;
      else if (upgradeEnergyBonus > 10) energyDrop = 4;
      
      let waterDrop = 4;
      if (upgradeWaterBonus > 20) waterDrop = 2;
      else if (upgradeWaterBonus > 10) waterDrop = 3;

      let fuelDrop = 3;
      
      setEnergy(e => Math.max(0, e - energyDrop));
      setWater(w => Math.max(0, w - waterDrop));
      setFuel(f => Math.max(0, f - fuelDrop));
      
      let conditionDropChance = 0.7;
      if (upgradeNavigationBonus > 15 || upgradeSafetyBonus > 15) conditionDropChance = 0.85; 
      
      if (Math.random() > conditionDropChance) {
        let dmg = Math.floor(Math.random() * 3) + 1;
        if (upgradeRiskReduction > 10) dmg = Math.max(1, dmg - 1);
        setBoatCondition(c => Math.max(0, c - dmg));
      }
      
      const events = [
        { text: "Uygun rüzgar yakalandı. Harika bir seyir.", effect: () => {} },
        { text: "Harika görüntü fırsatı! +100 takipçi.", effect: () => setFollowers(f => f + 100) },
        { text: "Hafif teknik sorun.", effect: () => setBoatCondition(c => Math.max(0, c - 3)) },
        { text: "Değişken hava. Enerji üretimi azaldı.", effect: () => setEnergy(e => Math.max(0, e - 3)) },
        { text: "Sakin seyir.", effect: () => {} },
        { text: "Kısa video fırsatı. +150 takipçi.", effect: () => setFollowers(f => f + 150) },
        { text: "Küçük sponsor ilgisi. +100 TL.", effect: () => setCredits(cr => cr + 100) },
      ];
      
      const evt = events[Math.floor(Math.random() * events.length)];
      evt.effect();
      setCurrentSeaEvent(evt.text);
      setLogs(logsPrev => [evt.text, ...logsPrev.slice(0, 4)]);
      
      if (newDays <= 0) {
        setStep("ARRIVAL_SCREEN");
      }
      return newDays;
    });
  };

  const handleArrival = () => {
    if (!currentRoute) return;
    
    setWorldProgress(currentRoute.worldProgressPercent);
    setCompletedRouteIds(prev => [...prev, currentRoute.id]);
    setCurrentLocationName(currentRoute.to);
    
    const nextR = getNextRoute(currentRoute.id as RouteId);
    if (nextR) {
       setCurrentRouteId(nextR.id);
    }
    
    setLogs(prev => [`${currentRoute.name} rotası tamamlandı. ${currentRoute.to} limanına varıldı.`, ...prev.slice(0, 4)]);
    setStep("HUB");
    setActiveTab("liman");
  };

  const handleProduceContentV2 = () => {
    if (!selectedPlatformId || !selectedContentType) return;

    let quality = 40;
    
    // Skill bonus
    quality += (selectedProfile.skills.content || 0) * 5;
    
    // Platform match
    const platform = SOCIAL_PLATFORMS.find(p => p.id === selectedPlatformId);
    if (platform && platform.bestContentTypes.includes(selectedContentType as any)) {
      quality += 10;
    }
    
    // Custom specific type logic matching user request
    const isViewTubeMatch = selectedPlatformId === "viewTube" && ["boat_tour", "maintenance_upgrade", "sailing_vlog"].includes(selectedContentType);
    const isClipTokMatch = selectedPlatformId === "clipTok" && ["nature_bay", "sailing_vlog", "storm_vlog"].includes(selectedContentType);
    const isInstaSeaMatch = selectedPlatformId === "instaSea" && ["marina_life", "city_trip", "nature_bay"].includes(selectedContentType);
    const isFacePortMatch = selectedPlatformId === "facePort" && ["marina_life", "boat_tour", "ocean_diary"].includes(selectedContentType);
    
    if (isViewTubeMatch || isClipTokMatch || isInstaSeaMatch || isFacePortMatch) {
      quality += 10;
    }

    // Upgrades bonus
    quality += upgradeContentBonus;

    // Location/Route bonus
    if (step === "SEA_MODE" && currentRoute) {
       if (currentRoute.contentPotential === "very_high") quality += 15;
       else if (currentRoute.contentPotential === "high") quality += 10;
       else if (currentRoute.contentPotential === "medium_high") quality += 5;
    } else {
       quality += 5;
    }

    // Randomizer
    quality += Math.floor(Math.random() * 26) - 10;
    quality = Math.max(0, Math.min(100, quality));

    // Viral Chance
    let viralChance = 0;
    if (quality >= 85) viralChance = 0.25;
    else if (quality >= 70) viralChance = 0.10;
    else if (quality >= 40) viralChance = 0.03;

    const isViral = Math.random() < viralChance;

    let gainFollowers = quality * 5;
    let gainCredits = quality * 8;

    if (selectedPlatformId === "viewTube") { gainCredits *= 1.5; gainFollowers *= 1.0; }
    if (selectedPlatformId === "clipTok") { gainCredits *= 0.8; gainFollowers *= 1.8; }
    if (selectedPlatformId === "instaSea") { gainCredits *= 1.1; gainFollowers *= 1.3; }
    if (selectedPlatformId === "facePort") { gainCredits *= 1.0; gainFollowers *= 1.1; }

    if (isViral) {
      gainFollowers *= 3;
      gainCredits *= 2;
    }

    gainFollowers = Math.floor(gainFollowers);
    gainCredits = Math.floor(gainCredits);

    let comment = "İzleyici bu hikayeyi sevdi.";
    if (isViral) comment = "Algoritma bu içeriği öne çıkardı. Viral oldun!";
    else if (quality < 40) comment = "Görsel kalite iyi ama hikaye zayıf kaldı.";
    else if (quality >= 70) comment = "Sponsorlar bu tarzı fark etmeye başladı.";

    setContentResult({
      platform: platform?.name || "Bilinmeyen",
      type: selectedContentType,
      quality,
      viral: isViral,
      followersGained: gainFollowers,
      creditsGained: gainCredits,
      comment
    });

    setCredits(prev => prev + gainCredits);
    setFollowers(prev => prev + gainFollowers);
    setFirstContentDone(true);

    const logMsg = `${platform?.name} platformunda içerik yayınlandı: +${gainFollowers} Takipçi, +${gainCredits} TL.`;
    setLogs(prev => [logMsg, ...prev.slice(0, 4)]);
  };

  const renderLimanTab = () => (
    <div className="tab-content fade-in">
      <div className="hub-center-visual">
        <div className="visual-circle">
          <span className="visual-icon">⛵</span>
        </div>
        <h3>{currentLocationName}</h3>
      </div>

      <div className="hub-progress-cards">
        <div className="prog-card">
          <span>Dünya Turu</span>
          <strong>%{worldProgress}</strong>
        </div>
        <div className="prog-card">
          <span>Okyanus Hazırlığı</span>
          <strong>{currentOceanReadiness}%</strong>
        </div>
      </div>

      {!firstContentDone ? (
        <button className="quest-card pulse" onClick={() => setActiveTab("icerik")}>
          <div className="quest-icon">🎬</div>
          <div className="quest-texts">
            <h3>İlk içeriğini üret</h3>
            <p>İçerik Stüdyosuna Git</p>
          </div>
        </button>
      ) : (
        <div className="quest-card done">
          <div className="quest-icon">✅</div>
          <div className="quest-texts">
            <h3>{completedRouteIds.length > 0 ? "Yeni limana ulaştın" : "Sıradaki rotaya hazırlan"}</h3>
            <p>Sıradaki Rota: {currentRoute?.name || "Bilinmiyor"}</p>
          </div>
        </div>
      )}

      <div className="event-log-compact">
        <span className="card-label">Son Olaylar</span>
        {logs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
      </div>
    </div>
  );

  const renderSeaModeTab = () => (
    <div className="sea-mode-content fade-in">
      <div className="sea-visual">
        <div className="boat-animation">⛵</div>
      </div>
      
      <div className="sea-status-card">
        <h3 className="days-left">{voyageDaysRemaining} Gün Kaldı</h3>
        <div className="progress-bar-container">
          <div className="progress-fill" style={{width: `${(1 - (voyageDaysRemaining / voyageTotalDays)) * 100}%`}}></div>
        </div>
        <p className="sea-event-text">{currentSeaEvent}</p>
      </div>
      
      <div className="resource-grid">
        <div className="res-card"><span>⚡ Enerji</span><strong>{energy}%</strong></div>
        <div className="res-card"><span>💧 Su</span><strong>{water}%</strong></div>
        <div className="res-card"><span>⛽ Yakıt</span><strong>{fuel}%</strong></div>
        <div className="res-card"><span>🔧 Durum</span><strong>{boatCondition}%</strong></div>
      </div>
      
      <button className="btn-primary large mt-20 pulse-btn" onClick={advanceDay}>Bir Gün İlerle</button>
    </div>
  );

  const renderIcerikTab = () => {
    const CONTENT_TYPES = [
      { id: "marina_life", label: "Marina Yaşamı" },
      { id: "boat_tour", label: "Tekne Turu" },
      { id: "maintenance_upgrade", label: "Bakım / Upgrade" },
      { id: "city_trip", label: "Şehir Gezisi" },
      { id: "nature_bay", label: "Koy / Doğa" },
      { id: "sailing_vlog", label: "Seyir Vlogu" },
    ];
  
    if (step === "SEA_MODE") {
      CONTENT_TYPES.push({ id: "ocean_diary", label: "Deniz Günlüğü" });
      CONTENT_TYPES.push({ id: "storm_vlog", label: "Fırtına / Olay" });
    }

    return (
      <div className="tab-content fade-in">
        <div className="content-stats-header">
           <div className="stat-box"><span>Takipçi</span><strong>{followers.toLocaleString("tr-TR")}</strong></div>
           <div className="stat-box"><span>Bütçe</span><strong>{credits.toLocaleString("tr-TR")} TL</strong></div>
        </div>
        
        {!contentResult ? (
          <>
            <span className="card-label">1. Platform Seç</span>
            <div className="platform-grid">
              {SOCIAL_PLATFORMS.filter(p => p.mvpStatus === "active").map(platform => (
                <button 
                  key={platform.id} 
                  className={`platform-card ${selectedPlatformId === platform.id ? "active" : ""}`} 
                  onClick={() => setSelectedPlatformId(platform.id)}
                >
                  <div className="platform-header">
                    <strong>{platform.name}</strong>
                  </div>
                  <small>{platform.tagline}</small>
                </button>
              ))}
            </div>
  
            <span className="card-label mt-20">2. İçerik Türü Seç</span>
            <div className="type-pills">
              {CONTENT_TYPES.map(type => (
                <button 
                  key={type.id} 
                  className={`type-pill ${selectedContentType === type.id ? "active" : ""}`}
                  onClick={() => setSelectedContentType(type.id)}
                >
                  {type.label}
                </button>
              ))}
            </div>
  
            <button 
              className={`btn-primary large mt-20 ${(!selectedPlatformId || !selectedContentType) ? "disabled" : ""}`} 
              onClick={handleProduceContentV2}
            >
              🎬 İçerik Üret
            </button>
          </>
        ) : (
          <div className="content-result-card fade-in">
             <div className="result-header">
                <h2>Yayınlandı!</h2>
                {contentResult.viral && <span className="viral-badge">🔥 VİRAL</span>}
             </div>
             
             <div className="result-details">
               <div className="res-row"><span>Platform:</span> <strong>{contentResult.platform}</strong></div>
               <div className="res-row"><span>Kalite Skoru:</span> <strong>{contentResult.quality} / 100</strong></div>
             </div>
             
             <div className="result-gains">
               <div className="gain-box followers"><span>+{contentResult.followersGained.toLocaleString("tr-TR")}</span><small>Takipçi</small></div>
               <div className="gain-box credits"><span>+{contentResult.creditsGained.toLocaleString("tr-TR")} TL</span><small>Kredi</small></div>
             </div>
             
             <p className="result-comment">"{contentResult.comment}"</p>
             
             <button className="btn-secondary full-width mt-20" onClick={() => {
               setContentResult(null);
               setSelectedPlatformId(null);
               setSelectedContentType(null);
             }}>Yeni İçerik Üret</button>
          </div>
        )}
      </div>
    );
  };

  const renderRotaTab = () => (
    <div className="tab-content fade-in">
      <span className="card-label">Navigasyon Masası</span>
      <h2>Sıradaki Rotalar</h2>
      
      {currentRoute ? (
        <article className="route-card">
          <div className="route-header">
            <h3>{currentRoute.name}</h3>
            <span className="risk-badge" data-risk={currentRoute.riskLevel}>{currentRoute.riskLevel.toUpperCase()}</span>
          </div>
          <p>{currentRoute.description}</p>
          
          <div className="route-stats">
            <div><span>Süre:</span> <strong>{currentRoute.baseDurationDays.min}-{currentRoute.baseDurationDays.max} Gün</strong></div>
            <div><span>İçerik:</span> <strong>{currentRoute.contentPotential.toUpperCase()}</strong></div>
          </div>

          <button className="btn-primary full-width mt-20" onClick={handleStartVoyage} disabled={step === "SEA_MODE"}>
            {step === "SEA_MODE" ? "Zaten Denizdesin" : "Rotaya Çık"}
          </button>
        </article>
      ) : (
        <p>Tüm rotalar tamamlandı!</p>
      )}
    </div>
  );

  const renderTekneTab = () => {
    const filteredUpgrades = BOAT_UPGRADES.filter(u => u.categoryId === selectedUpgradeCategory);

    return (
      <div className="tab-content fade-in">
        <div className="boat-summary-card">
          <div className="boat-summary-header">
             <div className="boat-summary-visual">⛵</div>
             <div>
                <h2>{boatName}</h2>
                <p>{selectedBoat.name} · {selectedBoat.lengthFt} ft</p>
             </div>
             <div className="boat-summary-credits">
                <strong>{credits.toLocaleString("tr-TR")} TL</strong>
                <small>Bütçe</small>
             </div>
          </div>
          
          <div className="ocean-readiness-box">
             <div className="or-header">
                <span>Okyanus Hazırlığı</span>
                <strong>{currentOceanReadiness}%</strong>
             </div>
             <div className="progress-bar-container mt-10">
                <div className="progress-fill" style={{width: `${currentOceanReadiness}%`}}></div>
             </div>
          </div>
          
          <div className="boat-stats-grid">
             <div className="stat-box-small"><span>Enerji Puanı</span><strong>{upgradeEnergyBonus}</strong></div>
             <div className="stat-box-small"><span>Su / Yaşam</span><strong>{upgradeWaterBonus}</strong></div>
             <div className="stat-box-small"><span>Güvenlik</span><strong>{upgradeSafetyBonus}</strong></div>
             <div className="stat-box-small"><span>Navigasyon</span><strong>{upgradeNavigationBonus}</strong></div>
          </div>
        </div>

        <div className="upgrade-categories-scroll">
           {UPGRADE_CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                className={`category-pill ${selectedUpgradeCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedUpgradeCategory(cat.id)}
              >
                 {cat.name}
              </button>
           ))}
        </div>

        <div className="upgrade-list-v2">
          {filteredUpgrades.map(upgrade => {
            const isPurchased = purchasedUpgradeIds.includes(upgrade.id);
            const comp = upgrade.compatibility.find(c => c.boatId === selectedBoat.id);
            const isCompatible = comp ? comp.compatible : false;
            const hasWarning = comp && (comp.efficiency === "poor" || comp.efficiency === "limited");

            return (
              <div key={upgrade.id} className={`upgrade-card-v2 ${!isCompatible ? "incompatible" : ""}`}>
                <div className="upg-header">
                  <strong>{upgrade.name}</strong>
                  {isPurchased && <span className="badge-purchased">ALINDI</span>}
                </div>
                <p className="upg-desc">{upgrade.description}</p>
                
                <div className="upg-details-grid">
                   <div><small>Süre:</small> {upgrade.installDays} Gün</div>
                   <div><small>Marina:</small> {upgrade.marinaRequirement.toUpperCase()}</div>
                </div>

                {hasWarning && !isPurchased && isCompatible && (
                  <div className="upg-warning">⚠️ Bu teknede verimi sınırlı: {comp.note}</div>
                )}
                {!isCompatible && (
                  <div className="upg-error">❌ Bu tekne için uygun değil.</div>
                )}

                <div className="upg-effects">
                  {Object.entries(upgrade.effects).map(([key, val]) => {
                     if (!val) return null;
                     return <span key={key} className="effect-badge">{key}: +{val}</span>;
                  })}
                </div>
                
                {!isPurchased && isCompatible && (
                  <button 
                    className={`btn-primary full-width mt-10 ${credits < upgrade.cost ? "disabled" : ""}`}
                    onClick={() => handleBuyUpgrade(upgrade.id)}
                  >
                    {credits < upgrade.cost ? "Yetersiz Bütçe" : `${upgrade.cost.toLocaleString("tr-TR")} TL - Satın Al`}
                  </button>
                )}
              </div>
            );
          })}
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
          <div className="goal-bar"><div className="goal-fill" style={{width: `${worldProgress}%`}}></div></div>
        </div>
        <div className="goal-item">
          <span>Takipçi Hedefi (1M)</span>
          <div className="goal-bar"><div className="goal-fill" style={{width: `${Math.min(followers/10000, 100)}%`}}></div></div>
        </div>
      </div>

      <div className="event-log-compact mt-20">
        <span className="card-label">Son Olaylar</span>
        {logs.map((log, i) => <div key={log + i} className="log-entry">{log}</div>)}
      </div>
    </div>
  );

  const renderMainGame = () => {
    return (
      <div className={step === "SEA_MODE" ? "sea-mode-wrapper fade-in" : "hub-wrapper fade-in"}>
        {step === "SEA_MODE" ? (
          <header className="sea-topbar">
            <h2>{boatName}</h2>
            <p>{currentRoute?.name}: {currentRoute?.from} ➔ {currentRoute?.to}</p>
          </header>
        ) : (
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
        )}

        <main className={step === "SEA_MODE" ? "sea-content" : "hub-content"}>
          {activeTab === "liman" && step === "HUB" && renderLimanTab()}
          {activeTab === "liman" && step === "SEA_MODE" && renderSeaModeTab()}
          {activeTab === "icerik" && renderIcerikTab()}
          {activeTab === "rota" && renderRotaTab()}
          {activeTab === "tekne" && renderTekneTab()}
          {activeTab === "kaptan" && renderKaptanTab()}
        </main>

        <nav className="bottom-tab-bar">
          <button className={`tab ${activeTab === "liman" ? "active" : ""}`} onClick={() => setActiveTab("liman")}>
            <span>{step === "SEA_MODE" ? "🌊" : "🏠"}</span> {step === "SEA_MODE" ? "Deniz" : "Liman"}
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
  };

  const renderArrivalScreen = () => (
    <div className="selection-screen fade-in cinematic-bg" style={{justifyContent: 'center'}}>
      <div className="transparent-card centered">
        <h2>Varış!</h2>
        <p>{currentRoute?.to} limanına ulaştın.</p>
        <div style={{fontSize: "64px", margin: "24px 0"}}>⚓</div>
        <p>Dünya turu ilerlemesi: %{currentRoute?.worldProgressPercent}</p>
        <button className="btn-primary large mt-20" onClick={handleArrival}>Limana Dön</button>
      </div>
    </div>
  );

  return (
    <div className="game-wrapper">
      {step === "MAIN_MENU" && renderMainMenu()}
      {step === "PICK_PROFILE" && renderProfileSelection()}
      {step === "PICK_MARINA" && renderMarinaSelection()}
      {step === "PICK_BOAT" && renderBoatSelection()}
      {step === "NAME_BOAT" && renderBoatNaming()}
      {(step === "HUB" || step === "SEA_MODE") && renderMainGame()}
      {step === "ARRIVAL_SCREEN" && renderArrivalScreen()}
    </div>
  );
}

export default App;