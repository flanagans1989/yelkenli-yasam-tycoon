export interface RouteReadinessUiValue {
  current: number;
  required: number;
}

export interface RouteReadinessUiModel {
  oceanReadiness: RouteReadinessUiValue;
  energy: RouteReadinessUiValue;
  water: RouteReadinessUiValue;
  safety: RouteReadinessUiValue;
  navigation: RouteReadinessUiValue;
  maintenance: RouteReadinessUiValue;
}

export interface RouteReadinessUiItem {
  key: keyof RouteReadinessUiModel;
  label: string;
  value: RouteReadinessUiValue;
}

export function getVisibleRouteReadinessItems(
  readiness: RouteReadinessUiModel,
): RouteReadinessUiItem[] {
  const items: RouteReadinessUiItem[] = [];

  if (readiness.oceanReadiness.required > 0) {
    items.push({
      key: "oceanReadiness",
      label: "Okyanus Hazırlığı",
      value: readiness.oceanReadiness,
    });
  }

  items.push(
    { key: "energy", label: "Enerji", value: readiness.energy },
    { key: "water", label: "Su", value: readiness.water },
    { key: "safety", label: "Güvenlik", value: readiness.safety },
    { key: "navigation", label: "Navigasyon", value: readiness.navigation },
    { key: "maintenance", label: "Bakım", value: readiness.maintenance },
  );

  return items;
}

export function getOceanReadinessRequirementCopy(required: number): string {
  if (required > 0) {
    return `Bu rota için en az %${required} Okyanus Hazırlığı gerekiyor.`;
  }
  return "Bu rota için Okyanus Hazırlığı zorunlu değil.";
}

export function getOceanReadinessSummaryCopy(required: number): string {
  if (required > 0) {
    return `Aktif rota eşiği: %${required}`;
  }
  return "Aktif rotada zorunlu eşik yok";
}
