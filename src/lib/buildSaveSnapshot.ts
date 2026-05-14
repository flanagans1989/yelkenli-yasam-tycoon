import type {
  Step,
  Tab,
  ContentResult,
  StoryHook,
  Gender,
  DailyGoal,
  ContentHistoryItem,
  MarinaTask,
} from "../types/game";
import type { UpgradeCategoryId } from "../../game-data/upgrades";
import type { UpgradeInProgressItem, MarinaRestInProgress } from "./saveLoad";
import { SAVE_VERSION } from "./saveLoad";

export interface GameSaveSnapshotInput {
  memberFullName: string;
  memberUsername: string;
  memberEmail: string;
  memberPassword: string;
  profileIndex: number;
  marinaIndex: number;
  boatIndex: number;
  boatName: string;
  credits: number;
  followers: number;
  firstContentDone: boolean;
  logs: string[];
  purchasedUpgradeIds: string[];
  upgradesInProgress: UpgradeInProgressItem[];
  step: Step;
  activeTab: Tab;
  currentLocationName: string;
  worldProgress: number;
  energy: number;
  water: number;
  fuel: number;
  boatCondition: number;
  currentRouteId: string;
  completedRouteIds: string[];
  voyageTotalDays: number;
  voyageDaysRemaining: number;
  currentSeaEvent: string;
  pendingDecisionId: string | null;
  selectedPlatformId: string | null;
  selectedContentType: string | null;
  contentResult: ContentResult | null;
  selectedUpgradeCategory: UpgradeCategoryId;
  brandTrust: number;
  sponsorOffers: any[];
  acceptedSponsors: string[];
  sponsoredContentCount: number;
  contentHistory: ContentHistoryItem[];
  icerikSubTab: "produce" | "sponsor";
  lastContentAt: number | null;
  marinaRestInProgress: MarinaRestInProgress | null;
  captainXp: number;
  captainLevel: number;
  dailyGoals: DailyGoal[];
  lastDailyReset: string;
  dailyRewardClaimed: boolean;
  totalContentProduced: number;
  hasCompletedDailyGoalsOnce: boolean;
  firstVoyageEventTriggered: boolean;
  testMode: boolean;
  hasReceivedFirstSponsor: boolean;
  activeStoryHook: StoryHook | null;
  tutorialStep: number;
  gender: Gender;
  completedFollowerMilestones: string[];
  sponsorObligations: Record<string, number>;
  loginStreak: number;
  lastLoginBonus: string;
  marinaTasks: MarinaTask[];
  lastMarinaTasksLocation: string;
  hasCompletedWorldTour: boolean;
}

export type GameSaveSnapshot = GameSaveSnapshotInput & {
  saveVersion: number;
  hasSave: true;
};

/**
 * Pure builder for the persisted save payload.
 *
 * Centralizing this is the whole point: adding a new persisted field becomes a
 * one-place change (the type + this function). TypeScript will flag missing
 * keys at the call site, so the previous saveObj-vs-dep-array drift is gone.
 */
export function buildSaveSnapshot(input: GameSaveSnapshotInput): GameSaveSnapshot {
  return {
    memberFullName: input.memberFullName,
    memberUsername: input.memberUsername,
    memberEmail: input.memberEmail,
    memberPassword: input.memberPassword,
    profileIndex: input.profileIndex,
    marinaIndex: input.marinaIndex,
    boatIndex: input.boatIndex,
    boatName: input.boatName,
    credits: input.credits,
    followers: input.followers,
    firstContentDone: input.firstContentDone,
    logs: input.logs,
    purchasedUpgradeIds: input.purchasedUpgradeIds,
    upgradesInProgress: input.upgradesInProgress,
    step: input.step,
    activeTab: input.activeTab,
    currentLocationName: input.currentLocationName,
    worldProgress: input.worldProgress,
    energy: input.energy,
    water: input.water,
    fuel: input.fuel,
    boatCondition: input.boatCondition,
    currentRouteId: input.currentRouteId,
    completedRouteIds: input.completedRouteIds,
    voyageTotalDays: input.voyageTotalDays,
    voyageDaysRemaining: input.voyageDaysRemaining,
    currentSeaEvent: input.currentSeaEvent,
    pendingDecisionId: input.pendingDecisionId,
    selectedPlatformId: input.selectedPlatformId,
    selectedContentType: input.selectedContentType,
    contentResult: input.contentResult,
    selectedUpgradeCategory: input.selectedUpgradeCategory,
    brandTrust: input.brandTrust,
    sponsorOffers: input.sponsorOffers,
    acceptedSponsors: input.acceptedSponsors,
    sponsoredContentCount: input.sponsoredContentCount,
    contentHistory: input.contentHistory,
    icerikSubTab: input.icerikSubTab,
    lastContentAt: input.lastContentAt,
    marinaRestInProgress: input.marinaRestInProgress,
    captainXp: input.captainXp,
    captainLevel: input.captainLevel,
    dailyGoals: input.dailyGoals,
    lastDailyReset: input.lastDailyReset,
    dailyRewardClaimed: input.dailyRewardClaimed,
    totalContentProduced: input.totalContentProduced,
    hasCompletedDailyGoalsOnce: input.hasCompletedDailyGoalsOnce,
    firstVoyageEventTriggered: input.firstVoyageEventTriggered,
    testMode: input.testMode,
    hasReceivedFirstSponsor: input.hasReceivedFirstSponsor,
    activeStoryHook: input.activeStoryHook,
    tutorialStep: input.tutorialStep,
    gender: input.gender,
    completedFollowerMilestones: input.completedFollowerMilestones,
    sponsorObligations: input.sponsorObligations,
    loginStreak: input.loginStreak,
    lastLoginBonus: input.lastLoginBonus,
    marinaTasks: input.marinaTasks,
    lastMarinaTasksLocation: input.lastMarinaTasksLocation,
    hasCompletedWorldTour: input.hasCompletedWorldTour,
    saveVersion: SAVE_VERSION,
    hasSave: true,
  };
}
