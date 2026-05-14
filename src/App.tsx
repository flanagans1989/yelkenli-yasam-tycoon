import { useState, useEffect, useRef } from "react";
import "./App.css";

import type { Step, Tab, ContentResult, MarinaFilter, StoryHook, Gender, DailyGoal, ToastType, ToastItem } from "./types/game";
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
import { AppBackground } from "./components/AppBackground";
import { MicoGuide } from "./components/MicoGuide";
import { Onboarding, getBoatSvg } from "./components/Onboarding";
import { HubScreen } from "./components/HubScreen";
import { LimanTab } from "./components/LimanTab";
import { RotaTab } from "./components/RotaTab";
import { SeaModeTab } from "./components/SeaModeTab";
import { KaptanTab } from "./components/KaptanTab";
import { TekneTab } from "./components/TekneTab";
import { ArrivalScreen } from "./components/ArrivalScreen";
import { CelebrationModal } from "./components/CelebrationModal";
import { IcerikTab } from "./components/IcerikTab";
import type { CelebrationItem } from "./components/CelebrationModal";
import { SEA_DECISION_EVENTS } from "./data/seaEvents";
import { ACHIEVEMENTS, ACHIEVEMENT_ICONS } from "./data/achievements";
import { getContentComment } from "./data/contentComments";
import { getDailyGoalTheme, getCaptainLevel, getContentCooldownMs, getBoatUpgradeDurationMs, getCaptainRankLabel } from "./data/captainData";
import {
  SAVE_KEY, SAVE_VERSION,
  migrateSave, calculateOfflineIncome, processUpgradesFromSave,
  processMarinaRestFromSave, buildOfflineMessages, safeLoadStep,
} from "./lib/saveLoad";
import type { UpgradeInProgressItem, MarinaRestInProgress } from "./lib/saveLoad";
import { calculateContentQuality, calculateContentRewards, formatSeaDecisionEffectSummary } from "./lib/gameLogic";

const UPGRADE_INSTALL_CHECK_INTERVAL_MS = 30000;
const MARINA_REST_DURATION_MS = 2 * 60 * 1000;

const MAX_PARALLEL_UPGRADES = 3;

const makeDailyGoals = (dateKey: string = new Date().toISOString().slice(0, 10)): DailyGoal[] => {
  const theme = getDailyGoalTheme(dateKey);

  return [
    { id: "dg_content", title: theme.goals.produce_content, type: "produce_content", completed: false },
    { id: "dg_route", title: theme.goals.complete_route, type: "complete_route", completed: false },
    { id: "dg_upgrade", title: theme.goals.buy_upgrade, type: "buy_upgrade", completed: false },
  ];
};

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

const getLocationBonusLabel = (region: string): { contentType: string; label: string } | null => {
  const r = region.toLocaleLowerCase("tr-TR");
  if (r.includes("ege")) return { contentType: "nature_bay", label: "📍 Ege: Koy/Doğa +10 kalite" };
  if (r.includes("akdeniz") || r.includes("antalya")) return { contentType: "sailing_vlog", label: "📍 Akdeniz: Seyir Vlogu +10 kalite" };
  if (r.includes("marmara") || r.includes("istanbul")) return { contentType: "city_trip", label: "📍 Marmara: Şehir Gezisi +10 kalite" };
  return null;
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

const getStoryHookBonusesByPotential = (contentPotential: (typeof WORLD_ROUTES)[number]["contentPotential"]) => {
  switch (contentPotential) {
    case "very_high":
      return { bonusFollowersPct: 20, bonusCreditsPct: 10, sponsorInterest: 2 };
    case "high":
      return { bonusFollowersPct: 16, bonusCreditsPct: 8, sponsorInterest: 1 };
    case "medium_high":
      return { bonusFollowersPct: 14, bonusCreditsPct: 7, sponsorInterest: 1 };
    case "medium":
      return { bonusFollowersPct: 12, bonusCreditsPct: 6, sponsorInterest: 1 };
    default:
      return { bonusFollowersPct: 10, bonusCreditsPct: 5, sponsorInterest: 1 };
  }
};

const createArrivalStoryHook = (route: (typeof WORLD_ROUTES)[number]): StoryHook => {
  const bonuses = getStoryHookBonusesByPotential(route.contentPotential);

  return {
    id: `story_arrival_${route.id}_${Date.now()}`,
    source: "arrival",
    routeId: route.id,
    title: "Bu yolculugun hikayesi hazir",
    description: "Rotada yasadiklarin guclu bir icerik serisine donusebilir.",
    ...bonuses,
    expiresAfterUses: 1,
  };
};

const createSeaEventStoryHook = (decisionId: string, routeId?: string): StoryHook | null => {
  if (decisionId === "content_opportunity") {
    return {
      id: `story_sea_${decisionId}_${Date.now()}`,
      source: "sea_event",
      routeId,
      title: "Denizden yakalanan hikaye",
      description: "Seyirde yakaladigin bu an, guclu bir icerik firsatina donustu.",
      bonusFollowersPct: 15,
      bonusCreditsPct: 10,
      sponsorInterest: 1,
      expiresAfterUses: 1,
    };
  }

  if (decisionId === "risky_social_shot") {
    return {
      id: `story_sea_${decisionId}_${Date.now()}`,
      source: "sea_event",
      routeId,
      title: "Denizde ses getiren cekim",
      description: "Riskli an dogru cekimle markalarin dikkatini cekebilecek bir hikayeye donustu.",
      bonusFollowersPct: 12,
      bonusCreditsPct: 8,
      sponsorInterest: 1,
      expiresAfterUses: 1,
    };
  }

  return null;
};

function App() {
  const [step, setStep] = useState<Step>("WELCOME");
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
  const [upgradesInProgress, setUpgradesInProgress] = useState<UpgradeInProgressItem[]>([]);

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
  const [firstVoyageEventTriggered, setFirstVoyageEventTriggered] = useState(false);
  const [recentSeaEventIds, setRecentSeaEventIds] = useState<string[]>([]);

  // Content V2 States
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [contentResult, setContentResult] = useState<ContentResult | null>(null);
  const [lastContentAt, setLastContentAt] = useState<number | null>(null);
  const [, setContentCooldownTick] = useState(0);
  const [marinaRestInProgress, setMarinaRestInProgress] = useState<MarinaRestInProgress | null>(null);
  const [marinaRestCooldownTick, setMarinaRestCooldownTick] = useState(0);

  // Upgrade V2 State
  const [selectedUpgradeCategory, setSelectedUpgradeCategory] = useState<UpgradeCategoryId>("energy");
  // BUG 3 FIX: session-only flags for route → tekne → route contextual navigation
  const [comingFromRotaMissing, setComingFromRotaMissing] = useState(false);
  const [shouldOpenRotaReadiness, setShouldOpenRotaReadiness] = useState(false);

  // UI dismissal state (session-only, not persisted)
  const [tavsiyeDismissed, setTavsiyeDismissed] = useState(false);

  // Sponsor MVP States
  const [brandTrust, setBrandTrust] = useState(10);
  const [sponsorOffers, setSponsorOffers] = useState<any[]>([]);
  const [acceptedSponsors, setAcceptedSponsors] = useState<string[]>([]);
  const [sponsoredContentCount, setSponsoredContentCount] = useState(0);
  const [icerikSubTab, setIcerikSubTab] = useState<"produce" | "sponsor">("produce");

  const [hasSave, setHasSave] = useState(false);
  const [saveBoatName, setSaveBoatName] = useState("");
  const [tutorialStep, setTutorialStep] = useState(3);
  const [gender, setGender] = useState<Gender>("unspecified");
  const [showMicoFarewell, setShowMicoFarewell] = useState(false);
  const [showSailAnimation, setShowSailAnimation] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [hasReceivedFirstSponsor, setHasReceivedFirstSponsor] = useState(false);

  type FloaterType = 'credits' | 'followers' | 'xp';
  interface RewardFloater { id: number; text: string; type: FloaterType; }
  const [rewardFloaters, setRewardFloaters] = useState<RewardFloater[]>([]);
  const addFloater = (text: string, type: FloaterType) => {
    const id = Date.now() + Math.random();
    setRewardFloaters(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setRewardFloaters(prev => prev.filter(f => f.id !== id));
    }, 1600);
  };

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
  const [activeStoryHook, setActiveStoryHook] = useState<StoryHook | null>(null);
  const toastIdRef = useRef(0);
  const [toastQueue, setToastQueue] = useState<ToastItem[]>([]);
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null);
  const [isToastLeaving, setIsToastLeaving] = useState(false);

  const [celebrationQueue, setCelebrationQueue] = useState<CelebrationItem[]>([]);
  const [activeCelebration, setActiveCelebration] = useState<CelebrationItem | null>(null);
  const prevCaptainLevelRef = useRef<number | null>(null);

  const previousUnlockedAchievementIdsRef = useRef<string[]>([]);
  const hasInitializedAchievementBannerRef = useRef(false);
  const previousSponsorOfferIdsRef = useRef<string[]>([]);
  const hasInitializedSponsorOfferBannerRef = useRef(false);

  const triggerFlash = (type: "credits" | "followers") => {
    if (type === "credits") {
      setFlashCredits(true);
      setTimeout(() => setFlashCredits(false), 600);
    } else {
      setFlashFollowers(true);
      setTimeout(() => setFlashFollowers(false), 600);
    }
  };

  const pushToast = (type: ToastType, title: string, text: string) => {
    const id = ++toastIdRef.current;
    setToastQueue(prev => [...prev, { id, type, title, text }]);
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
  const totalUpgradesStarted = purchasedUpgradeIds.length + upgradesInProgress.length;
  const achievementStatuses = ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: achievement.isUnlocked({
      totalContentProduced,
      totalRoutesCompleted,
      totalUpgradesStarted,
      captainLevel,
      hasCompletedDailyGoalsOnce,
      followers,
      acceptedSponsorsCount: acceptedSponsors.length,
      completedRouteIds,
    }),
  }));

  useEffect(() => {
    const unlockedAchievementIds = achievementStatuses
      .filter((achievement) => achievement.unlocked)
      .map((achievement) => achievement.id);

    if (!hasInitializedAchievementBannerRef.current) {
      previousUnlockedAchievementIdsRef.current = unlockedAchievementIds;
      hasInitializedAchievementBannerRef.current = true;
      return;
    }

    const newlyUnlockedAchievement = achievementStatuses.find(
      (achievement) =>
        achievement.unlocked && !previousUnlockedAchievementIdsRef.current.includes(achievement.id),
    );

    previousUnlockedAchievementIdsRef.current = unlockedAchievementIds;

    if (newlyUnlockedAchievement) {
      setCelebrationQueue(q => [...q, {
        type: "achievement" as const,
        title: newlyUnlockedAchievement.title,
        description: newlyUnlockedAchievement.description,
        icon: ACHIEVEMENT_ICONS[newlyUnlockedAchievement.id] ?? "🏅",
      }]);
    }
  }, [achievementStatuses]);

  useEffect(() => {
    const sponsorOfferIds = sponsorOffers.map((offer) => offer.id);

    if (!hasInitializedSponsorOfferBannerRef.current) {
      previousSponsorOfferIdsRef.current = sponsorOfferIds;
      hasInitializedSponsorOfferBannerRef.current = true;
      return;
    }

    const newlyAddedOffer = sponsorOffers.find(
      (offer) => !previousSponsorOfferIdsRef.current.includes(offer.id),
    );

    previousSponsorOfferIdsRef.current = sponsorOfferIds;

    if (newlyAddedOffer) {
      pushToast(
        "sponsor",
        "Sponsor Teklifi Geldi!",
        newlyAddedOffer.brandName
          ? `${newlyAddedOffer.brandName} yeni bir teklif gönderdi.`
          : "Yeni bir marka dünya turu hikayene dahil olmak istiyor.",
      );
    }
  }, [sponsorOffers]);

  // BUG 2 FIX: Automatically trigger first sponsor celebration when followers cross the first tier
  // This fires regardless of which tab is open — does not require opening the Sponsor screen
  useEffect(() => {
    if (hasReceivedFirstSponsor) return;
    const firstTierMin = SPONSOR_TIERS[0]?.minFollowers ?? 800;
    if (followers >= firstTierMin) {
      const tier = SPONSOR_TIERS[0];
      setHasReceivedFirstSponsor(true);
      setActiveCelebration({ type: "sponsor", brandName: tier?.name ?? "İlk Marka" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followers]);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = migrateSave(JSON.parse(saved));
        if (parsed?.hasSave) {
          setHasSave(true);
          setSaveBoatName(parsed.boatName || "Bilinmeyen Tekne");
          setStep("MAIN_MENU");
        }
      } catch (e) {
        console.error("Save load error", e);
      }
    }
  }, []);

  useEffect(() => {
    if (upgradesInProgress.length === 0) return;

    const sanitizedUpgrades = upgradesInProgress.filter((item) => !purchasedUpgradeIds.includes(item.upgradeId));
    if (sanitizedUpgrades.length !== upgradesInProgress.length) {
      setUpgradesInProgress(sanitizedUpgrades);
      return;
    }

    const checkInstallation = () => {
      const completedUpgrades = sanitizedUpgrades.filter((item) => item.completesAt <= Date.now());
      if (completedUpgrades.length === 0) return;

      const resolvedPurchasedIds = [...purchasedUpgradeIds];
      completedUpgrades.forEach((item) => {
        if (resolvedPurchasedIds.includes(item.upgradeId)) {
          setUpgradesInProgress((prev) => prev.filter((activeItem) => activeItem.upgradeId !== item.upgradeId));
          return;
        }

        completeUpgradeInstallation(item.upgradeId, resolvedPurchasedIds);
        resolvedPurchasedIds.push(item.upgradeId);
      });
    };

    checkInstallation();
    const intervalId = window.setInterval(checkInstallation, UPGRADE_INSTALL_CHECK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [upgradesInProgress, purchasedUpgradeIds]);

  useEffect(() => {
    if (!lastContentAt) return;
    const tickId = window.setInterval(() => setContentCooldownTick(t => t + 1), 30000);
    return () => window.clearInterval(tickId);
  }, [lastContentAt]);

  useEffect(() => {
    if (!marinaRestInProgress) return;

    const checkRest = () => {
      setMarinaRestCooldownTick(Date.now());
      if (marinaRestInProgress.completesAt <= Date.now()) {
        if (step === "HUB") {
          completeMarinaRestService();
        }
      }
    };

    checkRest();
    const tickId = window.setInterval(checkRest, 30000);
    return () => window.clearInterval(tickId);
  }, [marinaRestInProgress, step]);

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
    if (prevCaptainLevelRef.current === null) {
      prevCaptainLevelRef.current = captainLevel;
      return;
    }
    if (captainLevel > prevCaptainLevelRef.current) {
      const bonus = captainLevel * 500;
      setCelebrationQueue(q => [...q, {
        type: "levelup" as const,
        level: captainLevel,
        rank: getCaptainRankLabel(captainLevel),
        bonus,
      }]);
    }
    prevCaptainLevelRef.current = captainLevel;
  }, [captainLevel]);

  useEffect(() => {
    if (activeCelebration || celebrationQueue.length === 0) return;
    setActiveCelebration(celebrationQueue[0]);
    setCelebrationQueue(prev => prev.slice(1));
  }, [activeCelebration, celebrationQueue]);

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
      setCelebrationQueue(q => [...q, { type: "daily_goals" as const }]);
    }
  }, [dailyGoals, dailyRewardClaimed]);

  useEffect(() => {
    if (tutorialStep === 0 && firstContentDone) setTutorialStep(1);
  }, [firstContentDone, tutorialStep]);

  useEffect(() => {
    if (tutorialStep === 1 && upgradesInProgress.length > 0) setTutorialStep(2);
  }, [upgradesInProgress.length, tutorialStep]);

  useEffect(() => {
    if (tutorialStep === 2 && step === "SEA_MODE") {
      setTutorialStep(3);
      setShowMicoFarewell(true);
      setTimeout(() => setShowMicoFarewell(false), 5000);
    }
  }, [step, tutorialStep]);

  useEffect(() => {
    if (activeToast || toastQueue.length === 0) return;
    const next = toastQueue[0];
    setToastQueue(prev => prev.slice(1));
    setIsToastLeaving(false);
    setActiveToast(next);
  }, [activeToast, toastQueue]);

  useEffect(() => {
    if (!activeToast) return;
    const leaveId = window.setTimeout(() => setIsToastLeaving(true), 3200);
    const clearId = window.setTimeout(() => setActiveToast(null), 3500);
    return () => {
      window.clearTimeout(leaveId);
      window.clearTimeout(clearId);
    };
  }, [activeToast]);

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
        upgradesInProgress,
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
        marinaRestInProgress,
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
        firstVoyageEventTriggered,
        testMode,
        hasReceivedFirstSponsor,
        activeStoryHook,
        tutorialStep,
        gender,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveObj));
      setHasSave(true);
      setSaveBoatName(boatName);
    }
  }, [
    step, profileIndex, marinaIndex, boatIndex, boatName, credits, followers, firstContentDone,
    logs, purchasedUpgradeIds, upgradesInProgress, activeTab, currentLocationName, worldProgress, energy, water,
    fuel, boatCondition, currentRouteId, completedRouteIds, voyageTotalDays, voyageDaysRemaining,
    currentSeaEvent, pendingDecisionId, selectedPlatformId, selectedContentType, contentResult, activeStoryHook, selectedUpgradeCategory,
    brandTrust, sponsorOffers, acceptedSponsors, sponsoredContentCount, icerikSubTab, lastContentAt, marinaRestInProgress,
    captainXp, captainLevel, dailyGoals, lastDailyReset, dailyRewardClaimed, totalContentProduced,
    hasCompletedDailyGoalsOnce, firstVoyageEventTriggered, testMode, hasReceivedFirstSponsor, activeStoryHook,
    tutorialStep, gender
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
    setUpgradesInProgress([]);
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
    setMarinaRestInProgress(null);
    setCaptainXp(0);
    setCaptainLevel(1);
    setDailyGoals(makeDailyGoals());
    setLastDailyReset("");
    setDailyRewardClaimed(false);
    setTotalContentProduced(0);
    setHasCompletedDailyGoalsOnce(false);
    setActiveStoryHook(null);
    setTutorialStep(0);
    setStep("HUB");
    setActiveTab("liman");
  };

  const loadGame = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;

    try {
      const parsed = migrateSave(JSON.parse(saved));
      if (!parsed) return;

      const offline = calculateOfflineIncome(parsed.lastSavedAt);
      const upgrades = processUpgradesFromSave(
        Array.isArray(parsed.upgradesInProgress) ? parsed.upgradesInProgress : null,
        parsed.upgradeInProgress ?? null,
        parsed.purchasedUpgradeIds ?? [],
      );
      const marina = processMarinaRestFromSave(parsed.marinaRestInProgress);
      const { messages, nextSeaEvent } = buildOfflineMessages(
        offline.credits, offline.followers, upgrades.completedUpgradeObjects, marina.completedOffline,
      );
      const nextLogs = [...messages, ...(parsed.logs ?? [])].filter(Boolean).slice(0, 5) as string[];

      setProfileIndex(parsed.profileIndex ?? 0);
      setMarinaIndex(parsed.marinaIndex ?? 0);
      setBoatIndex(parsed.boatIndex ?? 0);
      setBoatName(parsed.boatName ?? "");
      setCredits((parsed.credits ?? 0) + offline.credits);
      setFollowers((parsed.followers ?? 0) + offline.followers);
      setFirstContentDone(parsed.firstContentDone ?? false);
      setLogs(nextLogs);
      setPurchasedUpgradeIds(upgrades.purchasedUpgradeIds);
      setUpgradesInProgress(upgrades.upgradesInProgress);
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
      setCurrentSeaEvent(nextSeaEvent || (parsed.currentSeaEvent ?? ""));
      setPendingDecisionId(parsed.pendingDecisionId ?? null);
      setSelectedPlatformId(parsed.selectedPlatformId ?? null);
      setSelectedContentType(parsed.selectedContentType ?? null);
      setContentResult(parsed.contentResult ?? null);
      setSelectedUpgradeCategory(parsed.selectedUpgradeCategory ?? "energy");
      setBrandTrust(parsed.brandTrust ?? 10);
      setSponsorOffers(parsed.sponsorOffers ?? []);
      setAcceptedSponsors(parsed.acceptedSponsors ?? []);
      setSponsoredContentCount(parsed.sponsoredContentCount ?? 0);
      setFirstVoyageEventTriggered(parsed.firstVoyageEventTriggered ?? false);
      setRecentSeaEventIds(parsed.recentSeaEventIds ?? []);
      setTestMode(parsed.testMode ?? false);
      setHasReceivedFirstSponsor(parsed.hasReceivedFirstSponsor ?? false);
      setActiveStoryHook(parsed.activeStoryHook ?? null);
      setIcerikSubTab(parsed.icerikSubTab ?? "produce");
      setLastContentAt(parsed.lastContentAt ?? null);
      setMarinaRestInProgress(marina.marinaRest);
      setMarinaRestCooldownTick(Date.now());
      setCaptainXp(parsed.captainXp ?? 0);
      setCaptainLevel(parsed.captainLevel ?? 1);
      setDailyGoals(Array.isArray(parsed.dailyGoals) ? parsed.dailyGoals : makeDailyGoals());
      setLastDailyReset(parsed.lastDailyReset ?? "");
      setDailyRewardClaimed(parsed.dailyRewardClaimed ?? false);
      setTotalContentProduced(parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0));
      setHasCompletedDailyGoalsOnce(parsed.hasCompletedDailyGoalsOnce ?? false);
      setTutorialStep(parsed.tutorialStep ?? 3);
      setGender(parsed.gender ?? "unspecified");
      setStep(safeLoadStep(parsed));
      setActiveTab(parsed.activeTab ?? "liman");

      upgrades.completedUpgradeObjects.forEach((upgrade) => {
        applyUpgradeEffects(upgrade);
        pushToast("upgrade", "Upgrade Tamamlandı!", `${upgrade.name} kurulumu tamamlandı!`);
      });
      if (marina.completedOffline) {
        setEnergy((prev) => Math.min(100, prev + 30));
        setWater((prev) => Math.min(100, prev + 30));
        setFuel((prev) => Math.min(100, prev + 20));
        setBoatCondition((prev) => Math.min(100, prev + 10));
        pushToast("voyage", "Dinlenme Tamamlandı", "Marina hizmeti bitti. Kaynaklar toparlandı.");
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

  const completeMarinaRestService = () => {
    setMarinaRestInProgress((current) => {
      if (!current) return null;
      setEnergy((prev) => Math.min(100, prev + 30));
      setLogs((prev) => ["Marina dinlenme hizmeti tamamlandı. Kaptan dinlendi, enerji toparlandı.", ...prev.slice(0, 4)]);
      pushToast("voyage", "Dinlenme Tamamlandı", "Marina hizmeti bitti. Enerji toparlandı.");
      return null;
    });
  };

  const handleMarinaRest = () => {
    if (marinaRestInProgress) {
      setLogs((prev) => ["Marina dinlenme hizmeti zaten sürüyor.", ...prev.slice(0, 4)]);
      return;
    }

    if (energy >= 100) {
      setLogs((prev) => ["Enerji zaten tam.", ...prev.slice(0, 4)]);
      return;
    }

    const startedAt = Date.now();
    const durationMs = testMode ? 3000 : MARINA_REST_DURATION_MS;
    const completesAt = startedAt + durationMs;
    setMarinaRestInProgress({ startedAt, completesAt, durationMs });
    setMarinaRestCooldownTick(startedAt);
    setLogs((prev) => ["Marina dinlenme hizmeti başlatıldı.", ...prev.slice(0, 4)]);
  };

  const handleRefillWater = () => {
    const missing = Math.max(0, 100 - water);
    if (missing <= 0) return;
    const cost = missing * 1;
    if (credits < cost) {
      setLogs(prev => ["Su ikmali için yeterli TL yok.", ...prev.slice(0, 4)]);
      pushToast("warning", "Yetersiz Bütçe", `Su ikmali için ${cost} TL gerekiyor.`);
      return;
    }
    setCredits(c => c - cost);
    setWater(100);
    triggerFlash("credits");
    setLogs(prev => [`Su ikmali yapıldı: ${cost} TL.`, ...prev.slice(0, 4)]);
  };

  const handleRefillFuel = () => {
    const missing = Math.max(0, 100 - fuel);
    if (missing <= 0) return;
    const cost = missing * 2;
    if (credits < cost) {
      setLogs(prev => ["Yakıt ikmali için yeterli TL yok.", ...prev.slice(0, 4)]);
      pushToast("warning", "Yetersiz Bütçe", `Yakıt ikmali için ${cost} TL gerekiyor.`);
      return;
    }
    setCredits(c => c - cost);
    setFuel(100);
    triggerFlash("credits");
    setLogs(prev => [`Yakıt ikmali yapıldı: ${cost} TL.`, ...prev.slice(0, 4)]);
  };

  const getMarinaRestLabel = () => {
    if (!marinaRestInProgress) {
      return energy >= 100 ? "Enerji dolu" : "Dinlen";
    }
    const remainingMs = Math.max(0, marinaRestInProgress.completesAt - marinaRestCooldownTick);
    const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
    return `Dinleniyor: ${remainingMinutes} dk`;
  };

  const isMarinaRestActive = Boolean(marinaRestInProgress);

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

    // BUG 1 FIX: Block day advance if any critical resource is already depleted
    const isCriticallyDepleted = energy <= 0 || water <= 0 || fuel <= 0 || boatCondition <= 0;
    if (isCriticallyDepleted) {
      // Emergency abort — return to port without route rewards
      setStep("HUB");
      setActiveTab("liman");
      setVoyageDaysRemaining(0);
      setCurrentSeaEvent("");
      setPendingDecisionId(null);
      // Restore resources to minimal safe values so player isn't stuck
      setEnergy(e => Math.max(e, 5));
      setWater(w => Math.max(w, 5));
      setFuel(f => Math.max(f, 5));
      pushToast(
        "warning",
        "Seyir Yarıda Kesildi",
        "Kaynaklar tükendi. Acil limana dönüş yapıldı. Ödül verilmedi."
      );
      return;
    }

    const isFirstVoyage = completedRouteIds.length === 0;
    const shouldForceFirstVoyageEvent = isFirstVoyage && !firstVoyageEventTriggered;
    let shouldTriggerEvent = Math.random() < 0.3;

    if (shouldForceFirstVoyageEvent) {
      shouldTriggerEvent = true;
    }

    if (shouldTriggerEvent) {
      let nextDecision = SEA_DECISION_EVENTS[Math.floor(Math.random() * SEA_DECISION_EVENTS.length)];
      if (shouldForceFirstVoyageEvent) {
        nextDecision = SEA_DECISION_EVENTS.find(e => e.id === "content_opportunity") || nextDecision;
        setFirstVoyageEventTriggered(true);
      } else {
        let validEvents = SEA_DECISION_EVENTS.filter(e => !recentSeaEventIds.includes(e.id));
        if (validEvents.length === 0) validEvents = SEA_DECISION_EVENTS.filter(e => e.id !== recentSeaEventIds[0]);
        if (validEvents.length === 0) validEvents = SEA_DECISION_EVENTS;
        nextDecision = validEvents[Math.floor(Math.random() * validEvents.length)];
      }
      setPendingDecisionId(nextDecision.id);
      setRecentSeaEventIds(prev => [nextDecision.id, ...prev].slice(0, 2));
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

  const publishContent = ({
    platformId,
    contentType,
    storyHook = null,
  }: {
    platformId: string;
    contentType: string;
    storyHook?: StoryHook | null;
  }) => {
    const contentCooldownMs = getContentCooldownMs(captainLevel, testMode);

    if (lastContentAt && Date.now() - lastContentAt < contentCooldownMs) {
      const remainingMs = contentCooldownMs - (Date.now() - lastContentAt);
      const remainingMin = Math.ceil(remainingMs / 60000);
      setLogs(prev => [`Icerik hazirligi suruyor. ${remainingMin} dakika sonra tekrar uret.`, ...prev.slice(0, 4)]);
      return;
    }

    const storyFollowerBonus = storyHook?.bonusFollowersPct ?? 0;
    const storyCreditBonus = storyHook?.bonusCreditsPct ?? 0;

    const quality = calculateContentQuality({
      profileContentSkill: selectedProfile.skills.content || 0,
      platformId,
      contentType,
      upgradeContentBonus,
      marinaRegion: selectedMarina?.region ?? "",
      isSeaMode: step === "SEA_MODE",
      routeContentPotential: currentRoute?.contentPotential,
    });

    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    const { followers: gainFollowers, credits: gainCredits, viral: isViral } = calculateContentRewards({
      quality,
      platformId,
      storyFollowerBonusPct: storyFollowerBonus,
      storyCreditBonusPct: storyCreditBonus,
    });

    const comment = getContentComment(contentType, quality, isViral);
    const sponsorInterestGained = storyHook?.sponsorInterest ?? 0;

    setSelectedPlatformId(platformId);
    setSelectedContentType(contentType);
    setContentResult({
      platform: platform?.name || "Bilinmeyen",
      type: contentType,
      quality,
      viral: isViral,
      followersGained: gainFollowers,
      creditsGained: gainCredits,
      comment,
      storyHookTitle: storyHook?.title,
      storyHookSummary: storyHook
        ? `Hikaye bonusu: +%${storyFollowerBonus} takipci · +%${storyCreditBonus} TL`
        : undefined,
      sponsorInterestGained: sponsorInterestGained > 0 ? sponsorInterestGained : undefined,
    });

    setCredits(prev => prev + gainCredits);
    setFollowers(prev => prev + gainFollowers);
    setFirstContentDone(true);
    setTotalContentProduced(prev => prev + 1);
    addFloater(`+${gainCredits.toLocaleString("tr-TR")} TL`, "credits");
    setTimeout(() => addFloater(`+${gainFollowers.toLocaleString("tr-TR")} Takipci`, "followers"), 200);
    if (sponsorInterestGained > 0) {
      setBrandTrust(prev => Math.min(100, prev + sponsorInterestGained));
      setTimeout(() => addFloater(`+${sponsorInterestGained} Marka Guveni`, "followers"), 400);
    }
    triggerFlash("credits");
    triggerFlash("followers");

    const logMsg = storyHook
      ? `${platform?.name} platformunda hikaye icerigi yayinlandi: +${gainFollowers} Takipci, +${gainCredits} TL.`
      : `${platform?.name} platformunda icerik yayinlandi: +${gainFollowers} Takipci, +${gainCredits} TL.`;
    setLogs(prev => [logMsg, ...prev.slice(0, 4)]);
    pushToast(
      "content",
      storyHook ? "Hikaye Yayinlandi!" : "Icerik Yayinlandi!",
      storyHook
        ? `${storyHook.title}: +${gainFollowers.toLocaleString("tr-TR")} takipci, +${gainCredits.toLocaleString("tr-TR")} TL`
        : platform?.name
          ? `+${gainFollowers.toLocaleString("tr-TR")} takipci kazandin. Platform: ${platform.name}`
          : `+${gainFollowers.toLocaleString("tr-TR")} takipci kazandin.`,
    );
    setLastContentAt(Date.now());
    setCaptainXp(prev => prev + 20);
    completeGoal("produce_content");

    if (storyHook) {
      const remainingUses = Math.max(0, (storyHook.expiresAfterUses ?? 1) - 1);
      setActiveStoryHook(remainingUses > 0 ? { ...storyHook, expiresAfterUses: remainingUses } : null);
    }
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

    const effectSummary = formatSeaDecisionEffectSummary(effect);

    setCurrentSeaEvent(choice.resultText);
    setLogs(prev => [`${decision.title}: ${choice.resultText}`, ...prev.slice(0, 4)]);
    pushToast(
      "sea_decision",
      "Karar Uygulandi",
      effectSummary
        ? `${choice.label}. ${effectSummary}`
        : choice.label || "Secimin denizdeki yolculugun gidisatini etkiledi.",
    );
    if (choiceKey === "choiceA") {
      const nextStoryHook = createSeaEventStoryHook(decision.id, currentRoute?.id);
      if (nextStoryHook) {
        setContentResult(null);
        setActiveStoryHook(nextStoryHook);
        pushToast("voyage", "Hikaye Yakalandi", nextStoryHook.description);
      }
    }
    setCaptainXp(prev => prev + 30);
    setPendingDecisionId(null);
  };

  const handleArrival = (targetTab: Tab = "liman") => {
    if (!currentRoute) return;

    const reward = getRouteCompletionRewards(currentRoute);
    const nextStoryHook = createArrivalStoryHook(currentRoute);

    setWorldProgress(currentRoute.worldProgressPercent);
    setCompletedRouteIds(prev => [...prev, currentRoute.id]);
    setCurrentLocationName(currentRoute.to);
    setCredits(prev => prev + reward.credits);
    setFollowers(prev => prev + reward.followers);
    addFloater(`+${reward.credits.toLocaleString("tr-TR")} TL`, "credits");
    setTimeout(() => addFloater(`+${reward.followers.toLocaleString("tr-TR")} Takipci`, "followers"), 200);
    setTimeout(() => addFloater(`+80 XP`, "xp"), 400);
    triggerFlash("credits");
    triggerFlash("followers");

    const nextR = getNextRoute(currentRoute.id as RouteId);
    if (nextR) {
      setCurrentRouteId(nextR.id);
    }

    setLogs(prev => [`${currentRoute.name} rotasi tamamlandi. ${currentRoute.to} limanina varildi. +${reward.credits} TL, +${reward.followers} takipci odul alindi.`, ...prev.slice(0, 4)]);
    setCaptainXp(prev => prev + 80);
    setContentResult(null);
    setActiveStoryHook(nextStoryHook);
    completeGoal("complete_route");
    setPendingDecisionId(null);
    setStep("HUB");
    setActiveTab(targetTab);
    setIcerikSubTab("produce");
    pushToast("voyage", "Yeni Yolculuk Hikayesi", nextStoryHook.description);
  };

  const handleProduceContentV2 = () => {
    if (!selectedPlatformId || !selectedContentType) return;
    publishContent({ platformId: selectedPlatformId, contentType: selectedContentType });
  };

  const handleCheckSponsorOffers = () => {
    const noOfferMessage = "Şu an yeni teklif yok. Daha fazla içerik üret, takipçi kazan ve marka güvenini artır.";
    const pendingOfferMessage = "Zaten bekleyen sponsor teklifin var. Önce mevcut teklifi değerlendir.";

    if (sponsorOffers.length > 0) {
      setLogs(prev => [pendingOfferMessage, ...prev.slice(0, 4)]);
      return;
    }

    const tier = getSponsorTierByFollowers(followers, brandTrust);
    if (!tier) {
      setLogs(prev => [noOfferMessage, ...prev.slice(0, 4)]);
      return;
    }

    const sponsorBrands = [
      "BlueWave Kamera",
      "Marina Plus",
      "OceanSafe Güvenlik",
      "SolarDeck Enerji",
      "SailWear Outdoor",
      "DeepRoute Navigasyon",
    ];

    const activeSponsorSet = new Set(
      acceptedSponsors.map(name => String(name).trim()).filter(Boolean)
    );

    const pendingSponsorSet = new Set(
      sponsorOffers.map(offer => String(offer?.brandName ?? "").trim()).filter(Boolean)
    );

    const eligibleBrands = sponsorBrands.filter(
      brand => !activeSponsorSet.has(brand) && !pendingSponsorSet.has(brand)
    );

    if (eligibleBrands.length === 0) {
      setLogs(prev => [noOfferMessage, ...prev.slice(0, 4)]);
      return;
    }

    const randomBrand = eligibleBrands[Math.floor(Math.random() * eligibleBrands.length)];

    const newOffer = {
      id: "spo_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      brandName: randomBrand,
      tierName: tier.name,
      tierId: tier.tier,
      minReward: tier.rewardRange.min,
      maxReward: tier.rewardRange.max,
    };

    setSponsorOffers(prev => {
      const seenBrands = new Set<string>();

      const cleanedOffers = prev.filter(offer => {
        const brandName = String(offer?.brandName ?? "").trim();
        if (!brandName) return false;
        if (activeSponsorSet.has(brandName)) return false;
        if (seenBrands.has(brandName)) return false;
        seenBrands.add(brandName);
        return true;
      });

      if (cleanedOffers.length > 0) {
        return cleanedOffers.slice(0, 1);
      }

      return [newOffer];
    });

    if (!hasReceivedFirstSponsor) {
      setHasReceivedFirstSponsor(true);
      setActiveCelebration({ type: "sponsor", brandName: newOffer.brandName });
    }
  };

  const handleAcceptSponsor = (offerId: string) => {
    const offer = sponsorOffers.find(o => o.id === offerId);
    if (!offer) return;

    const brandName = String(offer.brandName ?? "").trim();
    if (!brandName) return;

    const uniqueAcceptedSponsors = Array.from(
      new Set(acceptedSponsors.map(name => String(name).trim()).filter(Boolean))
    );

    if (uniqueAcceptedSponsors.includes(brandName)) {
      setAcceptedSponsors(uniqueAcceptedSponsors);
      setSponsorOffers(prev => prev.filter(o => o.id !== offerId && o.brandName !== brandName));
      setLogs(prev => [`${brandName} zaten aktif sponsor. Tekrar eklenmedi.`, ...prev.slice(0, 4)]);
      return;
    }

    let baseReward = Math.floor(Math.random() * (offer.maxReward - offer.minReward + 1)) + offer.minReward;
    if (selectedProfile.id === "social_entrepreneur") {
      baseReward = Math.floor(baseReward * 1.1);
    }

    setCredits(prev => prev + baseReward);

    setAcceptedSponsors(prev => {
      const cleanedSponsors = Array.from(
        new Set(prev.map(name => String(name).trim()).filter(Boolean))
      );

      if (cleanedSponsors.includes(brandName)) {
        return cleanedSponsors;
      }

      return [...cleanedSponsors, brandName];
    });

    setSponsorOffers(prev => {
      const seenBrands = new Set<string>();

      return prev.filter(o => {
        const offerBrandName = String(o?.brandName ?? "").trim();

        if (o.id === offerId) return false;
        if (offerBrandName === brandName) return false;
        if (!offerBrandName) return false;
        if (seenBrands.has(offerBrandName)) return false;

        seenBrands.add(offerBrandName);
        return true;
      });
    });

    triggerFlash("credits");

    const newCount = sponsoredContentCount + 1;
    setSponsoredContentCount(newCount);

    if (newCount % 3 === 0) {
      setLogs(prev => [`${brandName} teklifi kabul edildi (+${baseReward} TL). Ancak takipçiler sürekli sponsorlu içeriklerden sıkılmaya başladı.`, ...prev.slice(0, 4)]);
    } else {
      setBrandTrust(prev => prev + 2);
      setLogs(prev => [`${brandName} teklifi kabul edildi (+${baseReward} TL). Marka güveni arttı.`, ...prev.slice(0, 4)]);
    }
  };

  const getUpgradeInstallMs = (upgrade: (typeof BOAT_UPGRADES)[number], captainLevelForDuration: number = captainLevel) => {
    if (testMode) return 5000;
    const baseDurationMs = getBoatUpgradeDurationMs(captainLevelForDuration);

    if (typeof upgrade.installDays === "number" && upgrade.installDays > 0) {
      return upgrade.installDays * baseDurationMs;
    }

    if (upgrade.cost >= 15000 || upgrade.size === "large" || upgrade.size === "ocean") {
      return baseDurationMs;
    }
    if (upgrade.cost >= 7000 || upgrade.size === "medium") {
      return Math.max(60 * 1000, Math.ceil(baseDurationMs / 2));
    }
    return Math.max(60 * 1000, Math.ceil(baseDurationMs / 6));
  };

  const formatInstallDuration = (durationMs: number) => {
    const totalMinutes = Math.max(1, Math.ceil(durationMs / 60000));

    if (totalMinutes < 60) {
      return `${totalMinutes} dk`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours} sa` : `${hours} sa ${minutes} dk`;
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
      setUpgradesInProgress(prev => prev.filter((item) => item.upgradeId !== upgradeId));
      return;
    }

    const purchasedIds = existingPurchasedIds ?? purchasedUpgradeIds;
    if (purchasedIds.includes(upgradeId)) {
      setUpgradesInProgress(prev => prev.filter((item) => item.upgradeId !== upgradeId));
      return;
    }

    setPurchasedUpgradeIds(prev => (prev.includes(upgradeId) ? prev : [...prev, upgradeId]));
    applyUpgradeEffects(upgrade);
    setUpgradesInProgress(prev => prev.filter((item) => item.upgradeId !== upgradeId));
    setLogs(prev => [`Kurulum tamamlandı: ${upgrade.name} aktif edildi.`, ...prev.slice(0, 4)]);
    pushToast("upgrade", "Upgrade Tamamlandı!", `${upgrade.name} kurulumu tamamlandı!`);
  };

  const handleStartVoyage = () => {
    if (marinaRestInProgress) {
      setLogs(prev => ["Marina hizmeti devam ediyor. Seyre çıkmadan önce hizmetin tamamlanmasını bekle.", ...prev.slice(0, 4)]);
      pushToast("warning", "Hizmet Bekleniyor", "Marina hizmeti devam ediyor. Lütfen bekleyin.");
      return;
    }

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
    pushToast(
      "voyage",
      "Seyir Başladı!",
      currentRoute.feeling
        ? `Hedef: ${currentRoute.name}. ${currentRoute.feeling}`
        : `Hedef: ${currentRoute.name}. Dünya turunda yeni bir etap başlıyor.`,
    );
    setShowSailAnimation(true);
    setTimeout(() => setShowSailAnimation(false), 2800);
    setStep("SEA_MODE");
    setActiveTab("liman");
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = BOAT_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (upgradesInProgress.some((item) => item.upgradeId === upgradeId)) {
      setLogs(prev => ["Bu upgrade zaten kurulumda. Ayni gelistirme iki kez baslatilamaz.", ...prev.slice(0, 4)]);
      return;
    }

    if (upgradesInProgress.length >= MAX_PARALLEL_UPGRADES) {
      setLogs(prev => ["Tum kurulum slotlari dolu. Yeni upgrade icin aktif kurulumlardan birinin bitmesini bekle.", ...prev.slice(0, 4)]);
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
    const startedAt = Date.now();
    const completesAt = startedAt + installMs;
    const installMinutes = Math.max(1, Math.ceil(installMs / 60000));
    const slot = ([0, 1, 2] as const).find((candidate) => !upgradesInProgress.some((item) => item.slot === candidate));
    if (slot === undefined) {
      setLogs(prev => ["Tum kurulum slotlari dolu. Yeni upgrade icin aktif kurulumlardan birinin bitmesini bekle.", ...prev.slice(0, 4)]);
      return;
    }

    setCredits(prev => prev - upgrade.cost);
    setUpgradesInProgress(prev => [...prev, { upgradeId, completesAt, startedAt, durationMs: installMs, slot }]);
    triggerFlash("credits");
    setLogs(prev => [`Kurulum başladı: ${upgrade.name}. Tahmini tamamlanma: ${installMinutes} dakika.`, ...prev.slice(0, 4)]);
    completeGoal("buy_upgrade");
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
      marinaRestActionLabel={getMarinaRestLabel()}
      marinaRestActionDisabled={isMarinaRestActive}
      onMarinaRest={handleMarinaRest}
      onRefillWater={handleRefillWater}
      onRefillFuel={handleRefillFuel}
      onRepairBoat={handleRepairBoat}
      onGoContent={() => setActiveTab("icerik")}
      onGoRoute={() => setActiveTab("rota")}
      renderDailyGoals={renderDailyGoalsCard}
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
      routeFromName={currentRoute?.from}
      routeToName={currentRoute?.to}
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
    const CONTENT_TYPES: Array<{ id: string; label: string; icon: string }> = [
      { id: "marina_life", label: "Marina Yaşamı", icon: "⚓" },
      { id: "boat_tour", label: "Tekne Turu", icon: "⛵" },
      { id: "maintenance_upgrade", label: "Bakım / Upgrade", icon: "🔧" },
      { id: "city_trip", label: "Şehir Gezisi", icon: "🏛" },
      { id: "nature_bay", label: "Koy / Doğa", icon: "🌅" },
      { id: "sailing_vlog", label: "Seyir Vlogu", icon: "🧭" },
    ];

    if (step === "SEA_MODE") {
      CONTENT_TYPES.push({ id: "ocean_diary", label: "Deniz Günlüğü", icon: "🌐" });
      CONTENT_TYPES.push({ id: "storm_vlog", label: "Fırtına / Olay", icon: "⛈" });
    }

    const PLATFORM_VISUALS: Record<string, { icon: string; specialty: string }> = {
      viewTube: { icon: "▶", specialty: "Kalıcı büyüme" },
      clipTok:  { icon: "⚡", specialty: "Viral patlama" },
      instaSea: { icon: "◈", specialty: "Marka işbirliği" },
      facePort: { icon: "◉", specialty: "Sadık topluluk" },
    };

    const nextSponsorTier = SPONSOR_TIERS.find((tier) => followers < tier.minFollowers);
    const previousSponsorTier = [...SPONSOR_TIERS]
      .reverse()
      .find((tier) => followers >= tier.minFollowers);
    const currentSponsorTier = getSponsorTierByFollowers(followers, brandTrust);
    const activeSponsorName = acceptedSponsors[acceptedSponsors.length - 1] ?? "";
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
    const selectedPlatform = selectedPlatformId
      ? SOCIAL_PLATFORMS.find((platform) => platform.id === selectedPlatformId) ?? null
      : null;
    const contentCooldownMs = getContentCooldownMs(captainLevel, testMode);
    const contentCooldownRemaining = lastContentAt
      ? Math.max(0, contentCooldownMs - (Date.now() - lastContentAt))
      : 0;
    const cooldownMinutes = Math.ceil(contentCooldownRemaining / 60000);

    let contentCareerTitle = "Platform Momentum";
    let contentCareerText =
      "Düzenli içerik üretimi takipçiyi, sponsor fırsatlarını ve kaptan kariyerini büyütür.";

    if (activeSponsorName) {
      contentCareerTitle = "Marka Değeri Büyüyor";
      contentCareerText = "Her içerik, sponsor değerini ve dünya turu hikayeni güçlendiriyor.";
    } else if (nextSponsorTier && followers >= nextSponsorTier.minFollowers * 0.75) {
      contentCareerTitle = "Sponsor Eşiğine Yaklaşıyorsun";
      contentCareerText = "İçerik üretmeye devam et. İlk marka anlaşması artık daha yakın.";
    } else if (followers < 800) {
      contentCareerTitle = "İlk Kitleyi Kur";
      contentCareerText = "Her içerik, ilk sadık takipçilerini toplamak için bir adım.";
    }

    const onContentCooldown = contentCooldownRemaining > 0;
    const followersToTier = nextSponsorTier
      ? Math.max(0, nextSponsorTier.minFollowers - followers)
      : 0;
    const ctaDisabled = !selectedPlatformId || !selectedContentType || onContentCooldown;
    const selectedTypeMeta = selectedContentType
      ? CONTENT_TYPES.find((t) => t.id === selectedContentType) ?? null
      : null;
    const availableContentTypeIds = new Set(CONTENT_TYPES.map((type) => type.id));
    const storyHookPlan = activeStoryHook
      ? {
          platformId: selectedPlatformId ?? (activeStoryHook.source === "arrival" ? "viewTube" : "clipTok"),
          contentType:
            selectedContentType && availableContentTypeIds.has(selectedContentType)
              ? selectedContentType
              : "sailing_vlog",
        }
      : null;
    const storyHookButtonDisabled = !storyHookPlan || onContentCooldown;
    const selectedPlatformBestContentTypeIds = selectedPlatform?.bestContentTypes.map((id) => String(id)) ?? [];
    const activePlatforms = SOCIAL_PLATFORMS.filter((p) => p.mvpStatus === "active").map((platform) => ({
      id: platform.id,
      name: platform.name,
      mainRole: platform.mainRole,
      bestContentTypes: platform.bestContentTypes.map((id) => String(id)),
    }));

    return (
      <IcerikTab
        icerikSubTab={icerikSubTab}
        onChangeSubTab={setIcerikSubTab}
        contentCareerTitle={contentCareerTitle}
        contentCareerText={contentCareerText}
        followers={followers}
        credits={credits}
        nextSponsorTierName={nextSponsorTier?.name}
        followersToTier={followersToTier}
        locationBonusText={getLocationBonusLabel(selectedMarina?.region ?? "")?.label}
        step={step}
        currentRoute={currentRoute ? { name: currentRoute.name, contentThemes: currentRoute.contentThemes } : undefined}
        activeStoryHook={activeStoryHook}
        storyHookButtonDisabled={storyHookButtonDisabled}
        onPublishStoryHook={() => {
          if (!activeStoryHook || !storyHookPlan) return;
          publishContent({
            platformId: storyHookPlan.platformId,
            contentType: storyHookPlan.contentType,
            storyHook: activeStoryHook,
          });
        }}
        platforms={activePlatforms}
        platformVisuals={PLATFORM_VISUALS}
        selectedPlatformId={selectedPlatformId}
        onSelectPlatform={setSelectedPlatformId}
        selectedPlatformName={selectedPlatform?.name}
        contentTypes={CONTENT_TYPES}
        selectedContentType={selectedContentType}
        onSelectContentType={setSelectedContentType}
        selectedPlatformBestContentTypeIds={selectedPlatformBestContentTypeIds}
        selectedTypeLabel={selectedTypeMeta?.label}
        onContentCooldown={onContentCooldown}
        cooldownMinutes={cooldownMinutes}
        ctaDisabled={ctaDisabled}
        onProduceContent={handleProduceContentV2}
        contentResult={contentResult}
        onResetContentResult={() => {
          setContentResult(null);
          setSelectedPlatformId(null);
          setSelectedContentType(null);
        }}
        sponsorTabProps={{
          activeSponsorName,
          brandTrust,
          currentSponsorTierName: currentSponsorTier?.name,
          nextSponsorTier: nextSponsorTier
            ? { name: nextSponsorTier.name, minFollowers: nextSponsorTier.minFollowers }
            : undefined,
          sponsorProgressPercent,
          followers,
          onCheckSponsorOffers: handleCheckSponsorOffers,
          sponsorOffers: sponsorOffers as Array<{
            id: string;
            brandName: string;
            tierName: string;
            minReward: number;
            maxReward: number;
          }>,
          onAcceptSponsor: handleAcceptSponsor,
          acceptedSponsors,
        }}
      />
    );
  };

  const renderRotaTab = () => {
    const nextRouteData = currentRoute ? getNextRoute(currentRoute.id as RouteId) : undefined;
    return (
    <>
      <RotaTab
        currentRoute={currentRoute
          ? {
              ...currentRoute,
              feeling: currentRoute.feeling,
              difficulty: currentRoute.difficulty,
            }
          : undefined}
        nextRoute={nextRouteData
          ? { name: nextRouteData.name, feeling: nextRouteData.feeling, riskLevel: nextRouteData.riskLevel }
          : undefined}
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
        completedRouteIds={completedRouteIds}
        onStartVoyage={handleStartVoyage}
        onGoTekne={() => { setActiveTab("tekne"); setComingFromRotaMissing(false); }}
        onGoUpgradeCategory={(cat) => {
          setActiveTab("tekne");
          setSelectedUpgradeCategory(cat as UpgradeCategoryId);
          setComingFromRotaMissing(true);
        }}
        openReadiness={shouldOpenRotaReadiness}
        onReadinessOpened={() => setShouldOpenRotaReadiness(false)}
      />
    </>
  );
  };

  const renderTekneTab = () => {
    const filteredUpgrades = BOAT_UPGRADES.filter((u) => u.categoryId === selectedUpgradeCategory);
    const activeInstallRows = upgradesInProgress
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((item) => ({
        ...item,
        upgrade: BOAT_UPGRADES.find((upgrade) => upgrade.id === item.upgradeId) ?? null,
      }))
      .filter((item) => item.upgrade !== null);

    const tkStats: Array<{ key: "energy" | "water" | "safety" | "nav"; icon: string; label: string; value: number }> = [
      { key: "energy", icon: "?", label: "Enerji", value: upgradeEnergyBonus },
      { key: "water", icon: "??", label: "Su", value: upgradeWaterBonus },
      { key: "safety", icon: "??", label: "G?venlik", value: upgradeSafetyBonus },
      { key: "nav", icon: "??", label: "Navigasyon", value: upgradeNavigationBonus },
    ];

    const upgradeCards = filteredUpgrades.map((upgrade) => {
      const isPurchased = purchasedUpgradeIds.includes(upgrade.id);
      const isInstalling = upgradesInProgress.some((item) => item.upgradeId === upgrade.id);
      const comp = upgrade.compatibility.find((c) => c.boatId === selectedBoat.id);
      const isCompatible = comp ? comp.compatible : false;
      const hasWarning = Boolean(comp && (comp.efficiency === "poor" || comp.efficiency === "limited"));
      const cantAfford = credits < upgrade.cost;
      const slotsFull = upgradesInProgress.length >= MAX_PARALLEL_UPGRADES;
      const buyDisabled = cantAfford || isInstalling || slotsFull;
      const installDurationLabel = formatInstallDuration(getUpgradeInstallMs(upgrade));
      const effects = Object.entries(upgrade.effects)
        .filter(([, val]) => Boolean(val))
        .map(([key, val]) => ({
          key,
          label: upgradeEffectLabels[key] ?? key,
          value: Number(val),
        }));

      return {
        id: upgrade.id,
        name: upgrade.name,
        description: upgrade.description,
        cost: upgrade.cost,
        marinaRequirementLabel: upgrade.marinaRequirement.toUpperCase(),
        installDurationLabel,
        isPurchased,
        isCompatible,
        hasWarning,
        compatibilityNote: comp?.note,
        cantAfford,
        slotsFull,
        isInstalling,
        buyDisabled,
        effects,
      };
    });

    return (
      <TekneTab
        boatSvg={getBoatSvg(selectedBoat.id)}
        boatName={boatName}
        selectedBoatName={selectedBoat.name}
        selectedBoatLengthFt={selectedBoat.lengthFt}
        credits={credits}
        currentOceanReadiness={currentOceanReadiness}
        tkStats={tkStats}
        activeInstallRows={activeInstallRows.map((item) => ({
          upgradeId: item.upgradeId,
          slot: item.slot,
          upgradeName: item.upgrade?.name ?? "",
          remainingText: formatRemainingInstallTime(item.completesAt),
        }))}
        categories={UPGRADE_CATEGORIES.map((cat) => ({ id: cat.id, name: cat.name }))}
        selectedUpgradeCategory={selectedUpgradeCategory}
        onSelectUpgradeCategory={setSelectedUpgradeCategory}
        comingFromRotaMissing={comingFromRotaMissing}
        onBackToRotaMissing={() => {
          setActiveTab("rota");
          setComingFromRotaMissing(false);
          setShouldOpenRotaReadiness(true);
        }}
        upgradeCards={upgradeCards}
        onBuyUpgrade={handleBuyUpgrade}
        installedUpgradeLabels={purchasedUpgradeObjects.map(u => u.name)}
      />
    );
  };

  const renderKaptanTab = () => (
    <KaptanTab
      selectedProfile={selectedProfile}
      captainLevel={captainLevel}
      captainXp={captainXp}
      completedRoutesCount={completedRouteIds.length}
      worldProgress={worldProgress}
      followers={followers}
      achievementStatuses={achievementStatuses}
      logs={logs}
    />
  );

  const completeGoal = (type: DailyGoal["type"]) => {
    setDailyGoals(prev => prev.map(g => g.type === type && !g.completed ? { ...g, completed: true } : g));
  };

  const renderDailyGoalsCard = () => {
    const completedCount = dailyGoals.filter(g => g.completed).length;
    const allDone = completedCount === dailyGoals.length;
    const dailyGoalTheme = getDailyGoalTheme(lastDailyReset || new Date().toISOString().slice(0, 10));
    return (
      <div className={`daily-goals-card${allDone ? " daily-goals-done" : ""}`}>
        <div className="daily-goals-header">
          <span className="daily-goals-title">Günlük Görevler</span>
          <span className="daily-goals-count">{completedCount}/{dailyGoals.length}</span>
        </div>
        <div className="daily-goals-focus">Bugünün Odağı: {dailyGoalTheme.title}</div>
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

  const renderProgressStrip = () => {
    const nextSponsorTier = SPONSOR_TIERS.find((tier) => followers < tier.minFollowers);
    const contentGoalDoneToday = dailyGoals.find((goal) => goal.type === "produce_content")?.completed ?? false;
    const hasAnyCompatibleUpgrade = BOAT_UPGRADES.some((upgrade) => {
      if (purchasedUpgradeIds.includes(upgrade.id)) return false;
      const compatibility = upgrade.compatibility.find((item) => item.boatId === selectedBoat.id);
      return compatibility?.compatible ?? false;
    });
    const canStartAnyUpgrade = upgradesInProgress.length < MAX_PARALLEL_UPGRADES && BOAT_UPGRADES.some((upgrade) => {
      if (purchasedUpgradeIds.includes(upgrade.id)) return false;
      const compatibility = upgrade.compatibility.find((item) => item.boatId === selectedBoat.id);
      return (compatibility?.compatible ?? false) && credits >= upgrade.cost;
    });
    const isSponsorProgressClose = Boolean(nextSponsorTier && followers >= nextSponsorTier.minFollowers * 0.75);

    let nextActionTitle = "Dünya turuna devam";

    if (!contentGoalDoneToday || followers < 800) {
      nextActionTitle = "İlk içerik zamanı";
    } else if (firstContentDone && currentRoute && completedRouteIds.length < 2) {
      nextActionTitle = "İlk rotanı başlat";
    } else if (canStartAnyUpgrade || hasAnyCompatibleUpgrade) {
      nextActionTitle = "Tekneyi güçlendir";
    } else if (isSponsorProgressClose) {
      nextActionTitle = "Sponsor hedefini kovala";
    }

    return (
      <>
        <div className="progress-strip">
          <div className="progress-strip-summary">
            <span className="progress-strip-item">Kpt. Lv.{captainLevel} · {captainXp} XP</span>
            <span className="progress-strip-sep">|</span>
            <span className="progress-strip-item">{followers.toLocaleString("tr-TR")} takipçi</span>
            <span className="progress-strip-sep">|</span>
            <span className="progress-strip-item">Dünya Turu: {completedRouteIds.length}/{WORLD_ROUTES.length} Rota</span>
          </div>

        </div>

        {!tavsiyeDismissed && (
          <div className="next-action-card">
            <div className="next-action-content">
              <span className="next-action-eyebrow">Kaptan Tavsiyesi</span>
              <div className="next-action-title">{nextActionTitle}</div>
            </div>
            <button
              className="next-action-cta primary-button"
              onClick={() => setActiveTab(
                (!contentGoalDoneToday || followers < 800) ? "icerik" :
                (firstContentDone && completedRouteIds.length < 2) ? "rota" :
                (canStartAnyUpgrade || hasAnyCompatibleUpgrade) ? "tekne" : "icerik"
              )}
            >
              Git →
            </button>
            <button
              className="next-action-dismiss"
              onClick={() => setTavsiyeDismissed(true)}
              aria-label="Kapat"
            >
              ×
            </button>
          </div>
        )}
      </>
    );
  };

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
    const rewardCredits = arrivalReward?.credits ?? 0;
    const rewardFollowers = arrivalReward?.followers ?? 0;
    const arrivalSummaryProgressPercent = Math.max(
      0,
      Math.min(100, (completedRouteCount / WORLD_ROUTES.length) * 100)
    );
    let arrivalMilestoneText = "Bu varış, dünya turundaki bir sonraki büyük adımın.";
    if (completedRouteCount === 1) {
      arrivalMilestoneText = "İlk rota tamamlandı. Artık bu yolculuk gerçekten başladı.";
    } else if (arrivalSummaryProgressPercent >= 100) {
      arrivalMilestoneText = "Dünya turu tamamlandı. Bu artık bir hayal değil, başarı hikayesi.";
    } else if (arrivalSummaryProgressPercent >= 75) {
      arrivalMilestoneText = "Son büyük etaplara giriyorsun. Dünya turu artık ulaşılabilir görünüyor.";
    } else if (arrivalSummaryProgressPercent >= 50) {
      arrivalMilestoneText = "Yolculuğun yarısı geride kaldı. Artık gerçek bir açık deniz hikayesi yazıyorsun.";
    } else if (arrivalSummaryProgressPercent >= 25) {
      arrivalMilestoneText = "Dünya turunun ilk çeyreğine yaklaşıyorsun.";
    }

    return (
      <ArrivalScreen
        portName={currentRoute?.to ?? "Varış Limanı"}
        feeling={currentRoute?.feeling}
        rewardCredits={rewardCredits}
        rewardFollowers={rewardFollowers}
        xpGain={80}
        worldProgressPercent={currentRoute?.worldProgressPercent ?? 0}
        completedRouteIds={completedRouteIds}
        currentRouteId={currentRoute?.id ?? ""}
        milestoneText={arrivalMilestoneText}
        nextRouteName={nextRoute?.name}
        onDone={handleArrival}
      />
    );
  };

  return (
    <div className="game-wrapper">
      <AppBackground />
      {activeToast && (
        <div
          className={`game-toast game-toast--${activeToast.type}${isToastLeaving ? " leaving" : ""}`}
          role="status"
          aria-live="polite"
          onClick={() => setActiveToast(null)}
        >
          <div className="game-toast-title">{activeToast.title}</div>
          <div className="game-toast-text">{activeToast.text}</div>
        </div>
      )}
      {["WELCOME", "MAIN_MENU", "PICK_PROFILE", "PICK_MARINA", "PICK_BOAT", "NAME_BOAT", "PICK_GENDER"].includes(step) && (
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
          gender={gender}
          onSetGender={setGender}
        />
      )}
      {(step === "HUB" || step === "SEA_MODE") && renderMainGame()}
      {step === "HUB" && tutorialStep < 3 && (
        <div className="hub-tutorial-overlay">
          <MicoGuide
            message={[
              "Kaptan, hoşgeldin! İlk adım içerik üretmek — İçerik sekmesine geç ve bir video çek. Takipçiler böyle kazanılır!",
              "Harika iş! Şimdi teknenizi güçlendir. Tekne sekmesinden bir upgrade başlatmanı öneririm.",
              "Mükemmel! Tekne hazır. Artık denize açılma zamanı — Rota sekmesinden ilk rotanı başlat!",
            ][tutorialStep] ?? ""}
            visible={step === "HUB" && tutorialStep < 3}
            actionLabel={["İçerik Üret →", "Tekneye Git →", "Rotaya Bak →"][tutorialStep]}
            onAction={() => {
              const tabs: Tab[] = ["icerik", "tekne", "rota"];
              setActiveTab(tabs[tutorialStep] ?? "liman");
            }}
            onDismiss={() => setTutorialStep(3)}
          />
        </div>
      )}
      {showSailAnimation && (
        <div className="sail-launch-overlay">
          <div className="sail-launch-boat" aria-hidden="true">⛵</div>
          <p className="sail-launch-text">Açık denize çıkıyorsun!</p>
          <div className="sail-launch-waves" aria-hidden="true">
            <span>〰</span><span>〰</span><span>〰</span>
          </div>
        </div>
      )}
      {showMicoFarewell && (
        <div className="hub-tutorial-overlay">
          <MicoGuide
            message="Kaptan, denizdeyiz! Bu yolculuktan sonra artık sen kaptansın. Ben her zaman buradayım — iyi seyirler!"
            visible={showMicoFarewell}
            actionLabel="İyi yolculuklar Miço!"
            onAction={() => setShowMicoFarewell(false)}
            onDismiss={() => setShowMicoFarewell(false)}
          />
        </div>
      )}
      {step === "ARRIVAL_SCREEN" && renderArrivalScreen()}
      {activeCelebration && (
        <CelebrationModal
          celebration={activeCelebration}
          onDismiss={() => setActiveCelebration(null)}
        />
      )}
      <div className="global-floaters">
        {rewardFloaters.map(f => (
          <div key={f.id} className={`floating-reward floating-reward--${f.type}`}>
            {f.text}
          </div>
        ))}
      </div>
      <button
        onClick={() => setTestMode(!testMode)}
        style={{
          position: 'fixed', bottom: 4, left: 4, zIndex: 9999,
          background: testMode ? 'red' : 'transparent', color: testMode ? 'white' : 'rgba(255,255,255,0.1)',
          border: 'none', fontSize: 10, padding: '2px 4px', cursor: 'pointer', borderRadius: '4px'
        }}
      >
        {testMode ? "DEV MODE ON" : "v1.0"}
      </button>
      {testMode && (
        <div style={{
          position: 'fixed', bottom: 30, left: 4, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', border: '1px solid red', padding: '8px', color: 'white',
          display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', borderRadius: '6px',
          maxHeight: '70vh', overflowY: 'auto', width: '160px'
        }}>
          <strong style={{color:'red', textAlign:'center', borderBottom:'1px solid red', paddingBottom:'4px'}}>TEST ACTIONS</strong>
          <button style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'4px', borderRadius:'4px', cursor:'pointer'}} onClick={() => setCredits(c => c + 10000)}>+10K TL</button>
          <button style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'4px', borderRadius:'4px', cursor:'pointer'}} onClick={() => { setFollowers(f => f + 1000); triggerFlash("followers"); }}>+1K Followers</button>
          <button style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'4px', borderRadius:'4px', cursor:'pointer'}} onClick={() => { setEnergy(100); setWater(100); setFuel(100); setBoatCondition(100); }}>Fill Resources</button>
          <button style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'4px', borderRadius:'4px', cursor:'pointer'}} onClick={() => setLastContentAt(0)}>Reset Content CD</button>
          <button style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'4px', borderRadius:'4px', cursor:'pointer'}} onClick={() => setUpgradesInProgress(prev => prev.map(u => ({ ...u, completesAt: 0 })))}>Finish Upgrades</button>
          <button style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'4px', borderRadius:'4px', cursor:'pointer'}} onClick={() => setMarinaRestInProgress(null)}>Finish Marina Rest</button>
          <button style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'4px', borderRadius:'4px', cursor:'pointer'}} onClick={() => {
             if (step === "SEA_MODE") {
                const evt = SEA_DECISION_EVENTS[Math.floor(Math.random() * SEA_DECISION_EVENTS.length)];
                setPendingDecisionId(evt.id);
                setCurrentSeaEvent(evt.description);
             } else {
                pushToast("voyage", "Sea Mode", "You must be in Sea Mode to trigger an event.");
             }
          }}>Trigger Sea Event</button>
          <button style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'4px', borderRadius:'4px', cursor:'pointer'}} onClick={() => setCaptainXp(prev => prev + 500)}>+500 XP</button>
        </div>
      )}
    </div>
  );
}

export default App;
