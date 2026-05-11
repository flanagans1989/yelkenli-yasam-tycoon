import { useEffect, useState } from "react";
import { WORLD_ROUTES } from "../../game-data/routes";

function useCountUp(target: number, delayMs: number, durationMs: number): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    let rafId: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(eased * target));
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, delayMs);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId);
    };
  }, [target, delayMs, durationMs]);
  return value;
}

interface ArrivalScreenProps {
  portName: string;
  feeling?: string;
  rewardCredits: number;
  rewardFollowers: number;
  xpGain: number;
  worldProgressPercent: number;
  completedRouteIds: string[];
  currentRouteId: string;
  milestoneText: string;
  nextRouteName?: string;
  onDone: () => void;
}

const PARTICLE_COUNT = 8;

export function ArrivalScreen({
  portName,
  feeling,
  rewardCredits,
  rewardFollowers,
  xpGain,
  worldProgressPercent,
  completedRouteIds,
  currentRouteId,
  milestoneText,
  nextRouteName,
  onDone,
}: ArrivalScreenProps) {
  const displayCredits = useCountUp(rewardCredits, 800, 1200);
  const displayFollowers = useCountUp(rewardFollowers, 800, 1200);

  return (
    <div className="ar-screen">
      {/* Particle drift */}
      <div className="ar-particles" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <div key={i} className={`ar-particle ar-particle--${i}`} />
        ))}
      </div>

      <div className="ar-content">
        {/* Hero */}
        <div className="ar-hero">
          <div className="ar-hero-glow" aria-hidden="true" />
          <span className="ar-eyebrow">VARIŞ ✦</span>
          <div className="ar-pin">📍</div>
          <h1 className="ar-port-name">{portName}</h1>
          {feeling && <p className="ar-feeling">"{feeling}"</p>}
        </div>

        {/* Reward Block */}
        <div className="ar-reward-block">
          <div className="ar-reward-tile ar-reward-tile--credits">
            <span className="ar-reward-amount">
              +{displayCredits.toLocaleString("tr-TR")} TL
            </span>
            <span className="ar-reward-label">Kredi</span>
          </div>
          <div className="ar-reward-tile ar-reward-tile--followers">
            <span className="ar-reward-amount">
              +{displayFollowers.toLocaleString("tr-TR")}
            </span>
            <span className="ar-reward-label">Takipçi</span>
          </div>
          <div className="ar-xp-chip">+{xpGain} XP</div>
        </div>

        {/* World Tour Progress */}
        <div className="ar-world-tour glass-card">
          <div className="ar-world-tour-header">
            <span className="ar-world-tour-label">DÜNYA TURU</span>
            <span className="ar-world-tour-pct">%{worldProgressPercent}</span>
          </div>
          <div className="ar-arc-dots">
            {WORLD_ROUTES.map((route) => {
              const isJustDone = route.id === currentRouteId;
              const isDone = completedRouteIds.includes(route.id);
              let cls = "ar-arc-dot";
              if (isJustDone) cls += " ar-arc-dot--just-done";
              else if (isDone) cls += " ar-arc-dot--done";
              else cls += " ar-arc-dot--future";
              return <div key={route.id} className={cls} title={route.name} />;
            })}
          </div>
          <p className="ar-milestone-text">{milestoneText}</p>
        </div>

        {/* Next Route Peek */}
        {nextRouteName && (
          <div className="ar-next-peek glass-card">
            <span className="ar-next-peek-eyebrow">Sıradaki Destinasyon</span>
            <div className="ar-next-peek-name">{nextRouteName}</div>
          </div>
        )}

        {/* CTA */}
        <div className="ar-cta-zone">
          <button
            className="primary-button primary-button--pulse ar-cta-btn"
            onClick={onDone}
          >
            ⚓ Marinaya Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
}
