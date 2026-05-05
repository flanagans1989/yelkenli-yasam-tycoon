interface RotaTabProps {
  currentRoute?: {
    name: string;
    description: string;
    riskLevel: string;
    baseDurationDays: {
      min: number;
      max: number;
    };
    contentPotential: string;
  };
  isSeaMode: boolean;
  onStartVoyage: () => void;
}

export function RotaTab({
  currentRoute,
  isSeaMode,
  onStartVoyage,
}: RotaTabProps) {
  return (
    <div className="tab-content fade-in">
      <span className="card-label">Navigasyon Masası</span>
      <h2>Sıradaki Rotalar</h2>

      {currentRoute ? (
        <article className="route-card">
          <div className="route-header">
            <h3>{currentRoute.name}</h3>
            <span className="risk-badge" data-risk={currentRoute.riskLevel}>{currentRoute.riskLevel.toUpperCase()}</span>
          </div>
          <p>{currentRoute.description}</p>

          <div className="route-stats">
            <div><span>Süre:</span> <strong>{currentRoute.baseDurationDays.min}-{currentRoute.baseDurationDays.max} Gün</strong></div>
            <div><span>İçerik:</span> <strong>{currentRoute.contentPotential.toUpperCase()}</strong></div>
          </div>

          <button className="btn-primary full-width mt-20" onClick={onStartVoyage} disabled={isSeaMode}>
            {isSeaMode ? "Zaten Denizdesin" : "Rotaya Çık"}
          </button>
        </article>
      ) : (
        <p>Tüm rotalar tamamlandı!</p>
      )}
    </div>
  );
}
