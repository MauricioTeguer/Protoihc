import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { deleteExpense, getExpense, updateExpense } from "../api/expenses";
import { listCategories } from "../api/categories";
import { ActionButton } from "../components/ActionButton";
import { SymbolIcon } from "../components/SymbolIcon";
import { categoryIcons } from "../constants/category-options";
import { DeleteExpenseAlert } from "../features/expenses/DeleteExpenseAlert";
import { ExpenseFormSheet } from "../features/expenses/ExpenseFormSheet";
import { formatCurrency, formatDate } from "../features/expenses/formatters";
import type { Expense, ExpensePayload } from "../features/expenses/types";
import type { Category } from "../features/categories/types";
import { palette } from "../theme/palette";

type ExpenseStackParamList = {
  ExpenseDetail: {
    expenseId: string;
  };
};

type ExpenseDetailNavigation = {
  goBack: () => void;
};

export function ExpenseDetailScreen() {
  const navigation = useNavigation<ExpenseDetailNavigation>();
  const route = useRoute<RouteProp<ExpenseStackParamList, "ExpenseDetail">>();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [expenseData, categoriesData] = await Promise.all([
        getExpense(route.params.expenseId),
        listCategories(),
      ]);
      setExpense(expenseData);
      setCategories(categoriesData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el gasto");
    } finally {
      setLoading(false);
    }
  }, [route.params.expenseId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleUpdate(payload: ExpensePayload) {
    if (!expense) {
      return;
    }

    setSubmitting(true);

    try {
      const updatedExpense = await updateExpense(expense.id, payload);
      setExpense(updatedExpense);
      setIsEditOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!expense) {
      return;
    }

    try {
      setDeleting(true);
      await deleteExpense(expense.id);
      setIsDeleteOpen(false);
      navigation.goBack();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el gasto");
    } finally {
      setDeleting(false);
    }
  }

  const icon = expense
    ? categoryIcons.find((item) => item.key === expense.category.icon)?.symbol ?? "⋯"
    : "⋯";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <SymbolIcon symbol="‹" size={26} color={palette.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Expense Detail</Text>
          <View style={styles.headerSpacer} />
        </View>

        {error ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>No se pudo completar la acción</Text>
            <Text style={styles.feedbackDescription}>{error}</Text>
            <Pressable onPress={() => void loadData()} style={styles.retryButton}>
              <Text style={styles.retryButtonLabel}>Reintentar</Text>
            </Pressable>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.loadingText}>Cargando detalle...</Text>
          </View>
        ) : expense ? (
          <>
            <View style={styles.amountCard}>
              <View style={[styles.iconContainer, { backgroundColor: `${expense.category.color}20` }]}>
                <SymbolIcon symbol={icon} size={26} color={expense.category.color} />
              </View>
              <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
              <Text style={styles.category}>{expense.category.name}</Text>
            </View>

            <View style={styles.detailList}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{expense.category.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatDate(expense.date)}</Text>
              </View>
              <View style={styles.noteBlock}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.noteValue}>{expense.note || "Sin notas"}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <ActionButton label="Edit" onPress={() => setIsEditOpen(true)} style={styles.actionButton} />
              <ActionButton
                label="Delete"
                variant="danger"
                onPress={() => setIsDeleteOpen(true)}
                style={styles.actionButton}
              />
            </View>
          </>
        ) : null}
      </ScrollView>

      <ExpenseFormSheet
        visible={isEditOpen}
        mode="edit"
        expense={expense}
        categories={categories}
        onClose={() => {
          if (!submitting) {
            setIsEditOpen(false);
          }
        }}
        onSubmit={handleUpdate}
      />

      <DeleteExpenseAlert
        visible={isDeleteOpen}
        deleting={deleting}
        onCancel={() => {
          if (!deleting) {
            setIsDeleteOpen(false);
          }
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  header: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  feedbackCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "#FFF2F3",
    borderWidth: 1,
    borderColor: "#FFD6D9",
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.danger,
  },
  feedbackDescription: {
    marginTop: 8,
    color: palette.textSecondary,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryButtonLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 52,
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  amountCard: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 24,
    marginBottom: 16,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  amount: {
    marginTop: 18,
    fontSize: 36,
    fontWeight: "900",
    color: palette.textPrimary,
  },
  category: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    color: palette.textSecondary,
  },
  detailList: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: "hidden",
  },
  detailRow: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EE",
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: palette.textSecondary,
  },
  detailValue: {
    flex: 1,
    marginLeft: 16,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  noteBlock: {
    padding: 16,
    gap: 8,
  },
  noteValue: {
    fontSize: 15,
    lineHeight: 21,
    color: palette.textPrimary,
  },
  actions: {
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
