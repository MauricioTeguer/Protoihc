import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { palette } from "../theme/palette";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  style?: StyleProp<ViewStyle>;
}

export function ActionButton({
  label,
  onPress,
  variant = "primary",
  style,
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" && styles.primaryLabel,
          variant === "secondary" && styles.secondaryLabel,
          variant === "danger" && styles.dangerLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
  },
  danger: {
    backgroundColor: "#FDEBEC",
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  primaryLabel: {
    color: "#FFFFFF",
  },
  secondaryLabel: {
    color: palette.textPrimary,
  },
  dangerLabel: {
    color: palette.danger,
  },
});
