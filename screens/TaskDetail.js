import { useState, useEffect, useLayoutEffect, useContext } from "react";
import { View, Text } from "react-native";

import { TasksContext } from "../store/tasks-context.js";
import TaskForm from "../components/TaskForm.js";

function TaskDetail({ route, navigation }) {
  const tasksCtx = useContext(TasksContext);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState();

  const taskId = route.params?.taskId;

  useEffect(() => {
    setLoading(true);
    if (taskId) {
      const taskIndex = tasksCtx.tasks.findIndex((task) => task.id === taskId);
      setTask(tasksCtx.tasks[taskIndex]);
    }
    setLoading(false);
  }, [taskId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: task ? task.title : "Edit Task",
    });
  }, [task]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  function udpateTask(editingTask) {
    tasksCtx.updateTask(taskId, editingTask);
    setTask(editingTask);
  }

  function deleteTask(taskId) {
    tasksCtx.deleteTask(taskId);
  }

  return (
    <TaskForm
      task={task}
      onSave={udpateTask}
      onCancel={() => {}}
      onDelete={deleteTask}
    />
  );
}

export default TaskDetail;
