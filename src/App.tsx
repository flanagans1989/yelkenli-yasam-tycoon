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
import { getSponsorTierByFollowers, SPONSOR_TIERS } from "../game-data/economy";
import { skillLabels, profileIcons } from "./data/labels";
import { Onboarding, getBoatSvg } from "./components/Onboarding";
import { HubScreen } from "./components/HubScreen";
import { LimanTab } from "./components/LimanTab";
import { RotaTab } from "./components/RotaTab";
import { SeaModeTab } from "./components/SeaModeTab";

const SAVE_KEY = "yelkenli_save";
const SAVE_VERSION = 2;
const MAX_OFFLINE_MINUTES = 480;
const OFFLINE_CREDITS_PER_MINUTE = 15;
const UPGRADE_INSTALL_CHECK_INTERVAL_MS = 30000;
const CONTENT_COOLDOWN_MS = 30 * 60 * 1000;

const CAPTAIN_LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000];

const getCaptainLevel = (xp: number): number => {
  for (let i = CAPTAIN_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= CAPTAIN_LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

const makeDailyGoals = (): DailyGoal[] => [
  { id: "dg_content", title: "1 içerik üret", type: "produce_content", completed: false },
  { id: "dg_route", title: "1 rota tamamla", type: "complete_route", completed: false },
  { id: "dg_upgrade", title: "1 upgrade başlat", type: "buy_upgrade", completed: false },
];

type UpgradeInProgress = {
  upgradeId: string;
  completesAt: number;
};

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

type DailyGoal = {
  id: string;
  title: string;
  type: "produce_content" | "complete_route" | "buy_upgrade";
  completed: boolean;
};

type AchievementProgress = {
  totalContentProduced: number;
  totalRoutesCompleted: number;
  totalUpgradesStarted: number;
  captainLevel: number;
  hasCompletedDailyGoalsOnce: boolean;
};

type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  isUnlocked: (progress: AchievementProgress) => boolean;
};

const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_content",
    title: "İlk İçerik",
    description: "1 içerik üret.",
    isUnlocked: (progress) => progress.totalContentProduced >= 1,
  },
  {
    id: "first_route",
    title: "İlk Rota",
    description: "1 rota tamamla.",
    isUnlocked: (progress) => progress.totalRoutesCompleted >= 1,
  },
  {
    id: "first_upgrade",
    title: "İlk Upgrade",
    description: "1 upgrade başlat.",
    isUnlocked: (progress) => progress.totalUpgradesStarted >= 1,
  },
  {
    id: "sea_dog",
    title: "Deniz Kurdu",
    description: "5 rota tamamla.",
    isUnlocked: (progress) => progress.totalRoutesCompleted >= 5,
  },
  {
    id: "rising_captain",
    title: "Yükselen Kaptan",
    description: "Kaptan seviyesi 3'e ulaş.",
    isUnlocked: (progress) => progress.captainLevel >= 3,
  },
  {
    id: "steady_creator",
    title: "İstikrarlı Üretici",
    description: "10 içerik üret.",
    isUnlocked: (progress) => progress.totalContentProduced >= 10,
  },
  {
    id: "locked_in",
    title: "Hedefe Kilitlen",
    description: "Günlük görevleri 3/3 en az 1 kez tamamla.",
    isUnlocked: (progress) => progress.hasCompletedDailyGoalsOnce,
  },
];

const SEA_DECISION_EVENTS: SeaDecisionEvent[] = [
  {
    id: "fuel_running_low",
    title: "Yakıt Krizi",
    description: "Depo beklenenden hızlı tükeniyor. Limana yanaşmak yakıt kazandırır ama para ve zaman harcar. Devam etmek süreyi korur ama hem yakıtı hem tekneyi zorlar.",
    choiceA: {
      label: "Limana yanaş",
      resultText: "Kısa mola yapıldı. Yakıt takviyesi alındı, marina ücreti ödendi.",
      effect: { fuel: 20, credits: -400, remainingDays: 2 },
    },
    choiceB: {
      label: "Devam et",
      resultText: "Süre korundu ama depo ve tekne durumu yıprandı.",
      effect: { fuel: -18, boatCondition: -8 },
    },
  },
  {
    id: "mild_storm_signs",
    title: "Fırtına Yaklaşıyor",
    description: "Hava durumu kötüleşiyor. Güvenli rotaya geçmek enerji ve zaman harcar. Doğrudan devam etmek tekneyi ve su rezervini tehdit eder.",
    choiceA: {
      label: "Güvenli rotaya geç",
      resultText: "Fırtınadan uzak tutuldu. Enerji ve zaman harcandı ama hasar önlendi.",
      effect: { energy: -10, remainingDays: 3 },
    },
    choiceB: {
      label: "Doğrudan devam et",
      resultText: "Fırtına içinden geçildi. Tekne hasar gördü, su rezervi azaldı.",
      effect: { boatCondition: -15, water: -8 },
    },
  },
  {
    id: "technical_noise",
    title: "Teknik Arıza",
    description: "Motor bölümünden ciddi bir ses geliyor. Şimdi tamir etmek para ve enerji ister. Ertelemek tekneyi büyük hasara açar.",
    choiceA: {
      label: "Dur, tamir et",
      resultText: "Tamir yapıldı. Para ve enerji harcandı ama büyük hasar önlendi.",
      effect: { credits: -450, energy: -5, boatCondition: -2 },
    },
    choiceB: {
      label: "Erteyle, devam et",
      resultText: "Arıza büyüdü. Tekne ciddi hasar gördü.",
      effect: { boatCondition: -16 },
    },
  },
  {
    id: "content_opportunity",
    title: "İçerik Fırsatı",
    description: "Işık ve deniz mükemmel konumda. Çekim yapmak enerji harcar ama takipçi ve gelir getirir. Dinlenmek enerjiyi geri kazandırır.",
    choiceA: {
      label: "Çek ve yayınla",
      resultText: "Yüksek kaliteli çekim yapıldı. Takipçi ve kredi geldi.",
      effect: { energy: -14, followers: 220, credits: 200 },
    },
    choiceB: {
      label: "Dinlen",
      resultText: "Enerji korundu ve bir miktar toparlandı.",
      effect: { energy: 8 },
    },
  },
  {
    id: "sudden_wind_shift",
    title: "Ani Rüzgar Değişimi",
    description: "Rüzgar bir anda yön değiştirdi. Yelken trimini düzeltmek zaman kaybettirir ama tekneyi rahatlatır. Bastırmak ise süre kazandırır ama tekneyi zorlar.",
    choiceA: {
      label: "Trim düzelt",
      resultText: "Yelkenler yeniden ayarlandı. Seyir sakinledi ama rota biraz uzadı.",
      effect: { energy: -6, remainingDays: 2, boatCondition: 3 },
    },
    choiceB: {
      label: "Bastır, devam et",
      resultText: "Hız korundu ama tekne sarsıldı ve ekip yoruldu.",
      effect: { boatCondition: -7, energy: -8 },
    },
  },
  {
    id: "night_watch_fatigue",
    title: "Gece Vardiyası Yorgunluğu",
    description: "Uzun gece vardiyası dikkati düşürdü. Kısa dinlenme güvenliği artırır ama tempoyu keser. Devam etmek süreyi korur ama kaynak tüketimini zorlar.",
    choiceA: {
      label: "Kısa mola ver",
      resultText: "Ekip nefes aldı. Enerji toparlandı ama yol biraz uzadı.",
      effect: { energy: 10, remainingDays: 2 },
    },
    choiceB: {
      label: "Devam et",
      resultText: "Tempo korundu ama yorgunluk büyüdü ve su tüketimi arttı.",
      effect: { energy: -12, water: -6 },
    },
  },
  {
    id: "cove_anchor_decision",
    title: "Koyda Demirleme Kararı",
    description: "Korunaklı bir koy göründü. Demirlemek su ve enerji toparlatır ama zaman kaybettirir. Açıkta devam etmek süreyi korur ama kaynak baskısını artırır.",
    choiceA: {
      label: "Koyda kal",
      resultText: "Kısa dinlenme yapıldı. Su ve enerji toparlandı.",
      effect: { water: 10, energy: 7, remainingDays: 2 },
    },
    choiceB: {
      label: "Açıkta devam et",
      resultText: "Süre korundu ama ekip ve tekne daha fazla zorlandı.",
      effect: { energy: -8, boatCondition: -5 },
    },
  },
  {
    id: "risky_social_shot",
    title: "Riskli Çekim Açısı",
    description: "Muhteşem bir açı yakalandı. Riskli çekim takipçi getirebilir ama tekne düzenini bozabilir. Güvenli kalmak fırsatı kaçırır ama tekneyi korur.",
    choiceA: {
      label: "Çekimi dene",
      resultText: "Çekim ses getirdi. Takipçi geldi ama tekne ve ekip zorlandı.",
      effect: { followers: 180, credits: 120, energy: -10, boatCondition: -4 },
    },
    choiceB: {
      label: "Güvenli kal",
      resultText: "Risk alınmadı. Tekne düzeni korundu, tempo sakin kaldı.",
      effect: { boatCondition: 4, energy: 4 },
    },
  },
  {
    id: "fishing_boat_encounter",
    title: "Balıkçı Teknesiyle Karşılaşma",
    description: "Yakındaki balıkçı teknesi rota hakkında uyarı veriyor. Tavsiyeyi dinlemek küçük bir masraf ister ama güvenlik sağlar. Görmezden gelmek bedava ama belirsizlik yaratır.",
    choiceA: {
      label: "Bilgi al",
      resultText: "Rota bilgisi paylaşıldı. Küçük bir ödeme yapıldı, risk azaldı.",
      effect: { credits: -180, boatCondition: 4, fuel: 6 },
    },
    choiceB: {
      label: "Yola devam et",
      resultText: "Para korunmuş oldu ama rota daha sert geçti.",
      effect: { fuel: -8, boatCondition: -6 },
    },
  },
  {
    id: "equipment_loose",
    title: "Ekipman Sabitleme Sorunu",
    description: "Güvertede bazı ekipmanlar gevşedi. Şimdi sabitlemek enerji kaybettirir ama hasarı önler. Ertelemek süreyi korur ama deniz büyürse sorun çıkarabilir.",
    choiceA: {
      label: "Şimdi sabitle",
      resultText: "Ekipman güvene alındı. Efor harcandı ama tekne korundu.",
      effect: { energy: -7, boatCondition: 5 },
    },
    choiceB: {
      label: "Sonra hallet",
      resultText: "İlerleme korundu ama ekipman sallandı ve tekne yıprandı.",
      effect: { boatCondition: -8, remainingDays: -1 },
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
    const dailyGoalsCompleted =
      Array.isArray(parsed.dailyGoals) &&
      parsed.dailyGoals.length > 0 &&
      parsed.dailyGoals.every((goal: any) => goal?.completed);

    return {
      ...parsed,
      saveVersion: SAVE_VERSION,
      hasSave: parsed.hasSave ?? true,
      totalContentProduced: parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0),
      hasCompletedDailyGoalsOnce:
        parsed.hasCompletedDailyGoalsOnce ?? Boolean(dailyGoalsCompleted && parsed.dailyRewardClaimed),
    };
  }

  if (version === SAVE_VERSION) {
    return {
      ...parsed,
      hasSave: parsed.hasSave ?? true,
      totalContentProduced: parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0),
      hasCompletedDailyGoalsOnce: parsed.hasCompletedDailyGoalsOnce ?? false,
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
  const [upgradeInProgress, setUpgradeInProgress] = useState<UpgradeInProgress | null>(null);

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
  const [lastContentAt, setLastContentAt] = useState<number | null>(null);
  const [, setContentCooldownTick] = useState(0);

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

  const [captainXp, setCaptainXp] = useState(0);
  const [captainLevel, setCaptainLevel] = useState(1);

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(makeDailyGoals);
  const [lastDailyReset, setLastDailyReset] = useState<string>("");
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [totalContentProduced, setTotalContentProduced] = useState(0);
  const [hasCompletedDailyGoalsOnce, setHasCompletedDailyGoalsOnce] = useState(false);

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
  const totalRoutesCompleted = completedRouteIds.length;
  const totalUpgradesStarted = purchasedUpgradeIds.length + (upgradeInProgress ? 1 : 0);
  const achievementStatuses = ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: achievement.isUnlocked({
      totalContentProduced,
      totalRoutesCompleted,
      totalUpgradesStarted,
      captainLevel,
      hasCompletedDailyGoalsOnce,
    }),
  }));
  const unlockedAchievementCount = achievementStatuses.filter((achievement) => achievement.unlocked).length;

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

  useEffect(() => {
    if (!upgradeInProgress) return;

    if (purchasedUpgradeIds.includes(upgradeInProgress.upgradeId)) {
      setUpgradeInProgress(null);
      return;
    }

    const checkInstallation = () => {
      if (upgradeInProgress.completesAt <= Date.now()) {
        completeUpgradeInstallation(upgradeInProgress.upgradeId);
      }
    };

    checkInstallation();
    const intervalId = window.setInterval(checkInstallation, UPGRADE_INSTALL_CHECK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [upgradeInProgress, purchasedUpgradeIds]);

  useEffect(() => {
    if (!lastContentAt) return;
    const tickId = window.setInterval(() => setContentCooldownTick(t => t + 1), 30000);
    return () => window.clearInterval(tickId);
  }, [lastContentAt]);

  useEffect(() => {
    setCaptainLevel(prev => {
      const newLevel = getCaptainLevel(captainXp);
      if (newLevel > prev) {
        const bonus = newLevel * 500;
        setCredits(c => c + bonus);
        setLogs(logs => [
          `Kaptan seviyesi yükseldi: Lv.${newLevel} (+${bonus.toLocaleString("tr-TR")} TL bonus)`,
          ...logs.slice(0, 4)
        ]);
        return newLevel;
      }
      return prev;
    });
  }, [captainXp]);

  useEffect(() => {
    if (step === "HUB") {
      const today = new Date().toISOString().slice(0, 10);
      if (lastDailyReset !== today) {
        setDailyGoals(makeDailyGoals());
        setLastDailyReset(today);
        setDailyRewardClaimed(false);
      }
    }
  }, [step, lastDailyReset]);

  useEffect(() => {
    const allDone = dailyGoals.length > 0 && dailyGoals.every(g => g.completed);
    if (allDone && !dailyRewardClaimed) {
      setHasCompletedDailyGoalsOnce(true);
      setCredits(c => c + 2500);
      setDailyRewardClaimed(true);
      setLogs(prev => [
        "Günlük görevler tamamlandı! +2.500 TL bonus.",
        ...prev.slice(0, 4),
      ]);
    }
  }, [dailyGoals, dailyRewardClaimed]);

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
        upgradeInProgress,
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
        lastContentAt,
        captainXp,
        captainLevel,
        dailyGoals,
        lastDailyReset,
        dailyRewardClaimed,
        totalContentProduced,
        hasCompletedDailyGoalsOnce,
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
    logs, purchasedUpgradeIds, upgradeInProgress, activeTab, currentLocationName, worldProgress, energy, water,
    fuel, boatCondition, currentRouteId, completedRouteIds, voyageTotalDays, voyageDaysRemaining,
    currentSeaEvent, pendingDecisionId, selectedPlatformId, selectedContentType, contentResult, selectedUpgradeCategory,
    brandTrust, sponsorOffers, acceptedSponsors, sponsoredContentCount, icerikSubTab, lastContentAt,
    captainXp, captainLevel, dailyGoals, lastDailyReset, dailyRewardClaimed, totalContentProduced,
    hasCompletedDailyGoalsOnce
  ]);

  const finalizeGame = () => {
    if (boatName.trim() === "") {
      setOnboardingMessage("Lütfen teknenize bir isim verin.");
      return;
    }

    setOnboardingMessage("");
    setCredits(STARTING_BUDGET - selectedBoat.purchaseCost);
    setFollowers(0);
    setPurchasedUpgradeIds([]);
    setUpgradeInProgress(null);
    setLogs(["Kariyer başladı. Limana giriş yapıldı."]);
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
    setLastContentAt(null);
    setCaptainXp(0);
    setCaptainLevel(1);
    setDailyGoals(makeDailyGoals());
    setLastDailyReset("");
    setDailyRewardClaimed(false);
    setTotalContentProduced(0);
    setHasCompletedDailyGoalsOnce(false);
    setStep("HUB");
    setActiveTab("liman");
  };

  const loadGame = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;

    try {
      const parsed = migrateSave(JSON.parse(saved));
      if (!parsed) return;

      const savedPurchasedUpgradeIds = parsed.purchasedUpgradeIds ?? [];
      const savedUpgradeInProgress = parsed.upgradeInProgress ?? null;
      const savedCredits = parsed.credits ?? 0;
      const savedLogs = parsed.logs ?? [];
      const savedLastSavedAt = parsed.lastSavedAt;

      let offlineMinutes = 0;
      let offlineCredits = 0;
      let nextPurchasedUpgradeIds = savedPurchasedUpgradeIds;
      let nextUpgradeInProgress =
        savedUpgradeInProgress &&
        typeof savedUpgradeInProgress.upgradeId === "string" &&
        typeof savedUpgradeInProgress.completesAt === "number" &&
        Number.isFinite(savedUpgradeInProgress.completesAt)
          ? savedUpgradeInProgress
          : null;
      let installationCompleteUpgrade: (typeof BOAT_UPGRADES)[number] | null = null;

      if (typeof savedLastSavedAt === "number" && Number.isFinite(savedLastSavedAt)) {
        const offlineMs = Math.max(0, Date.now() - savedLastSavedAt);
        offlineMinutes = Math.min(Math.floor(offlineMs / 60000), MAX_OFFLINE_MINUTES);
        offlineCredits = Math.max(0, offlineMinutes * OFFLINE_CREDITS_PER_MINUTE);
      }

      if (nextUpgradeInProgress) {
        const installingUpgrade = BOAT_UPGRADES.find(u => u.id === nextUpgradeInProgress.upgradeId);

        if (!installingUpgrade || nextPurchasedUpgradeIds.includes(nextUpgradeInProgress.upgradeId)) {
          nextUpgradeInProgress = null;
        } else if (nextUpgradeInProgress.completesAt <= Date.now()) {
          nextPurchasedUpgradeIds = [...nextPurchasedUpgradeIds, nextUpgradeInProgress.upgradeId];
          installationCompleteUpgrade = installingUpgrade;
          nextUpgradeInProgress = null;
        }
      }

      const passiveIncomeMessage =
        offlineCredits > 0
          ? `Pasif gelir: ${offlineMinutes} dakika içinde +${offlineCredits.toLocaleString("tr-TR")} TL birikti.`
          : "";
      const installationCompleteMessage = installationCompleteUpgrade
        ? `Kurulum tamamlandı: ${installationCompleteUpgrade.name} aktif edildi.`
        : "";
      const nextLogs = [installationCompleteMessage, passiveIncomeMessage, ...savedLogs]
        .filter(Boolean)
        .slice(0, 5) as string[];
      const nextSeaEvent =
        installationCompleteMessage || passiveIncomeMessage || (parsed.currentSeaEvent ?? "");

      setProfileIndex(parsed.profileIndex ?? 0);
      setMarinaIndex(parsed.marinaIndex ?? 0);
      setBoatIndex(parsed.boatIndex ?? 0);
      setBoatName(parsed.boatName ?? "");
      setCredits(savedCredits + offlineCredits);
      setFollowers(parsed.followers ?? 0);
      setFirstContentDone(parsed.firstContentDone ?? false);
      setLogs(nextLogs);
      setPurchasedUpgradeIds(nextPurchasedUpgradeIds);
      setUpgradeInProgress(nextUpgradeInProgress);
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
      setCurrentSeaEvent(nextSeaEvent);
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
      setLastContentAt(parsed.lastContentAt ?? null);
      setCaptainXp(parsed.captainXp ?? 0);
      setCaptainLevel(parsed.captainLevel ?? 1);
      setDailyGoals(Array.isArray(parsed.dailyGoals) ? parsed.dailyGoals : makeDailyGoals());
      setLastDailyReset(parsed.lastDailyReset ?? "");
      setDailyRewardClaimed(parsed.dailyRewardClaimed ?? false);
      setTotalContentProduced(parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0));
      setHasCompletedDailyGoalsOnce(parsed.hasCompletedDailyGoalsOnce ?? false);

      const safeStep = parsed.step && ["HUB", "SEA_MODE", "ARRIVAL_SCREEN"].includes(parsed.step) ? parsed.step : "HUB";
      const routeValid = WORLD_ROUTES.some(r => r.id === parsed.currentRouteId);
      setStep(safeStep === "SEA_MODE" && !routeValid ? "HUB" : safeStep);
      setActiveTab(parsed.activeTab ?? "liman");

      if (installationCompleteUpgrade) {
        applyUpgradeEffects(installationCompleteUpgrade);
      }
    } catch (e) {
      console.error("Load error", e);
    }
  };

  const applyUpgradeEffects = (upgrade: (typeof BOAT_UPGRADES)[number]) => {
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

      const willDepleteResource =
        energy - energyDrop <= 0 ||
        water - waterDrop <= 0 ||
        fuel - fuelDrop <= 0;

      if (willDepleteResource) {
        setBoatCondition(c => Math.max(0, c - 4));
      }

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
    setCaptainXp(prev => prev + 25);
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
    setCaptainXp(prev => prev + 60);
    completeGoal("complete_route");
    setPendingDecisionId(null);
    setStep("HUB");
    setActiveTab("liman");
  };

  const handleProduceContentV2 = () => {
    if (!selectedPlatformId || !selectedContentType) return;

    if (lastContentAt && Date.now() - lastContentAt < CONTENT_COOLDOWN_MS) {
      const remainingMs = CONTENT_COOLDOWN_MS - (Date.now() - lastContentAt);
      const remainingMin = Math.ceil(remainingMs / 60000);
      setLogs(prev => [`İçerik hazırlığı sürüyor. ${remainingMin} dakika sonra tekrar üret.`, ...prev.slice(0, 4)]);
      return;
    }

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
    setTotalContentProduced(prev => prev + 1);
    triggerFlash("credits");
    triggerFlash("followers");

    const logMsg = `${platform?.name} platformunda içerik yayınlandı: +${gainFollowers} Takipçi, +${gainCredits} TL.`;
    setLogs(prev => [logMsg, ...prev.slice(0, 4)]);
    setLastContentAt(Date.now());
    setCaptainXp(prev => prev + 15);
    completeGoal("produce_content");
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

  const getUpgradeInstallMs = (upgrade: (typeof BOAT_UPGRADES)[number]) => {
    if (typeof upgrade.installDays === "number" && upgrade.installDays > 0) {
      return upgrade.installDays * 30 * 60 * 1000;
    }

    if (upgrade.cost >= 15000 || upgrade.size === "large" || upgrade.size === "ocean") {
      return 30 * 60 * 1000;
    }
    if (upgrade.cost >= 7000 || upgrade.size === "medium") {
      return 15 * 60 * 1000;
    }
    return 5 * 60 * 1000;
  };

  const formatRemainingInstallTime = (targetTime: number) => {
    const remainingMs = Math.max(0, targetTime - Date.now());
    const totalMinutes = Math.ceil(remainingMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (totalMinutes < 60) {
      return `${Math.max(1, totalMinutes)} dakika kaldı`;
    }

    if (minutes === 0) {
      return `${hours} saat kaldı`;
    }

    return `${hours} saat ${minutes} dakika kaldı`;
  };

  const completeUpgradeInstallation = (
    upgradeId: string,
    existingPurchasedIds?: string[]
  ) => {
    const upgrade = BOAT_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) {
      setUpgradeInProgress(null);
      return;
    }

    const purchasedIds = existingPurchasedIds ?? purchasedUpgradeIds;
    if (purchasedIds.includes(upgradeId)) {
      setUpgradeInProgress(null);
      return;
    }

    setPurchasedUpgradeIds(prev => [...prev, upgradeId]);
    applyUpgradeEffects(upgrade);
    setUpgradeInProgress(null);
    setLogs(prev => [`Kurulum tamamlandı: ${upgrade.name} aktif edildi.`, ...prev.slice(0, 4)]);
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
    setActiveTab("liman");
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = BOAT_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (upgradeInProgress) {
      setLogs(prev => ["Kurulum devam ediyor. Yeni upgrade için mevcut kurulumun bitmesini bekle.", ...prev.slice(0, 4)]);
      return;
    }

    if (purchasedUpgradeIds.includes(upgradeId)) {
      return;
    }

    if (credits < upgrade.cost) {
      setLogs(prev => ["Yetersiz bütçe. Bu upgrade için daha fazla kredi gerekiyor.", ...prev.slice(0, 4)]);
      return;
    }

    const installMs = getUpgradeInstallMs(upgrade);
    const completesAt = Date.now() + installMs;
    const installMinutes = Math.max(1, Math.ceil(installMs / 60000));

    setCredits(prev => prev - upgrade.cost);
    setUpgradeInProgress({ upgradeId, completesAt });
    triggerFlash("credits");
    setLogs(prev => [`Kurulum başladı: ${upgrade.name}. Tahmini tamamlanma: ${installMinutes} dakika.`, ...prev.slice(0, 4)]);
    completeGoal("buy_upgrade");
  };

  const renderLimanTab = () => (
    <>
      {renderDailyGoalsCard()}
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
    </>
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

    const nextSponsorTier = SPONSOR_TIERS.find((tier) => followers < tier.minFollowers);
    const previousSponsorTier = [...SPONSOR_TIERS]
      .reverse()
      .find((tier) => followers >= tier.minFollowers);
    const sponsorProgressMin = previousSponsorTier?.minFollowers ?? 0;
    const sponsorProgressMax = nextSponsorTier?.minFollowers ?? sponsorProgressMin;
    const sponsorProgressPercent =
      sponsorProgressMax > sponsorProgressMin
        ? Math.max(
            0,
            Math.min(
              100,
              ((followers - sponsorProgressMin) / (sponsorProgressMax - sponsorProgressMin)) * 100
            )
          )
        : 100;

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
      
                {(() => {
                  const cooldownRemaining = lastContentAt ? Math.max(0, CONTENT_COOLDOWN_MS - (Date.now() - lastContentAt)) : 0;
                  const onContentCooldown = cooldownRemaining > 0;
                  const cooldownMinutes = Math.ceil(cooldownRemaining / 60000);
                  const isDisabled = !selectedPlatformId || !selectedContentType || onContentCooldown;
                  return (
                    <button
                      className={`btn-primary large mt-20 ${isDisabled ? "disabled" : ""}`}
                      onClick={handleProduceContentV2}
                      disabled={isDisabled}
                    >
                      {onContentCooldown ? `${cooldownMinutes} dk sonra tekrar üret` : "🎬 İçerik Üret"}
                    </button>
                  );
                })()}
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

            <div className="sponsor-progress-card">
              <div className="sponsor-progress-title">
                {nextSponsorTier ? (
                  followers < SPONSOR_TIERS[0].minFollowers
                    ? "İlk sponsor teklifine yaklaşıyorsun."
                    : "Bir sonraki sponsor seviyesine yaklaşıyorsun."
                ) : (
                  "En yüksek sponsor seviyesine ulaştın."
                )}
              </div>
              <div className="sponsor-progress-text">
                {nextSponsorTier
                  ? `${nextSponsorTier.minFollowers.toLocaleString("tr-TR")} takipçiye ulaştığında ${nextSponsorTier.name} açılır${nextSponsorTier.tier === "micro" ? "." : " fırsatları güçlenir."}`
                  : "Takipçi büyümen sponsor gücünü desteklemeye devam eder."}
              </div>
              <div className="sponsor-progress-bar">
                <div
                  className="sponsor-progress-fill"
                  style={{ width: `${sponsorProgressPercent}%` }}
                ></div>
              </div>
              <div className="sponsor-progress-meta">
                {nextSponsorTier
                  ? `${followers.toLocaleString("tr-TR")} / ${nextSponsorTier.minFollowers.toLocaleString("tr-TR")} takipçi`
                  : `${followers.toLocaleString("tr-TR")} takipçi`}
              </div>
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
    <>
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
      {currentRoute && <p className="route-feeling-text">{currentRoute.description}</p>}
    </>
  );

  const renderTekneTab = () => {
    const filteredUpgrades = BOAT_UPGRADES.filter(u => u.categoryId === selectedUpgradeCategory);
    const currentInstallingUpgrade = upgradeInProgress
      ? BOAT_UPGRADES.find(u => u.id === upgradeInProgress.upgradeId) ?? null
      : null;
    const currentInstallLabel = upgradeInProgress
      ? formatRemainingInstallTime(upgradeInProgress.completesAt)
      : "";

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

        {currentInstallingUpgrade && (
          <div className="detail-box">
            <strong>Kurulum devam ediyor: {currentInstallingUpgrade.name}</strong>
            <div>{currentInstallLabel}</div>
          </div>
        )}

        <div className="upgrade-list-v2">
          {filteredUpgrades.map(upgrade => {
            const isPurchased = purchasedUpgradeIds.includes(upgrade.id);
            const isInstalling = upgradeInProgress?.upgradeId === upgrade.id;
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
                    className={`btn-primary full-width mt-10 ${credits < upgrade.cost || !!upgradeInProgress ? "disabled" : ""}`}
                    onClick={() => handleBuyUpgrade(upgrade.id)}
                    disabled={credits < upgrade.cost || !!upgradeInProgress}
                  >
                    {isInstalling
                      ? "Kurulumda"
                      : upgradeInProgress
                        ? "Kurulum Bekleniyor"
                        : credits < upgrade.cost
                          ? "Yetersiz Bütçe"
                          : `${upgrade.cost.toLocaleString("tr-TR")} TL - Satın Al`}
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

      <div className="achievements-card mt-20">
        <div className="achievements-header">
          <div>
            <span className="card-label">Başarımlar</span>
            <strong>{unlockedAchievementCount}/{ACHIEVEMENTS.length} açıldı</strong>
          </div>
          <span className="achievements-summary">{captainLevel >= 3 ? "İlerleme iyi" : "Yolda devam"}</span>
        </div>
        <div className="achievements-list">
          {achievementStatuses.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-row${achievement.unlocked ? " unlocked" : ""}`}
            >
              <span className="achievement-icon">{achievement.unlocked ? "✅" : "○"}</span>
              <div className="achievement-copy">
                <strong>{achievement.title}</strong>
                <small>{achievement.description}</small>
              </div>
              <span className="achievement-state">{achievement.unlocked ? "Açıldı" : "Kilitli"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="event-log-compact mt-20">
        <span className="card-label">Son Olaylar</span>
        {logs.map((log, i) => <div key={log + i} className="log-entry">{log}</div>)}
      </div>
    </div>
  );

  const completeGoal = (type: DailyGoal["type"]) => {
    setDailyGoals(prev => prev.map(g => g.type === type && !g.completed ? { ...g, completed: true } : g));
  };

  const renderDailyGoalsCard = () => {
    const completedCount = dailyGoals.filter(g => g.completed).length;
    const allDone = completedCount === dailyGoals.length;
    return (
      <div className={`daily-goals-card${allDone ? " daily-goals-done" : ""}`}>
        <div className="daily-goals-header">
          <span className="daily-goals-title">Günlük Görevler</span>
          <span className="daily-goals-count">{completedCount}/{dailyGoals.length}</span>
        </div>
        <ul className="daily-goals-list">
          {dailyGoals.map(g => (
            <li key={g.id} className={`daily-goal-item${g.completed ? " completed" : ""}`}>
              <span className="daily-goal-check">{g.completed ? "✓" : "○"}</span>
              <span className="daily-goal-label">{g.title}</span>
            </li>
          ))}
        </ul>
        {allDone && dailyRewardClaimed && (
          <div className="daily-goals-reward-claimed">Tüm görevler tamamlandı! +2.500 TL alındı.</div>
        )}
      </div>
    );
  };

  const renderProgressStrip = () => (
    <div className="progress-strip">
      <span className="progress-strip-item">Kpt. Lv.{captainLevel}</span>
      <span className="progress-strip-sep">|</span>
      <span className="progress-strip-item">{followers.toLocaleString("tr-TR")} takipçi</span>
      <span className="progress-strip-sep">|</span>
      <span className="progress-strip-item">Dünya Turu: {completedRouteIds.length}/{WORLD_ROUTES.length} Rota</span>
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
      renderProgressStrip={renderProgressStrip}
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
    const completedRouteCount = Math.min(completedRouteIds.length + 1, WORLD_ROUTES.length);
    const nextRoute = currentRoute ? getNextRoute(currentRoute.id as RouteId) : undefined;
    const arrivalPortName = currentRoute?.to ?? "Varış limanı";
    const worldProgressPercent = currentRoute?.worldProgressPercent ?? 0;
    const rewardCredits = arrivalReward?.credits ?? 0;
    const rewardFollowers = arrivalReward?.followers ?? 0;

    return (
      <div className="selection-screen fade-in cinematic-bg" style={{justifyContent: 'center'}}>
        <div className="transparent-card centered arrival-screen-card">
          <div className="arrival-screen-icon">⚓</div>
          <h2>Varış!</h2>
          <p className="arrival-screen-subtitle">{arrivalPortName} limanına ulaştın.</p>
          <p className="arrival-route-feeling">{currentRoute?.feeling}</p>
          <span className="arrival-screen-highlight">Rota Tamamlandı</span>

          <div className="arrival-screen-progress">
            <div className="arrival-screen-progress-row">
              <span>Dünya turu ilerlemesi</span>
              <strong>%{worldProgressPercent}</strong>
            </div>
            <div className="arrival-screen-progress-row">
              <span>Rota</span>
              <strong>{completedRouteCount} / {WORLD_ROUTES.length} tamamlandı</strong>
            </div>
          </div>

          <div className="arrival-rewards">
            <span className="card-label">Rota Ödülü</span>
            <div className="arrival-reward-grid">
              <div className="arrival-reward-box">
                <small>Kredi</small>
                <strong>+{rewardCredits.toLocaleString("tr-TR")} TL</strong>
              </div>
              <div className="arrival-reward-box">
                <small>Takipçi</small>
                <strong>+{rewardFollowers.toLocaleString("tr-TR")}</strong>
              </div>
            </div>
          </div>

          <div className="arrival-screen-next-route">
            <span>Sıradaki rota</span>
            <strong>{nextRoute ? nextRoute.name : "Dünya turu tamamlandı"}</strong>
          </div>

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
