export type Ov = Partial<{ fuel: string; tr: string; seats: number; msrp: number; range: number; elec: number; boot: number; kw: number; ncap: number }>;
export type D = Partial<{ r: number; s: number; p: number; t: number; rel: number; v: number }>;
// [base id, gen from, gen to (null = current), trim, model year, overrides, score deltas, charging score for PHEV / EV built from an ICE base]
export type V = [number, number, number | null, string, number, Ov, D?, number?];
export const PERF: D = { v: -1, r: -0.5 };
export interface TrimDataset { brands: string[]; genFrom: Record<number, number>; variants: V[] }
