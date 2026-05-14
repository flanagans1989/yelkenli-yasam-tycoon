import { useMemo } from "react";
import type { ContentResult } from "../types/game";

type ContentResultCardProps = {
  result: ContentResult;
  onReset: () => void;
};

const FOLLOWER_NAMES = ["Ahmet", "Fatma", "Emre", "Zeynep", "Can", "Selin", "Mert", "Ayşe", "Burak", "Gizem", "Kaan", "Elif"];

const FOLLOWER_COMMENTS_LOW = [
  "Güzel içerik olmuş 👍",
  "Devam et bakıyorum 🙂",
  "Takip ettim!",
  "Türkiye'de böyle kanal az",
  "Fena değil",
];
const FOLLOWER_COMMENTS_MEDIUM = [
  "Bu videoyu bekliyordum! ⚓",
  "Her zaman izliyorum seni 🌊",
  "Harika çekim, tebrikler!",
  "Gelecek videoyu sabırsızlıkla bekliyorum",
  "Bu deniz manzarası inanılmaz 😍",
  "Arkadaşıma attım, o da abone oldu",
];
const FOLLOWER_COMMENTS_HIGH = [
  "Bu videoyu 3 kez izledim 🔁🔥",
  "Kardeşim sen profesyonelsin artık!",
  "Nasıl bu kadar güzel çekiyorsun?? 😭",
  "Sponsor bulsam bu kanala veririm",
  "Abiler herkes abone olsun burası büyüyecek",
];
const FOLLOWER_COMMENTS_VIRAL = [
  "Viral oldu, iyi ki görmüşüm! 🚀",
  "Tüm kanallar bunu paylaşıyor 🔥🔥",
  "Bu içerik beni Türkiye'yi ziyaret etmeye ikna etti!",
  "Dünya çapında takip ediyorum seni artık 🌍",
  "Bu video efsane oldu, tarihe geçti",
];

function pickRandom<T>(arr: T[], count: number, seed: number): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  let s = seed;
  while (result.length < count && result.length < arr.length) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const idx = s % arr.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx] as T);
    }
  }
  return result;
}

export function ContentResultCard({ result, onReset }: ContentResultCardProps) {
  const { comments, names } = useMemo(() => {
    const pool = result.viral
      ? FOLLOWER_COMMENTS_VIRAL
      : result.quality >= 70
      ? FOLLOWER_COMMENTS_HIGH
      : result.quality >= 40
      ? FOLLOWER_COMMENTS_MEDIUM
      : FOLLOWER_COMMENTS_LOW;

    const seed = result.quality * 31 + result.followersGained;
    const pickedComments = pickRandom(pool, 3, seed);
    const pickedNames = pickRandom(FOLLOWER_NAMES, 3, seed + 7);
    return { comments: pickedComments, names: pickedNames };
  }, [result.quality, result.viral, result.followersGained]);

  return (
    <div className="cs-result-card fade-in">
      {result.viral && (
        <div className="cs-result-viral" aria-hidden="true">🔥 VİRAL</div>
      )}
      <span className="cs-result-eyebrow">Yayınlandı</span>
      <div className="cs-result-quality">
        <span className="cs-result-quality-num">{result.quality}</span>
        <span className="cs-result-quality-max">/100</span>
        <span className="cs-result-quality-label">kalite skoru</span>
      </div>
      <div className="cs-result-meta">
        <span className="cs-result-platform">{result.platform}</span>
      </div>
      {result.storyHookTitle && (
        <div className="cs-result-story-hook">
          <span className="cs-result-story-hook-label">{result.storyHookTitle}</span>
          {result.storyHookSummary && (
            <span className="cs-result-story-hook-text">{result.storyHookSummary}</span>
          )}
          {result.sponsorInterestGained && (
            <span className="cs-result-story-hook-text">
              +{result.sponsorInterestGained} marka guveni
            </span>
          )}
        </div>
      )}
      <div className="cs-result-gains">
        <div className="cs-gain cs-gain--followers">
          <span className="cs-gain-num">+{result.followersGained.toLocaleString("tr-TR")}</span>
          <span className="cs-gain-label">Takipçi</span>
        </div>
        <div className="cs-gain cs-gain--credits">
          <span className="cs-gain-num">+{result.creditsGained.toLocaleString("tr-TR")} TL</span>
          <span className="cs-gain-label">Kredi</span>
        </div>
      </div>
      <p className="cs-result-comment">"{result.comment}"</p>

      <div className="cs-follower-comments">
        {comments.map((comment, i) => (
          <div key={i} className={`cs-follower-row${result.viral ? " cs-follower-row--viral" : ""}`} style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="cs-follower-avatar">{names[i]?.[0] ?? "?"}</div>
            <div className="cs-follower-body">
              <span className="cs-follower-name">{names[i]}</span>
              <span className="cs-follower-text">{comment}</span>
            </div>
            {result.viral && <span className="cs-follower-like cs-follower-like--anim">❤️</span>}
          </div>
        ))}
      </div>

      <button type="button" className="cs-result-reset" onClick={onReset}>
        Yeni İçerik Üret
      </button>
    </div>
  );
}
