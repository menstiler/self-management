import { useState, useEffect, useLayoutEffect, useContext } from "react";
import { View, Text } from "react-native";

import { DataContext } from "../store/data-context.js";
import TaskForm from "../components/TaskForm.js";

function TaskDetail({ route, navigation }) {
  const dataCtx = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState();

  const taskId = route.params?.taskId;

  useEffect(() => {
    setLoading(true);
    if (taskId) {
      const taskIndex = dataCtx.tasks.findIndex((task) => task.id === taskId);
      setTask(dataCtx.tasks[taskIndex]);
      dataCtx.updateEditingTask(dataCtx.tasks[taskIndex]);
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

  function udpateTask() {
    dataCtx.updateTask(taskId, dataCtx.editingTask);
    setTask(dataCtx.editingTask);
  }

  function deleteTask(taskId) {
    dataCtx.deleteTask(taskId);
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
