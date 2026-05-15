import type {
  AdRewardConfig,
  AdRewardFeatureId,
  AdWatchesByFeatureByDate,
  RewardedAdUiHook,
} from "../types/ads";

export interface RewardedAdEligibilityContext {
  nowMs: number;
  sessionStartedAtMs: number;
  timerActive: boolean;
  pendingDecisionId: string | null;
  hasCriticalResourceWarning: boolean;
}

export function getRewardedAdWatchCount(
  watches: AdWatchesByFeatureByDate,
  featureId: AdRewardFeatureId,
  dateKey: string,
): number {
  return Math.max(0, Math.floor(Number(watches[featureId]?.[dateKey] ?? 0) || 0));
}

export function getRewardedAdDateKey(nowMs: number): string {
  return new Date(nowMs).toISOString().slice(0, 10);
}

export function buildRewardedAdUiHook(
  config: AdRewardConfig,
  watches: AdWatchesByFeatureByDate,
  context: RewardedAdEligibilityContext,
): RewardedAdUiHook | null {
  if (!context.timerActive) return null;
  if (context.pendingDecisionId) return null;
  if (context.hasCriticalResourceWarning) return null;
  if (context.nowMs - context.sessionStartedAtMs < 5 * 60_000) return null;

  const dateKey = getRewardedAdDateKey(context.nowMs);
  const usedToday = getRewardedAdWatchCount(watches, config.featureId, dateKey);
  const remainingToday = Math.max(0, config.dailyLimit - usedToday);

  return {
    featureId: config.featureId,
    label: config.label,
    description: config.description,
    remainingToday,
    dailyLimit: config.dailyLimit,
    available: config.enabled && remainingToday > 0,
    statusText: !config.enabled
      ? "Odullu reklam yakinda"
      : remainingToday > 0
        ? `Bugun ${remainingToday}/${config.dailyLimit} hak kaldi`
        : "Gunluk reklam hakki doldu",
  };
}
