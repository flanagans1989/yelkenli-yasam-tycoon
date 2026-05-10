export type CelebrationItem =
  | { type: "levelup"; level: number; rank: string; bonus: number }
  | { type: "achievement"; title: string; description: string; icon: string };

interface CelebrationModalProps {
  celebration: CelebrationItem;
  onDismiss: () => void;
}

export function CelebrationModal({ celebration, onDismiss }: CelebrationModalProps) {
  if (celebration.type === "levelup") {
    return (
      <div className="cel-modal" role="dialog" aria-modal="true" aria-label="Seviye atladın">
        <div className="cel-backdrop" aria-hidden="true" onClick={onDismiss} />
        <div className="cel-card glass-card cel-card--levelup">
          <span className="cel-eyebrow cel-eyebrow--gold">SEVİYE ATLADIN!</span>
          <div className="cel-level-badge">
            <span className="cel-level-num">Lv.{celebration.level}</span>
          </div>
          <div className="cel-rank">{celebration.rank}</div>
          <div className="cel-bonus">+{celebration.bonus.toLocaleString("tr-TR")} TL bonus</div>
          <button className="primary-button primary-button--pulse cel-dismiss-btn" onClick={onDismiss}>
            Devam Et
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cel-modal" role="dialog" aria-modal="true" aria-label="Başarım açıldı">
      <div className="cel-backdrop" aria-hidden="true" onClick={onDismiss} />
      <div className="cel-card glass-card cel-card--achievement">
        <span className="cel-eyebrow cel-eyebrow--cyan">BAŞARIM AÇILDI</span>
        <div className="cel-achievement-icon">{celebration.icon}</div>
        <div className="cel-achievement-title">{celebration.title}</div>
        <div className="cel-achievement-desc">{celebration.description}</div>
        <button className="primary-button cel-dismiss-btn" onClick={onDismiss}>
          Harika!
        </button>
      </div>
    </div>
  );
}
