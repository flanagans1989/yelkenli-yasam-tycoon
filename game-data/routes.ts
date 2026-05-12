export type RouteId =
  | "turkiye_start"
  | "greek_islands"
  | "crete_crossing"
  | "malta"
  | "sicily"
  | "sardinia"
  | "balearic_islands"
  | "gibraltar"
  | "canary_islands"
  | "atlantic_crossing"
  | "caribbean"
  | "panama"
  | "pacific_islands"
  | "australia"
  | "indian_ocean"
  | "return_route"
  | "return_to_turkiye";

export type RouteDifficulty =
  | "easy"
  | "easy_medium"
  | "medium"
  | "medium_hard"
  | "hard"
  | "very_hard"
  | "final";

export type RouteType =
  | "tutorial"
  | "coastal"
  | "island_hop"
  | "open_sea"
  | "mediterranean_crossing"
  | "ocean_gate"
  | "ocean_crossing"
  | "reward_region"
  | "technical_stop"
  | "final_return";

export type RatingLevel =
  | "low"
  | "low_medium"
  | "medium"
  | "medium_high"
  | "high"
  | "very_high";

export interface RouteRequirements {
  minSafety: number;
  minNavigation: number;
  minEnergy: number;
  minWater: number;
  minMaintenance: number;
  minOceanReadiness?: number;
}

export interface WorldRoute {
  id: RouteId;
  order: number;
  name: string;
  from: string;
  to: string;
  region: string;
  routeType: RouteType;
  difficulty: RouteDifficulty;
  baseDurationDays: {
    min: number;
    max: number;
  };
  worldProgressPercent: number;
  riskLevel: RatingLevel;
  contentPotential: RatingLevel;
  sponsorPotential: RatingLevel;
  requirements: RouteRequirements;
  mainRisks: string[];
  contentThemes: string[];
  rewards: string[];
  description: string;
  feeling: string;
  isOceanGate: boolean;
  isOceanCrossing: boolean;
}

export const WORLD_ROUTES: WorldRoute[] = [
  {
    id: "turkiye_start",
    order: 1,
    name: "Türkiye Başlangıcı",
    from: "Seçilen Başlangıç Marinası",
    to: "İlk Hazırlık",
    region: "Türkiye",
    routeType: "tutorial",
    difficulty: "easy",
    baseDurationDays: { min: 0, max: 1 },
    worldProgressPercent: 0,
    riskLevel: "low",
    contentPotential: "medium_high",
    sponsorPotential: "medium",
    requirements: {
      minSafety: 0,
      minNavigation: 0,
      minEnergy: 0,
      minWater: 0,
      minMaintenance: 0,
    },
    mainRisks: ["Başlangıç bütçesini yanlış harcamak", "Bakımı ertelemek"],
    contentThemes: ["Tekne hazırlığı", "Marina yaşamı", "İlk içerik", "Başlangıç hikayesi"],
    rewards: ["İlk takipçiler", "İlk kredi geliri", "Tutorial ilerlemesi"],
    description:
      "Oyuncu seçtiği marina, profil ve tekneyle oyuna başlar. İlk hazırlık, ilk içerik ve ilk küçük kararlar bu aşamada yapılır.",
    feeling: "Teknem hazır değil ama yolculuk başlıyor.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "greek_islands",
    order: 2,
    name: "Yunan Adaları",
    from: "Türkiye",
    to: "Yunan Adaları",
    region: "Ege",
    routeType: "island_hop",
    difficulty: "easy_medium",
    baseDurationDays: { min: 1, max: 3 },
    worldProgressPercent: 5,
    riskLevel: "low_medium",
    contentPotential: "high",
    sponsorPotential: "medium",
    requirements: {
      minSafety: 5,
      minNavigation: 5,
      minEnergy: 5,
      minWater: 0,
      minMaintenance: 5,
    },
    mainRisks: ["İlk uluslararası rota", "Kısa hava değişimi", "Kaynak yönetimi"],
    contentThemes: ["Ada yaşamı", "İlk yurt dışı limanı", "Kısa video", "Rota vlogu"],
    rewards: ["İlk uluslararası rota hissi", "Takipçi artışı", "İçerik kalitesi artışı"],
    description:
      "Oyuncuya dünya turunun gerçekten başladığını hissettiren ilk uluslararası etap.",
    feeling: "Artık gerçekten yurt dışına açıldım.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "crete_crossing",
    order: 3,
    name: "Girit Geçişi",
    from: "Yunan Adaları",
    to: "Girit",
    region: "Doğu Akdeniz",
    routeType: "open_sea",
    difficulty: "medium",
    baseDurationDays: { min: 3, max: 7 },
    worldProgressPercent: 10,
    riskLevel: "medium",
    contentPotential: "high",
    sponsorPotential: "medium",
    requirements: {
      minSafety: 8,
      minNavigation: 5,
      minEnergy: 5,
      minWater: 5,
      minMaintenance: 8,
    },
    mainRisks: ["Hava değişimi", "Enerji tüketimi", "İlk ciddi açık deniz hissi"],
    contentThemes: ["Açık deniz", "İlk ciddi seyir", "Deniz vlogu", "Hazırlık testi"],
    rewards: ["Ciddi rota başarısı", "ViewTube içerik gücü", "Denizcilik deneyimi"],
    description:
      "Oyuncunun hava, enerji, su, yakıt ve bakım sistemlerini daha net hissetmeye başladığı ilk ciddi açık deniz rotası.",
    feeling: "Bu artık kısa marina gezisi değil; gerçek seyir başladı.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "malta",
    order: 4,
    name: "Malta",
    from: "Girit",
    to: "Malta",
    region: "Orta Akdeniz",
    routeType: "technical_stop",
    difficulty: "medium",
    baseDurationDays: { min: 5, max: 9 },
    worldProgressPercent: 15,
    riskLevel: "medium",
    contentPotential: "medium_high",
    sponsorPotential: "high",
    requirements: {
      minSafety: 12,
      minNavigation: 12,
      minEnergy: 10,
      minWater: 8,
      minMaintenance: 12,
    },
    mainRisks: ["Uzun Akdeniz geçişi", "Bakım eksikliği", "Kaynak tüketimi"],
    contentThemes: ["Teknik hazırlık", "Tarihi şehir", "Marina yaşamı", "Sponsor fırsatı"],
    rewards: ["Sponsor ilgisi", "Teknik hazırlık fırsatı", "Büyük rota öncesi toparlanma"],
    description:
      "Malta, teknik hazırlık ve sponsor fırsatı sunan önemli bir Akdeniz durak noktasıdır.",
    feeling: "Dünya turu artık büyüyor; hazırlığı ciddiye almalıyım.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "sicily",
    order: 5,
    name: "Sicilya",
    from: "Malta",
    to: "Sicilya",
    region: "İtalya Hattı",
    routeType: "mediterranean_crossing",
    difficulty: "medium",
    baseDurationDays: { min: 4, max: 8 },
    worldProgressPercent: 20,
    riskLevel: "medium",
    contentPotential: "high",
    sponsorPotential: "medium_high",
    requirements: {
      minSafety: 15,
      minNavigation: 15,
      minEnergy: 12,
      minWater: 10,
      minMaintenance: 15,
    },
    mainRisks: ["Orta seviye açık deniz", "Marina maliyeti", "Gecikme"],
    contentThemes: ["Kültür", "Yemek", "Şehir", "Rota vlogu"],
    rewards: ["Şehir içerik bonusu", "InstaSea potansiyeli", "ViewTube bölümü"],
    description:
      "Sicilya kültür, şehir, yemek ve rota içerikleri için güçlü bir bölgedir.",
    feeling: "Yolculuk artık sadece deniz değil, kültür ve hikaye de taşıyor.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "sardinia",
    order: 6,
    name: "Sardinya",
    from: "Sicilya",
    to: "Sardinya",
    region: "Batı Akdeniz",
    routeType: "island_hop",
    difficulty: "medium",
    baseDurationDays: { min: 4, max: 8 },
    worldProgressPercent: 25,
    riskLevel: "medium",
    contentPotential: "high",
    sponsorPotential: "medium_high",
    requirements: {
      minSafety: 18,
      minNavigation: 18,
      minEnergy: 15,
      minWater: 12,
      minMaintenance: 18,
    },
    mainRisks: ["Demirleme zorluğu", "Hava değişimi", "Kaynak tüketimi"],
    contentThemes: ["Doğa", "Koylar", "Demirleme", "Tekne rutini", "Lifestyle"],
    rewards: ["InstaSea içerik gücü", "FacePort sadakati", "Yaşam içeriği"],
    description:
      "Sardinya doğa, koy, demirleme ve yaşam içerikleri için güçlü bir etaptır.",
    feeling: "Tekne yaşamının güzelliği burada daha güçlü hissediliyor.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "balearic_islands",
    order: 7,
    name: "Balear Adaları",
    from: "Sardinya",
    to: "Balear Adaları",
    region: "İspanya Hattı",
    routeType: "island_hop",
    difficulty: "medium",
    baseDurationDays: { min: 5, max: 9 },
    worldProgressPercent: 30,
    riskLevel: "medium",
    contentPotential: "very_high",
    sponsorPotential: "high",
    requirements: {
      minSafety: 22,
      minNavigation: 20,
      minEnergy: 18,
      minWater: 15,
      minMaintenance: 20,
    },
    mainRisks: ["Yüksek marina maliyeti", "Sosyal harcama", "Rota gecikmesi"],
    contentThemes: ["Turizm", "Lifestyle", "Sosyal medya", "Kısa video"],
    rewards: ["Takipçi büyümesi", "Sponsor görünürlüğü", "ClipTok fırsatı"],
    description:
      "Balear hattı sosyal medya ve turizm potansiyeli yüksek bir büyüme bölgesidir.",
    feeling: "Burada görünürlük ve sosyal medya büyümesi hızlanabilir.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "gibraltar",
    order: 8,
    name: "Cebelitarık",
    from: "Balear Adaları",
    to: "Cebelitarık",
    region: "Akdeniz Çıkışı",
    routeType: "ocean_gate",
    difficulty: "medium_hard",
    baseDurationDays: { min: 5, max: 10 },
    worldProgressPercent: 35,
    riskLevel: "medium_high",
    contentPotential: "high",
    sponsorPotential: "medium_high",
    requirements: {
      minSafety: 28,
      minNavigation: 25,
      minEnergy: 22,
      minWater: 18,
      minMaintenance: 25,
    },
    mainRisks: ["Atlantik öncesi hazırlık eksiği", "Sert hava", "Bakım zafiyeti"],
    contentThemes: ["Büyük eşik", "Atlantik hazırlığı", "Tekne kontrolü"],
    rewards: ["Atlantik kapısı açılır", "Sponsor güveni", "Hazırlık bilinci"],
    description:
      "Cebelitarık, Akdeniz’den Atlantik’e çıkış kapısıdır ve psikolojik eşik gibi hissettirilmelidir.",
    feeling: "Artık kıyı kıyı gezmek bitiyor; büyük okyanus yaklaşıyor.",
    isOceanGate: true,
    isOceanCrossing: false,
  },
  {
    id: "canary_islands",
    order: 9,
    name: "Kanarya Adaları",
    from: "Cebelitarık",
    to: "Kanarya Adaları",
    region: "Atlantik Hazırlık",
    routeType: "ocean_gate",
    difficulty: "hard",
    baseDurationDays: { min: 7, max: 12 },
    worldProgressPercent: 40,
    riskLevel: "high",
    contentPotential: "high",
    sponsorPotential: "high",
    requirements: {
      minSafety: 35,
      minNavigation: 30,
      minEnergy: 25,
      minWater: 22,
      minMaintenance: 30,
      minOceanReadiness: 30,
    },
    mainRisks: ["Atlantik öncesi eksik hazırlık", "Uzayan seyir", "Kaynak tüketimi"],
    contentThemes: ["Okyanus hazırlığı", "Son kontroller", "Tekne turu", "Sponsor hazırlığı"],
    rewards: ["Atlantik checklist açılır", "Büyük geçiş hazırlığı", "Yüksek içerik potansiyeli"],
    description:
      "Kanarya Adaları, Atlantik geçişinden önceki son büyük hazırlık noktasıdır.",
    feeling: "Büyük sınavdan önce son hazırlık burası.",
    isOceanGate: true,
    isOceanCrossing: false,
  },
  {
    id: "atlantic_crossing",
    order: 10,
    name: "Atlantik Geçişi",
    from: "Kanarya Adaları",
    to: "Karayipler",
    region: "Atlantik Okyanusu",
    routeType: "ocean_crossing",
    difficulty: "very_hard",
    baseDurationDays: { min: 18, max: 25 },
    worldProgressPercent: 50,
    riskLevel: "very_high",
    contentPotential: "very_high",
    sponsorPotential: "high",
    requirements: {
      minSafety: 45,
      minNavigation: 35,
      minEnergy: 30,
      minWater: 32,
      minMaintenance: 35,
      minOceanReadiness: 50,
    },
    mainRisks: ["Fırtına", "Enerji krizi", "Su yönetimi", "Yelken hasarı", "Moral düşüşü"],
    contentThemes: ["Büyük macera", "Okyanus yalnızlığı", "Fırtına vlogu", "Belgesel"],
    rewards: ["Büyük takipçi artışı", "ViewTube patlaması", "Sponsor güveni", "Okyanus kaptanı algısı"],
    description:
      "Oyunun ilk büyük okyanus testidir. Tekne, hazırlık ve oyuncu kararları burada gerçek sınav verir.",
    feeling: "Teknem ve ben ilk büyük sınavımıza çıkıyoruz.",
    isOceanGate: false,
    isOceanCrossing: true,
  },
  {
    id: "caribbean",
    order: 11,
    name: "Karayipler",
    from: "Atlantik Geçişi",
    to: "Karayipler",
    region: "Tropik Bölge",
    routeType: "reward_region",
    difficulty: "medium",
    baseDurationDays: { min: 5, max: 10 },
    worldProgressPercent: 58,
    riskLevel: "medium",
    contentPotential: "very_high",
    sponsorPotential: "very_high",
    requirements: {
      minSafety: 45,
      minNavigation: 35,
      minEnergy: 30,
      minWater: 32,
      minMaintenance: 35,
    },
    mainRisks: ["Tropik hava", "Maliyet artışı", "Fazla rahatlama"],
    contentThemes: ["Tropik yaşam", "Ada gezisi", "Yüzme", "Dalış", "Canlı yayın"],
    rewards: ["Büyük takipçi büyümesi", "Sponsor fırsatları", "Lifestyle içerik gücü"],
    description:
      "Atlantik geçişinden sonra ödül bölgesi gibi hissettirilmelidir.",
    feeling: "Büyük zorluğu geçtim; şimdi ödül ve büyüme zamanı.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "panama",
    order: 12,
    name: "Panama",
    from: "Karayipler",
    to: "Panama",
    region: "Kanal Geçişi",
    routeType: "technical_stop",
    difficulty: "medium_hard",
    baseDurationDays: { min: 6, max: 12 },
    worldProgressPercent: 65,
    riskLevel: "medium_high",
    contentPotential: "high",
    sponsorPotential: "medium_high",
    requirements: {
      minSafety: 50,
      minNavigation: 38,
      minEnergy: 32,
      minWater: 35,
      minMaintenance: 38,
      minOceanReadiness: 55,
    },
    mainRisks: ["Kanal geçiş maliyeti", "Bekleme", "Teknik hazırlık"],
    contentThemes: ["Dünya turu dönüm noktası", "Kanal geçişi", "Hazırlık"],
    rewards: ["Pasifik yolu açılır", "Prestij artar", "Dünya turu algısı güçlenir"],
    description:
      "Panama, Atlantik tarafından Pasifik’e geçişin büyük dönüm noktasıdır.",
    feeling: "Dünya turunun yarısından fazlası artık geride kalıyor.",
    isOceanGate: true,
    isOceanCrossing: false,
  },
  {
    id: "pacific_islands",
    order: 13,
    name: "Pasifik Adaları",
    from: "Panama",
    to: "Pasifik Adaları",
    region: "Pasifik",
    routeType: "ocean_crossing",
    difficulty: "very_hard",
    baseDurationDays: { min: 20, max: 30 },
    worldProgressPercent: 75,
    riskLevel: "very_high",
    contentPotential: "very_high",
    sponsorPotential: "high",
    requirements: {
      minSafety: 60,
      minNavigation: 45,
      minEnergy: 38,
      minWater: 40,
      minMaintenance: 42,
      minOceanReadiness: 70,
    },
    mainRisks: ["Uzun mesafe", "Su ve enerji tüketimi", "İzolasyon", "Arıza durumunda yardım zorluğu"],
    contentThemes: ["Keşif", "Yalnızlık", "Belgesel", "Nadir lokasyonlar"],
    rewards: ["Çok güçlü keşif içerikleri", "Maceracı bonusları", "ViewTube belgesel etkisi"],
    description:
      "Pasifik hattı oyunun en uzun ve en yalnız hissettiren bölümlerinden biridir.",
    feeling: "Artık gerçekten dünyanın öbür ucundayım.",
    isOceanGate: false,
    isOceanCrossing: true,
  },
  {
    id: "australia",
    order: 14,
    name: "Avustralya",
    from: "Pasifik Adaları",
    to: "Avustralya",
    region: "Güney Yarımküre",
    routeType: "technical_stop",
    difficulty: "hard",
    baseDurationDays: { min: 10, max: 16 },
    worldProgressPercent: 82,
    riskLevel: "high",
    contentPotential: "high",
    sponsorPotential: "high",
    requirements: {
      minSafety: 60,
      minNavigation: 45,
      minEnergy: 38,
      minWater: 40,
      minMaintenance: 42,
    },
    mainRisks: ["Uzun Pasifik yorgunluğu", "Büyük bakım ihtiyacı", "Yüksek maliyet"],
    contentThemes: ["Büyük bakım", "Yeni pazar", "Şehir içerikleri", "Toparlanma"],
    rewards: ["Tekne yenileme fırsatı", "Yeni sponsorlar", "Büyük içerik serisi"],
    description:
      "Avustralya, uzun Pasifik yorgunluğundan sonra toparlanma ve güçlenme noktasıdır.",
    feeling: "Uzun yolun ardından tekneyi yeniden güçlendirme zamanı.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "indian_ocean",
    order: 15,
    name: "Hint Okyanusu",
    from: "Avustralya",
    to: "Hint Okyanusu Hattı",
    region: "Hint Okyanusu",
    routeType: "ocean_crossing",
    difficulty: "very_hard",
    baseDurationDays: { min: 18, max: 28 },
    worldProgressPercent: 90,
    riskLevel: "very_high",
    contentPotential: "very_high",
    sponsorPotential: "medium_high",
    requirements: {
      minSafety: 70,
      minNavigation: 50,
      minEnergy: 42,
      minWater: 45,
      minMaintenance: 45,
      minOceanReadiness: 80,
    },
    mainRisks: ["İkinci büyük dayanıklılık testi", "Sert hava", "Uzun seyir", "Yedek parça ihtiyacı"],
    contentThemes: ["Dayanıklılık", "Büyük final testi", "Okyanus günlükleri"],
    rewards: ["Dünya turu kaptanı algısı", "Finale yaklaşma", "Güçlü belgesel içeriği"],
    description:
      "Hint Okyanusu, oyunun ikinci büyük dayanıklılık testidir.",
    feeling: "Artık gerçek bir dünya turu kaptanı olup olmadığım belli olacak.",
    isOceanGate: false,
    isOceanCrossing: true,
  },
  {
    id: "return_route",
    order: 16,
    name: "Dönüş Rotası",
    from: "Hint Okyanusu",
    to: "Akdeniz Dönüş Hattı",
    region: "Kızıldeniz / Akdeniz",
    routeType: "final_return",
    difficulty: "hard",
    baseDurationDays: { min: 10, max: 20 },
    worldProgressPercent: 97,
    riskLevel: "high",
    contentPotential: "high",
    sponsorPotential: "medium_high",
    requirements: {
      minSafety: 70,
      minNavigation: 50,
      minEnergy: 42,
      minWater: 45,
      minMaintenance: 45,
      minOceanReadiness: 80,
    },
    mainRisks: ["Final yorgunluğu", "Tekne yıpranması", "Kaynak yönetimi"],
    contentThemes: ["Eve dönüş", "Dünya turu özeti", "En iyi anlar", "Tekne dönüşümü"],
    rewards: ["Finale yaklaşma", "Takipçi patlaması", "Duygusal içerik gücü"],
    description:
      "Oyuncu Türkiye’ye dönmeye hazırlanır. Bu aşama final yaklaşımıdır.",
    feeling: "Artık eve dönüş başladı.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
  {
    id: "return_to_turkiye",
    order: 17,
    name: "Türkiye’ye Dönüş",
    from: "Dönüş Rotası",
    to: "Türkiye",
    region: "Türkiye",
    routeType: "final_return",
    difficulty: "final",
    baseDurationDays: { min: 3, max: 7 },
    worldProgressPercent: 100,
    riskLevel: "medium",
    contentPotential: "very_high",
    sponsorPotential: "high",
    requirements: {
      minSafety: 70,
      minNavigation: 50,
      minEnergy: 42,
      minWater: 45,
      minMaintenance: 45,
      minOceanReadiness: 80,
    },
    mainRisks: ["Final öncesi eksik hedefler", "Takipçi hedefinin tamamlanmamış olması"],
    contentThemes: ["Eve dönüş", "Başarı", "Final serisi", "Dünya turu kutlaması"],
    rewards: ["Dünya turu tamamlanır", "Final ekranı açılabilir", "Büyük marka değeri"],
    description:
      "Final etabıdır. Oyuncu dünya turunu tamamlar ama kazanmak için 1 milyon takipçi ve okyanus hazır tekne şartları da gerekir.",
    feeling: "Türkiye’ye döndüm. Yolculuk tamamlandı, şimdi final şartları kontrol ediliyor.",
    isOceanGate: false,
    isOceanCrossing: false,
  },
];

export function getWorldRouteById(id: RouteId): WorldRoute | undefined {
  return WORLD_ROUTES.find((route) => route.id === id);
}

export function getNextRoute(currentRouteId: RouteId): WorldRoute | undefined {
  const currentRoute = getWorldRouteById(currentRouteId);

  if (!currentRoute) {
    return WORLD_ROUTES[0];
  }

  return WORLD_ROUTES.find((route) => route.order === currentRoute.order + 1);
}

export function getRouteProgressPercent(routeId: RouteId): number {
  return getWorldRouteById(routeId)?.worldProgressPercent ?? 0;
}

export function getOceanCrossingRoutes(): WorldRoute[] {
  return WORLD_ROUTES.filter((route) => route.isOceanCrossing);
}

export function getOceanGateRoutes(): WorldRoute[] {
  return WORLD_ROUTES.filter((route) => route.isOceanGate);
}
