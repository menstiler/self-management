import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import DataForm from "../components/DataForm";
import { DataContext } from "../store/data-context";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialTaskState = {
  title: "",
  duration: { days: 0, hours: 0, minutes: 0 },
  date: new Date(),
  description: "",
  priority: "low",
  status: "not started",
  goals: [],
  isRecurring: false,
  startDate: new Date(),
  endDate: new Date(),
};

function AddTask({ navigation }) {
  const isFocused = useIsFocused();
  const dataCtx = useContext(DataContext);
  const [task, _] = useState(initialTaskState);

  useEffect(() => {
    dataCtx.updateEditingTask(initialTaskState);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "New Task",
    });
  }, [navigation]);

  useEffect(() => {
    // needed for when navigation from TaskDetail to ensure data is reset
    if (isFocused && dataCtx.editingTask.id) {
      dataCtx.updateEditingTask(initialTaskState);
    }
  }, [isFocused]);

  function saveHandler() {
    // Check if this is a recurring task
    if (
      dataCtx.editingTask.isRecurring &&
      dataCtx.editingTask.startDate &&
      dataCtx.editingTask.endDate
    ) {
      dataCtx.addRecurringTask(dataCtx.editingTask);
    } else {
      dataCtx.addTask(dataCtx.editingTask);
    }
    dataCtx.updateEditingTask(initialTaskState);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
    dataCtx.updateEditingTask(initialTaskState);
  }

  if (!Object.keys(dataCtx.editingTask).length) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <DataForm
        data="task"
        item={task}
        hasManyRelationship="goals"
        editingObj="editingTask"
        updateEditingObj="updateEditingTask"
        onCancel={cancelHandler}
        onDelete={() => {}}
      />
      <View style={styles.buttonRow}>
        <Pressable
          onPress={cancelHandler}
          style={({ pressed }) => [
            styles.button,
            styles.cancelButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={saveHandler}
          style={({ pressed }) => [
            styles.button,
            styles.saveButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default AddTask;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  buttonRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  saveButton: {
    backgroundColor: "#60a5fa",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
