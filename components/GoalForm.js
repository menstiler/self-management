import { useContext } from "react";
import { TextInput, View, Text, Button, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { DataContext } from "../store/data-context.js";

function GoalForm({ goal, onSave, onCancel, onDelete }) {
  const dataCtx = useContext(DataContext);
  const navigation = useNavigation();

  function updateInputHandler(input, value) {
    dataCtx.updateEditingGoal({ ...dataCtx.editingGoal, [input]: value });
  }

  function updateDateHandler(_, date) {
    dataCtx.updateEditingGoal({
      ...dataCtx.editingGoal,
      date,
    });
  }

  function saveHandler() {
    onSave();
  }

  function cancelHandler() {
    dataCtx.updateEditingGoal(goal);
    onCancel();
  }

  function openAction(action) {
    navigation.navigate("Action", {
      action: action,
    });
  }

  function deleteHandler() {
    onDelete(dataCtx.editingGoal.id);
    navigation.goBack();
  }

  function updateTaskHandler(taskId) {
    dataCtx.updateEditingGoal({
      ...dataCtx.editingGoal,
      tasks:
        dataCtx.editingGoal.tasks.findIndex((task) => task === taskId) !== -1
          ? dataCtx.editingGoal.tasks.filter((task) => task !== taskId)
          : [...dataCtx.editingGoal.tasks, taskId],
    });
  }

  // TODO add progress
  return (
    <View>
      <View>
        <Text>Title</Text>
        <TextInput
          onChangeText={(value) => updateInputHandler("title", value)}
          value={dataCtx.editingGoal.title}
        />
      </View>
      <View>
        <Text>Related Tasks</Text>
        {dataCtx.editingGoal.tasks.length < 1 ? (
          <Button
            onPress={() => openAction("tasks")}
            title="Add Task"
          />
        ) : (
          dataCtx.editingGoal.tasks.map((task) => {
            // TODO open task screen on press
            const goalTask = dataCtx.tasks.find(
              (taskData) => taskData.id === task
            );
            return (
              <View key={goalTask.id}>
                <Pressable onPress={() => openAction("tasks")}>
                  <Text>{goalTask.title}</Text>
                </Pressable>
                <Button
                  title="Remove Task"
                  onPress={() => updateTaskHandler(goalTask.id)}
                />
              </View>
            );
          })
        )}
      </View>
      <View>
        <Text>Deadline</Text>
        <DateTimePicker
          testID="datePicker"
          value={dataCtx.editingGoal.deadline}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={updateDateHandler}
          minimumDate={new Date()}
          positiveButtonLabel="OK!"
        />
        <DateTimePicker
          value={dataCtx.editingGoal.deadline}
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
          value={dataCtx.editingGoal.description}
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
      {dataCtx.editingGoal.id && (
        <View>
          <Button
            title="Delete Goal"
            onPress={deleteHandler}
            color="red"
          />
        </View>
      )}
    </View>
  );
}

export default GoalForm;
