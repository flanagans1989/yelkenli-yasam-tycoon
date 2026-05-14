import './RotaTab.css';
import { useState, useEffect } from "react";
import { WORLD_ROUTES } from "../../game-data/routes";

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

interface NextRoutePreview {
  name: string;
  feeling?: string;
  riskLevel: string;
}

interface RotaTabProps {
  currentRoute?: {
    id: string;
    name: string;
    from: string;
    to: string;
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
  nextRoute?: NextRoutePreview;
  routeReadiness: RouteReadiness;
  isSeaMode: boolean;
  completedRouteIds: string[];
  onStartVoyage: () => void;
  onGoTekne: () => void;
  onGoUpgradeCategory?: (categoryId: string) => void;
  openReadiness?: boolean;
  onReadinessOpened?: () => void;
}

const RISK_LABELS: Record<string, string> = {
  low: "Düşük Risk",
  low_medium: "Düşük-Orta",
  medium: "Orta Risk",
  medium_high: "Orta-Yüksek",
  high: "Yüksek Risk",
  very_high: "Çok Yüksek",
};

const CONTENT_LABELS: Record<string, string> = {
  low: "Düşük",
  low_medium: "Düşük-Orta",
  medium: "Orta",
  medium_high: "Orta-Yüksek",
  high: "Yüksek",
  very_high: "Çok Yüksek",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Kolay",
  easy_medium: "Kolay-Orta",
  medium: "Orta",
  medium_hard: "Orta-Zor",
  hard: "Zor",
  very_hard: "Çok Zor",
  final: "Final",
};

function getRiskClass(risk: string): string {
  if (risk === "low" || risk === "low_medium") return "rt-risk-pill--low";
  if (risk === "high" || risk === "very_high") return "rt-risk-pill--high";
  return "rt-risk-pill--medium";
}

const READINESS_UPGRADE_CATEGORY: Record<string, string> = {
  "Enerji": "energy",
  "Su": "water_life",
  "Güvenlik": "safety",
  "Navigasyon": "navigation",
  "Bakım": "hull_maintenance",
};

export function RotaTab({
  currentRoute,
  nextRoute,
  routeReadiness,
  isSeaMode,
  completedRouteIds,
  onStartVoyage,
  onGoUpgradeCategory,
  openReadiness,
  onReadinessOpened,
}: RotaTabProps) {
  const [readinessOpen, setReadinessOpen] = useState(false);

  useEffect(() => {
    if (openReadiness) {
      setReadinessOpen(true);
      onReadinessOpened?.();
    }
  }, [openReadiness]);

  const readinessItems = [
    { label: "Okyanus Hazırlığı", value: routeReadiness.oceanReadiness },
    { label: "Enerji", value: routeReadiness.energy },
    { label: "Su", value: routeReadiness.water },
    { label: "Güvenlik", value: routeReadiness.safety },
    { label: "Navigasyon", value: routeReadiness.navigation },
    { label: "Bakım", value: routeReadiness.maintenance },
  ];

  const weakItems = readinessItems.filter(({ value }) => value.current < value.required);
  const isReady = weakItems.length === 0;
  const completedCount = completedRouteIds.length;

  const upcomingRoutes = WORLD_ROUTES.filter(
    r => !completedRouteIds.includes(r.id) && r.id !== currentRoute?.id
  ).slice(0, 3);

  return (
    <div className="rt-tab rt-tab-v2 fade-in">
      <div className="rt-arc-section glass-card">
        <div className="rt-arc-header">
          <span className="rt-arc-label">◐ DÜNYA TURU</span>
          <span className="rt-arc-count">{completedCount}/{WORLD_ROUTES.length} rota</span>
        </div>
        <div className="rt-arc-dots">
          {WORLD_ROUTES.map((route) => {
            const isDone = completedRouteIds.includes(route.id);
            const isCurrent = currentRoute?.id === route.id;
            let cls = "rt-arc-dot";
            if (isDone) cls += " rt-arc-dot--done";
            else if (isCurrent) cls += " rt-arc-dot--current";
            else cls += " rt-arc-dot--future";
            return <div key={route.id} className={cls} title={route.name} />;
          })}
        </div>
        <div className="rt-arc-bar-track">
          <div className="rt-arc-bar-fill" style={{ width: `${Math.round((completedCount / WORLD_ROUTES.length) * 100)}%` }} />
        </div>
      </div>

      {upcomingRoutes.length > 0 && (
        <div className="rt-upcoming-card glass-card">
          <span className="rt-upcoming-eyebrow">🗺 Önümüzdeki Rotalar</span>
          {upcomingRoutes.map((r, i) => (
            <div key={r.id} className="rt-upcoming-row">
              <span className="rt-upcoming-num">{completedCount + (currentRoute ? 1 : 0) + i + 1}</span>
              <div className="rt-upcoming-body">
                <span className="rt-upcoming-name">{r.name}</span>
                <span className="rt-upcoming-meta">{r.from} → {r.to} · {r.baseDurationDays.min}–{r.baseDurationDays.max} gün</span>
              </div>
              <span className={`rt-upcoming-risk rt-risk-pill ${getRiskClass(r.riskLevel)}`}>{RISK_LABELS[r.riskLevel] ?? r.riskLevel}</span>
            </div>
          ))}
        </div>
      )}

      {completedCount > 0 && (
        <div className="rt-completed-list glass-card">
          <div className="rt-completed-header">
            <span className="rt-completed-label">Tamamlanan Rotalar</span>
            <span className="rt-completed-count">{completedCount}</span>
          </div>
          {WORLD_ROUTES.filter(r => completedRouteIds.includes(r.id)).slice(-3).reverse().map(r => (
            <div key={r.id} className="rt-completed-item">
              <span className="rt-completed-check">✓</span>
              <span className="rt-completed-name">{r.name}</span>
              <span className="rt-completed-to">{r.to}</span>
            </div>
          ))}
        </div>
      )}

      {currentRoute ? (
        <>
          <div className="rt-hero-card glass-card">
            <div className="rt-hero-gradient" aria-hidden="true" />
            <div className="rt-hero-route-label">
              {currentRoute.from} <span className="rt-hero-route-arrow">↣</span> {currentRoute.to}
            </div>
            <div className="rt-hero-destination">
              <span className="rt-hero-pin">📍</span>
              <h2 className="rt-hero-name">{currentRoute.to}</h2>
            </div>
            <div className="rt-hero-top-chips">
              <span className={`rt-risk-pill ${getRiskClass(currentRoute.riskLevel)}`}>
                {RISK_LABELS[currentRoute.riskLevel] ?? currentRoute.riskLevel}
              </span>
              <span className="rt-duration-chip">⏱ {currentRoute.baseDurationDays.min}–{currentRoute.baseDurationDays.max} Gün</span>
              {currentRoute.difficulty && (
                <span className="rt-difficulty-chip">{DIFFICULTY_LABELS[currentRoute.difficulty] ?? currentRoute.difficulty}</span>
              )}
            </div>
            {currentRoute.feeling && <p className="rt-hero-feeling">"{currentRoute.feeling}"</p>}
            <div className="rt-hero-meta-row">
              <span className="rt-meta-chip">
                <span className="rt-meta-chip-key">İçerik Potansiyeli</span>
                <span className="rt-meta-chip-val">{CONTENT_LABELS[currentRoute.contentPotential] ?? currentRoute.contentPotential}</span>
              </span>
            </div>
          </div>

          <div className="rt-readiness-card glass-card">
            <button className="rt-readiness-hdr" onClick={() => setReadinessOpen((p) => !p)} aria-expanded={readinessOpen}>
              <div className="rt-readiness-summary-row">
                {readinessItems.map(({ label, value }) => (
                  <span
                    key={label}
                    className={`rt-readiness-icon ${value.current >= value.required ? "rt-readiness-icon--ok" : "rt-readiness-icon--fail"}`}
                    title={label}
                  >
                    {value.current >= value.required ? "✓" : "✕"}
                  </span>
                ))}
              </div>
              <span className={`rt-readiness-status-pill ${isReady ? "rt-readiness-status-pill--ok" : "rt-readiness-status-pill--fail"}`}>
                {isReady ? "Hazır" : `${weakItems.length} Eksik`}
              </span>
              <span className={`lh-chevron${readinessOpen ? " lh-chevron--open" : ""}`}>›</span>
            </button>

            {readinessOpen && (
              <div className="rt-readiness-detail">
                {readinessItems.map(({ label, value }) => {
                  const ok = value.current >= value.required;
                  const categoryId = READINESS_UPGRADE_CATEGORY[label];
                  const isClickable = !ok && categoryId && onGoUpgradeCategory;
                  return (
                    <div
                      key={label}
                      className={`rt-readiness-item ${ok ? "rt-readiness-item--ok" : "rt-readiness-item--fail"}${isClickable ? " rt-readiness-item--link" : ""}`}
                      onClick={isClickable ? () => onGoUpgradeCategory!(categoryId) : undefined}
                      role={isClickable ? "button" : undefined}
                    >
                      <span className="rt-readiness-item-check">{ok ? "✓" : "✕"}</span>
                      <span className="rt-readiness-item-label">{label}</span>
                      <span className="rt-readiness-item-val">{value.current} / {value.required}</span>
                      {isClickable && <span className="rt-readiness-item-go">→</span>}
                    </div>
                  );
                })}
                {!isReady && <p className="rt-readiness-hint">Eksik satırına dokunarak ilgili upgrade kategorisine git.</p>}
              </div>
            )}
          </div>

          <div className="rt-cta-zone">
            {isSeaMode ? (
              <button className="primary-button rt-cta-btn rt-cta-btn--ghost" disabled>
                <span className="rt-cta-btn-icon">⛵</span>
                <span className="rt-cta-btn-label">Zaten Denizdesin</span>
              </button>
            ) : isReady ? (
              <button className="primary-button primary-button--pulse rt-cta-btn rt-cta-btn--go" onClick={onStartVoyage}>
                <span className="rt-cta-btn-icon">⚓</span>
                <span className="rt-cta-btn-label">Rotaya Çık</span>
              </button>
            ) : (
              <>
                <button
                  className="rt-cta-btn rt-cta-btn--locked"
                  onClick={() => setReadinessOpen(true)}
                >
                  <span className="rt-cta-btn-icon">⚠️</span>
                  <span className="rt-cta-btn-label">Önce Eksikleri Tamamla</span>
                </button>
                <div className="ui-helper-card ui-helper-card--compact rt-cta-helper">
                  <span className="ui-helper-title">Hazırlık gerekiyor</span>
                  <span className="ui-helper-copy">Hazırlık detayını aç, eksik satıra dokun ve doğru upgrade yoluna git.</span>
                </div>
              </>
            )}
          </div>

          {nextRoute && (
            <div className="rt-next-peek glass-card">
              <span className="rt-next-peek-eyebrow">Sıradaki Destinasyon</span>
              <div className="rt-next-peek-name">{nextRoute.name}</div>
              {nextRoute.feeling && <div className="rt-next-peek-feeling">"{nextRoute.feeling}"</div>}
            </div>
          )}
        </>
      ) : (
        <div className="rt-all-done glass-card">
          <span className="rt-all-done-icon">🏆</span>
          <p>Tüm rotalar tamamlandı! Dünya turu başarıyla bitirildi.</p>
        </div>
      )}
    </div>
  );
}
