import { describe, expect, it } from "vitest";
import { BOAT_UPGRADES } from "../game-data/upgrades";
import {
  MAX_OFFLINE_REWARD_MINUTES,
  SAVE_VERSION,
  buildOfflineMessages,
  calculateOfflineIncome,
  classifySaveLoadFailure,
  computeChecksum,
  getSafeNow,
  migrateSave,
  processMarinaRestFromSave,
  processUpgradesFromSave,
  safeLoadStep,
  stripChecksum,
  validateSaveChecksum,
} from "../src/core/save/saveLoad";

describe("saveLoad helpers", () => {
  it("computes, validates, and strips checksums", () => {
    const payload = { credits: 123, followers: 456, hasSave: true };
    const withChecksum = { ...payload, _checksum: computeChecksum(payload) };

    expect(validateSaveChecksum(withChecksum)).toBe(true);
    expect(validateSaveChecksum({ ...withChecksum, credits: 999 })).toBe(false);
    expect(validateSaveChecksum({ credits: 1 })).toBe(false);
    expect(validateSaveChecksum(null)).toBe(false);
    expect(stripChecksum(withChecksum)).toEqual(payload);
    expect(stripChecksum("raw-save")).toBe("raw-save");
  });

  it("classifies syntax errors and falls back for unknown errors", () => {
    expect(classifySaveLoadFailure(new SyntaxError("bad json"))).toBe("invalid_json");
    expect(classifySaveLoadFailure(new Error("other"))).toBe("unknown_error");
  });

  it("migrates v1 saves, fills defaults, and strips sensitive fields", () => {
    const result = migrateSave({
      saveVersion: 1,
      firstContentDone: true,
      memberPassword: "secret",
      dailyGoals: [{ completed: true }, { completed: true }],
      dailyRewardClaimed: true,
    });

    expect(result).not.toBeNull();
    expect(result?.usedBestEffortFallback).toBe(false);
    expect(result?.save.saveVersion).toBe(SAVE_VERSION);
    expect(result?.save.totalContentProduced).toBe(1);
    expect(result?.save.hasCompletedDailyGoalsOnce).toBe(true);
    expect(result?.save.hasCompletedWorldTour).toBe(false);
    expect(result?.save.memberPassword).toBeUndefined();
  });

  it("preserves explicit token balances and defaults missing ones during migration", () => {
    const withTokens = migrateSave({
      saveVersion: SAVE_VERSION,
      tokens: 42,
      hasSave: true,
    });
    const withoutTokens = migrateSave({
      saveVersion: 1,
      hasSave: true,
    });

    expect(withTokens?.save.tokens).toBe(42);
    expect(withoutTokens?.save.tokens).toBeGreaterThan(0);
  });

  it("best-effort migrates future save versions but rejects invalid versions", () => {
    const future = migrateSave({
      saveVersion: SAVE_VERSION + 3,
      hasSave: true,
      firstContentDone: false,
      memberPassword: "secret",
    });

    expect(future).not.toBeNull();
    expect(future?.usedBestEffortFallback).toBe(true);
    expect(future?.save.saveVersion).toBe(SAVE_VERSION);
    expect(future?.save.memberPassword).toBeUndefined();

    expect(migrateSave({ saveVersion: 0 })).toBeNull();
    expect(migrateSave(null)).toBeNull();
  });

  it("applies defaults for current-version saves without overwriting explicit values", () => {
    const migrated = migrateSave({
      saveVersion: SAVE_VERSION,
      hasSave: false,
      totalContentProduced: 9,
      hasCompletedDailyGoalsOnce: true,
      hasCompletedWorldTour: true,
    });

    expect(migrated).not.toBeNull();
    expect(migrated?.usedBestEffortFallback).toBe(false);
    expect(migrated?.save.hasSave).toBe(false);
    expect(migrated?.save.totalContentProduced).toBe(9);
    expect(migrated?.save.hasCompletedDailyGoalsOnce).toBe(true);
    expect(migrated?.save.hasCompletedWorldTour).toBe(true);
  });

  it("calculates offline income with caps and sea-mode bypass", () => {
    const baseNow = getSafeNow();
    const sixtyOneMinutesAgo = baseNow - (61 * 60_000) - 1_000;
    const hugeOffline = baseNow - (999 * 60_000);

    const normal = calculateOfflineIncome(sixtyOneMinutesAgo, "HUB", 2);
    const capped = calculateOfflineIncome(hugeOffline, "HUB", 99, MAX_OFFLINE_REWARD_MINUTES);
    const seaMode = calculateOfflineIncome(sixtyOneMinutesAgo, "SEA_MODE", 2);

    expect(normal.minutes).toBe(61);
    expect(normal.credits).toBe(61 * 24);
    expect(normal.followers).toBe(61);

    expect(capped.minutes).toBe(MAX_OFFLINE_REWARD_MINUTES);
    expect(capped.credits).toBe(MAX_OFFLINE_REWARD_MINUTES * 100);
    expect(capped.followers).toBe(MAX_OFFLINE_REWARD_MINUTES * 5);

    expect(seaMode).toEqual({ credits: 0, followers: 0, minutes: 0 });
    expect(calculateOfflineIncome("bad", "HUB", 2)).toEqual({ credits: 0, followers: 0, minutes: 0 });
  });

  it("clamps offline income when timestamps or captain levels are out of range", () => {
    const futureSave = calculateOfflineIncome(getSafeNow() + 60_000, "HUB", -5);
    const lowLevel = calculateOfflineIncome(getSafeNow() - 60_000, "HUB", 0);

    expect(futureSave).toEqual({ credits: 0, followers: 0, minutes: 0 });
    expect(lowLevel.minutes).toBe(1);
    expect(lowLevel.credits).toBe(12);
    expect(lowLevel.followers).toBe(1);
  });

  it("processes upgrade completions and in-progress items safely", () => {
    const completedUpgrade = BOAT_UPGRADES[0];
    const activeUpgrade = BOAT_UPGRADES[1];
    const now = Date.now();

    const result = processUpgradesFromSave(
      [
        {
          upgradeId: completedUpgrade.id,
          completesAt: now - 1_000,
          startedAt: now - 10_000,
          durationMs: 9_000,
          slot: 0,
        },
        {
          upgradeId: activeUpgrade.id,
          completesAt: now + 60_000,
          startedAt: now,
          durationMs: 60_000,
          slot: 1,
        },
        {
          upgradeId: "invalid-upgrade",
          completesAt: now + 1_000,
        },
      ],
      null,
      [],
    );

    expect(result.purchasedUpgradeIds).toContain(completedUpgrade.id);
    expect(result.purchasedUpgradeIds).not.toContain(activeUpgrade.id);
    expect(result.upgradesInProgress).toHaveLength(1);
    expect(result.upgradesInProgress[0]?.upgradeId).toBe(activeUpgrade.id);
    expect(result.completedUpgradeObjects.map((upgrade) => upgrade.id)).toContain(completedUpgrade.id);
  });

  it("falls back through upgrade slots and single-item legacy saves", () => {
    const now = Date.now();
    const upgrades = BOAT_UPGRADES.slice(0, 4);

    const slotted = processUpgradesFromSave(
      upgrades.map((upgrade, index) => ({
        upgradeId: upgrade.id,
        completesAt: now + 60_000 + (index * 1_000),
        slot: 0,
      })),
      null,
      [upgrades[3].id],
    );

    expect(slotted.upgradesInProgress).toHaveLength(3);
    expect(slotted.upgradesInProgress.map((item) => item.slot)).toEqual([0, 1, 2]);
    expect(slotted.upgradesInProgress[0]?.startedAt).toBeLessThanOrEqual(slotted.upgradesInProgress[0]?.completesAt ?? 0);
    expect(slotted.upgradesInProgress[0]?.durationMs).toBeGreaterThanOrEqual(0);

    const legacySingle = processUpgradesFromSave(
      null,
      {
        upgradeId: upgrades[0].id,
        completesAt: now + 30_000,
      },
      [],
    );

    expect(legacySingle.upgradesInProgress).toHaveLength(1);
    expect(legacySingle.upgradesInProgress[0]?.slot).toBe(0);
  });

  it("processes marina rest saves for future and completed services", () => {
    const now = Date.now();

    const active = processMarinaRestFromSave({
      startedAt: now,
      completesAt: now + 60_000,
      durationMs: 60_000,
    });
    const completed = processMarinaRestFromSave({
      startedAt: now - 60_000,
      completesAt: now - 1_000,
      durationMs: 59_000,
    });

    expect(active.completedOffline).toBe(false);
    expect(active.marinaRest?.durationMs).toBe(60_000);
    expect(completed).toEqual({ marinaRest: null, completedOffline: true });
    expect(processMarinaRestFromSave(null)).toEqual({ marinaRest: null, completedOffline: false });
  });

  it("drops invalid marina rest saves and backfills duration when needed", () => {
    const now = Date.now();

    expect(processMarinaRestFromSave({ startedAt: now, completesAt: "soon" })).toEqual({
      marinaRest: null,
      completedOffline: false,
    });

    const repaired = processMarinaRestFromSave({
      startedAt: now - 15_000,
      completesAt: now + 45_000,
    });

    expect(repaired.completedOffline).toBe(false);
    expect(repaired.marinaRest?.durationMs).toBe(60_000);
  });

  it("builds offline messages and validates loaded steps", () => {
    const upgrade = BOAT_UPGRADES[0];
    const built = buildOfflineMessages(500, 20, [upgrade], true);

    expect(built.messages).toHaveLength(3);
    expect(built.nextSeaEvent).toContain(upgrade.name);
    expect(built.messages.join(" ")).toContain("500");

    expect(safeLoadStep({ step: "SEA_MODE", currentRouteId: "turkiye_start" })).toBe("SEA_MODE");
    expect(safeLoadStep({ step: "SEA_MODE", currentRouteId: "missing" })).toBe("HUB");
    expect(safeLoadStep({ step: "BOGUS", currentRouteId: "turkiye_start" })).toBe("HUB");
  });

  it("builds plural and empty offline message variants", () => {
    const upgrades = BOAT_UPGRADES.slice(0, 2);
    const plural = buildOfflineMessages(0, 0, upgrades, false);
    const empty = buildOfflineMessages(0, 0, [], false);

    expect(plural.messages).toHaveLength(1);
    expect(plural.nextSeaEvent).toContain("2 upgrade");
    expect(empty.messages).toEqual([]);
    expect(empty.nextSeaEvent).toBe("");
    expect(safeLoadStep({ step: "ARRIVAL_SCREEN", currentRouteId: "missing" })).toBe("ARRIVAL_SCREEN");
  });
});
