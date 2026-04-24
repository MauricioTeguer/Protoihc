import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { categoryColors, categoryIcons, type CategoryIconKey } from "../../constants/category-options";
import { palette } from "../../theme/palette";
import { ActionButton } from "../../components/ActionButton";
import type { Category } from "./types";
import { SymbolIcon } from "../../components/SymbolIcon";

interface CategoryFormSheetProps {
  visible: boolean;
  mode: "create" | "edit";
  category?: Category | null;
  onClose: () => void;
  onSubmit: (payload: { name: string; icon: CategoryIconKey; color: string }) => Promise<void>;
}

const defaultIcon = "utensils" as CategoryIconKey;
const defaultColor = "#10B981";

export function CategoryFormSheet({
  visible,
  mode,
  category,
  onClose,
  onSubmit,
}: CategoryFormSheetProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<CategoryIconKey>(defaultIcon);
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setName(category?.name ?? "");
    setSelectedIcon(category?.icon ?? defaultIcon);
    setSelectedColor(category?.color ?? defaultColor);
    setError(null);
    setSubmitting(false);
  }, [category, visible]);

  const title = useMemo(
    () => (mode === "create" ? "Nueva categoría" : "Editar categoría"),
    [mode]
  );

  async function handleSubmit() {
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo guardar la categoría");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardLayer}
        >
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <SymbolIcon symbol="×" size={22} color={palette.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.content}>
              <View style={styles.field}>
                <Text style={styles.label}>Category Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter category name"
                  placeholderTextColor={palette.textSecondary}
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Icon</Text>
                <View style={styles.iconGrid}>
                  {categoryIcons.map((item) => (
                    <Pressable
                      key={item.key}
                      onPress={() => setSelectedIcon(item.key)}
                      style={[
                        styles.iconOption,
                        selectedIcon === item.key && styles.iconOptionSelected,
                      ]}
                    >
                      <SymbolIcon
                        symbol={item.symbol}
                        size={18}
                        color={selectedIcon === item.key ? palette.primary : palette.textSecondary}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.colorGrid}>
                  {categoryColors.map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorOptionSelected,
                      ]}
                    />
                  ))}
                </View>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>

            <View style={styles.footer}>
              <ActionButton
                label={submitting ? "Guardando..." : mode === "create" ? "Create Category" : "Save Changes"}
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
    backgroundColor: palette.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 18,
    paddingBottom: 18,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EE",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 18,
    paddingBottom: 10,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  input: {
    minHeight: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 15,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: "#E8ECE8",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconOption: {
    width: 38,
    aspectRatio: 1,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  iconOptionSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: palette.textPrimary,
  },
  error: {
    color: palette.danger,
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 16,
  },
});
