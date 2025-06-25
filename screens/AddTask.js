import { useContext, useEffect, useLayoutEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import { DataContext } from "../store/data-context";
import { useIsFocused } from "@react-navigation/native";

const initialTaskState = {
  title: "",
  duration: { days: 0, hours: 0, minutes: 0 },
  date: new Date(),
  description: "",
  priority: "low",
  status: "not started",
  goals: [],
};

function AddTask({ navigation }) {
  const isFocused = useIsFocused();
  const dataCtx = useContext(DataContext);
  const [task, setTask] = useState(initialTaskState);

  useLayoutEffect(() => {
    dataCtx.updateEditingTask(initialTaskState);
    navigation.setOptions({
      title: "New Task",
    });
  }, [navigation]);

  useEffect(() => {
    // needed for when navigation from TaskDetail to ensure data is reset
    if (isFocused && dataCtx.editingTask.id) {
      dataCtx.updateEditingTask(initialTaskState);
    }
  }, [isFocused]);

  function saveHandler() {
    dataCtx.addTask(dataCtx.editingTask);
    dataCtx.updateEditingTask({});
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
    dataCtx.updateEditingTask({});
  }

  if (!Object.keys(dataCtx.editingTask).length) return null;

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
