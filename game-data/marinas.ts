export type MarinaId =
  | "marmaris"
  | "gocek"
  | "fethiye"
  | "kas"
  | "bodrum"
  | "kusadasi"
  | "cesme"
  | "antalya"
  | "istanbul"
  | "yalova";

export type DifficultyLevel =
  | "easy"
  | "easy_medium"
  | "medium"
  | "medium_hard"
  | "hard";

export type RatingLevel =
  | "low"
  | "low_medium"
  | "medium"
  | "medium_high"
  | "high"
  | "very_high";

export type PlayerProfileId =
  | "old_captain"
  | "content_creator"
  | "technical_master"
  | "adventure_traveler"
  | "social_entrepreneur"
  | "family_lifestyle";

export interface StartingMarina {
  id: MarinaId;
  name: string;
  region: string;
  tagline: string;
  description: string;
  gameRole: string;
  difficulty: DifficultyLevel;
  marinaCost: RatingLevel;
  sponsorPotential: RatingLevel;
  contentPotential: RatingLevel;
  technicalService: RatingLevel;
  routeAdvantage: RatingLevel;
  riskLevel: RatingLevel;
  bonus: {
    title: string;
    description: string;
  };
  disadvantage: {
    title: string;
    description: string;
  };
  firstRouteOptions: string[];
  bestProfiles: PlayerProfileId[];
  feeling: string;
}

export const STARTING_MARINAS: StartingMarina[] = [
  {
    id: "marmaris",
    name: "Marmaris",
    region: "Muğla / Güney Ege",
    tagline: "Dengeli, denizcilik odaklı güçlü başlangıç.",
    description:
      "Marmaris, denizcilik kültürü, marina altyapısı ve Akdeniz/Ege geçiş avantajı ile en dengeli başlangıç noktalarından biridir.",
    gameRole:
      "Güvenli, dengeli ve denizcilik odaklı başlangıç isteyen oyuncular için uygundur.",
    difficulty: "easy_medium",
    marinaCost: "medium",
    sponsorPotential: "medium",
    contentPotential: "high",
    technicalService: "high",
    routeAdvantage: "high",
    riskLevel: "medium",
    bonus: {
      title: "Denizci Başlangıcı",
      description: "İlk 2 bakım işleminde maliyet -%10.",
    },
    disadvantage: {
      title: "Rekabetçi Marina",
      description: "Sponsor teklifleri Bodrum/Göcek kadar hızlı gelmez.",
    },
    firstRouteOptions: ["Rodos", "Fethiye", "Bodrum"],
    bestProfiles: ["old_captain", "technical_master", "family_lifestyle"],
    feeling:
      "Güçlü bir denizcilik merkezinden, sağlam ve dengeli bir başlangıç yapıyorum.",
  },
  {
    id: "gocek",
    name: "Göcek",
    region: "Muğla / Akdeniz",
    tagline: "Lüks, sponsor ve lifestyle odaklı başlangıç.",
    description:
      "Göcek, lüks marina kültürü, kaliteli tekneler, premium yaşam ve yüksek sponsor potansiyeliyle öne çıkar.",
    gameRole:
      "Sponsor, lüks yaşam, InstaSea içerikleri ve yüksek gelir fırsatları isteyen oyuncular için uygundur.",
    difficulty: "medium",
    marinaCost: "high",
    sponsorPotential: "very_high",
    contentPotential: "very_high",
    technicalService: "high",
    routeAdvantage: "high",
    riskLevel: "low_medium",
    bonus: {
      title: "Premium Marina Etkisi",
      description: "İlk sponsor teklifi ihtimali +%15.",
    },
    disadvantage: {
      title: "Pahalı Başlangıç",
      description: "Marina ve hizmet maliyetleri +%15.",
    },
    firstRouteOptions: ["Fethiye", "Kaş", "Rodos"],
    bestProfiles: ["social_entrepreneur", "family_lifestyle", "content_creator"],
    feeling:
      "Premium bir marina atmosferinden, marka değeri yüksek bir başlangıçla yola çıkıyorum.",
  },
  {
    id: "fethiye",
    name: "Fethiye",
    region: "Muğla / Akdeniz",
    tagline: "Doğa, koylar ve keşif içerikleri için güçlü başlangıç.",
    description:
      "Fethiye; doğa, koylar, mavi yolculuk hissi ve keşif içerikleriyle güçlü bir başlangıç noktasıdır.",
    gameRole:
      "Doğa, keşif, sakin ama güçlü içerik üretimi ve dengeli rota başlangıcı isteyen oyuncular için uygundur.",
    difficulty: "easy_medium",
    marinaCost: "medium",
    sponsorPotential: "medium",
    contentPotential: "very_high",
    technicalService: "medium",
    routeAdvantage: "high",
    riskLevel: "medium",
    bonus: {
      title: "Doğa İçeriği Gücü",
      description: "İlk 5 lokasyon/lifestyle içeriğinde etkileşim +%15.",
    },
    disadvantage: {
      title: "Orta Teknik Hizmet",
      description: "Büyük upgrade seçenekleri sınırlı olabilir.",
    },
    firstRouteOptions: ["Göcek", "Kaş", "Rodos"],
    bestProfiles: ["adventure_traveler", "content_creator", "family_lifestyle"],
    feeling:
      "Koylar, doğa ve keşif hikayeleriyle güçlü bir yolculuk başlatıyorum.",
  },
  {
    id: "kas",
    name: "Kaş",
    region: "Antalya / Batı Akdeniz",
    tagline: "Macera, riskli rota ve güçlü görsel içerik başlangıcı.",
    description:
      "Kaş, küçük ama karakterli bir başlangıç noktasıdır. Macera, dalış, görsel içerik ve riskli rota hissi yüksektir.",
    gameRole:
      "Zorlayıcı, macera odaklı ve yüksek hikaye potansiyelli başlangıç isteyen oyuncular için uygundur.",
    difficulty: "medium_hard",
    marinaCost: "medium",
    sponsorPotential: "low_medium",
    contentPotential: "very_high",
    technicalService: "low_medium",
    routeAdvantage: "medium",
    riskLevel: "high",
    bonus: {
      title: "Macera Başlangıcı",
      description: "Riskli rota ve keşif içeriklerinde viral şans +%10.",
    },
    disadvantage: {
      title: "Sınırlı Teknik Altyapı",
      description:
        "Büyük tamir ve upgrade işlemleri için başka marinaya gitmek gerekebilir.",
    },
    firstRouteOptions: ["Meis", "Fethiye", "Antalya"],
    bestProfiles: ["adventure_traveler", "content_creator", "old_captain"],
    feeling:
      "Kolay yoldan başlamıyorum; hikayesi güçlü, daha cesur bir başlangıç yapıyorum.",
  },
  {
    id: "bodrum",
    name: "Bodrum",
    region: "Muğla / Ege",
    tagline: "Sosyal medya, sponsor ve popülerlik odaklı başlangıç.",
    description:
      "Bodrum; popülerlik, sosyal çevre, sponsor potansiyeli, gece hayatı ve güçlü sosyal medya içerikleriyle öne çıkar.",
    gameRole:
      "Hızlı takipçi büyümesi, sponsor fırsatları ve sosyal medya görünürlüğü isteyen oyuncular için uygundur.",
    difficulty: "medium",
    marinaCost: "high",
    sponsorPotential: "very_high",
    contentPotential: "very_high",
    technicalService: "high",
    routeAdvantage: "high",
    riskLevel: "medium",
    bonus: {
      title: "Popüler Başlangıç",
      description: "ClipTok ve InstaSea başlangıç büyümesi +%12.",
    },
    disadvantage: {
      title: "Pahalı Sosyal Hayat",
      description: "Liman ve şehir içerik maliyetleri +%10.",
    },
    firstRouteOptions: ["Kos", "Kuşadası", "Marmaris"],
    bestProfiles: ["content_creator", "social_entrepreneur", "family_lifestyle"],
    feeling:
      "Görünür, sosyal ve hızlı büyüme potansiyeli yüksek bir yerden başlıyorum.",
  },
  {
    id: "kusadasi",
    name: "Kuşadası",
    region: "Aydın / Ege",
    tagline: "Ekonomik, Ege geçişi ve dengeli başlangıç.",
    description:
      "Kuşadası, Ege hattına açılan dengeli ve ekonomik başlangıç noktalarından biridir.",
    gameRole:
      "Ekonomik, dengeli ve Ege rotasına yakın bir başlangıç isteyen oyuncular için uygundur.",
    difficulty: "easy",
    marinaCost: "low_medium",
    sponsorPotential: "medium",
    contentPotential: "medium_high",
    technicalService: "medium",
    routeAdvantage: "high",
    riskLevel: "low_medium",
    bonus: {
      title: "Ekonomik Başlangıç",
      description: "İlk 5 marina günü maliyet -%15.",
    },
    disadvantage: {
      title: "Daha Az Premium Algı",
      description: "Lüks sponsor teklif ihtimali başlangıçta düşük olabilir.",
    },
    firstRouteOptions: ["Samos", "Bodrum", "Çeşme"],
    bestProfiles: ["technical_master", "old_captain", "family_lifestyle"],
    feeling:
      "Paramı yakmadan, mantıklı ve dengeli bir Ege başlangıcı yapıyorum.",
  },
  {
    id: "cesme",
    name: "Çeşme",
    region: "İzmir / Ege",
    tagline: "Lifestyle, rüzgar, genç kitle ve hızlı sosyal büyüme.",
    description:
      "Çeşme; rüzgar, genç kitle, yazlık yaşam, görsel içerik ve hızlı sosyal medya büyümesiyle öne çıkar.",
    gameRole:
      "Lifestyle, kısa video, genç takipçi ve hızlı içerik büyümesi isteyen oyuncular için uygundur.",
    difficulty: "medium",
    marinaCost: "medium_high",
    sponsorPotential: "high",
    contentPotential: "very_high",
    technicalService: "medium",
    routeAdvantage: "medium_high",
    riskLevel: "medium",
    bonus: {
      title: "Yazlık Lifestyle",
      description: "ClipTok ve InstaSea lifestyle içeriklerinde etkileşim +%15.",
    },
    disadvantage: {
      title: "Rüzgar Riski",
      description: "İlk kısa seyirlerde hava/rota riski +%5.",
    },
    firstRouteOptions: ["Sakız", "Kuşadası", "Midilli Hattı"],
    bestProfiles: ["content_creator", "social_entrepreneur", "adventure_traveler"],
    feeling:
      "Genç, hızlı, rüzgarlı ve sosyal medya potansiyeli yüksek bir başlangıç yapıyorum.",
  },
  {
    id: "antalya",
    name: "Antalya",
    region: "Antalya / Akdeniz",
    tagline: "Akdeniz çıkışı, yerel bağ ve dengeli teknik başlangıç.",
    description:
      "Antalya, güçlü Akdeniz kimliği, geniş şehir yapısı, yerel bağ ve farklı rota potansiyeliyle özel bir başlangıç noktasıdır.",
    gameRole:
      "Akdeniz çıkışı, yerel güçlü başlangıç ve dengeli büyüme isteyen oyuncular için uygundur.",
    difficulty: "medium",
    marinaCost: "medium",
    sponsorPotential: "medium_high",
    contentPotential: "high",
    technicalService: "medium_high",
    routeAdvantage: "medium",
    riskLevel: "medium",
    bonus: {
      title: "Akdeniz Başlangıcı",
      description: "Deniz/lifestyle içeriklerinde ilk 5 içerik +%10 etkileşim.",
    },
    disadvantage: {
      title: "Batı Rotasına Mesafe",
      description:
        "Ege ve Yunan adaları hattına ulaşmak biraz daha fazla seyir süresi isteyebilir.",
    },
    firstRouteOptions: ["Kaş", "Kemer", "Kıbrıs Yönü"],
    bestProfiles: [
      "old_captain",
      "adventure_traveler",
      "technical_master",
      "family_lifestyle",
    ],
    feeling:
      "Akdeniz’den, güçlü ve yerel bağı olan bir başlangıç yapıyorum.",
  },
  {
    id: "istanbul",
    name: "İstanbul",
    region: "Marmara",
    tagline: "Büyük şehir, sponsor, medya ve yüksek maliyet başlangıcı.",
    description:
      "İstanbul, büyük şehir, medya, sponsor, reklam ve yüksek görünürlük açısından en güçlü ama en pahalı başlangıç noktalarından biridir.",
    gameRole:
      "Sponsor, medya, marka ve şehir içeriği üzerinden büyümek isteyen oyuncular için uygundur.",
    difficulty: "medium_hard",
    marinaCost: "very_high",
    sponsorPotential: "very_high",
    contentPotential: "high",
    technicalService: "very_high",
    routeAdvantage: "medium",
    riskLevel: "medium",
    bonus: {
      title: "Büyük Şehir Medyası",
      description: "İlk sponsor görüşmesi başarı ihtimali +%20.",
    },
    disadvantage: {
      title: "Çok Pahalı Başlangıç",
      description: "Marina ve hizmet maliyetleri +%20.",
    },
    firstRouteOptions: ["Yalova", "Çanakkale Hattı", "Ege’ye İniş Rotası"],
    bestProfiles: ["social_entrepreneur", "content_creator", "technical_master"],
    feeling:
      "Küçük bir yolculuğa değil, medya gücü olan büyük bir markaya başlıyorum.",
  },
  {
    id: "yalova",
    name: "Yalova",
    region: "Marmara",
    tagline: "Teknik bakım, tersane ve ekonomik hazırlık başlangıcı.",
    description:
      "Yalova, teknik hazırlık, bakım, tersane hissi ve ekonomik başlangıç açısından farklı bir seçenektir.",
    gameRole:
      "Tekneyi toplamaya, bakım yapmaya ve daha teknik bir başlangıç yapmaya odaklanan oyuncular için uygundur.",
    difficulty: "easy_medium",
    marinaCost: "low_medium",
    sponsorPotential: "low_medium",
    contentPotential: "medium",
    technicalService: "very_high",
    routeAdvantage: "medium",
    riskLevel: "low_medium",
    bonus: {
      title: "Teknik Hazırlık Merkezi",
      description: "İlk 3 teknik upgrade veya bakım işleminde süre -%15.",
    },
    disadvantage: {
      title: "Sosyal Görünürlük Düşük",
      description: "Sosyal medya başlangıç büyümesi -%5.",
    },
    firstRouteOptions: ["İstanbul", "Çanakkale Hattı", "Ege’ye İniş Rotası"],
    bestProfiles: ["technical_master", "old_captain", "social_entrepreneur"],
    feeling:
      "Gösterişli değil, hazırlıklı ve sağlam bir başlangıç yapıyorum.",
  },
];

export function getStartingMarinaById(id: MarinaId): StartingMarina | undefined {
  return STARTING_MARINAS.find((marina) => marina.id === id);
}