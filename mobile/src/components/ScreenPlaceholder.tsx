import { StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/palette";
import { SymbolIcon } from "./SymbolIcon";

interface ScreenPlaceholderProps {
  title: string;
  description: string;
  icon: string;
}

export function ScreenPlaceholder({ title, description, icon }: ScreenPlaceholderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <SymbolIcon symbol={icon} size={26} color={palette.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
    backgroundColor: palette.background,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.primarySoft,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: palette.textSecondary,
    textAlign: "center",
  },
});
