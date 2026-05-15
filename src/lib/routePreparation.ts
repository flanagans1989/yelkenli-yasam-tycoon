import { BOAT_UPGRADES, UPGRADE_CATEGORIES } from "../../game-data/upgrades";
import type { BoatId, UpgradeCategoryId, UpgradeEffects } from "../../game-data/upgrades";
import type { WorldRoute } from "../../game-data/routes";

export type PreparationStatKey =
  | "oceanReadiness"
  | "energy"
  | "water"
  | "safety"
  | "navigation"
  | "maintenance";

export interface PreparationMetric {
  key: PreparationStatKey;
  label: string;
  current: number;
  required: number;
}

export interface PreparationGuidanceItem {
  key: string;
  label: string;
  severity: "required" | "recommended";
  categoryId: UpgradeCategoryId;
  categoryLabel: string;
  reason: string;
  current?: number;
  required?: number;
  shortfall?: number;
  suggestedUpgradeNames: string[];
}

export interface RoutePreparationGuidance {
  required: PreparationGuidanceItem[];
  recommended: PreparationGuidanceItem[];
}

type PreparationRule = {
  key: PreparationStatKey;
  label: string;
  categoryIds: UpgradeCategoryId[];
  effectKeys: Array<keyof UpgradeEffects>;
  recommendationBuffer: number;
};

const PREPARATION_RULES: Record<PreparationStatKey, PreparationRule> = {
  oceanReadiness: {
    key: "oceanReadiness",
    label: "Okyanus Hazırlığı",
    categoryIds: ["navigation", "safety", "hull_maintenance", "water_life", "energy"],
    effectKeys: ["oceanReadiness"],
    recommendationBuffer: 10,
  },
  energy: {
    key: "energy",
    label: "Enerji",
    categoryIds: ["energy"],
    effectKeys: ["energy", "oceanReadiness"],
    recommendationBuffer: 8,
  },
  water: {
    key: "water",
    label: "Su",
    categoryIds: ["water_life"],
    effectKeys: ["water", "oceanReadiness"],
    recommendationBuffer: 8,
  },
  safety: {
    key: "safety",
    label: "Güvenlik",
    categoryIds: ["safety", "auxiliary_seamanship"],
    effectKeys: ["safety", "riskReduction", "oceanReadiness"],
    recommendationBuffer: 8,
  },
  navigation: {
    key: "navigation",
    label: "Navigasyon",
    categoryIds: ["navigation"],
    effectKeys: ["navigation", "oceanReadiness"],
    recommendationBuffer: 8,
  },
  maintenance: {
    key: "maintenance",
    label: "Bakım",
    categoryIds: ["hull_maintenance", "engine_mechanical"],
    effectKeys: ["maintenance", "riskReduction", "oceanReadiness"],
    recommendationBuffer: 8,
  },
};

function getCategoryLabel(categoryId: UpgradeCategoryId): string {
  return UPGRADE_CATEGORIES.find((category) => category.id === categoryId)?.name ?? categoryId;
}

function getUpgradeScore(upgrade: (typeof BOAT_UPGRADES)[number], rule: PreparationRule): number {
  return rule.effectKeys.reduce((sum, effectKey) => sum + Number(upgrade.effects[effectKey] ?? 0), 0);
}

function getSuggestedUpgradeNames(
  rule: PreparationRule,
  boatId: BoatId,
  ownedUpgradeIds: string[],
): { names: string[]; primaryCategoryId: UpgradeCategoryId } {
  const categoryPriority = new Map(rule.categoryIds.map((categoryId, index) => [categoryId, index]));
  const candidates = BOAT_UPGRADES
    .filter((upgrade) => !ownedUpgradeIds.includes(upgrade.id))
    .filter((upgrade) => rule.categoryIds.includes(upgrade.categoryId))
    .filter((upgrade) => upgrade.compatibility.some((compatibility) => compatibility.boatId === boatId && compatibility.compatible))
    .filter((upgrade) => getUpgradeScore(upgrade, rule) > 0)
    .sort((left, right) => {
      const scoreDiff = getUpgradeScore(right, rule) - getUpgradeScore(left, rule);
      if (scoreDiff !== 0) return scoreDiff;
      const categoryDiff =
        (categoryPriority.get(left.categoryId) ?? 99) - (categoryPriority.get(right.categoryId) ?? 99);
      if (categoryDiff !== 0) return categoryDiff;
      return left.cost - right.cost;
    });

  return {
    names: candidates.slice(0, 2).map((upgrade) => upgrade.name),
    primaryCategoryId: candidates[0]?.categoryId ?? rule.categoryIds[0],
  };
}

function buildRequiredReason(metric: PreparationMetric): string {
  return `${metric.label} için en az ${metric.required} gerekiyor. Şu an ${metric.current} seviyesindesin.`;
}

function buildRecommendedReason(route: WorldRoute, metric: PreparationMetric): string {
  if (route.isOceanCrossing) {
    return `${route.name} uzun okyanus geçişi. Minimumu geçsen bile ${metric.label.toLocaleLowerCase("tr-TR")} tarafında güvenli pay bırakmak önerilir.`;
  }
  if (route.isOceanGate) {
    return `${route.name} büyük geçiş öncesi son hazırlık noktası. ${metric.label.toLocaleLowerCase("tr-TR")} tarafını biraz daha güçlendirmek sonraki etabı rahatlatır.`;
  }
  if (route.order <= 2) {
    return `Erken rota olsa da ${metric.label.toLocaleLowerCase("tr-TR")} yatırımı ilk uluslararası seyirleri daha dengeli açar.`;
  }
  return `${route.name} için minimumu geçiyorsun ama ${metric.label.toLocaleLowerCase("tr-TR")} tarafında küçük bir tampon iyi olur.`;
}

export function buildRoutePreparationGuidance(input: {
  route: WorldRoute;
  readiness: Record<PreparationStatKey, { current: number; required: number }>;
  boatId: BoatId;
  ownedUpgradeIds: string[];
}): RoutePreparationGuidance {
  const { route, readiness, boatId, ownedUpgradeIds } = input;
  const metrics = (Object.keys(PREPARATION_RULES) as PreparationStatKey[]).map((key) => ({
    key,
    label: PREPARATION_RULES[key].label,
    current: readiness[key].current,
    required: readiness[key].required,
  }));

  const required = metrics
    .filter((metric) => metric.current < metric.required)
    .map((metric) => {
      const rule = PREPARATION_RULES[metric.key];
      const suggestions = getSuggestedUpgradeNames(rule, boatId, ownedUpgradeIds);
      return {
        key: metric.key,
        label: metric.label,
        severity: "required" as const,
        categoryId: suggestions.primaryCategoryId,
        categoryLabel: getCategoryLabel(suggestions.primaryCategoryId),
        reason: buildRequiredReason(metric),
        current: metric.current,
        required: metric.required,
        shortfall: metric.required - metric.current,
        suggestedUpgradeNames: suggestions.names,
      };
    });

  const recommendationKeys = new Set<PreparationStatKey>();
  const requiredKeys = new Set(required.map((item) => item.key as PreparationStatKey));

  if (route.order <= 2) {
    recommendationKeys.add("navigation");
    recommendationKeys.add("energy");
  }
  if (route.riskLevel === "high" || route.riskLevel === "very_high") {
    recommendationKeys.add("safety");
    recommendationKeys.add("maintenance");
  }
  if (route.isOceanGate || route.isOceanCrossing || (route.requirements.minOceanReadiness ?? 0) > 0) {
    recommendationKeys.add("oceanReadiness");
    recommendationKeys.add("water");
    recommendationKeys.add("navigation");
    recommendationKeys.add("maintenance");
    recommendationKeys.add("safety");
  }

  const recommended = Array.from(recommendationKeys)
    .filter((key) => !requiredKeys.has(key))
    .map((key) => {
      const metric = metrics.find((entry) => entry.key === key)!;
      const rule = PREPARATION_RULES[key];
      const threshold = metric.required + rule.recommendationBuffer;
      const shouldRecommend =
        route.order <= 2
          ? metric.current <= Math.max(threshold, 10)
          : route.isOceanGate || route.isOceanCrossing
            ? metric.current <= Math.max(threshold, metric.required + 6)
            : metric.current <= threshold;

      if (!shouldRecommend) return null;

      const suggestions = getSuggestedUpgradeNames(rule, boatId, ownedUpgradeIds);
      if (suggestions.names.length === 0) return null;

      return {
        key,
        label: metric.label,
        severity: "recommended" as const,
        categoryId: suggestions.primaryCategoryId,
        categoryLabel: getCategoryLabel(suggestions.primaryCategoryId),
        reason: buildRecommendedReason(route, metric),
        current: metric.current,
        required: metric.required,
        suggestedUpgradeNames: suggestions.names,
      };
    })
    .filter(Boolean) as PreparationGuidanceItem[];

  return {
    required,
    recommended: recommended.slice(0, 4),
  };
}
