export type RewardedAdPlacement = "rewarded_video";

export type AdRewardFeatureId =
  | "marina_refill_energy"
  | "marina_refill_water"
  | "content_cooldown_skip"
  | "sponsor_offer_refresh";

export type AdRewardKind =
  | "resource_refill"
  | "cooldown_skip"
  | "soft_currency"
  | "offer_refresh";

export type AdWatchesByFeatureByDate = Record<string, Record<string, number>>;

export interface AdRewardConfig {
  featureId: AdRewardFeatureId;
  placement: RewardedAdPlacement;
  rewardKind: AdRewardKind;
  label: string;
  description: string;
  dailyLimit: number;
  rewardAmount: number;
  enabled: boolean;
}
