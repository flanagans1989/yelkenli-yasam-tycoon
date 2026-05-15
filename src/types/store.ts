import type {
  TOKEN_STORE_DEFAULT_CURRENCY,
  TOKEN_STORE_PURCHASE_FLOW,
} from "../../game-data/economy";

export type TokenStorePackageId =
  | "harbor_starter"
  | "captain_stash"
  | "bluewater_bundle"
  | "worldtour_crate";

export type TokenStoreCurrency = typeof TOKEN_STORE_DEFAULT_CURRENCY;
export type TokenStorePurchaseFlow = typeof TOKEN_STORE_PURCHASE_FLOW;
export type TokenStoreAvailability = "locked";

export interface TokenStorePrice {
  amount: number;
  currency: TokenStoreCurrency;
  localized: string;
}

export interface TokenStorePackage {
  id: TokenStorePackageId;
  name: string;
  description: string;
  tokenAmount: number;
  bonusTokens: number;
  totalTokens: number;
  price: TokenStorePrice;
  badge?: string;
  availability: TokenStoreAvailability;
  purchaseFlow: TokenStorePurchaseFlow;
}

export interface TokenStoreFrontConfig {
  enabled: boolean;
  purchaseProvider: "none";
  statusLabel: string;
  description: string;
}
