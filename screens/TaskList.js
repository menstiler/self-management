import { useContext, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { DataContext } from "../store/data-context.js";
import { TASKS } from "../data.js";
import FilteredTasks from "../components/FilteredTasks.js";
import AllTasks from "../components/AllTasks.js";

function TaskList({ route }) {
  const [loading, setLoading] = useState(true);
  const dataCtx = useContext(DataContext);

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      try {
        dataCtx.setTasks(TASKS);
      } catch (error) {
        setError("Could not load tasks");
      }
      setLoading(false);
    }
    loadTasks();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (dataCtx?.tasks?.length === 0) {
    return (
      <View>
        <Text>No Tasks Found</Text>
      </View>
    );
  }

  if (route.name === "FilteredTasks") {
    return <FilteredTasks />;
  }

  return <AllTasks />;
}

export default TaskList;
