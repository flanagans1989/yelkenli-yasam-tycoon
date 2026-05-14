import { SponsorOfferList } from "./SponsorOfferList";
import type { SponsorOffer } from "../types/game";

type SponsorTierInfo = {
  name: string;
  minFollowers: number;
};

type SponsorTabProps = {
  activeSponsorName: string;
  brandTrust: number;
  currentSponsorTierName?: string;
  nextSponsorTier?: SponsorTierInfo;
  sponsorProgressPercent: number;
  followers: number;
  onCheckSponsorOffers: () => void;
  sponsorOffers: SponsorOffer[];
  onAcceptSponsor: (offerId: string) => void;
  acceptedSponsors: string[];
  sponsorObligations: Record<string, number>;
};

const OBLIGATION_GOAL = 5;

export function SponsorTab({
  activeSponsorName,
  brandTrust,
  currentSponsorTierName,
  nextSponsorTier,
  sponsorProgressPercent,
  followers,
  onCheckSponsorOffers,
  sponsorOffers,
  onAcceptSponsor,
  acceptedSponsors,
  sponsorObligations,
}: SponsorTabProps) {
  return (
    <div className="sponsor-section fade-in">
      <div className="sponsor-career-card">
        <span className="sponsor-career-eyebrow">Sponsor Kariyeri</span>
        {activeSponsorName ? (
          <div className="sponsor-career-title">{activeSponsorName}</div>
        ) : (
          <div className="sponsor-career-title">İlk anlaşma seni bekliyor</div>
        )}
        <div className="sponsor-career-meta">
          Marka Güveni: {brandTrust}/100
          {currentSponsorTierName ? ` · Seviye: ${currentSponsorTierName}` : ""}
        </div>
        {nextSponsorTier && (
          <>
            <div className="sponsor-progress-bar mt-10">
              <div className="sponsor-progress-fill" style={{ width: `${sponsorProgressPercent}%` }}></div>
            </div>
            <div className="sponsor-career-highlight">
              {followers.toLocaleString("tr-TR")} / {nextSponsorTier.minFollowers.toLocaleString("tr-TR")} takipçi · Hedef: {nextSponsorTier.name}
            </div>
          </>
        )}
      </div>

      <button className="btn-primary full-width mb-20" onClick={onCheckSponsorOffers}>
        Teklifleri Kontrol Et
      </button>

      <h3 className="section-title">Gelen Teklifler</h3>
      <SponsorOfferList offers={sponsorOffers} onAcceptSponsor={onAcceptSponsor} />

      {acceptedSponsors.length > 0 && (
        <>
          <h3 className="section-title mt-20">Aktif Sponsorlar</h3>
          <div className="accepted-sponsors-list">
            {Array.from(new Set(acceptedSponsors.filter(Boolean))).map((name) => {
              const count = sponsorObligations[name] ?? 0;
              const pct = Math.min(100, (count / OBLIGATION_GOAL) * 100);
              const done = count >= OBLIGATION_GOAL;
              return (
                <div key={name} className="spo-obligation-row">
                  <div className="spo-obligation-head">
                    <span className="spo-badge">{name}</span>
                    <span className="spo-obligation-label">{done ? "✓ Tamamlandı" : `${count}/${OBLIGATION_GOAL} içerik`}</span>
                  </div>
                  <div className="spo-obligation-bar">
                    <div className="spo-obligation-fill" style={{ width: `${pct}%`, background: done ? "var(--accent-green, #4ade80)" : "var(--accent-cyan, #22d3ee)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
