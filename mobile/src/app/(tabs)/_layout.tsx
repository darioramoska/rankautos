// Real native tab bar (UITabBarController on iOS / BottomNavigationView on Android) via
// Expo Router's NativeTabs, not a JS-drawn overlay. This is what gives genuine iOS 26
// Liquid Glass rendering and instant native tab switching (no push/pop slide animation
// between tabs) — the "smooth like Apple" behavior a custom component can only approximate.
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { colors, fonts } from "../../lib/theme";


export default function TabsLayout() {
  return (
    <NativeTabs
      tintColor={colors.grad2}
      iconColor={{ default: colors.mid, selected: colors.grad2 }}
      labelStyle={{ fontFamily: fonts.semibold, fontSize: 11 }}
      blurEffect="systemChromeMaterial"
      backgroundColor="rgba(124,58,237,0.14)"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="house" md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="filters">
        <NativeTabs.Trigger.Icon sf="slider.horizontal.3" md="filter_list" />
        <NativeTabs.Trigger.Label>Filters</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="results">
        <NativeTabs.Trigger.Icon sf="list.number" md="format_list_numbered" />
        <NativeTabs.Trigger.Label>Rankings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
