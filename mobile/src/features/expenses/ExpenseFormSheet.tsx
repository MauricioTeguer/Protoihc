import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ActionButton } from "../../components/ActionButton";
import { SymbolIcon } from "../../components/SymbolIcon";
import { categoryIcons } from "../../constants/category-options";
import { palette } from "../../theme/palette";
import type { Category } from "../categories/types";
import { DatePickerField } from "./DatePickerField";
import type { Expense, ExpensePayload } from "./types";

interface ExpenseFormSheetProps {
  visible: boolean;
  mode: "create" | "edit";
  expense?: Expense | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (payload: ExpensePayload) => Promise<void>;
}

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseFormSheet({
  visible,
  mode,
  expense,
  categories,
  onClose,
  onSubmit,
}: ExpenseFormSheetProps) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(todayValue());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setAmount(expense ? String(expense.amount) : "");
    setCategoryId(expense?.category.id ?? categories[0]?.id ?? "");
    setDate(expense?.date ?? todayValue());
    setNote(expense?.note ?? "");
    setError(null);
    setSubmitting(false);
    setShowCategoryOptions(false);
  }, [categories, expense, visible]);

  const title = useMemo(() => (mode === "create" ? "Nuevo gasto" : "Editar gasto"), [mode]);

  async function handleSubmit() {
    const numericAmount = Number(amount.replace(",", "."));

    if (!numericAmount || numericAmount <= 0) {
      setError("El monto debe ser mayor que cero");
      return;
    }

    if (!categoryId) {
      setError("Seleccioná una categoría");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("La fecha debe tener formato YYYY-MM-DD");
      return;
    }

    if (!note.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        amount: numericAmount,
        categoryId,
        date,
        note: note.trim(),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo guardar el gasto");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardLayer}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <SymbolIcon symbol="×" size={19} color={palette.textSecondary} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <View style={styles.field}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                  placeholderTextColor={palette.textSecondary}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Category</Text>
                <Pressable
                  onPress={() => setShowCategoryOptions((current) => !current)}
                  style={styles.dropdown}
                >
                  {categoryId ? (
                    <>
                      <SymbolIcon
                        symbol={
                          categoryIcons.find((item) => item.key === categories.find((category) => category.id === categoryId)?.icon)
                            ?.symbol ?? "⋯"
                        }
                        size={17}
                        color={categories.find((category) => category.id === categoryId)?.color ?? palette.textSecondary}
                      />
                      <Text style={styles.dropdownLabel} numberOfLines={1}>
                        {categories.find((category) => category.id === categoryId)?.name ?? "Select a category"}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.dropdownLabel, styles.dropdownPlaceholder]}>Select a category</Text>
                  )}
                  <SymbolIcon symbol={showCategoryOptions ? "⌃" : "⌄"} size={16} color={palette.textSecondary} />
                </Pressable>

                {showCategoryOptions ? (
                  <ScrollView style={styles.dropdownMenu} nestedScrollEnabled>
                    {categories.map((category) => {
                      const icon = categoryIcons.find((item) => item.key === category.icon)?.symbol ?? "⋯";

                      return (
                        <Pressable
                          key={category.id}
                          onPress={() => {
                            setCategoryId(category.id);
                            setShowCategoryOptions(false);
                          }}
                          style={styles.dropdownOption}
                        >
                          <SymbolIcon symbol={icon} size={18} color={category.color} />
                          <Text style={styles.dropdownOptionLabel} numberOfLines={1}>
                            {category.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                ) : null}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Date</Text>
                <DatePickerField value={date} placeholder="Select a date" onChange={setDate} />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a description..."
                  placeholderTextColor={palette.textSecondary}
                  multiline
                  style={[styles.input, styles.textArea]}
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </ScrollView>

            <View style={styles.footer}>
              <ActionButton
                label={submitting ? "Guardando..." : mode === "create" ? "Save Expense" : "Save Changes"}
                onPress={() => {
                  void handleSubmit();
                }}
                style={styles.submitButton}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(16, 37, 26, 0.24)",
  },
  keyboardLayer: {
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "96%",
    backgroundColor: palette.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EE",
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 10,
    paddingBottom: 6,
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  input: {
    minHeight: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: "#E8ECE8",
  },
  textArea: {
    minHeight: 58,
    paddingTop: 10,
    textAlignVertical: "top",
  },
  dropdown: {
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8ECE8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dropdownLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  dropdownPlaceholder: {
    color: palette.textSecondary,
    fontWeight: "500",
  },
  dropdownMenu: {
    maxHeight: 132,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8ECE8",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  dropdownOption: {
    minHeight: 40,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F0",
  },
  dropdownOptionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  error: {
    color: palette.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  submitButton: {
    minHeight: 42,
    borderRadius: 14,
  },
});
