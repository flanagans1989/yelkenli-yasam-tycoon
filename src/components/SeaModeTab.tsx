import { getBoatSvg } from "./Onboarding";

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
}: SeaModeTabProps) {
  return (
    <div className="sea-mode-content fade-in">
      <div className="sea-visual">
        <div className="boat-animation">{getBoatSvg(selectedBoatId)}</div>
      </div>
      
      <div className="sea-status-card">
        <h3 className="days-left">{voyageDaysRemaining} Gün Kaldı</h3>
        <div className="progress-bar-container">
          <div className="progress-fill" style={{width: `${(1 - (voyageDaysRemaining / voyageTotalDays)) * 100}%`}}></div>
        </div>
        <p className="sea-event-text">{currentSeaEvent}</p>
      </div>
      
      <div className="resource-grid">
        <div className="res-card">
          <div className="res-card-top"><span>⚡ Enerji</span><strong className={energy < 25 ? "critical" : ""}>{energy}%</strong></div>
          <div className="res-bar-track"><div className="res-bar-fill" style={{width:`${energy}%`, background: energy < 25 ? "#e05252" : energy < 50 ? "#f5a623" : "#2ec4a0"}}></div></div>
        </div>
        <div className="res-card">
          <div className="res-card-top"><span>💧 Su</span><strong className={water < 25 ? "critical" : ""}>{water}%</strong></div>
          <div className="res-bar-track"><div className="res-bar-fill" style={{width:`${water}%`, background: water < 25 ? "#e05252" : water < 50 ? "#f5a623" : "#1e9fd4"}}></div></div>
        </div>
        <div className="res-card">
          <div className="res-card-top"><span>⛽ Yakıt</span><strong className={fuel < 25 ? "critical" : ""}>{fuel}%</strong></div>
          <div className="res-bar-track"><div className="res-bar-fill" style={{width:`${fuel}%`, background: fuel < 25 ? "#e05252" : fuel < 50 ? "#f5a623" : "#8aafcc"}}></div></div>
        </div>
        <div className="res-card">
          <div className="res-card-top"><span>🔧 Durum</span><strong className={boatCondition < 25 ? "critical" : ""}>{boatCondition}%</strong></div>
          <div className="res-bar-track"><div className="res-bar-fill" style={{width:`${boatCondition}%`, background: boatCondition < 25 ? "#e05252" : boatCondition < 50 ? "#f5a623" : "#2ec4a0"}}></div></div>
        </div>
      </div>
      
      <button className="btn-primary large mt-20 pulse-btn" onClick={onAdvanceDay}>Bir Gün İlerle</button>
    </div>
  );
}
