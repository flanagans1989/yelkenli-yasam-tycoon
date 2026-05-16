import { memo } from "react";
import { SEA_DECISION_EVENTS } from "../../data/seaEvents";
import type { MarinaRestInProgress, UpgradeInProgressItem } from "../save/saveLoad";
import type { Step } from "../../types/game";

export interface DevPanelProps {
  testMode: boolean;
  step: Step;
  setTestMode: (value: boolean) => void;
  setCredits: (value: number | ((prev: number) => number)) => void;
  setFollowers: (value: number | ((prev: number) => number)) => void;
  setEnergy: (value: number | ((prev: number) => number)) => void;
  setWater: (value: number | ((prev: number) => number)) => void;
  setFuel: (value: number | ((prev: number) => number)) => void;
  setBoatCondition: (value: number | ((prev: number) => number)) => void;
  setLastContentAt: (value: number | null | ((prev: number | null) => number | null)) => void;
  setUpgradesInProgress: (
    value: UpgradeInProgressItem[] | ((prev: UpgradeInProgressItem[]) => UpgradeInProgressItem[]),
  ) => void;
  setMarinaRestInProgress: (
    value: MarinaRestInProgress | null | ((prev: MarinaRestInProgress | null) => MarinaRestInProgress | null),
  ) => void;
  setPendingDecisionId: (value: string | null) => void;
  setCurrentSeaEvent: (value: string) => void;
  setCaptainXp: (value: number | ((prev: number) => number)) => void;
  pushToast: (
    type: "achievement" | "sponsor" | "voyage" | "content" | "warning" | "upgrade",
    title: string,
    text: string,
  ) => void;
  triggerFlash: (target: "credits" | "followers") => void;
}

export const DevPanel = memo(function DevPanel({
  testMode,
  step,
  setTestMode,
  setCredits,
  setFollowers,
  setEnergy,
  setWater,
  setFuel,
  setBoatCondition,
  setLastContentAt,
  setUpgradesInProgress,
  setMarinaRestInProgress,
  setPendingDecisionId,
  setCurrentSeaEvent,
  setCaptainXp,
  pushToast,
  triggerFlash,
}: DevPanelProps) {
  return (
    <>
      <button
        type="button"
        className="dev-panel-toggle"
        onClick={() => setTestMode(!testMode)}
      >
        {testMode ? "DEV MODE ON" : "v1.0"}
      </button>
      {testMode && (
        <div className="dev-panel-wrapper">
          <div className="dev-panel-container">
            <strong className="dev-panel-title">TEST ACTIONS</strong>
            <button type="button" className="dev-panel-button" onClick={() => setCredits((prev) => prev + 10000)}>
              +10K TL
            </button>
            <button
              type="button"
              className="dev-panel-button"
              onClick={() => {
                setFollowers((prev) => prev + 1000);
                triggerFlash("followers");
              }}
            >
              +1K Followers
            </button>
            <button
              type="button"
              className="dev-panel-button"
              onClick={() => {
                setEnergy(100);
                setWater(100);
                setFuel(100);
                setBoatCondition(100);
              }}
            >
              Fill Resources
            </button>
            <button type="button" className="dev-panel-button" onClick={() => setLastContentAt(0)}>
              Reset Content CD
            </button>
            <button
              type="button"
              className="dev-panel-button"
              onClick={() => setUpgradesInProgress((prev) => prev.map((upgrade) => ({ ...upgrade, completesAt: 0 })))}
            >
              Finish Upgrades
            </button>
            <button
              type="button"
              className="dev-panel-button"
              onClick={() => setMarinaRestInProgress(null)}
            >
              Finish Marina Rest
            </button>
            <button
              type="button"
              className="dev-panel-button"
              onClick={() => {
                if (step === "SEA_MODE") {
                  const evt = SEA_DECISION_EVENTS[Math.floor(Math.random() * SEA_DECISION_EVENTS.length)];
                  setPendingDecisionId(evt.id);
                  setCurrentSeaEvent(evt.description);
                } else {
                  pushToast("voyage", "Sea Mode", "You must be in Sea Mode to trigger an event.");
                }
              }}
            >
              Trigger Sea Event
            </button>
            <button
              type="button"
              className="dev-panel-button"
              onClick={() => setCaptainXp((prev) => prev + 500)}
            >
              +500 XP
            </button>
          </div>
        </div>
      )}
    </>
  );
});


