import type { PlayerProfile } from "../../game-data/playerProfiles";
import { profileIcons, skillLabels } from "../data/labels";

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
}

export function KaptanTab({
  selectedProfile,
  captainLevel,
  captainXp,
  completedRoutesCount,
  worldProgress,
  followers,
  achievementStatuses,
  logs,
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

  const showcasedBadges =
    unlockedCount > 0
      ? unlockedAchievements.slice(0, 3)
      : achievementStatuses.slice(0, 3);

  return (
    <div className="tab-content fade-in">
      <span className="card-label">Kaptan Dosyası</span>
      <div className="captain-header">
        <div className="captain-avatar">{profileIcons[selectedProfile.id]}</div>
        <div className="captain-title">
          <h2>{selectedProfile.name}</h2>
          <p>{selectedProfile.tagline}</p>
        </div>
      </div>

      <div className="captain-career-card">
        <span className="captain-career-eyebrow">Kaptan Kariyeri</span>
        <div className="captain-career-title">Kaptan Rütbesi</div>
        <div className="captain-career-rank">{captainRankLabel}</div>
        <div className="captain-career-text">{captainCareerText}</div>
        <div className="captain-career-meta">
          Seviye: {captainLevel} · XP: {captainXp} · Tamamlanan rota: {completedRoutesCount}
        </div>
      </div>

      <div className="mini-skills-grid">
        {Object.entries(selectedProfile.skills).map(([key, value]) => (
          <div key={key} className="skill-box">
            <span>{skillLabels[key] ?? key}</span>
            <strong>{value}/5</strong>
            <div className="skill-mini-bar">
              <div className="skill-mini-fill" style={{ width: `${value * 20}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="career-goals">
        <h3>Kariyer Hedefleri</h3>
        <div className="goal-item">
          <span>Dünya Turu</span>
          <div className="goal-bar">
            <div className="goal-fill" style={{ width: `${worldProgress}%` }}></div>
          </div>
        </div>
        <div className="goal-item">
          <span>Takipçi Hedefi (1M)</span>
          <div className="goal-bar">
            <div className="goal-fill" style={{ width: `${Math.min(followers / 10000, 100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="achievements-showcase-card mt-20">
        <span className="achievements-showcase-eyebrow">Rozet Vitrini</span>
        <div className="achievements-showcase-title">Başarı Yolculuğu</div>
        <div className="achievements-showcase-text">
          {unlockedCount > 0
            ? "Açılan rozetler, dünya turu kariyerindeki gerçek ilerlemeyi gösterir."
            : "İlk rozetini açmak için içerik üret, rota tamamla ve kaptanlığını geliştir."}
        </div>
        <div className="achievements-showcase-meta">
          {unlockedCount}/{totalCount} rozet açıldı
        </div>
        <div className="achievement-badge-list">
          {showcasedBadges.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-badge-chip${achievement.unlocked ? "" : " locked"}`}
            >
              {achievement.unlocked ? "🏅" : "○"} {achievement.title}
            </div>
          ))}
        </div>
      </div>

      <div className="achievements-card mt-20">
        <div className="achievements-header">
          <div>
            <span className="card-label">Başarımlar</span>
            <strong>{unlockedCount}/{totalCount} açıldı</strong>
          </div>
          <span className="achievements-summary">{captainLevel >= 3 ? "İlerleme iyi" : "Yolda devam"}</span>
        </div>
        <div className="achievements-list">
          {achievementStatuses.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-row${achievement.unlocked ? " unlocked" : ""}`}
            >
              <span className="achievement-icon">{achievement.unlocked ? "✅" : "○"}</span>
              <div className="achievement-copy">
                <strong>{achievement.title}</strong>
                <small>{achievement.description}</small>
              </div>
              <span className="achievement-state">{achievement.unlocked ? "Açıldı" : "Kilitli"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="event-log-compact mt-20">
        <span className="card-label">Son Olaylar</span>
        {logs.map((log, i) => <div key={log + i} className="log-entry">{log}</div>)}
      </div>
    </div>
  );
}
