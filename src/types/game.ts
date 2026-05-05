export type Step =
  | "MAIN_MENU"
  | "PICK_PROFILE"
  | "PICK_MARINA"
  | "PICK_BOAT"
  | "NAME_BOAT"
  | "HUB"
  | "SEA_MODE"
  | "ARRIVAL_SCREEN";

export type Tab = "liman" | "icerik" | "rota" | "tekne" | "kaptan";

export interface ContentResult {
  platform: string;
  type: string;
  quality: number;
  viral: boolean;
  followersGained: number;
  creditsGained: number;
  comment: string;
}

export type MarinaFilter = "all" | "ege" | "akdeniz" | "marmara";
