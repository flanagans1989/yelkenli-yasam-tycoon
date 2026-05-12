import type { ContentResult } from "../types/game";

type ContentResultCardProps = {
  result: ContentResult;
  onReset: () => void;
};

export function ContentResultCard({ result, onReset }: ContentResultCardProps) {
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
      <button type="button" className="cs-result-reset" onClick={onReset}>
        Yeni İçerik Üret
      </button>
    </div>
  );
}
