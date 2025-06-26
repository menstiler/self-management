import { useContext } from "react";
import { TextInput, View, Text, Button, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useNavigation } from "@react-navigation/native";
import { capitalizeWords } from "../util/task";
import { DataContext } from "../store/data-context.js";

function TaskForm({ task, onSave, onCancel, onDelete }) {
  const dataCtx = useContext(DataContext);
  const navigation = useNavigation();

  function updateInputHandler(input, value) {
    dataCtx.updateEditingTask({ ...dataCtx.editingTask, [input]: value });
  }

  function updateDateHandler(_, date) {
    dataCtx.updateEditingTask({
      ...dataCtx.editingTask,
      date,
    });
  }

  function updateDurationHandler(input, value) {
    dataCtx.updateEditingTask({
      ...dataCtx.editingTask,
      duration: { ...currTask.duration, [input]: value },
    });
  }

  const priorities = {
    high: 0,
    medium: 1,
    low: 2,
  };

  function saveHandler() {
    onSave();
  }

  function cancelHandler() {
    dataCtx.updateEditingTask(task);
    onCancel();
  }

  function openAction(action) {
    navigation.navigate("Action", {
      action: action,
    });
  }

  function deleteHandler() {
    onDelete(dataCtx.editingTask.id);
    navigation.goBack();
  }

  function updateGoalHandler(goalId) {
    dataCtx.updateEditingTask({
      ...dataCtx.editingTask,
      goals:
        dataCtx.editingTask.goals.findIndex((goal) => goal === goalId) !== -1
          ? dataCtx.editingTask.goals.filter((goal) => goal !== goalId)
          : [...dataCtx.editingTask.goals, goalId],
    });
  }

  return (
    <View>
      <View>
        <Text>Title</Text>
        <TextInput
          onChangeText={(value) => updateInputHandler("title", value)}
          value={dataCtx.editingTask.title}
        />
      </View>
      <View>
        <Text>Status</Text>
        <Pressable onPress={() => openAction("status")}>
          <Text>{capitalizeWords(dataCtx.editingTask.status)}</Text>
        </Pressable>
      </View>
      <View>
        <Text>Related Goals</Text>
        {dataCtx.editingTask.goals.length < 1 ? (
          <Button
            onPress={() => openAction("goals")}
            title="Add Goal"
          />
        ) : (
          dataCtx.editingTask.goals.map((goal) => {
            // TODO open goal screen on press
            const taskGoal = dataCtx.goals.find(
              (goalData) => goalData.id === goal
            );
            return (
              <View key={taskGoal.id}>
                <Pressable onPress={() => openAction("goals")}>
                  <Text>{taskGoal.title}</Text>
                </Pressable>
                <Button
                  title="Remove Goal"
                  onPress={() => updateGoalHandler(taskGoal.id)}
                />
              </View>
            );
          })
        )}
      </View>
      <View>
        <Text>Priority</Text>
        <SegmentedControl
          values={["High", "Medium", "Low"]}
          selectedIndex={priorities[dataCtx.editingTask.priority]}
          onChange={(event) => {
            updateInputHandler(
              "priority",
              event.nativeEvent.value.toLowerCase()
            );
          }}
        />
      </View>
      <View>
        <Text>Duration</Text>
        <View>
          <Text>Days</Text>
          <TextInput
            onChangeText={(value) => updateDurationHandler("days", value)}
            value={dataCtx.editingTask.duration.days}
            keyboardType="numeric"
          />
          <Text>Hours</Text>
          <TextInput
            onChangeText={(value) => updateDurationHandler("hours", value)}
            value={dataCtx.editingTask.duration.hours}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text>Minutes</Text>
          <TextInput
            onChangeText={(value) => updateDurationHandler("minutes", value)}
            value={dataCtx.editingTask.duration.minutes}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
      </View>
      <View>
        <Text>Due Date</Text>
        <DateTimePicker
          testID="datePicker"
          value={dataCtx.editingTask.date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={updateDateHandler}
          minimumDate={new Date()}
          positiveButtonLabel="OK!"
        />
        <DateTimePicker
          value={dataCtx.editingTask.date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={updateDateHandler}
          positiveButtonLabel="OK!"
        />
      </View>
      <View>
        <TextInput
          onChangeText={(value) => updateInputHandler("description", value)}
          value={dataCtx.editingTask.description}
        />
      </View>
      <View>
        <Button
          title="Save"
          onPress={saveHandler}
        />
        <Button
          title="Cancel"
          onPress={cancelHandler}
        />
      </View>
      {dataCtx.editingTask.id && (
        <View>
          <Button
            title="Delete Task"
            onPress={deleteHandler}
            color="red"
          />
        </View>
      )}
    </View>
  );
}

export default TaskForm;
