import { useState, useEffect } from "react";
import { audioManager } from "./audioManager";

const AUDIO_PREF_KEY = "yelkenli_audio_enabled";

export function useAudioSettings() {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUDIO_PREF_KEY) !== "false";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    audioManager.setEnabled(audioEnabled);
    try {
      localStorage.setItem(AUDIO_PREF_KEY, String(audioEnabled));
    } catch {
      // ignore
    }
  }, [audioEnabled]);

  return { audioEnabled, setAudioEnabled };
}
