import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolIcon } from "../../components/SymbolIcon";
import { categoryIcons } from "../../constants/category-options";
import { palette } from "../../theme/palette";
import { formatCurrency, formatDate } from "./formatters";
import type { Expense } from "./types";

interface ExpenseCardProps {
  expense: Expense;
  onPress: () => void;
}

export function ExpenseCard({ expense, onPress }: ExpenseCardProps) {
  const icon = categoryIcons.find((item) => item.key === expense.category.icon)?.symbol ?? "⋯";

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.iconContainer, { backgroundColor: `${expense.category.color}20` }]}>
        <SymbolIcon symbol={icon} size={20} color={expense.category.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{expense.category.name}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatDate(expense.date)}
          {expense.note ? ` · ${expense.note}` : ""}
        </Text>
      </View>

      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: "#10251A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.88,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: palette.textSecondary,
  },
  amount: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "800",
    color: palette.textPrimary,
  },
});
