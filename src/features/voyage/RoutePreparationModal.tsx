import type { PreparationGuidanceItem } from "../../core/utils/routePreparation";

interface RoutePreparationModalProps {
  routeName: string;
  requiredItems: PreparationGuidanceItem[];
  recommendedItems: PreparationGuidanceItem[];
  onClose: () => void;
  onGoUpgradeCategory?: (categoryId: string) => void;
}

export function RoutePreparationModal({
  routeName,
  requiredItems,
  recommendedItems,
  onClose,
  onGoUpgradeCategory,
}: RoutePreparationModalProps) {
  const hasRequired = requiredItems.length > 0;

  const renderItem = (item: PreparationGuidanceItem) => (
    <button
      key={`${item.severity}-${item.key}`}
      className={`rt-prep-item rt-prep-item--${item.severity}`}
      onClick={() => onGoUpgradeCategory?.(item.categoryId)}
      disabled={!onGoUpgradeCategory}
    >
      <span className={`rt-prep-item-badge rt-prep-item-badge--${item.severity}`}>
        {item.severity === "required" ? "Gerekli" : "Önerilir"}
      </span>
      <div className="rt-prep-item-copy">
        <strong>{item.label}</strong>
        <span>{item.reason}</span>
        <small>
          Yol: {item.categoryLabel}
          {item.suggestedUpgradeNames.length > 0 ? ` · Örnek upgrade: ${item.suggestedUpgradeNames.join(", ")}` : ""}
        </small>
      </div>
      {onGoUpgradeCategory && <span className="rt-prep-item-go">→</span>}
    </button>
  );

  return (
    <div className="cel-modal" role="dialog" aria-modal="true" aria-label={`${routeName} hazırlık önerisi`}>
      <div className="cel-backdrop" aria-hidden="true" onClick={onClose} />
      <div className="cel-card glass-card rt-prep-modal-card">
        <span className={`rt-prep-eyebrow ${hasRequired ? "rt-prep-eyebrow--danger" : "rt-prep-eyebrow--info"}`}>
          {hasRequired ? "ROTAYA CIKMADAN ONCE" : "SEYIR ONCESI SON BAKIS"}
        </span>
        <div className="rt-prep-title">{routeName}</div>
        <div className="rt-prep-subtitle">
          {hasRequired
            ? "Bu rotayi baslatmadan once tamamlaman gereken eksikler var."
            : "Bu rota acik. Asagidaki dokunuslar seyri daha guvenli ve rahat hale getirir."}
        </div>

        {hasRequired && (
          <div className="rt-prep-section">
            <div className="rt-prep-section-title">Gerekli Hazirliklar</div>
            <div className="rt-prep-list">
              {requiredItems.map(renderItem)}
            </div>
          </div>
        )}

        {recommendedItems.length > 0 && (
          <div className="rt-prep-section">
            <div className="rt-prep-section-title">Onerilen Guclendirmeler</div>
            <div className="rt-prep-list">
              {recommendedItems.map(renderItem)}
            </div>
          </div>
        )}

        <button className="primary-button rt-prep-close-btn" onClick={onClose}>
          {hasRequired ? "Eksikleri Goster" : "Tamam, Rotaya Hazirim"}
        </button>
      </div>
    </div>
  );
}
