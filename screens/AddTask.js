import { useState } from "react";
import { TextInput, View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function AddTask() {
  const [task, setTask] = useState({
    title: "",
    date: new Date(),
  });

  function updateInputHandler(input, value) {
    setTask((currTask) => ({ ...currTask, [input]: value }));
  }

  function updateDateHandler(_, date) {
    console.log(date);
    setTask((currTask) => ({ ...currTask, date }));
  }

  return (
    <View>
      <View>
        <Text>Title</Text>
        <TextInput
          onChangeText={(value) => updateInputHandler("title", value)}
          value={task.title}
        />
      </View>
      <View>
        <Text>Duration</Text>
        <TextInput
          onChangeText={(value) => updateInputHandler("duration", value)}
          value={task.duration}
          inputMode="numeric"
        />
      </View>
      <View>
        <Text>Due Date</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={task.date}
          mode={"date"}
          is24Hour={true}
          display="spinner"
          onChange={updateDateHandler}
        />
      </View>
    </View>
  );
}

export default AddTask;
