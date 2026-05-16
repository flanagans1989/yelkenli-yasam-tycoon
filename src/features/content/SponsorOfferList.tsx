import type { SponsorOffer } from "../../types/game";

type SponsorOfferListProps = {
  offers: SponsorOffer[];
  onAcceptSponsor: (offerId: string) => void;
};

export function SponsorOfferList({ offers, onAcceptSponsor }: SponsorOfferListProps) {
  if (offers.length === 0) {
    return (
      <p className="empty-text">
        Henüz yeni bir sponsor teklifi yok. Daha fazla takipçi kazan veya içerik kaliteni artır.
      </p>
    );
  }

  return (
    <div className="sponsor-offers-list">
      {offers.map((offer) => (
        <div key={offer.id} className="sponsor-card fade-in">
          <div className="spo-header">
            <strong>{offer.brandName}</strong>
            <span className="spo-tier">{offer.tierName}</span>
          </div>
          <p className="spo-career-line">Bu anlaşma, dünya turu hikayeni bir marka işbirliğine dönüştürür.</p>
          <p className="spo-reward-line">
            Kariyer Geliri: {offer.minReward.toLocaleString("tr-TR")} – {offer.maxReward.toLocaleString("tr-TR")} TL
          </p>
          <button className="btn-primary mt-10 full-width" onClick={() => onAcceptSponsor(offer.id)}>
            Kabul Et
          </button>
        </div>
      ))}
    </div>
  );
}
