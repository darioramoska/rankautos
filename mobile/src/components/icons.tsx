// Ported from web/src/components/icons.tsx — same path data, rendered with react-native-svg
// instead of raw <svg>. Each entry is a function of stroke/fill color so callers can recolor
// for active/inactive chip states exactly like the web version.
//
// Simplified to one clean stroke-only silhouette + two plain wheel circles per body type
// (was: fill+stroke body, separate window-line strokes, two-tone wheel discs with opacity
// layers — too illustrative for a minimal icon set), and one clean stroke concept per fuel
// type instead of mixed fill/opacity layering.
import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import type { BodyType, Fuel } from "../lib/types";

type SvgFn = (c: string) => React.ReactElement;

export const BODY_SVGS: Record<BodyType, SvgFn> = {
  Hatchback: (c) => (
    <Svg width={80} height={40} viewBox="0 0 80 40" fill="none">
      <Path d="M6 32V24L17 11H54L64 22V32H6Z" stroke={c} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <Circle cx={21} cy={32} r={6} stroke={c} strokeWidth={2} />
      <Circle cx={52} cy={32} r={6} stroke={c} strokeWidth={2} />
    </Svg>
  ),
  Sedan: (c) => (
    <Svg width={80} height={40} viewBox="0 0 80 40" fill="none">
      <Path d="M4 32V24L14 11H50L60 20L72 23V32H4Z" stroke={c} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <Circle cx={19} cy={32} r={6} stroke={c} strokeWidth={2} />
      <Circle cx={58} cy={32} r={6} stroke={c} strokeWidth={2} />
    </Svg>
  ),
  SUV: (c) => (
    <Svg width={80} height={40} viewBox="0 0 80 40" fill="none">
      <Path d="M5 32V19L14 8H64L73 19V32H5Z" stroke={c} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <Circle cx={21} cy={32} r={6.5} stroke={c} strokeWidth={2} />
      <Circle cx={57} cy={32} r={6.5} stroke={c} strokeWidth={2} />
    </Svg>
  ),
  Crossover: (c) => (
    <Svg width={80} height={40} viewBox="0 0 80 40" fill="none">
      <Path d="M5 32V21L16 10H58L68 21V32H5Z" stroke={c} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <Circle cx={21} cy={32} r={6.2} stroke={c} strokeWidth={2} />
      <Circle cx={54} cy={32} r={6.2} stroke={c} strokeWidth={2} />
    </Svg>
  ),
  Estate: (c) => (
    <Svg width={80} height={40} viewBox="0 0 80 40" fill="none">
      <Path d="M4 32V23L13 10H62L71 21V32H4Z" stroke={c} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <Circle cx={19} cy={32} r={6} stroke={c} strokeWidth={2} />
      <Circle cx={56} cy={32} r={6} stroke={c} strokeWidth={2} />
    </Svg>
  ),
};

export const FUEL_ICONS: Record<Fuel, SvgFn> = {
  Electric: (c) => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M11 2.5L5.5 11h4l-1 6.5L14.5 9h-4l0.5-6.5z" stroke={c} strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  ),
  Hybrid: (c) => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M10 3c3.5 1 6 4 6 8a6 6 0 01-12 0c0-4 2.5-7 6-8z" stroke={c} strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round" />
      <Path d="M10 6v8" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  ),
  PHEV: (c) => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Rect x={6} y={8} width={8} height={6.5} rx={1.6} stroke={c} strokeWidth={1.7} />
      <Path d="M8.3 8V5.3M11.7 8V5.3" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M14 10.6h2" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  ),
  Petrol: (c) => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Rect x={3.5} y={4.5} width={8} height={11.5} rx={1.6} stroke={c} strokeWidth={1.7} />
      <Path d="M11.5 8.3h1.3l2 2v4.7a1.2 1.2 0 01-2.4 0v-2" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5.8 7.8h4.4" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  Diesel: (c) => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Rect x={4} y={3.5} width={8} height={13} rx={2.2} stroke={c} strokeWidth={1.7} />
      <Path d="M12 9.5h1.6l1.9 1.9v3.4" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6.3 7.5h3.4" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
};
