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
    const [localIsRecurring, setLocalIsRecurring] = useState(false);

    useEffect(() => {
      if (data === "task") {
        setLocalIsRecurring(Boolean(dataCtx[editingObj].isRecurring));
      }
    }, [dataCtx[editingObj].isRecurring, data, editingObj]);

    const handleRecurringChange = useCallback(
      (value) => {
        setLocalIsRecurring(value);

        const updatedObj = { ...dataCtx[editingObj], isRecurring: value };
        dataCtx[updateEditingObj](updatedObj);

        if (value) {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 7); // Default to 7 days from now

          const updatedWithDates = {
            ...updatedObj,
            repeat: "daily",
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

      if (input === "repeat" && value === "weekly" && !updatedObj.dayOfWeek) {
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const today = new Date();
        const todayName = dayNames[today.getDay()];
        updatedObj.dayOfWeek = todayName;
      }

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

      if (date instanceof Date) return date;

      if (typeof date === "string") {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }

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

      if (currentTask.isRecurring) {
        setShowDeleteModal(true);
      } else {
        deleteHandler();
      }
    }

    function handleDeleteTask() {
      // Show delete modal for confirmation
      setShowDeleteModal(true);
    }

    function handleDeleteGoal() {
      setShowDeleteModal(true);
    }

    function deleteRecurringTaskCompletely() {
      const currentTask = dataCtx[editingObj];
      dataCtx.deleteRecurringTask(currentTask.id);
      setShowDeleteModal(false);
      navigation.goBack();
    }

    function deleteRecurringTaskInstance() {
      const currentTask = dataCtx[editingObj];
      const today = new Date().toISOString().split("T")[0];
      dataCtx.completeRecurringTask(currentTask.id, today);
      setShowDeleteModal(false);
      navigation.goBack();
    }

    function deleteRegularTask() {
      const currentTask = dataCtx[editingObj];
      dataCtx.deleteTask(currentTask.id);
      setShowDeleteModal(false);
      navigation.goBack();
    }

    function deleteGoal() {
      const currentGoal = dataCtx[editingObj];
      dataCtx.deleteGoal(currentGoal.id);
      setShowDeleteModal(false);
      navigation.goBack();
    }

    function deleteGoalWithTasks() {
      const currentGoal = dataCtx[editingObj];
      dataCtx.deleteGoalWithTasks(currentGoal.id);
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

      const title = dataCtx[editingObj].title || "Untitled Task";
      const baseTitle = title.replace(/\s\(\d+\)$/, "");
      const similarTasks = dataCtx.allTasks.filter(
        (task) => task.title && task.title.startsWith(baseTitle)
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
      handleDeleteRecurringTask: handleDeleteRecurringTask,
      handleDeleteTask: handleDeleteTask,
      handleDeleteGoal: handleDeleteGoal,
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
                {data === "task" && dataCtx[editingObj].isRecurring && (
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

            {data === "task" && dataCtx[editingObj].isRecurring && (
              <>
                <View style={styles.fieldGroup}>
                  <View style={styles.recurringInfoContainer}>
                    <Text style={styles.recurringInfoText}>
                      This is a recurring task
                    </Text>
                    <Text style={styles.recurringInfoSubtext}>
                      Completed dates:{" "}
                      {dataCtx[editingObj].completedDates?.length || 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Repeat</Text>
                  <View style={styles.repeatOptions}>
                    <Pressable
                      style={[
                        styles.repeatOption,
                        dataCtx[editingObj].repeat === "daily" &&
                          styles.repeatOptionSelected,
                      ]}
                      onPress={() => updateInputHandler("repeat", "daily")}
                    >
                      <Text
                        style={[
                          styles.repeatOptionText,
                          dataCtx[editingObj].repeat === "daily" &&
                            styles.repeatOptionTextSelected,
                        ]}
                      >
                        Daily
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.repeatOption,
                        dataCtx[editingObj].repeat === "weekly" &&
                          styles.repeatOptionSelected,
                      ]}
                      onPress={() => updateInputHandler("repeat", "weekly")}
                    >
                      <Text
                        style={[
                          styles.repeatOptionText,
                          dataCtx[editingObj].repeat === "weekly" &&
                            styles.repeatOptionTextSelected,
                        ]}
                      >
                        Weekly
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {dataCtx[editingObj].repeat === "weekly" && (
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Day of Week</Text>
                    <View style={styles.dayOptions}>
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <Pressable
                          key={day}
                          style={[
                            styles.dayOption,
                            dataCtx[editingObj].dayOfWeek === day &&
                              styles.dayOptionSelected,
                          ]}
                          onPress={() => updateInputHandler("dayOfWeek", day)}
                        >
                          <Text
                            style={[
                              styles.dayOptionText,
                              dataCtx[editingObj].dayOfWeek === day &&
                                styles.dayOptionTextSelected,
                            ]}
                          >
                            {day.slice(0, 3)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Start Date</Text>
                  <DateTimePicker
                    value={formatDateForDisplay(dataCtx[editingObj].startDate)}
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
                    value={formatDateForDisplay(dataCtx[editingObj].endDate)}
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

            {data === "task" && !dataCtx[editingObj].isRecurring && (
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
                      <Text style={styles.label}>Repeat</Text>
                      <View style={styles.repeatOptions}>
                        <Pressable
                          style={[
                            styles.repeatOption,
                            dataCtx[editingObj].repeat === "daily" &&
                              styles.repeatOptionSelected,
                          ]}
                          onPress={() => updateInputHandler("repeat", "daily")}
                        >
                          <Text
                            style={[
                              styles.repeatOptionText,
                              dataCtx[editingObj].repeat === "daily" &&
                                styles.repeatOptionTextSelected,
                            ]}
                          >
                            Daily
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.repeatOption,
                            dataCtx[editingObj].repeat === "weekly" &&
                              styles.repeatOptionSelected,
                          ]}
                          onPress={() => updateInputHandler("repeat", "weekly")}
                        >
                          <Text
                            style={[
                              styles.repeatOptionText,
                              dataCtx[editingObj].repeat === "weekly" &&
                                styles.repeatOptionTextSelected,
                            ]}
                          >
                            Weekly
                          </Text>
                        </Pressable>
                      </View>
                    </View>

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
        <DeleteModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={
            data === "goal"
              ? deleteGoal
              : dataCtx[editingObj].isRecurring
              ? deleteRecurringTaskCompletely
              : deleteRegularTask
          }
          onDeleteWithTasks={data === "goal" ? deleteGoalWithTasks : () => {}}
          onDeleteRecurringWithInstances={deleteRecurringTaskCompletely}
          onDeleteRecurringOnly={deleteRecurringTaskInstance}
          itemTitle={dataCtx[editingObj].title}
          itemType={data}
          tasksToDelete={tasksToDelete}
          isRecurring={dataCtx[editingObj].isRecurring}
        />
      </View>
    );
  }
);

export default DataForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 20,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flex: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  statusBox: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976D2",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#1A1A1A",
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 8,
  },
  recurringInfoContainer: {
    backgroundColor: "#F3E5F5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1BEE7",
  },
  recurringInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7B1FA2",
  },
  recurringInfoSubtext: {
    fontSize: 12,
    color: "#9C27B0",
    marginTop: 4,
  },
  repeatOptions: {
    flexDirection: "row",
    gap: 8,
  },
  repeatOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  repeatOptionSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  repeatOptionText: {
    fontSize: 14,
    color: "#1A1A1A",
    textAlign: "center",
  },
  repeatOptionTextSelected: {
    color: "#1976D2",
    fontWeight: "600",
  },
  dayOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  dayOption: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    minWidth: 40,
  },
  dayOptionSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  dayOptionText: {
    fontSize: 12,
    color: "#1A1A1A",
    textAlign: "center",
  },
  dayOptionTextSelected: {
    color: "#1976D2",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
  },
  description: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});
