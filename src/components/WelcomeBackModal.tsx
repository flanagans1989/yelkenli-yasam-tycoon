import type { RewardedAdUiHook } from "../types/ads";
import type { OfflineRewardBundle } from "../lib/welcomeBackRewards";

interface WelcomeBackModalProps {
  reward: OfflineRewardBundle;
  adHook: RewardedAdUiHook | null;
  messages: string[];
  onClaimBaseReward: () => void;
  onClaimAdBonus: () => void;
}

export function WelcomeBackModal({
  reward,
  adHook,
  messages,
  onClaimBaseReward,
  onClaimAdBonus,
}: WelcomeBackModalProps) {
  const projectedCredits = reward.credits * 2;
  const projectedFollowers = reward.followers * 2;

  return (
    <div className="wb-modal" role="dialog" aria-modal="true" aria-label="Tekrar hoş geldin">
      <div className="wb-modal-backdrop" aria-hidden="true" />
      <div className="wb-modal-card glass-card">
        <span className="wb-modal-eyebrow">Welcome Back</span>
        <h2 className="wb-modal-title">Liman sensiz de çalıştı</h2>
        <p className="wb-modal-copy">
          Yokluğunda biriken offline geliri şimdi alabilirsin. Reklam bonusu ileride açıldığında bu ödülü ikiye katlayacak.
        </p>

        <div className="wb-modal-reward-grid">
          <div className="wb-modal-reward">
            <span className="wb-modal-reward-label">Normal Gelir</span>
            <strong>+{reward.credits.toLocaleString("tr-TR")} TL</strong>
            <span>+{reward.followers.toLocaleString("tr-TR")} takipçi</span>
          </div>
          <div className="wb-modal-reward wb-modal-reward--bonus">
            <span className="wb-modal-reward-label">Reklam Bonusu</span>
            <strong>+{projectedCredits.toLocaleString("tr-TR")} TL</strong>
            <span>+{projectedFollowers.toLocaleString("tr-TR")} takipçi</span>
          </div>
        </div>

        <div className="wb-modal-meta">
          <span>Offline süre: {reward.minutes} dk</span>
          {adHook && (
            <span>
              {adHook.label} · {adHook.statusText}
            </span>
          )}
        </div>

        {messages.length > 0 && (
          <div className="wb-modal-notes">
            {messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <div className="wb-modal-actions">
          <button className="secondary-button" onClick={onClaimBaseReward}>
            Normal Geliri Al
          </button>
          <button
            className={`primary-button${adHook?.available ? "" : " is-disabled"}`}
            onClick={onClaimAdBonus}
            disabled={!adHook?.available}
          >
            {adHook?.available ? "Reklamla x2 Al" : "Reklam Bonusu Yakında"}
          </button>
        </div>
      </div>
    </div>
  );
}
