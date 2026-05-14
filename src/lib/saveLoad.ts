import { BOAT_UPGRADES } from "../../game-data/upgrades";
import { WORLD_ROUTES } from "../../game-data/routes";

export const SAVE_KEY = "yelkenli_save";
export const SAVE_VERSION = 2;
export const MAX_OFFLINE_MINUTES = 480;
export const MAX_OFFLINE_REWARD_MINUTES = 120;
export const OFFLINE_CREDITS_PER_MINUTE = 15;
export const OFFLINE_FOLLOWERS_PER_MINUTE = 1;

export type UpgradeInProgressItem = {
  upgradeId: string;
  completesAt: number;
  startedAt: number;
  durationMs: number;
  slot: 0 | 1 | 2;
};

export type MarinaRestInProgress = {
  startedAt: number;
  completesAt: number;
  durationMs: number;
};

const MAX_PARALLEL_UPGRADES = 3;

export function migrateSave(parsed: any) {
  if (!parsed || typeof parsed !== "object") return null;

  const version = parsed.saveVersion ?? 1;

  if (version === 1) {
    const dailyGoalsCompleted =
      Array.isArray(parsed.dailyGoals) &&
      parsed.dailyGoals.length > 0 &&
      parsed.dailyGoals.every((goal: any) => goal?.completed);

    return {
      ...parsed,
      saveVersion: SAVE_VERSION,
      hasSave: parsed.hasSave ?? true,
      totalContentProduced: parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0),
      hasCompletedDailyGoalsOnce:
        parsed.hasCompletedDailyGoalsOnce ?? Boolean(dailyGoalsCompleted && parsed.dailyRewardClaimed),
    };
  }

  if (version === SAVE_VERSION) {
    return {
      ...parsed,
      hasSave: parsed.hasSave ?? true,
      totalContentProduced: parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0),
      hasCompletedDailyGoalsOnce: parsed.hasCompletedDailyGoalsOnce ?? false,
    };
  }

  return null;
}

export function calculateOfflineIncome(lastSavedAt: unknown): { credits: number; followers: number; minutes: number } {
  if (typeof lastSavedAt !== "number" || !Number.isFinite(lastSavedAt)) {
    return { credits: 0, followers: 0, minutes: 0 };
  }
  const offlineMs = Math.max(0, Date.now() - lastSavedAt);
  const cappedMinutes = Math.min(Math.floor(offlineMs / 60000), MAX_OFFLINE_MINUTES);
  const minutes = Math.min(cappedMinutes, MAX_OFFLINE_REWARD_MINUTES);
  return {
    minutes,
    credits: Math.max(0, minutes * OFFLINE_CREDITS_PER_MINUTE),
    followers: Math.max(0, minutes * OFFLINE_FOLLOWERS_PER_MINUTE),
  };
}

export type ProcessedUpgrades = {
  purchasedUpgradeIds: string[];
  upgradesInProgress: UpgradeInProgressItem[];
  completedUpgradeObjects: typeof BOAT_UPGRADES;
};

export function processUpgradesFromSave(
  savedUpgradesInProgress: unknown,
  savedUpgradeInProgress: unknown,
  savedPurchasedUpgradeIds: string[],
): ProcessedUpgrades {
  let purchasedIds = [...savedPurchasedUpgradeIds];
  const nextUpgradesInProgress: UpgradeInProgressItem[] = [];
  const completedUpgradeIds: string[] = [];
  const usedSlots = new Set<number>();

  const isValidUpgradeId = (id: string) => BOAT_UPGRADES.some((u) => u.id === id);

  const registerUpgrade = (rawItem: unknown, fallbackSlot: 0 | 1 | 2) => {
    if (!rawItem || typeof rawItem !== "object") return;
    const item = rawItem as Partial<UpgradeInProgressItem> & { upgradeId?: unknown; completesAt?: unknown };
    if (typeof item.upgradeId !== "string" || !isValidUpgradeId(item.upgradeId)) return;
    if (purchasedIds.includes(item.upgradeId)) return;
    if (nextUpgradesInProgress.some((e) => e.upgradeId === item.upgradeId)) return;
    if (typeof item.completesAt !== "number" || !Number.isFinite(item.completesAt)) return;

    if (item.completesAt <= Date.now()) {
      completedUpgradeIds.push(item.upgradeId);
      return;
    }

    let slot = fallbackSlot;
    if (typeof item.slot === "number" && item.slot >= 0 && item.slot < MAX_PARALLEL_UPGRADES && !usedSlots.has(item.slot)) {
      slot = item.slot as 0 | 1 | 2;
    } else {
      const nextSlot = ([0, 1, 2] as const).find((c) => !usedSlots.has(c));
      if (nextSlot === undefined) return;
      slot = nextSlot;
    }

    const startedAt =
      typeof item.startedAt === "number" && Number.isFinite(item.startedAt)
        ? item.startedAt
        : Math.min(Date.now(), item.completesAt);
    const durationMs =
      typeof item.durationMs === "number" && Number.isFinite(item.durationMs)
        ? item.durationMs
        : Math.max(0, item.completesAt - startedAt);

    usedSlots.add(slot);
    nextUpgradesInProgress.push({ upgradeId: item.upgradeId, completesAt: item.completesAt, startedAt, durationMs, slot });
  };

  if (Array.isArray(savedUpgradesInProgress)) {
    savedUpgradesInProgress.forEach((item: unknown, i: number) => {
      registerUpgrade(item, (i < MAX_PARALLEL_UPGRADES ? i : 0) as 0 | 1 | 2);
    });
  } else if (savedUpgradeInProgress) {
    registerUpgrade(savedUpgradeInProgress, 0);
  }

  const completedUpgradeObjects = [...new Set(completedUpgradeIds)]
    .map((id) => BOAT_UPGRADES.find((u) => u.id === id))
    .filter(Boolean) as typeof BOAT_UPGRADES;

  completedUpgradeObjects.forEach((upgrade) => {
    if (!purchasedIds.includes(upgrade.id)) purchasedIds = [...purchasedIds, upgrade.id];
  });

  return { purchasedUpgradeIds: purchasedIds, upgradesInProgress: nextUpgradesInProgress, completedUpgradeObjects };
}

export type ProcessedMarinaRest = {
  marinaRest: MarinaRestInProgress | null;
  completedOffline: boolean;
};

export function processMarinaRestFromSave(savedMarinaRest: unknown): ProcessedMarinaRest {
  if (!savedMarinaRest || typeof savedMarinaRest !== "object") {
    return { marinaRest: null, completedOffline: false };
  }
  const raw = savedMarinaRest as { startedAt?: unknown; completesAt?: unknown; durationMs?: unknown };
  const startedAt = typeof raw.startedAt === "number" && Number.isFinite(raw.startedAt) ? raw.startedAt : Date.now();
  const completesAt = typeof raw.completesAt === "number" && Number.isFinite(raw.completesAt) ? raw.completesAt : NaN;
  const durationMs = typeof raw.durationMs === "number" && Number.isFinite(raw.durationMs)
    ? raw.durationMs
    : Math.max(0, completesAt - startedAt);

  if (!Number.isFinite(completesAt)) return { marinaRest: null, completedOffline: false };
  if (completesAt <= Date.now()) return { marinaRest: null, completedOffline: true };
  return { marinaRest: { startedAt, completesAt, durationMs }, completedOffline: false };
}

export function buildOfflineMessages(
  offlineCredits: number,
  offlineFollowers: number,
  completedUpgradeObjects: typeof BOAT_UPGRADES,
  marinaRestCompletedOffline: boolean,
): { messages: string[]; nextSeaEvent: string } {
  const passiveMsg =
    offlineCredits > 0 || offlineFollowers > 0
      ? `Sen yokken içeriklerin izlenmeye devam etti: +${offlineCredits.toLocaleString("tr-TR")} TL, +${offlineFollowers.toLocaleString("tr-TR")} takipçi.`
      : "";
  const installMsg =
    completedUpgradeObjects.length > 0
      ? completedUpgradeObjects.length === 1
        ? `Kurulum tamamlandı: ${completedUpgradeObjects[0].name} aktif edildi.`
        : `${completedUpgradeObjects.length} upgrade tamamlandı: ${completedUpgradeObjects.map((u) => u.name).join(", ")}.`
      : "";
  const marinaMsg = marinaRestCompletedOffline
    ? "Marina dinlenme hizmeti siz yokken tamamlandı. Kaynaklar toplandı."
    : "";

  const messages = [installMsg, marinaMsg, passiveMsg].filter(Boolean);
  const nextSeaEvent = installMsg || marinaMsg || passiveMsg;
  return { messages, nextSeaEvent };
}

export function safeLoadStep(parsed: any): "HUB" | "SEA_MODE" | "ARRIVAL_SCREEN" {
  const safeStep = parsed.step && ["HUB", "SEA_MODE", "ARRIVAL_SCREEN"].includes(parsed.step) ? parsed.step : "HUB";
  const routeValid = WORLD_ROUTES.some((r) => r.id === parsed.currentRouteId);
  return safeStep === "SEA_MODE" && !routeValid ? "HUB" : safeStep;
}
