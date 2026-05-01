import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createExpense, listExpenses } from "../api/expenses";
import { listCategories } from "../api/categories";
import { SymbolIcon } from "../components/SymbolIcon";
import { ExpenseCard } from "../features/expenses/ExpenseCard";
import { ExpenseFormSheet } from "../features/expenses/ExpenseFormSheet";
import {
  formatCurrency,
  formatMonthLabel,
  getCurrentMonthValue,
} from "../features/expenses/formatters";
import type { Expense, ExpensePayload } from "../features/expenses/types";
import type { Category } from "../features/categories/types";
import { palette } from "../theme/palette";

type DashboardNavigation = {
  navigate: (screen: "ExpensesList" | "ExpenseDetail", params?: { expenseId: string }) => void;
};

export function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigation>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const month = getCurrentMonthValue();

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const [expensesData, categoriesData] = await Promise.all([
        listExpenses({ month }),
        listCategories(),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar gastos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [month]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recentExpenses = expenses.slice(0, 5);

  async function handleCreate(payload: ExpensePayload) {
    setSubmitting(true);

    try {
      const createdExpense = await createExpense(payload);
      if (createdExpense.date.startsWith(month)) {
        setExpenses((current) => [createdExpense, ...current]);
      }
      setIsCreateOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadData(true)} />}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spending</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(total)}</Text>
          <Text style={styles.summaryMonth}>{formatMonthLabel(month)}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <Pressable onPress={() => navigation.navigate("ExpensesList")} style={styles.viewAllButton}>
            <Text style={styles.viewAllLabel}>View All</Text>
          </Pressable>
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
            <Text style={styles.loadingText}>Cargando gastos...</Text>
          </View>
        ) : recentExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <SymbolIcon symbol="$" size={24} color={palette.primary} />
            </View>
            <Text style={styles.emptyTitle}>Todavía no hay gastos</Text>
            <Pressable onPress={() => setIsCreateOpen(true)} style={styles.emptyButton}>
              <Text style={styles.emptyButtonLabel}>Add expense</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {recentExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onPress={() => navigation.navigate("ExpenseDetail", { expenseId: expense.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        accessibilityLabel="Nuevo gasto"
        accessibilityRole="button"
        onPress={() => setIsCreateOpen(true)}
        style={styles.floatingButton}
      >
        <SymbolIcon symbol="+" size={28} color="#FFFFFF" />
      </Pressable>

      <ExpenseFormSheet
        visible={isCreateOpen}
        mode="create"
        categories={categories}
        onClose={() => {
          if (!submitting) {
            setIsCreateOpen(false);
          }
        }}
        onSubmit={handleCreate}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 96,
  },
  summaryCard: {
    backgroundColor: palette.primary,
    borderRadius: 34,
    paddingHorizontal: 22,
    paddingVertical: 24,
    minHeight: 134,
    justifyContent: "center",
    marginBottom: 22,
  },
  summaryLabel: {
    color: "#D8F2E6",
    fontSize: 13,
    fontWeight: "800",
  },
  summaryAmount: {
    marginTop: 6,
    color: "#FFFFFF",
    fontSize: 33,
    fontWeight: "900",
  },
  summaryMonth: {
    marginTop: 7,
    color: "#E9FFF4",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  sectionHeader: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: palette.textPrimary,
  },
  viewAllButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  viewAllLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: palette.primary,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 52,
    gap: 12,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: palette.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  emptyButton: {
    backgroundColor: palette.primary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  emptyButtonLabel: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  list: {
    gap: 12,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10251A",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
