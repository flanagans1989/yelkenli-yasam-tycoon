import { describe, expect, it } from "vitest";
import { WORLD_ROUTES } from "../game-data/routes";
import { buildSaveSnapshot } from "../src/lib/buildSaveSnapshot";
import { migrateSave, processUpgradesFromSave } from "../src/lib/saveLoad";

describe("prestige voyage audit", () => {
  it("keeps the main world-tour progression at 17 routes", () => {
    expect(WORLD_ROUTES).toHaveLength(17);
  });

  it("preserves upgrade ownership and route completion data across save/load after world-tour completion", () => {
    const purchasedUpgradeIds = ["solar_array", "watermaker", "storm_sails"];
    const completedRouteIds = WORLD_ROUTES.map((route) => route.id);
    const snapshot = buildSaveSnapshot({
      memberFullName: "",
      memberUsername: "",
      memberEmail: "",
      profileIndex: 0,
      marinaIndex: 0,
      boatIndex: 0,
      boatName: "Prestige Audit",
      credits: 125000,
      tokens: 40,
      followers: 250000,
      firstContentDone: true,
      logs: [],
      purchasedUpgradeIds,
      upgradesInProgress: [],
      step: "HUB",
      activeTab: "rota",
      currentLocationName: "Turkiye",
      worldProgress: 100,
      energy: 100,
      water: 100,
      fuel: 100,
      boatCondition: 100,
      currentRouteId: completedRouteIds[completedRouteIds.length - 1],
      completedRouteIds,
      voyageTotalDays: 0,
      voyageDaysRemaining: 0,
      currentSeaEvent: "",
      pendingDecisionId: null,
      selectedPlatformId: null,
      selectedContentType: null,
      contentResult: null,
      selectedUpgradeCategory: "energy",
      brandTrust: 80,
      sponsorOffers: [],
      acceptedSponsors: ["BlueWave Kamera"],
      sponsoredContentCount: 3,
      contentHistory: [],
      icerikSubTab: "produce",
      lastContentAt: null,
      marinaRestInProgress: null,
      captainXp: 1000,
      captainLevel: 5,
      dailyGoals: [],
      lastDailyReset: "2026-05-15",
      dailyRewardClaimed: false,
      totalContentProduced: 10,
      hasCompletedDailyGoalsOnce: true,
      firstVoyageEventTriggered: true,
      testMode: false,
      hasReceivedFirstSponsor: true,
      activeStoryHook: null,
      tutorialStep: 3,
      gender: "unspecified",
      completedFollowerMilestones: ["1k", "10k", "100k"],
      sponsorObligations: { "BlueWave Kamera": 5 },
      loginStreak: 2,
      lastLoginBonus: "2026-05-15",
      lastMarinaDebitAt: null,
      marinaTasks: [],
      lastMarinaTasksLocation: "Turkiye",
      hasCompletedWorldTour: true,
      adWatchesByFeatureByDate: {},
    });

    const migrated = migrateSave(snapshot);

    expect(migrated).not.toBeNull();
    expect(migrated?.save.hasCompletedWorldTour).toBe(true);
    expect(migrated?.save.completedRouteIds).toEqual(completedRouteIds);
    expect(migrated?.save.purchasedUpgradeIds).toEqual(purchasedUpgradeIds);
    expect(migrated?.save.upgradesInProgress).toEqual([]);
  });

  it("does not convert purchased upgrades into in-progress installs during load processing", () => {
    const purchasedUpgradeIds = ["solar_array", "watermaker"];
    const processed = processUpgradesFromSave([], null, purchasedUpgradeIds);

    expect(processed.purchasedUpgradeIds).toEqual(purchasedUpgradeIds);
    expect(processed.upgradesInProgress).toEqual([]);
    expect(processed.completedUpgradeObjects).toEqual([]);
  });
});
