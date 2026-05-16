export type CelebrationItem =
  | { type: "levelup"; level: number; rank: string; bonus: number }
  | { type: "achievement"; title: string; description: string; icon: string }
  | { type: "daily_goals" }
  | { type: "sponsor"; brandName: string }
  | { type: "world_tour" };

interface CelebrationModalProps {
  celebration: CelebrationItem;
  onDismiss: () => void;
}

export function CelebrationModal({ celebration, onDismiss }: CelebrationModalProps) {
  const renderParticles = () => (
    <div className="cel-particles" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 80 + Math.random() * 60;
        const dx = Math.cos(angle) * dist + "px";
        const dy = Math.sin(angle) * dist + "px";
        return (
          <div 
            key={i} 
            className={`cel-particle cel-particle--${i % 3}`} 
            style={{ '--dx': dx, '--dy': dy } as any}
          />
        );
      })}
    </div>
  );

  if (celebration.type === "levelup") {
    return (
      <div className="cel-modal" role="dialog" aria-modal="true" aria-label="Seviye atladın">
        <div className="cel-backdrop" aria-hidden="true" onClick={onDismiss} />
        <div className="cel-card glass-card cel-card--levelup">
          {renderParticles()}
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

  if (celebration.type === "daily_goals") {
    return (
      <div className="cel-modal" role="dialog" aria-modal="true" aria-label="Günlük görevler tamamlandı">
        <div className="cel-backdrop" aria-hidden="true" onClick={onDismiss} />
        <div className="cel-card glass-card cel-card--daily">
          {renderParticles()}
          <span className="cel-eyebrow cel-eyebrow--green">GÜNLÜK GÖREVLER TAMAMLANDI</span>
          <div className="cel-daily-icon">✅</div>
          <div className="cel-daily-title">Harika İş!</div>
          <div className="cel-bonus">+2.500 TL ödül kazandın</div>
          <button className="primary-button cel-dismiss-btn" onClick={onDismiss}>
            Süper!
          </button>
        </div>
      </div>
    );
  }

  if (celebration.type === "sponsor") {
    return (
      <div className="cel-modal" role="dialog" aria-modal="true" aria-label="İlk sponsorunu buldun">
        <div className="cel-backdrop" aria-hidden="true" onClick={onDismiss} />
        <div className="cel-card glass-card cel-card--sponsor">
          {renderParticles()}
          <span className="cel-eyebrow cel-eyebrow--sponsor">İLK SPONSOR ANLAŞMASI</span>
          <div className="cel-achievement-icon">🤝</div>
          <div className="cel-achievement-title">{celebration.brandName}</div>
          <div className="cel-achievement-desc">Bu senin ilk büyük marka anlaşman! Dünya turu için artık güçlü bir destekçin var.</div>
          <button className="primary-button cel-dismiss-btn" onClick={onDismiss}>
            Harika!
          </button>
        </div>
      </div>
    );
  }

  if (celebration.type === "world_tour") {
    return (
      <div className="cel-modal" role="dialog" aria-modal="true" aria-label="Dünya turu tamamlandı">
        <div className="cel-backdrop" aria-hidden="true" onClick={onDismiss} />
        <div className="cel-card glass-card cel-card--levelup">
          {renderParticles()}
          <span className="cel-eyebrow cel-eyebrow--gold">DÜNYA TURU TAMAMLANDI!</span>
          <div className="cel-level-badge">
            <span className="cel-level-num">🌍</span>
          </div>
          <div className="cel-rank">Efsane Kaptan</div>
          <div className="cel-achievement-desc" style={{ marginTop: "0.5rem" }}>
            Tüm rotalar keşfedildi. Artık prestij seyirleri açıldı!
          </div>
          <button className="primary-button primary-button--pulse cel-dismiss-btn" onClick={onDismiss}>
            Efsane!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cel-modal" role="dialog" aria-modal="true" aria-label="Başarım açıldı">
      <div className="cel-backdrop" aria-hidden="true" onClick={onDismiss} />
      <div className="cel-card glass-card cel-card--achievement">
        {renderParticles()}
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
