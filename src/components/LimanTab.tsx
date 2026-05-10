import { useState } from "react";
import type { ReactNode } from "react";
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
  renderDailyGoals: () => ReactNode;
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
  renderDailyGoals,
}: LimanTabProps) {
  const [marinaOpen, setMarinaOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const hasCompletedFirstRoute = completedRouteIds.length > 0;
  const isResourceLow = energy < 30 || water < 30 || fuel < 30 || boatCondition < 30;
  const isMoneyLow = credits < 1000;

  const resourceStatusText = isResourceLow
    ? "Seyir öncesi tekneyi ve enerjiyi toparlamak riskleri azaltır."
    : isMoneyLow
      ? "Nakit azaldı. İçerik ve sponsor gelirini güçlendirmek iyi olabilir."
      : "Kaynakların seyir için dengeli görünüyor.";

  const guideMessage = !firstContentDone
    ? "Önce kısa bir içerik üret. Takipçi kazan, sonra ilk rotaya çık."
    : !hasCompletedFirstRoute
      ? "İlk içerik tamam. Şimdi Rota sekmesinden ilk yolculuğa hazırlan."
      : "İlk rota tamamlandı. Artık yeni limanlara açılabilirsin.";

  const questTitle = !firstContentDone
    ? "İlk içeriğini üret"
    : hasCompletedFirstRoute
      ? "Sıradaki rotana hazırlan"
      : "İlk rotanı başlat";

  const questSub = !firstContentDone
    ? "İçerik Stüdyosuna Git →"
    : `Sıradaki Rota: ${currentRouteName || "Bilinmiyor"}`;

  const questIcon = !firstContentDone ? "🎬" : "🗺️";
  const questAction = !firstContentDone ? onGoContent : onGoRoute;

  const guideComplete = firstContentDone && hasCompletedFirstRoute;

  return (
    <div className="lh-tab">
      {/* ── Boat Hero ── */}
      <div className="lh-hero">
        <div className="lh-hero-boat-wrap">
          <div className="lh-hero-boat-glow" aria-hidden="true" />
          <div className="lh-hero-boat ob-boat-bob">
            {getBoatSvg(selectedBoatId)}
          </div>
        </div>
        <div className="lh-hero-location">
          <span className="lh-location-pin">📍</span>
          <span className="lh-location-name">{currentLocationName}</span>
        </div>

        {/* Resource chips */}
        <div className="lh-resource-row">
          <div className={`lh-res-chip${energy < 30 ? " lh-res-chip--crit" : ""}`}>
            ⚡ {energy}%
          </div>
          <div className={`lh-res-chip${water < 30 ? " lh-res-chip--crit" : ""}`}>
            💧 {water}%
          </div>
          <div className={`lh-res-chip${fuel < 30 ? " lh-res-chip--crit" : ""}`}>
            ⛽ {fuel}%
          </div>
          <div className={`lh-res-chip${boatCondition < 30 ? " lh-res-chip--crit" : ""}`}>
            ⚓ {boatCondition}%
          </div>
        </div>

        {/* Progress micro-bars */}
        <div className="lh-progress-micro">
          <div className="lh-micro-bar">
            <span className="lh-micro-label">Dünya Turu</span>
            <div className="lh-micro-track">
              <div className="lh-micro-fill" style={{ width: `${worldProgress}%` }} />
            </div>
            <span className="lh-micro-val">%{worldProgress}</span>
          </div>
          <div className="lh-micro-bar">
            <span className="lh-micro-label">Okyanus Hazırlığı</span>
            <div className="lh-micro-track">
              <div className="lh-micro-fill lh-micro-fill--ocean" style={{ width: `${currentOceanReadiness}%` }} />
            </div>
            <span className="lh-micro-val">{currentOceanReadiness}%</span>
          </div>
        </div>
      </div>

      {/* ── Quest Card ── */}
      <button className="lh-quest-card" onClick={questAction}>
        <span className="lh-quest-icon">{questIcon}</span>
        <div className="lh-quest-text">
          <span className="lh-quest-eyebrow">SIRADAKİ HAMLE</span>
          <strong className="lh-quest-title">{questTitle}</strong>
          <span className="lh-quest-sub">{questSub}</span>
        </div>
        <span className="lh-quest-arrow">›</span>
      </button>

      {/* ── Daily Goals (slotted from App.tsx) ── */}
      {renderDailyGoals()}

      {/* ── Beginner Guide (hidden once both milestones done) ── */}
      {!guideComplete && (
        <div className="lh-guide-card glass-card">
          <div className="lh-guide-title">Başlangıç Rehberi</div>
          <div className={`lh-guide-step${firstContentDone ? " lh-guide-step--done" : ""}`}>
            {firstContentDone ? "✓" : "○"} İlk içeriğini üret
          </div>
          <div className={`lh-guide-step${hasCompletedFirstRoute ? " lh-guide-step--done" : firstContentDone ? "" : " lh-guide-step--future"}`}>
            {hasCompletedFirstRoute ? "✓" : firstContentDone ? "○" : "…"} İlk rotanı tamamla
          </div>
          <p className="lh-guide-hint">{guideMessage}</p>
        </div>
      )}

      {/* ── Marina Service Accordion ── */}
      <div className="lh-accordion glass-card">
        <button className="lh-accordion-hdr" onClick={() => setMarinaOpen((p) => !p)}>
          <span>⚓ Marina Servisi</span>
          <span className={`lh-chevron${marinaOpen ? " lh-chevron--open" : ""}`}>›</span>
        </button>
        {marinaOpen && (
          <div className="lh-accordion-body">
            <p className={`lh-status-text${isResourceLow ? " lh-status-text--warn" : ""}`}>
              {resourceStatusText}
            </p>
            <div className="lh-res-detail-list">
              <div className="lh-res-detail">
                <span>Enerji</span>
                <div className="lh-res-detail-bar">
                  <div className="lh-res-detail-fill" style={{ width: `${energy}%`, background: energy < 30 ? "var(--danger-red)" : "var(--cyan-soft)" }} />
                </div>
                <span>%{energy}</span>
              </div>
              <div className="lh-res-detail">
                <span>Su</span>
                <div className="lh-res-detail-bar">
                  <div className="lh-res-detail-fill" style={{ width: `${water}%`, background: water < 30 ? "var(--danger-red)" : "var(--cyan-soft)" }} />
                </div>
                <span>%{water}</span>
              </div>
              <div className="lh-res-detail">
                <span>Yakıt</span>
                <div className="lh-res-detail-bar">
                  <div className="lh-res-detail-fill" style={{ width: `${fuel}%`, background: fuel < 30 ? "var(--warning-amber)" : "var(--cyan-soft)" }} />
                </div>
                <span>%{fuel}</span>
              </div>
              <div className="lh-res-detail">
                <span>Tekne</span>
                <div className="lh-res-detail-bar">
                  <div className="lh-res-detail-fill" style={{ width: `${boatCondition}%`, background: boatCondition < 30 ? "var(--danger-red)" : "var(--success-green)" }} />
                </div>
                <span>%{boatCondition}</span>
              </div>
            </div>
            <div className="lh-service-actions">
              <button className="secondary-button lh-service-btn" onClick={onMarinaRest}>
                Marina'da Dinlen
              </button>
              <button className="secondary-button lh-service-btn" onClick={onRepairBoat} disabled={credits < 250}>
                Onar – 250 TL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Event Log Accordion ── */}
      <div className="lh-accordion glass-card">
        <button className="lh-accordion-hdr" onClick={() => setLogsOpen((p) => !p)}>
          <span>📋 Son Olaylar</span>
          <span className={`lh-chevron${logsOpen ? " lh-chevron--open" : ""}`}>›</span>
        </button>
        {logsOpen && (
          <div className="lh-accordion-body">
            {logs.length === 0 ? (
              <p className="lh-log-empty">Henüz olay yok.</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="lh-log-entry">{log}</div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
