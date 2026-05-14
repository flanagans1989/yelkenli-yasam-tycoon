import { useEffect, useState } from "react";

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
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect x="19" y="7" width="26" height="13" rx="3" fill="#0c2a47" />
      <rect x="11" y="18" width="42" height="5" rx="2.5" fill="#0c2a47" />
      <rect x="19" y="16" width="26" height="4" fill="#ffd982" />
      <text x="32" y="15" textAnchor="middle" fontSize="7" fill="#0c2a47" fontFamily="sans-serif">⚓</text>
      <circle cx="32" cy="38" r="14" fill="#f5b98a" />
      <circle cx="24" cy="41" r="3.5" fill="#e8845a" opacity="0.35" />
      <circle cx="40" cy="41" r="3.5" fill="#e8845a" opacity="0.35" />
      <circle cx="27" cy="35" r="2.2" fill="#06182c" />
      <circle cx="37" cy="35" r="2.2" fill="#06182c" />
      <circle cx="28" cy="34" r="0.8" fill="#ffffff" />
      <circle cx="38" cy="34" r="0.8" fill="#ffffff" />
      <path d="M 27 42 Q 32 48 37 42" stroke="#a0522d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 20 50 Q 32 56 44 50" stroke="#5eeaf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
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
        <p className={`mico-speech-text${isComplete ? "" : " mico-typewriter"}`}>{typedMessage}</p>
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
