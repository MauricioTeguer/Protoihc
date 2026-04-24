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
import { createCategory, deleteCategory, listCategories, updateCategory } from "../api/categories";
import { CategoryCard } from "../features/categories/CategoryCard";
import { CategoryFormSheet } from "../features/categories/CategoryFormSheet";
import { DeleteCategoryAlert } from "../features/categories/DeleteCategoryAlert";
import type { Category, CategoryPayload } from "../features/categories/types";
import { palette } from "../theme/palette";
import { SymbolIcon } from "../components/SymbolIcon";

export function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const loadCategories = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await listCategories();
      setCategories(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la lista");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  async function handleCreate(payload: CategoryPayload) {
    setSubmitting(true);

    try {
      const createdCategory = await createCategory(payload);
      setCategories((current) => [...current, createdCategory].sort((left, right) => left.name.localeCompare(right.name)));
      setIsCreateOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(payload: CategoryPayload) {
    if (!editingCategory) {
      return;
    }

    setSubmitting(true);

    try {
      const updatedCategory = await updateCategory(editingCategory.id, payload);
      setCategories((current) =>
        current
          .map((category) => (category.id === updatedCategory.id ? updatedCategory : category))
          .sort((left, right) => left.name.localeCompare(right.name))
      );
      setEditingCategory(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingCategory) {
      return;
    }

    try {
      setDeleting(true);
      await deleteCategory(deletingCategory.id);
      setCategories((current) => current.filter((category) => category.id !== deletingCategory.id));
      setDeletingCategory(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la categoría");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadCategories(true)} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Categories</Text>
        </View>

        {error ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>No se pudo completar la acción</Text>
            <Text style={styles.feedbackDescription}>{error}</Text>
            <Pressable onPress={() => void loadCategories()} style={styles.retryButton}>
              <Text style={styles.retryButtonLabel}>Reintentar</Text>
            </Pressable>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.loadingText}>Cargando categorías...</Text>
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <SymbolIcon symbol="⋯" size={24} color={palette.primary} />
            </View>
            <Text style={styles.emptyTitle}>Todavía no hay categorías</Text>
            <Pressable onPress={() => setIsCreateOpen(true)} style={styles.emptyButton}>
              <Text style={styles.emptyButtonLabel}>Crear la primera</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={() => setEditingCategory(category)}
                onDelete={() => setDeletingCategory(category)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        accessibilityLabel="Nueva categoría"
        accessibilityRole="button"
        onPress={() => setIsCreateOpen(true)}
        style={styles.floatingButton}
      >
        <SymbolIcon symbol="+" size={28} color="#FFFFFF" />
      </Pressable>

      <CategoryFormSheet
        visible={isCreateOpen}
        mode="create"
        onClose={() => {
          if (!submitting) {
            setIsCreateOpen(false);
          }
        }}
        onSubmit={handleCreate}
      />

      <CategoryFormSheet
        visible={Boolean(editingCategory)}
        mode="edit"
        category={editingCategory}
        onClose={() => {
          if (!submitting) {
            setEditingCategory(null);
          }
        }}
        onSubmit={handleUpdate}
      />

      <DeleteCategoryAlert
        visible={Boolean(deletingCategory)}
        categoryName={deletingCategory?.name}
        deleting={deleting}
        onCancel={() => {
          if (!deleting) {
            setDeletingCategory(null);
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
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: palette.textPrimary,
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
    backgroundColor: palette.surface,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: palette.border,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: palette.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  emptyButton: {
    marginTop: 22,
    backgroundColor: palette.primary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyButtonLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  list: {
    gap: 12,
    paddingBottom: 74,
  },
  floatingButton: {
    position: "absolute",
    right: 16,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#57C48E",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10251A",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
