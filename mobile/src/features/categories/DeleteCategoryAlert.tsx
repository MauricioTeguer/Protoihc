import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../../components/ActionButton";
import { palette } from "../../theme/palette";

interface DeleteCategoryAlertProps {
  visible: boolean;
  categoryName?: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteCategoryAlert({
  visible,
  categoryName,
  deleting,
  onCancel,
  onConfirm,
}: DeleteCategoryAlertProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>Eliminar categoría</Text>
          <Text style={styles.description}>
            {`¿Querés eliminar "${categoryName ?? "esta categoría"}"? Cuando exista el módulo de gastos, esta acción validará si tiene movimientos asociados.`}
          </Text>
          <View style={styles.footer}>
            <ActionButton label="Cancelar" onPress={onCancel} variant="secondary" style={styles.button} />
            <ActionButton
              label={deleting ? "Eliminando..." : "Eliminar"}
              onPress={onConfirm}
              variant="danger"
              style={styles.button}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 134,
    backgroundColor: "rgba(16, 37, 26, 0.24)",
  },
  dialog: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: 22,
    gap: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.textSecondary,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  button: {
    flex: 1,
  },
});
