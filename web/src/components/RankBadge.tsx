const RANK_GRADIENTS: Record<number, string> = {
  1: "linear-gradient(145deg, #ffe9b8 0%, #f0a93d 55%, #c9781a 100%)",
  2: "linear-gradient(145deg, #f3f6fb 0%, #b9c3d4 55%, #8592a6 100%)",
  3: "linear-gradient(145deg, #f0c9a4 0%, #c98652 55%, #93582c 100%)",
};

// Sits on the corner of the car photo, so ranks past the podium get a frosted
// chip rather than bare text — bare text would vanish against the image.
export function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <div
        className="flex items-center justify-center rounded-full font-bold"
        style={{
          minWidth: 30,
          height: 26,
          padding: "0 8px",
          fontSize: 11,
          color: "var(--ink)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px rgba(28,19,48,0.18)",
        }}
      >
        #{rank}
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full font-extrabold text-white"
      style={{
        width: 30,
        height: 30,
        fontSize: 13,
        background: RANK_GRADIENTS[rank],
        border: "2px solid rgba(255,255,255,0.9)",
        boxShadow: "0 3px 10px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.6)",
      }}
    >
      {rank}
    </div>
  );
}
