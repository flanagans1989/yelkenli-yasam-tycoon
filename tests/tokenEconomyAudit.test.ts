import { describe, expect, it } from "vitest";
import {
  TOKEN_ALLOWED_RULES,
  getTokenSpeedupCost,
  isTokenActionAllowed,
} from "../game-data/economy";
import { buildSaveSnapshot } from "../src/lib/buildSaveSnapshot";
import { migrateSave } from "../src/lib/saveLoad";

describe("token economy audit", () => {
  it("limits live token actions to time speedups only", () => {
    const allowedActions = TOKEN_ALLOWED_RULES
      .filter((rule) => rule.allowed)
      .map((rule) => rule.action);

    expect(allowedActions).toEqual([
      "upgrade_speedup",
      "content_cooldown_speedup",
      "marina_rest_speedup",
    ]);
  });

  it("keeps blocked progression actions unavailable to tokens", () => {
    expect(isTokenActionAllowed("buy_followers")).toBe(false);
    expect(isTokenActionAllowed("guarantee_viral")).toBe(false);
    expect(isTokenActionAllowed("skip_ocean_requirements")).toBe(false);
    expect(isTokenActionAllowed("complete_world_tour")).toBe(false);
    expect(isTokenActionAllowed("ocean_readiness_purchase")).toBe(false);
    expect(isTokenActionAllowed("route_completion_purchase")).toBe(false);
    expect(isTokenActionAllowed("xp_purchase")).toBe(false);
  });

  it("uses capped minute-based token pricing for speedups", () => {
    expect(getTokenSpeedupCost(1)).toBe(1);
    expect(getTokenSpeedupCost(60)).toBe(1);
    expect(getTokenSpeedupCost(61)).toBe(2);
    expect(getTokenSpeedupCost(60 * 90)).toBe(60);
  });

  it("persists token balances in save snapshots and migrations", () => {
    const snapshot = buildSaveSnapshot({
      memberFullName: "",
      memberUsername: "",
      memberEmail: "",
      profileIndex: 0,
      marinaIndex: 0,
      boatIndex: 0,
      boatName: "Audit",
      credits: 1000,
      tokens: 73,
      followers: 200,
      firstContentDone: false,
      logs: [],
      purchasedUpgradeIds: [],
      upgradesInProgress: [],
      step: "HUB",
      activeTab: "liman",
      currentLocationName: "Kas",
      worldProgress: 0,
      energy: 100,
      water: 100,
      fuel: 100,
      boatCondition: 100,
      currentRouteId: "turkiye_start",
      completedRouteIds: [],
      voyageTotalDays: 0,
      voyageDaysRemaining: 0,
      currentSeaEvent: "",
      pendingDecisionId: null,
      selectedPlatformId: null,
      selectedContentType: null,
      contentResult: null,
      selectedUpgradeCategory: "energy",
      brandTrust: 10,
      sponsorOffers: [],
      acceptedSponsors: [],
      sponsoredContentCount: 0,
      contentHistory: [],
      icerikSubTab: "produce",
      lastContentAt: null,
      marinaRestInProgress: null,
      captainXp: 0,
      captainLevel: 1,
      dailyGoals: [],
      lastDailyReset: "",
      dailyRewardClaimed: false,
      totalContentProduced: 0,
      hasCompletedDailyGoalsOnce: false,
      firstVoyageEventTriggered: false,
      testMode: false,
      hasReceivedFirstSponsor: false,
      activeStoryHook: null,
      tutorialStep: 0,
      gender: "unspecified",
      completedFollowerMilestones: [],
      sponsorObligations: {},
      loginStreak: 0,
      lastLoginBonus: "",
      lastMarinaDebitAt: null,
      marinaTasks: [],
      lastMarinaTasksLocation: "",
      hasCompletedWorldTour: false,
      adWatchesByFeatureByDate: {},
    });

    expect(snapshot.tokens).toBe(73);
    expect(migrateSave(snapshot)?.save.tokens).toBe(73);
  });
});
