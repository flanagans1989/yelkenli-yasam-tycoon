export type Step =
  | "WELCOME"
  | "ACCOUNT_SETUP"
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

export type DailyGoal = {
  id: string;
  title: string;
  type: "produce_content" | "complete_route" | "buy_upgrade";
  completed: boolean;
};

export type ToastType = "upgrade" | "achievement" | "sponsor" | "content" | "voyage" | "sea_decision" | "warning";

export type ToastItem = {
  id: number;
  type: ToastType;
  title: string;
  text: string;
};

export type MarinaTaskType = "produce_content" | "refill_water" | "refill_fuel" | "check_sponsors" | "repair_boat";

export type MarinaTask = {
  id: string;
  type: MarinaTaskType;
  title: string;
  reward: number;
  completed: boolean;
};

export type ContentHistoryItem = {
  platform: string;
  contentType: string;
  quality: number;
  followers: number;
  credits: number;
  viral: boolean;
  timestamp: number;
};
