import type { Dispatch } from "react";
import { calculateProportionalMarinaDebit } from "../../game-data/economy";
import type { GameAction } from "../core/state/gameActions";

export function applyMarinaDebitToStore(
  dispatch: Dispatch<GameAction>,
  params: {
    lastMarinaDebitAt: number | null;
    now: number;
    worldProgress: number;
    credits: number;
  },
  options?: { announce?: boolean },
): number {
  const debitInfo = calculateProportionalMarinaDebit(params.lastMarinaDebitAt, params.now, params.worldProgress);
  if (debitInfo.debit <= 0) {
    if (debitInfo.nextDebitAt !== params.lastMarinaDebitAt) {
      dispatch({ type: "GAME/PATCH", payload: { lastMarinaDebitAt: debitInfo.nextDebitAt } });
    }
    return 0;
  }
  const debitAmount = Math.min(params.credits, debitInfo.debit);
  if (debitAmount <= 0) return 0;
  dispatch({ type: "MARINA/APPLY_DEBIT", payload: { debit: debitAmount, now: debitInfo.nextDebitAt } });
  if (options?.announce) {
    dispatch({
      type: "LOGS/ADD",
      payload: `Marina ücreti tahsil edildi: -${debitAmount.toLocaleString("tr-TR")} TL (${Math.floor(debitInfo.elapsedMinutes)} dk bağlama).`,
    });
  }
  return debitAmount;
}
