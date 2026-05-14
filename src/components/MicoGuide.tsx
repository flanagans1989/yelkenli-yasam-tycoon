import { useState, useEffect } from "react";

export function MicoSvg({ size = 64 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* Hat top */}
      <rect x="19" y="7" width="26" height="13" rx="3" fill="#0c2a47" />
      {/* Hat brim */}
      <rect x="11" y="18" width="42" height="5" rx="2.5" fill="#0c2a47" />
      {/* Hat gold band */}
      <rect x="19" y="16" width="26" height="4" fill="#ffd982" />
      {/* Anchor on hat */}
      <text x="32" y="15" textAnchor="middle" fontSize="7" fill="#0c2a47" fontFamily="sans-serif">⚓</text>
      {/* Head */}
      <circle cx="32" cy="38" r="14" fill="#f5b98a" />
      {/* Cheeks */}
      <circle cx="24" cy="41" r="3.5" fill="#e8845a" opacity="0.35" />
      <circle cx="40" cy="41" r="3.5" fill="#e8845a" opacity="0.35" />
      {/* Eyes */}
      <circle cx="27" cy="35" r="2.2" fill="#06182c" />
      <circle cx="37" cy="35" r="2.2" fill="#06182c" />
      {/* Eye shine */}
      <circle cx="28" cy="34" r="0.8" fill="#ffffff" />
      <circle cx="38" cy="34" r="0.8" fill="#ffffff" />
      {/* Smile */}
      <path d="M 27 42 Q 32 48 37 42" stroke="#a0522d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Collar */}
      <path d="M 20 50 Q 32 56 44 50" stroke="#5eeaf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

interface MicoGuideProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "bubble" | "fullscreen";
}

export function MicoGuide({
  message,
  visible,
  onDismiss,
  actionLabel,
  onAction,
  variant = "bubble",
}: MicoGuideProps) {
  const [displayed, setDisplayed] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setDisplayed(true), 60);
      return () => clearTimeout(t);
    } else {
      setDisplayed(false);
    }
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
          <p className="mico-fs-message">{message}</p>
        </div>
        {(onAction || onDismiss) && (
          <button
            className="primary-button primary-button--pulse mico-fs-btn"
            onClick={onAction ?? onDismiss}
          >
            {actionLabel ?? "Devam →"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`mico-bubble-wrap ${displayed ? "mico-bubble-wrap--in" : ""}`}>
      <div className="mico-avatar-col">
        <div className="mico-avatar-ring" aria-hidden="true" />
        <MicoSvg size={52} />
        <span className="mico-name-tag">Miço</span>
      </div>
      <div className="mico-speech-bubble glass-card">
        <p className="mico-speech-text">{message}</p>
        {(onAction || onDismiss) && (
          <button className="mico-action-btn" onClick={onAction ?? onDismiss}>
            {actionLabel ?? "Tamam ✓"}
          </button>
        )}
      </div>
    </div>
  );
}
