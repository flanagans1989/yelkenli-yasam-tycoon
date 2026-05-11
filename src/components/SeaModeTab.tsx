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
  routeFromName?: string;
  routeToName?: string;
  onAdvanceDay: () => void;
  pendingDecision: SeaDecisionView | null;
  onResolveDecision: (choiceKey: "choiceA" | "choiceB") => void;
}

const MAX_DOTS = 20;

export function SeaModeTab({
  selectedBoatId,
  voyageDaysRemaining,
  voyageTotalDays,
  currentSeaEvent,
  energy,
  water,
  fuel,
  boatCondition,
  routeFromName,
  routeToName,
  onAdvanceDay,
  pendingDecision,
  onResolveDecision,
}: SeaModeTabProps) {
  const completedDays = voyageTotalDays - voyageDaysRemaining;
  const hasDepletedResources = energy <= 0 || water <= 0 || fuel <= 0;
  const criticalResources = [
    energy < 25 ? "Enerji" : null,
    water < 25 ? "Su" : null,
    fuel < 25 ? "Yakıt" : null,
    boatCondition < 25 ? "Tekne" : null,
  ].filter(Boolean) as string[];
  const hasCritical = criticalResources.length > 0;

  const dotsCount = Math.min(voyageTotalDays, MAX_DOTS);
  const dotsPerDay = voyageTotalDays / dotsCount;

  const getEventCategory = (title: string, desc: string) => {
    const text = (title + " " + desc).toLowerCase();
    if (text.includes("içerik") || text.includes("çekim") || text.includes("hazine") || text.includes("fırsat") || text.includes("yunus") || text.includes("rüzgar") || text.includes("manzara") || text.includes("ada") || text.includes("ticaret") || text.includes("kurtarma")) return "opportunity";
    if (text.includes("fırtına") || text.includes("korsan") || text.includes("tehlike") || text.includes("hasar") || text.includes("kaza") || text.includes("kayalık") || text.includes("hastalık")) return "danger";
    if (text.includes("motor") || text.includes("arıza") || text.includes("yakıt") || text.includes("sızıntı") || text.includes("teknik") || text.includes("telsiz")) return "technical";
    return "neutral";
  };

  return (
    <div className="sm-tab fade-in">
      {/* ── Critical Banner ── */}
      {hasCritical && (
        <div className="sm-critical-banner" role="alert" aria-live="polite">
          <span className="sm-critical-icon">⚠️</span>
          <div className="sm-critical-text">
            <strong>{hasDepletedResources ? "Kaynak Tükendi!" : "Kritik Kaynak"}</strong>
            <span>{criticalResources.join(", ")} kritik seviyede</span>
          </div>
        </div>
      )}

      {/* ── Voyage Arc ── */}
      <div className="sm-voyage-arc">
        <div className="sm-voyage-arc-header">
          <span className="sm-voyage-label">{completedDays} / {voyageTotalDays} gün</span>
          <span className="sm-voyage-days-left">{voyageDaysRemaining} gün kaldı</span>
        </div>
        <div className="sm-voyage-dots">
          {Array.from({ length: dotsCount }, (_, i) => {
            const dayIndex = Math.round(i * dotsPerDay);
            const isDone = dayIndex < completedDays;
            const isCurrent = dayIndex === completedDays;
            let cls = "sm-voyage-dot";
            if (isDone) cls += " sm-voyage-dot--done";
            else if (isCurrent) cls += " sm-voyage-dot--current";
            else cls += " sm-voyage-dot--future";
            return <div key={i} className={cls} />;
          })}
        </div>
      </div>

      {/* ── Boat Hero ── */}
      <div className="sm-hero-zone">
        <div className="sm-boat-glow" aria-hidden="true" />
        <div className="sm-boat-wrap ob-boat-bob">
          {getBoatSvg(selectedBoatId)}
        </div>
        {routeFromName && routeToName && (
          <div className="sm-route-chip">
            {routeFromName} ↣ {routeToName}
          </div>
        )}
      </div>

      {/* ── Resource Row ── */}
      <div className="sm-resource-row">
        <div className={`sm-res-chip${energy < 25 ? " sm-res-chip--crit" : ""}`}>
          ⚡ {energy}%
        </div>
        <div className={`sm-res-chip${water < 25 ? " sm-res-chip--crit" : ""}`}>
          💧 {water}%
        </div>
        <div className={`sm-res-chip${fuel < 25 ? " sm-res-chip--crit" : ""}`}>
          ⛽ {fuel}%
        </div>
        <div className={`sm-res-chip${boatCondition < 25 ? " sm-res-chip--crit" : ""}`}>
          ⚓ {boatCondition}%
        </div>
      </div>

      {/* ── Sea Event Text ── */}
      {currentSeaEvent && (
        <div className="sm-event-log glass-card">
          <span className="sm-event-eyebrow">SON OLAY</span>
          <p className="sm-event-text">{currentSeaEvent}</p>
        </div>
      )}

      {/* ── Advance Day CTA ── */}
      {!pendingDecision && (
        <div className="sm-advance-zone">
          <button
            className="primary-button primary-button--pulse sm-advance-btn"
            onClick={onAdvanceDay}
          >
            ⛵ Bir Gün İlerle
          </button>
          <span className="sm-advance-hint">{voyageDaysRemaining} gün kaldı</span>
        </div>
      )}

      {/* ── Decision Modal ── */}
      {pendingDecision && (() => {
        const decisionCategory = getEventCategory(pendingDecision.title, pendingDecision.description);
        let decisionTagIcon = "⚓";
        let decisionTagLabel = "KARAR ANI";
        let decisionCardClass = "sm-decision-card glass-card";
        
        if (decisionCategory === "danger") {
          decisionTagIcon = "⛈";
          decisionTagLabel = "TEHLİKE";
          decisionCardClass += " sm-decision-card--danger";
        } else if (decisionCategory === "opportunity") {
          decisionTagIcon = "✨";
          decisionTagLabel = "FIRSAT";
          decisionCardClass += " sm-decision-card--opportunity";
        } else if (decisionCategory === "technical") {
          decisionTagIcon = "🔧";
          decisionTagLabel = "SORUN";
          decisionCardClass += " sm-decision-card--technical";
        }

        return (
        <div className="sm-decision-modal" role="dialog" aria-modal="true">
          <div className="sm-decision-backdrop" aria-hidden="true" />
          <div className={decisionCardClass}>
            <span className="sm-decision-tag">{decisionTagIcon} {decisionTagLabel}</span>
            <h3 className="sm-decision-title">{pendingDecision.title}</h3>
            <p className="sm-decision-desc">{pendingDecision.description}</p>
            <div className="sm-decision-choices">
              <button
                className="sm-choice-btn sm-choice-btn--a"
                onClick={() => onResolveDecision("choiceA")}
              >
                <span className="sm-choice-label">{pendingDecision.choiceA.label}</span>
                <span className="sm-choice-result">{pendingDecision.choiceA.resultText}</span>
              </button>
              <button
                className="sm-choice-btn sm-choice-btn--b primary-button"
                onClick={() => onResolveDecision("choiceB")}
              >
                <span className="sm-choice-label">{pendingDecision.choiceB.label}</span>
                <span className="sm-choice-result">{pendingDecision.choiceB.resultText}</span>
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
