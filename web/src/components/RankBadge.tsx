const RANK_GRADIENTS: Record<number, string> = {
  1: "linear-gradient(145deg, #ffe9b8 0%, #f0a93d 55%, #c9781a 100%)",
  2: "linear-gradient(145deg, #f3f6fb 0%, #b9c3d4 55%, #8592a6 100%)",
  3: "linear-gradient(145deg, #f0c9a4 0%, #c98652 55%, #93582c 100%)",
};

export function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <div className="w-full text-center font-extrabold text-sm" style={{ color: "var(--mid)" }}>
        #{rank}
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full font-extrabold text-white mx-auto"
      style={{
        width: 30,
        height: 30,
        fontSize: 13,
        background: RANK_GRADIENTS[rank],
        boxShadow: "0 3px 8px rgba(0,0,0,0.22), inset 0 1px 1px rgba(255,255,255,0.6)",
      }}
    >
      {rank}
    </div>
  );
}
