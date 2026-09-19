// Extracted from the old HomeScreen footer. Now lives on Profile > Disclaimer.
export function Disclaimer() {
  return (
    <p className="text-[13px]" style={{ color: "var(--mid)", lineHeight: 1.8 }}>
      <strong style={{ color: "var(--dark)" }}>Disclaimer:</strong> RankAutos is a car research and comparison tool
      only. We do not sell, trade or broker vehicles, and we are not a party to any purchase transaction. All
      listings are sourced from independent third-party platforms (AutoScout24, mobile.de, Otomoto, etc.). Prices,
      availability and listing details may change at any time without notice. RankAutos accepts no responsibility
      or liability for the accuracy of third-party data, or for any transaction you enter into with a seller.
      Always verify all details directly with the seller before making any purchase.
    </p>
  );
}
