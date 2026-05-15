import './TekneTab.css';
import type { ReactNode } from "react";
import type { UpgradeCategoryId } from "../../game-data/upgrades";
import { getOceanReadinessSummaryCopy } from "../lib/routeReadinessUi";

type TekneStatItem = {
  key: string;
  icon: string;
  label: string;
  value: number;
  color?: string;
};

type ActiveInstallItem = {
  upgradeId: string;
  slot: number;
  upgradeName: string;
  remainingText: string;
  tokenCost: number;
};

type UpgradeCardItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  marinaRequirementLabel: string;
  installDurationLabel: string;
  isPurchased: boolean;
  isCompatible: boolean;
  hasWarning: boolean;
  compatibilityNote?: string;
  cantAfford: boolean;
  slotsFull: boolean;
  isInstalling: boolean;
  buyDisabled: boolean;
  effects: Array<{ key: string; label: string; value: number }>;
};

type TekneTabProps = {
  boatSvg: ReactNode;
  boatName: string;
  selectedBoatName: string;
  selectedBoatLengthFt: number;
  credits: number;
  tokens: number;
  currentOceanReadiness: number;
  currentRouteOceanReadinessRequired: number;
  tkStats: TekneStatItem[];
  activeInstallRows: ActiveInstallItem[];
  categories: Array<{ id: UpgradeCategoryId; name: string }>;
  selectedUpgradeCategory: UpgradeCategoryId;
  onSelectUpgradeCategory: (categoryId: UpgradeCategoryId) => void;
  comingFromRotaMissing: boolean;
  onBackToRotaMissing: () => void;
  upgradeCards: UpgradeCardItem[];
  onBuyUpgrade: (upgradeId: string) => void;
  onSpeedupUpgrade: (upgradeId: string) => void;
  pendingUpgradeConfirmId?: string | null;
  onCancelUpgradeConfirm?: () => void;
  installedUpgradeLabels?: string[];
};

export function TekneTab({
  boatSvg,
  boatName,
  selectedBoatName,
  selectedBoatLengthFt,
  credits,
  tokens,
  currentOceanReadiness,
  currentRouteOceanReadinessRequired,
  tkStats,
  activeInstallRows,
  categories,
  selectedUpgradeCategory,
  onSelectUpgradeCategory,
  comingFromRotaMissing,
  onBackToRotaMissing,
  upgradeCards,
  onBuyUpgrade,
  onSpeedupUpgrade,
  pendingUpgradeConfirmId = null,
  onCancelUpgradeConfirm,
  installedUpgradeLabels = [],
}: TekneTabProps) {
  return (
    <div className="tab-content tk-tab-v2 fade-in">
      <div className="tk-hero glass-card">
        <div className="tk-hero-glow" aria-hidden="true" />
        <div className="tk-hero-top">
          <div className="tk-hero-boat">
            <span className="tk-hero-boat-halo" aria-hidden="true" />
            <span className="tk-hero-boat-svg">{boatSvg}</span>
          </div>
          <div className="tk-hero-id">
            <span className="tk-hero-eyebrow">⚙ TERSANE</span>
            <h2 className="tk-hero-name tk-hero-name--xl">{boatName}</h2>
            <p className="tk-hero-class">{selectedBoatName} · {selectedBoatLengthFt} ft</p>
          </div>
          <div className="tk-hero-credits">
            <strong>{credits.toLocaleString("tr-TR")} TL</strong>
            <small>Bütçe</small>
          </div>
          <div className="tk-hero-credits">
            <strong>{tokens.toLocaleString("tr-TR")}</strong>
            <small>Token</small>
          </div>
        </div>

        <div className="tk-readiness-box">
          <div className="tk-readiness-row">
            <span className="tk-readiness-label">Mevcut Okyanus Hazırlığı</span>
            <strong className="tk-readiness-val">{currentOceanReadiness}%</strong>
          </div>
          <div className="tk-readiness-track">
            <div className="tk-readiness-fill" style={{ width: `${currentOceanReadiness}%` }} />
          </div>
          <small className="tk-readiness-note">
            {getOceanReadinessSummaryCopy(currentRouteOceanReadinessRequired)}
          </small>
        </div>

        {installedUpgradeLabels.length > 0 && (
          <div className="tk-installed-badges">
            {installedUpgradeLabels.slice(0, 6).map((label, i) => (
              <span key={i} className="tk-installed-badge">✓ {label}</span>
            ))}
            {installedUpgradeLabels.length > 6 && (
              <span className="tk-installed-badge tk-installed-badge--more">+{installedUpgradeLabels.length - 6} daha</span>
            )}
          </div>
        )}

        <div className="tk-stats-grid">
          {tkStats.map((s) => (
            <div key={s.key} className="tk-stat-chip" data-stat={s.key}>
              <span className="tk-stat-icon">{s.icon}</span>
              <div className="tk-stat-body">
                <span className="tk-stat-label">{s.label}</span>
                <strong className="tk-stat-val" style={s.color ? { color: s.color } : undefined}>
                  {s.value > 0 ? `+${s.value}` : s.value}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeInstallRows.length > 0 && (
        <div className="tk-install-card glass-card">
          <span className="tk-install-pulse" aria-hidden="true" />
          <div className="tk-install-icon">🔧</div>
          <div className="tk-install-body">
            <span className="tk-install-eyebrow">KURULUM SÜRÜYOR</span>
            {activeInstallRows.map((item) => (
              <div key={item.upgradeId} className="tk-install-row">
                <div>
                  <strong className="tk-install-name">Slot {item.slot + 1} · {item.upgradeName}</strong>
                  <span className="tk-install-time">{item.remainingText}</span>
                </div>
                <button
                  type="button"
                  className="tk-upg-cta"
                  onClick={() => onSpeedupUpgrade(item.upgradeId)}
                >
                  <span className="tk-upg-cta-label">{item.tokenCost} Token Bitir</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tk-cat-strip">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tk-cat-pill${selectedUpgradeCategory === cat.id ? " is-active" : ""}`}
            onClick={() => onSelectUpgradeCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {comingFromRotaMissing && (
        <button
          className="tk-back-to-rota-btn"
          onClick={onBackToRotaMissing}
          aria-label="Rota eksiklerine dön"
        >
          <span className="tk-back-to-rota-title">← Rota Eksiklerine Dön</span>
          <span className="tk-back-to-rota-sub">Eksik hazırlıkları kontrol etmeye geri dön.</span>
        </button>
      )}

      <div className="tk-upgrade-list">
        {upgradeCards.map((upgrade) => (
          <div
            key={upgrade.id}
            className={`tk-upg-card glass-card${!upgrade.isCompatible ? " is-incompat" : ""}${upgrade.isPurchased ? " is-owned" : ""}`}
          >
            <div className="tk-upg-head">
              <div className="tk-upg-title-row">
                <strong className="tk-upg-name">{upgrade.name}</strong>
                {upgrade.isPurchased && <span className="tk-upg-badge tk-upg-badge--owned">✓ ALINDI</span>}
                {!upgrade.isCompatible && <span className="tk-upg-badge tk-upg-badge--incompat">UYUMSUZ</span>}
              </div>
              {!upgrade.isPurchased && (
                <span className={`tk-upg-cost${upgrade.cantAfford ? " is-low" : ""}`}>
                  {upgrade.cost.toLocaleString("tr-TR")} TL
                </span>
              )}
            </div>

            <p className="tk-upg-desc">{upgrade.description}</p>

            <div className="tk-upg-meta">
              <span className="tk-upg-meta-pill">⏱ {upgrade.installDurationLabel}</span>
              <span className="tk-upg-meta-pill">⚓ {upgrade.marinaRequirementLabel}</span>
            </div>

            <div className="tk-upg-effects">
              {upgrade.effects.map((effect) => (
                <span key={`${upgrade.id}-${effect.key}`} className="tk-upg-effect-chip">
                  {effect.label} <strong>+{effect.value}</strong>
                </span>
              ))}
            </div>

            {upgrade.hasWarning && !upgrade.isPurchased && upgrade.isCompatible && upgrade.compatibilityNote && (
              <div className="tk-upg-note tk-upg-note--warn">⚠️ Bu teknede verimi sınırlı: {upgrade.compatibilityNote}</div>
            )}
            {!upgrade.isCompatible && (
              <div className="tk-upg-note tk-upg-note--error">❌ Bu tekne için uygun değil.</div>
            )}

            {!upgrade.isPurchased && upgrade.isCompatible && (
              pendingUpgradeConfirmId === upgrade.id ? (
                <div className="tk-upg-confirm">
                  <p className="tk-upg-confirm-text">
                    {upgrade.cost.toLocaleString("tr-TR")} TL harcanacak. Onaylıyor musun?
                  </p>
                  <div className="tk-upg-confirm-actions">
                    <button
                      className="tk-upg-cta"
                      onClick={() => onBuyUpgrade(upgrade.id)}
                    >
                      <span className="tk-upg-cta-icon">⚙</span>
                      <span className="tk-upg-cta-label">Onayla</span>
                    </button>
                    <button
                      className="tk-upg-cta tk-upg-cta--cancel"
                      onClick={() => onCancelUpgradeConfirm?.()}
                    >
                      <span className="tk-upg-cta-label">Vazgeç</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={`tk-upg-cta${upgrade.buyDisabled ? " is-disabled" : ""}`}
                  onClick={() => onBuyUpgrade(upgrade.id)}
                  disabled={upgrade.buyDisabled}
                >
                  <span className="tk-upg-cta-icon">{upgrade.isInstalling ? "🔧" : upgrade.slotsFull ? "⏳" : upgrade.cantAfford ? "✕" : "⚙"}</span>
                  <span className="tk-upg-cta-label">
                    {upgrade.isInstalling
                      ? "Kurulumda"
                      : upgrade.slotsFull
                        ? "Slot Dolu"
                        : upgrade.cantAfford
                          ? "Yetersiz Bütçe"
                          : "Satın Al"}
                  </span>
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
