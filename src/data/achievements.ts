export type AchievementProgress = {
  totalContentProduced: number;
  totalRoutesCompleted: number;
  totalUpgradesStarted: number;
  captainLevel: number;
  hasCompletedDailyGoalsOnce: boolean;
  followers: number;
  acceptedSponsorsCount: number;
  completedRouteIds: string[];
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  tokenReward: number;
  isUnlocked: (progress: AchievementProgress) => boolean;
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: "first_content", title: "İlk İçerik", description: "1 içerik üret.", tokenReward: 1, isUnlocked: (p) => p.totalContentProduced >= 1 },
  { id: "first_route", title: "İlk Rota", description: "1 rota tamamla.", tokenReward: 1, isUnlocked: (p) => p.totalRoutesCompleted >= 1 },
  { id: "first_upgrade", title: "İlk Upgrade", description: "1 upgrade başlat.", tokenReward: 1, isUnlocked: (p) => p.totalUpgradesStarted >= 1 },
  { id: "first_sponsor", title: "İlk Anlaşma", description: "İlk sponsor anlaşmasını imzala.", tokenReward: 1, isUnlocked: (p) => p.acceptedSponsorsCount >= 1 },
  { id: "followers_1k", title: "Bin Takipçi", description: "1.000 takipçiye ulaş.", tokenReward: 1, isUnlocked: (p) => p.followers >= 1000 },
  { id: "rising_captain", title: "Yükselen Kaptan", description: "Kaptan seviyesi 3'e ulaş.", tokenReward: 1, isUnlocked: (p) => p.captainLevel >= 3 },
  { id: "locked_in", title: "Hedefe Kilitlen", description: "Günlük görevleri 3/3 en az 1 kez tamamla.", tokenReward: 2, isUnlocked: (p) => p.hasCompletedDailyGoalsOnce },
  { id: "sea_dog", title: "Deniz Kurdu", description: "5 rota tamamla.", tokenReward: 2, isUnlocked: (p) => p.totalRoutesCompleted >= 5 },
  { id: "steady_creator", title: "İstikrarlı Üretici", description: "10 içerik üret.", tokenReward: 1, isUnlocked: (p) => p.totalContentProduced >= 10 },
  { id: "followers_10k", title: "On Bin Takipçi", description: "10.000 takipçiye ulaş.", tokenReward: 2, isUnlocked: (p) => p.followers >= 10000 },
  { id: "content_machine", title: "İçerik Makinesi", description: "25 içerik üret.", tokenReward: 2, isUnlocked: (p) => p.totalContentProduced >= 25 },
  { id: "atlantic_done", title: "Atlantik Kaptanı", description: "Atlantik Geçişini tamamla.", tokenReward: 3, isUnlocked: (p) => p.completedRouteIds.includes("atlantic_crossing") },
  { id: "world_tour_done", title: "Dünya Turu Kaptanı", description: "Tüm 17 rotayı tamamla.", tokenReward: 5, isUnlocked: (p) => p.totalRoutesCompleted >= 17 },
];

export const getAchievementTokenReward = (achievementId: string): number =>
  ACHIEVEMENTS.find((achievement) => achievement.id === achievementId)?.tokenReward ?? 0;

export const ACHIEVEMENT_ICONS: Record<string, string> = {
  first_content: "🎬",
  first_route: "⚓",
  first_upgrade: "🔧",
  first_sponsor: "🤝",
  followers_1k: "👥",
  rising_captain: "⭐",
  locked_in: "🎯",
  sea_dog: "🌊",
  steady_creator: "📱",
  followers_10k: "🌟",
  content_machine: "📹",
  atlantic_done: "🌊",
  world_tour_done: "🏆",
};
