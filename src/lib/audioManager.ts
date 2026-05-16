export type SoundEvent =
  | "tap"
  | "publish"
  | "viral"
  | "levelUp"
  | "upgradeStart"
  | "upgradeDone"
  | "arrival"
  | "warning"
  | "sailStart"
  | "dailyComplete";

class AudioManager {
  private ctx: AudioContext | null = null;
  private enabled = true;

  constructor() {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && this.ctx?.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
      });
    }
  }

  private getCtx(): AudioContext | null {
    try {
      if (!this.ctx) this.ctx = new AudioContext();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    gain = 0.18,
    startDelay = 0,
  ): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay);
      gainNode.gain.setValueAtTime(0, ctx.currentTime + startDelay);
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + startDelay + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
      osc.start(ctx.currentTime + startDelay);
      osc.stop(ctx.currentTime + startDelay + duration + 0.01);
    } catch {
      // Audio is enhancement only — never crash the game
    }
  }

  play(event: SoundEvent): void {
    if (!this.enabled) return;
    switch (event) {
      case "tap":
        this.playTone(440, 0.06, "sine", 0.12);
        break;
      case "publish":
        this.playTone(523, 0.12, "sine", 0.18);
        this.playTone(659, 0.15, "sine", 0.18, 0.09);
        break;
      case "viral":
        this.playTone(659, 0.10, "sine", 0.22);
        this.playTone(784, 0.10, "sine", 0.22, 0.10);
        this.playTone(1047, 0.18, "sine", 0.22, 0.20);
        break;
      case "levelUp":
        this.playTone(523, 0.15, "sine", 0.22);
        this.playTone(659, 0.15, "sine", 0.22, 0.15);
        this.playTone(784, 0.15, "sine", 0.22, 0.30);
        this.playTone(1047, 0.25, "sine", 0.25, 0.45);
        break;
      case "upgradeStart":
        this.playTone(330, 0.08, "square", 0.08);
        this.playTone(440, 0.10, "square", 0.08, 0.10);
        break;
      case "upgradeDone":
        this.playTone(440, 0.12, "sine", 0.18);
        this.playTone(523, 0.18, "sine", 0.20, 0.13);
        break;
      case "arrival":
        this.playTone(523, 0.12, "sine", 0.22);
        this.playTone(659, 0.12, "sine", 0.22, 0.13);
        this.playTone(784, 0.12, "sine", 0.22, 0.26);
        this.playTone(1047, 0.20, "sine", 0.25, 0.39);
        this.playTone(784, 0.20, "sine", 0.18, 0.60);
        break;
      case "warning":
        this.playTone(220, 0.07, "square", 0.18);
        this.playTone(220, 0.07, "square", 0.18, 0.12);
        break;
      case "sailStart":
        this.playTone(196, 0.18, "sine", 0.20);
        this.playTone(247, 0.18, "sine", 0.20, 0.19);
        this.playTone(330, 0.25, "sine", 0.22, 0.38);
        break;
      case "dailyComplete":
        this.playTone(523, 0.12, "sine", 0.22);
        this.playTone(659, 0.12, "sine", 0.22, 0.13);
        this.playTone(784, 0.12, "sine", 0.22, 0.26);
        this.playTone(1047, 0.12, "sine", 0.25, 0.39);
        this.playTone(1319, 0.25, "sine", 0.25, 0.52);
        break;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  resume(): void {
    try {
      this.ctx?.resume();
    } catch {
      // ignore
    }
  }
}

export const audioManager = new AudioManager();
