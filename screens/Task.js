import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { TASKS } from "../data.js";

function Task({ onSelect, route }) {
  const [task, setTask] = useState();
  const [loading, setLoading] = useState(true);
  const taskId = route.params.taskId;

  useEffect(() => {
    const taskIndex = TASKS.findIndex((task) => task.id === taskId);
    setTask(TASKS[taskIndex]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View>
        <Text>No Task Found</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={() => onSelect(id)}>
      <View>
        <Text>{task.title}</Text>
      </View>
    </Pressable>
  );
}

export default Task;
