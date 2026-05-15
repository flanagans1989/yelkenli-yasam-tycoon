import "./IcerikTab.css";
import { useEffect, useRef, useState } from "react";
import { ContentResultCard } from "./ContentResultCard";
import { SponsorTab } from "./SponsorTab";
import type { ContentHistoryItem, ContentResult, Step, StoryHook, SponsorOffer } from "../types/game";
import type { RewardedAdUiHook } from "../types/ads";

type PlatformItem = {
  id: string;
  name: string;
  mainRole: string;
  bestContentTypes: string[];
};

type ContentTypeItem = {
  id: string;
  label: string;
  icon: string;
};

type PlatformVisual = {
  icon: string;
  specialty: string;
};

type CurrentRouteInfo = {
  name: string;
  contentThemes: string[];
};

type IcerikTabProps = {
  icerikSubTab: "produce" | "sponsor";
  onChangeSubTab: (tab: "produce" | "sponsor") => void;
  contentCareerTitle: string;
  contentCareerText: string;
  followers: number;
  credits: number;
  tokens: number;
  nextSponsorTierName?: string;
  followersToTier: number;
  step: Step;
  currentRoute?: CurrentRouteInfo;
  locationBonusText?: string;
  activeStoryHook: StoryHook | null;
  storyHookButtonDisabled: boolean;
  onPublishStoryHook: () => void;
  platforms: PlatformItem[];
  platformVisuals: Record<string, PlatformVisual>;
  selectedPlatformId: string | null;
  onSelectPlatform: (platformId: string) => void;
  selectedPlatformName?: string;
  contentTypes: ContentTypeItem[];
  selectedContentType: string | null;
  onSelectContentType: (contentTypeId: string) => void;
  selectedPlatformBestContentTypeIds: string[];
  selectedTypeLabel?: string;
  onContentCooldown: boolean;
  cooldownMinutes: number;
  contentCooldownTokenCost: number | null;
  contentCooldownAdHook: RewardedAdUiHook | null;
  ctaDisabled: boolean;
  onProduceContent: () => void;
  onSpeedupContentCooldown: () => void;
  onTriggerContentCooldownAdHook: () => void;
  contentResult: ContentResult | null;
  onResetContentResult: () => void;
  contentHistory: ContentHistoryItem[];
  sponsorTabProps: {
    activeSponsorName: string;
    brandTrust: number;
    currentSponsorTierName?: string;
    nextSponsorTier?: { name: string; minFollowers: number };
    sponsorProgressPercent: number;
    followers: number;
    onCheckSponsorOffers: () => void;
    sponsorOffers: SponsorOffer[];
    onAcceptSponsor: (offerId: string) => void;
    acceptedSponsors: string[];
    sponsorObligations: Record<string, number>;
  };
  tutorialLocked?: boolean;
  guidedPlatformId?: string;
  guidedContentTypeIds?: string[];
  lastUsedPlatformId?: string | null;
  lastUsedContentType?: string | null;
  onRepeatLast?: () => void;
};

export function IcerikTab({
  icerikSubTab,
  onChangeSubTab,
  contentCareerTitle,
  contentCareerText,
  followers,
  credits,
  tokens,
  nextSponsorTierName,
  followersToTier,
  step,
  currentRoute,
  locationBonusText,
  activeStoryHook,
  storyHookButtonDisabled,
  onPublishStoryHook,
  platforms,
  platformVisuals,
  selectedPlatformId,
  onSelectPlatform,
  selectedPlatformName,
  contentTypes,
  selectedContentType,
  onSelectContentType,
  selectedPlatformBestContentTypeIds,
  selectedTypeLabel,
  onContentCooldown,
  cooldownMinutes,
  contentCooldownTokenCost,
  contentCooldownAdHook,
  ctaDisabled,
  onProduceContent,
  onSpeedupContentCooldown,
  onTriggerContentCooldownAdHook,
  contentResult,
  onResetContentResult,
  contentHistory,
  sponsorTabProps,
  tutorialLocked = false,
  guidedPlatformId,
  guidedContentTypeIds = [],
  lastUsedPlatformId,
  lastUsedContentType,
  onRepeatLast,
}: IcerikTabProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const typeStepRef = useRef<HTMLDivElement | null>(null);
  const previousPlatformIdRef = useRef<string | null>(null);

  const CONTENT_TYPE_LABELS: Record<string, string> = {
    marina_life: "Marina Yaşamı",
    boat_tour: "Tekne Turu",
    sailing_vlog: "Yelken Vlog",
    nature_bay: "Doğa Koyu",
    city_trip: "Şehir Turu",
    ocean_diary: "Okyanus Günlüğü",
    storm_vlog: "Fırtına Vlog",
    maintenance_upgrade: "Bakım & Upgrade",
  };

  useEffect(() => {
    const platformChanged = previousPlatformIdRef.current !== selectedPlatformId;
    previousPlatformIdRef.current = selectedPlatformId;

    if (!tutorialLocked || !guidedPlatformId || selectedPlatformId !== guidedPlatformId || !platformChanged) {
      return;
    }

    typeStepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [guidedPlatformId, selectedPlatformId, tutorialLocked]);

  return (
    <div className="tab-content fade-in">
      <div className="sub-tab-bar">
        <button className={`sub-tab ${icerikSubTab === "produce" ? "active" : ""}`} onClick={() => onChangeSubTab("produce")}>İçerik Üret</button>
        <button
          className={`sub-tab ${icerikSubTab === "sponsor" ? "active" : ""}${tutorialLocked ? " is-disabled" : ""}`}
          onClick={() => onChangeSubTab("sponsor")}
          disabled={tutorialLocked}
        >
          Sponsorluklar
        </button>
      </div>

      {icerikSubTab === "produce" && (
        <div className="cs-studio fade-in">
          <header className="cs-header">
            <div className="cs-header-rim" aria-hidden="true"></div>
            <span className="cs-eyebrow">◐ Kaptan Medya Odası</span>
            <h2 className="cs-title">{contentCareerTitle}</h2>
            <p className="cs-subtitle">{contentCareerText}</p>
            <div className="cs-stat-strip">
              <div className="cs-stat-chip">
                <span className="cs-stat-label">Takipçi</span>
                <span className="cs-stat-value">{followers.toLocaleString("tr-TR")}</span>
              </div>
              <div className="cs-stat-chip">
                <span className="cs-stat-label">Bütçe</span>
                <span className="cs-stat-value cs-stat-value--gold">{credits.toLocaleString("tr-TR")} TL</span>
              </div>
              <div className="cs-stat-chip">
                <span className="cs-stat-label">Token</span>
                <span className="cs-stat-value">{tokens.toLocaleString("tr-TR")}</span>
              </div>
              {nextSponsorTierName && (
                <div className="cs-stat-chip cs-stat-chip--target">
                  <span className="cs-stat-label">{nextSponsorTierName}'a</span>
                  <span className="cs-stat-value cs-stat-value--cyan">
                    {followersToTier.toLocaleString("tr-TR")}
                  </span>
                </div>
              )}
            </div>
          </header>

          {locationBonusText && (
            <div className="cs-location-bonus">{locationBonusText}</div>
          )}

          {!contentResult ? (
            <>
              {step === "SEA_MODE" && currentRoute && (
                <div className="cs-route-hint">
                  <span className="cs-route-hint-icon" aria-hidden="true">🌊</span>
                  <div className="cs-route-hint-body">
                    <span className="cs-route-hint-label">Şu an: {currentRoute.name}</span>
                    <span className="cs-route-hint-themes">{currentRoute.contentThemes.join(" · ")}</span>
                  </div>
                </div>
              )}

              {activeStoryHook && (
                <div className="cs-story-hook-card">
                  <div className="cs-story-hook-head">
                    <span className="cs-story-hook-eyebrow">Yolculuk Hikayesi</span>
                    <span className="cs-story-hook-source">
                      {activeStoryHook.source === "arrival" ? "Varis notu" : "Deniz anisi"}
                    </span>
                  </div>
                  <h3 className="cs-story-hook-title">{activeStoryHook.title}</h3>
                  <p className="cs-story-hook-text">{activeStoryHook.description}</p>
                  <div className="cs-story-hook-bonuses">
                    {typeof activeStoryHook.bonusFollowersPct === "number" && (
                      <span className="cs-story-hook-bonus">+%{activeStoryHook.bonusFollowersPct} takipçi</span>
                    )}
                    {typeof activeStoryHook.bonusCreditsPct === "number" && (
                      <span className="cs-story-hook-bonus">+%{activeStoryHook.bonusCreditsPct} TL</span>
                    )}
                    {typeof activeStoryHook.sponsorInterest === "number" && activeStoryHook.sponsorInterest > 0 && (
                      <span className="cs-story-hook-bonus">+{activeStoryHook.sponsorInterest} marka güveni</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`cs-story-hook-btn ${storyHookButtonDisabled ? "is-disabled" : ""}`}
                    disabled={storyHookButtonDisabled}
                    onClick={onPublishStoryHook}
                  >
                    Bu Hikayeyi Yayınla
                  </button>
                </div>
              )}

              {!tutorialLocked && lastUsedPlatformId && lastUsedContentType && !selectedPlatformId && !onContentCooldown && onRepeatLast && (
                <button
                  type="button"
                  className="cs-repeat-btn"
                  onClick={onRepeatLast}
                >
                  <span className="cs-repeat-icon" aria-hidden="true">↩</span>
                  <span className="cs-repeat-label">
                    Tekrar Yayınla
                    <span className="cs-repeat-sub">
                      {CONTENT_TYPE_LABELS[lastUsedContentType] ?? lastUsedContentType}
                    </span>
                  </span>
                </button>
              )}

              <div className="cs-step-row">
                <span className="cs-step-num">01</span>
                <span className="cs-step-text">Yayın Platformu</span>
              </div>
              {tutorialLocked && !selectedPlatformId && (
                <div className="cs-tutorial-hint">
                  Önce ViewTube&apos;u seç. Miço ilk videoyu burada başlatmanı istiyor.
                </div>
              )}
              <div className="cs-platform-grid">
                {platforms.map((platform) => {
                  const visual = platformVisuals[platform.id] ?? { icon: "●", specialty: platform.mainRole };
                  const isActive = selectedPlatformId === platform.id;
                  const isGuidedPlatform = tutorialLocked && platform.id === guidedPlatformId;
                  const isPlatformDisabled = tutorialLocked && platform.id !== guidedPlatformId;

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      className={`cs-platform-tile ${isActive ? "is-active" : ""} ${isGuidedPlatform ? "is-guided" : ""} ${isPlatformDisabled ? "is-disabled" : ""}`}
                      data-platform={platform.id}
                      onClick={() => onSelectPlatform(platform.id)}
                      disabled={isPlatformDisabled}
                    >
                      <div className="cs-platform-icon">
                        <span aria-hidden="true">{visual.icon}</span>
                      </div>
                      <div className="cs-platform-text">
                        <strong className="cs-platform-name">{platform.name}</strong>
                        <span className="cs-platform-role">{visual.specialty}</span>
                      </div>
                      {isActive && <span className="cs-platform-check" aria-hidden="true">✓</span>}
                    </button>
                  );
                })}
              </div>

              <div ref={typeStepRef} className={`cs-step-row ${!selectedPlatformId ? "cs-step-row--locked" : ""}`}>
                <span className="cs-step-num">02</span>
                <span className="cs-step-text">İçerik Formatı</span>
                {selectedPlatformId && (
                  <span className="cs-step-hint">altın kenar = uyumlu</span>
                )}
              </div>
              {!selectedPlatformId ? (
                <div className="cs-types-locked">Önce platform seç</div>
              ) : (
                <div className="cs-type-grid">
                  {tutorialLocked && selectedPlatformId === guidedPlatformId && (
                    <div className="cs-tutorial-hint cs-tutorial-hint--types">
                      Şimdi önerilen formatlardan birini seç. Diğer kartlar bu adımda kapalı.
                    </div>
                  )}
                  {contentTypes.map((type) => {
                    const isMatch = selectedPlatformBestContentTypeIds.includes(type.id);
                    const isActive = selectedContentType === type.id;
                    const isGuidedType = tutorialLocked && selectedPlatformId === guidedPlatformId && guidedContentTypeIds.includes(type.id);
                    const isTypeDisabled = tutorialLocked && selectedPlatformId === guidedPlatformId && !guidedContentTypeIds.includes(type.id);

                    return (
                      <button
                        key={type.id}
                        type="button"
                        className={`cs-type-tile ${isActive ? "is-active" : ""} ${isMatch ? "is-match" : ""} ${isGuidedType ? "is-guided" : ""} ${isTypeDisabled ? "is-disabled" : ""}`}
                        onClick={() => onSelectContentType(type.id)}
                        disabled={isTypeDisabled}
                      >
                        <span className="cs-type-icon" aria-hidden="true">{type.icon}</span>
                        <span className="cs-type-label">{type.label}</span>
                        {isMatch && <span className="cs-type-badge">UYUMLU</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="cs-cta-block">
                <div style={{ marginBottom: "16px", fontSize: "12px", color: "var(--text-secondary)", textAlign: "center", opacity: 0.9, padding: "0 12px", fontStyle: "italic" }}>
                  Kaptan seviyesi arttıkça içerikler daha kaliteli prodüksiyon ister; hazırlık süresi uzar ama kariyer etkisi büyür.
                </div>
                {selectedPlatformId && selectedContentType && !onContentCooldown && (
                  <div className="cs-cta-preview">
                    <span className="cs-cta-preview-icon">{platformVisuals[selectedPlatformId]?.icon ?? "●"}</span>
                    <span className="cs-cta-preview-text">
                      {selectedPlatformName} <span className="cs-cta-sep">·</span> {selectedTypeLabel}
                    </span>
                  </div>
                )}
                {onContentCooldown ? (
                  <div className="cs-cooldown-card">
                    <span className="cs-cooldown-eyebrow">Stüdyo Dinleniyor</span>
                    <strong className="cs-cooldown-time">{cooldownMinutes} dk</strong>
                    {contentCooldownTokenCost != null && (
                      <button
                        type="button"
                        className="cs-story-hook-btn"
                        onClick={onSpeedupContentCooldown}
                      >
                        {contentCooldownTokenCost} Token ile Bitir
                      </button>
                    )}
                    {contentCooldownAdHook && (
                      <div className="cs-ad-hook-card">
                        <span className="cs-ad-hook-eyebrow">Ödüllü Reklam</span>
                        <strong className="cs-ad-hook-title">{contentCooldownAdHook.label}</strong>
                        <span className="cs-ad-hook-copy">{contentCooldownAdHook.description}</span>
                        <button
                          type="button"
                          className={`cs-ad-hook-btn${contentCooldownAdHook.available ? "" : " is-disabled"}`}
                          onClick={onTriggerContentCooldownAdHook}
                        >
                          {contentCooldownAdHook.available ? "Reklam Hook'unu Aç" : "Yakında"}
                        </button>
                        <span className="cs-ad-hook-meta">{contentCooldownAdHook.statusText}</span>
                      </div>
                    )}
                    <span className="cs-cooldown-text">Bir sonraki içerik için kısa bir nefes.</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`cs-cta-btn ${ctaDisabled ? "is-disabled" : ""}`}
                    onClick={onProduceContent}
                    disabled={ctaDisabled}
                  >
                    <span className="cs-cta-btn-icon" aria-hidden="true">🎬</span>
                    <span className="cs-cta-btn-label">İÇERİK ÜRET</span>
                  </button>
                )}
                {!selectedPlatformId || !selectedContentType ? (
                  <span className="cs-cta-hint">
                    {!selectedPlatformId ? "Önce yayın platformu seç" : "Bir format seç"}
                  </span>
                ) : null}
              </div>
            </>
          ) : (
            <ContentResultCard result={contentResult} onReset={onResetContentResult} />
          )}

          {contentHistory.length > 0 && (
            <div className="cs-history-accordion glass-card">
              <button className="cs-history-hdr" onClick={() => setHistoryOpen((p) => !p)}>
                <span>📋 İçerik Geçmişi</span>
                {contentHistory.length >= 2 && (() => {
                  const pts = [...contentHistory].reverse().map((i) => i.quality);
                  const W = 60;
                  const H = 20;
                  const n = pts.length;
                  const min = Math.min(...pts);
                  const max = Math.max(...pts);
                  const range = max - min || 1;
                  const coords = pts.map((v, i) => `${(i / (n - 1)) * W},${H - ((v - min) / range) * H}`).join(" ");
                  return (
                    <svg className="cs-sparkline" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
                      <polyline points={coords} fill="none" stroke="var(--accent-cyan,#22d3ee)" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  );
                })()}
                <span className={`cs-history-chevron${historyOpen ? " is-open" : ""}`}>›</span>
              </button>
              {historyOpen && (
                <div className="cs-history-list">
                  {contentHistory.map((item, i) => (
                    <div key={i} className="cs-history-row">
                      <div className="cs-history-left">
                        <span className="cs-history-platform">{item.platform}</span>
                        <span className="cs-history-type">{CONTENT_TYPE_LABELS[item.contentType] ?? item.contentType}</span>
                      </div>
                      <div className="cs-history-mid">
                        <div className="cs-history-bar">
                          <div
                            className={`cs-history-fill${item.quality >= 70 ? " is-high" : item.quality >= 40 ? " is-mid" : " is-low"}`}
                            style={{ width: `${item.quality}%` }}
                          />
                        </div>
                        <span className="cs-history-quality">%{item.quality}</span>
                      </div>
                      <div className="cs-history-right">
                        {item.viral && <span className="cs-history-viral">VIRAL</span>}
                        <span className="cs-history-stat cs-history-stat--follow">+{item.followers.toLocaleString("tr-TR")}</span>
                        <span className="cs-history-stat cs-history-stat--credit">+{item.credits.toLocaleString("tr-TR")} TL</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {icerikSubTab === "sponsor" && <SponsorTab {...sponsorTabProps} />}
    </div>
  );
}
