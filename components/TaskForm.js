import { useState, useEffect, createRef, useContext } from "react";
import { TextInput, View, Text, Button, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useNavigation } from "@react-navigation/native";
import { capitalizeWords } from "../util/task";
import { DataContext } from "../store/data-context.js";

export const updateFormRef = createRef();
export const updateGoalRef = createRef();

function TaskForm({ task, onSave, onCancel, onDelete }) {
  const dataCtx = useContext(DataContext);
  const [editingTask, setEditingTask] = useState(task);
  const navigation = useNavigation();

  useEffect(() => {
    updateFormRef.current = updateInputHandler;
    updateGoalRef.current = updateGoalHandler;
  }, []);

  function updateInputHandler(input, value) {
    setEditingTask((currTask) => ({ ...currTask, [input]: value }));
  }

  function updateDateHandler(_, date) {
    setEditingTask((currTask) => ({
      ...currTask,
      date,
    }));
  }

  function updateDurationHandler(input, value) {
    setEditingTask((currTask) => ({
      ...currTask,
      duration: { ...currTask.duration, [input]: value },
    }));
  }

  const priorities = {
    high: 0,
    medium: 1,
    low: 2,
  };

  function saveHandler() {
    onSave(editingTask);
    if (!editingTask.id) {
      setEditingTask(task);
    }
  }

  function cancelHandler() {
    setEditingTask(task);
    onCancel();
  }

  function openAction(action) {
    navigation.navigate("Action", {
      action: action,
    });
  }

  function deleteHandler() {
    onDelete(editingTask.id);
    navigation.goBack();
  }

  function updateGoalHandler(goalId) {
    const updatedGoalIndex = editingTask.goals.findIndex(
      (goal) => goal === goalId
    );
    const updatingGoal = updatedGoalIndex !== -1;
    setEditingTask((currTask) => ({
      ...currTask,
      goals: updatingGoal
        ? currTask.goals.filter((goal) => goal !== goalId)
        : [...currTask.goals, goalId],
    }));
  }

  return (
    <View>
      <View>
        <Text>Title</Text>
        <TextInput
          onChangeText={(value) => updateInputHandler("title", value)}
          value={editingTask.title}
        />
      </View>
      <View>
        <Text>Status</Text>
        <Pressable onPress={() => openAction("status")}>
          <Text>{capitalizeWords(editingTask.status)}</Text>
        </Pressable>
      </View>
      <View>
        <Text>Related Goals</Text>
        {editingTask.goals.length < 1 ? (
          <Button
            onPress={() => openAction("goals")}
            title="Add Goal"
          />
        ) : (
          editingTask.goals.map((goal) => {
            // TODO open goal screen on press
            const taskGoal = dataCtx.goals.find(
              (goalData) => goalData.id === goal
            );
            return (
              <View key={taskGoal.id}>
                <Pressable onPress={() => {}}>
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
          selectedIndex={priorities[editingTask.priority]}
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
            value={editingTask.duration.days}
            keyboardType="numeric"
          />
          <Text>Hours</Text>
          <TextInput
            onChangeText={(value) => updateDurationHandler("hours", value)}
            value={editingTask.duration.hours}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text>Minutes</Text>
          <TextInput
            onChangeText={(value) => updateDurationHandler("minutes", value)}
            value={editingTask.duration.minutes}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
      </View>
      <View>
        <Text>Due Date</Text>
        <DateTimePicker
          testID="datePicker"
          value={editingTask.date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={updateDateHandler}
          minimumDate={new Date()}
          positiveButtonLabel="OK!"
        />
        <DateTimePicker
          value={editingTask.date}
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
          value={editingTask.description}
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
      {editingTask.id && (
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
