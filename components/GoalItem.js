import { Pressable, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

function GoalItem({ goal }) {
  const navigation = useNavigation();

  function selectGoalHandler(id) {
    navigation.navigate("GoalDetail", {
      goalId: id,
    });
  }

  return (
    <Pressable onPress={() => selectGoalHandler(goal.id)}>
      <View>
        <Text>{goal.title}</Text>
      </View>
    </Pressable>
  );
}

export default GoalItem;
