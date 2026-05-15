import { describe, expect, it } from "vitest";
import {
  DAILY_GOALS_TOKEN_BONUS,
  getRouteCompletionTokenReward,
  getSponsorAcceptTokenReward,
} from "../game-data/economy";
import { getAchievementTokenReward } from "../src/data/achievements";
import { CAPTAIN_LEVEL_TWO_TOKEN_REWARD, getCaptainLevelTokenReward } from "../src/data/captainData";

describe("token reward helpers", () => {
  it("returns the expected captain level token rewards", () => {
    expect(getCaptainLevelTokenReward(1)).toBe(0);
    expect(getCaptainLevelTokenReward(2)).toBe(CAPTAIN_LEVEL_TWO_TOKEN_REWARD);
    expect(getCaptainLevelTokenReward(3)).toBe(2);
    expect(getCaptainLevelTokenReward(10)).toBe(2);
  });

  it("maps route orders to the accepted token ranges", () => {
    expect(getRouteCompletionTokenReward(1)).toBe(1);
    expect(getRouteCompletionTokenReward(8)).toBe(1);
    expect(getRouteCompletionTokenReward(9)).toBe(2);
    expect(getRouteCompletionTokenReward(14)).toBe(2);
    expect(getRouteCompletionTokenReward(15)).toBe(3);
    expect(getRouteCompletionTokenReward(17)).toBe(3);
  });

  it("maps sponsor tiers to token rewards", () => {
    expect(getSponsorAcceptTokenReward("micro")).toBe(1);
    expect(getSponsorAcceptTokenReward("small")).toBe(1);
    expect(getSponsorAcceptTokenReward("medium")).toBe(2);
    expect(getSponsorAcceptTokenReward("large")).toBe(2);
    expect(getSponsorAcceptTokenReward("global")).toBe(3);
  });

  it("exposes achievement and daily token rewards", () => {
    expect(DAILY_GOALS_TOKEN_BONUS).toBe(3);
    expect(getAchievementTokenReward("first_route")).toBe(1);
    expect(getAchievementTokenReward("locked_in")).toBe(2);
    expect(getAchievementTokenReward("world_tour_done")).toBe(5);
    expect(getAchievementTokenReward("missing")).toBe(0);
  });
});
