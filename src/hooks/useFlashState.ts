import { useState } from "react";

export function useFlashState() {
  const [flashCredits, setFlashCredits] = useState(false);
  const [flashFollowers, setFlashFollowers] = useState(false);

  const triggerFlash = (type: "credits" | "followers") => {
    if (type === "credits") {
      setFlashCredits(true);
      setTimeout(() => setFlashCredits(false), 600);
    } else {
      setFlashFollowers(true);
      setTimeout(() => setFlashFollowers(false), 600);
    }
  };

  return { flashCredits, flashFollowers, triggerFlash };
}
