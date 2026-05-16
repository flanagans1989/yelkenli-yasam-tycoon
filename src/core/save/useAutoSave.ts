import { useEffect, useRef } from "react";
import { SAVE_KEY, computeChecksum } from "./saveLoad";
import type { GameSaveSnapshot } from "./buildSaveSnapshot";

const PERSIST_STEPS = new Set(["HUB", "SEA_MODE", "ARRIVAL_SCREEN"]);

/**
 * Persists the game snapshot to localStorage whenever it changes while the
 * player is in an in-game step. Replaces the legacy approach of an inline
 * saveObj + a 50-entry dependency array, which was prone to drift when state
 * was added but one of the two lists was forgotten.
 *
 * Snapshot equality is checked via JSON serialization (excluding lastSavedAt,
 * which would otherwise force a write every render).
 */
export function useAutoSave(
  snapshot: GameSaveSnapshot,
  onSaved?: (snapshot: GameSaveSnapshot) => void,
): void {
  const lastSerializedRef = useRef<string>("");
  const serializedSnapshot = JSON.stringify(snapshot);

  useEffect(() => {
    if (!PERSIST_STEPS.has(snapshot.step)) return;
    if (serializedSnapshot === lastSerializedRef.current) return;
    lastSerializedRef.current = serializedSnapshot;

    const payload = { ...snapshot, lastSavedAt: Date.now() };
    const withChecksum = { ...payload, _checksum: computeChecksum(payload) };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(withChecksum));
      onSaved?.(snapshot);
    } catch (err) {
      console.error("[useAutoSave] localStorage write failed:", err);
    }
  }, [serializedSnapshot, snapshot, onSaved]);
}
