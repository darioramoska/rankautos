// Generation years + extra trims for the brands outside the top 10. Same conventions as top10.ts.
import { PERF, type TrimDataset, type V } from "./types.js";

const brands = ["Alfa Romeo", "Alpine", "BYD", "Cadillac", "Citroën", "Cupra", "Dacia", "DS", "Fiat", "Genesis", "Honda", "Ineos", "Jaguar",
  "Jeep", "Kia", "Lancia", "Land Rover", "Leapmotor", "Lexus", "Lotus", "Maserati", "Mazda", "MG", "Mini", "Nissan", "Omoda", "Opel", "ORA",
  "Polestar", "Porsche", "Seat", "Smart", "Subaru", "Suzuki", "VinFast", "Volvo", "Xpeng"];

const genFrom: Record<number, number> = Object.fromEntries(
  `94:2022 126:2024 289:2017 105:2024 103:2022 132:2022 294:2024
52:2024 89:2020 121:2018 147:2017 204:2020 205:2024 255:2021 256:2018
57:2021 68:2020 266:2024 267:2024 70:2024 242:2020 243:2021 244:2021 245:2025 101:2018 292:2018
53:2025 155:2023 208:2020 209:2015 260:2011 261:2007 104:2021 295:2021
65:2023 152:2022 271:2020 272:2021 159:2022 98:2018 129:2017 282:2016 92:2023 273:2017 274:2014
36:2021 63:2022 66:2021 78:2017 91:2020 108:2018 123:2022 138:2017 149:2019 249:2017 250:2024 251:2023 252:2018
133:2024 124:2019 287:2014 288:2020 135:2020 100:2021 131:2022 283:2018 284:2018 160:2022 164:2022
96:2019 127:2020 153:2019 269:2014 270:2017 59:2022 290:2024 291:2017 93:2024 125:2024 275:2024 276:2024
58:2022 90:2021 122:2019 148:2018 262:2025 263:2022 162:2023 60:2022 156:2020 206:2019 207:2024 257:2022 258:2017 259:2024 163:2021
61:2020 285:2024 286:2024 99:2024 130:2019 280:2017 281:2016 73:2020 157:2017 264:2017 265:2016 102:2022 293:2023
97:2023 128:2022 277:2018 95:2015 154:2024 278:2020 279:2016 161:2023
41:2022 47:2017 54:2023 83:2017 114:2015 142:2018 268:2023 134:2023`
    .split(/\s+/).map((p) => p.split(":").map(Number) as [number, number])
);

const variants: V[] = [
  // ---- Kia
  [36, 2021, null, "EV6 Long Range AWD", 2024, { msrp: 54000, range: 510, kw: 240 }, { v: -0.5 }],
  [36, 2021, null, "EV6 GT", 2024, { msrp: 69000, range: 424, kw: 240 }, { v: -1.5 }],
  [66, 2021, null, "Sportage 1.6 T-GDI", 2024, { fuel: "Petrol", tr: "Manual", msrp: 31000, range: 800 }],
  [66, 2021, null, "Sportage Plug-in Hybrid", 2024, { fuel: "PHEV", msrp: 47000, elec: 70, kw: 7 }, {}, 4.5],
  [66, 2015, 2021, "Sportage 1.7 CRDi", 2018, { fuel: "Diesel", tr: "Manual", msrp: 28000, range: 1000 }],
  [91, 2020, null, "Sorento Plug-in Hybrid", 2024, { fuel: "PHEV", msrp: 58000, elec: 57, kw: 3 }, {}, 4.5],
  [63, 2018, 2022, "e-Niro 64 kWh", 2020, { msrp: 40000, range: 455, kw: 77 }],
  [252, 2012, 2018, "Ceed 1.4", 2016, { msrp: 19000 }],
  [78, 2011, 2017, "Picanto 1.0", 2015, { msrp: 10500 }],
  [250, 2024, null, "EV3 Standard Range", 2024, { msrp: 34000, range: 436, kw: 100 }],
  // ---- Volvo
  [83, 2017, null, "XC40 B4 Mild Hybrid", 2024, { fuel: "Hybrid", tr: "Automatic", msrp: 42000, range: 800, kw: 0 }, { r: 0.5 }],
  [47, 2017, null, "XC60 B5 Mild Hybrid", 2024, { fuel: "Hybrid", tr: "Automatic", msrp: 55000, range: 900 }],
  [47, 2008, 2017, "XC60 D4", 2015, { fuel: "Diesel", msrp: 45000, range: 1100 }],
  [114, 2015, null, "XC90 B5 Mild Hybrid", 2024, { fuel: "Hybrid", tr: "Automatic", msrp: 68000, range: 900 }],
  [114, 2002, 2015, "XC90 D5", 2012, { fuel: "Diesel", msrp: 55000, range: 1000 }],
  [142, 2018, null, "V60 Recharge T6", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 63000, range: 900, elec: 90, kw: 4 }, {}, 4.5],
  [142, 2010, 2018, "V60 D4", 2014, { msrp: 38000 }],
  [41, 2022, null, "EX40 Twin Motor Performance", 2024, { msrp: 56000, range: 540, kw: 200 }, { v: -1 }],
  [54, 2023, null, "EX30 Single Motor", 2024, { msrp: 34000, range: 344, kw: 134 }],
  [54, 2023, null, "EX30 Twin Motor Performance", 2024, { msrp: 47000, range: 460, kw: 153 }, { v: -0.5 }],
  // ---- Honda
  [65, 2023, null, "CR-V Plug-in Hybrid", 2024, { fuel: "PHEV", msrp: 56000, elec: 81, kw: 7 }, {}, 4.5],
  [65, 2018, 2023, "CR-V 1.5 VTEC Turbo", 2020, { fuel: "Petrol", tr: "Manual", msrp: 34000, range: 800 }],
  [152, 2022, null, "Civic Type R", 2024, { fuel: "Petrol", tr: "Manual", msrp: 50000, range: 650 }, PERF],
  [152, 2017, 2022, "Civic 1.0 VTEC Turbo", 2019, { fuel: "Petrol", tr: "Manual", msrp: 26000, range: 750 }],
  // ---- Nissan
  [148, 2018, null, "Leaf e+ 62 kWh", 2024, { msrp: 39000, range: 385, kw: 100 }],
  [148, 2010, 2018, "Leaf 24 kWh", 2015, { msrp: 28000, range: 199, kw: 50 }],
  [90, 2014, 2021, "Qashqai 1.2 DIG-T", 2018, { fuel: "Petrol", tr: "Manual", msrp: 25000, range: 800 }],
  [58, 2022, null, "Ariya 63 kWh", 2024, { msrp: 42000, range: 403, kw: 130 }],
  // ---- Mazda
  [270, 2017, null, "CX-5 2.2 Skyactiv-D", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 37000, range: 1000 }],
  [270, 2012, 2017, "CX-5 2.2 Skyactiv-D", 2015, { fuel: "Diesel", msrp: 30000, range: 1000 }],
  [153, 2013, 2019, "Mazda3 2.0 Skyactiv-G", 2016, { msrp: 22000 }],
  [127, 2020, null, "MX-30 R-EV", 2024, { fuel: "PHEV", msrp: 36000, range: 600, elec: 85, kw: 11 }, { r: 2 }, 4.5],
  // ---- Seat
  [73, 2020, null, "Leon 2.0 TDI", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 30500, range: 1100 }],
  [73, 2020, null, "Leon e-Hybrid", 2024, { fuel: "PHEV", tr: "Automatic", msrp: 38000, range: 950, elec: 60, kw: 3 }, {}, 4.5],
  [73, 2012, 2020, "Leon 1.4 TSI", 2016, { msrp: 20000 }],
  [265, 2016, null, "Ateca 2.0 TDI 4Drive", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 36000, range: 900 }],
  // ---- Cupra
  [57, 2021, null, "Born VZ", 2024, { msrp: 47000, range: 425, kw: 185 }, { v: -1 }],
  [68, 2020, null, "Formentor 1.5 TSI", 2024, { fuel: "Petrol", tr: "Manual", msrp: 39000, range: 800 }],
  [68, 2020, null, "Formentor VZ5", 2024, { fuel: "Petrol", tr: "Automatic", msrp: 58000, range: 650 }, PERF],
  // ---- Opel
  [257, 2015, 2021, "Astra 1.4 Turbo", 2018, { msrp: 22000 }],
  [206, 2019, null, "Corsa Electric", 2024, { fuel: "Electric", tr: "Automatic", msrp: 35000, range: 350, kw: 100, boot: 267 }, { r: -1 }, 6],
  [206, 2014, 2019, "Corsa 1.4", 2017, { msrp: 15000 }],
  [156, 2020, null, "Mokka 1.2 Turbo", 2024, { fuel: "Petrol", tr: "Manual", msrp: 28500, range: 750 }],
  [207, 2024, null, "Grandland Electric", 2025, { fuel: "Electric", tr: "Automatic", msrp: 46000, range: 700, kw: 160 }, { r: -1 }, 5],
  // ---- Citroën
  [205, 2016, 2024, "C3 PureTech 82", 2020, { msrp: 15500 }],
  [121, 2018, null, "C5 Aircross BlueHDi", 2024, { fuel: "Diesel", tr: "Automatic", msrp: 40000, range: 1000 }],
  [89, 2020, null, "C4 PureTech 130", 2024, { fuel: "Petrol", tr: "Automatic", msrp: 27000, range: 800 }],
  [52, 2024, null, "ë-C3 Long Range", 2025, { msrp: 26500, range: 326, kw: 100 }],
  // ---- Fiat
  [209, 2015, null, "Tipo Cross", 2024, { msrp: 23500 }],
  [155, 2023, null, "600 Hybrid", 2024, { fuel: "Hybrid", tr: "Automatic", msrp: 27500, range: 900, kw: 0 }],
  // ---- Dacia
  [70, 2024, null, "Duster Hybrid 140", 2024, { fuel: "Hybrid", tr: "Automatic", msrp: 25500, range: 1000 }],
  [70, 2017, 2024, "Duster 1.5 dCi", 2019, { fuel: "Diesel", msrp: 17500, range: 1100 }],
  [242, 2012, 2020, "Sandero 0.9 TCe", 2017, { msrp: 9500 }],
  // ---- Porsche
  [99, 2024, null, "Macan Turbo Electric", 2024, { msrp: 115000, range: 591, kw: 270 }, { v: -1.5 }],
  [130, 2019, null, "Taycan Turbo S", 2024, { msrp: 200000, range: 510, kw: 320 }, { v: -2 }],
  [280, 2017, null, "Cayenne E-Hybrid", 2024, { fuel: "PHEV", msrp: 100000, range: 800, elec: 90, kw: 11 }, {}, 5],
  [280, 2010, 2017, "Cayenne Diesel", 2014, { fuel: "Diesel", msrp: 78000, range: 1000 }],
  [281, 2016, null, "Panamera 4 E-Hybrid", 2024, { fuel: "PHEV", msrp: 120000, elec: 90, kw: 11 }, {}, 5],
  // ---- Mini
  [275, 2024, null, "Cooper S", 2024, { tr: "Automatic", msrp: 33500, range: 700 }],
  [275, 2013, 2024, "Cooper 1.5", 2019, { msrp: 22000 }],
  [93, 2024, null, "Cooper Electric E", 2024, { msrp: 32000, range: 305, kw: 75 }],
  // ---- Land Rover / Lexus / Alfa / MG / Polestar / Smart / Jeep / Suzuki
  [288, 2020, null, "Defender 110 P400e", 2024, { fuel: "PHEV", msrp: 85000, elec: 43, kw: 7 }, {}, 4.5],
  [100, 2021, null, "NX 450h+", 2024, { fuel: "PHEV", msrp: 62000, elec: 69, kw: 7 }, {}, 4.5],
  [100, 2014, 2021, "NX 300h", 2018, { msrp: 45000 }],
  [131, 2022, null, "RX 500h", 2024, { fuel: "Hybrid", tr: "Automatic", msrp: 80000, range: 800 }, PERF],
  [283, 2018, null, "UX 300e", 2024, { fuel: "Electric", tr: "Automatic", msrp: 50000, range: 315, kw: 50 }, { r: -2.5 }, 4],
  [289, 2017, null, "Stelvio Quadrifoglio", 2024, { fuel: "Petrol", tr: "Automatic", msrp: 95000, range: 600 }, PERF],
  [94, 2022, null, "Tonale 1.5 Hybrid", 2024, { fuel: "Hybrid", tr: "Automatic", msrp: 36500, range: 900, kw: 0 }],
  [59, 2022, null, "MG4 Standard 51 kWh", 2024, { msrp: 29000, range: 350, kw: 117 }],
  [59, 2022, null, "MG4 XPower", 2024, { msrp: 40000, range: 385, kw: 135 }, { v: -1 }],
  [61, 2020, null, "Polestar 2 Long Range Dual Motor", 2024, { msrp: 55000, range: 540, kw: 205 }, { v: -0.7 }],
  [102, 2022, null, "#1 Brabus", 2024, { msrp: 51000, range: 400, kw: 150 }, { v: -1 }],
  [273, 2017, null, "Compass 1.5 e-Hybrid", 2024, { fuel: "Hybrid", tr: "Automatic", msrp: 38000, range: 800, kw: 0 }],
  [154, 2017, 2024, "Swift 1.2 Dualjet", 2019, { fuel: "Petrol", tr: "Manual", msrp: 15500, range: 750 }],
];

export const more: TrimDataset = { brands, genFrom, variants };
