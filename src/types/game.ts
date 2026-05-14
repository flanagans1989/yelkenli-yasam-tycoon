export type Step =
  | "WELCOME"
  | "MAIN_MENU"
  | "PICK_PROFILE"
  | "PICK_MARINA"
  | "PICK_BOAT"
  | "NAME_BOAT"
  | "PICK_GENDER"
  | "HUB"
  | "SEA_MODE"
  | "ARRIVAL_SCREEN";

export type Gender = "male" | "female" | "unspecified";

export type Tab = "liman" | "icerik" | "rota" | "tekne" | "kaptan";

export interface ContentResult {
  platform: string;
  type: string;
  quality: number;
  viral: boolean;
  followersGained: number;
  creditsGained: number;
  comment: string;
  storyHookTitle?: string;
  storyHookSummary?: string;
  sponsorInterestGained?: number;
}

export interface StoryHook {
  id: string;
  source: "sea_event" | "arrival";
  routeId?: string;
  title: string;
  description: string;
  bonusFollowersPct?: number;
  bonusCreditsPct?: number;
  sponsorInterest?: number;
  expiresAfterUses?: number;
}

export type MarinaFilter = "all" | "ege" | "akdeniz" | "marmara";
