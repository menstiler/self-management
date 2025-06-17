import { useContext, useLayoutEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import { TasksContext } from "../store/tasks-context";

function AddTask({ navigation }) {
  const tasksCtx = useContext(TasksContext);
  const [task, setTask] = useState({
    title: "",
    duration: { days: 0, hours: 0, minutes: 0 },
    date: new Date(),
    description: "",
    priorty: "low",
    status: "not started",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "New Task",
    });
  }, [navigation]);

  function saveHandler(editingTask) {
    tasksCtx.addTask(editingTask);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  if (!task) return null;

  return (
    <TaskForm
      task={task}
      onSave={saveHandler}
      onCancel={cancelHandler}
    />
  );
}

export default AddTask;
