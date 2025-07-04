import { useEffect, useContext, useState } from "react";
import { TextInput, View, Text, Button, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DataContext } from "../store/data-context.js";
import { capitalizeWords } from "../util/task.js";
import DateField from "./form/DateField";
import PriorityField from "./form/PriorityField";
import DurationField from "./form/DurationField";
import RelationshipField from "./form/RelationshipField";
import DeleteModal from "./form/DeleteModal";
import Checkbox from "expo-checkbox";

function DataForm({
  data,
  item,
  hasManyRelationship,
  editingObj,
  updateEditingObj,
  onSave,
  onCancel,
  onDelete,
  onDeleteItemAndRelationships,
}) {
  const dataCtx = useContext(DataContext);
  const navigation = useNavigation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function updateInputHandler(input, value) {
    dataCtx[updateEditingObj]({ ...dataCtx[editingObj], [input]: value });
  }

  function updateDateHandler(_, date) {
    dataCtx[updateEditingObj]({
      ...dataCtx[editingObj],
      [data === "task" ? "date" : "deadline"]: date,
    });
  }

  function saveHandler() {
    onSave();
  }

  function cancelHandler() {
    dataCtx[updateEditingObj](item);
    onCancel();
  }

  function openAction(action) {
    navigation.navigate("Action", {
      action: action,
    });
  }

  function deleteHandler() {
    onDelete(dataCtx[editingObj].id);
    navigation.goBack();
  }

  function deleteGoalWithTasksHandler() {
    onDeleteItemAndRelationships(dataCtx[editingObj].id);
    navigation.goBack();
  }

  useEffect(() => {
    if (data === "goal") {
      if (dataCtx[editingObj].trackTaskStatus) {
        const allTasks = dataCtx.tasks || [];

        const goalTasks = allTasks.filter((task) =>
          (dataCtx[editingObj].tasks || []).includes(task.id)
        );

        const anyTaskInProgressOrDone = goalTasks.some(
          (task) => task.status === "in progress" || task.status === "done"
        );

        const allTasksComplete =
          goalTasks.length > 0 &&
          goalTasks.every((task) => task.status === "done");

        let goalStatus = "";
        if (allTasksComplete) {
          goalStatus = "done";
        } else if (anyTaskInProgressOrDone) {
          goalStatus = "in progress";
        } else {
          goalStatus = "not started";
        }

        dataCtx[updateEditingObj]({
          ...dataCtx[editingObj],
          status: goalStatus,
        });
      }
    }
  }, []);

  // TODO add progress for goals
  return (
    <View>
      <View>
        <Text>Title</Text>
        <TextInput
          onChangeText={(value) => updateInputHandler("title", value)}
          value={dataCtx[editingObj].title}
        />
      </View>
      <View>
        <View>
          <Text>Status</Text>
          <Pressable
            onPress={() => {
              if (data === "goal" && dataCtx[editingObj].trackTaskStatus)
                return;
              openAction(data === "task" ? "task-status" : "goal-status");
            }}
          >
            <Text>{capitalizeWords(dataCtx[editingObj].status)}</Text>
          </Pressable>
        </View>
        {data === "goal" && (
          <View>
            <Checkbox
              value={dataCtx[editingObj].trackTaskStatus}
              onValueChange={(value) =>
                updateInputHandler("trackTaskStatus", value)
              }
            />
          </View>
        )}
      </View>
      <RelationshipField
        hasManyRelationship={hasManyRelationship}
        dataCtx={dataCtx}
        editingObj={editingObj}
        updateEditingObj={updateEditingObj}
        openAction={openAction}
      />
      {data === "task" && (
        <>
          <PriorityField
            value={dataCtx[editingObj].priority}
            updateInputHandler={updateInputHandler}
          />
          <DurationField
            durationValue={dataCtx[editingObj].duration}
            dataCtx={dataCtx}
          />
        </>
      )}
      <DateField
        data={data}
        value={dataCtx[editingObj][data === "task" ? "date" : "deadline"]}
        updateDateHandler={updateDateHandler}
      />
      <View>
        <TextInput
          onChangeText={(value) => updateInputHandler("description", value)}
          value={dataCtx[editingObj].description}
        />
      </View>
      <View>
        <Button
          title="Save"
          onPress={saveHandler}
        />
        <Button
          title="Cancel"
          onPress={cancelHandler}
        />
      </View>
      {dataCtx[editingObj].id && (
        <View>
          <Button
            title={`Delete ${capitalizeWords(data)}`}
            onPress={() => setShowDeleteModal(true)}
            color="red"
          />
        </View>
      )}
      <DeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => {
          deleteHandler();
          setShowDeleteModal(false);
        }}
        onDeleteWithTasks={() => {
          deleteGoalWithTasksHandler();
          setShowDeleteModal(false);
        }}
        itemTitle={dataCtx[editingObj].title}
        itemType={data}
      />
    </View>
  );
}

export default DataForm;
