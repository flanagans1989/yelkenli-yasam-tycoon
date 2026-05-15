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
  level: "small" | "medium" | "viral" | "major_viral";
  name: string;
  incomeRange: {
    min: number;
    max: number;
  };
  followerRange: {
    min: number;
    max: number;
  };
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
      "Başarı satın aldırmaz. Sadece süre hızlandırma, acil destek ve konfor kolaylığı sağlar.",
  },
];

export const STARTING_ECONOMY: StartingEconomy = {
  startingCredits: 150000,
  startingTokens: 25,
  followerGoal: 1000000,
  oceanReadinessGoal: 80,
};

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

export const CONTENT_INCOME_RANGES: ContentIncomeRange[] = [
  {
    level: "small",
    name: "Küçük İçerik",
    incomeRange: {
      min: 200,
      max: 1000,
    },
    followerRange: {
      min: 50,
      max: 800,
    },
    description:
      "Başlangıçta veya düşük kaliteli içeriklerde görülen küçük ama düzenli gelir.",
  },
  {
    level: "medium",
    name: "Orta İçerik",
    incomeRange: {
      min: 1000,
      max: 5000,
    },
    followerRange: {
      min: 800,
      max: 5000,
    },
    description:
      "İyi lokasyon, iyi platform uyumu ve yeterli ekipmanla gelen sağlıklı içerik sonucu.",
  },
  {
    level: "viral",
    name: "Viral İçerik",
    incomeRange: {
      min: 5000,
      max: 25000,
    },
    followerRange: {
      min: 5000,
      max: 50000,
    },
    description:
      "Risk, trend, lokasyon ve platform uyumu güçlü olduğunda gelen büyük sıçrama.",
  },
  {
    level: "major_viral",
    name: "Büyük Viral İçerik",
    incomeRange: {
      min: 25000,
      max: 100000,
    },
    followerRange: {
      min: 50000,
      max: 250000,
    },
    description:
      "Okyanus geçişi, fırtına, büyük kriz veya final gibi özel anlarda oluşabilecek büyük patlama.",
  },
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
    allowed: true,
    description: "Bakım süresi token ile hızlandırılabilir.",
  },
  {
    action: "repair_speedup",
    allowed: true,
    description: "Tamir süresi token ile hızlandırılabilir.",
  },
  {
    action: "emergency_energy",
    allowed: true,
    description: "Denizde acil enerji desteği alınabilir.",
  },
  {
    action: "emergency_water",
    allowed: true,
    description: "Denizde acil su desteği alınabilir.",
  },
  {
    action: "emergency_fuel",
    allowed: true,
    description: "Denizde acil yakıt desteği alınabilir.",
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
  return TOKEN_ALLOWED_RULES.find((rule) => rule.action === action)?.allowed ?? false;
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

  const profile = MARINA_COST_PROFILES.find((item) => item.costLevel === tierConfig.costLevel);
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
