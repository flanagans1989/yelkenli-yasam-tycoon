import type { GameSaveSnapshotInput } from "../lib/buildSaveSnapshot";
import { STARTING_ECONOMY } from "../../game-data/economy";
import type { GameAction } from "./gameActions";

// GameState is an exact alias of the save snapshot input.
// This means buildSaveSnapshot(gameState) is always valid with no field mapping.
export type GameState = GameSaveSnapshotInput;

export function getInitialGameState(): GameState {
  return {
    memberFullName: "",
    memberUsername: "",
    memberEmail: "",
    profileIndex: 0,
    marinaIndex: 0,
    boatIndex: 0,
    boatName: "",
    credits: 0,
    tokens: STARTING_ECONOMY.startingTokens,
    followers: 0,
    firstContentDone: false,
    logs: [],
    purchasedUpgradeIds: [],
    upgradesInProgress: [],
    step: "WELCOME",
    activeTab: "liman",
    currentLocationName: "",
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
    tutorialStep: 3,
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
  };
}

const MAX_LOGS = 5;

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // ── Full-state bulk ──────────────────────────────────────────────────────
    case "GAME/INITIALIZE":
    case "GAME/LOAD":
      return action.payload;

    // ── Economy ──────────────────────────────────────────────────────────────
    case "ECONOMY/SET_CREDITS":
      return { ...state, credits: action.payload };
    case "ECONOMY/ADD_CREDITS":
      return { ...state, credits: state.credits + action.payload };
    case "ECONOMY/SET_TOKENS":
      return { ...state, tokens: action.payload };
    case "ECONOMY/ADD_TOKENS":
      return { ...state, tokens: state.tokens + action.payload };
    case "ECONOMY/ADD_FOLLOWERS":
      return { ...state, followers: state.followers + action.payload };
    case "ECONOMY/SET_FOLLOWERS":
      return { ...state, followers: action.payload };

    // ── Logs ─────────────────────────────────────────────────────────────────
    case "LOGS/ADD":
      return { ...state, logs: [action.payload, ...state.logs].slice(0, MAX_LOGS) };
    case "LOGS/SET":
      return { ...state, logs: action.payload.slice(0, MAX_LOGS) };

    // ── Resources ─────────────────────────────────────────────────────────────
    case "RESOURCES/SET":
      return { ...state, ...action.payload };

    // ── Navigation ────────────────────────────────────────────────────────────
    case "NAVIGATION/SET_STEP":
      return { ...state, step: action.payload };
    case "NAVIGATION/SET_TAB":
      return { ...state, activeTab: action.payload };
    case "NAVIGATION/SET_STEP_AND_TAB":
      return { ...state, step: action.payload.step, activeTab: action.payload.tab };
    case "NAVIGATION/SET_TUTORIAL_STEP":
      return { ...state, tutorialStep: action.payload };

    // ── Voyage ────────────────────────────────────────────────────────────────
    case "VOYAGE/START":
      return {
        ...state,
        currentRouteId: action.payload.routeId,
        currentLocationName: action.payload.locationName,
        voyageTotalDays: action.payload.totalDays,
        voyageDaysRemaining: action.payload.totalDays,
        step: action.payload.step,
      };

    case "VOYAGE/ARRIVE":
      return {
        ...state,
        worldProgress: action.payload.worldProgress,
        completedRouteIds: action.payload.completedRouteIds,
        hasCompletedWorldTour: action.payload.hasCompletedWorldTour,
        currentLocationName: action.payload.currentLocationName,
        lastMarinaDebitAt: action.payload.lastMarinaDebitAt,
        credits: state.credits + action.payload.creditsGained,
        followers: state.followers + action.payload.followersGained,
        tokens: state.tokens + action.payload.tokensGained,
        currentRouteId: action.payload.nextRouteId,
        captainXp: state.captainXp + action.payload.captainXpGained,
        activeStoryHook: action.payload.activeStoryHook,
        pendingDecisionId: null,
        icerikSubTab: action.payload.icerikSubTab,
        step: action.payload.step,
        activeTab: action.payload.activeTab,
      };

    case "VOYAGE/ADVANCE_DAY": {
      const {
        energyDrop,
        waterDrop,
        fuelDrop,
        conditionDrop,
        eventText,
        newDaysRemaining,
        followersGained = 0,
        creditsGained = 0,
        nextStep,
      } = action.payload;
      return {
        ...state,
        energy: Math.max(0, state.energy - energyDrop),
        water: Math.max(0, state.water - waterDrop),
        fuel: Math.max(0, state.fuel - fuelDrop),
        boatCondition: Math.max(0, state.boatCondition - conditionDrop),
        voyageDaysRemaining: newDaysRemaining,
        followers: state.followers + followersGained,
        credits: state.credits + creditsGained,
        logs: eventText ? [eventText, ...state.logs].slice(0, MAX_LOGS) : state.logs,
        step: nextStep ?? state.step,
      };
    }

    case "VOYAGE/SET_SEA_EVENT":
      return { ...state, currentSeaEvent: action.payload };
    case "VOYAGE/SET_PENDING_DECISION":
      return { ...state, pendingDecisionId: action.payload };
    case "VOYAGE/CLEAR_DECISION":
      return { ...state, pendingDecisionId: null, currentSeaEvent: "" };
    case "VOYAGE/SET_FIRST_EVENT_TRIGGERED":
      return { ...state, firstVoyageEventTriggered: true };

    // ── Content ───────────────────────────────────────────────────────────────
    case "CONTENT/PUBLISH": {
      const {
        platformId,
        contentType,
        result,
        historyEntry,
        creditsGained,
        followersGained,
        captainXpGained,
        brandTrustGained,
        sponsorObligationUpdates,
        updatedStoryHook,
        timestamp,
        updatedDailyGoals,
        updatedMarinaTasks,
      } = action.payload;
      // Apply obligation deltas and compute 5-content milestone bonuses
      const nextObligations = { ...state.sponsorObligations };
      let milestoneCredits = 0;
      let milestoneBrandTrust = 0;
      for (const [name, delta] of Object.entries(sponsorObligationUpdates)) {
        const prev = nextObligations[name] ?? 0;
        const next = prev + delta;
        nextObligations[name] = next;
        if (prev < 5 && next >= 5) {
          milestoneCredits += 500;
          milestoneBrandTrust += 5;
        }
      }
      return {
        ...state,
        selectedPlatformId: platformId,
        selectedContentType: contentType,
        contentResult: result,
        contentHistory: [historyEntry, ...state.contentHistory].slice(0, 50),
        credits: state.credits + creditsGained + milestoneCredits,
        followers: state.followers + followersGained,
        captainXp: state.captainXp + captainXpGained,
        brandTrust: Math.min(100, state.brandTrust + brandTrustGained + milestoneBrandTrust),
        sponsorObligations: nextObligations,
        activeStoryHook: updatedStoryHook,
        lastContentAt: timestamp,
        firstContentDone: true,
        totalContentProduced: state.totalContentProduced + 1,
        dailyGoals: updatedDailyGoals,
        marinaTasks: updatedMarinaTasks,
      };
    }

    case "CONTENT/SET_PLATFORM":
      return { ...state, selectedPlatformId: action.payload };
    case "CONTENT/SET_TYPE":
      return { ...state, selectedContentType: action.payload };
    case "CONTENT/SET_RESULT":
      return { ...state, contentResult: action.payload };
    case "CONTENT/SET_SUB_TAB":
      return { ...state, icerikSubTab: action.payload };
    case "CONTENT/SET_STORY_HOOK":
      return { ...state, activeStoryHook: action.payload };

    // ── Upgrades ──────────────────────────────────────────────────────────────
    case "UPGRADES/START_INSTALL":
      return {
        ...state,
        credits: state.credits - action.payload.creditsCost,
        upgradesInProgress: [...state.upgradesInProgress, action.payload.installItem],
        dailyGoals: action.payload.updatedDailyGoals,
        marinaTasks: action.payload.updatedMarinaTasks,
      };

    case "UPGRADES/COMPLETE_INSTALL":
      return {
        ...state,
        upgradesInProgress: state.upgradesInProgress.filter(
          (u) => u.upgradeId !== action.payload.upgradeId
        ),
        purchasedUpgradeIds: [...state.purchasedUpgradeIds, action.payload.upgradeId],
      };

    case "UPGRADES/SET_CATEGORY":
      return { ...state, selectedUpgradeCategory: action.payload };

    // ── Marina ────────────────────────────────────────────────────────────────
    case "MARINA/START_REST":
      return { ...state, marinaRestInProgress: action.payload };

    case "MARINA/COMPLETE_REST":
      return {
        ...state,
        marinaRestInProgress: null,
        energy: Math.min(100, state.energy + 30),
        water: Math.min(100, state.water + 30),
        fuel: Math.min(100, state.fuel + 20),
        boatCondition: Math.min(100, state.boatCondition + 10),
      };

    case "MARINA/REFRESH_TASKS":
      return {
        ...state,
        marinaTasks: action.payload.tasks,
        lastMarinaTasksLocation: action.payload.location,
      };

    case "MARINA/APPLY_DEBIT":
      return {
        ...state,
        credits: Math.max(0, state.credits - action.payload.debit),
        lastMarinaDebitAt: action.payload.now,
      };

    case "MARINA/COMPLETE_TASK":
      return {
        ...state,
        credits: state.credits + action.payload.creditsReward,
        marinaTasks: state.marinaTasks.map((t) =>
          t.id === action.payload.taskId ? { ...t, completed: true } : t
        ),
      };

    // ── Sponsors ──────────────────────────────────────────────────────────────
    case "SPONSORS/SET_OFFERS":
      return { ...state, sponsorOffers: action.payload };

    case "SPONSORS/ACCEPT":
      return {
        ...state,
        sponsorOffers: state.sponsorOffers.filter((o) => o.id !== action.payload.offerId),
        acceptedSponsors: [...state.acceptedSponsors, action.payload.sponsorName],
        credits: state.credits + action.payload.creditsGained,
        tokens: state.tokens + action.payload.tokenGained,
        brandTrust: action.payload.newBrandTrust,
        sponsoredContentCount: action.payload.newSponsoredCount,
      };

    case "SPONSORS/SET_RECEIVED_FIRST":
      return { ...state, hasReceivedFirstSponsor: true };

    // ── Captain ───────────────────────────────────────────────────────────────
    case "CAPTAIN/XP_CHANGED": {
      const { newLevel, creditBonus, tokenBonus, logMessage } = action.payload;
      return {
        ...state,
        captainLevel: newLevel,
        credits: state.credits + creditBonus,
        tokens: state.tokens + tokenBonus,
        logs: logMessage ? [logMessage, ...state.logs].slice(0, MAX_LOGS) : state.logs,
      };
    }

    case "CAPTAIN/DAILY_RESET":
      return {
        ...state,
        lastDailyReset: action.payload.today,
        dailyGoals: action.payload.newGoals,
        dailyRewardClaimed: false,
      };

    case "CAPTAIN/DAILY_GOALS_COMPLETED":
      return {
        ...state,
        credits: state.credits + action.payload.creditsReward,
        tokens: state.tokens + action.payload.tokensReward,
        dailyRewardClaimed: true,
        hasCompletedDailyGoalsOnce: true,
      };

    case "CAPTAIN/LOGIN_BONUS": {
      const { newStreak, bonusDate, creditsBonus, xpBonus, logMessage } = action.payload;
      return {
        ...state,
        loginStreak: newStreak,
        lastLoginBonus: bonusDate,
        credits: state.credits + creditsBonus,
        captainXp: state.captainXp + xpBonus,
        logs: logMessage ? [logMessage, ...state.logs].slice(0, MAX_LOGS) : state.logs,
      };
    }

    case "CAPTAIN/COMPLETE_GOAL":
      return {
        ...state,
        dailyGoals: state.dailyGoals.map((g) =>
          g.id === action.payload ? { ...g, completed: true } : g
        ),
      };

    case "CAPTAIN/ADD_XP":
      return { ...state, captainXp: state.captainXp + action.payload };

    // ── Progress ──────────────────────────────────────────────────────────────
    case "PROGRESS/MILESTONE_REACHED":
      return { ...state, completedFollowerMilestones: action.payload };

    // ── Ads ───────────────────────────────────────────────────────────────────
    case "AD/RECORD_WATCH": {
      const { featureId, dateKey } = action.payload;
      const byDate = state.adWatchesByFeatureByDate[featureId] ?? {};
      return {
        ...state,
        adWatchesByFeatureByDate: {
          ...state.adWatchesByFeatureByDate,
          [featureId]: { ...byDate, [dateKey]: (byDate[dateKey] ?? 0) + 1 },
        },
      };
    }

    case "AD/APPLY_REWARD":
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
