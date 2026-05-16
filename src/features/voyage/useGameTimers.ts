import { useEffect, useState } from "react";
import type { Dispatch } from "react";
import { BOAT_UPGRADES } from "../../../game-data/upgrades";
import { calculateProportionalMarinaDebit } from "../../../game-data/economy";
import type { GameAction } from "../../core/state/gameActions";
import type { GameState } from "../../core/state/gameReducer";
import { getSafeNow } from "../../core/save/saveLoad";

const UPGRADE_INSTALL_CHECK_INTERVAL_MS = 30000;
const TIMER_TICK_MS = 30000;
const MARINA_DEBIT_INTERVAL_MS = 60000;

export function useGameTimers(
  gameState: GameState,
  dispatch: Dispatch<GameAction>,
): void {
  const [, setContentCooldownTick] = useState(0);
  const [, setMarinaRestCooldownTick] = useState(0);

  useEffect(() => {
    if (gameState.upgradesInProgress.length === 0) return;

    const sanitizedUpgrades = gameState.upgradesInProgress.filter(
      (item) => !gameState.purchasedUpgradeIds.includes(item.upgradeId),
    );
    if (sanitizedUpgrades.length !== gameState.upgradesInProgress.length) {
      dispatch({ type: "GAME/PATCH", payload: { upgradesInProgress: sanitizedUpgrades } });
      return;
    }

    const checkInstallation = () => {
      const now = Date.now();
      const completed = sanitizedUpgrades.filter((item) => item.completesAt <= now);
      if (completed.length === 0) return;

      for (const item of completed) {
        const upgrade = BOAT_UPGRADES.find((u) => u.id === item.upgradeId);
        if (!upgrade) {
          dispatch({
            type: "GAME/PATCH",
            payload: {
              upgradesInProgress: gameState.upgradesInProgress.filter(
                (activeItem) => activeItem.upgradeId !== item.upgradeId,
              ),
            },
          });
          continue;
        }
        if (gameState.purchasedUpgradeIds.includes(item.upgradeId)) {
          continue;
        }
        dispatch({ type: "UPGRADES/COMPLETE_INSTALL", payload: { upgradeId: item.upgradeId } });
        dispatch({ type: "LOGS/ADD", payload: `Kurulum tamamlandi: ${upgrade.name} aktif edildi.` });
      }
    };

    checkInstallation();
    const intervalId = window.setInterval(checkInstallation, UPGRADE_INSTALL_CHECK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [dispatch, gameState.purchasedUpgradeIds, gameState.upgradesInProgress]);

  useEffect(() => {
    if (!gameState.lastContentAt) return;
    const tickId = window.setInterval(() => setContentCooldownTick((prev) => prev + 1), TIMER_TICK_MS);
    return () => window.clearInterval(tickId);
  }, [gameState.lastContentAt]);

  useEffect(() => {
    if (!gameState.marinaRestInProgress) return;

    const checkRest = () => {
      const now = Date.now();
      setMarinaRestCooldownTick(now);
      if (gameState.marinaRestInProgress && gameState.marinaRestInProgress.completesAt <= now && gameState.step === "HUB") {
        dispatch({ type: "MARINA/COMPLETE_REST" });
        dispatch({ type: "LOGS/ADD", payload: "Marina dinlenme hizmeti tamamlandi." });
      }
    };

    checkRest();
    const tickId = window.setInterval(checkRest, TIMER_TICK_MS);
    return () => window.clearInterval(tickId);
  }, [dispatch, gameState.marinaRestInProgress, gameState.step]);

  useEffect(() => {
    if (gameState.step !== "HUB" || !gameState.currentLocationName) return;
    if (gameState.lastMarinaDebitAt == null) {
      dispatch({ type: "GAME/PATCH", payload: { lastMarinaDebitAt: getSafeNow() } });
      return;
    }

    const tickId = window.setInterval(() => {
      const now = getSafeNow();
      const debitInfo = calculateProportionalMarinaDebit(
        gameState.lastMarinaDebitAt,
        now,
        gameState.worldProgress,
      );
      if (debitInfo.debit <= 0) {
        if (debitInfo.nextDebitAt !== gameState.lastMarinaDebitAt) {
          dispatch({ type: "GAME/PATCH", payload: { lastMarinaDebitAt: debitInfo.nextDebitAt } });
        }
        return;
      }
      const debitAmount = Math.min(gameState.credits, debitInfo.debit);
      if (debitAmount <= 0) return;
      dispatch({ type: "MARINA/APPLY_DEBIT", payload: { debit: debitAmount, now: debitInfo.nextDebitAt } });
    }, MARINA_DEBIT_INTERVAL_MS);

    return () => window.clearInterval(tickId);
  }, [
    dispatch,
    gameState.credits,
    gameState.currentLocationName,
    gameState.lastMarinaDebitAt,
    gameState.step,
    gameState.worldProgress,
  ]);
}

