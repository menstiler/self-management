import { useContext } from "react";
import { View, Text } from "react-native";
import { DataContext } from "../store/data-context.js";
import AllGoals from "../components/AllGoals.js";

function GoalList() {
  const dataCtx = useContext(DataContext);

  if (dataCtx?.goals?.length === 0) {
    return (
      <View>
        <Text>No Goals Found</Text>
      </View>
    );
  }

  return <AllGoals />;
}

export default GoalList;
