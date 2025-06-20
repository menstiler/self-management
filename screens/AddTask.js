import { useContext, useLayoutEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import { DataContext } from "../store/data-context";

const initialTaskState = {
  title: "",
  duration: { days: 0, hours: 0, minutes: 0 },
  date: new Date(),
  description: "",
  priority: "low",
  status: "not started",
  goalId: "",
};

function AddTask({ navigation }) {
  const dataCtx = useContext(DataContext);
  const [task, setTask] = useState(initialTaskState);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "New Task",
    });
  }, [navigation]);

  function saveHandler(editingTask) {
    dataCtx.addTask(editingTask);
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
      onDelete={() => {}}
    />
  );
}

export default AddTask;
