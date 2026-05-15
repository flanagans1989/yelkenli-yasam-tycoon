import { describe, expect, it } from "vitest";
import { REWARDED_AD_CONFIGS } from "../src/data/adRewards";
import { buildRewardedAdUiHook } from "../src/lib/rewardedAds";

describe("rewarded ad UI hooks", () => {
  const contentCooldownConfig = REWARDED_AD_CONFIGS.find(
    (config) => config.featureId === "content_cooldown_skip",
  )!;
  const marinaRestConfig = REWARDED_AD_CONFIGS.find(
    (config) => config.featureId === "marina_rest_skip",
  )!;
  const upgradeConfig = REWARDED_AD_CONFIGS.find(
    (config) => config.featureId === "upgrade_install_skip",
  )!;

  it("does not suggest ads during the first five minutes", () => {
    const hook = buildRewardedAdUiHook(contentCooldownConfig, {}, {
      nowMs: 4 * 60_000,
      sessionStartedAtMs: 0,
      timerActive: true,
      pendingDecisionId: null,
      hasCriticalResourceWarning: false,
    });

    expect(hook).toBeNull();
  });

  it("does not suggest ads during sea decisions or critical warnings", () => {
    expect(
      buildRewardedAdUiHook(upgradeConfig, {}, {
        nowMs: 10 * 60_000,
        sessionStartedAtMs: 0,
        timerActive: true,
        pendingDecisionId: "storm_decision",
        hasCriticalResourceWarning: false,
      }),
    ).toBeNull();

    expect(
      buildRewardedAdUiHook(marinaRestConfig, {}, {
        nowMs: 10 * 60_000,
        sessionStartedAtMs: 0,
        timerActive: true,
        pendingDecisionId: null,
        hasCriticalResourceWarning: true,
      }),
    ).toBeNull();
  });

  it("builds placeholder hooks with daily limit tracking when a timer is eligible", () => {
    const hook = buildRewardedAdUiHook(
      contentCooldownConfig,
      {
        content_cooldown_skip: {
          "1970-01-01": 1,
        },
      },
      {
        nowMs: 10 * 60_000,
        sessionStartedAtMs: 0,
        timerActive: true,
        pendingDecisionId: null,
        hasCriticalResourceWarning: false,
      },
    );

    expect(hook).not.toBeNull();
    expect(hook?.featureId).toBe("content_cooldown_skip");
    expect(hook?.remainingToday).toBe(2);
    expect(hook?.dailyLimit).toBe(3);
    expect(hook?.available).toBe(false);
    expect(hook?.statusText).toContain("yakinda");
  });

  it("does not create hooks when the related timer is inactive", () => {
    const hook = buildRewardedAdUiHook(upgradeConfig, {}, {
      nowMs: 10 * 60_000,
      sessionStartedAtMs: 0,
      timerActive: false,
      pendingDecisionId: null,
      hasCriticalResourceWarning: false,
    });

    expect(hook).toBeNull();
  });
});
