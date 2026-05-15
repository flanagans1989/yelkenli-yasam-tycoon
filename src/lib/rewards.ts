/**
 * Rewarded-ad and welcome-back bonus data model.
 * This is a placeholder module: the rewarded ad is simulated (no SDK).
 * Used to surface a "watch ad for 2× bonus" option after long offline periods.
 * Wired into App.tsx loadGame; does NOT block normal game flow.
 */

export type RewardedAdProvider = "stub" | "admob" | "applovin";

export type RewardedAdOffer = {
  id: string;
  multiplier: number;          // e.g. 2 = doubles the base reward
  provider: RewardedAdProvider;
  createdAt: number;
};

export type WelcomeBackBonus = {
  baseCredits: number;
  baseFollowers: number;
  offlineMinutes: number;
  /** Optional rewarded-ad offer attached to this bonus (if eligible). */
  adOffer?: RewardedAdOffer;
};

const WELCOME_BACK_OFFER_THRESHOLD_MIN = 60; // 1h+ offline triggers the welcome-back offer

export function makeWelcomeBackBonus(
  baseCredits: number,
  baseFollowers: number,
  offlineMinutes: number,
): WelcomeBackBonus | null {
  if (offlineMinutes < WELCOME_BACK_OFFER_THRESHOLD_MIN) return null;
  if (baseCredits <= 0 && baseFollowers <= 0) return null;
  return {
    baseCredits,
    baseFollowers,
    offlineMinutes,
    adOffer: {
      id: `wb_${Date.now()}`,
      multiplier: 2,
      provider: "stub",
      createdAt: Date.now(),
    },
  };
}

/**
 * Placeholder for rewarded-ad playback. Resolves with `true` shortly after call.
 * Real SDKs (AdMob/AppLovin) would replace this — the shape stays the same.
 */
export function simulateWatchRewardedAd(offer: RewardedAdOffer): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (import.meta.env.DEV) console.debug("[Rewards] Simulated ad watched:", offer.id);
      resolve(true);
    }, 250);
  });
}
