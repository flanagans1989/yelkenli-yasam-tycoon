export type PlatformKey =
  | "viewTube"
  | "clipTok"
  | "instaSea"
  | "facePort"
  | "liveWave";

export type RatingLevel =
  | "very_low"
  | "low"
  | "low_medium"
  | "medium"
  | "medium_high"
  | "high"
  | "very_high";

export type ContentType =
  | "marina_life"
  | "boat_tour"
  | "maintenance_upgrade"
  | "city_trip"
  | "nature_bay"
  | "sailing_vlog"
  | "storm_vlog"
  | "ocean_diary"
  | "live_stream"
  | "sponsored_content";

export interface SocialPlatform {
  id: PlatformKey;
  name: string;
  tagline: string;
  description: string;
  mainRole: string;
  revenuePower: RatingLevel;
  followerGrowthPower: RatingLevel;
  viralPower: RatingLevel;
  sponsorPower: RatingLevel;
  loyaltyPower: RatingLevel;
  equipmentNeed: RatingLevel;
  energyNeed: RatingLevel;
  bestContentTypes: ContentType[];
  strengths: string[];
  weaknesses: string[];
  mvpStatus: "active" | "simple" | "future";
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "viewTube",
    name: "ViewTube",
    tagline: "Uzun video, kalıcı izlenme ve güçlü reklam geliri.",
    description:
      "ViewTube, rota vlogları, tekne turu, teknik hazırlık videoları, okyanus geçiş belgeselleri ve dünya turu bölümleri için güçlü uzun video platformudur.",
    mainRole: "Kalıcı büyüme, yüksek gelir ve uzun vadeli kanal değeri.",
    revenuePower: "high",
    followerGrowthPower: "medium_high",
    viralPower: "medium",
    sponsorPower: "high",
    loyaltyPower: "medium_high",
    equipmentNeed: "high",
    energyNeed: "medium_high",
    bestContentTypes: [
      "boat_tour",
      "maintenance_upgrade",
      "sailing_vlog",
      "storm_vlog",
      "ocean_diary",
      "sponsored_content",
    ],
    strengths: [
      "Uzun video gelirinde güçlüdür.",
      "Dünya turu bölümleri için idealdir.",
      "Sponsor güveni oluşturur.",
      "Teknik ve belgesel içeriklerde iyi çalışır.",
    ],
    weaknesses: [
      "İçerik hazırlaması daha uzun sürer.",
      "İyi ekipman ister.",
      "ClipTok kadar hızlı takipçi patlaması vermeyebilir.",
    ],
    mvpStatus: "active",
  },
  {
    id: "clipTok",
    name: "ClipTok",
    tagline: "Kısa video, hızlı büyüme ve viral patlama.",
    description:
      "ClipTok; fırtına anları, drone görüntüleri, marina kısa videoları, komik deniz anları ve riskli rota kesitleri için güçlü kısa video platformudur.",
    mainRole: "Hızlı takipçi büyümesi ve viral sıçrama.",
    revenuePower: "low_medium",
    followerGrowthPower: "very_high",
    viralPower: "very_high",
    sponsorPower: "medium",
    loyaltyPower: "low_medium",
    equipmentNeed: "medium",
    energyNeed: "medium",
    bestContentTypes: [
      "city_trip",
      "nature_bay",
      "sailing_vlog",
      "storm_vlog",
      "live_stream",
    ],
    strengths: [
      "Çok hızlı takipçi kazandırabilir.",
      "Riskli ve görsel içeriklerde güçlüdür.",
      "Kısa oturumlu mobil oyuncu hissine uygundur.",
      "Fırtına, drone ve ilginç anlar viral olabilir.",
    ],
    weaknesses: [
      "Gelir gücü ViewTube kadar yüksek değildir.",
      "Takipçi sadakati daha dalgalıdır.",
      "Viral olmayan içerikler hızlı unutulabilir.",
    ],
    mvpStatus: "active",
  },
  {
    id: "instaSea",
    name: "InstaSea",
    tagline: "Görsel yaşam tarzı, marina estetiği ve sponsor uyumu.",
    description:
      "InstaSea; marina yaşamı, Göcek, Fethiye, Sardinya, Balear ve Karayipler gibi görsel lokasyonlarda lifestyle ve sponsor içerikleri için güçlü platformdur.",
    mainRole: "Görsel büyüme, lifestyle algısı ve marka işbirliği.",
    revenuePower: "medium",
    followerGrowthPower: "high",
    viralPower: "medium",
    sponsorPower: "very_high",
    loyaltyPower: "medium",
    equipmentNeed: "medium_high",
    energyNeed: "medium",
    bestContentTypes: [
      "marina_life",
      "boat_tour",
      "city_trip",
      "nature_bay",
      "sponsored_content",
    ],
    strengths: [
      "Sponsor uyumu çok güçlüdür.",
      "Görsel lokasyonlarda hızlı büyür.",
      "Premium marina ve lifestyle içerikleri için idealdir.",
      "Aile / Yaşam Kanalı ve Sosyal Girişimci profilleriyle iyi çalışır.",
    ],
    weaknesses: [
      "Çok teknik içeriklerde zayıf kalabilir.",
      "Kötü görsel kalite etkileşimi düşürür.",
      "Fazla sponsorlu içerik güveni azaltabilir.",
    ],
    mvpStatus: "active",
  },
  {
    id: "facePort",
    name: "FacePort",
    tagline: "Sadık topluluk, güven ve uzun vadeli takipçi.",
    description:
      "FacePort; aile yaşamı, yolculuk güncellemeleri, samimi yazılar, tekne günlüğü ve uzun seri takipçileri için güçlü topluluk platformudur.",
    mainRole: "Sadık kitle, güven ve dengeli büyüme.",
    revenuePower: "medium",
    followerGrowthPower: "medium",
    viralPower: "low_medium",
    sponsorPower: "medium_high",
    loyaltyPower: "very_high",
    equipmentNeed: "low_medium",
    energyNeed: "low_medium",
    bestContentTypes: [
      "marina_life",
      "boat_tour",
      "maintenance_upgrade",
      "ocean_diary",
      "sponsored_content",
    ],
    strengths: [
      "Sadık takipçi oluşturur.",
      "Aile ve yaşam içeriklerinde güçlüdür.",
      "Uzun yolculuk serilerini takip ettirir.",
      "Sponsor güveni ve marka sadakati için faydalıdır.",
    ],
    weaknesses: [
      "Viral patlama gücü düşüktür.",
      "Takipçi büyümesi ClipTok kadar hızlı değildir.",
      "Görsel ve hızlı içerik platformları kadar heyecanlı hissettirmeyebilir.",
    ],
    mvpStatus: "active",
  },
  {
    id: "liveWave",
    name: "LiveWave",
    tagline: "Canlı yayın, bağış ve yüksek etkileşim.",
    description:
      "LiveWave; okyanus geçiş canlı yayınları, Karayip etkinlikleri, marina buluşmaları, sponsorlu canlı yayınlar ve soru-cevap içerikleri için güçlü canlı yayın platformudur.",
    mainRole: "Canlı etkileşim, bağış ve özel etkinlik geliri.",
    revenuePower: "medium_high",
    followerGrowthPower: "medium",
    viralPower: "medium_high",
    sponsorPower: "high",
    loyaltyPower: "high",
    equipmentNeed: "very_high",
    energyNeed: "very_high",
    bestContentTypes: ["live_stream", "storm_vlog", "ocean_diary", "sponsored_content"],
    strengths: [
      "Canlı etkileşim ve bağış potansiyeli yüksektir.",
      "Okyanus geçişleri ve kriz anları için güçlüdür.",
      "Sponsorlu canlı yayınlara uygundur.",
      "Sadık kitleden güçlü geri dönüş alabilir.",
    ],
    weaknesses: [
      "Enerji ve internet ihtiyacı çok yüksektir.",
      "Uydu interneti olmadan denizde sınırlıdır.",
      "MVP’de tam sistem olarak ağır olabilir.",
    ],
    mvpStatus: "simple",
  },
];

export function getSocialPlatformById(
  id: PlatformKey
): SocialPlatform | undefined {
  return SOCIAL_PLATFORMS.find((platform) => platform.id === id);
}

export function getActiveMvpPlatforms(): SocialPlatform[] {
  return SOCIAL_PLATFORMS.filter((platform) => platform.mvpStatus === "active");
}

export function getPlatformsByContentType(
  contentType: ContentType
): SocialPlatform[] {
  return SOCIAL_PLATFORMS.filter((platform) =>
    platform.bestContentTypes.includes(contentType)
  );
}