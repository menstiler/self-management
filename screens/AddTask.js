import { useContext, useEffect, useLayoutEffect, useState } from "react";
import DataForm from "../components/DataForm";
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
  const [task, _] = useState(initialTaskState);

  useEffect(() => {
    dataCtx.updateEditingTask(initialTaskState);
  }, []);

  useLayoutEffect(() => {
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
    dataCtx.updateEditingTask(initialTaskState);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
    dataCtx.updateEditingTask(initialTaskState);
  }

  if (!Object.keys(dataCtx.editingTask).length) return null;

  return (
    <DataForm
      data="task"
      item={task}
      hasManyRelationship="goals"
      editingObj="editingTask"
      updateEditingObj="updateEditingTask"
      onSave={saveHandler}
      onCancel={cancelHandler}
      onDelete={() => {}}
    />
  );
}

export default AddTask;
