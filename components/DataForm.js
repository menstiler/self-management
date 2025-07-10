import {
  useEffect,
  useContext,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  TextInput,
  View,
  Text,
  Button,
  Pressable,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DataContext } from "../store/data-context.js";
import { capitalizeWords } from "../util/task.js";
import DateField from "./form/DateField";
import PriorityField from "./form/PriorityField";
import DurationField from "./form/DurationField";
import RelationshipField from "./form/RelationshipField";
import DeleteModal from "./form/DeleteModal";
import Checkbox from "expo-checkbox";
import * as Progress from "react-native-progress";
import { useGoalMeta } from "../hooks/useGoalMeta";
import { SafeAreaView } from "react-native-safe-area-context";

const DataForm = forwardRef(
  (
    {
      data,
      item,
      hasManyRelationship,
      editingObj,
      updateEditingObj,
      onSave,
      onCancel,
      onDelete,
      onDeleteItemAndRelationships,
    },
    ref
  ) => {
    const dataCtx = useContext(DataContext);
    const navigation = useNavigation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tasksToDelete, setTasksToDelete] = useState([]);

    function updateInputHandler(input, value) {
      dataCtx[updateEditingObj]({ ...dataCtx[editingObj], [input]: value });
    }

    function updateDateHandler(_, date) {
      dataCtx[updateEditingObj]({
        ...dataCtx[editingObj],
        [data === "task" ? "date" : "deadline"]: date,
      });
    }

    function updateDurationHandler(input, value) {
      dataCtx.updateEditingTask({
        ...dataCtx.editingTask,
        duration: { ...dataCtx.editingTask.duration, [input]: value },
      });
    }

    function saveHandler() {
      onSave();
    }

    function cancelHandler() {
      dataCtx[updateEditingObj](item);
      onCancel();
    }

    function openAction(action) {
      navigation.navigate("Action", {
        action: action,
      });
    }

    function deleteHandler() {
      onDelete(dataCtx[editingObj].id);
      navigation.goBack();
    }

    function deleteGoalWithTasksHandler() {
      onDeleteItemAndRelationships(dataCtx[editingObj].id);
      navigation.goBack();
    }

    const { progress, status } = useGoalMeta(dataCtx[editingObj]);

    useEffect(() => {
      if (data === "goal") {
        const allTasks = dataCtx.tasks || [];

        const goalTasks = allTasks.filter((task) =>
          (item.tasks || []).includes(task.id)
        );

        const uniqueGoalTasks = goalTasks.filter(
          (task) => task.goals.length === 1
        );

        setTasksToDelete(uniqueGoalTasks);

        if (dataCtx[editingObj].progress !== progress) {
          dataCtx[updateEditingObj]({
            ...dataCtx[editingObj],
            progress,
          });
        }

        if (dataCtx[editingObj].trackTaskStatus) {
          if (dataCtx[editingObj].status !== status) {
            dataCtx[updateEditingObj]({
              ...dataCtx[editingObj],
              status,
            });
          }
        }
      }
    }, [data, editingObj, updateEditingObj, dataCtx, progress, status]);

    function duplicateTaskHandler() {
      if (data !== "task") return;

      const baseTitle = dataCtx[editingObj].title.replace(/\s\(\d+\)$/, "");
      const similarTasks = dataCtx.tasks.filter((task) =>
        task.title.startsWith(baseTitle)
      );

      let maxNum = 0;
      similarTasks.forEach((task) => {
        const match = task.title.match(/\((\d+)\)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      const newNum = maxNum + 1;

      const newTask = {
        ...dataCtx[editingObj],
        id: Math.random().toString(),
        title: `${baseTitle} (${newNum})`,
      };

      dataCtx.addTask(newTask);
      navigation.navigate("TaskDetail", {
        taskId: newTask.id,
      });
    }

    useImperativeHandle(ref, () => ({
      duplicateTask: duplicateTaskHandler,
    }));

    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardAvoiding}
            keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) => updateInputHandler("title", value)}
                value={dataCtx[editingObj].title}
                placeholder="Enter title"
              />
            </View>
            <View style={[styles.fieldGroup, styles.row]}>
              <View style={styles.flex}>
                <Text style={styles.label}>Status</Text>
                <Pressable
                  style={styles.statusBox}
                  onPress={() => {
                    if (data === "goal" && dataCtx[editingObj].trackTaskStatus)
                      return;
                    openAction(data === "task" ? "task-status" : "goal-status");
                  }}
                >
                  <Text style={styles.statusText}>
                    {capitalizeWords(dataCtx[editingObj].status)}
                  </Text>
                </Pressable>
              </View>

              {data === "goal" && (
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={dataCtx[editingObj].trackTaskStatus}
                    onValueChange={(value) =>
                      updateInputHandler("trackTaskStatus", value)
                    }
                  />
                  <Text style={styles.checkboxLabel}>Track Task Status</Text>
                </View>
              )}
            </View>
            {data === "goal" && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Progress: {Math.round(dataCtx[editingObj].progress)}%
                </Text>
                <Progress.Bar
                  progress={dataCtx[editingObj].progress / 100}
                  width={null}
                  height={10}
                  color="#4caf50"
                  unfilledColor="#e0e0e0"
                  borderWidth={0}
                  borderRadius={8}
                />
              </View>
            )}
            <RelationshipField
              hasManyRelationship={hasManyRelationship}
              dataCtx={dataCtx}
              editingObj={editingObj}
              updateEditingObj={updateEditingObj}
              openAction={openAction}
            />
            {data === "task" && (
              <>
                <PriorityField
                  value={dataCtx[editingObj].priority}
                  updateInputHandler={updateInputHandler}
                />
                <DurationField
                  durationValue={dataCtx[editingObj].duration}
                  updateDurationHandler={updateDurationHandler}
                />
              </>
            )}
            <DateField
              data={data}
              value={dataCtx[editingObj][data === "task" ? "date" : "deadline"]}
              updateDateHandler={updateDateHandler}
            />
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.description]}
                onChangeText={(value) =>
                  updateInputHandler("description", value)
                }
                value={dataCtx[editingObj].description}
                placeholder="Optional description"
                multiline
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>

        <View style={styles.buttonRow}>
          {dataCtx[editingObj].id && (
            <Button
              title={`Delete ${capitalizeWords(data)}`}
              onPress={() => setShowDeleteModal(true)}
              color="#e53935"
            />
          )}
        </View>

        <DeleteModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            deleteHandler();
            setShowDeleteModal(false);
          }}
          onDeleteWithTasks={() => {
            deleteGoalWithTasksHandler();
            setShowDeleteModal(false);
          }}
          itemTitle={dataCtx[editingObj].title}
          itemType={data}
          tasksToDelete={tasksToDelete}
        />
      </View>
    );
  }
);

export default DataForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111",
  },
  description: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  statusBox: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 4,
  },
  statusText: {
    fontSize: 16,
    color: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  checkboxLabel: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 26,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});
