import { useEffect, useState } from "react";
import micoImg from "../../assets/mico.png";

export function useTypewriterText(message: string, active: boolean, speedMs = 18) {
  const [visibleLength, setVisibleLength] = useState(active ? 0 : message.length);

  useEffect(() => {
    if (!active) {
      setVisibleLength(message.length);
      return;
    }

    setVisibleLength(0);
    const normalizedSpeed = Math.max(12, speedMs);
    let timeoutId: number | null = null;

    const tick = (index: number) => {
      setVisibleLength(index);
      if (index >= message.length) return;
      timeoutId = window.setTimeout(() => tick(index + 1), normalizedSpeed);
    };

    timeoutId = window.setTimeout(() => tick(1), normalizedSpeed);

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [active, message, speedMs]);

  return {
    text: message.slice(0, visibleLength),
    isComplete: visibleLength >= message.length,
  };
}

export function MicoSvg({ size = 64 }: { size?: number }) {
  return (
    <img
      src={micoImg}
      width={size}
      height={size}
      alt="Miço"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0, borderRadius: "50%", objectFit: "cover", objectPosition: "center top" }}
    />
  );
}

interface MicoGuideProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "bubble" | "fullscreen";
  className?: string;
}

export function MicoGuide({
  message,
  visible,
  onDismiss,
  dismissLabel,
  actionLabel,
  onAction,
  variant = "bubble",
  className = "",
}: MicoGuideProps) {
  const [displayed, setDisplayed] = useState(false);
  const { text: typedMessage, isComplete } = useTypewriterText(message, visible && displayed);
  const tutorialDismissLabel = dismissLabel ?? (className.includes("hub-guide") && onAction && onDismiss ? "Eğitimi Geç" : undefined);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setDisplayed(true), 60);
      return () => clearTimeout(t);
    }

    setDisplayed(false);
  }, [visible]);

  if (!visible && !displayed) return null;

  if (variant === "fullscreen") {
    return (
      <div className={`mico-fullscreen ${displayed ? "mico-fullscreen--in" : ""}`}>
        <div className="mico-fs-avatar">
          <div className="mico-fs-glow" aria-hidden="true" />
          <MicoSvg size={96} />
        </div>
        <div className="mico-fs-bubble">
          <span className="mico-fs-name">Miço</span>
          <p className={`mico-fs-message${isComplete ? "" : " mico-typewriter"}`}>{typedMessage}</p>
        </div>
        {(onAction || onDismiss) && (
          <div className="mico-fs-actions">
            {onDismiss && tutorialDismissLabel && (
              <button className="mico-fs-secondary-btn" onClick={onDismiss}>
                {tutorialDismissLabel}
              </button>
            )}
            {onAction ? (
              <button className="primary-button primary-button--pulse mico-fs-btn" onClick={onAction}>
                {actionLabel ?? "Devam →"}
              </button>
            ) : onDismiss && !dismissLabel ? (
              <button className="primary-button primary-button--pulse mico-fs-btn" onClick={onDismiss}>
                {actionLabel ?? "Devam →"}
              </button>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`mico-bubble-wrap ${displayed ? "mico-bubble-wrap--in" : ""} ${className}`.trim()}>
      <div className="mico-avatar-col">
        <div className="mico-avatar-ring" aria-hidden="true" />
        <MicoSvg size={52} />
        <span className="mico-name-tag">Miço</span>
      </div>
      <div className="mico-speech-bubble glass-card">
        <div className="mico-speech-body">
          <p className="mico-speech-sizer" aria-hidden="true">{message}</p>
          <p className={`mico-speech-text${isComplete ? "" : " mico-typewriter"}`}>{typedMessage}</p>
        </div>
        {(onAction || onDismiss) && (
          <div className="mico-action-row">
            {onDismiss && tutorialDismissLabel && (
              <button className="mico-dismiss-btn" onClick={onDismiss}>
                {tutorialDismissLabel}
              </button>
            )}
            {onAction ? (
              <button className="mico-action-btn" onClick={onAction}>
                {actionLabel ?? "Tamam ✓"}
              </button>
            ) : onDismiss && !dismissLabel ? (
              <button className="mico-action-btn" onClick={onDismiss}>
                {actionLabel ?? "Tamam ✓"}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
