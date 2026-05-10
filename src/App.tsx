import { useState, useEffect, useRef } from "react";
import "./App.css";

import type { Step, Tab, ContentResult, MarinaFilter } from "./types/game";
import { PLAYER_PROFILES } from "../game-data/playerProfiles";
import type { PlayerProfile } from "../game-data/playerProfiles";
import { STARTING_MARINAS } from "../game-data/marinas";
import type { StartingMarina } from "../game-data/marinas";
import { STARTING_BOATS, STARTING_BUDGET } from "../game-data/boats";
import type { StartingBoat } from "../game-data/boats";
import { WORLD_ROUTES, getNextRoute } from "../game-data/routes";
import type { RouteId } from "../game-data/routes";
import { SOCIAL_PLATFORMS } from "../game-data/socialPlatforms";
import { BOAT_UPGRADES, UPGRADE_CATEGORIES } from "../game-data/upgrades";
import type { UpgradeCategoryId } from "../game-data/upgrades";
import { getSponsorTierByFollowers, SPONSOR_TIERS } from "../game-data/economy";
import { AppBackground } from "./components/AppBackground";
import { Onboarding, getBoatSvg } from "./components/Onboarding";
import { HubScreen } from "./components/HubScreen";
import { LimanTab } from "./components/LimanTab";
import { RotaTab } from "./components/RotaTab";
import { SeaModeTab } from "./components/SeaModeTab";
import { KaptanTab } from "./components/KaptanTab";
import { ArrivalScreen } from "./components/ArrivalScreen";
import { CelebrationModal } from "./components/CelebrationModal";
import type { CelebrationItem } from "./components/CelebrationModal";

const SAVE_KEY = "yelkenli_save";
const SAVE_VERSION = 2;
const MAX_OFFLINE_MINUTES = 480;
const OFFLINE_CREDITS_PER_MINUTE = 15;
const UPGRADE_INSTALL_CHECK_INTERVAL_MS = 30000;
const CONTENT_COOLDOWN_MS = 30 * 60 * 1000;

const CAPTAIN_LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000, 8200, 11000, 14500, 19000, 25000];

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

const getDailyGoalTheme = (dateKey: string) => {
  const fallbackTheme = DAILY_GOAL_THEMES[0];
  if (!dateKey) return fallbackTheme;

  const seed = dateKey.split("-").reduce((sum, part) => sum + Number(part || 0), 0);
  return DAILY_GOAL_THEMES[seed % DAILY_GOAL_THEMES.length] ?? fallbackTheme;
};

const getCaptainLevel = (xp: number): number => {
  for (let i = CAPTAIN_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= CAPTAIN_LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

const makeDailyGoals = (dateKey: string = new Date().toISOString().slice(0, 10)): DailyGoal[] => {
  const theme = getDailyGoalTheme(dateKey);

  return [
    { id: "dg_content", title: theme.goals.produce_content, type: "produce_content", completed: false },
    { id: "dg_route", title: theme.goals.complete_route, type: "complete_route", completed: false },
    { id: "dg_upgrade", title: theme.goals.buy_upgrade, type: "buy_upgrade", completed: false },
  ];
};

type UpgradeInProgress = {
  upgradeId: string;
  completesAt: number;
};

type SeaDecisionEffect = {
  credits?: number;
  followers?: number;
  energy?: number;
  water?: number;
  fuel?: number;
  boatCondition?: number;
  remainingDays?: number;
};

type SeaDecisionChoice = {
  label: string;
  resultText: string;
  effect: SeaDecisionEffect;
};

type SeaDecisionEvent = {
  id: string;
  title: string;
  description: string;
  choiceA: SeaDecisionChoice;
  choiceB: SeaDecisionChoice;
};

type DailyGoal = {
  id: string;
  title: string;
  type: "produce_content" | "complete_route" | "buy_upgrade";
  completed: boolean;
};

type ToastType = "upgrade" | "achievement" | "sponsor" | "content" | "voyage" | "sea_decision";

type ToastItem = {
  id: number;
  type: ToastType;
  title: string;
  text: string;
};

type AchievementProgress = {
  totalContentProduced: number;
  totalRoutesCompleted: number;
  totalUpgradesStarted: number;
  captainLevel: number;
  hasCompletedDailyGoalsOnce: boolean;
  followers: number;
  acceptedSponsorsCount: number;
  completedRouteIds: string[];
};

type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  isUnlocked: (progress: AchievementProgress) => boolean;
};

const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_content",
    title: "İlk İçerik",
    description: "1 içerik üret.",
    isUnlocked: (p) => p.totalContentProduced >= 1,
  },
  {
    id: "first_route",
    title: "İlk Rota",
    description: "1 rota tamamla.",
    isUnlocked: (p) => p.totalRoutesCompleted >= 1,
  },
  {
    id: "first_upgrade",
    title: "İlk Upgrade",
    description: "1 upgrade başlat.",
    isUnlocked: (p) => p.totalUpgradesStarted >= 1,
  },
  {
    id: "first_sponsor",
    title: "İlk Anlaşma",
    description: "İlk sponsor anlaşmasını imzala.",
    isUnlocked: (p) => p.acceptedSponsorsCount >= 1,
  },
  {
    id: "followers_1k",
    title: "Bin Takipçi",
    description: "1.000 takipçiye ulaş.",
    isUnlocked: (p) => p.followers >= 1000,
  },
  {
    id: "rising_captain",
    title: "Yükselen Kaptan",
    description: "Kaptan seviyesi 3'e ulaş.",
    isUnlocked: (p) => p.captainLevel >= 3,
  },
  {
    id: "locked_in",
    title: "Hedefe Kilitlen",
    description: "Günlük görevleri 3/3 en az 1 kez tamamla.",
    isUnlocked: (p) => p.hasCompletedDailyGoalsOnce,
  },
  {
    id: "sea_dog",
    title: "Deniz Kurdu",
    description: "5 rota tamamla.",
    isUnlocked: (p) => p.totalRoutesCompleted >= 5,
  },
  {
    id: "steady_creator",
    title: "İstikrarlı Üretici",
    description: "10 içerik üret.",
    isUnlocked: (p) => p.totalContentProduced >= 10,
  },
  {
    id: "followers_10k",
    title: "On Bin Takipçi",
    description: "10.000 takipçiye ulaş.",
    isUnlocked: (p) => p.followers >= 10000,
  },
  {
    id: "content_machine",
    title: "İçerik Makinesi",
    description: "25 içerik üret.",
    isUnlocked: (p) => p.totalContentProduced >= 25,
  },
  {
    id: "atlantic_done",
    title: "Atlantik Kaptanı",
    description: "Atlantik Geçişini tamamla.",
    isUnlocked: (p) => p.completedRouteIds.includes("atlantic_crossing"),
  },
  {
    id: "world_tour_done",
    title: "Dünya Turu Kaptanı",
    description: "Tüm 17 rotayı tamamla.",
    isUnlocked: (p) => p.totalRoutesCompleted >= 17,
  },
];

const SEA_DECISION_EVENTS: SeaDecisionEvent[] = [
  {
    id: "fuel_running_low",
    title: "Yakıt Krizi",
    description: "Depo beklenenden hızlı tükeniyor. Limana yanaşmak yakıt kazandırır ama para ve zaman harcar. Devam etmek süreyi korur ama hem yakıtı hem tekneyi zorlar.",
    choiceA: {
      label: "Limana yanaş",
      resultText: "Kısa mola yapıldı. Yakıt takviyesi alındı, marina ücreti ödendi.",
      effect: { fuel: 20, credits: -400, remainingDays: 2 },
    },
    choiceB: {
      label: "Devam et",
      resultText: "Süre korundu ama depo ve tekne durumu yıprandı.",
      effect: { fuel: -18, boatCondition: -8 },
    },
  },
  {
    id: "mild_storm_signs",
    title: "Fırtına Yaklaşıyor",
    description: "Hava durumu kötüleşiyor. Güvenli rotaya geçmek enerji ve zaman harcar. Doğrudan devam etmek tekneyi ve su rezervini tehdit eder.",
    choiceA: {
      label: "Güvenli rotaya geç",
      resultText: "Fırtınadan uzak tutuldu. Enerji ve zaman harcandı ama hasar önlendi.",
      effect: { energy: -10, remainingDays: 3 },
    },
    choiceB: {
      label: "Doğrudan devam et",
      resultText: "Fırtına içinden geçildi. Tekne hasar gördü, su rezervi azaldı.",
      effect: { boatCondition: -15, water: -8 },
    },
  },
  {
    id: "technical_noise",
    title: "Teknik Arıza",
    description: "Motor bölümünden ciddi bir ses geliyor. Şimdi tamir etmek para ve enerji ister. Ertelemek tekneyi büyük hasara açar.",
    choiceA: {
      label: "Dur, tamir et",
      resultText: "Tamir yapıldı. Para ve enerji harcandı ama büyük hasar önlendi.",
      effect: { credits: -450, energy: -5, boatCondition: -2 },
    },
    choiceB: {
      label: "Erteyle, devam et",
      resultText: "Arıza büyüdü. Tekne ciddi hasar gördü.",
      effect: { boatCondition: -16 },
    },
  },
  {
    id: "content_opportunity",
    title: "İçerik Fırsatı",
    description: "Işık ve deniz mükemmel konumda. Çekim yapmak enerji harcar ama takipçi ve gelir getirir. Dinlenmek enerjiyi geri kazandırır.",
    choiceA: {
      label: "Çek ve yayınla",
      resultText: "Yüksek kaliteli çekim yapıldı. Takipçi ve kredi geldi.",
      effect: { energy: -14, followers: 220, credits: 200 },
    },
    choiceB: {
      label: "Dinlen",
      resultText: "Enerji korundu ve bir miktar toparlandı.",
      effect: { energy: 8 },
    },
  },
  {
    id: "sudden_wind_shift",
    title: "Ani Rüzgar Değişimi",
    description: "Rüzgar bir anda yön değiştirdi. Yelken trimini düzeltmek zaman kaybettirir ama tekneyi rahatlatır. Bastırmak ise süre kazandırır ama tekneyi zorlar.",
    choiceA: {
      label: "Trim düzelt",
      resultText: "Yelkenler yeniden ayarlandı. Seyir sakinledi ama rota biraz uzadı.",
      effect: { energy: -6, remainingDays: 2, boatCondition: 3 },
    },
    choiceB: {
      label: "Bastır, devam et",
      resultText: "Hız korundu ama tekne sarsıldı ve ekip yoruldu.",
      effect: { boatCondition: -7, energy: -8 },
    },
  },
  {
    id: "night_watch_fatigue",
    title: "Gece Vardiyası Yorgunluğu",
    description: "Uzun gece vardiyası dikkati düşürdü. Kısa dinlenme güvenliği artırır ama tempoyu keser. Devam etmek süreyi korur ama kaynak tüketimini zorlar.",
    choiceA: {
      label: "Kısa mola ver",
      resultText: "Ekip nefes aldı. Enerji toparlandı ama yol biraz uzadı.",
      effect: { energy: 10, remainingDays: 2 },
    },
    choiceB: {
      label: "Devam et",
      resultText: "Tempo korundu ama yorgunluk büyüdü ve su tüketimi arttı.",
      effect: { energy: -12, water: -6 },
    },
  },
  {
    id: "cove_anchor_decision",
    title: "Koyda Demirleme Kararı",
    description: "Korunaklı bir koy göründü. Demirlemek su ve enerji toparlatır ama zaman kaybettirir. Açıkta devam etmek süreyi korur ama kaynak baskısını artırır.",
    choiceA: {
      label: "Koyda kal",
      resultText: "Kısa dinlenme yapıldı. Su ve enerji toparlandı.",
      effect: { water: 10, energy: 7, remainingDays: 2 },
    },
    choiceB: {
      label: "Açıkta devam et",
      resultText: "Süre korundu ama ekip ve tekne daha fazla zorlandı.",
      effect: { energy: -8, boatCondition: -5 },
    },
  },
  {
    id: "risky_social_shot",
    title: "Riskli Çekim Açısı",
    description: "Muhteşem bir açı yakalandı. Riskli çekim takipçi getirebilir ama tekne düzenini bozabilir. Güvenli kalmak fırsatı kaçırır ama tekneyi korur.",
    choiceA: {
      label: "Çekimi dene",
      resultText: "Çekim ses getirdi. Takipçi geldi ama tekne ve ekip zorlandı.",
      effect: { followers: 180, credits: 120, energy: -10, boatCondition: -4 },
    },
    choiceB: {
      label: "Güvenli kal",
      resultText: "Risk alınmadı. Tekne düzeni korundu, tempo sakin kaldı.",
      effect: { boatCondition: 4, energy: 4 },
    },
  },
  {
    id: "fishing_boat_encounter",
    title: "Balıkçı Teknesiyle Karşılaşma",
    description: "Yakındaki balıkçı teknesi rota hakkında uyarı veriyor. Tavsiyeyi dinlemek küçük bir masraf ister ama güvenlik sağlar. Görmezden gelmek bedava ama belirsizlik yaratır.",
    choiceA: {
      label: "Bilgi al",
      resultText: "Rota bilgisi paylaşıldı. Küçük bir ödeme yapıldı, risk azaldı.",
      effect: { credits: -180, boatCondition: 4, fuel: 6 },
    },
    choiceB: {
      label: "Yola devam et",
      resultText: "Para korunmuş oldu ama rota daha sert geçti.",
      effect: { fuel: -8, boatCondition: -6 },
    },
  },
  {
    id: "equipment_loose",
    title: "Ekipman Sabitleme Sorunu",
    description: "Güvertede bazı ekipmanlar gevşedi. Şimdi sabitlemek enerji kaybettirir ama hasarı önler. Ertelemek süreyi korur ama deniz büyürse sorun çıkarabilir.",
    choiceA: {
      label: "Şimdi sabitle",
      resultText: "Ekipman güvene alındı. Efor harcandı ama tekne korundu.",
      effect: { energy: -7, boatCondition: 5 },
    },
    choiceB: {
      label: "Sonra hallet",
      resultText: "İlerleme korundu ama ekipman sallandı ve tekne yıprandı.",
      effect: { boatCondition: -8, remainingDays: -1 },
    },
  },
];

type CommentBands = { low: string[]; medium: string[]; high: string[]; viral: string[] };

const CONTENT_COMMENTS: Record<string, CommentBands> = {
  marina_life: {
    low: ["Marina sahnesi sıradan gelmiş, izleyiciler daha fazlasını bekliyordu.", "Işık ve kompozisyon dengesiz; bir dahaki sefere daha iyi kurgu denenebilir."],
    medium: ["Marina rutinleri izleyiciye tanıdık geldi; sadık takipçi kitlesi büyüyor.", "Sakin ama güvenilir bir içerik. Sabah rutin izleme artıyor."],
    high: ["Marina yaşamı bu kalitede çok az kanalda görülüyor. Fark edildin.", "Günlük hayat içeriği bu sefer gerçekten özel bir şeye dönüştü."],
    viral: ["Marina videosu patladı! Herkes 'sen neredesin?' diye soruyor.", "Marina rutini viral oldu. Hayatın bir film gibi akıyor artık."],
  },
  boat_tour: {
    low: ["Tekne turu pek ilgi çekmedi; çekim açıları daha dikkatli seçilebilirdi.", "İzleyiciler tekneyi görüyor ama hikaye yok; kayıp fırsat."],
    medium: ["Tekne turu güzel ama anlatım biraz düz kalmış. Yine de büyüme var.", "Görsel iyi, hikaye daha güçlü olabilirdi. Düzenli takipçiler sevdi."],
    high: ["Bu tekne turu kanalın yüzüne dönüşüyor. Klip olarak paylaşılmaya başlandı.", "İzleyiciler tekneye aşık oldu. Yorumlarda 'benim evim gibiydi' yazıyorlar."],
    viral: ["Tekne turu her yerden paylaşılıyor. Marka teklifleri gelmeye başladı!", "Teknenin içi viral oldu. Tasarım siteleri bile paylaştı."],
  },
  maintenance_upgrade: {
    low: ["Teknik içerik kalabalığı korkutuyor. Daha basite çekilebilir.", "Bakım videosu kuru gelmiş; yeni izleyiciler bağlanamıyor."],
    medium: ["Teknik içerik nişini büyüttü. Ciddi denizciler ilgilendi.", "Bakım serisi takipçi çekmeye başladı. Uzman algısı güçleniyor."],
    high: ["Bu tarz teknik içerik çok az kanalda var. Denizcilik topluluğu seni fark etti.", "Yelkenli tamircileri dahi paylaşıyor. Otoriteye dönüşüyorsun."],
    viral: ["Bakım videosu viral oldu. 'Neden kimse bunu anlatmadı' yorumları dolup taşıyor.", "Upgrade serisi patladı! Teknik kanallar seni referans gösteriyor."],
  },
  city_trip: {
    low: ["Şehir gezisi vasat kaldı; turistik görüntüler izleyiciyi etkilemedi.", "Şehir içeriği için daha özgün bir bakış açısı gerekiyor."],
    medium: ["Şehir vibe'ı güzel aktarılmış. Yeni bir kitleye ulaştın.", "Yemek ve şehir karması iyi iş çıkardı. Seyahat kitlesi büyüyor."],
    high: ["Bu şehir videosu seyahat topluluğunda konuşuluyor. Rota önerisi geldi!", "Şehrin ruhunu yakaladın. İzleyiciler aynı rotaya çıkmak istiyor."],
    viral: ["Şehir gezisi viral oldu. Turizm hesapları bile paylaştı!", "Bu video o şehrin en çok izlenen tanıtımı oldu. Yerel medya aradı."],
  },
  nature_bay: {
    low: ["Koy güzel ama video sıradan kalmış; atmosfer yeterince aktarılamamış.", "Doğa güzelliği kadraja yansımamış; teknik sorunlar var."],
    medium: ["Koy manzarası izleyiciyi rahatlattı. Sabah rutin izleme artıyor.", "Doğa içeriği dengeli çıktı. Yavaş ama sürekli büyüme geliyor."],
    high: ["Bu koyu kimse bilmiyordu; sen gösterdin. Lokasyon viral olmak üzere.", "Mavi su ve sessizlik videosu binlerce paylaşım aldı."],
    viral: ["Bu koy videosu 'keşfedilmemiş cennet' olarak viral oldu!", "Doğa içeriği patladı. Seyahat bloggerları koordinat istiyor."],
  },
  sailing_vlog: {
    low: ["Seyir vlogu düz anlatımla geçmiş. İzleyici denizde ne hissettiğini anlayamıyor.", "Açık deniz sahnesi etkileyici ama kurgu zayıf."],
    medium: ["Seyir vlogu yelkenci topluluğunda ilgi gördü. Gerçek denizcilik kitlesi büyüyor.", "Deniz hikayesi samimi aktarılmış. Düzenli izleyiciler sevdi."],
    high: ["Bu seyir videosu dünya turunu belgeleyen en iyi içeriklerden biri.", "Dalga sesi ve yelken dolusu bir video. İzleyiciler yorum bırakmayı bırakamıyor."],
    viral: ["Seyir vlogu patladı! Açık deniz hayali kuranlar seni takip ediyor.", "Yelkenli yaşamı bu videoyla yeniden tanımladın. Büyük kanallar paylaştı."],
  },
  ocean_diary: {
    low: ["Günlük samimi ama monoton kalmış. Denizin ruhunu yansıtmıyor.", "Deniz günlüğü ham; kurgu ve ses dengesi gereksiniyor."],
    medium: ["Okyanus günlüğü izleyiciyi seyahate ortak etti. Bağ güçleniyor.", "Günlük format işliyor. Haftalık takip eden yeni kitle geliyor."],
    high: ["Okyanus ortasında çekilen bu günlük izleyiciyi derinden etkiledi. Yorumlar dolup taşıyor.", "Dünya turunun en otantik anını yakaladın. Medya ilgisi başladı."],
    viral: ["Okyanus günlüğü viral oldu! 'Bu gerçek mi?' sorusu yorumlara yağıyor.", "Deniz ortasındaki günlüğün sıfırdan binlerce insanı derinden sarstı."],
  },
  storm_vlog: {
    low: ["Fırtına anının dramı çıkarılamamış; yüzeysel kalmış.", "Fırtına gerilimi var ama kurgu hikayeyi öldürmüş."],
    medium: ["Fırtına anını kameraya almak cesaret işi. İzleyiciler heyecanla izledi.", "Hava olayı videosu gerçek bir içerik dinamiği yarattı."],
    high: ["Bu fırtına videosu büyük macera kanallarında konuşuluyor.", "Dalga ve rüzgar arasında çekilen bu video denizcilik arşivine girdi."],
    viral: ["Fırtına videosu dünya çapında paylaşıldı! Macera kanalları senden bahsediyor.", "Bu fırtına anı sosyal medyayı salladı. Haber siteleri embed aldı."],
  },
};

const getContentComment = (contentType: string, quality: number, isViral: boolean): string => {
  const pool = CONTENT_COMMENTS[contentType];
  if (!pool) return "İzleyici bu hikayeyi sevdi.";
  const arr = isViral ? pool.viral : quality >= 70 ? pool.high : quality >= 40 ? pool.medium : pool.low;
  return arr[Math.floor(Math.random() * arr.length)] ?? "İzleyici bu hikayeyi sevdi.";
};

const getBaseOceanReadiness = (boatId: string) => {
  if (boatId === "kirlangic_28") return 15;
  if (boatId === "denizkusu_34") return 30;
  if (boatId === "atlas_40") return 45;
  return 0;
};

const upgradeEffectLabels: Record<string, string> = {
  energy: "Enerji",
  water: "Su",
  safety: "Güvenlik",
  navigation: "Navigasyon",
  maintenance: "Bakım",
  oceanReadiness: "Okyanus Hazırlığı",
  riskReduction: "Risk Azaltma",
  contentQuality: "İçerik Kalitesi",
  speed: "Hız",
  engine: "Motor",
};

const getCaptainRankLabel = (level: number): string => {
  if (level >= 13) return "Dünya Turu Kaptanı";
  if (level >= 9)  return "Okyanus Yolcusu";
  if (level >= 6)  return "Deneyimli Kaptan";
  if (level >= 4)  return "Açık Deniz Adayı";
  if (level >= 2)  return "Kıyı Seyircisi";
  return "Acemi Kaptan";
};

const ACHIEVEMENT_ICONS: Record<string, string> = {
  first_content:    "🎬",
  first_route:      "⚓",
  first_upgrade:    "🔧",
  first_sponsor:    "🤝",
  followers_1k:     "👥",
  rising_captain:   "⭐",
  locked_in:        "🎯",
  sea_dog:          "🌊",
  steady_creator:   "📱",
  followers_10k:    "🌟",
  content_machine:  "📹",
  atlantic_done:    "🌊",
  world_tour_done:  "🏆",
};

const getRouteCompletionRewards = (route: (typeof WORLD_ROUTES)[number]) => {
  const contentPotentialMultipliers: Record<string, number> = {
    low: 0.75,
    low_medium: 0.9,
    medium: 1,
    medium_high: 1.25,
    high: 1.5,
    very_high: 2,
  };

  const riskLevelMultipliers: Record<string, number> = {
    low: 0.8,
    low_medium: 0.9,
    medium: 1,
    medium_high: 1.25,
    high: 1.5,
    very_high: 2,
    final: 2.5,
  };

  const credits = Math.floor(5000 * (riskLevelMultipliers[route.riskLevel] ?? 1));
  const followers = Math.floor(2500 * (contentPotentialMultipliers[route.contentPotential] ?? 1));

  return { credits, followers };
};

function migrateSave(parsed: any) {
  if (!parsed || typeof parsed !== "object") return null;

  const version = parsed.saveVersion ?? 1;

  if (version === 1) {
    const dailyGoalsCompleted =
      Array.isArray(parsed.dailyGoals) &&
      parsed.dailyGoals.length > 0 &&
      parsed.dailyGoals.every((goal: any) => goal?.completed);

    return {
      ...parsed,
      saveVersion: SAVE_VERSION,
      hasSave: parsed.hasSave ?? true,
      totalContentProduced: parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0),
      hasCompletedDailyGoalsOnce:
        parsed.hasCompletedDailyGoalsOnce ?? Boolean(dailyGoalsCompleted && parsed.dailyRewardClaimed),
    };
  }

  if (version === SAVE_VERSION) {
    return {
      ...parsed,
      hasSave: parsed.hasSave ?? true,
      totalContentProduced: parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0),
      hasCompletedDailyGoalsOnce: parsed.hasCompletedDailyGoalsOnce ?? false,
    };
  }

  return null;
}

function App() {
  const [step, setStep] = useState<Step>("MAIN_MENU");
  const [activeTab, setActiveTab] = useState<Tab>("liman");
  const [profileIndex, setProfileIndex] = useState(0);
  const [marinaIndex, setMarinaIndex] = useState(0);
  const [marinaFilter, setMarinaFilter] = useState<MarinaFilter>("all");
  const [boatIndex, setBoatIndex] = useState(0);
  const [boatName, setBoatName] = useState("");
  const [onboardingMessage, setOnboardingMessage] = useState("");
  
  const [credits, setCredits] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [firstContentDone, setFirstContentDone] = useState(false);
  const [purchasedUpgradeIds, setPurchasedUpgradeIds] = useState<string[]>([]);
  const [upgradeInProgress, setUpgradeInProgress] = useState<UpgradeInProgress | null>(null);

  // Sea Mode MVP states
  const [currentLocationName, setCurrentLocationName] = useState("");
  const [worldProgress, setWorldProgress] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [water, setWater] = useState(100);
  const [fuel, setFuel] = useState(100);
  const [boatCondition, setBoatCondition] = useState(100);
  
  const [currentRouteId, setCurrentRouteId] = useState<string>("greek_islands");
  const [completedRouteIds, setCompletedRouteIds] = useState<string[]>([]);
  
  const [voyageTotalDays, setVoyageTotalDays] = useState(0);
  const [voyageDaysRemaining, setVoyageDaysRemaining] = useState(0);
  const [currentSeaEvent, setCurrentSeaEvent] = useState("");
  const [pendingDecisionId, setPendingDecisionId] = useState<string | null>(null);

  // Content V2 States
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [contentResult, setContentResult] = useState<ContentResult | null>(null);
  const [lastContentAt, setLastContentAt] = useState<number | null>(null);
  const [, setContentCooldownTick] = useState(0);

  // Upgrade V2 State
  const [selectedUpgradeCategory, setSelectedUpgradeCategory] = useState<UpgradeCategoryId>("energy");

  // UI dismissal state (session-only, not persisted)
  const [tavsiyeDismissed, setTavsiyeDismissed] = useState(false);

  // Sponsor MVP States
  const [brandTrust, setBrandTrust] = useState(10);
  const [sponsorOffers, setSponsorOffers] = useState<any[]>([]);
  const [acceptedSponsors, setAcceptedSponsors] = useState<string[]>([]);
  const [sponsoredContentCount, setSponsoredContentCount] = useState(0);
  const [icerikSubTab, setIcerikSubTab] = useState<"produce" | "sponsor">("produce");

  const [hasSave, setHasSave] = useState(false);
  const [saveBoatName, setSaveBoatName] = useState("");

  // Flash animation states
  const [flashCredits, setFlashCredits] = useState(false);
  const [flashFollowers, setFlashFollowers] = useState(false);

  const [captainXp, setCaptainXp] = useState(0);
  const [captainLevel, setCaptainLevel] = useState(1);

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(makeDailyGoals);
  const [lastDailyReset, setLastDailyReset] = useState<string>("");
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [totalContentProduced, setTotalContentProduced] = useState(0);
  const [hasCompletedDailyGoalsOnce, setHasCompletedDailyGoalsOnce] = useState(false);
  const toastIdRef = useRef(0);
  const [toastQueue, setToastQueue] = useState<ToastItem[]>([]);
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null);
  const [isToastLeaving, setIsToastLeaving] = useState(false);

  const [celebrationQueue, setCelebrationQueue] = useState<CelebrationItem[]>([]);
  const [activeCelebration, setActiveCelebration] = useState<CelebrationItem | null>(null);
  const prevCaptainLevelRef = useRef<number | null>(null);

  const previousUnlockedAchievementIdsRef = useRef<string[]>([]);
  const hasInitializedAchievementBannerRef = useRef(false);
  const previousSponsorOfferIdsRef = useRef<string[]>([]);
  const hasInitializedSponsorOfferBannerRef = useRef(false);

  const triggerFlash = (type: "credits" | "followers") => {
    if (type === "credits") {
      setFlashCredits(true);
      setTimeout(() => setFlashCredits(false), 600);
    } else {
      setFlashFollowers(true);
      setTimeout(() => setFlashFollowers(false), 600);
    }
  };

  const pushToast = (type: ToastType, title: string, text: string) => {
    const id = ++toastIdRef.current;
    setToastQueue(prev => [...prev, { id, type, title, text }]);
  };

  const selectedProfile: PlayerProfile = PLAYER_PROFILES[profileIndex];
  const selectedMarina: StartingMarina = STARTING_MARINAS[marinaIndex];
  const selectedBoat: StartingBoat = STARTING_BOATS[boatIndex];

  const currentRoute = WORLD_ROUTES.find((route) => route.id === currentRouteId);

  // Dynamic calculations for Upgrades V2
  const purchasedUpgradeObjects = purchasedUpgradeIds.map(id => BOAT_UPGRADES.find(u => u.id === id)).filter(Boolean) as typeof BOAT_UPGRADES;

  const baseOcean = getBaseOceanReadiness(selectedBoat?.id || "");
  const upgradeOceanBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.oceanReadiness || 0), 0);
  const currentOceanReadiness = Math.min(100, baseOcean + upgradeOceanBonus);

  const upgradeContentBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.contentQuality || 0), 0);
  const upgradeEnergyBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.energy || 0), 0);
  const upgradeWaterBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.water || 0), 0);
  const upgradeSafetyBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.safety || 0), 0);
  const upgradeNavigationBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.navigation || 0), 0);
  const upgradeMaintenanceBonus = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.maintenance || 0), 0);
  const upgradeRiskReduction = purchasedUpgradeObjects.reduce((acc, u) => acc + (u.effects.riskReduction || 0), 0);

  const currentRouteReadinessItems = currentRoute ? [
    { current: currentOceanReadiness, required: currentRoute.requirements.minOceanReadiness ?? 0 },
    { current: upgradeEnergyBonus, required: currentRoute.requirements.minEnergy },
    { current: upgradeWaterBonus, required: currentRoute.requirements.minWater },
    { current: upgradeSafetyBonus, required: currentRoute.requirements.minSafety },
    { current: upgradeNavigationBonus, required: currentRoute.requirements.minNavigation },
    { current: upgradeMaintenanceBonus, required: currentRoute.requirements.minMaintenance },
  ] : [];

  const currentRouteReadinessGapCount = currentRouteReadinessItems.filter(item => item.current < item.required).length;
  const hasRouteReadinessGap = currentRouteReadinessGapCount > 0;
  const totalRoutesCompleted = completedRouteIds.length;
  const totalUpgradesStarted = purchasedUpgradeIds.length + (upgradeInProgress ? 1 : 0);
  const achievementStatuses = ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: achievement.isUnlocked({
      totalContentProduced,
      totalRoutesCompleted,
      totalUpgradesStarted,
      captainLevel,
      hasCompletedDailyGoalsOnce,
      followers,
      acceptedSponsorsCount: acceptedSponsors.length,
      completedRouteIds,
    }),
  }));

  useEffect(() => {
    const unlockedAchievementIds = achievementStatuses
      .filter((achievement) => achievement.unlocked)
      .map((achievement) => achievement.id);

    if (!hasInitializedAchievementBannerRef.current) {
      previousUnlockedAchievementIdsRef.current = unlockedAchievementIds;
      hasInitializedAchievementBannerRef.current = true;
      return;
    }

    const newlyUnlockedAchievement = achievementStatuses.find(
      (achievement) =>
        achievement.unlocked && !previousUnlockedAchievementIdsRef.current.includes(achievement.id),
    );

    previousUnlockedAchievementIdsRef.current = unlockedAchievementIds;

    if (newlyUnlockedAchievement) {
      setCelebrationQueue(q => [...q, {
        type: "achievement" as const,
        title: newlyUnlockedAchievement.title,
        description: newlyUnlockedAchievement.description,
        icon: ACHIEVEMENT_ICONS[newlyUnlockedAchievement.id] ?? "🏅",
      }]);
    }
  }, [achievementStatuses]);

  useEffect(() => {
    const sponsorOfferIds = sponsorOffers.map((offer) => offer.id);

    if (!hasInitializedSponsorOfferBannerRef.current) {
      previousSponsorOfferIdsRef.current = sponsorOfferIds;
      hasInitializedSponsorOfferBannerRef.current = true;
      return;
    }

    const newlyAddedOffer = sponsorOffers.find(
      (offer) => !previousSponsorOfferIdsRef.current.includes(offer.id),
    );

    previousSponsorOfferIdsRef.current = sponsorOfferIds;

    if (newlyAddedOffer) {
      pushToast(
        "sponsor",
        "Sponsor Teklifi Geldi!",
        newlyAddedOffer.brandName
          ? `${newlyAddedOffer.brandName} yeni bir teklif gönderdi.`
          : "Yeni bir marka dünya turu hikayene dahil olmak istiyor.",
      );
    }
  }, [sponsorOffers]);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = migrateSave(JSON.parse(saved));
        if (parsed?.hasSave) {
          setHasSave(true);
          setSaveBoatName(parsed.boatName || "Bilinmeyen Tekne");
        }
      } catch (e) {
        console.error("Save load error", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!upgradeInProgress) return;

    if (purchasedUpgradeIds.includes(upgradeInProgress.upgradeId)) {
      setUpgradeInProgress(null);
      return;
    }

    const checkInstallation = () => {
      if (upgradeInProgress.completesAt <= Date.now()) {
        completeUpgradeInstallation(upgradeInProgress.upgradeId);
      }
    };

    checkInstallation();
    const intervalId = window.setInterval(checkInstallation, UPGRADE_INSTALL_CHECK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [upgradeInProgress, purchasedUpgradeIds]);

  useEffect(() => {
    if (!lastContentAt) return;
    const tickId = window.setInterval(() => setContentCooldownTick(t => t + 1), 30000);
    return () => window.clearInterval(tickId);
  }, [lastContentAt]);

  useEffect(() => {
    setCaptainLevel(prev => {
      const newLevel = getCaptainLevel(captainXp);
      if (newLevel > prev) {
        const bonus = newLevel * 500;
        setCredits(c => c + bonus);
        setLogs(logs => [
          `Kaptan seviyesi yükseldi: Lv.${newLevel} (+${bonus.toLocaleString("tr-TR")} TL bonus)`,
          ...logs.slice(0, 4)
        ]);
        return newLevel;
      }
      return prev;
    });
  }, [captainXp]);

  useEffect(() => {
    if (prevCaptainLevelRef.current === null) {
      prevCaptainLevelRef.current = captainLevel;
      return;
    }
    if (captainLevel > prevCaptainLevelRef.current) {
      const bonus = captainLevel * 500;
      setCelebrationQueue(q => [...q, {
        type: "levelup" as const,
        level: captainLevel,
        rank: getCaptainRankLabel(captainLevel),
        bonus,
      }]);
    }
    prevCaptainLevelRef.current = captainLevel;
  }, [captainLevel]);

  useEffect(() => {
    if (activeCelebration || celebrationQueue.length === 0) return;
    setActiveCelebration(celebrationQueue[0]);
    setCelebrationQueue(prev => prev.slice(1));
  }, [activeCelebration, celebrationQueue]);

  useEffect(() => {
    if (step === "HUB") {
      const today = new Date().toISOString().slice(0, 10);
      if (lastDailyReset !== today) {
        setDailyGoals(makeDailyGoals());
        setLastDailyReset(today);
        setDailyRewardClaimed(false);
      }
    }
  }, [step, lastDailyReset]);

  useEffect(() => {
    const allDone = dailyGoals.length > 0 && dailyGoals.every(g => g.completed);
    if (allDone && !dailyRewardClaimed) {
      setHasCompletedDailyGoalsOnce(true);
      setCredits(c => c + 2500);
      setDailyRewardClaimed(true);
      setLogs(prev => [
        "Günlük görevler tamamlandı! +2.500 TL bonus.",
        ...prev.slice(0, 4),
      ]);
      setCelebrationQueue(q => [...q, { type: "daily_goals" as const }]);
    }
  }, [dailyGoals, dailyRewardClaimed]);

  useEffect(() => {
    if (activeToast || toastQueue.length === 0) return;
    const next = toastQueue[0];
    setToastQueue(prev => prev.slice(1));
    setIsToastLeaving(false);
    setActiveToast(next);
  }, [activeToast, toastQueue]);

  useEffect(() => {
    if (!activeToast) return;
    const leaveId = window.setTimeout(() => setIsToastLeaving(true), 3200);
    const clearId = window.setTimeout(() => setActiveToast(null), 3500);
    return () => {
      window.clearTimeout(leaveId);
      window.clearTimeout(clearId);
    };
  }, [activeToast]);

  useEffect(() => {
    if (["HUB", "SEA_MODE", "ARRIVAL_SCREEN"].includes(step)) {
      const saveObj = {
        profileIndex,
        marinaIndex,
        boatIndex,
        boatName,
        credits,
        followers,
        firstContentDone,
        logs,
        purchasedUpgradeIds,
        upgradeInProgress,
        step,
        activeTab,
        currentLocationName,
        worldProgress,
        energy,
        water,
        fuel,
        boatCondition,
        currentRouteId,
        completedRouteIds,
        voyageTotalDays,
        voyageDaysRemaining,
        currentSeaEvent,
        pendingDecisionId,
        selectedPlatformId,
        selectedContentType,
        contentResult,
        selectedUpgradeCategory,
        brandTrust,
        sponsorOffers,
        acceptedSponsors,
        sponsoredContentCount,
        icerikSubTab,
        lastContentAt,
        captainXp,
        captainLevel,
        dailyGoals,
        lastDailyReset,
        dailyRewardClaimed,
        totalContentProduced,
        hasCompletedDailyGoalsOnce,
        lastSavedAt: Date.now(),
        saveVersion: SAVE_VERSION,
        hasSave: true,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveObj));
      setHasSave(true);
      setSaveBoatName(boatName);
    }
  }, [
    step, profileIndex, marinaIndex, boatIndex, boatName, credits, followers, firstContentDone,
    logs, purchasedUpgradeIds, upgradeInProgress, activeTab, currentLocationName, worldProgress, energy, water,
    fuel, boatCondition, currentRouteId, completedRouteIds, voyageTotalDays, voyageDaysRemaining,
    currentSeaEvent, pendingDecisionId, selectedPlatformId, selectedContentType, contentResult, selectedUpgradeCategory,
    brandTrust, sponsorOffers, acceptedSponsors, sponsoredContentCount, icerikSubTab, lastContentAt,
    captainXp, captainLevel, dailyGoals, lastDailyReset, dailyRewardClaimed, totalContentProduced,
    hasCompletedDailyGoalsOnce
  ]);

  const finalizeGame = () => {
    if (boatName.trim() === "") {
      setOnboardingMessage("Lütfen teknenize bir isim verin.");
      return;
    }

    setOnboardingMessage("");
    setCredits(STARTING_BUDGET - selectedBoat.purchaseCost);
    setFollowers(0);
    setPurchasedUpgradeIds([]);
    setUpgradeInProgress(null);
    setLogs(["Kariyer başladı. Limana giriş yapıldı."]);
    setCurrentLocationName(selectedMarina.name);
    setWorldProgress(0);
    setEnergy(100);
    setWater(100);
    setFuel(100);
    setBoatCondition(100);
    setCompletedRouteIds([]);
    setCurrentRouteId("greek_islands");
    setPendingDecisionId(null);
    setContentResult(null);
    setSelectedPlatformId(null);
    setSelectedContentType(null);
    setSelectedUpgradeCategory("energy");
    setBrandTrust(10);
    setSponsorOffers([]);
    setAcceptedSponsors([]);
    setSponsoredContentCount(0);
    setIcerikSubTab("produce");
    setLastContentAt(null);
    setCaptainXp(0);
    setCaptainLevel(1);
    setDailyGoals(makeDailyGoals());
    setLastDailyReset("");
    setDailyRewardClaimed(false);
    setTotalContentProduced(0);
    setHasCompletedDailyGoalsOnce(false);
    setStep("HUB");
    setActiveTab("liman");
  };

  const loadGame = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;

    try {
      const parsed = migrateSave(JSON.parse(saved));
      if (!parsed) return;

      const savedPurchasedUpgradeIds = parsed.purchasedUpgradeIds ?? [];
      const savedUpgradeInProgress = parsed.upgradeInProgress ?? null;
      const savedCredits = parsed.credits ?? 0;
      const savedLogs = parsed.logs ?? [];
      const savedLastSavedAt = parsed.lastSavedAt;

      let offlineMinutes = 0;
      let offlineCredits = 0;
      let nextPurchasedUpgradeIds = savedPurchasedUpgradeIds;
      let nextUpgradeInProgress =
        savedUpgradeInProgress &&
        typeof savedUpgradeInProgress.upgradeId === "string" &&
        typeof savedUpgradeInProgress.completesAt === "number" &&
        Number.isFinite(savedUpgradeInProgress.completesAt)
          ? savedUpgradeInProgress
          : null;
      let installationCompleteUpgrade: (typeof BOAT_UPGRADES)[number] | null = null;

      if (typeof savedLastSavedAt === "number" && Number.isFinite(savedLastSavedAt)) {
        const offlineMs = Math.max(0, Date.now() - savedLastSavedAt);
        offlineMinutes = Math.min(Math.floor(offlineMs / 60000), MAX_OFFLINE_MINUTES);
        offlineCredits = Math.max(0, offlineMinutes * OFFLINE_CREDITS_PER_MINUTE);
      }

      if (nextUpgradeInProgress) {
        const installingUpgrade = BOAT_UPGRADES.find(u => u.id === nextUpgradeInProgress.upgradeId);

        if (!installingUpgrade || nextPurchasedUpgradeIds.includes(nextUpgradeInProgress.upgradeId)) {
          nextUpgradeInProgress = null;
        } else if (nextUpgradeInProgress.completesAt <= Date.now()) {
          nextPurchasedUpgradeIds = [...nextPurchasedUpgradeIds, nextUpgradeInProgress.upgradeId];
          installationCompleteUpgrade = installingUpgrade;
          nextUpgradeInProgress = null;
        }
      }

      const passiveIncomeMessage =
        offlineCredits > 0
          ? `Pasif gelir: ${offlineMinutes} dakika içinde +${offlineCredits.toLocaleString("tr-TR")} TL birikti.`
          : "";
      const installationCompleteMessage = installationCompleteUpgrade
        ? `Kurulum tamamlandı: ${installationCompleteUpgrade.name} aktif edildi.`
        : "";
      const nextLogs = [installationCompleteMessage, passiveIncomeMessage, ...savedLogs]
        .filter(Boolean)
        .slice(0, 5) as string[];
      const nextSeaEvent =
        installationCompleteMessage || passiveIncomeMessage || (parsed.currentSeaEvent ?? "");

      setProfileIndex(parsed.profileIndex ?? 0);
      setMarinaIndex(parsed.marinaIndex ?? 0);
      setBoatIndex(parsed.boatIndex ?? 0);
      setBoatName(parsed.boatName ?? "");
      setCredits(savedCredits + offlineCredits);
      setFollowers(parsed.followers ?? 0);
      setFirstContentDone(parsed.firstContentDone ?? false);
      setLogs(nextLogs);
      setPurchasedUpgradeIds(nextPurchasedUpgradeIds);
      setUpgradeInProgress(nextUpgradeInProgress);
      setCurrentLocationName(parsed.currentLocationName ?? "");
      setWorldProgress(parsed.worldProgress ?? 0);
      setEnergy(parsed.energy ?? 100);
      setWater(parsed.water ?? 100);
      setFuel(parsed.fuel ?? 100);
      setBoatCondition(parsed.boatCondition ?? 100);
      setCurrentRouteId(parsed.currentRouteId ?? "greek_islands");
      setCompletedRouteIds(parsed.completedRouteIds ?? []);
      setVoyageTotalDays(parsed.voyageTotalDays ?? 0);
      setVoyageDaysRemaining(parsed.voyageDaysRemaining ?? 0);
      setCurrentSeaEvent(nextSeaEvent);
      setPendingDecisionId(parsed.pendingDecisionId ?? null);
      setSelectedPlatformId(parsed.selectedPlatformId ?? null);
      setSelectedContentType(parsed.selectedContentType ?? null);
      setContentResult(parsed.contentResult ?? null);
      setSelectedUpgradeCategory(parsed.selectedUpgradeCategory ?? "energy");
      setBrandTrust(parsed.brandTrust ?? 10);
      setSponsorOffers(parsed.sponsorOffers ?? []);
      setAcceptedSponsors(parsed.acceptedSponsors ?? []);
      setSponsoredContentCount(parsed.sponsoredContentCount ?? 0);
      setIcerikSubTab(parsed.icerikSubTab ?? "produce");
      setLastContentAt(parsed.lastContentAt ?? null);
      setCaptainXp(parsed.captainXp ?? 0);
      setCaptainLevel(parsed.captainLevel ?? 1);
      setDailyGoals(Array.isArray(parsed.dailyGoals) ? parsed.dailyGoals : makeDailyGoals());
      setLastDailyReset(parsed.lastDailyReset ?? "");
      setDailyRewardClaimed(parsed.dailyRewardClaimed ?? false);
      setTotalContentProduced(parsed.totalContentProduced ?? (parsed.firstContentDone ? 1 : 0));
      setHasCompletedDailyGoalsOnce(parsed.hasCompletedDailyGoalsOnce ?? false);

      const safeStep = parsed.step && ["HUB", "SEA_MODE", "ARRIVAL_SCREEN"].includes(parsed.step) ? parsed.step : "HUB";
      const routeValid = WORLD_ROUTES.some(r => r.id === parsed.currentRouteId);
      setStep(safeStep === "SEA_MODE" && !routeValid ? "HUB" : safeStep);
      setActiveTab(parsed.activeTab ?? "liman");

      if (installationCompleteUpgrade) {
        applyUpgradeEffects(installationCompleteUpgrade);
        pushToast("upgrade", "Upgrade Tamamlandı!", `${installationCompleteUpgrade.name} kurulumu tamamlandı!`);
      }
    } catch (e) {
      console.error("Load error", e);
    }
  };

  const applyUpgradeEffects = (upgrade: (typeof BOAT_UPGRADES)[number]) => {
    const energyBoost = upgrade.effects.energy ?? 0;
    const waterBoost = upgrade.effects.water ?? 0;
    const conditionBoost =
      (upgrade.effects.maintenance ?? 0) +
      Math.floor((upgrade.effects.safety ?? 0) / 2) +
      Math.floor((upgrade.effects.riskReduction ?? 0) / 2) +
      Math.floor((upgrade.effects.oceanReadiness ?? 0) / 2);

    if (energyBoost > 0) setEnergy(prev => Math.min(100, prev + energyBoost));
    if (waterBoost > 0) setWater(prev => Math.min(100, prev + waterBoost));
    if (conditionBoost > 0) setBoatCondition(prev => Math.min(100, prev + conditionBoost));
  };

  const handleMarinaRest = () => {
    setEnergy(prev => Math.min(100, prev + 30));
    setWater(prev => Math.min(100, prev + 30));
    setFuel(prev => Math.min(100, prev + 20));
    setBoatCondition(prev => Math.min(100, prev + 10));
    setLogs(prev => ["Marina’da dinlenildi. Enerji, su, yakıt ve tekne durumu toparlandı.", ...prev.slice(0, 4)]);
  };

  const handleRepairBoat = () => {
    if (credits < 250) {
      setLogs(prev => ["Tekneyi onarmak için yeterli bütçe yok.", ...prev.slice(0, 4)]);
      return;
    }

    if (boatCondition >= 100) {
      setLogs(prev => ["Tekne zaten tam durumda.", ...prev.slice(0, 4)]);
      return;
    }

    setCredits(prev => prev - 250);
    setBoatCondition(prev => Math.min(100, prev + 35));
    triggerFlash("credits");
    setLogs(prev => ["Tekne onarıldı. Durum 35 puan toparlandı.", ...prev.slice(0, 4)]);
  };

  const advanceDay = () => {
    if (step !== "SEA_MODE" || !currentRoute || pendingDecisionId) return;

    if (Math.random() < 0.3) {
      const nextDecision = SEA_DECISION_EVENTS[Math.floor(Math.random() * SEA_DECISION_EVENTS.length)];
      setPendingDecisionId(nextDecision.id);
      setCurrentSeaEvent(nextDecision.description);
      return;
    }

    setVoyageDaysRemaining(prev => {
      const newDays = prev - 1;
      const readinessPenalty = Math.min(currentRouteReadinessGapCount, 3);

      let energyDrop = 5 + (readinessPenalty > 0 ? 1 : 0);
      if (upgradeEnergyBonus > 20) energyDrop = 3 + (readinessPenalty > 0 ? 1 : 0);
      else if (upgradeEnergyBonus > 10) energyDrop = 4 + (readinessPenalty > 0 ? 1 : 0);

      let waterDrop = 4 + (readinessPenalty > 1 ? 1 : 0);
      if (upgradeWaterBonus > 20) waterDrop = 2 + (readinessPenalty > 1 ? 1 : 0);
      else if (upgradeWaterBonus > 10) waterDrop = 3 + (readinessPenalty > 1 ? 1 : 0);

      let fuelDrop = 3 + (readinessPenalty > 2 ? 1 : 0);

      setEnergy(e => Math.max(0, e - energyDrop));
      setWater(w => Math.max(0, w - waterDrop));
      setFuel(f => Math.max(0, f - fuelDrop));

      const willDepleteResource =
        energy - energyDrop <= 0 ||
        water - waterDrop <= 0 ||
        fuel - fuelDrop <= 0;

      if (willDepleteResource) {
        setBoatCondition(c => Math.max(0, c - 4));
      }

      let conditionDropChance = 0.7;
      if (upgradeNavigationBonus > 15 || upgradeSafetyBonus > 15) conditionDropChance = 0.85;
      if (readinessPenalty > 0) conditionDropChance = Math.max(0.45, conditionDropChance - readinessPenalty * 0.08);

      if (Math.random() > conditionDropChance) {
        let dmg = Math.floor(Math.random() * 3) + 1;
        if (upgradeRiskReduction > 10) dmg = Math.max(1, dmg - 1);
        setBoatCondition(c => Math.max(0, c - dmg));
      }

      const events = [
        { text: "Uygun rüzgar yakalandı. Harika bir seyir.", effect: () => {} },
        { text: "Harika görüntü fırsatı! +100 takipçi.", effect: () => { setFollowers(f => f + 100); triggerFlash("followers"); } },
        { text: "Hafif teknik sorun.", effect: () => setBoatCondition(c => Math.max(0, c - 3)) },
        { text: "Değişken hava. Enerji üretimi azaldı.", effect: () => setEnergy(e => Math.max(0, e - 3)) },
        { text: "Sakin seyir.", effect: () => {} },
        { text: "Kısa video fırsatı. +150 takipçi.", effect: () => { setFollowers(f => f + 150); triggerFlash("followers"); } },
        { text: "Küçük sponsor ilgisi. +100 TL.", effect: () => { setCredits(cr => cr + 100); triggerFlash("credits"); } },
      ];

      if (hasRouteReadinessGap) {
        events.push({
          text: "Hazırlık eksikleri seyri zorlaştırdı. Kaynak tüketimi arttı.",
          effect: () => {
            setEnergy(e => Math.max(0, e - 2));
            setWater(w => Math.max(0, w - 2));
            setBoatCondition(c => Math.max(0, c - 2));
          },
        });
      }

      const evt = events[Math.floor(Math.random() * events.length)];
      evt.effect();
      setCurrentSeaEvent(evt.text);
      setLogs(logsPrev => [evt.text, ...logsPrev.slice(0, 4)]);

      if (newDays <= 0) {
        setStep("ARRIVAL_SCREEN");
      }
      return newDays;
    });
  };

  const handleResolveSeaDecision = (choiceKey: "choiceA" | "choiceB") => {
    if (!pendingDecisionId) return;

    const decision = SEA_DECISION_EVENTS.find(event => event.id === pendingDecisionId);
    if (!decision) {
      setPendingDecisionId(null);
      return;
    }

    const choice = decision[choiceKey];
    const effect = choice.effect;
    const creditsDelta = effect.credits;
    const followersDelta = effect.followers;
    const energyDelta = effect.energy;
    const waterDelta = effect.water;
    const fuelDelta = effect.fuel;
    const boatConditionDelta = effect.boatCondition;
    const remainingDaysDelta = effect.remainingDays;

    if (typeof creditsDelta === "number") {
      setCredits(prev => Math.max(0, prev + creditsDelta));
      triggerFlash("credits");
    }

    if (typeof followersDelta === "number") {
      setFollowers(prev => Math.max(0, prev + followersDelta));
      triggerFlash("followers");
    }

    if (typeof energyDelta === "number") {
      setEnergy(prev => Math.max(0, Math.min(100, prev + energyDelta)));
    }
    if (typeof waterDelta === "number") {
      setWater(prev => Math.max(0, Math.min(100, prev + waterDelta)));
    }
    if (typeof fuelDelta === "number") {
      setFuel(prev => Math.max(0, Math.min(100, prev + fuelDelta)));
    }
    if (typeof boatConditionDelta === "number") {
      setBoatCondition(prev => Math.max(0, Math.min(100, prev + boatConditionDelta)));
    }
    if (typeof remainingDaysDelta === "number") {
      setVoyageDaysRemaining(prev => Math.max(0, prev + remainingDaysDelta));
    }

    const effectSummary = [
      typeof followersDelta === "number" ? `${followersDelta > 0 ? "+" : ""}${followersDelta} takipçi` : null,
      typeof creditsDelta === "number" ? `${creditsDelta > 0 ? "+" : ""}${creditsDelta} TL` : null,
      typeof energyDelta === "number" ? `${energyDelta > 0 ? "+" : ""}${energyDelta} enerji` : null,
      typeof waterDelta === "number" ? `${waterDelta > 0 ? "+" : ""}${waterDelta} su` : null,
      typeof fuelDelta === "number" ? `${fuelDelta > 0 ? "+" : ""}${fuelDelta} yakıt` : null,
      typeof boatConditionDelta === "number" ? `${boatConditionDelta > 0 ? "+" : ""}${boatConditionDelta} tekne durumu` : null,
      typeof remainingDaysDelta === "number" ? `${remainingDaysDelta > 0 ? "+" : ""}${remainingDaysDelta} gün` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    setCurrentSeaEvent(choice.resultText);
    setLogs(prev => [`${decision.title}: ${choice.resultText}`, ...prev.slice(0, 4)]);
    pushToast(
      "sea_decision",
      "Karar Uygulandı",
      effectSummary
        ? `${choice.label}. ${effectSummary}`
        : choice.label || "Seçimin denizdeki yolculuğun gidişatını etkiledi.",
    );
    setCaptainXp(prev => prev + 30);
    setPendingDecisionId(null);
  };

  const handleArrival = () => {
    if (!currentRoute) return;

    const reward = getRouteCompletionRewards(currentRoute);

    setWorldProgress(currentRoute.worldProgressPercent);
    setCompletedRouteIds(prev => [...prev, currentRoute.id]);
    setCurrentLocationName(currentRoute.to);
    setCredits(prev => prev + reward.credits);
    setFollowers(prev => prev + reward.followers);
    triggerFlash("credits");
    triggerFlash("followers");

    const nextR = getNextRoute(currentRoute.id as RouteId);
    if (nextR) {
       setCurrentRouteId(nextR.id);
    }

    setLogs(prev => [`${currentRoute.name} rotası tamamlandı. ${currentRoute.to} limanına varıldı. +${reward.credits} TL, +${reward.followers} takipçi ödül alındı.`, ...prev.slice(0, 4)]);
    setCaptainXp(prev => prev + 80);
    completeGoal("complete_route");
    setPendingDecisionId(null);
    setStep("HUB");
    setActiveTab("liman");
  };

  const handleProduceContentV2 = () => {
    if (!selectedPlatformId || !selectedContentType) return;

    if (lastContentAt && Date.now() - lastContentAt < CONTENT_COOLDOWN_MS) {
      const remainingMs = CONTENT_COOLDOWN_MS - (Date.now() - lastContentAt);
      const remainingMin = Math.ceil(remainingMs / 60000);
      setLogs(prev => [`İçerik hazırlığı sürüyor. ${remainingMin} dakika sonra tekrar üret.`, ...prev.slice(0, 4)]);
      return;
    }

    let quality = 40;
    
    // Skill bonus
    quality += (selectedProfile.skills.content || 0) * 5;
    
    // Platform match
    const platform = SOCIAL_PLATFORMS.find(p => p.id === selectedPlatformId);
    if (platform && platform.bestContentTypes.includes(selectedContentType as any)) {
      quality += 10;
    }
    
    // Custom specific type logic matching user request
    const isViewTubeMatch = selectedPlatformId === "viewTube" && ["boat_tour", "maintenance_upgrade", "sailing_vlog"].includes(selectedContentType);
    const isClipTokMatch = selectedPlatformId === "clipTok" && ["nature_bay", "sailing_vlog", "storm_vlog"].includes(selectedContentType);
    const isInstaSeaMatch = selectedPlatformId === "instaSea" && ["marina_life", "city_trip", "nature_bay"].includes(selectedContentType);
    const isFacePortMatch = selectedPlatformId === "facePort" && ["marina_life", "boat_tour", "ocean_diary"].includes(selectedContentType);
    
    if (isViewTubeMatch || isClipTokMatch || isInstaSeaMatch || isFacePortMatch) {
      quality += 10;
    }

    // Upgrades bonus
    quality += upgradeContentBonus;

    // Location/Route bonus
    if (step === "SEA_MODE" && currentRoute) {
       if (currentRoute.contentPotential === "very_high") quality += 15;
       else if (currentRoute.contentPotential === "high") quality += 10;
       else if (currentRoute.contentPotential === "medium_high") quality += 5;
    } else {
       quality += 5;
    }

    // Randomizer
    quality += Math.floor(Math.random() * 26) - 10;
    quality = Math.max(0, Math.min(100, quality));

    // Viral Chance
    let viralChance = 0;
    if (quality >= 85) viralChance = 0.25;
    else if (quality >= 70) viralChance = 0.10;
    else if (quality >= 40) viralChance = 0.03;

    const isViral = Math.random() < viralChance;

    let gainFollowers = quality * 5;
    let gainCredits = quality * 8;

    if (selectedPlatformId === "viewTube") { gainCredits *= 1.5; gainFollowers *= 1.0; }
    if (selectedPlatformId === "clipTok") { gainCredits *= 0.8; gainFollowers *= 1.8; }
    if (selectedPlatformId === "instaSea") { gainCredits *= 1.1; gainFollowers *= 1.3; }
    if (selectedPlatformId === "facePort") { gainCredits *= 1.0; gainFollowers *= 1.1; }

    if (isViral) {
      gainFollowers *= 3;
      gainCredits *= 2;
    }

    gainFollowers = Math.floor(gainFollowers);
    gainCredits = Math.floor(gainCredits);

    const comment = getContentComment(selectedContentType, quality, isViral);

    setContentResult({
      platform: platform?.name || "Bilinmeyen",
      type: selectedContentType,
      quality,
      viral: isViral,
      followersGained: gainFollowers,
      creditsGained: gainCredits,
      comment
    });

    setCredits(prev => prev + gainCredits);
    setFollowers(prev => prev + gainFollowers);
    setFirstContentDone(true);
    setTotalContentProduced(prev => prev + 1);
    triggerFlash("credits");
    triggerFlash("followers");

    const logMsg = `${platform?.name} platformunda içerik yayınlandı: +${gainFollowers} Takipçi, +${gainCredits} TL.`;
    setLogs(prev => [logMsg, ...prev.slice(0, 4)]);
    pushToast(
      "content",
      "İçerik Yayınlandı!",
      platform?.name
        ? `+${gainFollowers.toLocaleString("tr-TR")} takipçi kazandın. Platform: ${platform.name}`
        : `+${gainFollowers.toLocaleString("tr-TR")} takipçi kazandın.`,
    );
    setLastContentAt(Date.now());
    setCaptainXp(prev => prev + 20);
    completeGoal("produce_content");
  };

  const handleCheckSponsorOffers = () => {
    const tier = getSponsorTierByFollowers(followers, brandTrust);
    if (!tier) {
      setLogs(prev => ["Şu an uygun sponsor teklifi yok. Takipçi ve marka güvenini artır.", ...prev.slice(0, 4)]);
      return;
    }
    
    const sponsorBrands = ["BlueWave Kamera", "Marina Plus", "OceanSafe Güvenlik", "SolarDeck Enerji", "SailWear Outdoor", "DeepRoute Navigasyon"];
    const randomBrand = sponsorBrands[Math.floor(Math.random() * sponsorBrands.length)];
    
    const newOffer = {
      id: "spo_" + Date.now(),
      brandName: randomBrand,
      tierName: tier.name,
      tierId: tier.tier,
      minReward: tier.rewardRange.min,
      maxReward: tier.rewardRange.max,
    };
    
    setSponsorOffers(prev => [...prev, newOffer]);
  };

  const handleAcceptSponsor = (offerId: string) => {
    const offer = sponsorOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    let baseReward = Math.floor(Math.random() * (offer.maxReward - offer.minReward + 1)) + offer.minReward;
    if (selectedProfile.id === "social_entrepreneur") {
      baseReward = Math.floor(baseReward * 1.1); 
    }
    
    setCredits(prev => prev + baseReward);
    setAcceptedSponsors(prev => [...prev, offer.brandName]);
    setSponsorOffers(prev => prev.filter(o => o.id !== offerId));
    triggerFlash("credits");
    
    const newCount = sponsoredContentCount + 1;
    setSponsoredContentCount(newCount);
    
    if (newCount % 3 === 0) {
      setLogs(prev => [`${offer.brandName} teklifi kabul edildi (+${baseReward} TL). Ancak takipçiler sürekli sponsorlu içeriklerden sıkılmaya başladı.`, ...prev.slice(0, 4)]);
    } else {
      setBrandTrust(prev => prev + 2);
      setLogs(prev => [`${offer.brandName} teklifi kabul edildi (+${baseReward} TL). Marka güveni arttı.`, ...prev.slice(0, 4)]);
    }
  };

  const getUpgradeInstallMs = (upgrade: (typeof BOAT_UPGRADES)[number]) => {
    if (typeof upgrade.installDays === "number" && upgrade.installDays > 0) {
      return upgrade.installDays * 30 * 60 * 1000;
    }

    if (upgrade.cost >= 15000 || upgrade.size === "large" || upgrade.size === "ocean") {
      return 30 * 60 * 1000;
    }
    if (upgrade.cost >= 7000 || upgrade.size === "medium") {
      return 15 * 60 * 1000;
    }
    return 5 * 60 * 1000;
  };

  const formatRemainingInstallTime = (targetTime: number) => {
    const remainingMs = Math.max(0, targetTime - Date.now());
    const totalMinutes = Math.ceil(remainingMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (totalMinutes < 60) {
      return `${Math.max(1, totalMinutes)} dakika kaldı`;
    }

    if (minutes === 0) {
      return `${hours} saat kaldı`;
    }

    return `${hours} saat ${minutes} dakika kaldı`;
  };

  const completeUpgradeInstallation = (
    upgradeId: string,
    existingPurchasedIds?: string[]
  ) => {
    const upgrade = BOAT_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) {
      setUpgradeInProgress(null);
      return;
    }

    const purchasedIds = existingPurchasedIds ?? purchasedUpgradeIds;
    if (purchasedIds.includes(upgradeId)) {
      setUpgradeInProgress(null);
      return;
    }

    setPurchasedUpgradeIds(prev => [...prev, upgradeId]);
    applyUpgradeEffects(upgrade);
    setUpgradeInProgress(null);
    setLogs(prev => [`Kurulum tamamlandı: ${upgrade.name} aktif edildi.`, ...prev.slice(0, 4)]);
    pushToast("upgrade", "Upgrade Tamamlandı!", `${upgrade.name} kurulumu tamamlandı!`);
  };

  const handleStartVoyage = () => {
    if (!currentRoute) return;

    const minD = currentRoute.baseDurationDays.min;
    const maxD = currentRoute.baseDurationDays.max;
    const days = Math.floor(Math.random() * (maxD - minD + 1)) + minD;

    const readinessRiskText = hasRouteReadinessGap ? " Hazırlık eksikleri bu rotada riski artırıyor." : "";

    setVoyageTotalDays(days);
    setVoyageDaysRemaining(days);
    setPendingDecisionId(null);
    setCurrentSeaEvent(`Rotaya çıkıldı. Rüzgar kolayına.${readinessRiskText}`);
    setLogs(prev => [`${currentRoute.name} rotasına çıkıldı.${readinessRiskText}`, ...prev.slice(0, 4)]);
    pushToast(
      "voyage",
      "Seyir Başladı!",
      currentRoute.feeling
        ? `Hedef: ${currentRoute.name}. ${currentRoute.feeling}`
        : `Hedef: ${currentRoute.name}. Dünya turunda yeni bir etap başlıyor.`,
    );
    setStep("SEA_MODE");
    setActiveTab("liman");
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = BOAT_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (upgradeInProgress) {
      setLogs(prev => ["Kurulum devam ediyor. Yeni upgrade için mevcut kurulumun bitmesini bekle.", ...prev.slice(0, 4)]);
      return;
    }

    if (purchasedUpgradeIds.includes(upgradeId)) {
      return;
    }

    if (credits < upgrade.cost) {
      setLogs(prev => ["Yetersiz bütçe. Bu upgrade için daha fazla kredi gerekiyor.", ...prev.slice(0, 4)]);
      return;
    }

    const installMs = getUpgradeInstallMs(upgrade);
    const completesAt = Date.now() + installMs;
    const installMinutes = Math.max(1, Math.ceil(installMs / 60000));

    setCredits(prev => prev - upgrade.cost);
    setUpgradeInProgress({ upgradeId, completesAt });
    triggerFlash("credits");
    setLogs(prev => [`Kurulum başladı: ${upgrade.name}. Tahmini tamamlanma: ${installMinutes} dakika.`, ...prev.slice(0, 4)]);
    completeGoal("buy_upgrade");
  };

  const renderLimanTab = () => (
    <LimanTab
      selectedBoatId={selectedBoat.id}
      currentLocationName={currentLocationName}
      worldProgress={worldProgress}
      currentOceanReadiness={currentOceanReadiness}
      credits={credits}
      energy={energy}
      water={water}
      fuel={fuel}
      boatCondition={boatCondition}
      firstContentDone={firstContentDone}
      completedRouteIds={completedRouteIds}
      currentRouteName={currentRoute?.name}
      logs={logs}
      onMarinaRest={handleMarinaRest}
      onRepairBoat={handleRepairBoat}
      onGoContent={() => setActiveTab("icerik")}
      onGoRoute={() => setActiveTab("rota")}
      renderDailyGoals={renderDailyGoalsCard}
    />
  );

  const renderSeaModeTab = () => (
    <SeaModeTab
      selectedBoatId={selectedBoat.id}
      voyageDaysRemaining={voyageDaysRemaining}
      voyageTotalDays={voyageTotalDays}
      currentSeaEvent={currentSeaEvent}
      energy={energy}
      water={water}
      fuel={fuel}
      boatCondition={boatCondition}
      routeFromName={currentRoute?.from}
      routeToName={currentRoute?.to}
      onAdvanceDay={advanceDay}
      pendingDecision={
        pendingDecisionId
          ? SEA_DECISION_EVENTS.find(event => event.id === pendingDecisionId) ?? null
          : null
      }
      onResolveDecision={handleResolveSeaDecision}
    />
  );

  const renderIcerikTab = () => {
    const CONTENT_TYPES: Array<{ id: string; label: string; icon: string }> = [
      { id: "marina_life", label: "Marina Yaşamı", icon: "⚓" },
      { id: "boat_tour", label: "Tekne Turu", icon: "⛵" },
      { id: "maintenance_upgrade", label: "Bakım / Upgrade", icon: "🔧" },
      { id: "city_trip", label: "Şehir Gezisi", icon: "🏛" },
      { id: "nature_bay", label: "Koy / Doğa", icon: "🌅" },
      { id: "sailing_vlog", label: "Seyir Vlogu", icon: "🧭" },
    ];

    if (step === "SEA_MODE") {
      CONTENT_TYPES.push({ id: "ocean_diary", label: "Deniz Günlüğü", icon: "🌐" });
      CONTENT_TYPES.push({ id: "storm_vlog", label: "Fırtına / Olay", icon: "⛈" });
    }

    const PLATFORM_VISUALS: Record<string, { icon: string; specialty: string }> = {
      viewTube: { icon: "▶", specialty: "Kalıcı büyüme" },
      clipTok:  { icon: "⚡", specialty: "Viral patlama" },
      instaSea: { icon: "◈", specialty: "Marka işbirliği" },
      facePort: { icon: "◉", specialty: "Sadık topluluk" },
    };

    const nextSponsorTier = SPONSOR_TIERS.find((tier) => followers < tier.minFollowers);
    const previousSponsorTier = [...SPONSOR_TIERS]
      .reverse()
      .find((tier) => followers >= tier.minFollowers);
    const currentSponsorTier = getSponsorTierByFollowers(followers, brandTrust);
    const activeSponsorName = acceptedSponsors[acceptedSponsors.length - 1] ?? "";
    const sponsorProgressMin = previousSponsorTier?.minFollowers ?? 0;
    const sponsorProgressMax = nextSponsorTier?.minFollowers ?? sponsorProgressMin;
    const sponsorProgressPercent =
      sponsorProgressMax > sponsorProgressMin
        ? Math.max(
            0,
            Math.min(
              100,
              ((followers - sponsorProgressMin) / (sponsorProgressMax - sponsorProgressMin)) * 100
            )
          )
        : 100;
    const selectedPlatform = selectedPlatformId
      ? SOCIAL_PLATFORMS.find((platform) => platform.id === selectedPlatformId) ?? null
      : null;
    const contentCooldownRemaining = lastContentAt
      ? Math.max(0, CONTENT_COOLDOWN_MS - (Date.now() - lastContentAt))
      : 0;
    const cooldownMinutes = Math.ceil(contentCooldownRemaining / 60000);

    let contentCareerTitle = "Platform Momentum";
    let contentCareerText =
      "Düzenli içerik üretimi takipçiyi, sponsor fırsatlarını ve kaptan kariyerini büyütür.";

    if (activeSponsorName) {
      contentCareerTitle = "Marka Değeri Büyüyor";
      contentCareerText = "Her içerik, sponsor değerini ve dünya turu hikayeni güçlendiriyor.";
    } else if (nextSponsorTier && followers >= nextSponsorTier.minFollowers * 0.75) {
      contentCareerTitle = "Sponsor Eşiğine Yaklaşıyorsun";
      contentCareerText = "İçerik üretmeye devam et. İlk marka anlaşması artık daha yakın.";
    } else if (followers < 800) {
      contentCareerTitle = "İlk Kitleyi Kur";
      contentCareerText = "Her içerik, ilk sadık takipçilerini toplamak için bir adım.";
    }

    const onContentCooldown = contentCooldownRemaining > 0;
    const followersToTier = nextSponsorTier
      ? Math.max(0, nextSponsorTier.minFollowers - followers)
      : 0;
    const ctaDisabled = !selectedPlatformId || !selectedContentType || onContentCooldown;
    const selectedTypeMeta = selectedContentType
      ? CONTENT_TYPES.find((t) => t.id === selectedContentType) ?? null
      : null;

    return (
      <div className="tab-content fade-in">
        <div className="sub-tab-bar">
           <button className={`sub-tab ${icerikSubTab === "produce" ? "active" : ""}`} onClick={() => setIcerikSubTab("produce")}>İçerik Üret</button>
           <button className={`sub-tab ${icerikSubTab === "sponsor" ? "active" : ""}`} onClick={() => setIcerikSubTab("sponsor")}>Sponsorluklar</button>
        </div>

        {icerikSubTab === "produce" && (
          <div className="cs-studio fade-in">
            <header className="cs-header">
              <div className="cs-header-rim" aria-hidden="true"></div>
              <span className="cs-eyebrow">◐ Kaptan Medya Odası</span>
              <h2 className="cs-title">{contentCareerTitle}</h2>
              <p className="cs-subtitle">{contentCareerText}</p>
              <div className="cs-stat-strip">
                <div className="cs-stat-chip">
                  <span className="cs-stat-label">Takipçi</span>
                  <span className="cs-stat-value">{followers.toLocaleString("tr-TR")}</span>
                </div>
                <div className="cs-stat-chip">
                  <span className="cs-stat-label">Bütçe</span>
                  <span className="cs-stat-value cs-stat-value--gold">{credits.toLocaleString("tr-TR")} TL</span>
                </div>
                {nextSponsorTier && (
                  <div className="cs-stat-chip cs-stat-chip--target">
                    <span className="cs-stat-label">{nextSponsorTier.name}'a</span>
                    <span className="cs-stat-value cs-stat-value--cyan">
                      {followersToTier.toLocaleString("tr-TR")}
                    </span>
                  </div>
                )}
              </div>
            </header>

            {!contentResult ? (
              <>
                {step === "SEA_MODE" && currentRoute && (
                  <div className="cs-route-hint">
                    <span className="cs-route-hint-icon" aria-hidden="true">🌊</span>
                    <div className="cs-route-hint-body">
                      <span className="cs-route-hint-label">Şu an: {currentRoute.name}</span>
                      <span className="cs-route-hint-themes">{currentRoute.contentThemes.join(" · ")}</span>
                    </div>
                  </div>
                )}

                <div className="cs-step-row">
                  <span className="cs-step-num">01</span>
                  <span className="cs-step-text">Yayın Platformu</span>
                </div>
                <div className="cs-platform-grid">
                  {SOCIAL_PLATFORMS.filter(p => p.mvpStatus === "active").map(platform => {
                    const visual = PLATFORM_VISUALS[platform.id] ?? { icon: "●", specialty: platform.mainRole };
                    const isActive = selectedPlatformId === platform.id;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        className={`cs-platform-tile ${isActive ? "is-active" : ""}`}
                        data-platform={platform.id}
                        onClick={() => setSelectedPlatformId(platform.id)}
                      >
                        <div className="cs-platform-icon">
                          <span aria-hidden="true">{visual.icon}</span>
                        </div>
                        <div className="cs-platform-text">
                          <strong className="cs-platform-name">{platform.name}</strong>
                          <span className="cs-platform-role">{visual.specialty}</span>
                        </div>
                        {isActive && <span className="cs-platform-check" aria-hidden="true">✓</span>}
                      </button>
                    );
                  })}
                </div>

                <div className={`cs-step-row ${!selectedPlatformId ? "cs-step-row--locked" : ""}`}>
                  <span className="cs-step-num">02</span>
                  <span className="cs-step-text">İçerik Formatı</span>
                  {selectedPlatformId && (
                    <span className="cs-step-hint">altın kenar = uyumlu</span>
                  )}
                </div>
                {!selectedPlatformId ? (
                  <div className="cs-types-locked">Önce platform seç</div>
                ) : (
                  <div className="cs-type-grid">
                    {CONTENT_TYPES.map(type => {
                      const isMatch = selectedPlatform?.bestContentTypes.includes(type.id as any) ?? false;
                      const isActive = selectedContentType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          className={`cs-type-tile ${isActive ? "is-active" : ""} ${isMatch ? "is-match" : ""}`}
                          onClick={() => setSelectedContentType(type.id)}
                        >
                          <span className="cs-type-icon" aria-hidden="true">{type.icon}</span>
                          <span className="cs-type-label">{type.label}</span>
                          {isMatch && <span className="cs-type-badge">UYUMLU</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="cs-cta-block">
                  {selectedPlatformId && selectedContentType && !onContentCooldown && (
                    <div className="cs-cta-preview">
                      <span className="cs-cta-preview-icon">{PLATFORM_VISUALS[selectedPlatformId]?.icon ?? "●"}</span>
                      <span className="cs-cta-preview-text">
                        {selectedPlatform?.name} <span className="cs-cta-sep">·</span> {selectedTypeMeta?.label}
                      </span>
                    </div>
                  )}
                  {onContentCooldown ? (
                    <div className="cs-cooldown-card">
                      <span className="cs-cooldown-eyebrow">Stüdyo Dinleniyor</span>
                      <strong className="cs-cooldown-time">{cooldownMinutes} dk</strong>
                      <span className="cs-cooldown-text">Bir sonraki içerik için kısa bir nefes.</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`cs-cta-btn ${ctaDisabled ? "is-disabled" : ""}`}
                      onClick={handleProduceContentV2}
                      disabled={ctaDisabled}
                    >
                      <span className="cs-cta-btn-icon" aria-hidden="true">🎬</span>
                      <span className="cs-cta-btn-label">İÇERİK ÜRET</span>
                    </button>
                  )}
                  {!selectedPlatformId || !selectedContentType ? (
                    <span className="cs-cta-hint">
                      {!selectedPlatformId ? "Önce yayın platformu seç" : "Bir format seç"}
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="cs-result-card fade-in">
                {contentResult.viral && (
                  <div className="cs-result-viral" aria-hidden="true">🔥 VİRAL</div>
                )}
                <span className="cs-result-eyebrow">Yayınlandı</span>
                <div className="cs-result-quality">
                  <span className="cs-result-quality-num">{contentResult.quality}</span>
                  <span className="cs-result-quality-max">/100</span>
                  <span className="cs-result-quality-label">kalite skoru</span>
                </div>
                <div className="cs-result-meta">
                  <span className="cs-result-platform">{contentResult.platform}</span>
                </div>
                <div className="cs-result-gains">
                  <div className="cs-gain cs-gain--followers">
                    <span className="cs-gain-num">+{contentResult.followersGained.toLocaleString("tr-TR")}</span>
                    <span className="cs-gain-label">Takipçi</span>
                  </div>
                  <div className="cs-gain cs-gain--credits">
                    <span className="cs-gain-num">+{contentResult.creditsGained.toLocaleString("tr-TR")} TL</span>
                    <span className="cs-gain-label">Kredi</span>
                  </div>
                </div>
                <p className="cs-result-comment">"{contentResult.comment}"</p>
                <button
                  type="button"
                  className="cs-result-reset"
                  onClick={() => {
                    setContentResult(null);
                    setSelectedPlatformId(null);
                    setSelectedContentType(null);
                  }}
                >
                  Yeni İçerik Üret
                </button>
              </div>
            )}
          </div>
        )}

        {icerikSubTab === "sponsor" && (
          <div className="sponsor-section fade-in">
            <div className="sponsor-career-card">
              <span className="sponsor-career-eyebrow">Sponsor Kariyeri</span>
              {activeSponsorName ? (
                <div className="sponsor-career-title">{activeSponsorName}</div>
              ) : (
                <div className="sponsor-career-title">İlk anlaşma seni bekliyor</div>
              )}
              <div className="sponsor-career-meta">
                Marka Güveni: {brandTrust}/100
                {currentSponsorTier ? ` · Seviye: ${currentSponsorTier.name}` : ""}
              </div>
              {nextSponsorTier && (
                <>
                  <div className="sponsor-progress-bar mt-10">
                    <div className="sponsor-progress-fill" style={{ width: `${sponsorProgressPercent}%` }}></div>
                  </div>
                  <div className="sponsor-career-highlight">
                    {followers.toLocaleString("tr-TR")} / {nextSponsorTier.minFollowers.toLocaleString("tr-TR")} takipçi · Hedef: {nextSponsorTier.name}
                  </div>
                </>
              )}
            </div>

            <button className="btn-primary full-width mb-20" onClick={handleCheckSponsorOffers}>
               Teklifleri Kontrol Et
            </button>

            <h3 className="section-title">Gelen Teklifler</h3>
            {sponsorOffers.length === 0 ? (
               <p className="empty-text">Henüz yeni bir sponsor teklifi yok. Daha fazla takipçi kazan veya içerik kaliteni artır.</p>
            ) : (
               <div className="sponsor-offers-list">
                  {sponsorOffers.map(offer => (
                     <div key={offer.id} className="sponsor-card fade-in">
                        <div className="spo-header">
                           <strong>{offer.brandName}</strong>
                           <span className="spo-tier">{offer.tierName}</span>
                        </div>
                        <p className="spo-career-line">Bu anlaşma, dünya turu hikayeni bir marka işbirliğine dönüştürür.</p>
                        <p className="spo-reward-line">Kariyer Geliri: {offer.minReward.toLocaleString("tr-TR")} – {offer.maxReward.toLocaleString("tr-TR")} TL</p>
                        <button className="btn-primary mt-10 full-width" onClick={() => handleAcceptSponsor(offer.id)}>Kabul Et</button>
                     </div>
                  ))}
               </div>
            )}

            {acceptedSponsors.length > 0 && (
               <>
                  <h3 className="section-title mt-20">Aktif Sponsorlar</h3>
                  <div className="accepted-sponsors-list">
                     {acceptedSponsors.map((name, i) => <span key={i} className="spo-badge">{name}</span>)}
                  </div>
               </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRotaTab = () => {
    const nextRouteData = currentRoute ? getNextRoute(currentRoute.id as RouteId) : undefined;
    return (
    <>
      <RotaTab
        currentRoute={currentRoute
          ? {
              ...currentRoute,
              feeling: currentRoute.feeling,
              difficulty: currentRoute.difficulty,
            }
          : undefined}
        nextRoute={nextRouteData
          ? { name: nextRouteData.name, feeling: nextRouteData.feeling, riskLevel: nextRouteData.riskLevel }
          : undefined}
        routeReadiness={{
          oceanReadiness: {
            current: currentOceanReadiness,
            required: currentRoute?.requirements.minOceanReadiness ?? 0,
          },
          energy: {
            current: upgradeEnergyBonus,
            required: currentRoute?.requirements.minEnergy ?? 0,
          },
          water: {
            current: upgradeWaterBonus,
            required: currentRoute?.requirements.minWater ?? 0,
          },
          safety: {
            current: upgradeSafetyBonus,
            required: currentRoute?.requirements.minSafety ?? 0,
          },
          navigation: {
            current: upgradeNavigationBonus,
            required: currentRoute?.requirements.minNavigation ?? 0,
          },
          maintenance: {
            current: upgradeMaintenanceBonus,
            required: currentRoute?.requirements.minMaintenance ?? 0,
          },
        }}
        isSeaMode={step === "SEA_MODE"}
        completedRouteIds={completedRouteIds}
        onStartVoyage={handleStartVoyage}
        onGoTekne={() => setActiveTab("tekne")}
        onGoUpgradeCategory={(cat) => {
          setActiveTab("tekne");
          setSelectedUpgradeCategory(cat as UpgradeCategoryId);
        }}
      />
    </>
  );
  };

  const renderTekneTab = () => {
    const filteredUpgrades = BOAT_UPGRADES.filter(u => u.categoryId === selectedUpgradeCategory);
    const currentInstallingUpgrade = upgradeInProgress
      ? BOAT_UPGRADES.find(u => u.id === upgradeInProgress.upgradeId) ?? null
      : null;
    const currentInstallLabel = upgradeInProgress
      ? formatRemainingInstallTime(upgradeInProgress.completesAt)
      : "";

    const tkStats: Array<{ key: "energy" | "water" | "safety" | "nav"; icon: string; label: string; value: number }> = [
      { key: "energy", icon: "⚡", label: "Enerji", value: upgradeEnergyBonus },
      { key: "water", icon: "💧", label: "Su", value: upgradeWaterBonus },
      { key: "safety", icon: "🛟", label: "Güvenlik", value: upgradeSafetyBonus },
      { key: "nav", icon: "🧭", label: "Navigasyon", value: upgradeNavigationBonus },
    ];

    return (
      <div className="tab-content tk-tab-v2 fade-in">
        {/* ── Boat hero ── */}
        <div className="tk-hero glass-card">
          <div className="tk-hero-glow" aria-hidden="true" />
          <div className="tk-hero-top">
            <div className="tk-hero-boat">
              <span className="tk-hero-boat-halo" aria-hidden="true" />
              <span className="tk-hero-boat-svg">{getBoatSvg(selectedBoat.id)}</span>
            </div>
            <div className="tk-hero-id">
              <span className="tk-hero-eyebrow">⚙ TERSANE</span>
              <h2 className="tk-hero-name">{boatName}</h2>
              <p className="tk-hero-class">{selectedBoat.name} · {selectedBoat.lengthFt} ft</p>
            </div>
            <div className="tk-hero-credits">
              <strong>{credits.toLocaleString("tr-TR")} TL</strong>
              <small>Bütçe</small>
            </div>
          </div>

          <div className="tk-readiness-box">
            <div className="tk-readiness-row">
              <span className="tk-readiness-label">Okyanus Hazırlığı</span>
              <strong className="tk-readiness-val">{currentOceanReadiness}%</strong>
            </div>
            <div className="tk-readiness-track">
              <div className="tk-readiness-fill" style={{ width: `${currentOceanReadiness}%` }} />
            </div>
          </div>

          <div className="tk-stats-grid">
            {tkStats.map(s => (
              <div key={s.key} className="tk-stat-chip" data-stat={s.key}>
                <span className="tk-stat-icon">{s.icon}</span>
                <div className="tk-stat-body">
                  <span className="tk-stat-label">{s.label}</span>
                  <strong className="tk-stat-val">{s.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentInstallingUpgrade && (
          <div className="tk-install-card glass-card">
            <span className="tk-install-pulse" aria-hidden="true" />
            <div className="tk-install-icon">🔧</div>
            <div className="tk-install-body">
              <span className="tk-install-eyebrow">KURULUM SÜRÜYOR</span>
              <strong className="tk-install-name">{currentInstallingUpgrade.name}</strong>
              <span className="tk-install-time">{currentInstallLabel}</span>
            </div>
          </div>
        )}

        <div className="tk-cat-strip">
          {UPGRADE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`tk-cat-pill${selectedUpgradeCategory === cat.id ? " is-active" : ""}`}
              onClick={() => setSelectedUpgradeCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="tk-upgrade-list">
          {filteredUpgrades.map(upgrade => {
            const isPurchased = purchasedUpgradeIds.includes(upgrade.id);
            const isInstalling = upgradeInProgress?.upgradeId === upgrade.id;
            const comp = upgrade.compatibility.find(c => c.boatId === selectedBoat.id);
            const isCompatible = comp ? comp.compatible : false;
            const hasWarning = comp && (comp.efficiency === "poor" || comp.efficiency === "limited");
            const cantAfford = credits < upgrade.cost;
            const buyDisabled = cantAfford || !!upgradeInProgress;

            return (
              <div
                key={upgrade.id}
                className={`tk-upg-card glass-card${!isCompatible ? " is-incompat" : ""}${isPurchased ? " is-owned" : ""}`}
              >
                <div className="tk-upg-head">
                  <div className="tk-upg-title-row">
                    <strong className="tk-upg-name">{upgrade.name}</strong>
                    {isPurchased && <span className="tk-upg-badge tk-upg-badge--owned">✓ ALINDI</span>}
                    {!isCompatible && <span className="tk-upg-badge tk-upg-badge--incompat">UYUMSUZ</span>}
                  </div>
                  {!isPurchased && (
                    <span className={`tk-upg-cost${cantAfford ? " is-low" : ""}`}>
                      {upgrade.cost.toLocaleString("tr-TR")} TL
                    </span>
                  )}
                </div>

                <p className="tk-upg-desc">{upgrade.description}</p>

                <div className="tk-upg-meta">
                  <span className="tk-upg-meta-pill">⏱ {upgrade.installDays} gün</span>
                  <span className="tk-upg-meta-pill">⚓ {upgrade.marinaRequirement.toUpperCase()}</span>
                </div>

                <div className="tk-upg-effects">
                  {Object.entries(upgrade.effects).map(([key, val]) => {
                    if (!val) return null;
                    return (
                      <span key={key} className="tk-upg-effect-chip">
                        {upgradeEffectLabels[key] ?? key} <strong>+{val}</strong>
                      </span>
                    );
                  })}
                </div>

                {hasWarning && !isPurchased && isCompatible && (
                  <div className="tk-upg-note tk-upg-note--warn">⚠️ Bu teknede verimi sınırlı: {comp.note}</div>
                )}
                {!isCompatible && (
                  <div className="tk-upg-note tk-upg-note--error">❌ Bu tekne için uygun değil.</div>
                )}

                {!isPurchased && isCompatible && (
                  <button
                    className={`tk-upg-cta${buyDisabled ? " is-disabled" : ""}`}
                    onClick={() => handleBuyUpgrade(upgrade.id)}
                    disabled={buyDisabled}
                  >
                    <span className="tk-upg-cta-icon">{isInstalling ? "🔧" : upgradeInProgress ? "⏳" : cantAfford ? "✕" : "⚙"}</span>
                    <span className="tk-upg-cta-label">
                      {isInstalling
                        ? "Kurulumda"
                        : upgradeInProgress
                          ? "Kurulum Bekleniyor"
                          : cantAfford
                            ? "Yetersiz Bütçe"
                            : "Satın Al"}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderKaptanTab = () => (
    <KaptanTab
      selectedProfile={selectedProfile}
      captainLevel={captainLevel}
      captainXp={captainXp}
      completedRoutesCount={completedRouteIds.length}
      worldProgress={worldProgress}
      followers={followers}
      achievementStatuses={achievementStatuses}
      logs={logs}
    />
  );

  const completeGoal = (type: DailyGoal["type"]) => {
    setDailyGoals(prev => prev.map(g => g.type === type && !g.completed ? { ...g, completed: true } : g));
  };

  const renderDailyGoalsCard = () => {
    const completedCount = dailyGoals.filter(g => g.completed).length;
    const allDone = completedCount === dailyGoals.length;
    const dailyGoalTheme = getDailyGoalTheme(lastDailyReset || new Date().toISOString().slice(0, 10));
    return (
      <div className={`daily-goals-card${allDone ? " daily-goals-done" : ""}`}>
        <div className="daily-goals-header">
          <span className="daily-goals-title">Günlük Görevler</span>
          <span className="daily-goals-count">{completedCount}/{dailyGoals.length}</span>
        </div>
        <div className="daily-goals-focus">Bugünün Odağı: {dailyGoalTheme.title}</div>
        <ul className="daily-goals-list">
          {dailyGoals.map(g => (
            <li key={g.id} className={`daily-goal-item${g.completed ? " completed" : ""}`}>
              <span className="daily-goal-check">{g.completed ? "✓" : "○"}</span>
              <span className="daily-goal-label">{g.title}</span>
            </li>
          ))}
        </ul>
        {allDone && dailyRewardClaimed && (
          <div className="daily-goals-reward-claimed">Tüm görevler tamamlandı! +2.500 TL alındı.</div>
        )}
      </div>
    );
  };

  const renderProgressStrip = () => {
    const nextSponsorTier = SPONSOR_TIERS.find((tier) => followers < tier.minFollowers);
    const contentGoalDoneToday = dailyGoals.find((goal) => goal.type === "produce_content")?.completed ?? false;
    const hasAnyCompatibleUpgrade = BOAT_UPGRADES.some((upgrade) => {
      if (purchasedUpgradeIds.includes(upgrade.id)) return false;
      const compatibility = upgrade.compatibility.find((item) => item.boatId === selectedBoat.id);
      return compatibility?.compatible ?? false;
    });
    const canStartAnyUpgrade = !upgradeInProgress && BOAT_UPGRADES.some((upgrade) => {
      if (purchasedUpgradeIds.includes(upgrade.id)) return false;
      const compatibility = upgrade.compatibility.find((item) => item.boatId === selectedBoat.id);
      return (compatibility?.compatible ?? false) && credits >= upgrade.cost;
    });
    const isSponsorProgressClose = Boolean(nextSponsorTier && followers >= nextSponsorTier.minFollowers * 0.75);

    let nextActionTitle = "Dünya turuna devam";

    if (!contentGoalDoneToday || followers < 800) {
      nextActionTitle = "İlk içerik zamanı";
    } else if (firstContentDone && currentRoute && completedRouteIds.length < 2) {
      nextActionTitle = "İlk rotanı başlat";
    } else if (canStartAnyUpgrade || hasAnyCompatibleUpgrade) {
      nextActionTitle = "Tekneyi güçlendir";
    } else if (isSponsorProgressClose) {
      nextActionTitle = "Sponsor hedefini kovala";
    }

    return (
      <>
        <div className="progress-strip">
          <div className="progress-strip-summary">
            <span className="progress-strip-item">Kpt. Lv.{captainLevel} · {captainXp} XP</span>
            <span className="progress-strip-sep">|</span>
            <span className="progress-strip-item">{followers.toLocaleString("tr-TR")} takipçi</span>
            <span className="progress-strip-sep">|</span>
            <span className="progress-strip-item">Dünya Turu: {completedRouteIds.length}/{WORLD_ROUTES.length} Rota</span>
          </div>

        </div>

        {!tavsiyeDismissed && (
          <div className="next-action-card">
            <div className="next-action-content">
              <span className="next-action-eyebrow">Kaptan Tavsiyesi</span>
              <div className="next-action-title">{nextActionTitle}</div>
            </div>
            <button
              className="next-action-cta primary-button"
              onClick={() => setActiveTab(
                (!contentGoalDoneToday || followers < 800) ? "icerik" :
                (firstContentDone && completedRouteIds.length < 2) ? "rota" :
                (canStartAnyUpgrade || hasAnyCompatibleUpgrade) ? "tekne" : "icerik"
              )}
            >
              Git →
            </button>
            <button
              className="next-action-dismiss"
              onClick={() => setTavsiyeDismissed(true)}
              aria-label="Kapat"
            >
              ×
            </button>
          </div>
        )}
      </>
    );
  };

  const renderMainGame = () => (
    <HubScreen
      step={step}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      boatName={boatName}
      selectedBoatName={selectedBoat.name}
      currentRoute={currentRoute}
      credits={credits}
      followers={followers}
      flashCredits={flashCredits}
      flashFollowers={flashFollowers}
      firstContentDone={firstContentDone}
      completedRouteIds={completedRouteIds}
      renderProgressStrip={renderProgressStrip}
      renderLimanTab={renderLimanTab}
      renderSeaModeTab={renderSeaModeTab}
      renderIcerikTab={renderIcerikTab}
      renderRotaTab={renderRotaTab}
      renderTekneTab={renderTekneTab}
      renderKaptanTab={renderKaptanTab}
    />
  );

  const renderArrivalScreen = () => {
    const arrivalReward = currentRoute ? getRouteCompletionRewards(currentRoute) : null;
    const completedRouteCount = Math.min(completedRouteIds.length + 1, WORLD_ROUTES.length);
    const nextRoute = currentRoute ? getNextRoute(currentRoute.id as RouteId) : undefined;
    const rewardCredits = arrivalReward?.credits ?? 0;
    const rewardFollowers = arrivalReward?.followers ?? 0;
    const arrivalSummaryProgressPercent = Math.max(
      0,
      Math.min(100, (completedRouteCount / WORLD_ROUTES.length) * 100)
    );
    let arrivalMilestoneText = "Bu varış, dünya turundaki bir sonraki büyük adımın.";
    if (completedRouteCount === 1) {
      arrivalMilestoneText = "İlk rota tamamlandı. Artık bu yolculuk gerçekten başladı.";
    } else if (arrivalSummaryProgressPercent >= 100) {
      arrivalMilestoneText = "Dünya turu tamamlandı. Bu artık bir hayal değil, başarı hikayesi.";
    } else if (arrivalSummaryProgressPercent >= 75) {
      arrivalMilestoneText = "Son büyük etaplara giriyorsun. Dünya turu artık ulaşılabilir görünüyor.";
    } else if (arrivalSummaryProgressPercent >= 50) {
      arrivalMilestoneText = "Yolculuğun yarısı geride kaldı. Artık gerçek bir açık deniz hikayesi yazıyorsun.";
    } else if (arrivalSummaryProgressPercent >= 25) {
      arrivalMilestoneText = "Dünya turunun ilk çeyreğine yaklaşıyorsun.";
    }

    return (
      <ArrivalScreen
        portName={currentRoute?.to ?? "Varış Limanı"}
        feeling={currentRoute?.feeling}
        rewardCredits={rewardCredits}
        rewardFollowers={rewardFollowers}
        xpGain={80}
        worldProgressPercent={currentRoute?.worldProgressPercent ?? 0}
        completedRouteIds={completedRouteIds}
        currentRouteId={currentRoute?.id ?? ""}
        milestoneText={arrivalMilestoneText}
        nextRouteName={nextRoute?.name}
        onDone={handleArrival}
      />
    );
  };

  return (
    <div className="game-wrapper">
      <AppBackground />
      {activeToast && (
        <div
          className={`game-toast game-toast--${activeToast.type}${isToastLeaving ? " leaving" : ""}`}
          role="status"
          aria-live="polite"
          onClick={() => setActiveToast(null)}
        >
          <div className="game-toast-title">{activeToast.title}</div>
          <div className="game-toast-text">{activeToast.text}</div>
        </div>
      )}
      {["MAIN_MENU", "PICK_PROFILE", "PICK_MARINA", "PICK_BOAT", "NAME_BOAT"].includes(step) && (
        <Onboarding
          step={step}
          setStep={setStep}
          profileIndex={profileIndex}
          setProfileIndex={setProfileIndex}
          marinaIndex={marinaIndex}
          setMarinaIndex={setMarinaIndex}
          marinaFilter={marinaFilter}
          setMarinaFilter={setMarinaFilter}
          boatIndex={boatIndex}
          setBoatIndex={setBoatIndex}
          boatName={boatName}
          setBoatName={(name) => {
            setBoatName(name);
            if (onboardingMessage) setOnboardingMessage("");
          }}
          onboardingMessage={onboardingMessage}
          hasSave={hasSave}
          saveBoatName={saveBoatName}
          onLoadGame={loadGame}
          onFinalizeGame={finalizeGame}
        />
      )}
      {(step === "HUB" || step === "SEA_MODE") && renderMainGame()}
      {step === "ARRIVAL_SCREEN" && renderArrivalScreen()}
      {activeCelebration && (
        <CelebrationModal
          celebration={activeCelebration}
          onDismiss={() => setActiveCelebration(null)}
        />
      )}
    </div>
  );
}

export default App;
