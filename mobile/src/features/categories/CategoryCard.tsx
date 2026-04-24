import { Pressable, StyleSheet, Text, View } from "react-native";
import { categoryIcons } from "../../constants/category-options";
import type { Category } from "./types";
import { palette } from "../../theme/palette";
import { SymbolIcon } from "../../components/SymbolIcon";

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const icon = categoryIcons.find((item) => item.key === category.icon)?.symbol ?? "⋯";

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
        <SymbolIcon symbol={icon} size={20} color={category.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{category.name}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.iconButton}>
          <SymbolIcon symbol="✎" size={16} color={palette.textSecondary} />
        </Pressable>
        <Pressable onPress={onDelete} style={styles.iconButton}>
          <SymbolIcon symbol="🗑" size={15} color={palette.danger} />
        </Pressable>
      </View>
    </View>
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
    fontWeight: "700",
    color: palette.textPrimary,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FBF8",
  },
});
