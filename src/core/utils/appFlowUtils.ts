import type { Tab, StoryHook } from "../../types/game";

const VALID_TABS: Tab[] = ["liman", "icerik", "rota", "tekne", "kaptan"];

export type RouteLike = {
  id: string;
  difficulty: string;
  riskLevel: string;
  worldProgressPercent: number;
  contentPotential: string;
};

export function clampIndex(value: unknown, length: number): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < length ? value : 0;
}

export function safeTab(value: unknown): Tab {
  return typeof value === "string" && VALID_TABS.includes(value as Tab) ? (value as Tab) : "liman";
}

export function toFiniteNumber(value: unknown, fallback: number): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  return Math.max(min, Math.min(max, toFiniteNumber(value, fallback)));
}

export function getBaseOceanReadiness(boatId: string): number {
  if (boatId === "kirlangic_28") return 15;
  if (boatId === "denizkusu_34") return 30;
  if (boatId === "atlas_40") return 45;
  return 0;
}

export function getLocationBonusLabel(region: string): { contentType: string; label: string } | null {
  const r = region.toLocaleLowerCase("tr-TR");
  if (r.includes("ege")) return { contentType: "nature_bay", label: "📍 Ege: Koy/Doğa +10 kalite" };
  if (r.includes("akdeniz") || r.includes("antalya")) return { contentType: "sailing_vlog", label: "📍 Akdeniz: Seyir Vlogu +10 kalite" };
  if (r.includes("marmara") || r.includes("istanbul")) return { contentType: "city_trip", label: "📍 Marmara: Şehir Gezisi +10 kalite" };
  return null;
}

function getStoryHookBonusesByPotential(contentPotential: string): {
  bonusFollowersPct: number;
  bonusCreditsPct: number;
  sponsorInterest: number;
} {
  switch (contentPotential) {
    case "very_high":
      return { bonusFollowersPct: 20, bonusCreditsPct: 10, sponsorInterest: 2 };
    case "high":
      return { bonusFollowersPct: 16, bonusCreditsPct: 8, sponsorInterest: 1 };
    case "medium_high":
      return { bonusFollowersPct: 14, bonusCreditsPct: 7, sponsorInterest: 1 };
    case "medium":
      return { bonusFollowersPct: 12, bonusCreditsPct: 6, sponsorInterest: 1 };
    default:
      return { bonusFollowersPct: 10, bonusCreditsPct: 5, sponsorInterest: 1 };
  }
}

export function createArrivalStoryHook(route: RouteLike): StoryHook {
  const bonuses = getStoryHookBonusesByPotential(route.contentPotential);

  return {
    id: `story_arrival_${route.id}_${Date.now()}`,
    source: "arrival",
    routeId: route.id,
    title: "Bu yolculuğun hikayesi hazır",
    description: "Rotada yaşadıklarının güçlü bir içerik serisine dönüşebilir.",
    ...bonuses,
    expiresAfterUses: 1,
  };
}

export function createSeaEventStoryHook(decisionId: string, routeId?: string): StoryHook | null {
  if (decisionId === "content_opportunity") {
    return {
      id: `story_sea_${decisionId}_${Date.now()}`,
      source: "sea_event",
      routeId,
      title: "Denizden yakalanan hikaye",
      description: "Seyirde yakaladığın bu an, güçlü bir içerik fırsatına dönüştü.",
      bonusFollowersPct: 15,
      bonusCreditsPct: 10,
      sponsorInterest: 1,
      expiresAfterUses: 1,
    };
  }

  if (decisionId === "risky_social_shot") {
    return {
      id: `story_sea_${decisionId}_${Date.now()}`,
      source: "sea_event",
      routeId,
      title: "Denizde ses getiren çekim",
      description: "Riskli an doğru çekimle markaların dikkatini çekebilecek bir hikayeye dönüştü.",
      bonusFollowersPct: 12,
      bonusCreditsPct: 8,
      sponsorInterest: 1,
      expiresAfterUses: 1,
    };
  }

  return null;
}
