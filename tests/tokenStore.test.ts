import { describe, expect, it } from "vitest";
import {
  TOKEN_STORE_DEFAULT_CURRENCY,
  TOKEN_STORE_FRONT_ENABLED,
  TOKEN_STORE_PURCHASE_FLOW,
} from "../game-data/economy";
import {
  TOKEN_STORE_FRONT_CONFIG,
  TOKEN_STORE_PACKAGES,
  getTokenStorePackage,
} from "../src/data/tokenStore";

describe("token store data model", () => {
  it("defines placeholder token packages with stable pricing metadata", () => {
    expect(TOKEN_STORE_PACKAGES.length).toBeGreaterThan(0);

    for (const item of TOKEN_STORE_PACKAGES) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.tokenAmount).toBeGreaterThan(0);
      expect(item.bonusTokens).toBeGreaterThanOrEqual(0);
      expect(item.totalTokens).toBe(item.tokenAmount + item.bonusTokens);
      expect(item.price.amount).toBeGreaterThan(0);
      expect(item.price.currency).toBe(TOKEN_STORE_DEFAULT_CURRENCY);
      expect(item.price.localized).toContain("TL");
      expect(item.availability).toBe("locked");
      expect(item.purchaseFlow).toBe(TOKEN_STORE_PURCHASE_FLOW);
    }
  });

  it("keeps the storefront disabled and without a runtime payment provider", () => {
    expect(TOKEN_STORE_FRONT_ENABLED).toBe(false);
    expect(TOKEN_STORE_FRONT_CONFIG.enabled).toBe(false);
    expect(TOKEN_STORE_FRONT_CONFIG.purchaseProvider).toBe("none");
    expect(TOKEN_STORE_FRONT_CONFIG.statusLabel.toLowerCase()).toContain("yak");
  });

  it("supports safe data imports without triggering purchases", () => {
    const featuredPackage = getTokenStorePackage("captain_stash");

    expect(featuredPackage?.totalTokens).toBe(70);
    expect(
      TOKEN_STORE_PACKAGES.every((item) => item.purchaseFlow === "placeholder_only"),
    ).toBe(true);
  });
});
