import { useState, useEffect } from "react";
import "./App.css";

import type { Step, Tab, ContentResult, MarinaFilter } from "./types/game";
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
import { getSponsorTierByFollowers } from "../game-data/economy";
import { skillLabels, profileIcons } from "./data/labels";
import { Onboarding, getBoatSvg } from "./components/Onboarding";
import { HubScreen } from "./components/HubScreen";
import { LimanTab } from "./components/LimanTab";
import { RotaTab } from "./components/RotaTab";
import { SeaModeTab } from "./components/SeaModeTab";

const SAVE_KEY = "yelkenli_save";
const SAVE_VERSION = 1;
const MAX_OFFLINE_MINUTES = 480;
const OFFLINE_CREDITS_PER_MINUTE = 15;

type SeaDecisionEffect = {
  credits?: number;
  followers?: number;
  energy?: number;
  water?: number;
  fuel?: number;
  boatCondition?: number;
  remainingDays?: number;
};

type SeaDecisionChoice = {
  label: string;
  resultText: string;
  effect: SeaDecisionEffect;
};

type SeaDecisionEvent = {
  id: string;
  title: string;
  description: string;
  choiceA: SeaDecisionChoice;
  choiceB: SeaDecisionChoice;
};

const SEA_DECISION_EVENTS: SeaDecisionEvent[] = [
  {
    id: "fuel_running_low",
    title: "Yakıt Azalıyor",
    description: "Depodaki tüketim beklenenden hızlı gidiyor. Hızı düşürmek süreyi uzatır ama motoru rahatlatır.",
    choiceA: {
      label: "Hızı düşür",
      resultText: "Hız azaltıldı. Tüketim dengelendi ama rota bir gün uzadı.",
      effect: { fuel: 4, remainingDays: 1 },
    },
    choiceB: {
      label: "Aynı hızda devam et",
      resultText: "Program korundu ama depodan daha fazla yakıt çekildi.",
      effect: { fuel: -9 },
    },
  },
  {
    id: "mild_storm_signs",
    title: "Hafif Fırtına İşaretleri",
    description: "Ufukta hava bozuyor. Güvenli rota enerji ister, direkt devam etmek tekneyi zorlayabilir.",
    choiceA: {
      label: "Rotayı güvene al",
      resultText: "Daha güvenli hatta geçildi. Enerji düştü ama tekne korunmuş oldu.",
      effect: { energy: -8 },
    },
    choiceB: {
      label: "Devam et",
      resultText: "Fırtına kenarından geçildi. Tekne biraz hırpalandı.",
      effect: { boatCondition: -7 },
    },
  },
  {
    id: "technical_noise",
    title: "Teknik Arıza Sesi",
    description: "Motor bölümünden alışılmadık bir ses geliyor. Hemen bakmak zaman ve enerji ister.",
    choiceA: {
      label: "Hemen kontrol et",
      resultText: "Sorun erken fark edildi. Biraz enerji gitti ama hasar sınırlı kaldı.",
      effect: { energy: -7, boatCondition: -2 },
    },
    choiceB: {
      label: "Görmezden gel",
      resultText: "Ses büyüdü ve sistem biraz daha yıprandı.",
      effect: { boatCondition: -9 },
    },
  },
  {
    id: "content_opportunity",
    title: "İçerik Fırsatı",
    description: "Işık ve deniz tam kıvamında. Kamera açılırsa güzel içerik ve gelir çıkabilir.",
    choiceA: {
      label: "Video çek",
      resultText: "Kısa bir çekim iyi performans verdi. Takipçi ve kredi geldi.",
      effect: { energy: -10, followers: 120, credits: 180 },
    },
    choiceB: {
      label: "Dinlen",
      resultText: "Kamera kapalı kaldı. Enerji korundu, sakin seyir sürdü.",
      effect: {},
    },
  },
];

const getBaseOceanReadiness = (boatId: string) => {
  if (boatId === "kirlangic_28") return 15;
  if (boatId === "denizkusu_34") return 30;
  if (boatId === "atlas_40") return 45;
  return 0;
};

const upgradeEffectLabels: Record<string, string> = {
  energy: "Enerji",
  water: "Su",
  safety: "Güvenlik",
  navigation: "Navigasyon",
  maintenance: "Bakım",
  oceanReadiness: "Okyanus Hazırlığı",
  riskReduction: "Risk Azaltma",
  contentQuality: "İçerik Kalitesi",
  speed: "Hız",
  engine: "Motor",
};

const getRouteCompletionRewards = (route: (typeof WORLD_ROUTES)[number]) => {
  const contentPotentialMultipliers: Record<string, number> = {
    low: 0.75,
    low_medium: 0.9,
    medium: 1,
    medium_high: 1.25,
    high: 1.5,
    very_high: 2,
  };

  const riskLevelMultipliers: Record<string, number> = {
    low: 0.8,
    low_medium: 0.9,
    medium: 1,
    medium_high: 1.25,
    high: 1.5,
    very_high: 2,
    final: 2.5,
  };

  const credits = Math.floor(5000 * (riskLevelMultipliers[route.riskLevel] ?? 1));
  const followers = Math.floor(2500 * (contentPotentialMultipliers[route.contentPotential] ?? 1));

  return { credits, followers };
};

function migrateSave(parsed: any) {
  if (!parsed || typeof parsed !== "object") return null;

  const version = parsed.saveVersion ?? 1;

  if (version === 1) {
    return {
      ...parsed,
      saveVersion: SAVE_VERSION,
      hasSave: parsed.hasSave ?? true,
    };
  }

  return null;
}

function App() {
  const [step, setStep] = useState<Step>("MAIN_MENU");
  const [activeTab, setActiveTab] = useState<Tab>("liman");
  const [profileIndex, setProfileIndex] = useState(0);
  const [marinaIndex, setMarinaIndex] = useState(0);
  const [marinaFilter, setMarinaFilter] = useState<MarinaFilter>("all");
  const [boatIndex, setBoatIndex] = useState(0);
  const [boatName, setBoatName] = useState("");
  const [onboardingMessage, setOnboardingMessage] = useState("");
  
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
  const [pendingDecisionId, setPendingDecisionId] = useState<string | null>(null);

  // Content V2 States
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [contentResult, setContentResult] = useState<ContentResult | null>(null);

  // Upgrade V2 State
  const [selectedUpgradeCategory, setSelectedUpgradeCategory] = useState<UpgradeCategoryId>("energy");

  // Sponsor MVP States
  const [brandTrust, setBrandTrust] = useState(10);
  const [sponsorOffers, setSponsorOffers] = useState<any[]>([]);
  const [acceptedSponsors, setAcceptedSponsors] = useState<string[]>([]);
  const [sponsoredContentCount, setSponsoredContentCount] = useState(0);
  const [icerikSubTab, setIcerikSubTab] = useState<"produce" | "sponsor">("produce");

  const [hasSave, setHasSave] = useState(false);
  const [saveBoatName, setSaveBoatName] = useState("");

  // Flash animation states
  const [flashCredits, setFlashCredits] = useState(false);
  const [flashFollowers, setFlashFollowers] = useState(false);

  const triggerFlash = (type: "credits" | "followers") => {
    if (type === "credits") {
      setFlashCredits(true);
      setTimeout(() => setFlashCredits(false), 600);
    } else {
      setFlashFollowers(true);
      setTimeout(() => setFlashFollowers(false), 600);
    }
  };

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
  const upgradeMaintenanceBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.maintenance || 0), 0);
  const upgradeRiskReduction = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.riskReduction || 0), 0);

  const currentRouteReadinessItems = currentRoute ? [
    { current: currentOceanReadiness, required: currentRoute.requirements.minOceanReadiness ?? 0 },
    { current: upgradeEnergyBonus, required: currentRoute.requirements.minEnergy },
    { current: upgradeWaterBonus, required: currentRoute.requirements.minWater },
    { current: upgradeSafetyBonus, required: currentRoute.requirements.minSafety },
    { current: upgradeNavigationBonus, required: currentRoute.requirements.minNavigation },
    { current: upgradeMaintenanceBonus, required: currentRoute.requirements.minMaintenance },
  ] : [];

  const currentRouteReadinessGapCount = currentRouteReadinessItems.filter(item => item.current < item.required).length;
  const hasRouteReadinessGap = currentRouteReadinessGapCount > 0;

  // Load save on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = migrateSave(JSON.parse(saved));
        if (parsed?.hasSave) {
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
        pendingDecisionId,
        
        selectedPlatformId,
        selectedContentType,
        contentResult,
        selectedUpgradeCategory,

        brandTrust,
        sponsorOffers,
        acceptedSponsors,
        sponsoredContentCount,
        icerikSubTab,
        lastSavedAt: Date.now(),
        saveVersion: SAVE_VERSION,
        
        hasSave: true,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveObj));
      setHasSave(true);
      setSaveBoatName(boatName);
    }
  }, [
    step, profileIndex, marinaIndex, boatIndex, boatName, credits, followers, firstContentDone, 
    logs, purchasedUpgradeIds, activeTab, currentLocationName, worldProgress, energy, water, 
    fuel, boatCondition, currentRouteId, completedRouteIds, voyageTotalDays, voyageDaysRemaining, 
    currentSeaEvent, pendingDecisionId, selectedPlatformId, selectedContentType, contentResult, selectedUpgradeCategory,
    brandTrust, sponsorOffers, acceptedSponsors, sponsoredContentCount, icerikSubTab
  ]);

  // Flow handlers
  const finalizeGame = () => {
    if (boatName.trim() === "") {
      setOnboardingMessage("Lütfen teknenize bir isim verin.");
      return;
    }
    setOnboardingMessage("");
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
    setPendingDecisionId(null);
    
    setContentResult(null);
    setSelectedPlatformId(null);
    setSelectedContentType(null);
    setSelectedUpgradeCategory("energy");

    setBrandTrust(10);
    setSponsorOffers([]);
    setAcceptedSponsors([]);
    setSponsoredContentCount(0);
    setIcerikSubTab("produce");

    setStep("HUB");
    setActiveTab("liman");
  };

  const loadGame = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = migrateSave(JSON.parse(saved));
        if (!parsed) return;
        const savedCredits = parsed.credits ?? 0;
        const savedLogs = parsed.logs ?? [];
        const savedLastSavedAt = parsed.lastSavedAt;

        let offlineMinutes = 0;
        let offlineCredits = 0;

        if (typeof savedLastSavedAt === "number" && Number.isFinite(savedLastSavedAt)) {
          const offlineMs = Math.max(0, Date.now() - savedLastSavedAt);
          offlineMinutes = Math.min(Math.floor(offlineMs / 60000), MAX_OFFLINE_MINUTES);
          offlineCredits = Math.max(0, offlineMinutes * OFFLINE_CREDITS_PER_MINUTE);
        }

        const passiveIncomeMessage =
          offlineCredits > 0
            ? `Pasif gelir: ${offlineMinutes} dakika içinde +${offlineCredits.toLocaleString("tr-TR")} TL birikti.`
            : "";

        setProfileIndex(parsed.profileIndex ?? 0);
        setMarinaIndex(parsed.marinaIndex ?? 0);
        setBoatIndex(parsed.boatIndex ?? 0);
        setBoatName(parsed.boatName ?? "");
        setCredits(savedCredits + offlineCredits);
        setFollowers(parsed.followers ?? 0);
        setFirstContentDone(parsed.firstContentDone ?? false);
        setLogs(
          passiveIncomeMessage
            ? [passiveIncomeMessage, ...savedLogs.slice(0, 4)]
            : savedLogs
        );
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
        setCurrentSeaEvent(passiveIncomeMessage || (parsed.currentSeaEvent ?? ""));
        setPendingDecisionId(parsed.pendingDecisionId ?? null);

        setSelectedPlatformId(parsed.selectedPlatformId ?? null);
        setSelectedContentType(parsed.selectedContentType ?? null);
        setContentResult(parsed.contentResult ?? null);
        setSelectedUpgradeCategory(parsed.selectedUpgradeCategory ?? "energy");

        setBrandTrust(parsed.brandTrust ?? 10);
        setSponsorOffers(parsed.sponsorOffers ?? []);
        setAcceptedSponsors(parsed.acceptedSponsors ?? []);
        setSponsoredContentCount(parsed.sponsoredContentCount ?? 0);
        setIcerikSubTab(parsed.icerikSubTab ?? "produce");

        const safeStep = parsed.step && ["HUB", "SEA_MODE", "ARRIVAL_SCREEN"].includes(parsed.step) ? parsed.step : "HUB";
        const routeValid = WORLD_ROUTES.some(r => r.id === parsed.currentRouteId);
        setStep(safeStep === "SEA_MODE" && !routeValid ? "HUB" : safeStep);
        setActiveTab(parsed.activeTab ?? "liman");
      } catch (e) {
        console.error("Load error", e);
      }
    }
  };


  const handleStartVoyage = () => {
    if (!currentRoute) return;
    
    const minD = currentRoute.baseDurationDays.min;
    const maxD = currentRoute.baseDurationDays.max;
    const days = Math.floor(Math.random() * (maxD - minD + 1)) + minD;
    
    const readinessRiskText = hasRouteReadinessGap ? " Hazırlık eksikleri bu rotada riski artırıyor." : "";

    setVoyageTotalDays(days);
    setVoyageDaysRemaining(days);
    setPendingDecisionId(null);
    setCurrentSeaEvent(`Rotaya çıkıldı. Rüzgar kolayına.${readinessRiskText}`);
    setLogs(prev => [`${currentRoute.name} rotasına çıkıldı.${readinessRiskText}`, ...prev.slice(0, 4)]);
    setStep("SEA_MODE");
    setActiveTab("liman"); // Switch back to sea mode view
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = BOAT_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (credits < upgrade.cost) {
      setLogs(prev => ["Yetersiz bütçe. Bu upgrade için daha fazla kredi gerekiyor.", ...prev.slice(0, 4)]);
      return;
    }

    setCredits(prev => prev - upgrade.cost);
    setPurchasedUpgradeIds(prev => [...prev, upgradeId]);
    triggerFlash("credits");

    const energyBoost = upgrade.effects.energy ?? 0;
    const waterBoost = upgrade.effects.water ?? 0;
    const conditionBoost =
      (upgrade.effects.maintenance ?? 0) +
      Math.floor((upgrade.effects.safety ?? 0) / 2) +
      Math.floor((upgrade.effects.riskReduction ?? 0) / 2) +
      Math.floor((upgrade.effects.oceanReadiness ?? 0) / 2);

    if (energyBoost > 0) setEnergy(prev => Math.min(100, prev + energyBoost));
    if (waterBoost > 0) setWater(prev => Math.min(100, prev + waterBoost));
    if (conditionBoost > 0) setBoatCondition(prev => Math.min(100, prev + conditionBoost));

    let effectText = "";
    if (energyBoost > 0) effectText = `Enerji ${energyBoost} puan toparlandı.`;
    else if (waterBoost > 0) effectText = `Su ${waterBoost} puan toparlandı.`;
    else if (conditionBoost > 0) effectText = `Tekne durumu ${conditionBoost} puan toparlandı.`;
    else if (upgrade.effects.oceanReadiness) effectText = "Okyanus hazırlığı arttı.";
    else if (upgrade.effects.contentQuality) effectText = "İçerik kalitesi arttı.";
    else effectText = "Tekne donanımı güçlendi.";

    setLogs(prev => [`${upgrade.name} satın alındı. ${effectText}`, ...prev.slice(0, 4)]);
  };

  const handleMarinaRest = () => {
    setEnergy(prev => Math.min(100, prev + 30));
    setWater(prev => Math.min(100, prev + 30));
    setFuel(prev => Math.min(100, prev + 20));
    setBoatCondition(prev => Math.min(100, prev + 10));
    setLogs(prev => ["Marina’da dinlenildi. Enerji, su, yakıt ve tekne durumu toparlandı.", ...prev.slice(0, 4)]);
  };

  const handleRepairBoat = () => {
    if (credits < 250) {
      setLogs(prev => ["Tekneyi onarmak için yeterli bütçe yok.", ...prev.slice(0, 4)]);
      return;
    }

    if (boatCondition >= 100) {
      setLogs(prev => ["Tekne zaten tam durumda.", ...prev.slice(0, 4)]);
      return;
    }

    setCredits(prev => prev - 250);
    setBoatCondition(prev => Math.min(100, prev + 35));
    triggerFlash("credits");
    setLogs(prev => ["Tekne onarıldı. Durum 35 puan toparlandı.", ...prev.slice(0, 4)]);
  };

  const advanceDay = () => {
    if (step !== "SEA_MODE" || !currentRoute || pendingDecisionId) return;

    if (Math.random() < 0.3) {
      const nextDecision = SEA_DECISION_EVENTS[Math.floor(Math.random() * SEA_DECISION_EVENTS.length)];
      setPendingDecisionId(nextDecision.id);
      setCurrentSeaEvent(nextDecision.description);
      return;
    }

    setVoyageDaysRemaining(prev => {
      const newDays = prev - 1;
      const readinessPenalty = Math.min(currentRouteReadinessGapCount, 3);

      let energyDrop = 5 + (readinessPenalty > 0 ? 1 : 0);
      if (upgradeEnergyBonus > 20) energyDrop = 3 + (readinessPenalty > 0 ? 1 : 0);
      else if (upgradeEnergyBonus > 10) energyDrop = 4 + (readinessPenalty > 0 ? 1 : 0);

      let waterDrop = 4 + (readinessPenalty > 1 ? 1 : 0);
      if (upgradeWaterBonus > 20) waterDrop = 2 + (readinessPenalty > 1 ? 1 : 0);
      else if (upgradeWaterBonus > 10) waterDrop = 3 + (readinessPenalty > 1 ? 1 : 0);

      let fuelDrop = 3 + (readinessPenalty > 2 ? 1 : 0);

      setEnergy(e => Math.max(0, e - energyDrop));
      setWater(w => Math.max(0, w - waterDrop));
      setFuel(f => Math.max(0, f - fuelDrop));

      let conditionDropChance = 0.7;
      if (upgradeNavigationBonus > 15 || upgradeSafetyBonus > 15) conditionDropChance = 0.85;
      if (readinessPenalty > 0) conditionDropChance = Math.max(0.45, conditionDropChance - readinessPenalty * 0.08);

      if (Math.random() > conditionDropChance) {
        let dmg = Math.floor(Math.random() * 3) + 1;
        if (upgradeRiskReduction > 10) dmg = Math.max(1, dmg - 1);
        setBoatCondition(c => Math.max(0, c - dmg));
      }

      const events = [
        { text: "Uygun rüzgar yakalandı. Harika bir seyir.", effect: () => {} },
        { text: "Harika görüntü fırsatı! +100 takipçi.", effect: () => { setFollowers(f => f + 100); triggerFlash("followers"); } },
        { text: "Hafif teknik sorun.", effect: () => setBoatCondition(c => Math.max(0, c - 3)) },
        { text: "Değişken hava. Enerji üretimi azaldı.", effect: () => setEnergy(e => Math.max(0, e - 3)) },
        { text: "Sakin seyir.", effect: () => {} },
        { text: "Kısa video fırsatı. +150 takipçi.", effect: () => { setFollowers(f => f + 150); triggerFlash("followers"); } },
        { text: "Küçük sponsor ilgisi. +100 TL.", effect: () => { setCredits(cr => cr + 100); triggerFlash("credits"); } },
      ];

      if (hasRouteReadinessGap) {
        events.push({
          text: "Hazırlık eksikleri seyri zorlaştırdı. Kaynak tüketimi arttı.",
          effect: () => {
            setEnergy(e => Math.max(0, e - 2));
            setWater(w => Math.max(0, w - 2));
            setBoatCondition(c => Math.max(0, c - 2));
          },
        });
      }

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

  const handleResolveSeaDecision = (choiceKey: "choiceA" | "choiceB") => {
    if (!pendingDecisionId) return;

    const decision = SEA_DECISION_EVENTS.find(event => event.id === pendingDecisionId);
    if (!decision) {
      setPendingDecisionId(null);
      return;
    }

    const choice = decision[choiceKey];
    const effect = choice.effect;
    const creditsDelta = effect.credits;
    const followersDelta = effect.followers;
    const energyDelta = effect.energy;
    const waterDelta = effect.water;
    const fuelDelta = effect.fuel;
    const boatConditionDelta = effect.boatCondition;
    const remainingDaysDelta = effect.remainingDays;

    if (typeof creditsDelta === "number") {
      setCredits(prev => Math.max(0, prev + creditsDelta));
      triggerFlash("credits");
    }

    if (typeof followersDelta === "number") {
      setFollowers(prev => Math.max(0, prev + followersDelta));
      triggerFlash("followers");
    }

    if (typeof energyDelta === "number") {
      setEnergy(prev => Math.max(0, Math.min(100, prev + energyDelta)));
    }
    if (typeof waterDelta === "number") {
      setWater(prev => Math.max(0, Math.min(100, prev + waterDelta)));
    }
    if (typeof fuelDelta === "number") {
      setFuel(prev => Math.max(0, Math.min(100, prev + fuelDelta)));
    }
    if (typeof boatConditionDelta === "number") {
      setBoatCondition(prev => Math.max(0, Math.min(100, prev + boatConditionDelta)));
    }
    if (typeof remainingDaysDelta === "number") {
      setVoyageDaysRemaining(prev => Math.max(0, prev + remainingDaysDelta));
    }

    setCurrentSeaEvent(choice.resultText);
    setLogs(prev => [`${decision.title}: ${choice.resultText}`, ...prev.slice(0, 4)]);
    setPendingDecisionId(null);
  };

  const handleArrival = () => {
    if (!currentRoute) return;

    const reward = getRouteCompletionRewards(currentRoute);

    setWorldProgress(currentRoute.worldProgressPercent);
    setCompletedRouteIds(prev => [...prev, currentRoute.id]);
    setCurrentLocationName(currentRoute.to);
    setCredits(prev => prev + reward.credits);
    setFollowers(prev => prev + reward.followers);
    triggerFlash("credits");
    triggerFlash("followers");

    const nextR = getNextRoute(currentRoute.id as RouteId);
    if (nextR) {
       setCurrentRouteId(nextR.id);
    }

    setLogs(prev => [`${currentRoute.name} rotası tamamlandı. ${currentRoute.to} limanına varıldı. +${reward.credits} TL, +${reward.followers} takipçi ödül alındı.`, ...prev.slice(0, 4)]);
    setPendingDecisionId(null);
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
    triggerFlash("credits");
    triggerFlash("followers");

    const logMsg = `${platform?.name} platformunda içerik yayınlandı: +${gainFollowers} Takipçi, +${gainCredits} TL.`;
    setLogs(prev => [logMsg, ...prev.slice(0, 4)]);
  };

  const handleCheckSponsorOffers = () => {
    const tier = getSponsorTierByFollowers(followers, brandTrust);
    if (!tier) {
      setLogs(prev => ["Şu an uygun sponsor teklifi yok. Takipçi ve marka güvenini artır.", ...prev.slice(0, 4)]);
      return;
    }
    
    const sponsorBrands = ["BlueWave Kamera", "Marina Plus", "OceanSafe Güvenlik", "SolarDeck Enerji", "SailWear Outdoor", "DeepRoute Navigasyon"];
    const randomBrand = sponsorBrands[Math.floor(Math.random() * sponsorBrands.length)];
    
    const newOffer = {
      id: "spo_" + Date.now(),
      brandName: randomBrand,
      tierName: tier.name,
      tierId: tier.tier,
      minReward: tier.rewardRange.min,
      maxReward: tier.rewardRange.max,
    };
    
    setSponsorOffers(prev => [...prev, newOffer]);
  };

  const handleAcceptSponsor = (offerId: string) => {
    const offer = sponsorOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    let baseReward = Math.floor(Math.random() * (offer.maxReward - offer.minReward + 1)) + offer.minReward;
    if (selectedProfile.id === "social_entrepreneur") {
      baseReward = Math.floor(baseReward * 1.1); 
    }
    
    setCredits(prev => prev + baseReward);
    setAcceptedSponsors(prev => [...prev, offer.brandName]);
    setSponsorOffers(prev => prev.filter(o => o.id !== offerId));
    triggerFlash("credits");
    
    const newCount = sponsoredContentCount + 1;
    setSponsoredContentCount(newCount);
    
    if (newCount % 3 === 0) {
      setLogs(prev => [`${offer.brandName} teklifi kabul edildi (+${baseReward} TL). Ancak takipçiler sürekli sponsorlu içeriklerden sıkılmaya başladı.`, ...prev.slice(0, 4)]);
    } else {
      setBrandTrust(prev => prev + 2);
      setLogs(prev => [`${offer.brandName} teklifi kabul edildi (+${baseReward} TL). Marka güveni arttı.`, ...prev.slice(0, 4)]);
    }
  };

  const renderLimanTab = () => (
    <LimanTab
      selectedBoatId={selectedBoat.id}
      currentLocationName={currentLocationName}
      worldProgress={worldProgress}
      currentOceanReadiness={currentOceanReadiness}
      credits={credits}
      energy={energy}
      water={water}
      fuel={fuel}
      boatCondition={boatCondition}
      firstContentDone={firstContentDone}
      completedRouteIds={completedRouteIds}
      currentRouteName={currentRoute?.name}
      logs={logs}
      onMarinaRest={handleMarinaRest}
      onRepairBoat={handleRepairBoat}
      onGoContent={() => setActiveTab("icerik")}
      onGoRoute={() => setActiveTab("rota")}
    />
  );

  const renderSeaModeTab = () => (
    <SeaModeTab
      selectedBoatId={selectedBoat.id}
      voyageDaysRemaining={voyageDaysRemaining}
      voyageTotalDays={voyageTotalDays}
      currentSeaEvent={currentSeaEvent}
      energy={energy}
      water={water}
      fuel={fuel}
      boatCondition={boatCondition}
      onAdvanceDay={advanceDay}
      pendingDecision={
        pendingDecisionId
          ? SEA_DECISION_EVENTS.find(event => event.id === pendingDecisionId) ?? null
          : null
      }
      onResolveDecision={handleResolveSeaDecision}
    />
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

        <div className="sub-tab-bar">
           <button className={`sub-tab ${icerikSubTab === "produce" ? "active" : ""}`} onClick={() => setIcerikSubTab("produce")}>İçerik Üret</button>
           <button className={`sub-tab ${icerikSubTab === "sponsor" ? "active" : ""}`} onClick={() => setIcerikSubTab("sponsor")}>Sponsorluklar</button>
        </div>
        
        {icerikSubTab === "produce" && (
          <div className="fade-in">
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
        )}

        {icerikSubTab === "sponsor" && (
          <div className="sponsor-section fade-in">
            <div className="brand-trust-card">
               <span>Marka Güveni (Brand Trust)</span>
               <strong>{brandTrust} / 100</strong>
            </div>

            <button className="btn-primary full-width mb-20" onClick={handleCheckSponsorOffers}>
               Teklifleri Kontrol Et
            </button>

            <h3 className="section-title">Gelen Teklifler</h3>
            {sponsorOffers.length === 0 ? (
               <p className="empty-text">Henüz yeni bir sponsor teklifi yok. Daha fazla takipçi kazan veya içerik kaliteni artır.</p>
            ) : (
               <div className="sponsor-offers-list">
                  {sponsorOffers.map(offer => (
                     <div key={offer.id} className="sponsor-card fade-in">
                        <div className="spo-header">
                           <strong>{offer.brandName}</strong>
                           <span className="spo-tier">{offer.tierName}</span>
                        </div>
                        <p>Beklenen Ödül: {offer.minReward.toLocaleString("tr-TR")} - {offer.maxReward.toLocaleString("tr-TR")} TL</p>
                        <button className="btn-buy mt-10 full-width" onClick={() => handleAcceptSponsor(offer.id)}>Kabul Et</button>
                     </div>
                  ))}
               </div>
            )}

            {acceptedSponsors.length > 0 && (
               <>
                  <h3 className="section-title mt-20">Aktif Sponsorlar</h3>
                  <div className="accepted-sponsors-list">
                     {acceptedSponsors.map((name, i) => <span key={i} className="spo-badge">{name}</span>)}
                  </div>
               </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRotaTab = () => (
    <RotaTab
      currentRoute={currentRoute}
      routeReadiness={{
        oceanReadiness: {
          current: currentOceanReadiness,
          required: currentRoute?.requirements.minOceanReadiness ?? 0,
        },
        energy: {
          current: upgradeEnergyBonus,
          required: currentRoute?.requirements.minEnergy ?? 0,
        },
        water: {
          current: upgradeWaterBonus,
          required: currentRoute?.requirements.minWater ?? 0,
        },
        safety: {
          current: upgradeSafetyBonus,
          required: currentRoute?.requirements.minSafety ?? 0,
        },
        navigation: {
          current: upgradeNavigationBonus,
          required: currentRoute?.requirements.minNavigation ?? 0,
        },
        maintenance: {
          current: upgradeMaintenanceBonus,
          required: currentRoute?.requirements.minMaintenance ?? 0,
        },
      }}
      isSeaMode={step === "SEA_MODE"}
      onStartVoyage={handleStartVoyage}
    />
  );

  const renderTekneTab = () => {
    const filteredUpgrades = BOAT_UPGRADES.filter(u => u.categoryId === selectedUpgradeCategory);

    return (
      <div className="tab-content fade-in">
        <div className="boat-summary-card">
          <div className="boat-summary-header">
             <div className="boat-summary-visual">{getBoatSvg(selectedBoat.id)}</div>
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
                     return <span key={key} className="effect-badge">{upgradeEffectLabels[key] ?? key}: +{val}</span>;
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
            <div className="skill-mini-bar">
              <div className="skill-mini-fill" style={{width: `${value * 20}%`}}></div>
            </div>
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

  const renderMainGame = () => (
    <HubScreen
      step={step}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      boatName={boatName}
      selectedBoatName={selectedBoat.name}
      currentRoute={currentRoute}
      credits={credits}
      followers={followers}
      flashCredits={flashCredits}
      flashFollowers={flashFollowers}
      firstContentDone={firstContentDone}
      completedRouteIds={completedRouteIds}
      renderLimanTab={renderLimanTab}
      renderSeaModeTab={renderSeaModeTab}
      renderIcerikTab={renderIcerikTab}
      renderRotaTab={renderRotaTab}
      renderTekneTab={renderTekneTab}
      renderKaptanTab={renderKaptanTab}
    />
  );

  const renderArrivalScreen = () => {
    const arrivalReward = currentRoute ? getRouteCompletionRewards(currentRoute) : null;

    return (
      <div className="selection-screen fade-in cinematic-bg" style={{justifyContent: 'center'}}>
        <div className="transparent-card centered">
          <h2>Varış!</h2>
          <p>{currentRoute?.to} limanına ulaştın.</p>
          <div style={{fontSize: "64px", margin: "24px 0"}}>⚓</div>
          <p>Dünya turu ilerlemesi: %{currentRoute?.worldProgressPercent}</p>
          {arrivalReward && (
            <div className="event-log-compact mt-20">
              <span className="card-label">Rota Ödülü</span>
              <div className="log-entry">+{arrivalReward.credits.toLocaleString("tr-TR")} TL</div>
              <div className="log-entry">+{arrivalReward.followers.toLocaleString("tr-TR")} takipçi</div>
            </div>
          )}
          <button className="btn-primary large mt-20" onClick={handleArrival}>Limana Dön</button>
        </div>
      </div>
    );
  };

  return (
    <div className="game-wrapper">
      {["MAIN_MENU", "PICK_PROFILE", "PICK_MARINA", "PICK_BOAT", "NAME_BOAT"].includes(step) && (
        <Onboarding
          step={step}
          setStep={setStep}
          profileIndex={profileIndex}
          setProfileIndex={setProfileIndex}
          marinaIndex={marinaIndex}
          setMarinaIndex={setMarinaIndex}
          marinaFilter={marinaFilter}
          setMarinaFilter={setMarinaFilter}
          boatIndex={boatIndex}
          setBoatIndex={setBoatIndex}
          boatName={boatName}
          setBoatName={(name) => {
            setBoatName(name);
            if (onboardingMessage) setOnboardingMessage("");
          }}
          onboardingMessage={onboardingMessage}
          hasSave={hasSave}
          saveBoatName={saveBoatName}
          onLoadGame={loadGame}
          onFinalizeGame={finalizeGame}
        />
      )}
      {(step === "HUB" || step === "SEA_MODE") && renderMainGame()}
      {step === "ARRIVAL_SCREEN" && renderArrivalScreen()}
    </div>
  );
}

export default App;
