import {
  useEffect,
  useContext,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";

const DataForm = forwardRef(
  (
    {
      data,
      hasManyRelationship,
      editingObj,
      updateEditingObj,
      onDelete,
      onDeleteItemAndRelationships,
    },
    ref
  ) => {
    const dataCtx = useContext(DataContext);
    const navigation = useNavigation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tasksToDelete, setTasksToDelete] = useState([]);
    const [recurringInstancesToDelete, setRecurringInstancesToDelete] =
      useState([]);
    const [localIsRecurring, setLocalIsRecurring] = useState(false);

    // Sync local state with context state
    useEffect(() => {
      if (data === "task") {
        setLocalIsRecurring(Boolean(dataCtx[editingObj].isRecurring));
      }
    }, [dataCtx[editingObj].isRecurring, data, editingObj]);

    // Stable callback for checkbox changes
    const handleRecurringChange = useCallback(
      (value) => {
        setLocalIsRecurring(value);

        // Update context directly
        const updatedObj = { ...dataCtx[editingObj], isRecurring: value };
        dataCtx[updateEditingObj](updatedObj);

        // Set default dates when recurring is checked
        if (value) {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 7); // Default to 7 days from now

          const updatedWithDates = {
            ...updatedObj,
            startDate: today,
            endDate: endDate,
          };
          dataCtx[updateEditingObj](updatedWithDates);
        }
      },
      [dataCtx, editingObj, updateEditingObj]
    );

    function updateInputHandler(input, value) {
      const updatedObj = { ...dataCtx[editingObj], [input]: value };
      dataCtx[updateEditingObj](updatedObj);
    }

    function updateDateHandler(_, date) {
      dataCtx[updateEditingObj]({
        ...dataCtx[editingObj],
        [data === "task" ? "date" : "deadline"]: date,
      });
    }

    function updateRecurringDateHandler(field, event, date) {
      if (date) {
        dataCtx[updateEditingObj]({
          ...dataCtx[editingObj],
          [field]: date,
        });
      }
    }

    function formatDateForDisplay(date) {
      if (!date) return new Date();

      // If it's already a Date object, return it
      if (date instanceof Date) return date;

      // If it's a string, try to parse it
      if (typeof date === "string") {
        const parsedDate = new Date(date);
        // Check if the parsed date is valid
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }

      // Fallback to current date
      return new Date();
    }

    function updateDurationHandler(input, value) {
      dataCtx.updateEditingTask({
        ...dataCtx.editingTask,
        duration: { ...dataCtx.editingTask.duration, [input]: value },
      });
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

    function handleDeleteRecurringTask() {
      const currentTask = dataCtx[editingObj];

      // Check if this is a parent recurring task
      if (currentTask.isRecurring && !currentTask.parentTaskId) {
        // Find all instances of this recurring task
        const instances = dataCtx.tasks.filter(
          (task) => task.parentTaskId === currentTask.id
        );

        if (instances.length > 0) {
          setRecurringInstancesToDelete(instances);
          setShowDeleteModal(true);
        } else {
          // No instances, just delete the parent
          dataCtx.deleteRecurringTask(currentTask.id);
          navigation.goBack();
        }
      } else if (currentTask.parentTaskId) {
        // This is a recurring task instance
        // Find the parent task
        const parentTask = dataCtx.tasks.find(
          (task) => task.id === currentTask.parentTaskId
        );

        if (parentTask) {
          // Find all instances of this parent
          const instances = dataCtx.tasks.filter(
            (task) => task.parentTaskId === parentTask.id
          );

          if (instances.length > 1) {
            // More than just this instance, ask about deleting all
            setRecurringInstancesToDelete(instances);
            setShowDeleteModal(true);
          } else {
            // Only this instance, delete the parent and all instances
            dataCtx.deleteRecurringTask(parentTask.id);
            navigation.goBack();
          }
        } else {
          // Fallback: just delete this instance
          dataCtx.deleteTask(currentTask.id);
          navigation.goBack();
        }
      } else {
        // Regular task
        deleteHandler();
      }
    }

    function deleteRecurringTaskWithInstances() {
      const currentTask = dataCtx[editingObj];

      if (currentTask.isRecurring && !currentTask.parentTaskId) {
        // Delete parent and all instances
        dataCtx.deleteRecurringTask(currentTask.id);
      } else if (currentTask.parentTaskId) {
        // Delete parent and all instances
        const parentTask = dataCtx.tasks.find(
          (task) => task.id === currentTask.parentTaskId
        );
        if (parentTask) {
          dataCtx.deleteRecurringTask(parentTask.id);
        }
      }

      setShowDeleteModal(false);
      navigation.goBack();
    }

    function deleteRecurringTaskOnly() {
      const currentTask = dataCtx[editingObj];

      if (currentTask.isRecurring && !currentTask.parentTaskId) {
        // Delete only the parent, keep instances
        dataCtx.deleteTask(currentTask.id);
      } else if (currentTask.parentTaskId) {
        // Delete only this instance
        dataCtx.deleteTask(currentTask.id);
      }

      setShowDeleteModal(false);
      navigation.goBack();
    }

    const { progress, status, uniqueGoalTasks } = useGoalMeta(
      dataCtx[editingObj]
    );

    useEffect(() => {
      if (data === "goal") {
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
    }, [
      data,
      editingObj,
      updateEditingObj,
      dataCtx,
      progress,
      status,
      uniqueGoalTasks,
    ]);

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
              <View style={styles.titleContainer}>
                <TextInput
                  style={styles.titleInput}
                  onChangeText={(value) => updateInputHandler("title", value)}
                  value={dataCtx[editingObj].title}
                  placeholder="New task"
                  placeholderTextColor="#999"
                  autoFocus={!dataCtx[editingObj].id}
                />
                {data === "task" &&
                  (localIsRecurring ||
                    Boolean(dataCtx[editingObj].parentTaskId)) && (
                    <Feather
                      name="repeat"
                      size={20}
                      color="#888"
                      style={{ marginLeft: 8 }}
                    />
                  )}
              </View>
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
              value={formatDateForDisplay(
                dataCtx[editingObj][data === "task" ? "date" : "deadline"]
              )}
              updateDateHandler={updateDateHandler}
            />

            {data === "task" && Boolean(dataCtx[editingObj].parentTaskId) && (
              <View style={styles.fieldGroup}>
                <View style={styles.recurringInfoContainer}>
                  <Text style={styles.recurringInfoText}>
                    This is a recurring task instance
                  </Text>
                  <Button
                    title="Edit Parent Task"
                    onPress={() => {
                      const parentTask = dataCtx.tasks.find(
                        (task) => task.id === dataCtx[editingObj].parentTaskId
                      );
                      if (parentTask) {
                        navigation.navigate("TaskDetail", {
                          taskId: parentTask.id,
                        });
                      }
                    }}
                    color="#4CAF50"
                  />
                </View>
              </View>
            )}

            {data === "task" && !Boolean(dataCtx[editingObj].parentTaskId) && (
              <>
                <View style={styles.fieldGroup}>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      value={localIsRecurring}
                      onValueChange={handleRecurringChange}
                    />
                    <Text style={styles.checkboxLabel}>Recurring Task</Text>
                  </View>
                </View>

                {localIsRecurring && (
                  <>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Start Date</Text>
                      <DateTimePicker
                        value={formatDateForDisplay(
                          dataCtx[editingObj].startDate
                        )}
                        mode="date"
                        display="default"
                        onChange={(event, date) =>
                          updateRecurringDateHandler("startDate", event, date)
                        }
                        minimumDate={new Date()}
                      />
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>End Date</Text>
                      <DateTimePicker
                        value={formatDateForDisplay(
                          dataCtx[editingObj].endDate
                        )}
                        mode="date"
                        display="default"
                        onChange={(event, date) =>
                          updateRecurringDateHandler("endDate", event, date)
                        }
                        minimumDate={formatDateForDisplay(
                          dataCtx[editingObj].startDate
                        )}
                      />
                    </View>
                  </>
                )}

                {localIsRecurring && dataCtx[editingObj].id && (
                  <View style={styles.fieldGroup}>
                    <View style={styles.recurringInfoContainer}>
                      <Text style={styles.recurringInfoText}>
                        This recurring task has{" "}
                        {
                          dataCtx.tasks.filter(
                            (task) =>
                              task.parentTaskId === dataCtx[editingObj].id
                          ).length
                        }{" "}
                        instances
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}

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
              onPress={() => {
                if (
                  data === "task" &&
                  (dataCtx[editingObj].isRecurring ||
                    dataCtx[editingObj].parentTaskId)
                ) {
                  handleDeleteRecurringTask();
                } else {
                  setShowDeleteModal(true);
                }
              }}
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
          onDeleteRecurringWithInstances={deleteRecurringTaskWithInstances}
          onDeleteRecurringOnly={deleteRecurringTaskOnly}
          itemTitle={dataCtx[editingObj].title}
          itemType={data}
          tasksToDelete={tasksToDelete}
          recurringInstancesToDelete={recurringInstancesToDelete}
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
  recurringIndicator: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  disabledText: {
    color: "#999",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 20,
  },
  titleInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 600,
    color: "#000",
    paddingVertical: 0,
  },
  recurringInfoContainer: {
    backgroundColor: "#f0f8ff",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  recurringInfoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontStyle: "italic",
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  customCheckboxChecked: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  checkmark: {
    fontSize: 18,
    color: "#fff",
  },
});
