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

  function udpateItem() {
    dataCtx[updateObj](dataId, dataCtx[editingObj]);
    setItem(dataCtx[editingObj]);
  }

  function deleteItem(goalId) {
    dataCtx[deleteObj](goalId);
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
      onSave={udpateItem}
      onCancel={() => {}}
      onDelete={deleteItem}
      onDeleteItemAndRelationships={deleteItemAndRelationships}
      ref={dataFormRef}
    />
  );
}

export default DataDetail;
