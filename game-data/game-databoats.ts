export type BoatId = "kirlangic_28" | "denizkusu_34" | "atlas_40";

export type BoatSizeClass = "small_28ft" | "balanced_34ft" | "ocean_40ft";

export type RatingLevel =
  | "very_low"
  | "low"
  | "low_medium"
  | "medium"
  | "medium_high"
  | "high"
  | "very_high";

export type DifficultyLevel =
  | "easy"
  | "easy_medium"
  | "medium"
  | "medium_hard"
  | "hard";

export type PlayerProfileId =
  | "old_captain"
  | "content_creator"
  | "technical_master"
  | "adventure_traveler"
  | "social_entrepreneur"
  | "family_lifestyle";

export interface BoatStats {
  maintenanceCost: RatingLevel;
  breakdownRisk: RatingLevel;
  speedPerformance: RatingLevel;
  energyCapacity: RatingLevel;
  waterCapacity: RatingLevel;
  fuelCapacity: RatingLevel;
  comfort: RatingLevel;
  safety: RatingLevel;
  upgradePotential: RatingLevel;
  contentAppeal: RatingLevel;
}

export interface StartingBoat {
  id: BoatId;
  name: string;
  sizeClass: BoatSizeClass;
  lengthFt: number;
  ageCondition: string;
  tagline: string;
  description: string;
  gameRole: string;
  difficulty: DifficultyLevel;
  purchaseCost: number;
  remainingBudgetFeeling: string;
  stats: BoatStats;
  advantage: {
    title: string;
    description: string;
  };
  disadvantage: {
    title: string;
    description: string;
  };
  socialMediaEffect: string[];
  routeEffect: string[];
  bestProfiles: PlayerProfileId[];
  upgradeNotes: string[];
  oceanReadiness: string;
  feeling: string;
}

export const STARTING_BOATS: StartingBoat[] = [
  {
    id: "kirlangic_28",
    name: "Kırlangıç 28",
    sizeClass: "small_28ft",
    lengthFt: 28,
    ageCondition: "Eski ikinci el",
    tagline: "Ucuz ama zorlayıcı başlangıç teknesi.",
    description:
      "Kırlangıç 28, eski ama karakterli bir ikinci el yelkenlidir. Küçük, ucuz, masraflı ve sınırlı kapasitelidir.",
    gameRole:
      "Zor başlangıç, düşük bütçe, yüksek emek ve güçlü tycoon gelişimi isteyen oyuncular için uygundur.",
    difficulty: "hard",
    purchaseCost: 35000,
    remainingBudgetFeeling: "Upgrade ve bakım için yüksek bütçe kalır.",
    stats: {
      maintenanceCost: "medium_high",
      breakdownRisk: "high",
      speedPerformance: "low_medium",
      energyCapacity: "low",
      waterCapacity: "low",
      fuelCapacity: "low",
      comfort: "low",
      safety: "low_medium",
      upgradePotential: "medium",
      contentAppeal: "medium_high",
    },
    advantage: {
      title: "Ucuz Başlangıç",
      description:
        "Oyuncunun elinde upgrade ve bakım için daha fazla başlangıç bütçesi kalır.",
    },
    disadvantage: {
      title: "Yaşlı Gövde",
      description:
        "Arıza, bakım ve konfor sorunları daha sık yaşanır.",
    },
    socialMediaEffect: [
      "Samimi başlangıç hikayeleri için güçlüdür.",
      "Eski tekneyi topluyorum içerikleri iyi çalışır.",
      "Lüks sponsorlar için başlangıçta zayıftır.",
      "Teknik ve macera içeriklerinde iyi hikaye üretir.",
    ],
    routeEffect: [
      "Kısa Ege ve Akdeniz rotaları için uygundur.",
      "Uzun okyanus geçişleri için ciddi upgrade ister.",
      "Fırtına ve uzun seyirlerde risk yüksektir.",
    ],
    bestProfiles: ["technical_master", "old_captain", "adventure_traveler"],
    upgradeNotes: [
      "Küçük güneş paneli uygundur.",
      "Büyük lityum akü bankası sınırlıdır.",
      "Su yapıcı zor veya sınırlı çalışır.",
      "Jeneratör genelde uygun değildir.",
      "Klima kurulumu zordur.",
    ],
    oceanReadiness:
      "Okyanus hazırlığı en zor teknedir. Çok upgrade ve bakım ister.",
    feeling:
      "Elimde mükemmel bir tekne yok ama bu tekneyi kendi emeğimle dünya turuna hazırlayacağım.",
  },
  {
    id: "denizkusu_34",
    name: "Denizkuşu 34",
    sizeClass: "balanced_34ft",
    lengthFt: 34,
    ageCondition: "Dengeli ikinci el cruiser",
    tagline: "Dengeli ve önerilen başlangıç teknesi.",
    description:
      "Denizkuşu 34, dengeli bir ikinci el cruiser sınıfıdır. Ne çok küçük ne çok pahalıdır.",
    gameRole:
      "Dengeli, kontrollü, öğrenmesi kolay ve tavsiye edilen başlangıç isteyen oyuncular için uygundur.",
    difficulty: "easy_medium",
    purchaseCost: 60000,
    remainingBudgetFeeling: "Dengeli bütçe kalır.",
    stats: {
      maintenanceCost: "medium",
      breakdownRisk: "medium",
      speedPerformance: "medium",
      energyCapacity: "medium",
      waterCapacity: "medium",
      fuelCapacity: "medium",
      comfort: "medium",
      safety: "medium",
      upgradePotential: "high",
      contentAppeal: "high",
    },
    advantage: {
      title: "Dengeli Cruiser",
      description:
        "Seyir, konfor, bakım ve upgrade açısından güvenli orta yol sunar.",
    },
    disadvantage: {
      title: "Uç Avantaj Yok",
      description:
        "Lüks, hız veya düşük maliyet açısından özel bir uç avantaj sunmaz.",
    },
    socialMediaEffect: [
      "Genel tekne yaşamı içerikleri için uygundur.",
      "ViewTube ve InstaSea içeriklerinde dengeli çalışır.",
      "Sponsorlar için kabul edilebilir görünürlük sağlar.",
      "Aile ve lifestyle içeriklerinde yeterli konfor sunar.",
    ],
    routeEffect: [
      "Ege ve Akdeniz rotalarında dengelidir.",
      "Atlantik öncesi orta-ileri upgrade ister.",
      "Uzun rotalarda doğru hazırlıkla güvenli hale gelir.",
    ],
    bestProfiles: [
      "family_lifestyle",
      "content_creator",
      "old_captain",
      "social_entrepreneur",
    ],
    upgradeNotes: [
      "Çoğu MVP upgrade için ideal dengededir.",
      "Büyük güneş paneli uygundur.",
      "Su yapıcı uygundur.",
      "Radar uygundur.",
      "Jeneratör sınırlı olabilir.",
      "Klima sınırlı olabilir.",
    ],
    oceanReadiness:
      "Okyanus hazırlığı orta zorluktadır. Doğru yatırımla hazır hale gelir.",
    feeling:
      "Çok riskli başlamıyorum. Sağlam, dengeli ve büyümeye açık bir teknem var.",
  },
  {
    id: "atlas_40",
    name: "Atlas 40",
    sizeClass: "ocean_40ft",
    lengthFt: 40,
    ageCondition: "Modern ikinci el / yeniye yakın ocean cruiser",
    tagline: "Güçlü ama pahalı başlangıç teknesi.",
    description:
      "Atlas 40, modern ve güçlü bir ocean cruiser sınıfıdır. Daha pahalıdır ama konfor, güvenlik, kapasite ve sosyal medya görünürlüğü açısından güçlü bir başlangıç sunar.",
    gameRole:
      "Güçlü, konforlu, yüksek potansiyelli ama pahalı başlangıç isteyen oyuncular için uygundur.",
    difficulty: "medium_hard",
    purchaseCost: 85000,
    remainingBudgetFeeling: "Az bütçe kalır, gelir üretme baskısı artar.",
    stats: {
      maintenanceCost: "high",
      breakdownRisk: "low_medium",
      speedPerformance: "high",
      energyCapacity: "high",
      waterCapacity: "high",
      fuelCapacity: "high",
      comfort: "very_high",
      safety: "high",
      upgradePotential: "very_high",
      contentAppeal: "very_high",
    },
    advantage: {
      title: "Ocean Cruiser Altyapısı",
      description:
        "Uzun seyir, konfor, güvenlik ve içerik kalitesi açısından güçlü başlangıç sağlar.",
    },
    disadvantage: {
      title: "Pahalı Yaşam",
      description:
        "Satın alma, bakım, marina ve upgrade maliyetleri yüksektir.",
    },
    socialMediaEffect: [
      "InstaSea, ViewTube ve sponsor içerikleri için çok güçlüdür.",
      "Lüks yaşam, aile, ocean prep ve tekne turu içerikleri yüksek performans verir.",
      "ClipTok’ta görsel etkisi güçlüdür.",
      "Teknik dönüşüm hikayesi Kırlangıç 28 kadar samimi değildir.",
    ],
    routeEffect: [
      "Ege ve Akdeniz rotalarında rahattır.",
      "Atlantik hazırlığı için diğer teknelere göre daha avantajlıdır.",
      "Okyanus geçişine uygun hale getirmek daha kolay ama daha pahalıdır.",
    ],
    bestProfiles: [
      "social_entrepreneur",
      "family_lifestyle",
      "content_creator",
      "old_captain",
    ],
    upgradeNotes: [
      "Büyük güneş paneli çok uygundur.",
      "Lityum akü bankası çok uygundur.",
      "Su yapıcı çok uygundur.",
      "Jeneratör uygundur.",
      "Radar çok uygundur.",
      "Klima uygundur.",
      "Büyük güvenlik sistemi uygundur.",
    ],
    oceanReadiness:
      "Okyanus hazırlığı en kolay teknedir. Ancak maliyetleri yüksektir.",
    feeling:
      "Ben bu yolculuğa güçlü başlıyorum ama bu teknenin masraflarını taşıyacak kadar iyi yönetmeliyim.",
  },
];

export function getStartingBoatById(id: BoatId): StartingBoat | undefined {
  return STARTING_BOATS.find((boat) => boat.id === id);
}

export const STARTING_BUDGET = 100000;

export function getRemainingBudgetAfterBoatPurchase(boatId: BoatId): number {
  const boat = getStartingBoatById(boatId);

  if (!boat) {
    return STARTING_BUDGET;
  }

  return STARTING_BUDGET - boat.purchaseCost;
}