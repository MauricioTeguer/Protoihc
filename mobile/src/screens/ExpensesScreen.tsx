import { useCallback, useEffect, useMemo, useState } from "react";
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
import { DatePickerField } from "../features/expenses/DatePickerField";
import {
  formatCurrency,
  formatMonthLabel,
  getCurrentMonthValue,
  shiftMonth,
} from "../features/expenses/formatters";
import type { Expense, ExpenseFilters, ExpensePayload } from "../features/expenses/types";
import type { Category } from "../features/categories/types";
import { palette } from "../theme/palette";

type ExpensesNavigation = {
  navigate: (screen: "ExpenseDetail", params: { expenseId: string }) => void;
  goBack: () => void;
};

export function ExpensesScreen() {
  const navigation = useNavigation<ExpensesNavigation>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [month, setMonth] = useState(getCurrentMonthValue());
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const hasRangeFilter = Boolean(startDate || endDate);
  const hasActiveFilters = Boolean(selectedCategoryId || hasRangeFilter);

  const filters = useMemo<ExpenseFilters>(() => {
    if (hasRangeFilter) {
      return {
        categoryId: selectedCategoryId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
    }

    return {
      month,
      categoryId: selectedCategoryId || undefined,
    };
  }, [endDate, hasRangeFilter, month, selectedCategoryId, startDate]);

  const loadData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
        const [expensesData, categoriesData] = await Promise.all([listExpenses(filters), listCategories()]);
        setExpenses(expensesData);
        setCategories(categoriesData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar gastos");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);

  async function handleCreate(payload: ExpensePayload) {
    setSubmitting(true);

    try {
      const createdExpense = await createExpense(payload);
      setExpenses((current) => [createdExpense, ...current]);
      setIsCreateOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  function clearFilters() {
    setSelectedCategoryId("");
    setStartDate("");
    setEndDate("");
    setShowCategoryOptions(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadData(true)} />}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <SymbolIcon symbol="‹" size={26} color={palette.textPrimary} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Expenses</Text>
            <Text style={styles.headerSubtitle}>{hasRangeFilter ? "Rango personalizado" : formatMonthLabel(month)}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total spent</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(total)}</Text>
          <Text style={styles.summaryMeta}>{expenses.length} gastos registrados</Text>
        </View>

        <View style={styles.monthSelector}>
          <Pressable onPress={() => setMonth((current) => shiftMonth(current, -1))} style={styles.monthButton}>
            <SymbolIcon symbol="‹" size={24} color={palette.textPrimary} />
          </Pressable>
          <Text style={styles.monthLabel}>{formatMonthLabel(month)}</Text>
          <Pressable onPress={() => setMonth((current) => shiftMonth(current, 1))} style={styles.monthButton}>
            <SymbolIcon symbol="›" size={24} color={palette.textPrimary} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => setShowFilters((current) => !current)}
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
        >
          <SymbolIcon symbol="⌕" size={18} color={palette.textPrimary} />
          <Text style={styles.filterButtonLabel}>{hasActiveFilters ? "Filters Active" : "Filter Expenses"}</Text>
          {hasActiveFilters ? <Text style={styles.filterCount}>{[selectedCategoryId, startDate, endDate].filter(Boolean).length}</Text> : null}
        </Pressable>

        {showFilters ? (
          <View style={styles.filterPanel}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              {hasActiveFilters ? (
                <Pressable onPress={clearFilters} style={styles.clearButton}>
                  <Text style={styles.clearButtonLabel}>Clear All</Text>
                </Pressable>
              ) : null}
            </View>

            <Text style={styles.label}>Category</Text>
            <Pressable
              onPress={() => setShowCategoryOptions((current) => !current)}
              style={styles.categoryDropdown}
            >
              <Text
                style={[styles.categoryDropdownLabel, !selectedCategory && styles.categoryDropdownPlaceholder]}
                numberOfLines={1}
              >
                {selectedCategory?.name ?? "All Categories"}
              </Text>
              <SymbolIcon symbol={showCategoryOptions ? "⌃" : "⌄"} size={16} color={palette.textSecondary} />
            </Pressable>

            {showCategoryOptions ? (
              <View style={styles.categoryDropdownMenu}>
                <Pressable
                  onPress={() => {
                    setSelectedCategoryId("");
                    setShowCategoryOptions(false);
                  }}
                  style={styles.categoryDropdownOption}
                >
                  <Text style={styles.categoryDropdownOptionLabel}>All Categories</Text>
                </Pressable>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => {
                      setSelectedCategoryId(category.id);
                      setShowCategoryOptions(false);
                    }}
                    style={styles.categoryDropdownOption}
                  >
                    <Text style={styles.categoryDropdownOptionLabel}>{category.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Text style={styles.label}>Date range</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <DatePickerField value={startDate} placeholder="Start" onChange={setStartDate} />
              </View>
              <View style={styles.dateField}>
                <DatePickerField value={endDate} placeholder="End" onChange={setEndDate} />
              </View>
            </View>
          </View>
        ) : null}

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
        ) : expenses.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <SymbolIcon symbol="$" size={24} color={palette.primary} />
            </View>
            <Text style={styles.emptyTitle}>No expenses found</Text>
            {hasActiveFilters ? (
              <Pressable onPress={clearFilters} style={styles.emptyButton}>
                <Text style={styles.emptyButtonLabel}>Clear filters</Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => setIsCreateOpen(true)} style={styles.emptyButton}>
                <Text style={styles.emptyButtonLabel}>Add expense</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.list}>
            {expenses.map((expense) => (
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 96,
  },
  header: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
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
  headerText: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: palette.textSecondary,
    textTransform: "capitalize",
  },
  headerSpacer: {
    width: 40,
  },
  summaryCard: {
    backgroundColor: palette.primary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },
  summaryLabel: {
    color: "#D8F2E6",
    fontSize: 13,
    fontWeight: "700",
  },
  summaryAmount: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },
  summaryMeta: {
    marginTop: 4,
    color: "#E9FFF4",
    fontSize: 13,
  },
  monthSelector: {
    minHeight: 58,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 22,
    paddingHorizontal: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FBF8",
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.textPrimary,
    textTransform: "capitalize",
  },
  filterButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  filterButtonActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  filterButtonLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  filterCount: {
    marginLeft: "auto",
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: palette.primary,
    color: "#FFFFFF",
    overflow: "hidden",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
  },
  filterPanel: {
    backgroundColor: palette.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    gap: 12,
    marginBottom: 14,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  clearButtonLabel: {
    color: palette.primary,
    fontWeight: "800",
  },
  clearButton: {
    paddingVertical: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  categoryDropdown: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8ECE8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryDropdownLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  categoryDropdownPlaceholder: {
    color: palette.textSecondary,
    fontWeight: "600",
  },
  categoryDropdownMenu: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8ECE8",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  categoryDropdownOption: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F0",
  },
  categoryDropdownOptionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateField: {
    flex: 1,
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
