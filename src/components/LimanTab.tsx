import './LimanTab.css';
import { useState } from "react";
import type { ReactNode } from "react";
import { getBoatSvg } from "./Onboarding";
import type { MarinaTask } from "../types/game";

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
  marinaRestActionLabel: string;
  marinaRestActionDisabled: boolean;
  onRefillWater: () => void;
  onRefillFuel: () => void;
  onRepairBoat: () => void;
  onGoContent: () => void;
  onGoRoute: () => void;
  renderDailyGoals: () => ReactNode;
  dailyGoalsCompletedCount: number;
  dailyGoalsTotal: number;
  marinaTasks: MarinaTask[];
  hasCompletedWorldTour?: boolean;
}

const RESOURCE_DEFS: Array<{
  key: "energy" | "water" | "fuel" | "boat";
  icon: string;
  label: string;
}> = [
  { key: "energy", icon: "⚡", label: "Enerji" },
  { key: "water", icon: "💧", label: "Su" },
  { key: "fuel", icon: "⛽", label: "Yakıt" },
  { key: "boat", icon: "⚓", label: "Tekne" },
];

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
  marinaRestActionLabel,
  marinaRestActionDisabled,
  onRefillWater,
  onRefillFuel,
  onRepairBoat,
  onGoContent,
  onGoRoute,
  renderDailyGoals,
  dailyGoalsCompletedCount,
  dailyGoalsTotal,
  marinaTasks,
  hasCompletedWorldTour,
}: LimanTabProps) {
  const [marinaOpen, setMarinaOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [dailyGoalsOpen, setDailyGoalsOpen] = useState(false);

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

  const resourceValues: Record<"energy" | "water" | "fuel" | "boat", number> = {
    energy,
    water,
    fuel,
    boat: boatCondition,
  };

  return (
    <div className="lh-tab lh-tab-v2">
      {/* ── Stage header ── */}
      <header className="lh-stage">
        <span className="lh-stage-eyebrow">⚓ MARİNA ÜSSÜ</span>
        <h2 className="lh-stage-title">{currentLocationName}</h2>
        <p className="lh-stage-sub">
          {hasCompletedWorldTour
            ? "Dünya Turu Kaptanı · Efsane Kaptan"
            : "Kaptanın limanı · Sıradaki hamleye hazır"}
        </p>
      </header>

      {/* ── Boat hero stage ── */}
      <div className="lh-boat-stage">
        <div className="lh-boat-halo" aria-hidden="true" />
        <div className="lh-boat-ring" aria-hidden="true" />
        <div className="lh-boat-deck ob-boat-bob">
          {getBoatSvg(selectedBoatId)}
        </div>
        <div className="lh-boat-base" aria-hidden="true" />

        <div className="lh-progress-pair">
          <div className="lh-mini-bar">
            <span className="lh-mini-label">Dünya Turu</span>
            <div className="lh-mini-track">
              <div
                className="lh-mini-fill lh-mini-fill--gold"
                style={{ width: `${worldProgress}%` }}
              />
            </div>
            <span className="lh-mini-val">%{worldProgress}</span>
          </div>
          <div className="lh-mini-bar">
            <span className="lh-mini-label">Okyanus Hazır</span>
            <div className="lh-mini-track">
              <div
                className="lh-mini-fill lh-mini-fill--cyan"
                style={{ width: `${currentOceanReadiness}%` }}
              />
            </div>
            <span className="lh-mini-val">{currentOceanReadiness}%</span>
          </div>
        </div>
      </div>

      {/* ── Sıradaki Hamle CTA ── */}
      <button className="lh-action-cta" onClick={questAction}>
        <span className="lh-action-glow" aria-hidden="true" />
        <span className="lh-action-icon-wrap">
          <span className="lh-action-icon">{questIcon}</span>
        </span>
        <span className="lh-action-text">
          <span className="lh-action-eyebrow">SIRADAKİ HAMLE</span>
          <span className="lh-action-title">{questTitle}</span>
          <span className="lh-action-sub">{questSub}</span>
        </span>
        <span className="lh-action-arrow">›</span>
      </button>

      {/* ── Resource grid ── */}
      <section className="lh-res-grid">
        {RESOURCE_DEFS.map(({ key, icon, label }) => {
          const value = resourceValues[key];
          const crit = value < 30;
          return (
            <div
              key={key}
              className={`lh-res-card${crit ? " is-crit" : ""}`}
              data-res={key}
            >
              <span className="lh-res-icon">{icon}</span>
              <div className="lh-res-body">
                <div className="lh-res-row">
                  <span className="lh-res-label">{label}</span>
                  <span className="lh-res-val">%{value}</span>
                </div>
                <div className="lh-res-track">
                  <div className="lh-res-fill" style={{ width: `${value}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Daily Goals (collapsible) ── */}
      <div className="lh-accordion lh-accordion-v2 glass-card">
        <button className="lh-accordion-hdr" onClick={() => setDailyGoalsOpen(p => !p)}>
          <span>
            <span className="lh-accordion-icon">🎯</span>
            Günlük Görevler
          </span>
          <span className="lh-daily-goals-strip">
            <span className={`lh-daily-goals-count${dailyGoalsCompletedCount === dailyGoalsTotal ? " is-done" : ""}`}>
              {dailyGoalsCompletedCount}/{dailyGoalsTotal}
            </span>
            <span className={`lh-chevron${dailyGoalsOpen ? " lh-chevron--open" : ""}`}>›</span>
          </span>
        </button>
        {dailyGoalsOpen && (
          <div className="lh-accordion-body lh-accordion-body--goals">
            {renderDailyGoals()}
          </div>
        )}
      </div>

      {/* ── Marina Tasks ── */}
      {marinaTasks.length > 0 && (
        <div className="lh-marina-tasks glass-card">
          <span className="lh-marina-tasks-eyebrow">⚓ Marina Görevleri</span>
          {marinaTasks.map(task => (
            <div key={task.id} className={`lh-marina-task-row${task.completed ? " is-done" : ""}`}>
              <span className="lh-marina-task-check">{task.completed ? "✓" : "○"}</span>
              <span className="lh-marina-task-title">{task.title}</span>
              <span className="lh-marina-task-reward">+{task.reward} TL</span>
            </div>
          ))}
        </div>
      )}

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
      <div className="lh-accordion lh-accordion-v2 glass-card">
        <button className="lh-accordion-hdr" onClick={() => setMarinaOpen((p) => !p)}>
          <span><span className="lh-accordion-icon">⚓</span>Marina Servisi</span>
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
            <div className="lh-service-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="secondary-button lh-service-btn" onClick={onMarinaRest} disabled={marinaRestActionDisabled || energy >= 100}>
                {marinaRestActionLabel}
              </button>
              <button className="secondary-button lh-service-btn" onClick={onRefillWater} disabled={water >= 100}>
                {water >= 100 ? "Su dolu" : `Su Al – ${Math.max(0, 100 - water) * 1} TL`}
              </button>
              <button className="secondary-button lh-service-btn" onClick={onRefillFuel} disabled={fuel >= 100}>
                {fuel >= 100 ? "Yakıt dolu" : `Yakıt Al – ${Math.max(0, 100 - fuel) * 2} TL`}
              </button>
              <button className="secondary-button lh-service-btn" onClick={onRepairBoat} disabled={boatCondition >= 100 || credits < 250}>
                {boatCondition >= 100 ? "Tekne sağlam" : "Onar – 250 TL"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Event Log Accordion ── */}
      <div className="lh-accordion lh-accordion-v2 glass-card">
        <button className="lh-accordion-hdr" onClick={() => setLogsOpen((p) => !p)}>
          <span><span className="lh-accordion-icon">📋</span>Son Olaylar</span>
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
