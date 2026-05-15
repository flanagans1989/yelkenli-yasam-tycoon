import { describe, expect, it } from "vitest";
import type { AdRewardConfig } from "../src/types/ads";
import {
  applyWelcomeBackRewardClaim,
  buildWelcomeBackAdHook,
} from "../src/lib/welcomeBackRewards";
import { calculateOfflineIncome } from "../src/lib/saveLoad";

const welcomeBackConfig: AdRewardConfig = {
  featureId: "welcome_back_offline_bonus",
  placement: "rewarded_video",
  rewardKind: "soft_currency",
  label: "Welcome Back Bonusu",
  description: "Offline donus bonusu",
  dailyLimit: 1,
  rewardAmount: 2,
  enabled: true,
};

describe("welcome back ad bonus loop", () => {
  it("keeps normal offline reward unchanged when ad bonus is skipped", () => {
    const result = applyWelcomeBackRewardClaim({
      reward: { credits: 120, followers: 8, minutes: 10 },
      watches: {},
      config: welcomeBackConfig,
      nowMs: Date.UTC(2026, 4, 15),
      withAdBonus: false,
    });

    expect(result.credits).toBe(120);
    expect(result.followers).toBe(8);
    expect(result.multiplier).toBe(1);
    expect(result.usedAdBonus).toBe(false);
    expect(result.updatedWatches).toEqual({});
  });

  it("doubles offline reward and increments the daily tracker when ad bonus is available", () => {
    const nowMs = Date.UTC(2026, 4, 15);
    const result = applyWelcomeBackRewardClaim({
      reward: { credits: 240, followers: 12, minutes: 20 },
      watches: {},
      config: welcomeBackConfig,
      nowMs,
      withAdBonus: true,
    });

    expect(result.credits).toBe(480);
    expect(result.followers).toBe(24);
    expect(result.multiplier).toBe(2);
    expect(result.usedAdBonus).toBe(true);
    expect(result.updatedWatches.welcome_back_offline_bonus?.["2026-05-15"]).toBe(1);
  });

  it("builds a placeholder ad hook and respects the daily limit", () => {
    const nowMs = Date.UTC(2026, 4, 15);
    const disabledConfig = { ...welcomeBackConfig, enabled: false };
    const hook = buildWelcomeBackAdHook(
      disabledConfig,
      {},
      { credits: 180, followers: 9, minutes: 15 },
      nowMs,
    );

    expect(hook?.available).toBe(false);
    expect(hook?.statusText.toLowerCase()).toContain("yakinda");

    const limitedResult = applyWelcomeBackRewardClaim({
      reward: { credits: 180, followers: 9, minutes: 15 },
      watches: {
        welcome_back_offline_bonus: {
          "2026-05-15": 1,
        },
      },
      config: welcomeBackConfig,
      nowMs,
      withAdBonus: true,
    });

    expect(limitedResult.usedAdBonus).toBe(false);
    expect(limitedResult.credits).toBe(180);
    expect(limitedResult.followers).toBe(9);
  });

  it("preserves the sea mode rule that blocks offline income", () => {
    const nowMs = Date.now();
    expect(calculateOfflineIncome(nowMs - 30 * 60_000, "SEA_MODE", 5)).toEqual({
      credits: 0,
      followers: 0,
      minutes: 0,
    });
  });
});
