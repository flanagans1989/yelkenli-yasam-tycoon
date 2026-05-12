import { SponsorOfferList } from "./SponsorOfferList";

type SponsorTierInfo = {
  name: string;
  minFollowers: number;
};

type SponsorOfferItem = {
  id: string;
  brandName: string;
  tierName: string;
  minReward: number;
  maxReward: number;
};

type SponsorTabProps = {
  activeSponsorName: string;
  brandTrust: number;
  currentSponsorTierName?: string;
  nextSponsorTier?: SponsorTierInfo;
  sponsorProgressPercent: number;
  followers: number;
  onCheckSponsorOffers: () => void;
  sponsorOffers: SponsorOfferItem[];
  onAcceptSponsor: (offerId: string) => void;
  acceptedSponsors: string[];
};

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
            {Array.from(new Set(acceptedSponsors.filter(Boolean))).map((name) => (
              <span key={name} className="spo-badge">{name}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
