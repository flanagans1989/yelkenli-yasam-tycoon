import {
  calculateContentRewardsDeterministic,
  getContentViralChance,
} from "../../game-data/economy";

export type ContentQualityParams = {
  profileContentSkill: number;
  platformId: string;
  contentType: string;
  upgradeContentBonus: number;
  marinaRegion: string;
  isSeaMode: boolean;
  routeContentPotential?: string;
};

export function calculateContentQuality(p: ContentQualityParams): number {
  let quality = 40;
  quality += p.profileContentSkill * 5;

  const platformTypeMatches: Record<string, string[]> = {
    viewTube: ["boat_tour", "maintenance_upgrade", "sailing_vlog"],
    clipTok: ["nature_bay", "sailing_vlog", "storm_vlog"],
    instaSea: ["marina_life", "city_trip", "nature_bay"],
    facePort: ["marina_life", "boat_tour", "ocean_diary"],
  };
  if (platformTypeMatches[p.platformId]?.includes(p.contentType)) quality += 10;

  quality += p.upgradeContentBonus;
  quality += getLocationContentBonusLogic(p.marinaRegion, p.contentType);

  if (p.isSeaMode) {
    if (p.routeContentPotential === "very_high") quality += 15;
    else if (p.routeContentPotential === "high") quality += 10;
    else if (p.routeContentPotential === "medium_high") quality += 5;
  } else {
    quality += 5;
  }

  quality += Math.floor(Math.random() * 26) - 10;
  return Math.max(0, Math.min(100, quality));
}

function getLocationContentBonusLogic(region: string, contentType: string): number {
  const r = region.toLocaleLowerCase("tr-TR");
  if (r.includes("ege")) {
    if (contentType === "nature_bay") return 10;
    if (contentType === "sailing_vlog") return 5;
  }
  if (r.includes("akdeniz") || r.includes("antalya")) {
    if (contentType === "sailing_vlog") return 10;
    if (contentType === "nature_bay") return 10;
  }
  if (r.includes("marmara") || r.includes("istanbul")) {
    if (contentType === "city_trip") return 10;
    if (contentType === "marina_life") return 5;
  }
  return 0;
}

export type ContentRewardsParams = {
  quality: number;
  platformId: string;
  storyFollowerBonusPct: number;
  storyCreditBonusPct: number;
};

export function calculateContentRewards(p: ContentRewardsParams): { followers: number; credits: number; viral: boolean } {
  const viral = Math.random() < getContentViralChance(p.quality);
  const reward = calculateContentRewardsDeterministic({
    quality: p.quality,
    platformId: p.platformId,
    viral,
    storyFollowerBonusPct: p.storyFollowerBonusPct,
    storyCreditBonusPct: p.storyCreditBonusPct,
  });

  return { followers: reward.followers, credits: reward.credits, viral };
}

export function formatSeaDecisionEffectSummary(effect: {
  credits?: number; followers?: number; energy?: number;
  water?: number; fuel?: number; boatCondition?: number; remainingDays?: number;
}): string {
  return [
    effect.followers != null ? `${effect.followers > 0 ? "+" : ""}${effect.followers} takipçi` : null,
    effect.credits != null ? `${effect.credits > 0 ? "+" : ""}${effect.credits} TL` : null,
    effect.energy != null ? `${effect.energy > 0 ? "+" : ""}${effect.energy} enerji` : null,
    effect.water != null ? `${effect.water > 0 ? "+" : ""}${effect.water} su` : null,
    effect.fuel != null ? `${effect.fuel > 0 ? "+" : ""}${effect.fuel} yakıt` : null,
    effect.boatCondition != null ? `${effect.boatCondition > 0 ? "+" : ""}${effect.boatCondition} tekne durumu` : null,
    effect.remainingDays != null ? `${effect.remainingDays > 0 ? "+" : ""}${effect.remainingDays} gün` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
