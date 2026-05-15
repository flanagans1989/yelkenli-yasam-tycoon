import type {
  Step,
  Tab,
  ContentResult,
  StoryHook,
  DailyGoal,
  ContentHistoryItem,
  MarinaTask,
  SponsorOffer,
} from "../types/game";
import type { UpgradeCategoryId } from "../../game-data/upgrades";
import type { UpgradeInProgressItem, MarinaRestInProgress } from "../lib/saveLoad";
import type { AdWatchesByFeatureByDate } from "../types/ads";
import type { GameSaveSnapshotInput } from "../lib/buildSaveSnapshot";

// ── Full-state bulk ──────────────────────────────────────────────────────────
export type GameInitializeAction = { type: "GAME/INITIALIZE"; payload: GameSaveSnapshotInput };
export type GameLoadAction = { type: "GAME/LOAD"; payload: GameSaveSnapshotInput };

// ── Economy ──────────────────────────────────────────────────────────────────
export type EconomySetCreditsAction = { type: "ECONOMY/SET_CREDITS"; payload: number };
export type EconomyAddCreditsAction = { type: "ECONOMY/ADD_CREDITS"; payload: number };
export type EconomySetTokensAction = { type: "ECONOMY/SET_TOKENS"; payload: number };
export type EconomyAddTokensAction = { type: "ECONOMY/ADD_TOKENS"; payload: number };
export type EconomyAddFollowersAction = { type: "ECONOMY/ADD_FOLLOWERS"; payload: number };

// ── Logs ─────────────────────────────────────────────────────────────────────
export type LogsAddAction = { type: "LOGS/ADD"; payload: string };

// ── Resources ────────────────────────────────────────────────────────────────
export type ResourcesSetAction = {
  type: "RESOURCES/SET";
  payload: Partial<{ energy: number; water: number; fuel: number; boatCondition: number }>;
};

// ── Navigation ───────────────────────────────────────────────────────────────
export type NavigationSetStepAction = { type: "NAVIGATION/SET_STEP"; payload: Step };
export type NavigationSetTabAction = { type: "NAVIGATION/SET_TAB"; payload: Tab };
export type NavigationSetStepAndTabAction = {
  type: "NAVIGATION/SET_STEP_AND_TAB";
  payload: { step: Step; tab: Tab };
};
export type NavigationSetTutorialStepAction = { type: "NAVIGATION/SET_TUTORIAL_STEP"; payload: number };

// ── Voyage ───────────────────────────────────────────────────────────────────
export type VoyageStartAction = {
  type: "VOYAGE/START";
  payload: { routeId: string; locationName: string; totalDays: number; step: Step };
};
export type VoyageArriveAction = {
  type: "VOYAGE/ARRIVE";
  payload: {
    worldProgress: number;
    completedRouteIds: string[];
    hasCompletedWorldTour: boolean;
    currentLocationName: string;
    lastMarinaDebitAt: number;
    creditsGained: number;
    followersGained: number;
    tokensGained: number;
    nextRouteId: string;
    captainXpGained: number;
    activeStoryHook: StoryHook | null;
    step: Step;
    activeTab: Tab;
    icerikSubTab: "produce" | "sponsor";
  };
};
export type VoyageAdvanceDayAction = {
  type: "VOYAGE/ADVANCE_DAY";
  payload: {
    energyDrop: number;
    waterDrop: number;
    fuelDrop: number;
    conditionDrop: number;
    eventText: string;
    newDaysRemaining: number;
    followersGained?: number;
    creditsGained?: number;
    nextStep?: Step;
  };
};
export type VoyageSetSeaEventAction = { type: "VOYAGE/SET_SEA_EVENT"; payload: string };
export type VoyageSetPendingDecisionAction = {
  type: "VOYAGE/SET_PENDING_DECISION";
  payload: string | null;
};
export type VoyageClearDecisionAction = { type: "VOYAGE/CLEAR_DECISION" };

// ── Content ──────────────────────────────────────────────────────────────────
export type ContentPublishAction = {
  type: "CONTENT/PUBLISH";
  payload: {
    platformId: string;
    contentType: string;
    result: ContentResult;
    historyEntry: ContentHistoryItem;
    creditsGained: number;
    followersGained: number;
    captainXpGained: number;
    brandTrustGained: number;
    sponsorObligationUpdates: Record<string, number>;
    updatedStoryHook: StoryHook | null;
    timestamp: number;
    updatedDailyGoals: DailyGoal[];
    updatedMarinaTasks: MarinaTask[];
  };
};
export type ContentSetPlatformAction = { type: "CONTENT/SET_PLATFORM"; payload: string | null };
export type ContentSetTypeAction = { type: "CONTENT/SET_TYPE"; payload: string | null };
export type ContentSetResultAction = { type: "CONTENT/SET_RESULT"; payload: ContentResult | null };
export type ContentSetSubTabAction = {
  type: "CONTENT/SET_SUB_TAB";
  payload: "produce" | "sponsor";
};

// ── Upgrades ─────────────────────────────────────────────────────────────────
export type UpgradesStartInstallAction = {
  type: "UPGRADES/START_INSTALL";
  payload: {
    creditsCost: number;
    installItem: UpgradeInProgressItem;
    updatedDailyGoals: DailyGoal[];
    updatedMarinaTasks: MarinaTask[];
  };
};
export type UpgradesCompleteInstallAction = {
  type: "UPGRADES/COMPLETE_INSTALL";
  payload: { upgradeId: string };
};
export type UpgradesSetCategoryAction = { type: "UPGRADES/SET_CATEGORY"; payload: UpgradeCategoryId };

// ── Marina ───────────────────────────────────────────────────────────────────
export type MarinaStartRestAction = { type: "MARINA/START_REST"; payload: MarinaRestInProgress };
export type MarinaCompleteRestAction = { type: "MARINA/COMPLETE_REST" };
export type MarinaRefreshTasksAction = {
  type: "MARINA/REFRESH_TASKS";
  payload: { tasks: MarinaTask[]; location: string };
};
export type MarinaApplyDebitAction = {
  type: "MARINA/APPLY_DEBIT";
  payload: { debit: number; now: number };
};
export type MarinaCompleteTaskAction = {
  type: "MARINA/COMPLETE_TASK";
  payload: { taskId: string; creditsReward: number };
};

// ── Sponsors ─────────────────────────────────────────────────────────────────
export type SponsorsSetOffersAction = { type: "SPONSORS/SET_OFFERS"; payload: SponsorOffer[] };
export type SponsorsAcceptAction = {
  type: "SPONSORS/ACCEPT";
  payload: {
    offerId: string;
    sponsorName: string;
    creditsGained: number;
    tokenGained: number;
    newBrandTrust: number;
    newSponsoredCount: number;
  };
};
export type SponsorsSetReceivedFirstAction = { type: "SPONSORS/SET_RECEIVED_FIRST" };

// ── Captain ───────────────────────────────────────────────────────────────────
export type CaptainXpChangedAction = {
  type: "CAPTAIN/XP_CHANGED";
  payload: { newLevel: number; creditBonus: number; tokenBonus: number; logMessage: string };
};
export type CaptainDailyResetAction = {
  type: "CAPTAIN/DAILY_RESET";
  payload: { today: string; newGoals: DailyGoal[] };
};
export type CaptainDailyGoalsCompletedAction = {
  type: "CAPTAIN/DAILY_GOALS_COMPLETED";
  payload: { creditsReward: number; tokensReward: number };
};
export type CaptainLoginBonusAction = {
  type: "CAPTAIN/LOGIN_BONUS";
  payload: {
    newStreak: number;
    bonusDate: string;
    creditsBonus: number;
    xpBonus: number;
    logMessage: string;
  };
};
export type CaptainCompleteGoalAction = { type: "CAPTAIN/COMPLETE_GOAL"; payload: string };

// ── Progress ──────────────────────────────────────────────────────────────────
export type ProgressMilestoneReachedAction = {
  type: "PROGRESS/MILESTONE_REACHED";
  payload: string[];
};

// ── Ads ───────────────────────────────────────────────────────────────────────
export type AdRecordWatchAction = {
  type: "AD/RECORD_WATCH";
  payload: { featureId: string; dateKey: string };
};
export type AdApplyRewardAction = {
  type: "AD/APPLY_REWARD";
  payload: Partial<{
    energy: number;
    water: number;
    fuel: number;
    boatCondition: number;
    credits: number;
    followers: number;
    lastContentAt: null;
    marinaRestInProgress: null;
    adWatchesByFeatureByDate: AdWatchesByFeatureByDate;
  }>;
};

// ── Union ─────────────────────────────────────────────────────────────────────
export type GameAction =
  | GameInitializeAction
  | GameLoadAction
  | EconomySetCreditsAction
  | EconomyAddCreditsAction
  | EconomySetTokensAction
  | EconomyAddTokensAction
  | EconomyAddFollowersAction
  | LogsAddAction
  | ResourcesSetAction
  | NavigationSetStepAction
  | NavigationSetTabAction
  | NavigationSetStepAndTabAction
  | NavigationSetTutorialStepAction
  | VoyageStartAction
  | VoyageArriveAction
  | VoyageAdvanceDayAction
  | VoyageSetSeaEventAction
  | VoyageSetPendingDecisionAction
  | VoyageClearDecisionAction
  | ContentPublishAction
  | ContentSetPlatformAction
  | ContentSetTypeAction
  | ContentSetResultAction
  | ContentSetSubTabAction
  | UpgradesStartInstallAction
  | UpgradesCompleteInstallAction
  | UpgradesSetCategoryAction
  | MarinaStartRestAction
  | MarinaCompleteRestAction
  | MarinaRefreshTasksAction
  | MarinaApplyDebitAction
  | MarinaCompleteTaskAction
  | SponsorsSetOffersAction
  | SponsorsAcceptAction
  | SponsorsSetReceivedFirstAction
  | CaptainXpChangedAction
  | CaptainDailyResetAction
  | CaptainDailyGoalsCompletedAction
  | CaptainLoginBonusAction
  | CaptainCompleteGoalAction
  | ProgressMilestoneReachedAction
  | AdRecordWatchAction
  | AdApplyRewardAction;
