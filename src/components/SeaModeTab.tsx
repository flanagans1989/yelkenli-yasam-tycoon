import { getBoatSvg } from "./Onboarding";

interface SeaDecisionChoiceView {
  label: string;
  resultText: string;
  effect?: {
    credits?: number;
    followers?: number;
    energy?: number;
    water?: number;
    fuel?: number;
    boatCondition?: number;
    remainingDays?: number;
  };
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
const STORY_HOOK_EVENT_IDS = new Set(["content_opportunity", "risky_social_shot"]);

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
    if (text.includes("içerik") || text.includes("çekim") || text.includes("hazine") || text.includes("fırsat") || text.includes("yunus") || text.includes("manzara") || text.includes("ada") || text.includes("ticaret") || text.includes("kurtarma")) return "opportunity";
    if (text.includes("motor") || text.includes("arıza") || text.includes("yakıt") || text.includes("sızıntı") || text.includes("teknik") || text.includes("telsiz") || text.includes("ekipman") || text.includes("sabitle")) return "technical";
    if (text.includes("fırtına") || text.includes("korsan") || text.includes("tehlike") || text.includes("hasar") || text.includes("kaza") || text.includes("kayalık") || text.includes("hastalık")) return "danger";
    return "neutral";
  };

  const getChoiceTone = (label: string, resultText: string) => {
    const text = `${label} ${resultText}`.toLocaleLowerCase("tr-TR");
    const riskTerms = ["doğrudan devam", "devam et", "risk", "fırtına içinden", "hasar", "tehlike"];
    const safeTerms = ["güvenli", "kaçın", "önle", "koru", "tamir", "dinlen", "rota değiştir"];

    if (riskTerms.some((term) => text.includes(term))) return "risk";
    if (safeTerms.some((term) => text.includes(term))) return "safe";
    return "neutral";
  };

  const getChoiceEffectPills = (
    decisionId: string,
    choiceKey: "choiceA" | "choiceB",
    choice: SeaDecisionChoiceView,
    tone: "risk" | "safe" | "neutral",
  ) => {
    const effect = choice.effect ?? {};
    const pills: Array<{ label: string; tone: "positive" | "negative" | "neutral" }> = [];
    const addDelta = (value: number | undefined, label: string) => {
      if (typeof value !== "number" || value === 0) return;
      pills.push({
        label: `${label} ${value > 0 ? "+" : ""}${value}`,
        tone: value > 0 ? "positive" : "negative",
      });
    };

    addDelta(effect.followers, "Takipçi");
    addDelta(effect.credits, "TL");
    addDelta(effect.energy, "Enerji");
    addDelta(effect.water, "Su");
    addDelta(effect.fuel, "Yakıt");
    addDelta(effect.boatCondition, "Tekne");

    if (typeof effect.remainingDays === "number" && effect.remainingDays !== 0) {
      pills.push({
        label: effect.remainingDays > 0 ? `Süre +${effect.remainingDays}g` : `Süre ${effect.remainingDays}g`,
        tone: effect.remainingDays < 0 ? "positive" : "negative",
      });
    }

    if (choiceKey === "choiceA" && STORY_HOOK_EVENT_IDS.has(decisionId)) {
      pills.push({ label: "Hikâye fırsatı", tone: "positive" });
    }

    if (pills.length === 0) {
      if (tone === "safe") pills.push({ label: "Güvenli seçim", tone: "neutral" });
      else if (tone === "risk") pills.push({ label: "Riskli seçim", tone: "negative" });
      else pills.push({ label: "Dengeli sonuç", tone: "neutral" });
    }

    return pills.slice(0, 4);
  };

  return (
    <div className="sm-tab fade-in">
      {hasCritical && (
        <div className="sm-critical-banner" role="alert" aria-live="polite">
          <span className="sm-critical-icon">⚠️</span>
          <div className="sm-critical-text">
            <strong>{hasDepletedResources ? "Kaynak Tükendi!" : "Kritik Kaynak"}</strong>
            <span>{criticalResources.join(", ")} kritik seviyede</span>
          </div>
        </div>
      )}

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

      <div className="sm-hero-zone">
        <div className="sm-boat-glow" aria-hidden="true" />
        <div className="sm-boat-wrap ob-boat-bob">{getBoatSvg(selectedBoatId)}</div>
        {routeFromName && routeToName && (
          <div className="sm-route-chip">
            {routeFromName} → {routeToName}
          </div>
        )}
      </div>

      <div className="sm-resource-row">
        <div className={`sm-res-chip${energy < 25 ? " sm-res-chip--crit" : ""}`}>⚡ {energy}%</div>
        <div className={`sm-res-chip${water < 25 ? " sm-res-chip--crit" : ""}`}>💧 {water}%</div>
        <div className={`sm-res-chip${fuel < 25 ? " sm-res-chip--crit" : ""}`}>⛽ {fuel}%</div>
        <div className={`sm-res-chip${boatCondition < 25 ? " sm-res-chip--crit" : ""}`}>⚓ {boatCondition}%</div>
      </div>

      {currentSeaEvent && (
        <div className="sm-event-log glass-card">
          <span className="sm-event-eyebrow">SON OLAY</span>
          <p className="sm-event-text">{currentSeaEvent}</p>
        </div>
      )}

      {!pendingDecision && (
        <div className="sm-advance-zone">
          <button className="primary-button primary-button--pulse sm-advance-btn" onClick={onAdvanceDay}>
            ⛵ Bir Gün İlerle
          </button>
          <span className="sm-advance-hint">{voyageDaysRemaining} gün kaldı</span>
        </div>
      )}

      {pendingDecision && (() => {
        const decisionCategory = getEventCategory(pendingDecision.title, pendingDecision.description);
        const choiceATone = getChoiceTone(pendingDecision.choiceA.label, pendingDecision.choiceA.resultText);
        const choiceBTone = getChoiceTone(pendingDecision.choiceB.label, pendingDecision.choiceB.resultText);
        const choiceAEffects = getChoiceEffectPills(pendingDecision.id, "choiceA", pendingDecision.choiceA, choiceATone);
        const choiceBEffects = getChoiceEffectPills(pendingDecision.id, "choiceB", pendingDecision.choiceB, choiceBTone);
        let decisionTagIcon = "⚓";
        let decisionTagLabel = "KARAR ANI";
        let decisionCardClass = "sm-decision-card glass-card";
        let decisionTitle = pendingDecision.title;

        if (decisionCategory === "danger") {
          decisionTagIcon = "⛈️";
          decisionTagLabel = "TEHLİKE";
          decisionCardClass += " sm-decision-card--danger";
          if (!decisionTitle.includes("⛈️") && !decisionTitle.includes("⚠️")) {
            decisionTitle = `⛈️ ${decisionTitle}`;
          }
        } else if (decisionCategory === "opportunity") {
          decisionTagIcon = "✨";
          decisionTagLabel = "✦ FIRSAT ✦";
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
              <h3 className="sm-decision-title">{decisionTitle}</h3>
              <p className="sm-decision-desc">{pendingDecision.description}</p>
              <div className="sm-decision-choices">
                <button
                  className={`sm-choice-btn sm-choice-btn--a${decisionCategory === "danger" && choiceATone === "safe" ? " sm-choice-btn--safe" : ""}${decisionCategory === "danger" && choiceATone === "risk" ? " sm-choice-btn--risk" : ""}`}
                  onClick={() => onResolveDecision("choiceA")}
                >
                  <span className="sm-choice-label">{pendingDecision.choiceA.label}</span>
                  <span className="sm-choice-result">{pendingDecision.choiceA.resultText}</span>
                  <span className="sea-choice-effects">
                    {choiceAEffects.map((item) => (
                      <span
                        key={`${pendingDecision.id}-a-${item.label}`}
                        className={`sea-choice-effect-pill sea-choice-effect-pill--${item.tone}`}
                      >
                        {item.label}
                      </span>
                    ))}
                  </span>
                </button>
                <button
                  className={`sm-choice-btn sm-choice-btn--b primary-button${decisionCategory === "danger" && choiceBTone === "safe" ? " sm-choice-btn--safe" : ""}${decisionCategory === "danger" && choiceBTone === "risk" ? " sm-choice-btn--risk" : ""}`}
                  onClick={() => onResolveDecision("choiceB")}
                >
                  <span className="sm-choice-label">{pendingDecision.choiceB.label}</span>
                  <span className="sm-choice-result">{pendingDecision.choiceB.resultText}</span>
                  <span className="sea-choice-effects">
                    {choiceBEffects.map((item) => (
                      <span
                        key={`${pendingDecision.id}-b-${item.label}`}
                        className={`sea-choice-effect-pill sea-choice-effect-pill--${item.tone}`}
                      >
                        {item.label}
                      </span>
                    ))}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
