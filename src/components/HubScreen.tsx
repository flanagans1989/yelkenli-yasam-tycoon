import type { ReactNode } from "react";
import type { Step, Tab } from "../types/game";

interface HubScreenProps {
  step: Step;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
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
}

export function HubScreen({
  step,
  activeTab,
  setActiveTab,
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
}: HubScreenProps) {
  return (
    <div className={step === "SEA_MODE" ? "sea-mode-wrapper fade-in" : "hub-wrapper fade-in"}>
      {step === "SEA_MODE" ? (
        <header className="sea-topbar">
          <h2>{boatName}</h2>
          <p>{currentRoute?.name}: {currentRoute?.from} ➔ {currentRoute?.to}</p>
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
          </div>
        </header>
      )}

      {step === "HUB" && renderProgressStrip && renderProgressStrip()}

      <main className={step === "SEA_MODE" ? "sea-content" : "hub-content"}>
        {activeTab === "liman" && step === "HUB" && renderLimanTab()}
        {activeTab === "liman" && step === "SEA_MODE" && renderSeaModeTab()}
        {activeTab === "icerik" && renderIcerikTab()}
        {activeTab === "rota" && renderRotaTab()}
        {activeTab === "tekne" && renderTekneTab()}
        {activeTab === "kaptan" && renderKaptanTab()}
      </main>

      <nav className="bottom-tab-bar">
        <button className={`tab ${activeTab === "liman" ? "active" : ""}`} onClick={() => setActiveTab("liman")}>
          <span>{step === "SEA_MODE" ? "🌊" : "🏠"}</span> {step === "SEA_MODE" ? "Deniz" : "Liman"}
        </button>
        <button className={`tab ${activeTab === "icerik" ? "active" : ""}${!firstContentDone ? " tab-notif" : ""}`} onClick={() => setActiveTab("icerik")}>
          <span>📹</span> İçerik
        </button>
        <button className={`tab ${activeTab === "rota" ? "active" : ""}${firstContentDone && step === "HUB" && completedRouteIds.length === 0 ? " tab-notif" : ""}`} onClick={() => setActiveTab("rota")}>
          <span>🗺️</span> Rota
        </button>
        <button className={`tab ${activeTab === "tekne" ? "active" : ""}`} onClick={() => setActiveTab("tekne")}>
          <span>🔧</span> Tekne
        </button>
        <button className={`tab ${activeTab === "kaptan" ? "active" : ""}`} onClick={() => setActiveTab("kaptan")}>
          <span>👤</span> Kaptan
        </button>
      </nav>
    </div>
  );
}
