import { describe, expect, it } from "vitest";
import { WORLD_ROUTES } from "../game-data/routes";
import {
  getOceanReadinessRequirementCopy,
  getOceanReadinessSummaryCopy,
  getVisibleRouteReadinessItems,
  type RouteReadinessUiModel,
} from "../src/lib/routeReadinessUi";

function makeReadiness(requiredOceanReadiness: number): RouteReadinessUiModel {
  return {
    oceanReadiness: { current: 42, required: requiredOceanReadiness },
    energy: { current: 10, required: 5 },
    water: { current: 10, required: 5 },
    safety: { current: 10, required: 5 },
    navigation: { current: 10, required: 5 },
    maintenance: { current: 10, required: 5 },
  };
}

describe("route readiness UI", () => {
  it("does not show ocean readiness as a required item on early routes without an ocean gate", () => {
    const route1 = WORLD_ROUTES.find((route) => route.id === "turkiye_start");
    const route2 = WORLD_ROUTES.find((route) => route.id === "greek_islands");

    expect(route1?.requirements.minOceanReadiness ?? 0).toBe(0);
    expect(route2?.requirements.minOceanReadiness ?? 0).toBe(0);

    const route1Items = getVisibleRouteReadinessItems(makeReadiness(route1?.requirements.minOceanReadiness ?? 0));
    const route2Items = getVisibleRouteReadinessItems(makeReadiness(route2?.requirements.minOceanReadiness ?? 0));

    expect(route1Items.map((item) => item.key)).not.toContain("oceanReadiness");
    expect(route2Items.map((item) => item.key)).not.toContain("oceanReadiness");
    expect(getOceanReadinessRequirementCopy(0)).toContain("zorunlu değil");
    expect(getOceanReadinessSummaryCopy(0)).toContain("eşik yok");
  });

  it("shows ocean readiness clearly on ocean-gated routes", () => {
    const firstOceanRoute = WORLD_ROUTES.find(
      (route) => (route.requirements.minOceanReadiness ?? 0) > 0,
    );

    expect(firstOceanRoute).toBeTruthy();
    expect(firstOceanRoute?.order).toBeGreaterThanOrEqual(9);

    const items = getVisibleRouteReadinessItems(
      makeReadiness(firstOceanRoute?.requirements.minOceanReadiness ?? 0),
    );

    expect(items.map((item) => item.key)).toContain("oceanReadiness");
    expect(
      getOceanReadinessRequirementCopy(firstOceanRoute?.requirements.minOceanReadiness ?? 0),
    ).toContain(`%${firstOceanRoute?.requirements.minOceanReadiness}`);
    expect(
      getOceanReadinessSummaryCopy(firstOceanRoute?.requirements.minOceanReadiness ?? 0),
    ).toContain(`%${firstOceanRoute?.requirements.minOceanReadiness}`);
  });
});
