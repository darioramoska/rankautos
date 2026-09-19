// Trim / generation rollout for the top-10 European brands (VW, Toyota, Renault, Peugeot, Škoda,
// Ford, Mercedes, BMW, Audi, Hyundai).
//  1. Normalises model_families (one family per nameplate) and gives every existing row of those
//     brands a real generation label ("2019+") instead of "Current".
//  2. Adds extra trims of the current generation and rows for the previous generation, cloned
//     from an existing "base" row with overrides; editorial scores are derived from the base
//     (range/value/practicality follow the spec change, older generations lose tech/safety points).
//  3. Adds demo listings for the new rows (raw_data.source = 'mock', same as syncMockCatalog).
// Scores are editorial estimates, specs are approximate WLTP/MSRP figures. Idempotent.
import "dotenv/config";
import pg from "pg";

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BRANDS = ["Volkswagen", "Toyota", "Renault", "Peugeot", "Škoda", "Ford", "Mercedes", "BMW", "Audi", "Hyundai"];

// Start year of the generation each existing base row belongs to.
const GEN_FROM: Record<number, number> = Object.fromEntries(
  `174:2018 81:2020 175:2015 176:2024 144:2018 241:2018 177:2017 112:2021 178:2016 179:2018 39:2021 180:2017 239:2024 181:2015 240:2018
190:2024 191:2022 50:2018 192:2020 141:2023 193:2022 225:2018 82:2021 228:2023 229:2022 197:2021 55:2023 40:2020 113:2022 194:2024 226:2018 195:2018 196:2019 227:2019
84:2023 201:2017 115:2018 203:2015 67:2019 202:2019 42:2020 71:2019 253:2019 254:2022
137:2021 198:2019 150:2020 246:2016 248:2024 35:2021 200:2022 247:2024 77:2023 199:2023 107:2020
117:2018 182:2018 143:2021 183:2019 234:2023 184:2023 44:2021 62:2021 189:2022 235:2021 236:2018 186:2020 187:2019 86:2022 188:2019 233:2019 185:2020
213:2019 87:2019 74:2024 48:2021 212:2022 145:2024 118:2018 45:2019 238:2024 237:2018
51:2024 230:2021 116:2022 85:2019 75:2019 231:2023 43:2022 146:2023 232:2025
56:2024 37:2020 109:2021 79:2019 158:2017 215:2024 224:2025 72:2020 222:2020 214:2019 139:2024 223:2024
119:2022 136:2022 120:2023 220:2024 88:2019 219:2019 210:2020 211:2024 151:2023 46:2018 221:2025 218:2020 64:2020
169:2017 165:2019 49:2019 217:2019 173:2022 170:2019 38:2020 171:2021 172:2023 111:2024 110:2017 167:2019 69:2017 168:2021 80:2024 140:2018 216:2015 166:2011`
    .split(/\s+/).map((p) => p.split(":").map(Number) as [number, number])
);

type Ov = Partial<{ fuel: string; tr: string; seats: number; msrp: number; range: number; elec: number; boot: number; kw: number; ncap: number }>;
type D = Partial<{ r: number; s: number; p: number; t: number; rel: number; v: number }>;
// [base id, gen from, gen to (null = current), trim, model year, overrides, score deltas, charging score for PHEV / EV built from an ICE base]
type V = [number, number, number | null, string, number, Ov, D?, number?];
const PERF: D = { v: -1, r: -0.5 };

const VARIANTS: V[] = [
  // ---- Volkswagen
  [49, 2019, null, "Golf 2.0 TDI 150", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 35500, range: 1100 }],
  [49, 2019, null, "Golf 1.0 TSI 110", 2024, { msrp: 26500, range: 850 }],
  [165, 2019, null, "Golf R", 2024, { tr: "Automatic", msrp: 52500, range: 700 }, PERF],
  [49, 2019, null, "Golf eHybrid", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 41500, range: 1000, elec: 143, kw: 50 }, {}, 6],
  [49, 2012, 2019, "Golf 1.4 TSI", 2017, { msrp: 24500 }],
  [49, 2012, 2019, "Golf 2.0 TDI", 2017, { fuel: "Diesel", msrp: 27500, range: 1100 }],
  [165, 2012, 2019, "Golf GTI", 2017, { msrp: 33000 }, PERF],
  [49, 2012, 2019, "e-Golf", 2018, { fuel: "Electric", tr: "Automatic", msrp: 39000, range: 231, kw: 40 }, { r: -2.5 }, 4],
  [110, 2009, 2017, "Polo 1.2 TSI", 2015, { msrp: 15500, range: 750 }],
  [110, 2017, null, "Polo GTI", 2024, { tr: "Automatic", msrp: 29500, range: 700 }, PERF],
  [111, 2024, null, "Passat Estate 2.0 TDI", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 46000, range: 1300 }],
  [111, 2014, 2024, "Passat Variant 2.0 TDI", 2019, { fuel: "Diesel", tr: "Automatic", msrp: 38000, range: 1300 }],
  [111, 2014, 2024, "Passat Variant GTE", 2019, { elec: 56, msrp: 46000, kw: 4 }, {}, 4],
  [80, 2024, null, "Tiguan 2.0 TDI 4Motion", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 48500, range: 1000 }],
  [80, 2016, 2024, "Tiguan 2.0 TDI", 2019, { fuel: "Diesel", msrp: 36000, range: 1000 }],
  [80, 2016, 2024, "Tiguan 1.5 TSI", 2019, { fuel: "Petrol", tr: "Manual", msrp: 31000, range: 800 }],
  [170, 2019, null, "ID.3 Pro S", 2024, { msrp: 46000, range: 545, kw: 175 }],
  [38, 2020, null, "ID.4 GTX", 2024, { msrp: 56000, range: 480, kw: 175 }, { v: -0.5 }],
  [38, 2020, null, "ID.4 Pure", 2024, { msrp: 38500, range: 350, kw: 110 }],
  [69, 2017, null, "T-Roc R", 2024, { tr: "Automatic", msrp: 46500, range: 650 }, PERF],
  [69, 2017, null, "T-Roc 2.0 TDI", 2024, { fuel: "Diesel", msrp: 33500, range: 1000 }],
  [140, 2018, null, "Touareg eHybrid", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 81000, range: 900, elec: 47, kw: 4 }, {}, 4],
  [140, 2010, 2018, "Touareg 3.0 TDI", 2015, { msrp: 66000 }],
  [166, 2011, null, "e-up!", 2023, { fuel: "Electric", tr: "Automatic", msrp: 27000, range: 260, kw: 40 }, { r: -3 }, 4],
  // ---- Audi
  [81, 2020, null, "A3 Sportback 35 TDI", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 38500, range: 1100 }],
  [81, 2020, null, "S3 Sportback", 2024, { tr: "Automatic", msrp: 56500, range: 700 }, PERF],
  [81, 2012, 2020, "A3 Sportback 1.4 TFSI", 2017, { msrp: 26500, range: 800 }],
  [175, 2015, null, "A4 Avant 35 TFSI", 2024, { fuel: "Petrol", msrp: 47500, range: 850 }],
  [175, 2007, 2015, "A4 Avant 2.0 TDI", 2012, { msrp: 36000 }],
  [144, 2018, null, "A6 Avant 45 TFSI", 2024, { fuel: "Petrol", msrp: 68000, range: 850 }],
  [144, 2011, 2018, "A6 Avant 3.0 TDI", 2015, { msrp: 61000, range: 1100 }],
  [39, 2021, null, "Q4 e-tron 50 quattro", 2024, { msrp: 58000, range: 488, kw: 175 }, { v: -0.5 }],
  [39, 2021, null, "Q4 Sportback e-tron 45", 2024, { msrp: 56000, range: 565, kw: 135 }],
  [181, 2015, null, "Q7 50 TDI", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 78000, range: 1100 }],
  [181, 2005, 2015, "Q7 3.0 TDI", 2012, { fuel: "Diesel", msrp: 62000, range: 1000 }],
  [180, 2017, null, "Q5 55 TFSI e", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 70000, range: 900, elec: 62, kw: 7 }, {}, 4.5],
  [112, 2021, null, "RS e-tron GT", 2024, { msrp: 150000, range: 487, kw: 270 }, { v: -1.5 }],
  // ---- BMW
  [50, 2018, null, "3 Series 320d", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 49000, range: 1100 }],
  [50, 2018, null, "3 Series 330e", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 56000, range: 900, elec: 60, kw: 4 }, {}, 4.5],
  [50, 2018, null, "M340i", 2024, { tr: "Automatic", msrp: 68000, range: 800 }, PERF],
  [50, 2011, 2018, "3 Series 320d", 2015, { fuel: "Diesel", msrp: 38000, range: 1200 }],
  [141, 2023, null, "5 Series 530e Touring", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 74000, range: 900, elec: 85, kw: 11 }, {}, 5.5],
  [141, 2017, 2023, "5 Series 520d Touring", 2020, { msrp: 58000 }],
  [82, 2021, null, "i4 M50", 2024, { tr: "Automatic", msrp: 73000, range: 510, kw: 210 }, { v: -1 }],
  [197, 2021, null, "iX xDrive40", 2024, { msrp: 78000, range: 425, kw: 150 }],
  [197, 2021, null, "iX M60", 2024, { msrp: 135000, range: 561, kw: 200 }, { v: -1.5 }],
  [194, 2017, 2024, "X3 xDrive20d", 2020, { msrp: 56000 }],
  [195, 2018, null, "X5 xDrive50e", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 105000, range: 900, elec: 110, kw: 11 }, {}, 5.5],
  [195, 2013, 2018, "X5 xDrive30d", 2016, { fuel: "Diesel", msrp: 68000, range: 1100 }],
  [113, 2022, null, "X1 sDrive18i", 2024, { fuel: "Petrol", tr: "Automatic", msrp: 40000, range: 800 }],
  [113, 2015, 2022, "X1 xDrive20d", 2019, { fuel: "Diesel", msrp: 42000, range: 1100 }],
  [190, 2019, 2024, "1 Series 118i", 2021, { msrp: 33000 }],
  // ---- Mercedes
  [143, 2021, null, "C300e", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 60000, range: 1000, elec: 100, kw: 55 }, {}, 6.5],
  [143, 2021, null, "C180", 2024, { fuel: "Petrol", msrp: 48000, range: 850 }],
  [143, 2014, 2021, "C220d", 2017, { msrp: 41000 }],
  [117, 2018, null, "A180", 2024, { msrp: 34500, range: 800 }],
  [117, 2018, null, "A250e", 2024, { fuel: "PHEV", msrp: 44500, range: 900, elec: 72, kw: 24 }, {}, 5],
  [117, 2012, 2018, "A180", 2015, { msrp: 25500, range: 750 }],
  [184, 2023, null, "E300e", 2024, { fuel: "PHEV", msrp: 68000, range: 1000, elec: 100, kw: 55 }, {}, 6.5],
  [184, 2016, 2023, "E220d", 2019, { msrp: 52000 }],
  [86, 2022, null, "GLC 220d 4MATIC", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 63000, range: 1100 }],
  [86, 2015, 2022, "GLC 220d", 2019, { fuel: "Diesel", tr: "Automatic", msrp: 52000, range: 1100 }],
  [44, 2021, null, "EQA 300 4MATIC", 2024, { msrp: 55000, range: 426, kw: 100 }],
  [185, 2020, null, "S 580 e", 2024, { fuel: "PHEV", msrp: 125000, range: 900, elec: 100, kw: 60 }, {}, 6],
  [185, 2013, 2020, "S 350 d", 2017, { fuel: "Diesel", msrp: 90000, range: 1200 }],
  [186, 2020, null, "GLA 220d", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 52000, range: 1000 }],
  // ---- Toyota
  [219, 2019, null, "Corolla 2.0 Hybrid", 2024, { msrp: 34500 }],
  [219, 2012, 2018, "Auris Hybrid", 2016, { msrp: 24500, range: 900 }],
  [218, 2020, null, "GR Yaris", 2024, { fuel: "Petrol", tr: "Manual", seats: 4, msrp: 38000, range: 600, boot: 174 }, { v: -1, r: -1, p: -1.5 }],
  [218, 2011, 2020, "Yaris Hybrid", 2017, { msrp: 20500, range: 950 }],
  [46, 2018, null, "RAV4 Plug-in Hybrid", 2024, { fuel: "PHEV", msrp: 52000, elec: 75, kw: 3 }, {}, 4.5],
  [46, 2012, 2018, "RAV4 Hybrid", 2016, { msrp: 34500 }],
  [120, 2016, 2023, "C-HR Hybrid", 2019, { msrp: 28500 }],
  [151, 2023, null, "Prius Plug-in Hybrid", 2024, { fuel: "PHEV", msrp: 40000, elec: 86, kw: 11 }, {}, 5],
  [151, 2015, 2023, "Prius Hybrid", 2018, { msrp: 29000 }],
  [211, 2009, 2024, "Land Cruiser 2.8 D-4D", 2018, { msrp: 58000 }],
  [136, 2022, null, "bZ4X AWD", 2024, { msrp: 57000, range: 411, kw: 150 }],
  [64, 2020, null, "Yaris Cross AWD-i", 2024, { msrp: 31500 }],
  // ---- Ford
  [115, 2018, null, "Focus ST", 2024, { tr: "Manual", msrp: 38500, range: 700 }, PERF],
  [115, 2018, null, "Focus 1.5 EcoBlue", 2024, { fuel: "Diesel", msrp: 31500, range: 1100 }],
  [115, 2011, 2018, "Focus 1.0 EcoBoost", 2016, { msrp: 20500 }],
  [201, 2008, 2017, "Fiesta 1.0 EcoBoost", 2015, { msrp: 15500 }],
  [67, 2019, null, "Kuga 1.5 EcoBoost", 2024, { fuel: "Petrol", tr: "Manual", msrp: 33500, range: 850 }],
  [67, 2012, 2019, "Kuga 2.0 TDCi", 2016, { fuel: "Diesel", tr: "Manual", msrp: 30000, range: 1000 }],
  [71, 2019, null, "Puma ST", 2024, { tr: "Manual", msrp: 32500, range: 700 }, PERF],
  [42, 2020, null, "Mustang Mach-E RWD Standard Range", 2024, { msrp: 46000, range: 440, kw: 115 }],
  [42, 2020, null, "Mustang Mach-E GT", 2024, { msrp: 73000, range: 490, kw: 150 }, { v: -1 }],
  [203, 2006, 2015, "Galaxy 2.0 TDCi", 2013, { msrp: 32000 }],
  // ---- Hyundai
  [35, 2021, null, "Ioniq 5 AWD 84 kWh", 2024, { msrp: 56000, range: 481, kw: 240 }],
  [35, 2021, null, "Ioniq 5 N", 2024, { msrp: 75000, range: 448, kw: 240 }, { v: -1.5 }],
  [107, 2020, null, "Tucson 1.6 T-GDI", 2024, { fuel: "Petrol", tr: "Manual", msrp: 34000, range: 800 }],
  [107, 2020, null, "Tucson Plug-in Hybrid", 2024, { fuel: "PHEV", msrp: 48000, elec: 62, kw: 7 }, {}, 4.5],
  [107, 2015, 2020, "Tucson 1.6 CRDi", 2018, { fuel: "Diesel", tr: "Manual", msrp: 30000, range: 950 }],
  [246, 2016, null, "i30 N", 2024, { tr: "Manual", msrp: 40000, range: 650 }, PERF],
  [150, 2020, null, "i20 N", 2024, { tr: "Manual", msrp: 30000, range: 600 }, PERF],
  [77, 2023, null, "Kona Electric 48 kWh", 2024, { msrp: 37000, range: 377, kw: 100 }],
  [77, 2017, 2023, "Kona Electric 64 kWh", 2020, { msrp: 41000, range: 484, kw: 100 }],
  // ---- Peugeot
  [87, 2019, null, "e-208 GT", 2024, { fuel: "Electric", tr: "Automatic", msrp: 38000, range: 400, kw: 100, boot: 311 }, { r: -1.5 }, 6],
  [87, 2012, 2019, "208 1.2 PureTech", 2016, { msrp: 15500 }],
  [48, 2021, null, "308 PureTech 130", 2024, { fuel: "Petrol", tr: "Automatic", msrp: 31000, range: 800 }],
  [48, 2021, null, "308 BlueHDi 130", 2024, { fuel: "Diesel", msrp: 33000, range: 1100 }],
  [48, 2013, 2021, "308 1.2 PureTech", 2017, { fuel: "Petrol", msrp: 22500, range: 800 }],
  [74, 2024, null, "3008 Plug-in Hybrid", 2024, { fuel: "PHEV", msrp: 46000, range: 900, elec: 83, kw: 7 }, {}, 4.5],
  [74, 2016, 2024, "3008 BlueHDi 130", 2019, { fuel: "Diesel", msrp: 33000, range: 1100 }],
  [238, 2024, null, "e-3008 Long Range", 2024, { msrp: 56000, range: 700, kw: 160 }],
  [213, 2013, 2019, "2008 1.2 PureTech", 2016, { fuel: "Petrol", msrp: 19500 }],
  [145, 2017, 2024, "5008 BlueHDi 130", 2019, { msrp: 36000 }],
  // ---- Renault
  [75, 2019, null, "Clio TCe 90", 2024, { fuel: "Petrol", tr: "Manual", msrp: 19500, range: 800 }],
  [75, 2012, 2019, "Clio 0.9 TCe", 2016, { fuel: "Petrol", tr: "Manual", msrp: 14500, range: 800 }],
  [85, 2019, null, "Captur TCe 140", 2024, { fuel: "Petrol", msrp: 28000, range: 800 }],
  [85, 2013, 2019, "Captur 0.9 TCe", 2016, { fuel: "Petrol", msrp: 17500, range: 800 }],
  [43, 2022, null, "Megane E-Tech 130", 2024, { msrp: 37000, range: 300, kw: 85 }],
  [43, 2016, 2022, "Megane 1.3 TCe", 2019, { fuel: "Petrol", tr: "Manual", msrp: 24000, range: 800, kw: 0 }, { r: 3 }],
  [146, 2023, null, "Scenic E-Tech 60 kWh", 2024, { msrp: 42000, range: 420, kw: 130 }],
  [116, 2022, null, "Austral Mild Hybrid 160", 2024, { msrp: 34000, range: 900 }],
  [51, 2024, null, "5 E-Tech Techno 52 kWh", 2025, { msrp: 33000, range: 410, kw: 100 }],
  // ---- Škoda
  [72, 2020, null, "Octavia Combi 2.0 TDI", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 34500, range: 1200 }],
  [72, 2020, null, "Octavia Combi iV", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 39000, range: 1000, elec: 60, kw: 3 }, {}, 4.5],
  [72, 2020, null, "Octavia RS", 2024, { tr: "Automatic", msrp: 44000, range: 750 }, PERF],
  [72, 2012, 2020, "Octavia Combi 1.4 TSI", 2016, { msrp: 20500 }],
  [139, 2024, null, "Superb Combi iV", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 52000, range: 1000, elec: 100, kw: 50 }, {}, 5],
  [139, 2015, 2024, "Superb Combi 2.0 TDI", 2019, { msrp: 36000 }],
  [215, 2016, 2024, "Kodiaq 2.0 TDI", 2019, { fuel: "Diesel", seats: 7, msrp: 38000, range: 1000 }],
  [37, 2020, null, "Enyaq 60", 2024, { msrp: 39500, range: 400, kw: 120 }],
  [37, 2020, null, "Enyaq Coupe RS", 2024, { msrp: 58000, range: 530, kw: 185 }, { v: -1 }],
  [158, 2017, null, "Karoq 2.0 TDI", 2024, { fuel: "Diesel", msrp: 33500, range: 1000 }],
  [109, 2014, 2021, "Fabia 1.0 TSI", 2018, { msrp: 14500 }],
  [56, 2024, null, "Elroq 60", 2025, { msrp: 35000, range: 375, kw: 165 }],
];

const clamp = (n: number, lo = 1, hi = 10) => Math.min(hi, Math.max(lo, n));
const r1 = (n: number) => Math.round(n * 10) / 10;

function cleanFamily(name: string): string {
  return name
    .replace(/^Mercedes-Benz\s+/i, "")
    .replace(/\s+(Mk\d+|G\d{2}|(second|third|fourth|fifth|sixth) generation)$/i, "")
    .replace(/^Golf GTI$/i, "Golf")
    .trim();
}

// deterministic pseudo-random so reruns produce the same demo data
let seed = 20260919;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

const MOCK_PLATFORMS: Record<string, { url: string; cities: string[] }> = {
  mobile_de: { url: "https://www.mobile.de", cities: ["Berlin", "München", "Hamburg", "Köln"] },
  autoscout24: { url: "https://www.autoscout24.com", cities: ["Wien", "Antwerpen", "Bruxelles", "Stuttgart"] },
  lacentrale: { url: "https://www.lacentrale.fr", cities: ["Paris", "Lyon", "Lille", "Bordeaux"] },
  marktplaats: { url: "https://www.marktplaats.nl", cities: ["Amsterdam", "Utrecht", "Rotterdam"] },
  otomoto: { url: "https://www.otomoto.pl", cities: ["Warszawa", "Kraków", "Poznań"] },
  coches_net: { url: "https://www.coches.net", cities: ["Madrid", "Barcelona", "Valencia"] },
  autoscout24_it: { url: "https://www.autoscout24.it", cities: ["Milano", "Roma", "Torino"] },
};
const COLORS = ["White", "Black", "Grey", "Silver", "Blue", "Red"];
const NOW = 2026;

async function main() {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  await c.query("BEGIN");

  const rows = (await c.query(
    `SELECT m.*, b.display_name AS brand, b.slug AS brand_slug, f.name AS fam_name
       FROM car_models m JOIN brands b ON b.id=m.brand_id JOIN model_families f ON f.id=m.family_id
      WHERE b.display_name = ANY($1)`, [BRANDS])).rows;
  const byId = new Map<number, any>(rows.map((r) => [r.id, r]));

  const famCache = new Map<string, number>();
  const famId = async (brandId: number, brandSlug: string, name: string) => {
    const slug = `${brandSlug}-${slugify(name)}`;
    if (famCache.has(slug)) return famCache.get(slug)!;
    const r = await c.query(
      `INSERT INTO model_families (brand_id, slug, name) VALUES ($1,$2,$3)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name RETURNING id`, [brandId, slug, name]);
    famCache.set(slug, r.rows[0].id);
    return r.rows[0].id as number;
  };
  const genId = async (family: number, from: number, to: number | null) => {
    const label = to ? `${from}–${to}` : `${from}+`;
    const r = await c.query(
      `INSERT INTO generations (family_id, label, year_from, year_to) VALUES ($1,$2,$3,$4)
       ON CONFLICT (family_id, label) DO UPDATE SET year_from=EXCLUDED.year_from, year_to=EXCLUDED.year_to RETURNING id`,
      [family, label, from, to]);
    return r.rows[0].id as number;
  };

  // 1. normalise existing rows
  let relinked = 0;
  for (const r of rows) {
    const from = GEN_FROM[r.id];
    if (!from) { console.log("no generation year for", r.id, r.display_name); continue; }
    const fam = await famId(r.brand_id, r.brand_slug, cleanFamily(r.fam_name));
    const gen = await genId(fam, from, null);
    await c.query("UPDATE car_models SET family_id=$1, generation_id=$2 WHERE id=$3", [fam, gen, r.id]);
    r.family_id = fam;
    relinked++;
  }

  // 2. variants + 3. demo listings
  let added = 0, listingsAdded = 0;
  for (const [vi, v] of VARIANTS.entries()) {
    const [baseId, from, to, trim, year, o, d = {}, chargeScore] = v;
    const b = byId.get(baseId);
    if (!b) throw new Error(`unknown base id ${baseId}`);
    const old = to !== null;
    const display = old ? `${trim} (${from}–${to})` : trim;
    const exists = await c.query("SELECT id FROM car_models WHERE brand_id=$1 AND display_name=$2", [b.brand_id, display]);
    let carId: number;
    if (exists.rows.length) {
      carId = exists.rows[0].id;
    } else {
      const num = (x: any) => Number(x);
      const fuel = o.fuel ?? b.fuel_type;
      const msrp = o.msrp ?? b.msrp_eur;
      const range = o.range ?? b.range_km;
      const boot = o.boot ?? b.boot_litres;
      const isEv = fuel === "Electric";
      const baseEv = b.fuel_type === "Electric";
      // range score follows the range figure only when both rows use the same energy type
      const rangeDelta = isEv !== baseEv ? 0
        : isEv ? ((range - b.range_km) / 100) * 0.5
        : (range - b.range_km) / 250 + (fuel === "PHEV" && b.fuel_type !== "PHEV" ? 0.5 : 0);
      const valueDelta = -clamp((msrp / b.msrp_eur - 1) * 3, -2, 2) + (old ? 0.5 : 0);
      const sc = {
        range: r1(clamp(num(b.score_range) + rangeDelta + (d.r ?? 0))),
        safety: r1(clamp(num(b.score_safety) - (old ? 0.4 : 0) + (d.s ?? 0))),
        practicality: r1(clamp(num(b.score_practicality) + ((boot - b.boot_litres) / 100) * 0.3 + (d.p ?? 0))),
        tech: r1(clamp(num(b.score_tech) - (old ? 1.2 : 0) + (d.t ?? 0))),
        reliability: r1(clamp(num(b.score_reliability) + (d.rel ?? 0))),
        value: r1(clamp(num(b.score_value) + valueDelta + (d.v ?? 0))),
      };
      let charging: number | null = null;
      let kw = 0;
      if (isEv) {
        kw = o.kw ?? b.charge_kw ?? 0;
        charging = b.score_charging != null ? r1(clamp(num(b.score_charging) + ((kw - b.charge_kw) / 100) * 0.5)) : chargeScore ?? 5;
      } else if (fuel === "PHEV") {
        kw = o.kw ?? b.charge_kw ?? 0;
        charging = chargeScore ?? 4.5;
      }
      const elec = fuel === "PHEV" ? o.elec ?? b.electric_range_km ?? null : null;
      const ins = await c.query(
        `INSERT INTO car_models (brand_id, slug, display_name, full_name, body_type, fuel_type, transmission, seats, msrp_eur,
            range_km, electric_range_km, boot_litres, charge_kw, ncap_stars, model_year, brand_color, badge_label, wikipedia_query,
            score_range, score_safety, score_practicality, score_tech, score_reliability, score_value, score_charging,
            is_active, family_id, generation_id, trim)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NULL,$17,$18,$19,$20,$21,$22,$23,$24,true,$25,$26,$27)
         ON CONFLICT (slug) DO NOTHING RETURNING id`,
        [
          b.brand_id, `${b.brand_slug}-${slugify(display)}-${from}`, display, `${b.brand} ${display}`, b.body_type, fuel,
          o.tr ?? b.transmission, o.seats ?? b.seats, msrp, range, elec, boot, kw, o.ncap ?? b.ncap_stars, year, b.brand_color,
          b.wikipedia_query, sc.range, sc.safety, sc.practicality, sc.tech, sc.reliability, sc.value, charging,
          b.family_id, await genId(b.family_id, from, to), trim,
        ]);
      if (!ins.rows.length) { console.log("slug clash, skipped:", display); continue; }
      carId = ins.rows[0].id;
      added++;
    }

    const have = await c.query("SELECT count(*) FROM listings WHERE car_model_id=$1", [carId]);
    if (Number(have.rows[0].count) > 0) continue;
    const car = (await c.query("SELECT msrp_eur, transmission FROM car_models WHERE id=$1", [carId])).rows[0];
    const platforms = Object.keys(MOCK_PLATFORMS).sort(() => rnd() - 0.5).slice(0, 4);
    for (const [i, pid] of platforms.entries()) {
      const top = Math.min(to ?? NOW, NOW);
      const ly = old ? Math.max(from, top - 1 - i * 2 - Math.floor(rnd() * 2)) : Math.max(from, year - i - (rnd() < 0.4 ? 1 : 0));
      const age = NOW - ly;
      const mileage = Math.round((age * (11000 + rnd() * 8000)) / 100) * 100;
      const price = Math.round((car.msrp_eur * Math.max(0.22, Math.pow(0.87, age)) * (1 - mileage / 450000) * (0.94 + rnd() * 0.12)) / 100) * 100;
      const p = MOCK_PLATFORMS[pid];
      await c.query(
        `INSERT INTO listings (external_id, platform_id, car_model_id, title, url, price_eur, year, mileage_km, condition, transmission, city, exterior_color, is_active, raw_data)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true,$13)
         ON CONFLICT (platform_id, external_id) DO NOTHING`,
        [`mock:trim:${vi}:${i}`, pid, carId, `${b.brand} ${display}`, p.url, price, ly, mileage, mileage < 500 && age <= 1 ? "New" : "Used",
         car.transmission, pick(p.cities), pick(COLORS), JSON.stringify({ source: "mock" })]);
      listingsAdded++;
    }
  }

  // 4. drop now-empty generations/families
  const g = await c.query(`DELETE FROM generations g WHERE NOT EXISTS (SELECT 1 FROM car_models m WHERE m.generation_id=g.id) RETURNING 1`);
  const f = await c.query(`DELETE FROM model_families f WHERE NOT EXISTS (SELECT 1 FROM car_models m WHERE m.family_id=f.id)
                            AND NOT EXISTS (SELECT 1 FROM generations g WHERE g.family_id=f.id) RETURNING 1`);
  await c.query("COMMIT");
  console.log(`relinked=${relinked} added=${added} listings=${listingsAdded} removed empty generations=${g.rowCount} families=${f.rowCount}`);
  await c.end();
}

main().catch((e) => { console.error(e.message); process.exit(1); });
