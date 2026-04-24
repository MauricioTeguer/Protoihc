import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

interface SymbolIconProps {
  symbol: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function SymbolIcon({ symbol, size = 18, color = "#10251A", style }: SymbolIconProps) {
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: size,
          lineHeight: size + 2,
          color,
        },
        style,
      ]}
    >
      {symbol}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
