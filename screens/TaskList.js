import { useContext, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { DataContext } from "../store/data-context.js";
import { GOALS, TASKS } from "../data.js";
import AllTasks from "../components/AllTasks.js";
import { getHasFetched, setHasFetched } from "../store/fetchGuard.js";

function TaskList() {
  const [loading, setLoading] = useState(true);
  const dataCtx = useContext(DataContext);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        dataCtx.setTasks(TASKS);
        dataCtx.setGoals(GOALS);
      } catch (error) {
        setError("Could not load data");
      }
      setLoading(false);
    }
    if (!getHasFetched()) {
      loadData();
      setHasFetched(true);
    } else {
      setLoading(false);
    }
  }, [getHasFetched, setHasFetched]);

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

  return <AllTasks />;
}

export default TaskList;
