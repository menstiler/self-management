import { Pressable, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

function DataItem({ data }) {
  const navigation = useNavigation();

  function selectItemHandler(id) {
    const screen = data === "goal" ? "GoalDetail" : "TaskDetail";
    const screenId = data === "goal" ? "goalId" : "taskId";
    navigation.navigate(screen, {
      [screenId]: id,
    });
  }

  return (
    <Pressable onPress={() => selectItemHandler(data.id)}>
      <View>
        <Text>{data.title}</Text>
      </View>
    </Pressable>
  );
}

export default DataItem;
