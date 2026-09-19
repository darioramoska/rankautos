// Ported from web/src/components/CarImage.tsx — same Wikipedia pageimages fetch + in-memory
// cache, falling back to a colored SVG silhouette (react-native-svg instead of raw <svg>).
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import type { CarModel } from "../lib/types";
import { colors, fonts, radius } from "../lib/theme";

const wikiCache: Record<string, string | false | null> = {};

function useWikiImage(query: string) {
  const [url, setUrl] = useState<string | null>(
    typeof wikiCache[query] === "string" ? (wikiCache[query] as string) : null,
  );

  useEffect(() => {
    if (!query) return;
    if (wikiCache[query] !== undefined) {
      setUrl(wikiCache[query] || null);
      return;
    }
    wikiCache[query] = null; // mark as in-flight
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        query,
      )}&prop=pageimages&format=json&pithumbsize=500&origin=*`,
    )
      .then((r) => r.json())
      .then((data) => {
        const pages = data?.query?.pages || {};
        const page = pages[Object.keys(pages)[0]];
        const src: string | false = page?.thumbnail?.source || false;
        wikiCache[query] = src;
        if (src) setUrl(src);
      })
      .catch(() => {
        wikiCache[query] = false;
      });
  }, [query]);

  return url;
}

export function CarImage({ car, w, h }: { car: CarModel; w: number; h: number }) {
  const url = useWikiImage(car.wikiQuery);
  const [failed, setFailed] = useState(false);

  if (url && !failed) {
    return (
      <View style={[styles.imgWrap, { width: w, height: h }]}>
        <Image
          source={{ uri: url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.tile, { width: w, height: h }]}>
      <Svg width={w * 0.6} height={h * 0.5} viewBox="0 0 100 55">
        <Rect x={5} y={25} width={90} height={22} rx={4} fill={car.color} opacity={0.18} />
        <Rect x={18} y={10} width={64} height={20} rx={6} fill={car.color} opacity={0.28} />
        <Circle cx={22} cy={47} r={8} fill={car.color} opacity={0.32} />
        <Circle cx={22} cy={47} r={4} fill={car.color} opacity={0.5} />
        <Circle cx={78} cy={47} r={8} fill={car.color} opacity={0.32} />
        <Circle cx={78} cy={47} r={4} fill={car.color} opacity={0.5} />
      </Svg>
      <Text style={styles.brandLabel}>{car.brand}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imgWrap: {
    borderRadius: radius.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#f0ede9",
  },
  tile: {
    borderRadius: radius.sm,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  brandLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    textTransform: "uppercase",
    color: colors.mid,
    letterSpacing: 1,
    marginTop: 4,
  },
});
