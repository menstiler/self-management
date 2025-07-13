import {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import { View, Text } from "react-native";
import { DataContext } from "../store/data-context.js";
import DataForm from "../components/DataForm.js";
import { capitalizeWords } from "../util/task.js";

function DataDetail({
  data,
  editingObj,
  hasManyRelationship,
  updateEditingObj,
  deleteObj,
  deleteObjAndRelationships,
  updateObj,
  routeId,
  route,
  navigation,
}) {
  const dataCtx = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState();
  const dataFormRef = useRef();

  const dataId = route.params?.[routeId];

  useEffect(() => {
    if (route.params?.duplicate) {
      dataFormRef.current?.duplicateTask();
      navigation.setParams({ duplicate: undefined });
    }
  }, [route.params?.duplicate]);

  useEffect(() => {
    setLoading(true);
    if (dataId) {
      const stateData = data === "task" ? "tasks" : "goals";
      const dataIndex = dataCtx[stateData].findIndex(
        (item) => item.id === dataId
      );
      setItem(dataCtx[stateData][dataIndex]);
      dataCtx[updateEditingObj](dataCtx[stateData][dataIndex]);
    }
    setLoading(false);
  }, [dataId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: item ? item.title : `Edit ${capitalizeWords(data)}`,
    });
  }, [item]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  function saveItem() {
    console.log("saveItem called");
    console.log("data:", data);
    console.log("editingObj:", dataCtx[editingObj]);
    console.log("isRecurring:", dataCtx[editingObj].isRecurring);
    console.log("parentTaskId:", dataCtx[editingObj].parentTaskId);
    console.log("startDate:", dataCtx[editingObj].startDate);
    console.log("endDate:", dataCtx[editingObj].endDate);

    // Check if this is a recurring task (parent or instance)
    if (
      data === "task" &&
      (dataCtx[editingObj].isRecurring || dataCtx[editingObj].parentTaskId)
    ) {
      console.log("Updating recurring task");
      // Determine the parent task ID
      const parentTaskId = dataCtx[editingObj].parentTaskId || dataId;
      console.log("parentTaskId:", parentTaskId);

      // When updating from an instance, filter out instance-specific properties
      const updateData = { ...dataCtx[editingObj] };

      // Remove instance-specific properties that shouldn't be copied to parent
      if (dataCtx[editingObj].parentTaskId) {
        console.log("Updating from instance");
        delete updateData.date;
        delete updateData.parentTaskId;
        delete updateData.isRecurring;
        delete updateData.id;
      } else {
        console.log("Updating parent task");
        // When editing the parent task itself, ensure isRecurring is set to true
        updateData.isRecurring = true;

        // Ensure startDate and endDate are set for parent tasks
        if (!updateData.startDate) {
          updateData.startDate = new Date();
        }
        if (!updateData.endDate) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 7);
          updateData.endDate = endDate;
        }
      }

      console.log("updateData:", updateData);
      dataCtx.updateRecurringTask(parentTaskId, updateData);
    } else {
      console.log("Updating regular task");
      dataCtx[updateObj](dataId, dataCtx[editingObj]);
    }
    setItem(dataCtx[editingObj]);
  }

  function deleteItem(itemId) {
    dataCtx[deleteObj](itemId);
  }

  function deleteItemAndRelationships(goalId) {
    dataCtx[deleteObjAndRelationships](goalId);
  }

  if (!Object.keys(dataCtx[editingObj]).length) return null;

  return (
    <DataForm
      data={data}
      item={item}
      hasManyRelationship={hasManyRelationship}
      editingObj={editingObj}
      updateEditingObj={updateEditingObj}
      onSave={saveItem}
      onCancel={() => {}}
      onDelete={deleteItem}
      onDeleteItemAndRelationships={deleteItemAndRelationships}
      ref={dataFormRef}
    />
  );
}

export default DataDetail;
