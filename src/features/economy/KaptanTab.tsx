import './KaptanTab.css';
import type { PlayerProfile } from "../../../game-data/playerProfiles";
import { profileIcons, skillLabels } from "../../data/labels";

type AchievementStatus = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

interface KaptanTabProps {
  selectedProfile: PlayerProfile;
  captainLevel: number;
  captainXp: number;
  completedRoutesCount: number;
  worldProgress: number;
  followers: number;
  achievementStatuses: AchievementStatus[];
  logs: string[];
  totalContentProduced: number;
  totalCreditsEarned: number;
  loginStreak: number;
}

const CAPTAIN_LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000, 8200, 11000, 14500, 19000, 25000];

export function KaptanTab({
  selectedProfile,
  captainLevel,
  captainXp,
  completedRoutesCount,
  worldProgress,
  followers,
  achievementStatuses,
  logs,
  totalContentProduced,
  totalCreditsEarned,
  loginStreak,
}: KaptanTabProps) {
  const captainRankLabel =
    captainLevel >= 13
      ? "Dünya Turu Kaptanı"
      : captainLevel >= 9
        ? "Okyanus Yolcusu"
        : captainLevel >= 6
          ? "Deneyimli Kaptan"
          : captainLevel >= 4
            ? "Açık Deniz Adayı"
            : captainLevel >= 2
              ? "Kıyı Seyircisi"
              : "Acemi Kaptan";

  const captainCareerText =
    captainLevel >= 9
      ? "Dünya turu hikayen, seni gerçek bir açık deniz kaptanına dönüştürüyor."
      : captainLevel >= 4
        ? "Artık sadece tekne kullanan biri değilsin; rotalarını planlayan, riskleri yöneten bir kaptansın."
        : "Henüz yolculuğun başındasın. Her içerik, her rota ve her karar kaptanlığını geliştiriyor.";

  const unlockedAchievements = achievementStatuses.filter((a) => a.unlocked);
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievementStatuses.length;

  const allBadgesSorted = [
    ...achievementStatuses.filter((a) => a.unlocked),
    ...achievementStatuses.filter((a) => !a.unlocked),
  ];

  const currentLevelFloor = CAPTAIN_LEVEL_THRESHOLDS[captainLevel - 1] ?? 0;
  const nextLevelXp = CAPTAIN_LEVEL_THRESHOLDS[captainLevel] ?? null;
  const isMaxLevel = nextLevelXp === null;
  const xpIntoLevel = captainXp - currentLevelFloor;
  const xpSpan = isMaxLevel ? 0 : (nextLevelXp - currentLevelFloor);
  const xpProgressPct = isMaxLevel ? 100 : Math.max(0, Math.min(100, (xpIntoLevel / xpSpan) * 100));
  const xpToNext = isMaxLevel ? 0 : Math.max(0, nextLevelXp - captainXp);

  const followerGoal = 1_000_000;
  const followerPct = Math.min((followers / followerGoal) * 100, 100);

  const socialRankTiers = [
    { min: 0,         max: 1_000,     icon: "🌱", label: "Başlangıç",     color: "#a3e635" },
    { min: 1_000,     max: 10_000,    icon: "🌊", label: "Yükselen",      color: "#22d3ee" },
    { min: 10_000,    max: 100_000,   icon: "⭐", label: "Influencer",    color: "#facc15" },
    { min: 100_000,   max: 1_000_000, icon: "🔥", label: "Fenomen",       color: "#f97316" },
    { min: 1_000_000, max: Infinity,  icon: "🌟", label: "Dünya Yıldızı", color: "#e879f9" },
  ];
  const socialRank = socialRankTiers.findLast(t => followers >= t.min) ?? socialRankTiers[0];
  const nextSocialRank = socialRankTiers[socialRankTiers.indexOf(socialRank) + 1];
  const socialRankPct = nextSocialRank
    ? Math.min(100, ((followers - socialRank.min) / (nextSocialRank.min - socialRank.min)) * 100)
    : 100;

  const formatFollowers = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
    return n.toString();
  };

  return (
    <div className="tab-content kp-tab-v2 fade-in">
      {/* ── Captain hero ── */}
      <div className="kp-hero glass-card">
        <div className="kp-hero-glow" aria-hidden="true" />
        <div className="kp-hero-row">
          <div className="kp-avatar-wrap">
            <span className="kp-avatar-halo" aria-hidden="true" />
            <span className="kp-avatar-ring" aria-hidden="true" />
            <span className="kp-avatar">{profileIcons[selectedProfile.id]}</span>
          </div>
          <div className="kp-hero-id">
            <span className="kp-hero-eyebrow">⚓ KAPTAN DOSYASI</span>
            <h2 className="kp-hero-name">{selectedProfile.name}</h2>
            <p className="kp-hero-tagline">{selectedProfile.tagline}</p>
          </div>
        </div>
        <div className="kp-rank-row">
          <span className="kp-rank-pill">{captainRankLabel}</span>
          <span className="kp-rank-meta">Lv.{captainLevel} · {captainXp.toLocaleString("tr-TR")} XP</span>
        </div>
        <div className="kp-social-rank-row">
          <span className="kp-social-rank-icon">{socialRank.icon}</span>
          <div className="kp-social-rank-body">
            <div className="kp-social-rank-head">
              <span className="kp-social-rank-label" style={{ color: socialRank.color }}>{socialRank.label}</span>
              <span className="kp-social-rank-followers">{formatFollowers(followers)} takipçi</span>
            </div>
            <div className="kp-social-rank-track">
              <div className="kp-social-rank-fill" style={{ width: `${socialRankPct}%`, background: socialRank.color }} />
            </div>
            {nextSocialRank && (
              <span className="kp-social-rank-next">Sıradaki: {nextSocialRank.icon} {nextSocialRank.label} → {formatFollowers(nextSocialRank.min)}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Career stats strip ── */}
      <div className="kp-cstats-card glass-card">
        <div className="kp-cstat">
          <span className="kp-cstat-val">{totalContentProduced}</span>
          <span className="kp-cstat-label">İçerik</span>
        </div>
        <div className="kp-cstat-div" />
        <div className="kp-cstat">
          <span className="kp-cstat-val">{completedRoutesCount}</span>
          <span className="kp-cstat-label">Rota</span>
        </div>
        <div className="kp-cstat-div" />
        <div className="kp-cstat">
          <span className="kp-cstat-val">{formatFollowers(followers)}</span>
          <span className="kp-cstat-label">Takipçi</span>
        </div>
        <div className="kp-cstat-div" />
        <div className="kp-cstat">
          <span className="kp-cstat-val">{formatFollowers(totalCreditsEarned)}</span>
          <span className="kp-cstat-label">TL Bütçe</span>
        </div>
        {loginStreak > 1 && (
          <>
            <div className="kp-cstat-div" />
            <div className="kp-cstat">
              <span className="kp-cstat-val kp-cstat-val--streak">🔥{loginStreak}</span>
              <span className="kp-cstat-label">Seri</span>
            </div>
          </>
        )}
      </div>

      {/* ── Level / XP card ── */}
      <div className="kp-level-card glass-card">
        <div className="kp-level-head">
          <div className="kp-level-num">
            <span className="kp-level-tag">SEVİYE</span>
            <strong className="kp-level-val">{captainLevel}</strong>
          </div>
          <div className="kp-level-info">
            <span className="kp-level-rank">{captainRankLabel}</span>
            <p className="kp-level-text">{captainCareerText}</p>
          </div>
        </div>
        <div className="kp-xp-track">
          <div className="kp-xp-fill" style={{ width: `${xpProgressPct}%` }} />
        </div>
        <div className="kp-xp-meta">
          {isMaxLevel ? (
            <span className="kp-xp-max">★ Maksimum seviye</span>
          ) : (
            <>
              <span>{xpIntoLevel.toLocaleString("tr-TR")} / {xpSpan.toLocaleString("tr-TR")} XP</span>
              <span className="kp-xp-next">Lv.{captainLevel + 1}'e {xpToNext.toLocaleString("tr-TR")} XP</span>
            </>
          )}
        </div>
      </div>

      {/* ── Career goals ── */}
      <div className="kp-goals-card glass-card">
        <span className="kp-goals-eyebrow">◐ KARİYER HEDEFLERİ</span>
        <div className="kp-goal-row">
          <div className="kp-goal-label-row">
            <span className="kp-goal-icon">🌍</span>
            <span className="kp-goal-label">Dünya Turu</span>
            <span className="kp-goal-val">%{worldProgress}</span>
          </div>
          <div className="kp-goal-track">
            <div className="kp-goal-fill kp-goal-fill--gold" style={{ width: `${worldProgress}%` }} />
          </div>
        </div>
        <div className="kp-goal-row">
          <div className="kp-goal-label-row">
            <span className="kp-goal-icon">👥</span>
            <span className="kp-goal-label">Takipçi Hedefi (1M)</span>
            <span className="kp-goal-val">{formatFollowers(followers)}</span>
          </div>
          <div className="kp-goal-track">
            <div className="kp-goal-fill kp-goal-fill--cyan" style={{ width: `${followerPct}%` }} />
          </div>
        </div>
        <div className="kp-goal-row">
          <div className="kp-goal-label-row">
            <span className="kp-goal-icon">🗺️</span>
            <span className="kp-goal-label">Tamamlanan Rota</span>
            <span className="kp-goal-val">{completedRoutesCount}</span>
          </div>
        </div>
      </div>

      {/* ── Skills ── */}
      <div className="kp-skills-card glass-card">
        <span className="kp-skills-eyebrow">⚙ KAPTAN YETENEKLERİ</span>
        <div className="kp-skills-grid">
          {Object.entries(selectedProfile.skills).map(([key, value]) => (
            <div key={key} className="kp-skill-cell">
              <span className="kp-skill-label">{skillLabels[key] ?? key}</span>
              <strong className="kp-skill-val">{value}/5</strong>
              <div className="kp-skill-track">
                <div className="kp-skill-fill" style={{ width: `${value * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Achievements ── */}
      <div className="kp-ach-card glass-card">
        <div className="kp-ach-head">
          <div>
            <span className="kp-ach-eyebrow">🏆 ROZET VİTRİNİ</span>
            <div className="kp-ach-title">Başarı Yolculuğu</div>
          </div>
          <span className="kp-ach-count">{unlockedCount}/{totalCount}</span>
        </div>
        <div className="kp-ach-track">
          <div className="kp-ach-fill" style={{ width: totalCount === 0 ? "0%" : `${(unlockedCount / totalCount) * 100}%` }} />
        </div>
        <p className="kp-ach-text">
          {unlockedCount > 0
            ? "Açılan rozetler, dünya turu kariyerindeki gerçek ilerlemeyi gösterir."
            : "İlk rozetini açmak için içerik üret, rota tamamla ve kaptanlığını geliştir."}
        </p>
        <div className="kp-ach-grid">
          {allBadgesSorted.map((achievement) => (
            <div
              key={achievement.id}
              className={`kp-ach-chip${achievement.unlocked ? " is-unlocked" : " is-locked"}`}
              title={achievement.description}
            >
              <span className="kp-ach-chip-icon">{achievement.unlocked ? "🏅" : "🔒"}</span>
              <span className="kp-ach-chip-label">{achievement.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Event log (compact, secondary) ── */}
      {logs.length > 0 && (
        <div className="kp-log-card glass-card">
          <span className="kp-log-eyebrow">📋 SON OLAYLAR</span>
          <div className="kp-log-list">
            {logs.slice(0, 5).map((log, i) => (
              <div key={log + i} className="kp-log-entry">{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

