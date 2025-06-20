import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import { updateFormRef } from "../components/TaskForm";
import { capitalizeWords } from "../util/task";
import { GOALS } from "../data";

function Action({ navigation, route }) {
  const action = route.params?.action;

  function Status() {
    const statuses = ["not started", "in progress", "done"];

    function updateStatusHandler(status) {
      updateFormRef.current?.("status", status);
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

  function Goals() {
    const [searchedGoal, setSearchedGoal] = useState("");

    function updateGoalHandler(goalId) {
      updateFormRef.current?.("goalId", goalId);
      navigation.goBack();
    }

    function onChangeHandler(text) {
      setSearchedGoal(text);
    }

    function addGoalHandler() {}

    return (
      <View>
        <View>
          <TextInput
            placeholder="Search or create new Goal"
            value={searchedGoal}
            onChangeText={onChangeHandler}
          />
        </View>
        {searchedGoal && (
          <Button
            title="Create New Goal"
            onPress={addGoalHandler}
          />
        )}
        <ScrollView>
          {searchedGoal
            ? GOALS.filter((goal) =>
                goal.title.toLowerCase().includes(searchedGoal.toLowerCase())
              ).map((goal) => (
                <Pressable
                  key={goal.id}
                  onPress={() => updateGoalHandler(goal.id)}
                >
                  <View>
                    <Text>{capitalizeWords(goal.title)}</Text>
                  </View>
                </Pressable>
              ))
            : GOALS.map((goal) => (
                <Pressable
                  key={goal.id}
                  onPress={() => updateGoalHandler(goal.id)}
                >
                  <View>
                    <Text>{capitalizeWords(goal.title)}</Text>
                  </View>
                </Pressable>
              ))}
        </ScrollView>
      </View>
    );
  }

  switch (action) {
    case "status":
      return <Status />;
    case "goal":
      return <Goals />;
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
