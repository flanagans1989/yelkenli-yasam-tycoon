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
  let viralChance = 0;
  if (p.quality >= 85) viralChance = 0.25;
  else if (p.quality >= 70) viralChance = 0.10;
  else if (p.quality >= 40) viralChance = 0.03;
  const viral = Math.random() < viralChance;

  let followers = p.quality * 5;
  let credits = Math.round(p.quality * (5 + 0.06 * p.quality));

  const multipliers: Record<string, [number, number]> = {
    viewTube: [1.0, 1.5],
    clipTok: [1.8, 0.8],
    instaSea: [1.3, 1.1],
    facePort: [1.1, 1.0],
  };
  const [fm, cm] = multipliers[p.platformId] ?? [1, 1];
  followers *= fm;
  credits *= cm;

  if (viral) { followers *= 3; credits *= 2; }
  if (p.storyFollowerBonusPct > 0) followers *= 1 + p.storyFollowerBonusPct / 100;
  if (p.storyCreditBonusPct > 0) credits *= 1 + p.storyCreditBonusPct / 100;

  return { followers: Math.floor(followers), credits: Math.floor(credits), viral };
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
