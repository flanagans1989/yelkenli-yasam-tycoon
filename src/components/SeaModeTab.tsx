import { getBoatSvg } from "./Onboarding";

interface SeaDecisionChoiceView {
  label: string;
  resultText: string;
}

interface SeaDecisionView {
  id: string;
  title: string;
  description: string;
  choiceA: SeaDecisionChoiceView;
  choiceB: SeaDecisionChoiceView;
}

interface SeaModeTabProps {
  selectedBoatId: string;
  voyageDaysRemaining: number;
  voyageTotalDays: number;
  currentSeaEvent: string;
  energy: number;
  water: number;
  fuel: number;
  boatCondition: number;
  onAdvanceDay: () => void;
  pendingDecision: SeaDecisionView | null;
  onResolveDecision: (choiceKey: "choiceA" | "choiceB") => void;
}

export function SeaModeTab({
  selectedBoatId,
  voyageDaysRemaining,
  voyageTotalDays,
  currentSeaEvent,
  energy,
  water,
  fuel,
  boatCondition,
  onAdvanceDay,
  pendingDecision,
  onResolveDecision,
}: SeaModeTabProps) {
  const progressPercent =
    voyageTotalDays > 0 ? (1 - voyageDaysRemaining / voyageTotalDays) * 100 : 0;
  const criticalResources = [
    energy < 25 ? "Enerji" : null,
    water < 25 ? "Su" : null,
    fuel < 25 ? "Yakıt" : null,
    boatCondition < 25 ? "Tekne Durumu" : null,
  ].filter(Boolean) as string[];
  const hasCriticalResources = criticalResources.length > 0;

  return (
    <div className="sea-mode-content fade-in">
      <div className="sea-visual">
        <div className="boat-animation">{getBoatSvg(selectedBoatId)}</div>
      </div>

      <div className="sea-status-card">
        <h3 className="days-left">{voyageDaysRemaining} Gün Kaldı</h3>
        <div className="progress-bar-container">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className="sea-event-text">{currentSeaEvent}</p>
      </div>

      {hasCriticalResources && (
        <div className="sea-critical-banner" role="alert" aria-live="polite">
          <strong>⚠️ Kritik Kaynak! Limana ulaşmadan önce kaynaklarını yönet.</strong>
          <span>Kritik seviyede: {criticalResources.join(", ")}</span>
        </div>
      )}

      <div className="resource-grid">
        <div className={`res-card ${energy < 25 ? "critical-pulse" : ""}`}>
          <div className="res-card-top">
            <span>Enerji</span>
            <strong className={energy < 25 ? "critical" : ""}>{energy}%</strong>
          </div>
          <div className="res-bar-track">
            <div
              className="res-bar-fill"
              style={{
                width: `${energy}%`,
                background: energy < 25 ? "#e05252" : energy < 50 ? "#f5a623" : "#2ec4a0",
              }}
            ></div>
          </div>
        </div>
        <div className={`res-card ${water < 25 ? "critical-pulse" : ""}`}>
          <div className="res-card-top">
            <span>Su</span>
            <strong className={water < 25 ? "critical" : ""}>{water}%</strong>
          </div>
          <div className="res-bar-track">
            <div
              className="res-bar-fill"
              style={{
                width: `${water}%`,
                background: water < 25 ? "#e05252" : water < 50 ? "#f5a623" : "#1e9fd4",
              }}
            ></div>
          </div>
        </div>
        <div className={`res-card ${fuel < 25 ? "critical-pulse" : ""}`}>
          <div className="res-card-top">
            <span>Yakıt</span>
            <strong className={fuel < 25 ? "critical" : ""}>{fuel}%</strong>
          </div>
          <div className="res-bar-track">
            <div
              className="res-bar-fill"
              style={{
                width: `${fuel}%`,
                background: fuel < 25 ? "#e05252" : fuel < 50 ? "#f5a623" : "#8aafcc",
              }}
            ></div>
          </div>
        </div>
        <div className={`res-card ${boatCondition < 25 ? "critical-pulse" : ""}`}>
          <div className="res-card-top">
            <span>Tekne Durumu</span>
            <strong className={boatCondition < 25 ? "critical" : ""}>{boatCondition}%</strong>
          </div>
          <div className="res-bar-track">
            <div
              className="res-bar-fill"
              style={{
                width: `${boatCondition}%`,
                background:
                  boatCondition < 25 ? "#e05252" : boatCondition < 50 ? "#f5a623" : "#2ec4a0",
              }}
            ></div>
          </div>
        </div>
      </div>

      {pendingDecision ? (
        <div className="sea-decision-card">
          <span className="sea-decision-tag">Karar Olayı</span>
          <h3>{pendingDecision.title}</h3>
          <p>{pendingDecision.description}</p>
          <div className="sea-decision-actions">
            <button className="btn-secondary" onClick={() => onResolveDecision("choiceA")}>
              {pendingDecision.choiceA.label}
            </button>
            <button className="btn-primary large" onClick={() => onResolveDecision("choiceB")}>
              {pendingDecision.choiceB.label}
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-primary large mt-20 pulse-btn" onClick={onAdvanceDay}>
          Bir Gün İlerle
        </button>
      )}
    </div>
  );
}
