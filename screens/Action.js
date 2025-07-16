import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import { capitalizeWords } from "../util/task";
import { useContext } from "react";
import { DataContext } from "../store/data-context";
import ReccuringInputs from "../components/form/ReccuringInputs";

function Action({ navigation, route }) {
  const dataCtx = useContext(DataContext);
  const action = route.params?.action;

  function Status({ editingObj, updateEditingObj }) {
    const statuses = ["not started", "in progress", "done"];

    function updateStatusHandler(status) {
      dataCtx[updateEditingObj]({
        ...dataCtx[editingObj],
        status,
      });
      navigation.goBack();
    }

    return (
      <ScrollView>
        {statuses.map((status, index) => (
          <Pressable
            key={index}
            onPress={() => updateStatusHandler(status)}
          >
            <View>
              <Text>{capitalizeWords(status)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  function AddRelationship({ data, editingObj, updateEditingObj }) {
    const [searchedItem, setSearchedItem] = useState("");

    function addItemHandler(itemId) {
      const currentArr = dataCtx[editingObj][data] || [];
      if (currentArr.includes(itemId)) return;

      dataCtx[updateEditingObj]({
        ...dataCtx[editingObj],
        [data]: [...currentArr, itemId],
      });
    }

    function removeItemHandler(itemId) {
      const currentArr = dataCtx[editingObj][data] || [];

      dataCtx[updateEditingObj]({
        ...dataCtx[editingObj],
        [data]: currentArr.filter((item) => item !== itemId),
      });
    }

    function onChangeHandler(text) {
      setSearchedItem(text);
    }

    // TODO add new item
    function addNewItemHandler() {}

    function Item({ item }) {
      return (
        <View>
          <Pressable
            key={item.id}
            onPress={() => addItemHandler(item.id)}
          >
            <View>
              <Text>{capitalizeWords(item.title)}</Text>
            </View>
          </Pressable>
          {dataCtx[editingObj] &&
            dataCtx[editingObj][data].includes(item.id) && (
              <Button
                title={`Remove ${capitalizeWords(data.slice(0, -1))}`}
                onPress={() => removeItemHandler(item.id)}
              />
            )}
        </View>
      );
    }

    return (
      <View>
        <View>
          <TextInput
            placeholder={`Search or create new ${capitalizeWords(data)}`}
            value={searchedItem}
            onChangeText={onChangeHandler}
          />
        </View>
        {searchedItem && (
          <Button
            title={`Create New ${capitalizeWords(data)}`}
            onPress={addItemHandler}
          />
        )}
        <ScrollView>
          {dataCtx[data]
            .filter((item) => {
              if (searchedItem) {
                return item.title
                  .toLowerCase()
                  .includes(searchedItem.toLowerCase());
              } else {
                return item;
              }
            })
            .map((item) => (
              <Item
                key={item.id}
                item={item}
              />
            ))}
        </ScrollView>
      </View>
    );
  }

  switch (action) {
    case "task-status":
      return (
        <Status
          editingObj="editingTask"
          updateEditingObj="updateEditingTask"
        />
      );
    case "goal-status":
      return (
        <Status
          editingObj="editingGoal"
          updateEditingObj="updateEditingGoal"
        />
      );
    case "goals":
      return (
        <AddRelationship
          data="goals"
          editingObj="editingTask"
          updateEditingObj="updateEditingTask"
        />
      );
    case "tasks":
      return (
        <AddRelationship
          data="tasks"
          editingObj="editingGoal"
          updateEditingObj="updateEditingGoal"
        />
      );
    case "recurring":
      return (
        <ReccuringInputs
          dataCtx={dataCtx}
          editingObj="editingTask"
          updateEditingObj="updateEditingTask"
        />
      );
    default:
      return (
        <View>
          <Text>Can't find any actions</Text>
        </View>
      );
  }
}

export default Action;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
