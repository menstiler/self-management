import { useContext } from "react";
import { FlatList } from "react-native";
import TaskItem from "./TaskItem";
import { TasksContext } from "../store/tasks-context.js";
import { sortTasksByTime } from "../util/task";

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function FilteredTasks() {
  const { tasks } = useContext(TasksContext);

  const filteredTaskByDay = [...tasks].filter((task) => {
    return isSameDay(new Date(task.date), new Date());
  });

  const sortedTasks = sortTasksByTime(filteredTaskByDay);

  return (
    <FlatList
      data={sortedTasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
}

export default FilteredTasks;
