export type PlayerProfileId =
  | "old_captain"
  | "content_creator"
  | "technical_master"
  | "adventure_traveler"
  | "social_entrepreneur"
  | "family_lifestyle";

export type SkillKey =
  | "seamanship"
  | "content"
  | "technical"
  | "sponsor"
  | "riskManagement"
  | "lifestyle";

export type PlatformKey =
  | "viewTube"
  | "clipTok"
  | "instaSea"
  | "facePort"
  | "liveWave";

export type SkillValues = Record<SkillKey, number>;

export type PlatformFit = Record<PlatformKey, "weak" | "medium" | "strong" | "very_strong">;

export interface PlayerProfile {
  id: PlayerProfileId;
  name: string;
  shortName: string;
  tagline: string;
  story: string;
  playStyle: string;
  difficulty: "easy" | "easy_medium" | "medium" | "medium_hard" | "hard";
  skills: SkillValues;
  advantage: {
    title: string;
    description: string;
  };
  disadvantage: {
    title: string;
    description: string;
  };
  platformFit: PlatformFit;
  startingBonus: string;
  startingPenalty: string;
  bestFor: string[];
  skillPaths: string[];
}

export const PLAYER_PROFILES: PlayerProfile[] = [
  {
    id: "old_captain",
    name: "Eski Kaptan",
    shortName: "Kaptan",
    tagline: "Denizde güçlü, sosyal medyada yavaş başlar.",
    story:
      "Yıllarını denizde geçirmiş, rüzgarı, rotayı ve tekne dilini iyi bilen deneyimli bir kaptandır. Sosyal medya dünyasına geç girmiştir ama denizde ne yaptığını çok iyi bilir.",
    playStyle:
      "Güvenli seyir, düşük risk, sağlam rota planı ve fırtınaya dayanıklılık isteyen oyuncular için uygundur.",
    difficulty: "easy_medium",
    skills: {
      seamanship: 5,
      content: 2,
      technical: 3,
      sponsor: 2,
      riskManagement: 5,
      lifestyle: 3,
    },
    advantage: {
      title: "Tecrübeli Seyirci",
      description: "Rota riski azalır, fırtına ve deniz krizi ihtimali düşer.",
    },
    disadvantage: {
      title: "Sosyal Medyaya Uzak",
      description: "İçerik büyümesi ve viral şans başlangıçta düşüktür.",
    },
    platformFit: {
      viewTube: "medium",
      clipTok: "weak",
      instaSea: "medium",
      facePort: "strong",
      liveWave: "medium",
    },
    startingBonus: "İlk 3 seyirde rota riski -%15.",
    startingPenalty: "ClipTok büyümesi -%10.",
    bestFor: ["Güvenli seyir", "Açık deniz", "Fırtına yönetimi", "Uzun rota"],
    skillPaths: [
      "Fırtına Okuma",
      "Güvenli Rota Planlama",
      "Okyanus Geçiş Tecrübesi",
      "Denizci Hikaye Anlatımı",
      "Kaptanlık Otoritesi",
    ],
  },
  {
    id: "content_creator",
    name: "İçerik Üreticisi",
    shortName: "Üretici",
    tagline: "Takipçiyi hızlı büyütür ama denizde daha dikkatli olmalıdır.",
    story:
      "Kamera, kurgu, trend ve sosyal medya dilini çok iyi bilen ama denizcilikte acemi olan bir içerik üreticisidir.",
    playStyle:
      "Hızlı takipçi kazanmak, viral içerikler üretmek ve sosyal medya gelirini erkenden büyütmek isteyen oyuncular için uygundur.",
    difficulty: "medium_hard",
    skills: {
      seamanship: 2,
      content: 5,
      technical: 2,
      sponsor: 4,
      riskManagement: 2,
      lifestyle: 4,
    },
    advantage: {
      title: "Viral İçerik Gözü",
      description: "İçerik kalitesi, takipçi kazanımı ve viral olma ihtimali artar.",
    },
    disadvantage: {
      title: "Denizcilikte Acemi",
      description: "Seyir riski, rota hatası ve kriz ihtimali başlangıçta yüksektir.",
    },
    platformFit: {
      viewTube: "strong",
      clipTok: "very_strong",
      instaSea: "strong",
      facePort: "medium",
      liveWave: "strong",
    },
    startingBonus: "İlk 5 içerikte takipçi kazanımı +%20.",
    startingPenalty: "İlk 3 seyirde rota riski +%10.",
    bestFor: ["Viral büyüme", "Kısa video", "Takipçi kazanımı", "Sosyal medya geliri"],
    skillPaths: [
      "Viral Kurgu",
      "Hikaye Anlatımı",
      "Drone ve Kamera Ustalığı",
      "Platform Algoritması",
      "Denizcilik Temelleri",
    ],
  },
  {
    id: "technical_master",
    name: "Teknik Usta",
    shortName: "Usta",
    tagline: "Bakım, tamir ve upgrade tarafında güçlüdür.",
    story:
      "Motor, elektrik, bakım ve onarım konusunda eli güçlü olan pratik bir ustadır. Teknenin her sesinden, her titreşiminden bir şey anlar.",
    playStyle:
      "Masrafı düşürmek, arıza riskini azaltmak ve tekneyi verimli geliştirmek isteyen oyuncular için uygundur.",
    difficulty: "medium",
    skills: {
      seamanship: 3,
      content: 2,
      technical: 5,
      sponsor: 2,
      riskManagement: 4,
      lifestyle: 2,
    },
    advantage: {
      title: "Kendi İşini Kendi Çözer",
      description: "Tamir maliyetleri düşer, arıza riski azalır, upgrade kurulum süresi kısalır.",
    },
    disadvantage: {
      title: "Sosyal Etki Zayıf",
      description: "Sponsor çekme ve viral büyüme başlangıçta düşük kalır.",
    },
    platformFit: {
      viewTube: "medium",
      clipTok: "weak",
      instaSea: "weak",
      facePort: "medium",
      liveWave: "weak",
    },
    startingBonus: "İlk 3 bakım/tamir işleminde maliyet -%20.",
    startingPenalty: "Sponsor teklif ihtimali -%10.",
    bestFor: ["Bakım", "Tamir", "Enerji sistemleri", "Motor ve mekanik"],
    skillPaths: [
      "Motor Bakımı",
      "Elektrik ve Enerji Sistemleri",
      "Acil Onarım",
      "Upgrade Montaj Hızı",
      "Teknik İçerik Üretimi",
    ],
  },
  {
    id: "adventure_traveler",
    name: "Maceracı Gezgin",
    shortName: "Gezgin",
    tagline: "Riskli rotalarda büyük hikaye ve viral fırsat üretir.",
    story:
      "Konfor alanından çıkmayı seven, bilinmeyen koylara, riskli rotalara ve yüksek hikaye potansiyeline koşan bir gezgindir.",
    playStyle:
      "Risk almayı seven, yüksek ödül ve yüksek tehlike dengesini isteyen oyuncular için uygundur.",
    difficulty: "hard",
    skills: {
      seamanship: 4,
      content: 4,
      technical: 2,
      sponsor: 3,
      riskManagement: 3,
      lifestyle: 2,
    },
    advantage: {
      title: "Keşif Ruhu",
      description: "Riskli rota ve özel lokasyon içeriklerinde takipçi ve viral bonusu alır.",
    },
    disadvantage: {
      title: "Fazla Cesur",
      description: "Enerji, bakım ve güvenlik ihmali daha pahalı sonuçlar doğurabilir.",
    },
    platformFit: {
      viewTube: "strong",
      clipTok: "strong",
      instaSea: "medium",
      facePort: "medium",
      liveWave: "strong",
    },
    startingBonus: "Riskli lokasyon içeriklerinde viral şans +%15.",
    startingPenalty: "Bakım ihmali cezası +%15.",
    bestFor: ["Keşif", "Riskli rota", "Fırtına içeriği", "Belgesel hissi"],
    skillPaths: [
      "Riskli Rota Cesareti",
      "Keşif İçeriği",
      "Krizden Hikaye Çıkarma",
      "Zorlu Hava Dayanıklılığı",
      "Ekipmansız Çözüm Üretme",
    ],
  },
  {
    id: "social_entrepreneur",
    name: "Sosyal Girişimci",
    shortName: "Girişimci",
    tagline: "Sponsor, marka ve gelir tarafında güçlüdür.",
    story:
      "Marka, sponsor, pazarlık ve büyüme stratejisini iyi bilen bir girişimcidir. Yolculuğu ticari bir denizcilik markasına çevirmeyi bilir.",
    playStyle:
      "Sponsor gelirleri, reklam anlaşmaları, marka büyümesi ve stratejik ilerleme isteyen oyuncular için uygundur.",
    difficulty: "medium",
    skills: {
      seamanship: 2,
      content: 4,
      technical: 1,
      sponsor: 5,
      riskManagement: 3,
      lifestyle: 4,
    },
    advantage: {
      title: "Marka Aklı",
      description: "Sponsor teklifleri daha erken gelir, anlaşma gelirleri daha yüksek olur.",
    },
    disadvantage: {
      title: "Teknik Bilgi Zayıf",
      description: "Arıza, bakım ve upgrade kararlarında daha pahalı sonuçlarla karşılaşabilir.",
    },
    platformFit: {
      viewTube: "strong",
      clipTok: "medium",
      instaSea: "very_strong",
      facePort: "strong",
      liveWave: "medium",
    },
    startingBonus: "İlk sponsor teklif eşiği -%20.",
    startingPenalty: "Tamir ve bakım maliyeti +%10.",
    bestFor: ["Sponsor", "Marka", "Gelir", "Premium marina"],
    skillPaths: [
      "Sponsor Pazarlığı",
      "Marka Uyum Analizi",
      "Reklam Geliri Artışı",
      "Premium Kitle Yönetimi",
      "İşbirliği Kampanyaları",
    ],
  },
  {
    id: "family_lifestyle",
    name: "Aile / Yaşam Kanalı",
    shortName: "Yaşam",
    tagline: "Sadık kitle, lifestyle ve konfor içeriklerinde güçlüdür.",
    story:
      "Tekne yaşamını samimi, sıcak ve düzenli bir içerik kanalına dönüştüren profildir. Riskten çok huzur, aile, yaşam kalitesi ve sadık takipçi kitlesi ön plandadır.",
    playStyle:
      "Dengeli, güvenli, sadık takipçi odaklı ve lifestyle içerik seven oyuncular için uygundur.",
    difficulty: "easy_medium",
    skills: {
      seamanship: 3,
      content: 4,
      technical: 2,
      sponsor: 4,
      riskManagement: 4,
      lifestyle: 5,
    },
    advantage: {
      title: "Sadık Topluluk",
      description: "FacePort ve InstaSea büyümesi daha dengeli, sponsor güveni daha yüksek olur.",
    },
    disadvantage: {
      title: "Riskli İçerik Zayıf",
      description: "Fırtına, kriz ve ekstrem rota içeriklerinde viral potansiyel düşüktür.",
    },
    platformFit: {
      viewTube: "medium",
      clipTok: "medium",
      instaSea: "very_strong",
      facePort: "very_strong",
      liveWave: "medium",
    },
    startingBonus: "FacePort ve InstaSea sadık kitle kazanımı +%15.",
    startingPenalty: "Riskli içerik viral şansı -%10.",
    bestFor: ["Sadık kitle", "Lifestyle", "Konfor", "Aile dostu sponsor"],
    skillPaths: [
      "Samimi İçerik",
      "Sadık Kitle",
      "Konforlu Tekne Yaşamı",
      "Aile Dostu Sponsorlar",
      "Güvenli Seyir Planı",
    ],
  },
];

export function getPlayerProfileById(id: PlayerProfileId): PlayerProfile | undefined {
  return PLAYER_PROFILES.find((profile) => profile.id === id);
}