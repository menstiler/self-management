import { Pressable, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

function DataItem({ data, item }) {
  const navigation = useNavigation();

  function selectItemHandler(id) {
    const screen = data === "goal" ? "GoalDetail" : "TaskDetail";
    const screenId = data === "goal" ? "goalId" : "taskId";
    navigation.navigate(screen, {
      [screenId]: id,
    });
  }

  return (
    <Pressable onPress={() => selectItemHandler(item.id)}>
      <View>
        <Text>{item.title}</Text>
      </View>
    </Pressable>
  );
}

export default DataItem;
