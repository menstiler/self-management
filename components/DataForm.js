import { useContext } from "react";
import { TextInput, View, Text, Button, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DataContext } from "../store/data-context.js";
import { capitalizeWords } from "../util/task.js";
import DateField from "./form/DateField";
import PriorityField from "./form/PriorityField";
import DurationField from "./form/DurationField";
import RelationshipField from "./form/RelationshipField";

function DataForm({
  data,
  item,
  hasManyRelationship,
  editingObj,
  updateEditingObj,
  onSave,
  onCancel,
  onDelete,
}) {
  const dataCtx = useContext(DataContext);
  const navigation = useNavigation();

  function updateInputHandler(input, value) {
    dataCtx[updateEditingObj]({ ...dataCtx[editingObj], [input]: value });
  }

  function updateDateHandler(_, date) {
    dataCtx[updateEditingObj]({
      ...dataCtx[editingObj],
      date,
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
      {data === "task" && (
        <View>
          <Text>Status</Text>
          <Pressable onPress={() => openAction("status")}>
            <Text>{capitalizeWords(dataCtx[editingObj].status)}</Text>
          </Pressable>
        </View>
      )}
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
            onPress={deleteHandler}
            color="red"
          />
        </View>
      )}
    </View>
  );
}

export default DataForm;
