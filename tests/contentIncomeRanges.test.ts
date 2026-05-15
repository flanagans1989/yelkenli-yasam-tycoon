import { describe, expect, it } from "vitest";
import {
  CONTENT_INCOME_RANGES,
  calculateContentRewardsDeterministic,
  getContentViralChance,
} from "../game-data/economy";
import { calculateContentRewards } from "../src/lib/gameLogic";

describe("content income reconciliation", () => {
  it("keeps q=40 / q=70 / q=100 outputs aligned with the runtime formula", () => {
    expect(
      calculateContentRewardsDeterministic({
        quality: 40,
        platformId: "viewTube",
      }),
    ).toEqual({ followers: 200, credits: 444 });

    expect(
      calculateContentRewardsDeterministic({
        quality: 70,
        platformId: "viewTube",
      }),
    ).toEqual({ followers: 350, credits: 966 });

    expect(
      calculateContentRewardsDeterministic({
        quality: 100,
        platformId: "viewTube",
      }),
    ).toEqual({ followers: 500, credits: 1650 });
  });

  it("keeps runtime reward execution aligned with the deterministic helper", () => {
    const originalRandom = Math.random;
    Math.random = () => 0.99;

    try {
      expect(
        calculateContentRewards({
          quality: 40,
          platformId: "viewTube",
          storyFollowerBonusPct: 0,
          storyCreditBonusPct: 0,
        }),
      ).toEqual({ followers: 200, credits: 444, viral: false });

      expect(
        calculateContentRewards({
          quality: 70,
          platformId: "viewTube",
          storyFollowerBonusPct: 0,
          storyCreditBonusPct: 0,
        }),
      ).toEqual({ followers: 350, credits: 966, viral: false });

      expect(
        calculateContentRewards({
          quality: 100,
          platformId: "viewTube",
          storyFollowerBonusPct: 0,
          storyCreditBonusPct: 0,
        }),
      ).toEqual({ followers: 500, credits: 1650, viral: false });
    } finally {
      Math.random = originalRandom;
    }
  });

  it("derives reference income bands from the live runtime formula", () => {
    expect(CONTENT_INCOME_RANGES.map((range) => range.level)).toEqual([
      "small",
      "medium",
      "high",
      "viral",
    ]);

    expect(CONTENT_INCOME_RANGES[0]).toMatchObject({
      qualityRange: { min: 0, max: 39 },
      includesViralOutcome: false,
      incomeRange: { min: 0, max: 429 },
      followerRange: { min: 0, max: 351 },
    });

    expect(CONTENT_INCOME_RANGES[1]).toMatchObject({
      qualityRange: { min: 40, max: 69 },
      includesViralOutcome: false,
      incomeRange: { min: 236, max: 946 },
      followerRange: { min: 200, max: 621 },
    });

    expect(CONTENT_INCOME_RANGES[2]).toMatchObject({
      qualityRange: { min: 70, max: 100 },
      includesViralOutcome: false,
      incomeRange: { min: 515, max: 1650 },
      followerRange: { min: 350, max: 900 },
    });

    expect(CONTENT_INCOME_RANGES[3]).toMatchObject({
      qualityRange: { min: 40, max: 100 },
      includesViralOutcome: true,
      incomeRange: { min: 473, max: 3300 },
      followerRange: { min: 600, max: 2700 },
    });
  });

  it("keeps viral chance thresholds unchanged", () => {
    expect(getContentViralChance(39)).toBe(0);
    expect(getContentViralChance(40)).toBe(0.03);
    expect(getContentViralChance(70)).toBe(0.1);
    expect(getContentViralChance(85)).toBe(0.25);
  });
});
