// Extracted from the old HomeScreen footer. Now lives on Profile > Disclaimer.
import React from "react";
import { StyleSheet, Text } from "react-native";
import { colors, fonts } from "../../lib/theme";

export function Disclaimer() {
  return (
    <Text style={styles.disclaimer}>
      <Text style={styles.disclaimerStrong}>Disclaimer: </Text>
      RankAutos is a car research and comparison tool only. We do not sell, trade or broker vehicles, and we are
      not a party to any purchase transaction. All listings are sourced from independent third-party platforms
      (AutoScout24, mobile.de, Otomoto, etc.). Prices, availability and listing details may change at any time
      without notice. RankAutos accepts no responsibility or liability for the accuracy of third-party data, or
      for any transaction you enter into with a seller. Always verify all details directly with the seller before
      making any purchase.
    </Text>
  );
}

const styles = StyleSheet.create({
  disclaimer: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 21, color: colors.mid },
  disclaimerStrong: { fontFamily: fonts.bold, color: colors.ink },
});
