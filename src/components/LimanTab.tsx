import { getBoatSvg } from "./Onboarding";

interface LimanTabProps {
  selectedBoatId: string;
  currentLocationName: string;
  worldProgress: number;
  currentOceanReadiness: number;
  credits: number;
  energy: number;
  water: number;
  fuel: number;
  boatCondition: number;
  firstContentDone: boolean;
  completedRouteIds: string[];
  currentRouteName?: string;
  logs: string[];
  onMarinaRest: () => void;
  onRepairBoat: () => void;
  onGoContent: () => void;
  onGoRoute: () => void;
}

export function LimanTab({
  selectedBoatId,
  currentLocationName,
  worldProgress,
  currentOceanReadiness,
  credits,
  energy,
  water,
  fuel,
  boatCondition,
  firstContentDone,
  completedRouteIds,
  currentRouteName,
  logs,
  onMarinaRest,
  onRepairBoat,
  onGoContent,
  onGoRoute,
}: LimanTabProps) {
  return (
    <div className="tab-content fade-in">
      <div className="hub-center-visual">
        <div className="hub-scene">
          <div className="hub-boat-display">{getBoatSvg(selectedBoatId)}</div>
          <div className="hub-water-line"></div>
        </div>
        <h3>{currentLocationName}</h3>
      </div>

      <div className="hub-progress-cards">
        <div className="prog-card">
          <span>Dünya Turu</span>
          <strong>%{worldProgress}</strong>
        </div>
        <div className="prog-card">
          <span>Okyanus Hazırlığı</span>
          <strong>{currentOceanReadiness}%</strong>
        </div>
      </div>

      {!firstContentDone ? (
        <button className="quest-card pulse" onClick={onGoContent}>
          <div className="quest-icon">🎬</div>
          <div className="quest-texts">
            <h3>İlk içeriğini üret</h3>
            <p>İçerik Stüdyosuna Git</p>
          </div>
        </button>
      ) : (
        <button className="quest-card done" onClick={onGoRoute}>
          <div className="quest-icon">✅</div>
          <div className="quest-texts">
            <h3>{completedRouteIds.length > 0 ? "Yeni limana ulaştın" : "Sıradaki rotaya hazırlan"}</h3>
            <p>Sıradaki Rota: {currentRouteName || "Bilinmiyor"}</p>
          </div>
          <span className="quest-card-arrow">›</span>
        </button>
      )}

      <div className="event-log-compact">
        <span className="card-label">Marina Servisi</span>
        <div className="log-entry">Enerji: %{energy} · Su: %{water} · Yakıt: %{fuel} · Durum: %{boatCondition}</div>
        <button className="btn-secondary full-width mt-10" onClick={onMarinaRest}>
          Marina’da Dinlen
        </button>
        <button className="btn-secondary full-width mt-10" onClick={onRepairBoat} disabled={credits < 250}>
          Tekneyi Onar - 250 TL
        </button>
      </div>

      <div className="event-log-compact">
        <span className="card-label">Son Olaylar</span>
        {logs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
      </div>
    </div>
  );
}
