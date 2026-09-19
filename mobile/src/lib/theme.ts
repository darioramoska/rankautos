// Design tokens — hex/RN equivalents of web/src/app/globals.css custom properties.
// React Native has no CSS custom properties or oklch(), so this file is the single
// source of truth for color/spacing tokens across the app (mirrors the web app's :root vars).

export const colors = {
  bg: "#f6f4fb",
  surface: "#ffffff",
  ink: "#1c1330",
  mid: "#6e6687",
  border: "#e7e2f5",

  grad1: "#3d1f8f",
  grad2: "#7c3aed",
  grad3: "#c026d3",
  warm1: "#fb7a54",
  warm2: "#f6a15a",

  accent: "#c026d3",
  accentLight: "#f6e4fb",

  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  warm: "#f2874d",

  white: "#ffffff",
} as const;

export const gradientBrand = [colors.grad2, colors.grad3] as const; // 135deg grad2 -> grad3
export const gradientHero = [colors.grad2, colors.grad1, "#190a3e"] as const; // approximates the radial hero
export const gradientWarmBlob = [colors.warm1, colors.warm2] as const;
export const gradientText = ["#f6b6ff", colors.warm2] as const;

// Soft lavender-tinted "glass" icon tiles (for use on light surfaces, e.g. behind filter icons)
export const gradientTileSoft = ["#f1e9fd", "#fbe7f8"] as const;
export const gradientTileSoftActive = ["#e2cdfb", "#f8cdf1"] as const;
export const tileSoftBorder = "#eee0fb";
export const tileSoftActiveBorder = "#d7b3f7";

export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  full: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: "#3c1e6e",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLg: {
    shadowColor: "#3c1e6e",
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  glow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} as const;

// Space Grotesk weights loaded via @expo-google-fonts/space-grotesk (see src/app/_layout.tsx)
export const fonts = {
  regular: "SpaceGrotesk_400Regular",
  medium: "SpaceGrotesk_500Medium",
  semibold: "SpaceGrotesk_600SemiBold",
  bold: "SpaceGrotesk_700Bold",
} as const;
