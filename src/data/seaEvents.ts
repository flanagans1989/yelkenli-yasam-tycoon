export type SeaDecisionEffect = {
  credits?: number;
  followers?: number;
  energy?: number;
  water?: number;
  fuel?: number;
  boatCondition?: number;
  remainingDays?: number;
};

export type SeaDecisionChoice = {
  label: string;
  resultText: string;
  effect: SeaDecisionEffect;
};

export type SeaDecisionEvent = {
  id: string;
  title: string;
  description: string;
  choiceA: SeaDecisionChoice;
  choiceB: SeaDecisionChoice;
};

export const SEA_DECISION_EVENTS: SeaDecisionEvent[] = [
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
