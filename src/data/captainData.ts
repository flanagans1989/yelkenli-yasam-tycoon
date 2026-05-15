export const CAPTAIN_LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000, 8200, 11000, 14500, 19000, 25000];
export const CAPTAIN_LEVEL_TWO_TOKEN_REWARD = 10;

const DAILY_GOAL_THEMES = [
  {
    title: "Büyüme Günü",
    goals: {
      produce_content: "1 içerik üret",
      complete_route: "1 rota tamamla",
      buy_upgrade: "1 upgrade başlat",
    },
  },
  {
    title: "Tekne Hazırlığı",
    goals: {
      produce_content: "Kamerayı aç ve 1 içerik üret",
      complete_route: "Denize çıkıp 1 rota tamamla",
      buy_upgrade: "Teknen için 1 geliştirme başlat",
    },
  },
  {
    title: "Sponsor Yolculuğu",
    goals: {
      produce_content: "Takipçileri büyütmek için 1 içerik üret",
      complete_route: "Dünya turunda 1 rota ilerle",
      buy_upgrade: "Markalara hazırlanmak için 1 upgrade başlat",
    },
  },
];

export const ENDGAME_DAILY_GOAL_THEME = {
  title: "Dünya Turu Efsanesi",
  goals: {
    produce_content: "2 içerik üret",
    complete_route: "Bir rotayı prestij seyriyle tamamla",
    buy_upgrade: "İçerikten 5.000 TL kazan",
  },
};

export const getDailyGoalTheme = (dateKey: string, hasCompletedWorldTour: boolean = false) => {
  if (hasCompletedWorldTour) return ENDGAME_DAILY_GOAL_THEME;
  const fallbackTheme = DAILY_GOAL_THEMES[0];
  if (!dateKey) return fallbackTheme;
  const seed = dateKey.split("-").reduce((sum, part) => sum + Number(part || 0), 0);
  return DAILY_GOAL_THEMES[seed % DAILY_GOAL_THEMES.length] ?? fallbackTheme;
};

export const getCaptainLevel = (xp: number): number => {
  for (let i = CAPTAIN_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= CAPTAIN_LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

export const getCaptainLevelTokenReward = (level: number): number => {
  if (level === 2) return CAPTAIN_LEVEL_TWO_TOKEN_REWARD;
  if (level >= 3) return 2;
  return 0;
};

export const getContentCooldownMs = (captainLevel: number, isTestMode: boolean = false): number => {
  if (isTestMode) return 3000;
  if (captainLevel <= 1) return 90 * 1000;
  if (captainLevel === 2) return 8 * 60 * 1000;
  if (captainLevel === 3) return 12 * 60 * 1000;
  if (captainLevel === 4) return 18 * 60 * 1000;
  if (captainLevel === 5) return 16 * 60 * 1000;
  if (captainLevel === 6) return 14 * 60 * 1000;
  return 12 * 60 * 1000;
};

const UPGRADE_TIER_BASE_MS: Record<string, number> = {
  small: 90 * 1000,
  medium: 5 * 60 * 1000,
  large: 12 * 60 * 1000,
  ocean: 25 * 60 * 1000,
};

export const getBoatUpgradeDurationMs = (size: string, captainLevel: number, isTestMode: boolean = false): number => {
  if (isTestMode) return 5000;
  const base = UPGRADE_TIER_BASE_MS[size] ?? UPGRADE_TIER_BASE_MS.medium;
  const discount = Math.min(captainLevel - 1, 10) * 0.05;
  const multiplier = Math.max(0.5, 1 - discount);
  return Math.round(base * multiplier);
};

export const getCaptainRankLabel = (level: number): string => {
  if (level >= 13) return "Dünya Turu Kaptanı";
  if (level >= 9)  return "Okyanus Yolcusu";
  if (level >= 6)  return "Deneyimli Kaptan";
  if (level >= 4)  return "Açık Deniz Adayı";
  if (level >= 2)  return "Kıyı Seyircisi";
  return "Acemi Kaptan";
};
