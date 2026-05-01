import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../../components/ActionButton";
import { palette } from "../../theme/palette";

interface DeleteExpenseAlertProps {
  visible: boolean;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteExpenseAlert({
  visible,
  deleting,
  onCancel,
  onConfirm,
}: DeleteExpenseAlertProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>Eliminar gasto</Text>
          <Text style={styles.description}>Esta acción elimina el registro de forma permanente.</Text>

          <View style={styles.actions}>
            <ActionButton label="Cancelar" variant="secondary" onPress={onCancel} style={styles.actionButton} />
            <ActionButton
              label={deleting ? "Eliminando..." : "Eliminar"}
              variant="danger"
              onPress={onConfirm}
              style={styles.actionButton}
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16, 37, 26, 0.28)",
    paddingHorizontal: 22,
  },
  dialog: {
    width: "100%",
    backgroundColor: palette.surface,
    borderRadius: 26,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: palette.textSecondary,
  },
  actions: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minHeight: 46,
  },
});
