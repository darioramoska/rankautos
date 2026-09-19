// Ported from web/src/components/ScoreBadge.tsx — same circumference math, react-native-svg ring.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { scoreColor } from "../lib/scoring";
import { fonts } from "../lib/theme";

export function ScoreBadge({ score, size = 56 }: { score: number; size?: number }) {
  const col = scoreColor(score);
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const strokeW = size < 44 ? 3 : 4;
  const dash = (score / 10) * circ;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col + "22"} strokeWidth={strokeW} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={strokeW}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.center}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: size < 44 ? 10 : size < 60 ? 13 : 16,
              color: col,
            }}
          >
            {score.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
