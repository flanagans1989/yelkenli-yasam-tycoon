import { useState } from "react";

export type FloaterType = "credits" | "followers" | "xp";

export interface RewardFloater {
  id: number;
  text: string;
  type: FloaterType;
}

export function useRewardFloaters() {
  const [rewardFloaters, setRewardFloaters] = useState<RewardFloater[]>([]);

  const addFloater = (text: string, type: FloaterType) => {
    const id = Date.now() + Math.random();
    setRewardFloaters(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setRewardFloaters(prev => prev.filter(f => f.id !== id));
    }, 1600);
  };

  return { rewardFloaters, addFloater };
}
