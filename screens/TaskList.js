import { useContext } from "react";
import { View, Text } from "react-native";
import { DataContext } from "../store/data-context.js";
import AllTasks from "../components/AllTasks.js";

function TaskList() {
  const dataCtx = useContext(DataContext);

  if (dataCtx?.tasks?.length === 0) {
    return (
      <View>
        <Text>No Tasks Found</Text>
      </View>
    );
  }

  return <AllTasks />;
}

export default TaskList;
