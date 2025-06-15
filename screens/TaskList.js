import { FlatList, Pressable, View, Text } from "react-native";
import { TASKS } from "../data.js";

function TaskList({ navigation }) {
  function selectTaskHandler(id) {
    navigation.navigate("Task", {
      taskId: id,
    });
  }

  const TaskItem = ({ task, onSelect }) => (
    <Pressable onPress={() => onSelect(task.id)}>
      <View>
        <Text>{task.title}</Text>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={TASKS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onSelect={selectTaskHandler}
        />
      )}
    />
  );
}

export default TaskList;
