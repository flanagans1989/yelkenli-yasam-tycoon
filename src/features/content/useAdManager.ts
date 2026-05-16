import { useMemo } from "react";
import type { Dispatch } from "react";
import { REWARDED_AD_CONFIGS } from "../../data/adRewards";
import { getContentCooldownMs } from "../../data/captainData";
import type { GameAction } from "../../core/state/gameActions";
import type { GameState } from "../../core/state/gameReducer";
import type { AdRewardFeatureId, RewardedAdUiHook } from "../../types/ads";
import { SESSION_START_REAL_MS, getSafeNow } from "../../core/save/saveLoad";
import { buildRewardedAdUiHook } from "../../lib/rewardedAds";
import { buildWelcomeBackAdHook, type OfflineRewardBundle } from "../../lib/welcomeBackRewards";

type PushToast = (
  type: "achievement" | "sponsor" | "voyage" | "content" | "warning" | "upgrade",
  title: string,
  text: string,
) => void;

export interface AdManagerResult {
  contentCooldownAdHook: RewardedAdUiHook | null;
  marinaRestAdHook: RewardedAdUiHook | null;
  welcomeBackAdHook: RewardedAdUiHook | null;
  buildRewardedTimerHook: (featureId: AdRewardFeatureId, timerActive: boolean) => RewardedAdUiHook | null;
  handleTriggerRewardedAdHook: (featureId: AdRewardFeatureId) => void;
}

export function useAdManager(
  gameState: GameState,
  dispatch: Dispatch<GameAction>,
  pushToast: PushToast,
  pendingWelcomeBackReward: OfflineRewardBundle | null = null,
): AdManagerResult {
  const rewardedAdConfigByFeature = useMemo(
    () => new Map(REWARDED_AD_CONFIGS.map((config) => [config.featureId, config])),
    [],
  );

  const hasCriticalResourceWarning =
    gameState.energy <= 20 ||
    gameState.water <= 20 ||
    gameState.fuel <= 20 ||
    gameState.boatCondition <= 20;

  const getContentCooldownRemainingMs = () => {
    if (!gameState.lastContentAt) return 0;
    const cooldownMs = getContentCooldownMs(gameState.captainLevel, gameState.testMode);
    return Math.max(0, cooldownMs - (Date.now() - gameState.lastContentAt));
  };

  const getMarinaRestRemainingMs = () => {
    if (!gameState.marinaRestInProgress) return 0;
    return Math.max(0, gameState.marinaRestInProgress.completesAt - Date.now());
  };

  const buildRewardedTimerHook = (
    featureId: AdRewardFeatureId,
    timerActive: boolean,
  ): RewardedAdUiHook | null => {
    const config = rewardedAdConfigByFeature.get(featureId);
    if (!config) return null;
    return buildRewardedAdUiHook(config, gameState.adWatchesByFeatureByDate, {
      nowMs: getSafeNow(),
      sessionStartedAtMs: SESSION_START_REAL_MS,
      timerActive,
      pendingDecisionId: gameState.pendingDecisionId,
      hasCriticalResourceWarning,
    });
  };

  const contentCooldownAdHook = buildRewardedTimerHook(
    "content_cooldown_skip",
    getContentCooldownRemainingMs() > 0,
  );
  const marinaRestAdHook = buildRewardedTimerHook(
    "marina_rest_skip",
    getMarinaRestRemainingMs() > 0,
  );
  const welcomeBackAdConfig = rewardedAdConfigByFeature.get("welcome_back_offline_bonus") ?? null;
  const welcomeBackAdHook =
    pendingWelcomeBackReward && welcomeBackAdConfig
      ? buildWelcomeBackAdHook(
          welcomeBackAdConfig,
          gameState.adWatchesByFeatureByDate,
          pendingWelcomeBackReward,
          getSafeNow(),
        )
      : null;

  const handleTriggerRewardedAdHook = (featureId: AdRewardFeatureId) => {
    const config = rewardedAdConfigByFeature.get(featureId);
    if (!config) return;
    const hook = buildRewardedTimerHook(featureId, true);
    const title = hook?.available ? "Odullu Reklam Hook'u Hazir" : "Odullu Reklam Yakinda";
    const text = hook?.available
      ? `${config.label} icin UI hook hazir. SDK entegrasyonu henuz kapali.`
      : hook?.statusText ?? `${config.label} icin reklam akisi henuz aktif degil.`;
    pushToast("content", title, text);
    dispatch({ type: "LOGS/ADD", payload: `Reklam hook kontrolu: ${config.featureId}. ${text}` });
  };

  return {
    contentCooldownAdHook,
    marinaRestAdHook,
    welcomeBackAdHook,
    buildRewardedTimerHook,
    handleTriggerRewardedAdHook,
  };
}


