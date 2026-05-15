export type CurrencyKey = "credit" | "token";

export type IncomeSource =
  | "content"
  | "sponsor"
  | "route_reward"
  | "daily_task"
  | "marina_task"
  | "live_donation";

export type ExpenseSource =
  | "boat_purchase"
  | "marina_fee"
  | "maintenance"
  | "repair"
  | "upgrade"
  | "fuel"
  | "water"
  | "food"
  | "spare_parts"
  | "special_crossing";

export type SponsorTier =
  | "micro"
  | "small"
  | "medium"
  | "large"
  | "global";

export type CostLevel =
  | "very_low"
  | "low"
  | "low_medium"
  | "medium"
  | "medium_high"
  | "high"
  | "very_high";

export interface CurrencyDefinition {
  key: CurrencyKey;
  name: string;
  role: string;
  canBePurchased: boolean;
  description: string;
}

export interface StartingEconomy {
  startingCredits: number;
  startingTokens: number;
  followerGoal: number;
  oceanReadinessGoal: number;
}

export interface BoatPurchaseCost {
  boatId: "kirlangic_28" | "denizkusu_34" | "atlas_40";
  boatName: string;
  purchaseCost: number;
  difficultyFeeling: string;
}

export interface SponsorTierDefinition {
  tier: SponsorTier;
  name: string;
  minFollowers: number;
  minBrandTrust: number;
  rewardRange: {
    min: number;
    max: number;
  };
  description: string;
}

export interface ContentIncomeRange {
  level: "small" | "medium" | "high" | "viral";
  name: string;
  qualityRange: {
    min: number;
    max: number;
  };
  incomeRange: {
    min: number;
    max: number;
  };
  followerRange: {
    min: number;
    max: number;
  };
  includesViralOutcome: boolean;
  description: string;
}

export interface MarinaCostProfile {
  costLevel: CostLevel;
  dailyCostRange: {
    min: number;
    max: number;
  };
  description: string;
}

export interface BoatCostMultiplier {
  boatId: "kirlangic_28" | "denizkusu_34" | "atlas_40";
  marinaCostMultiplier: number;
  maintenanceCostMultiplier: number;
  repairCostMultiplier: number;
  description: string;
}

export interface TokenRule {
  action: string;
  allowed: boolean;
  description: string;
}

export const TOKEN_SPEEDUP_COST_CAP = 60;
export const DAILY_GOALS_TOKEN_BONUS = 3;

export const CURRENCIES: CurrencyDefinition[] = [
  {
    key: "credit",
    name: "Kredi",
    role: "Ana oyun içi para birimi",
    canBePurchased: false,
    description:
      "Oyuncunun içerik, sponsor, görev ve rota başarılarından kazandığı ana ilerleme parasıdır.",
  },
  {
    key: "token",
    name: "Token",
    role: "Hızlandırma ve kolaylık birimi",
    canBePurchased: true,
    description:
      "Başarı satın aldırmak yerine süre hızlandırma ve konfor kolaylığı sağlar.",
  },
];

export const STARTING_ECONOMY: StartingEconomy = {
  startingCredits: 150000,
  startingTokens: 25,
  followerGoal: 1000000,
  oceanReadinessGoal: 80,
};

export const CONTENT_PLATFORM_REWARD_MULTIPLIERS = {
  viewTube: { followers: 1.0, credits: 1.5 },
  clipTok: { followers: 1.8, credits: 0.8 },
  instaSea: { followers: 1.3, credits: 1.1 },
  facePort: { followers: 1.1, credits: 1.0 },
} as const;

export function getContentPlatformRewardMultipliers(platformId: string): {
  followers: number;
  credits: number;
} {
  return CONTENT_PLATFORM_REWARD_MULTIPLIERS[
    platformId as keyof typeof CONTENT_PLATFORM_REWARD_MULTIPLIERS
  ] ?? { followers: 1, credits: 1 };
}

export function getContentViralChance(quality: number): number {
  const safeQuality = Math.max(0, Math.min(100, Math.floor(quality)));
  if (safeQuality >= 85) return 0.25;
  if (safeQuality >= 70) return 0.10;
  if (safeQuality >= 40) return 0.03;
  return 0;
}

export function getBaseContentRewardForQuality(quality: number): {
  followers: number;
  credits: number;
} {
  const safeQuality = Math.max(
    0,
    Math.min(100, Number.isFinite(quality) ? quality : 0),
  );
  return {
    followers: safeQuality * 5,
    credits: Math.round(safeQuality * (5 + 0.06 * safeQuality)),
  };
}

export function calculateContentRewardsDeterministic(input: {
  quality: number;
  platformId: string;
  viral?: boolean;
  storyFollowerBonusPct?: number;
  storyCreditBonusPct?: number;
}): {
  followers: number;
  credits: number;
} {
  const { followers: baseFollowers, credits: baseCredits } =
    getBaseContentRewardForQuality(input.quality);
  const multipliers = getContentPlatformRewardMultipliers(input.platformId);

  let followers = baseFollowers * multipliers.followers;
  let credits = baseCredits * multipliers.credits;

  if (input.viral) {
    followers *= 3;
    credits *= 2;
  }
  if ((input.storyFollowerBonusPct ?? 0) > 0) {
    followers *= 1 + (input.storyFollowerBonusPct ?? 0) / 100;
  }
  if ((input.storyCreditBonusPct ?? 0) > 0) {
    credits *= 1 + (input.storyCreditBonusPct ?? 0) / 100;
  }

  return {
    followers: Math.floor(followers),
    credits: Math.floor(credits),
  };
}

export const BOAT_PURCHASE_COSTS: BoatPurchaseCost[] = [
  {
    boatId: "kirlangic_28",
    boatName: "Kırlangıç 28",
    purchaseCost: 35000,
    difficultyFeeling:
      "Ucuz alınır, oyuncuya bütçe bırakır ama bakım ve arıza baskısı yaratır.",
  },
  {
    boatId: "denizkusu_34",
    boatName: "Denizkuşu 34",
    purchaseCost: 60000,
    difficultyFeeling:
      "Dengeli başlangıç sağlar. Ne çok kolay ne çok zor hissettirir.",
  },
  {
    boatId: "atlas_40",
    boatName: "Atlas 40",
    purchaseCost: 85000,
    difficultyFeeling:
      "Güçlü başlatır ama oyuncuyu erken ekonomik baskıya sokar.",
  },
];

function buildContentIncomeRange(config: {
  level: ContentIncomeRange["level"];
  name: string;
  qualityRange: { min: number; max: number };
  includesViralOutcome: boolean;
  description: string;
}): ContentIncomeRange {
  const platformIds = Object.keys(CONTENT_PLATFORM_REWARD_MULTIPLIERS);
  const rewards = Array.from(
    { length: config.qualityRange.max - config.qualityRange.min + 1 },
    (_, index) => config.qualityRange.min + index,
  ).flatMap((quality) =>
    platformIds.map((platformId) =>
      calculateContentRewardsDeterministic({
        quality,
        platformId,
        viral: config.includesViralOutcome,
      }),
    ),
  );

  return {
    level: config.level,
    name: config.name,
    qualityRange: config.qualityRange,
    incomeRange: {
      min: Math.min(...rewards.map((reward) => reward.credits)),
      max: Math.max(...rewards.map((reward) => reward.credits)),
    },
    followerRange: {
      min: Math.min(...rewards.map((reward) => reward.followers)),
      max: Math.max(...rewards.map((reward) => reward.followers)),
    },
    includesViralOutcome: config.includesViralOutcome,
    description: config.description,
  };
}

// Reference-only economy metadata.
// These ranges are derived from the live runtime reward formula and platform multipliers.
// No UI currently renders them directly, but if they are surfaced later they should stay accurate.
export const CONTENT_INCOME_RANGES: ContentIncomeRange[] = [
  buildContentIncomeRange({
    level: "small",
    name: "Düşük Kalite İçerik",
    qualityRange: { min: 0, max: 39 },
    includesViralOutcome: false,
    description:
      "Kalite 0-39 arasındaki viral olmayan içeriklerin, platform çarpanları dahil referans gelir aralığı.",
  }),
  buildContentIncomeRange({
    level: "medium",
    name: "Orta Kalite İçerik",
    qualityRange: { min: 40, max: 69 },
    includesViralOutcome: false,
    description:
      "Kalite 40-69 arasındaki viral olmayan içeriklerin, platform çarpanları dahil referans gelir aralığı.",
  }),
  buildContentIncomeRange({
    level: "high",
    name: "Yüksek Kalite İçerik",
    qualityRange: { min: 70, max: 100 },
    includesViralOutcome: false,
    description:
      "Kalite 70-100 arasındaki viral olmayan içeriklerin, platform çarpanları dahil referans gelir aralığı.",
  }),
  buildContentIncomeRange({
    level: "viral",
    name: "Viral Patlama",
    qualityRange: { min: 40, max: 100 },
    includesViralOutcome: true,
    description:
      "Kalite 40+ içeriklerde oluşan viral sonuçların, iki kat kredi ve üç kat takipçi etkisiyle referans aralığı.",
  }),
];

export const SPONSOR_TIERS: SponsorTierDefinition[] = [
  {
    tier: "micro",
    name: "Mikro Sponsor",
    minFollowers: 800,
    minBrandTrust: 10,
    rewardRange: {
      min: 2000,
      max: 8000,
    },
    description:
      "Küçük ürün gönderimi, basit tanıtım veya yerel marka işbirliği.",
  },
  {
    tier: "small",
    name: "Küçük Sponsor",
    minFollowers: 8000,
    minBrandTrust: 20,
    rewardRange: {
      min: 8000,
      max: 25000,
    },
    description:
      "Küçük ekipman, marina hizmeti veya kısa sponsorlu içerik anlaşması.",
  },
  {
    tier: "medium",
    name: "Orta Sponsor",
    minFollowers: 100000,
    minBrandTrust: 35,
    rewardRange: {
      min: 25000,
      max: 80000,
    },
    description:
      "Daha ciddi marka işbirliği, ekipman desteği ve kampanya anlaşmaları.",
  },
  {
    tier: "large",
    name: "Büyük Sponsor",
    minFollowers: 300000,
    minBrandTrust: 55,
    rewardRange: {
      min: 80000,
      max: 250000,
    },
    description:
      "Yüksek görünürlüklü sponsor kampanyası ve güçlü gelir sıçraması.",
  },
  {
    tier: "global",
    name: "Global Sponsor",
    minFollowers: 750000,
    minBrandTrust: 75,
    rewardRange: {
      min: 250000,
      max: 750000,
    },
    description:
      "Dünya turu markası seviyesinde büyük sponsor anlaşması.",
  },
];

export const MARINA_COST_PROFILES: MarinaCostProfile[] = [
  {
    costLevel: "low",
    dailyCostRange: {
      min: 150,
      max: 400,
    },
    description: "Ekonomik marina veya düşük maliyetli bağlama alanı.",
  },
  {
    costLevel: "low_medium",
    dailyCostRange: {
      min: 400,
      max: 800,
    },
    description: "Başlangıç oyuncusu için erişilebilir marina seviyesi.",
  },
  {
    costLevel: "medium",
    dailyCostRange: {
      min: 800,
      max: 1500,
    },
    description: "Dengeli hizmet ve maliyet seviyesi.",
  },
  {
    costLevel: "medium_high",
    dailyCostRange: {
      min: 1500,
      max: 2500,
    },
    description: "Daha prestijli ve sosyal medya açısından güçlü marina.",
  },
  {
    costLevel: "high",
    dailyCostRange: {
      min: 2500,
      max: 4500,
    },
    description: "Premium marina, yüksek sponsor ve yüksek maliyet.",
  },
  {
    costLevel: "very_high",
    dailyCostRange: {
      min: 4500,
      max: 8000,
    },
    description: "Büyük şehir veya ultra premium marina maliyeti.",
  },
];

export const BOAT_COST_MULTIPLIERS: BoatCostMultiplier[] = [
  {
    boatId: "kirlangic_28",
    marinaCostMultiplier: 0.8,
    maintenanceCostMultiplier: 1.15,
    repairCostMultiplier: 1.1,
    description:
      "Küçük olduğu için marina maliyeti düşüktür ama eski olduğu için bakım ve tamir baskısı yüksektir.",
  },
  {
    boatId: "denizkusu_34",
    marinaCostMultiplier: 1,
    maintenanceCostMultiplier: 1,
    repairCostMultiplier: 1,
    description:
      "Dengeli tekne. Marina, bakım ve tamir maliyetlerinde standart kabul edilir.",
  },
  {
    boatId: "atlas_40",
    marinaCostMultiplier: 1.4,
    maintenanceCostMultiplier: 1.35,
    repairCostMultiplier: 1.45,
    description:
      "Büyük ve güçlüdür ama marina, bakım ve tamir maliyetleri yüksektir.",
  },
];

export const TOKEN_ALLOWED_RULES: TokenRule[] = [
  {
    action: "upgrade_speedup",
    allowed: true,
    description: "Upgrade süresi token ile hızlandırılabilir.",
  },
  {
    action: "maintenance_speedup",
    allowed: false,
    description: "Bakım için tokenlı hızlandırma şu anda aktif değildir.",
  },
  {
    action: "repair_speedup",
    allowed: false,
    description: "Tamir için tokenlı hızlandırma şu anda aktif değildir.",
  },
  {
    action: "content_cooldown_speedup",
    allowed: true,
    description: "Icerik cooldown suresi token ile kisaltilabilir.",
  },
  {
    action: "marina_rest_speedup",
    allowed: true,
    description: "Marina dinlenme suresi token ile hizlandirilabilir.",
  },
  {
    action: "emergency_energy",
    allowed: false,
    description: "Token ile dogrudan enerji satin alinamaz.",
  },
  {
    action: "emergency_water",
    allowed: false,
    description: "Token ile dogrudan su satin alinamaz.",
  },
  {
    action: "emergency_fuel",
    allowed: false,
    description: "Token ile dogrudan yakit satin alinamaz.",
  },
  {
    action: "buy_followers",
    allowed: false,
    description: "Takipçi doğrudan satın alınamaz.",
  },
  {
    action: "complete_world_tour",
    allowed: false,
    description: "Dünya turu token ile doğrudan tamamlanamaz.",
  },
  {
    action: "skip_ocean_requirements",
    allowed: false,
    description: "Okyanus hazırlık şartları token ile atlanamaz.",
  },
  {
    action: "guarantee_viral",
    allowed: false,
    description: "Viral başarı token ile garanti edilemez.",
  },
];

export function getBoatPurchaseCost(
  boatId: BoatPurchaseCost["boatId"]
): number {
  return (
    BOAT_PURCHASE_COSTS.find((boat) => boat.boatId === boatId)?.purchaseCost ??
    0
  );
}

export function getRemainingStartingCredits(
  boatId: BoatPurchaseCost["boatId"]
): number {
  return STARTING_ECONOMY.startingCredits - getBoatPurchaseCost(boatId);
}

export function getSponsorTierByFollowers(
  followers: number,
  brandTrust: number
): SponsorTierDefinition | undefined {
  return [...SPONSOR_TIERS]
    .reverse()
    .find(
      (tier) =>
        followers >= tier.minFollowers && brandTrust >= tier.minBrandTrust
    );
}

export function isTokenActionAllowed(action: string): boolean {
  return (
    TOKEN_ALLOWED_RULES.find((rule) => rule.action === action)?.allowed ??
    false
  );
}

export function getTokenSpeedupCost(
  remainingSeconds: number,
  cap: number = TOKEN_SPEEDUP_COST_CAP,
): number {
  const safeSeconds = Math.max(
    0,
    Number.isFinite(remainingSeconds) ? remainingSeconds : 0,
  );
  const cappedCost = Math.min(Math.max(1, cap), Math.ceil(safeSeconds / 60));
  return Math.max(1, cappedCost);
}

export function getRouteCompletionTokenReward(routeOrder: number): number {
  if (routeOrder >= 15) return 3;
  if (routeOrder >= 9) return 2;
  return 1;
}

export function getSponsorAcceptTokenReward(tierId: string): number {
  switch (tierId) {
    case "global":
      return 3;
    case "medium":
    case "large":
      return 2;
    case "micro":
    case "small":
    default:
      return 1;
  }
}

export function getAnchoredMarinaCostProfile(worldProgress: number): {
  tier: number;
  costLevel: CostLevel;
  dailyFee: number;
  isChargeable: boolean;
} {
  const normalizedProgress = Math.max(0, Math.min(100, worldProgress));
  const tierConfig =
    normalizedProgress >= 82
      ? { tier: 6, costLevel: "very_high" as const }
      : normalizedProgress >= 58
        ? { tier: 5, costLevel: "high" as const }
        : normalizedProgress >= 35
          ? { tier: 4, costLevel: "medium_high" as const }
          : { tier: 3, costLevel: "medium" as const };

  const profile = MARINA_COST_PROFILES.find(
    (item) => item.costLevel === tierConfig.costLevel,
  );
  const dailyFee = profile
    ? Math.round((profile.dailyCostRange.min + profile.dailyCostRange.max) / 2)
    : 0;

  return {
    tier: tierConfig.tier,
    costLevel: tierConfig.costLevel,
    dailyFee,
    isChargeable: tierConfig.tier >= 4 && dailyFee > 0,
  };
}

export function calculateProportionalMarinaDebit(
  lastMarinaDebitAt: unknown,
  now: number,
  worldProgress: number,
): {
  debit: number;
  elapsedMinutes: number;
  nextDebitAt: number;
  tier: number;
  costLevel: CostLevel;
  dailyFee: number;
  isChargeable: boolean;
} {
  const safeNow = Number.isFinite(now) ? now : Date.now();
  const profile = getAnchoredMarinaCostProfile(worldProgress);
  const safeLastDebitAt =
    typeof lastMarinaDebitAt === "number" && Number.isFinite(lastMarinaDebitAt)
      ? lastMarinaDebitAt
      : safeNow;
  const elapsedMs = Math.max(0, safeNow - safeLastDebitAt);
  const elapsedMinutes = elapsedMs / 60000;

  if (!profile.isChargeable || elapsedMs <= 0) {
    return {
      debit: 0,
      elapsedMinutes,
      nextDebitAt: profile.isChargeable ? safeLastDebitAt : safeNow,
      tier: profile.tier,
      costLevel: profile.costLevel,
      dailyFee: profile.dailyFee,
      isChargeable: profile.isChargeable,
    };
  }

  const rawDebit = profile.dailyFee * (elapsedMs / 86_400_000);
  const debit = Math.max(0, Math.floor(rawDebit));

  return {
    debit,
    elapsedMinutes,
    nextDebitAt: debit > 0 ? safeNow : safeLastDebitAt,
    tier: profile.tier,
    costLevel: profile.costLevel,
    dailyFee: profile.dailyFee,
    isChargeable: profile.isChargeable,
  };
}
