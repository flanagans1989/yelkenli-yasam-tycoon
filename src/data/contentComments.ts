export type CommentBands = { low: string[]; medium: string[]; high: string[]; viral: string[] };

export const CONTENT_COMMENTS: Record<string, CommentBands> = {
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

export const getContentComment = (contentType: string, quality: number, isViral: boolean): string => {
  const pool = CONTENT_COMMENTS[contentType];
  if (!pool) return "İzleyici bu hikayeyi sevdi.";
  const arr = isViral ? pool.viral : quality >= 70 ? pool.high : quality >= 40 ? pool.medium : pool.low;
  return arr[Math.floor(Math.random() * arr.length)] ?? "İzleyici bu hikayeyi sevdi.";
};
