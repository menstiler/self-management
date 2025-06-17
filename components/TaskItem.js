import { Pressable, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

function TaskItem({ task }) {
  const navigation = useNavigation();

  function selectTaskHandler(id) {
    navigation.navigate("TaskDetail", {
      taskId: id,
    });
  }

  return (
    <Pressable onPress={() => selectTaskHandler(task.id)}>
      <View>
        <Text>{task.title}</Text>
      </View>
    </Pressable>
  );
}

export default TaskItem;
