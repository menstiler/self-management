import { useState, useCallback, useEffect, createRef } from "react";
import { TextInput, View, Text, Button, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useNavigation } from "@react-navigation/native";
import { capitalizeWords } from "../util/task";

export const updateFormRef = createRef();

function TaskForm({ task, onSave, onCancel }) {
  const [editingTask, setEditingTask] = useState(task);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      return () => {
        setEditingTask(task);
      };
    }, [])
  );

  useEffect(() => {
    updateFormRef.current = updateInputHandler;
  }, []);

  function updateInputHandler(input, value) {
    console.log(input, value);
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
  }

  function cancelHandler() {
    setEditingTask(task);
    onCancel();
  }

  function openAction() {
    navigation.navigate("Action", {
      action: "status",
    });
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
        <Pressable onPress={openAction}>
          <Text>{capitalizeWords(editingTask.status)}</Text>
        </Pressable>
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
    </View>
  );
}

export default TaskForm;
