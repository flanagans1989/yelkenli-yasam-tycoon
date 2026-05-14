import { useState, useEffect } from "react";
import type { CelebrationItem } from "../components/CelebrationModal";

export function useCelebrationQueue() {
  const [celebrationQueue, setCelebrationQueue] = useState<CelebrationItem[]>([]);
  const [activeCelebration, setActiveCelebration] = useState<CelebrationItem | null>(null);

  useEffect(() => {
    if (activeCelebration || celebrationQueue.length === 0) return;
    setActiveCelebration(celebrationQueue[0]);
    setCelebrationQueue(prev => prev.slice(1));
  }, [activeCelebration, celebrationQueue]);

  return { activeCelebration, setActiveCelebration, setCelebrationQueue };
}
