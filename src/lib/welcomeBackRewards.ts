import type {
  AdRewardConfig,
  AdWatchesByFeatureByDate,
  RewardedAdUiHook,
} from "../types/ads";
import {
  buildRewardedAdUiHook,
  getRewardedAdDateKey,
  getRewardedAdWatchCount,
} from "./rewardedAds";

export interface OfflineRewardBundle {
  credits: number;
  followers: number;
  minutes: number;
}

export interface WelcomeBackRewardClaimResult {
  credits: number;
  followers: number;
  multiplier: number;
  usedAdBonus: boolean;
  updatedWatches: AdWatchesByFeatureByDate;
}

export function buildWelcomeBackAdHook(
  config: AdRewardConfig,
  watches: AdWatchesByFeatureByDate,
  reward: OfflineRewardBundle,
  nowMs: number,
): RewardedAdUiHook | null {
  if (reward.credits <= 0 && reward.followers <= 0) return null;

  return buildRewardedAdUiHook(config, watches, {
    nowMs,
    sessionStartedAtMs: nowMs - (6 * 60_000),
    timerActive: true,
    pendingDecisionId: null,
    hasCriticalResourceWarning: false,
  });
}

export function applyWelcomeBackRewardClaim(input: {
  reward: OfflineRewardBundle;
  watches: AdWatchesByFeatureByDate;
  config: AdRewardConfig;
  nowMs: number;
  withAdBonus: boolean;
}): WelcomeBackRewardClaimResult {
  const { reward, watches, config, nowMs, withAdBonus } = input;
  const safeReward = {
    credits: Math.max(0, Math.floor(reward.credits)),
    followers: Math.max(0, Math.floor(reward.followers)),
    minutes: Math.max(0, Math.floor(reward.minutes)),
  };

  if (!withAdBonus) {
    return {
      credits: safeReward.credits,
      followers: safeReward.followers,
      multiplier: 1,
      usedAdBonus: false,
      updatedWatches: watches,
    };
  }

  const dateKey = getRewardedAdDateKey(nowMs);
  const usedToday = getRewardedAdWatchCount(watches, config.featureId, dateKey);
  const canUseAdBonus = config.enabled && usedToday < config.dailyLimit;

  if (!canUseAdBonus) {
    return {
      credits: safeReward.credits,
      followers: safeReward.followers,
      multiplier: 1,
      usedAdBonus: false,
      updatedWatches: watches,
    };
  }

  return {
    credits: safeReward.credits * 2,
    followers: safeReward.followers * 2,
    multiplier: 2,
    usedAdBonus: true,
    updatedWatches: {
      ...watches,
      [config.featureId]: {
        ...(watches[config.featureId] ?? {}),
        [dateKey]: usedToday + 1,
      },
    },
  };
}
