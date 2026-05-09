interface RouteReadinessValue {
  current: number;
  required: number;
}

interface RouteReadiness {
  oceanReadiness: RouteReadinessValue;
  energy: RouteReadinessValue;
  water: RouteReadinessValue;
  safety: RouteReadinessValue;
  navigation: RouteReadinessValue;
  maintenance: RouteReadinessValue;
}

interface RotaTabProps {
  currentRoute?: {
    name: string;
    description: string;
    feeling?: string;
    difficulty?: string;
    riskLevel: string;
    baseDurationDays: {
      min: number;
      max: number;
    };
    contentPotential: string;
    requirements: {
      minSafety: number;
      minNavigation: number;
      minEnergy: number;
      minWater: number;
      minMaintenance: number;
      minOceanReadiness?: number;
    };
  };
  routeReadiness: RouteReadiness;
  isSeaMode: boolean;
  onStartVoyage: () => void;
}

export function RotaTab({
  currentRoute,
  routeReadiness,
  isSeaMode,
  onStartVoyage,
}: RotaTabProps) {
  const readinessItems = [
    { label: "Okyanus Hazırlığı", value: routeReadiness.oceanReadiness },
    { label: "Enerji", value: routeReadiness.energy },
    { label: "Su", value: routeReadiness.water },
    { label: "Güvenlik", value: routeReadiness.safety },
    { label: "Navigasyon", value: routeReadiness.navigation },
    { label: "Bakım", value: routeReadiness.maintenance },
  ];

  const weakReadinessItems = readinessItems.filter(({ value }) => value.current < value.required);

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

          {currentRoute.difficulty && (
            <div className="route-difficulty-label">Zorluk: {currentRoute.difficulty.replace(/_/g, " ").toUpperCase()}</div>
          )}

          <div className="route-adventure-section">
            <span className="route-adventure-eyebrow">Yolculuk Notu</span>
            <p className="route-adventure-desc">{currentRoute.description}</p>
          </div>

          {currentRoute.feeling && (
            <div className="route-adventure-section">
              <span className="route-adventure-eyebrow">Rota Hissi</span>
              <p className="route-adventure-feeling">"{currentRoute.feeling}"</p>
            </div>
          )}

          <div className="route-stats">
            <div><span>Süre:</span> <strong>{currentRoute.baseDurationDays.min}-{currentRoute.baseDurationDays.max} Gün</strong></div>
            <div><span>İçerik:</span> <strong>{currentRoute.contentPotential.toUpperCase()}</strong></div>
          </div>

          <div className="event-log-compact mt-20">
            <span className="card-label">Hazırlık Durumu</span>
            {readinessItems.map(({ label, value }) => {
              const isReady = value.current >= value.required;

              return (
                <div key={label} className="log-entry">
                  {label}: {value.current} / {value.required} {isReady ? "✅" : "⚠️"}
                </div>
              );
            })}
            <p className="empty-text">Eksikler varsa yolculuk daha riskli olur. Tekne sekmesinden upgrade alarak hazırlığını artırabilirsin.</p>
            {weakReadinessItems.length > 0 && (
              <p className="empty-text">Hazırlığın düşük. Yine de çıkabilirsin ama risk artar.</p>
            )}
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
