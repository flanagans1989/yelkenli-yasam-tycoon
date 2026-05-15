import {
  TOKEN_STORE_DEFAULT_CURRENCY,
  TOKEN_STORE_FRONT_ENABLED,
  TOKEN_STORE_PURCHASE_FLOW,
} from "../../game-data/economy";
import type {
  TokenStoreFrontConfig,
  TokenStorePackage,
  TokenStorePackageId,
} from "../types/store";

export const TOKEN_STORE_FRONT_CONFIG: TokenStoreFrontConfig = {
  enabled: TOKEN_STORE_FRONT_ENABLED,
  purchaseProvider: "none",
  statusLabel: "Yakinda",
  description:
    "Token magazasi yalnizca veri modeli olarak hazirlandi. Gercek satin alma akisi bu build'de kapali tutulur.",
};

export const TOKEN_STORE_PACKAGES: TokenStorePackage[] = [
  {
    id: "harbor_starter",
    name: "Harbor Starter",
    description: "Kisa hizlandirmalar icin giris seviyesi token paketi.",
    tokenAmount: 25,
    bonusTokens: 0,
    totalTokens: 25,
    price: {
      amount: 29.99,
      currency: TOKEN_STORE_DEFAULT_CURRENCY,
      localized: "29,99 TL",
    },
    availability: "locked",
    purchaseFlow: TOKEN_STORE_PURCHASE_FLOW,
  },
  {
    id: "captain_stash",
    name: "Captain Stash",
    description: "Daha sik cooldown kisaltan oyuncular icin dengeli paket.",
    tokenAmount: 60,
    bonusTokens: 10,
    totalTokens: 70,
    price: {
      amount: 59.99,
      currency: TOKEN_STORE_DEFAULT_CURRENCY,
      localized: "59,99 TL",
    },
    badge: "Populer",
    availability: "locked",
    purchaseFlow: TOKEN_STORE_PURCHASE_FLOW,
  },
  {
    id: "bluewater_bundle",
    name: "Bluewater Bundle",
    description: "Uzun rota ve upgrade zamanlayicilari icin orta paket.",
    tokenAmount: 120,
    bonusTokens: 30,
    totalTokens: 150,
    price: {
      amount: 109.99,
      currency: TOKEN_STORE_DEFAULT_CURRENCY,
      localized: "109,99 TL",
    },
    availability: "locked",
    purchaseFlow: TOKEN_STORE_PURCHASE_FLOW,
  },
  {
    id: "worldtour_crate",
    name: "World Tour Crate",
    description: "Endgame speedup ihtiyaclari icin en buyuk placeholder paket.",
    tokenAmount: 250,
    bonusTokens: 80,
    totalTokens: 330,
    price: {
      amount: 199.99,
      currency: TOKEN_STORE_DEFAULT_CURRENCY,
      localized: "199,99 TL",
    },
    badge: "Value",
    availability: "locked",
    purchaseFlow: TOKEN_STORE_PURCHASE_FLOW,
  },
];

export function getTokenStorePackage(
  packageId: TokenStorePackageId,
): TokenStorePackage | undefined {
  return TOKEN_STORE_PACKAGES.find((item) => item.id === packageId);
}
