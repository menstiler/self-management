import { useContext } from "react";
import { FlatList } from "react-native";
import TaskItem from "./TaskItem";
import { DataContext } from "../store/data-context.js";
import { sortTasksByTime } from "../util/task";

function AllTask() {
  const { tasks } = useContext(DataContext);
  const sortedTasks = sortTasksByTime([...tasks]);

  return (
    <FlatList
      data={sortedTasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
}

export default AllTask;
