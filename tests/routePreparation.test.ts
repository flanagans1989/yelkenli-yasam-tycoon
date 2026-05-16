import { describe, expect, it } from "vitest";
import { WORLD_ROUTES } from "../game-data/routes";
import { buildRoutePreparationGuidance } from "../src/core/utils/routePreparation";

describe("route preparation guidance", () => {
  it("suggests soft preparation for early routes without blocking them", () => {
    const route = WORLD_ROUTES.find((item) => item.id === "turkiye_start");
    expect(route).toBeTruthy();

    const guidance = buildRoutePreparationGuidance({
      route: route!,
      boatId: "kirlangic_28",
      ownedUpgradeIds: [],
      readiness: {
        oceanReadiness: { current: 15, required: route!.requirements.minOceanReadiness ?? 0 },
        energy: { current: 0, required: route!.requirements.minEnergy },
        water: { current: 0, required: route!.requirements.minWater },
        safety: { current: 0, required: route!.requirements.minSafety },
        navigation: { current: 0, required: route!.requirements.minNavigation },
        maintenance: { current: 0, required: route!.requirements.minMaintenance },
      },
    });

    expect(guidance.required).toEqual([]);
    expect(guidance.recommended.map((item) => item.key)).toEqual(
      expect.arrayContaining(["navigation", "energy"]),
    );
  });

  it("uses route requirements to mark hard gates and ocean-specific recommendations", () => {
    const route = WORLD_ROUTES.find((item) => item.id === "atlantic_crossing");
    expect(route).toBeTruthy();

    const guidance = buildRoutePreparationGuidance({
      route: route!,
      boatId: "denizkusu_34",
      ownedUpgradeIds: [],
      readiness: {
        oceanReadiness: { current: 40, required: route!.requirements.minOceanReadiness ?? 0 },
        energy: { current: 28, required: route!.requirements.minEnergy },
        water: { current: 26, required: route!.requirements.minWater },
        safety: { current: 45, required: route!.requirements.minSafety },
        navigation: { current: 35, required: route!.requirements.minNavigation },
        maintenance: { current: 31, required: route!.requirements.minMaintenance },
      },
    });

    expect(guidance.required.map((item) => item.key)).toEqual(
      expect.arrayContaining(["oceanReadiness", "energy", "water", "maintenance"]),
    );
    expect(guidance.recommended.some((item) => item.key === "safety")).toBe(true);
    expect(guidance.required[0]?.suggestedUpgradeNames.length).toBeGreaterThan(0);
  });

  it("does not create unnecessary hard gates when the route is already ready", () => {
    const route = WORLD_ROUTES.find((item) => item.id === "canary_islands");
    expect(route).toBeTruthy();

    const guidance = buildRoutePreparationGuidance({
      route: route!,
      boatId: "atlas_40",
      ownedUpgradeIds: [],
      readiness: {
        oceanReadiness: { current: 45, required: route!.requirements.minOceanReadiness ?? 0 },
        energy: { current: 34, required: route!.requirements.minEnergy },
        water: { current: 33, required: route!.requirements.minWater },
        safety: { current: 40, required: route!.requirements.minSafety },
        navigation: { current: 36, required: route!.requirements.minNavigation },
        maintenance: { current: 38, required: route!.requirements.minMaintenance },
      },
    });

    expect(guidance.required).toEqual([]);
  });
});
