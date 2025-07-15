import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

export default function DeleteModal({
  visible,
  onClose,
  onDelete,
  onDeleteWithTasks,
  onDeleteRecurringWithInstances,
  onDeleteRecurringOnly,
  itemTitle,
  itemType,
  tasksToDelete,
  isRecurring,
}) {
  const capitalizeWords = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Deleting {itemTitle}</Text>

          {itemType === "task" && isRecurring ? (
            <>
              <Text style={styles.message}>
                This is a recurring task. What would you like to delete?
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.destructiveBtn}
                  onPress={onDeleteRecurringOnly}
                >
                  <Text style={styles.destructiveText}>
                    Only This Task Occurrence
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.destructiveBtn}
                  onPress={onDeleteRecurringWithInstances}
                >
                  <Text style={styles.destructiveText}>
                    All Past and Future Occurrences of this Task
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.message}>
                Are you sure you want to delete this {capitalizeWords(itemType)}
                ?
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.destructiveBtn}
                  onPress={onDelete}
                >
                  <Text style={styles.destructiveText}>Delete</Text>
                </TouchableOpacity>

                {itemType === "goal" && tasksToDelete.length > 0 && (
                  <TouchableOpacity
                    style={styles.destructiveBtn}
                    onPress={onDeleteWithTasks}
                  >
                    <Text style={styles.destructiveText}>
                      Delete with Tasks
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: 300,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "column",
    gap: 10,
  },
  cancelBtn: {
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  destructiveBtn: {
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#ff4d4f",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  destructiveText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
