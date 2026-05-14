import type { ReactElement } from "react";

/**
 * Boat silhouette SVGs used both during onboarding and on the Tekne tab.
 * Kept outside Onboarding.tsx so the (large) onboarding bundle can be lazy-loaded
 * without pulling this helper into the eager chunk.
 */
export const getBoatSvg = (boatId: string): ReactElement => {
  if (boatId === "kirlangic_28") {
    return (
      <svg viewBox="0 0 100 100" fill="currentColor" width="100%" height="100%">
        <path d="M 50 10 L 50 70 L 90 70 Z M 45 20 L 20 70 L 45 70 Z M 10 75 Q 50 90 90 75 L 80 85 Q 50 100 20 85 Z" />
      </svg>
    );
  }
  if (boatId === "denizkusu_34") {
    return (
      <svg viewBox="0 0 100 100" fill="currentColor" width="100%" height="100%">
        <path d="M 45 5 L 45 65 L 95 65 Z M 40 15 L 10 65 L 40 65 Z M 5 70 Q 50 95 95 70 L 85 85 Q 50 105 15 85 Z" />
      </svg>
    );
  }
  if (boatId === "atlas_40") {
    return (
      <svg viewBox="0 0 100 100" fill="currentColor" width="100%" height="100%">
        <path d="M 35 5 L 35 60 L 70 60 Z M 30 15 L 5 60 L 30 60 Z M 75 10 L 75 60 L 95 60 Z M 5 65 L 95 65 L 90 85 L 10 85 Z" />
      </svg>
    );
  }
  return <span>⛵</span>;
};
