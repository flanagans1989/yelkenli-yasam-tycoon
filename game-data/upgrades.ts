export type UpgradeCategoryId =
  | "energy"
  | "navigation"
  | "safety"
  | "sail_speed"
  | "engine_mechanical"
  | "water_life"
  | "comfort"
  | "content_equipment"
  | "hull_maintenance"
  | "auxiliary_seamanship";

export type BoatId = "kirlangic_28" | "denizkusu_34" | "atlas_40";

export type MarinaRequirement = "any" | "medium" | "large" | "shipyard";

export type UpgradeSize = "small" | "medium" | "large" | "ocean";

export type UpgradeRole =
  | "essential"     // core resource / readiness — needed for progression
  | "performance"   // speed / efficiency boosts
  | "safety"        // safety equipment
  | "ocean"         // ocean-crossing / blue-water specific
  | "content"       // content / camera / streaming gear
  | "comfort"       // quality of life
  | "optional";     // luxury / late-game progression-lux

export interface UpgradeEffects {
  energy?: number;
  navigation?: number;
  safety?: number;
  speed?: number;
  engine?: number;
  water?: number;
  comfort?: number;
  contentQuality?: number;
  sponsorPotential?: number;
  maintenance?: number;
  oceanReadiness?: number;
  riskReduction?: number;
}

export interface BoatCompatibility {
  boatId: BoatId;
  compatible: boolean;
  efficiency: "poor" | "limited" | "normal" | "good" | "excellent";
  note: string;
}

export interface BoatUpgrade {
  id: string;
  categoryId: UpgradeCategoryId;
  name: string;
  size: UpgradeSize;
  description: string;
  cost: number;
  installDays: number;
  marinaRequirement: MarinaRequirement;
  effects: UpgradeEffects;
  compatibility: BoatCompatibility[];
  unlockHint: string;
  /** Optional explicit role tag. Falls back to category-derived default via getUpgradeRole(). */
  role?: UpgradeRole;
}

const CATEGORY_TO_DEFAULT_ROLE: Record<UpgradeCategoryId, UpgradeRole> = {
  energy: "essential",
  navigation: "essential",
  safety: "safety",
  sail_speed: "performance",
  engine_mechanical: "essential",
  water_life: "essential",
  comfort: "comfort",
  content_equipment: "content",
  hull_maintenance: "essential",
  auxiliary_seamanship: "performance",
};

/**
 * Returns the role label for an upgrade. Explicit `role` overrides win;
 * otherwise the category default is used. Every BoatUpgrade has a role.
 */
export function getUpgradeRole(upgrade: BoatUpgrade): UpgradeRole {
  return upgrade.role ?? CATEGORY_TO_DEFAULT_ROLE[upgrade.categoryId];
}

export interface UpgradeCategory {
  id: UpgradeCategoryId;
  name: string;
  description: string;
  mainEffect: string;
}

export const UPGRADE_CATEGORIES: UpgradeCategory[] = [
  {
    id: "energy",
    name: "Enerji Sistemi",
    description: "Elektrik, içerik üretimi, navigasyon ve yaşam desteği.",
    mainEffect: "Enerji krizi riskini azaltır ve içerik üretimini güçlendirir.",
  },
  {
    id: "navigation",
    name: "Navigasyon",
    description: "Rota güvenliği, süre ve okyanus geçiş yeterliliği.",
    mainEffect: "Rota sapması ve seyir riskini azaltır.",
  },
  {
    id: "safety",
    name: "Güvenlik",
    description: "Fırtına, kriz ve okyanus geçişi güvenliği.",
    mainEffect: "Büyük rotalar ve okyanus geçişleri için kritik hazırlık sağlar.",
  },
  {
    id: "sail_speed",
    name: "Yelken / Hız",
    description: "Seyir performansı, rota süresi ve fırtına dayanıklılığı.",
    mainEffect: "Seyahat süresini azaltır ve yelken riskini düşürür.",
  },
  {
    id: "engine_mechanical",
    name: "Motor / Mekanik",
    description: "Motor güvenilirliği, acil destek ve mekanik bakım.",
    mainEffect: "Motor arızası ve acil durum riskini azaltır.",
  },
  {
    id: "water_life",
    name: "Su / Yaşam",
    description: "Su kapasitesi, uzun seyir ve yaşam desteği.",
    mainEffect: "Uzun rota ve okyanus hazırlığını güçlendirir.",
  },
  {
    id: "comfort",
    name: "Konfor",
    description: "Moral, lifestyle içerik ve aile yaşamı.",
    mainEffect: "Yaşam kalitesini ve lifestyle içerik performansını artırır.",
  },
  {
    id: "content_equipment",
    name: "İçerik Ekipmanı",
    description: "Kamera, drone, mikrofon, laptop ve yayın ekipmanı.",
    mainEffect: "Takipçi, gelir, viral şans ve sponsor uyumunu artırır.",
  },
  {
    id: "hull_maintenance",
    name: "Gövde / Bakım",
    description: "Teknenin fiziksel dayanıklılığı ve uzun rota güvenliği.",
    mainEffect: "Hasar, su alma ve büyük arıza risklerini azaltır.",
  },
  {
    id: "auxiliary_seamanship",
    name: "Yardımcı Denizcilik",
    description: "Demirleme, bot, halat, yedek parça ve marina bağımsızlığı.",
    mainEffect: "Keşif, demirleme ve küçük kriz müdahale kapasitesini artırır.",
  },
];

const allBoatsNormal: BoatCompatibility[] = [
  {
    boatId: "kirlangic_28",
    compatible: true,
    efficiency: "normal",
    note: "Küçük teknede temel düzeyde çalışır.",
  },
  {
    boatId: "denizkusu_34",
    compatible: true,
    efficiency: "good",
    note: "Dengeli teknede iyi verim verir.",
  },
  {
    boatId: "atlas_40",
    compatible: true,
    efficiency: "excellent",
    note: "Büyük teknede yüksek verim verir.",
  },
];

export const BOAT_UPGRADES: BoatUpgrade[] = [
  {
    id: "small_solar_panel",
    categoryId: "energy",
    name: "Küçük Güneş Paneli",
    size: "small",
    description: "Günlük enerji üretimini artıran temel güneş paneli sistemi.",
    cost: 3500,
    installDays: 1,
    marinaRequirement: "any",
    effects: {
      energy: 8,
      contentQuality: 2,
      oceanReadiness: 2,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "large_solar_array",
    categoryId: "energy",
    name: "Büyük Güneş Paneli Sistemi",
    size: "medium",
    description: "Uzun seyir ve yoğun içerik üretimi için güçlü enerji üretimi sağlar.",
    cost: 12000,
    installDays: 3,
    marinaRequirement: "medium",
    effects: {
      energy: 18,
      contentQuality: 4,
      oceanReadiness: 5,
    },
    compatibility: [
      {
        boatId: "kirlangic_28",
        compatible: true,
        efficiency: "limited",
        note: "Alan kısıtlı olduğu için verim sınırlıdır.",
      },
      {
        boatId: "denizkusu_34",
        compatible: true,
        efficiency: "good",
        note: "Dengeli verim verir.",
      },
      {
        boatId: "atlas_40",
        compatible: true,
        efficiency: "excellent",
        note: "Geniş yüzey sayesinde çok verimlidir.",
      },
    ],
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "lithium_battery_bank",
    categoryId: "energy",
    name: "Lityum Akü Bankası",
    size: "large",
    description: "Enerji depolama kapasitesini ciddi şekilde artırır.",
    cost: 22000,
    installDays: 5,
    marinaRequirement: "large",
    effects: {
      energy: 25,
      contentQuality: 5,
      oceanReadiness: 8,
      riskReduction: 3,
    },
    compatibility: [
      {
        boatId: "kirlangic_28",
        compatible: true,
        efficiency: "limited",
        note: "Kapasite ve alan sınırlıdır.",
      },
      {
        boatId: "denizkusu_34",
        compatible: true,
        efficiency: "good",
        note: "İyi verim verir.",
      },
      {
        boatId: "atlas_40",
        compatible: true,
        efficiency: "excellent",
        note: "Uzun seyir için çok uygundur.",
      },
    ],
    unlockHint: "Büyük marina gerekir.",
  },
  {
    id: "basic_gps",
    categoryId: "navigation",
    name: "Temel GPS",
    size: "small",
    description: "Temel rota güvenliği ve konum takibi sağlar.",
    cost: 2500,
    installDays: 1,
    marinaRequirement: "any",
    effects: {
      navigation: 8,
      oceanReadiness: 2,
      riskReduction: 2,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "chartplotter",
    categoryId: "navigation",
    name: "Chartplotter",
    size: "medium",
    description: "Rota planlama, güvenli seyir ve açık deniz hazırlığı sağlar.",
    cost: 9000,
    installDays: 2,
    marinaRequirement: "medium",
    effects: {
      navigation: 18,
      oceanReadiness: 6,
      riskReduction: 4,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "radar_system",
    categoryId: "navigation",
    name: "Radar Sistemi",
    size: "large",
    description: "Kötü hava, gece seyri ve okyanus geçişlerinde güvenliği artırır.",
    cost: 18000,
    installDays: 4,
    marinaRequirement: "large",
    effects: {
      navigation: 22,
      safety: 8,
      oceanReadiness: 8,
      riskReduction: 6,
    },
    compatibility: [
      {
        boatId: "kirlangic_28",
        compatible: true,
        efficiency: "limited",
        note: "Kurulum mümkündür ama küçük teknede verim sınırlıdır.",
      },
      {
        boatId: "denizkusu_34",
        compatible: true,
        efficiency: "good",
        note: "Güçlü verim verir.",
      },
      {
        boatId: "atlas_40",
        compatible: true,
        efficiency: "excellent",
        note: "Okyanus seyri için çok uygundur.",
      },
    ],
    unlockHint: "Büyük marina gerekir.",
  },
  {
    id: "ais_transponder",
    categoryId: "navigation",
    name: "AIS Transponder",
    size: "ocean",
    description:
      "Okyanus geçişlerinde gemi takibi ve çarpışma önleme sistemi.",
    cost: 16000,
    installDays: 3,
    marinaRequirement: "shipyard",
    effects: {
      navigation: 5,
      safety: 3,
      oceanReadiness: 5,
      riskReduction: 3,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Tersane gerekir.",
    role: "ocean",
  },
  {
    id: "basic_safety_kit",
    categoryId: "safety",
    name: "Temel Güvenlik Seti",
    size: "small",
    description: "Can yelekleri, işaret fişekleri ve temel ilk yardım malzemeleri.",
    cost: 2000,
    installDays: 0,
    marinaRequirement: "any",
    effects: {
      safety: 8,
      riskReduction: 3,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "life_raft",
    categoryId: "safety",
    name: "Can Salı",
    size: "medium",
    description: "Büyük rota ve okyanus geçişi için kritik güvenlik ekipmanıdır.",
    cost: 8500,
    installDays: 1,
    marinaRequirement: "medium",
    effects: {
      safety: 18,
      oceanReadiness: 8,
      riskReduction: 5,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "epirb",
    categoryId: "safety",
    name: "EPIRB Acil Sinyal Sistemi",
    size: "medium",
    description: "Okyanus geçişi için kritik acil durum sinyal sistemidir.",
    cost: 11000,
    installDays: 1,
    marinaRequirement: "large",
    effects: {
      safety: 20,
      oceanReadiness: 10,
      riskReduction: 7,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Büyük marina gerekir.",
    role: "ocean",
  },
  {
    id: "storm_equipment",
    categoryId: "safety",
    name: "Fırtına Ekipmanı",
    size: "large",
    description: "Sert hava ve fırtına olaylarında hasar riskini azaltır.",
    cost: 14000,
    installDays: 3,
    marinaRequirement: "medium",
    effects: {
      safety: 18,
      oceanReadiness: 7,
      riskReduction: 8,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "new_main_sail",
    categoryId: "sail_speed",
    name: "Yeni Ana Yelken",
    size: "large",
    description: "Seyir performansını, rota süresini ve fırtına dayanıklılığını artırır.",
    cost: 19000,
    installDays: 4,
    marinaRequirement: "medium",
    effects: {
      speed: 18,
      safety: 5,
      oceanReadiness: 7,
      riskReduction: 4,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "halyard_rope_set",
    categoryId: "sail_speed",
    name: "Halat Yenileme Seti",
    size: "small",
    description: "Yelken arızası ve fırtına sırasında ekipman riski azalır.",
    cost: 4000,
    installDays: 1,
    marinaRequirement: "any",
    effects: {
      speed: 5,
      maintenance: 5,
      oceanReadiness: 3,
      riskReduction: 4,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "engine_service",
    categoryId: "engine_mechanical",
    name: "Motor Bakımı",
    size: "small",
    description: "Motor arızası riskini azaltan temel bakım işlemidir.",
    cost: 5500,
    installDays: 1,
    marinaRequirement: "any",
    effects: {
      engine: 10,
      maintenance: 8,
      oceanReadiness: 3,
      riskReduction: 5,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren yapılabilir.",
  },
  {
    id: "fuel_system_upgrade",
    categoryId: "engine_mechanical",
    name: "Yakıt Sistemi Yenileme",
    size: "medium",
    description: "Uzun rotalarda motor güvenilirliğini ve acil destek kapasitesini artırır.",
    cost: 12500,
    installDays: 3,
    marinaRequirement: "large",
    effects: {
      engine: 16,
      maintenance: 6,
      oceanReadiness: 6,
      riskReduction: 5,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Büyük marina gerekir.",
  },
  {
    id: "spare_water_jugs",
    categoryId: "water_life",
    name: "Yedek Su Bidonları",
    size: "small",
    description: "Kısa rotalar ve kriz durumları için yedek su kapasitesi sağlar.",
    cost: 1500,
    installDays: 0,
    marinaRequirement: "any",
    effects: {
      water: 8,
      oceanReadiness: 1,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "water_tank_expansion",
    categoryId: "water_life",
    name: "Su Tankı Artışı",
    size: "medium",
    description: "Uzun seyirlerde su kapasitesini artırır.",
    cost: 8500,
    installDays: 2,
    marinaRequirement: "medium",
    effects: {
      water: 16,
      comfort: 3,
      oceanReadiness: 6,
    },
    compatibility: [
      {
        boatId: "kirlangic_28",
        compatible: true,
        efficiency: "limited",
        note: "Küçük teknede tank kapasitesi sınırlıdır.",
      },
      {
        boatId: "denizkusu_34",
        compatible: true,
        efficiency: "good",
        note: "İyi verim verir.",
      },
      {
        boatId: "atlas_40",
        compatible: true,
        efficiency: "excellent",
        note: "Uzun seyir için çok uygundur.",
      },
    ],
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "watermaker",
    categoryId: "water_life",
    name: "Su Yapıcı",
    size: "ocean",
    description: "Okyanus geçişleri için çok güçlü su güvenliği sağlar.",
    cost: 28000,
    installDays: 6,
    marinaRequirement: "large",
    effects: {
      water: 30,
      safety: 5,
      comfort: 5,
      oceanReadiness: 12,
      riskReduction: 6,
    },
    compatibility: [
      {
        boatId: "kirlangic_28",
        compatible: true,
        efficiency: "poor",
        note: "Küçük teknede zor ve sınırlı verimlidir.",
      },
      {
        boatId: "denizkusu_34",
        compatible: true,
        efficiency: "good",
        note: "Okyanus hazırlığı için güçlü katkı verir.",
      },
      {
        boatId: "atlas_40",
        compatible: true,
        efficiency: "excellent",
        note: "Büyük tekne için çok uygundur.",
      },
    ],
    unlockHint: "Büyük marina gerekir.",
    role: "ocean",
  },
  {
    id: "better_beds",
    categoryId: "comfort",
    name: "Kabin Yatakları",
    size: "small",
    description: "Uzun seyirde moral ve tekne yaşamı kalitesini artırır.",
    cost: 4500,
    installDays: 1,
    marinaRequirement: "any",
    effects: {
      comfort: 10,
      contentQuality: 3,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "fridge_system",
    categoryId: "comfort",
    name: "Buzdolabı Sistemi",
    size: "medium",
    description: "Yaşam konforunu ve uzun rota hazırlığını güçlendirir.",
    cost: 7500,
    installDays: 2,
    marinaRequirement: "medium",
    effects: {
      comfort: 12,
      water: 2,
      contentQuality: 3,
      oceanReadiness: 2,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "air_conditioning",
    categoryId: "comfort",
    name: "Klima",
    size: "large",
    description: "Konforu çok artırır ama güçlü enerji sistemi ister.",
    cost: 24000,
    installDays: 5,
    marinaRequirement: "large",
    effects: {
      comfort: 25,
      contentQuality: 5,
    },
    compatibility: [
      {
        boatId: "kirlangic_28",
        compatible: false,
        efficiency: "poor",
        note: "Küçük teknede önerilmez.",
      },
      {
        boatId: "denizkusu_34",
        compatible: true,
        efficiency: "limited",
        note: "Enerji sistemi güçlüyse sınırlı kullanılabilir.",
      },
      {
        boatId: "atlas_40",
        compatible: true,
        efficiency: "excellent",
        note: "Atlas 40 için çok uygundur.",
      },
    ],
    unlockHint: "Büyük marina ve güçlü enerji sistemi gerekir.",
  },
  {
    id: "captains_quarters",
    categoryId: "comfort",
    name: "Kaptan Kamarası",
    size: "large",
    description: "Kapsamlı kabin dönüşümü. Çevrimdışı gelir birikme süresi 4 saatten 8 saate çıkar.",
    cost: 35000,
    installDays: 7,
    marinaRequirement: "large",
    effects: {
      comfort: 20,
      contentQuality: 5,
    },
    compatibility: [
      {
        boatId: "kirlangic_28",
        compatible: true,
        efficiency: "limited",
        note: "Küçük teknede kabin alanı kısıtlıdır.",
      },
      {
        boatId: "denizkusu_34",
        compatible: true,
        efficiency: "good",
        note: "Dengeli tekne için ideal konfor artışı sağlar.",
      },
      {
        boatId: "atlas_40",
        compatible: true,
        efficiency: "excellent",
        note: "Büyük tekne için maksimum yaşam kalitesi sağlar.",
      },
    ],
    unlockHint: "Büyük marina gerekir. Çevrimdışı geliri 8 saate kadar biriktirir.",
    role: "optional",
  },
  {
    id: "action_camera",
    categoryId: "content_equipment",
    name: "Aksiyon Kamera",
    size: "small",
    description: "Deniz, fırtına ve kısa video içeriklerini güçlendirir.",
    cost: 3500,
    installDays: 0,
    marinaRequirement: "any",
    effects: {
      contentQuality: 10,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "drone",
    categoryId: "content_equipment",
    name: "Drone",
    size: "medium",
    description: "Görsel içerik, koy, marina ve lifestyle paylaşımlarını ciddi güçlendirir.",
    cost: 12000,
    installDays: 0,
    marinaRequirement: "medium",
    effects: {
      contentQuality: 20,
      sponsorPotential: 0,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina veya şehir içi alışveriş gerekir.",
  },
  {
    id: "editing_laptop",
    categoryId: "content_equipment",
    name: "Kurgu Laptopu",
    size: "medium",
    description: "ViewTube gelirini ve uzun video kalitesini artırır.",
    cost: 15000,
    installDays: 0,
    marinaRequirement: "medium",
    effects: {
      contentQuality: 18,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina veya şehir alışverişi gerekir.",
  },
  {
    id: "satellite_internet",
    categoryId: "content_equipment",
    name: "Uydu İnterneti",
    size: "ocean",
    description: "Denizden yayın, okyanus günlüğü ve acil iletişim için güçlü sistemdir.",
    cost: 26000,
    installDays: 3,
    marinaRequirement: "large",
    effects: {
      contentQuality: 20,
      navigation: 5,
      safety: 5,
      oceanReadiness: 6,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Büyük marina gerekir.",
    role: "ocean",
  },
  {
    id: "regular_service_pack",
    categoryId: "hull_maintenance",
    name: "Düzenli Servis Paketi",
    size: "small",
    description: "Teknenin genel tesisat, arma ve güverte bakımını içeren temel servis.",
    cost: 3500,
    installDays: 1,
    marinaRequirement: "any",
    effects: {
      maintenance: 8,
      riskReduction: 3,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "long_voyage_maintenance",
    categoryId: "hull_maintenance",
    name: "Uzun Yol Bakım Seti",
    size: "medium",
    description: "Açık deniz öncesi kritik parçaların değişimi ve detaylı kontrolü.",
    cost: 6500,
    installDays: 2,
    marinaRequirement: "medium",
    effects: {
      maintenance: 12,
      oceanReadiness: 5,
      riskReduction: 4,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "antifouling",
    categoryId: "hull_maintenance",
    name: "Antifouling",
    size: "large",
    description: "Gövde sağlığını ve seyir performansını artıran tersane bakımıdır.",
    cost: 14000,
    installDays: 4,
    marinaRequirement: "shipyard",
    effects: {
      speed: 8,
      maintenance: 12,
      oceanReadiness: 6,
      riskReduction: 4,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Tersane veya güçlü teknik marina gerekir.",
  },
  {
    id: "hull_inspection",
    categoryId: "hull_maintenance",
    name: "Gövde Kontrolü",
    size: "medium",
    description: "Hasar ve su alma riskini azaltan temel gövde kontrolüdür.",
    cost: 8000,
    installDays: 2,
    marinaRequirement: "medium",
    effects: {
      maintenance: 12,
      safety: 5,
      oceanReadiness: 6,
      riskReduction: 6,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "dinghy",
    categoryId: "auxiliary_seamanship",
    name: "Yedek Bot",
    size: "medium",
    description: "Kıyıya çıkış, koy keşfi ve yardımcı denizcilik kapasitesi sağlar.",
    cost: 7500,
    installDays: 1,
    marinaRequirement: "medium",
    effects: {
      comfort: 4,
      contentQuality: 5,
      oceanReadiness: 2,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Orta seviye marina gerekir.",
  },
  {
    id: "anchor_chain_set",
    categoryId: "auxiliary_seamanship",
    name: "Çapa ve Zincir Seti",
    size: "small",
    description: "Güvenli demirleme ve marina dışı konaklama kapasitesini artırır.",
    cost: 5000,
    installDays: 1,
    marinaRequirement: "any",
    effects: {
      safety: 6,
      comfort: 3,
      oceanReadiness: 3,
      riskReduction: 4,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
  {
    id: "spare_parts_box",
    categoryId: "auxiliary_seamanship",
    name: "Yedek Parça Kutusu",
    size: "small",
    description: "Deniz modunda küçük krizlerin etkisini azaltır.",
    cost: 4500,
    installDays: 0,
    marinaRequirement: "any",
    effects: {
      maintenance: 5,
      engine: 3,
      safety: 3,
      oceanReadiness: 3,
      riskReduction: 5,
    },
    compatibility: allBoatsNormal,
    unlockHint: "Başlangıçtan itibaren alınabilir.",
  },
];

export function getUpgradeById(id: string): BoatUpgrade | undefined {
  return BOAT_UPGRADES.find((upgrade) => upgrade.id === id);
}

export function getUpgradesByCategory(
  categoryId: UpgradeCategoryId
): BoatUpgrade[] {
  return BOAT_UPGRADES.filter((upgrade) => upgrade.categoryId === categoryId);
}

export function getCompatibleUpgradesForBoat(boatId: BoatId): BoatUpgrade[] {
  return BOAT_UPGRADES.filter((upgrade) =>
    upgrade.compatibility.some(
      (item) => item.boatId === boatId && item.compatible
    )
  );
}

export function getOceanReadinessFromUpgrades(upgradeIds: string[]): number {
  return upgradeIds.reduce((total, upgradeId) => {
    const upgrade = getUpgradeById(upgradeId);
    return total + (upgrade?.effects.oceanReadiness ?? 0);
  }, 0);
}