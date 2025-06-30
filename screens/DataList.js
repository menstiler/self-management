import { useContext } from "react";
import { View, Text } from "react-native";
import { DataContext } from "../store/data-context.js";
import AllGoals from "../components/AllGoals.js";
import AllTasks from "../components/AllTasks.js";
import { capitalizeWords } from "../util/task.js";

function DataList({ route }) {
  const dataCtx = useContext(DataContext);

  if (dataCtx[route.params.data].length === 0) {
    return (
      <View>
        <Text>{`No ${capitalizeWords(route.params.data)} Found`}</Text>
      </View>
    );
  } else {
    if (route.name === "GoalList") {
      return <AllGoals />;
    } else {
      return <AllTasks />;
    }
  }
}

export default DataList;
