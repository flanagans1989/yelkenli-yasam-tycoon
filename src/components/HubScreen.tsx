import type { ReactNode } from "react";
import type { Step, Tab } from "../types/game";

interface HubScreenProps {
  step: Step;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  lockedTab?: Tab | null;
  boatName: string;
  selectedBoatName: string;
  currentRoute?: {
    name: string;
    from: string;
    to: string;
  };
  credits: number;
  followers: number;
  flashCredits: boolean;
  flashFollowers: boolean;
  firstContentDone: boolean;
  completedRouteIds: string[];
  renderProgressStrip?: () => ReactNode;
  renderLimanTab: () => ReactNode;
  renderSeaModeTab: () => ReactNode;
  renderIcerikTab: () => ReactNode;
  renderRotaTab: () => ReactNode;
  renderTekneTab: () => ReactNode;
  renderKaptanTab: () => ReactNode;
  audioEnabled?: boolean;
  onToggleAudio?: () => void;
}

export function HubScreen({
  step,
  activeTab,
  setActiveTab,
  lockedTab = null,
  boatName,
  selectedBoatName,
  currentRoute,
  credits,
  followers,
  flashCredits,
  flashFollowers,
  firstContentDone,
  completedRouteIds,
  renderProgressStrip,
  renderLimanTab,
  renderSeaModeTab,
  renderIcerikTab,
  renderRotaTab,
  renderTekneTab,
  renderKaptanTab,
  audioEnabled = true,
  onToggleAudio,
}: HubScreenProps) {
  const isTabLocked = (tab: Tab) => Boolean(lockedTab && lockedTab !== tab);

  return (
    <div className={step === "SEA_MODE" ? "sea-mode-wrapper fade-in" : `hub-wrapper hub-wrapper--${activeTab} fade-in`}>
      {step === "SEA_MODE" ? (
        <header className="sea-topbar">
          <h2>{boatName}</h2>
          <p>{currentRoute?.name}: {currentRoute?.from} → {currentRoute?.to}</p>
        </header>
      ) : (
        <header className="hub-topbar">
          <div className="hub-boat-info">
            <h2>{boatName}</h2>
            <small>{selectedBoatName}</small>
          </div>
          <div className="hub-stats">
            <div className={`stat${flashCredits ? " flash-green" : ""}`}><span>💰</span> {credits.toLocaleString("tr-TR")}</div>
            <div className={`stat${flashFollowers ? " flash-green" : ""}`}><span>👥</span> {followers.toLocaleString("tr-TR")}</div>
            {onToggleAudio && (
              <button className="hub-mute-btn" onClick={onToggleAudio} aria-label={audioEnabled ? "Sesi kapat" : "Sesi aç"}>
                {audioEnabled ? "🔊" : "🔇"}
              </button>
            )}
          </div>
        </header>
      )}

      {step === "HUB" && renderProgressStrip && renderProgressStrip()}

      <main className={step === "SEA_MODE" ? "sea-content" : `hub-content hub-content--${activeTab}`}>
        {step === "SEA_MODE" ? (
          renderSeaModeTab()
        ) : (
          <>
            {activeTab === "liman" && renderLimanTab()}
            {activeTab === "icerik" && renderIcerikTab()}
            {activeTab === "rota" && renderRotaTab()}
            {activeTab === "tekne" && renderTekneTab()}
            {activeTab === "kaptan" && renderKaptanTab()}
          </>
        )}
      </main>

      <nav className="bottom-tab-bar">
        <button
          className={`tab ${activeTab === "liman" ? "active" : ""}${isTabLocked("liman") ? " is-disabled" : ""}`}
          onClick={() => setActiveTab("liman")}
          disabled={isTabLocked("liman")}
        >
          <span className="tab-icon">{step === "SEA_MODE" ? "🌊" : "🏠"}</span>
          <span className="tab-label">{step === "SEA_MODE" ? "Deniz" : "Liman"}</span>
        </button>
        <button
          className={`tab ${activeTab === "icerik" ? "active" : ""}${!firstContentDone ? " tab-notif" : ""}${isTabLocked("icerik") ? " is-disabled" : ""}`}
          onClick={() => setActiveTab("icerik")}
          disabled={isTabLocked("icerik")}
        >
          <span className="tab-icon">📹</span>
          <span className="tab-label">İçerik</span>
        </button>
        <button
          className={`tab ${activeTab === "rota" ? "active" : ""}${firstContentDone && step === "HUB" && completedRouteIds.length === 0 ? " tab-notif" : ""}${isTabLocked("rota") ? " is-disabled" : ""}`}
          onClick={() => setActiveTab("rota")}
          disabled={isTabLocked("rota")}
        >
          <span className="tab-icon">🗺️</span>
          <span className="tab-label">Rota</span>
        </button>
        <button
          className={`tab ${activeTab === "tekne" ? "active" : ""}${isTabLocked("tekne") ? " is-disabled" : ""}`}
          onClick={() => setActiveTab("tekne")}
          disabled={isTabLocked("tekne")}
        >
          <span className="tab-icon">🔧</span>
          <span className="tab-label">Tekne</span>
        </button>
        <button
          className={`tab ${activeTab === "kaptan" ? "active" : ""}${isTabLocked("kaptan") ? " is-disabled" : ""}`}
          onClick={() => setActiveTab("kaptan")}
          disabled={isTabLocked("kaptan")}
        >
          <span className="tab-icon">👤</span>
          <span className="tab-label">Kaptan</span>
        </button>
      </nav>
    </div>
  );
}
