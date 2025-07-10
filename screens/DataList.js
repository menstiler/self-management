import { useContext } from "react";
import { View, Text } from "react-native";
import { DataContext } from "../store/data-context.js";
import AllItems from "../components/AllItems.js";
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
    return <AllItems data={route.name === "GoalList" ? "goal" : "task"} />;
  }
}

export default DataList;
