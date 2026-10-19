"use client";

import { useId, useState } from "react";
import { CUTOUTS } from "@/lib/cutouts";
import type { CarModel } from "@/lib/types";
import { useWikiImage } from "./CarImage";

// The car standing on a lit pedestal. Where we have a background-removed photo
// (public/cars, built from Wikimedia Commons) that real car is shown with a contact
// shadow and floor reflection; otherwise an SVG side profile shaped by body type and
// painted in the model's colour, with the raw photo in a small inset.
// Moving the pointer over the stage tilts the car in 3D (via --rx/--ry).
export function CarShowroom({ car }: { car: CarModel }) {
  const cut = CUTOUTS[car.wikiQuery];
  const [cutFailed, setCutFailed] = useState(false);
  const showCut = cut && !cutFailed;
  const url = useWikiImage(showCut ? "" : car.wikiQuery);
  const [failed, setFailed] = useState(false);
  const tint = `color-mix(in srgb, ${car.color} 38%, transparent)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--ry", `${x * 18 - 6}deg`);
    e.currentTarget.style.setProperty("--rx", `${4 - y * 10}deg`);
  };
  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.removeProperty("--ry");
    e.currentTarget.style.removeProperty("--rx");
  };

  return (
    <div className="showroom" style={{ ["--tint" as string]: tint }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="showroom-label">
        <span>{car.year}</span>
        <strong>{car.brand}</strong> {car.name}
      </div>

      {!showCut && url && !failed && (
        <a className="showroom-photo" href={url} target="_blank" rel="noreferrer" title="Real photo">
          <img src={url} alt={`${car.brand} ${car.name}`} onError={() => setFailed(true)} />
        </a>
      )}

      <div className="showroom-floor" aria-hidden>
        <span className="disc disc-3" />
        <span className="disc disc-2" />
        <span className="disc disc-1" />
      </div>

      {showCut ? (
        <>
          <div className="showroom-car showroom-car--photo">
            <span className="showroom-contact" aria-hidden />
            <img src={cut.src} alt={`${car.brand} ${car.name}`} onError={() => setCutFailed(true)} />
            <img className="showroom-mirror" src={cut.src} alt="" aria-hidden />
          </div>
          <a className="showroom-credit" href={cut.source} target="_blank" rel="noreferrer" title={`Photo: ${cut.credit} · ${cut.license} · background removed`}>
            Photo: {cut.credit} · {cut.license}, background removed
          </a>
        </>
      ) : (
        <div className="showroom-car">
          <CarDrawing color={car.color} type={car.type} label={`${car.brand} ${car.name}`} />
        </div>
      )}
    </div>
  );
}

// Silhouette proportions per body type (viewBox 260×110, ground at y=96).
const SHAPES: Record<string, { belt: number; roof: number; roofF: number; roofR: number; rear: number; sill: number }> = {
  Sedan: { belt: 56, roof: 31, roofF: 120, roofR: 168, rear: 206, sill: 81 },
  Hatchback: { belt: 54, roof: 29, roofF: 116, roofR: 186, rear: 226, sill: 81 },
  Estate: { belt: 54, roof: 30, roofF: 116, roofR: 204, rear: 232, sill: 81 },
  Crossover: { belt: 51, roof: 26, roofF: 114, roofR: 186, rear: 230, sill: 79 },
  SUV: { belt: 48, roof: 21, roofF: 110, roofR: 192, rear: 232, sill: 78 },
};

function CarDrawing({ color, type, label }: { color: string; type: string; label: string }) {
  const id = useId().replace(/:/g, "");
  const s = SHAPES[type] ?? SHAPES.Crossover;
  const { belt, roof, roofF, roofR, rear, sill } = s;
  const fx = 62;
  const rx = 198;
  const a = 90; // windshield base
  const tail = 246;

  const body = [
    `M14 ${belt + 12}`,
    `C14 ${belt + 4} 22 ${belt} 40 ${belt - 2}`,
    `L${a} ${belt - 4}`,
    `C${a + 12} ${roof + 8} ${roofF - 8} ${roof} ${roofF} ${roof}`,
    `C${roofF + 26} ${roof - 3} ${roofR - 18} ${roof - 2} ${roofR} ${roof + 1}`,
    `C${roofR + 16} ${roof + 3} ${rear - 4} ${belt - 14} ${rear} ${belt - 4}`,
    `L${tail - 6} ${belt}`,
    `C${tail} ${belt + 2} ${tail} ${belt + 8} ${tail} ${belt + 14}`,
    `L${tail} ${sill - 6}`,
    `C${tail} ${sill - 2} ${tail - 3} ${sill} ${tail - 8} ${sill}`,
    `L${rx + 21} ${sill} A21 21 0 0 0 ${rx - 21} ${sill}`,
    `L${fx + 21} ${sill} A21 21 0 0 0 ${fx - 21} ${sill}`,
    `L20 ${sill} C16 ${sill} 14 ${sill - 3} 14 ${sill - 8} Z`,
  ].join(" ");

  const glass = [
    `M${a + 7} ${belt - 5}`,
    `C${a + 17} ${roof + 11} ${roofF - 4} ${roof + 4} ${roofF + 2} ${roof + 4}`,
    `C${roofF + 26} ${roof + 1} ${roofR - 18} ${roof + 2} ${roofR - 2} ${roof + 5}`,
    `C${roofR + 11} ${roof + 7} ${rear - 12} ${belt - 12} ${rear - 9} ${belt - 5} Z`,
  ].join(" ");
  const pillar = Math.round((roofF + roofR) / 2);
  const door = Math.round((a + roofR) / 2) - 4;

  const wheel = (cx: number) => (
    <g key={cx}>
      <circle cx={cx} cy={79} r={18} fill="#17151d" />
      <circle cx={cx} cy={79} r={12} fill={`url(#rim${id})`} />
      {[0, 72, 144, 216, 288].map((deg) => (
        <line
          key={deg}
          x1={cx}
          y1={79}
          x2={cx + 10.5 * Math.cos((deg * Math.PI) / 180)}
          y2={79 + 10.5 * Math.sin((deg * Math.PI) / 180)}
          stroke="#5b5866"
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={79} r={3} fill="#2a2731" />
    </g>
  );

  return (
    <svg viewBox="0 0 260 110" width="100%" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`paint${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: `color-mix(in srgb, ${color} 55%, white)` }} />
          <stop offset="0.38" style={{ stopColor: color }} />
          <stop offset="1" style={{ stopColor: `color-mix(in srgb, ${color} 55%, black)` }} />
        </linearGradient>
        <linearGradient id={`glass${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fa3c8" />
          <stop offset="0.5" stopColor="#2b3350" />
          <stop offset="1" stopColor="#141827" />
        </linearGradient>
        <radialGradient id={`rim${id}`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#f4f3f8" />
          <stop offset="1" stopColor="#8d8a99" />
        </radialGradient>
        <filter id={`blur${id}`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <ellipse cx={130} cy={96} rx={112} ry={6} fill="#1c1330" opacity={0.28} filter={`url(#blur${id})`} />
      <path d={body} fill={`url(#paint${id})`} />
      <path d={glass} fill={`url(#glass${id})`} />
      <rect x={pillar - 2.5} y={roof + 3} width={5} height={belt - roof - 7} fill={color} opacity={0.9} />
      {/* glass reflection */}
      <path d={`M${a + 22} ${belt - 6} L${roofF + 14} ${roof + 5} L${roofF + 26} ${roof + 5} L${a + 34} ${belt - 6} Z`} fill="#fff" opacity={0.18} />
      {/* shoulder highlight + door cut */}
      <path d={`M40 ${belt + 1} L${tail - 8} ${belt + 3}`} stroke="#fff" strokeOpacity={0.45} strokeWidth={1.4} fill="none" />
      <path d={`M${door} ${belt - 2} L${door + 2} ${sill - 5}`} stroke="#000" strokeOpacity={0.22} strokeWidth={1} />
      <path d={`M${door + 18} ${belt + 8} h8`} stroke="#000" strokeOpacity={0.35} strokeWidth={1.6} strokeLinecap="round" />
      {/* lights */}
      <path d={`M15 ${belt + 7} C20 ${belt + 3} 28 ${belt + 2} 34 ${belt + 3} L32 ${belt + 8} C26 ${belt + 9} 20 ${belt + 9} 15 ${belt + 10} Z`} fill="#fff8e0" />
      <rect x={tail - 5} y={belt + 4} width={5} height={7} rx={2} fill="#e5323b" />
      {/* lower sill shade */}
      <path d={`M${fx + 21} ${sill - 4} L${rx - 21} ${sill - 4} L${rx - 21} ${sill} L${fx + 21} ${sill} Z`} fill="#000" opacity={0.18} />
      {/* dark wheel wells so the background doesn't show around the tyres */}
      {[fx, rx].map((cx) => (
        <path key={`well${cx}`} d={`M${cx - 20.5} ${sill} A20.5 20.5 0 0 1 ${cx + 20.5} ${sill} Z`} fill="#0f0e14" opacity={0.85} />
      ))}
      {(type === "SUV" || type === "Crossover") &&
        [fx, rx].map((cx) => (
          <path key={cx} d={`M${cx - 21} ${sill} A21 21 0 0 1 ${cx + 21} ${sill}`} fill="none" stroke="#1d1b24" strokeOpacity={0.55} strokeWidth={3} />
        ))}
      {wheel(fx)}
      {wheel(rx)}
    </svg>
  );
}
