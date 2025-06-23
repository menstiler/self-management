import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import { updateFormRef, updateGoalRef } from "../components/TaskForm";
import { capitalizeWords } from "../util/task";
import { GOALS } from "../data";
import { useContext } from "react";
import { DataContext } from "../store/data-context";

function Action({ navigation, route }) {
  const dataCtx = useContext(DataContext);
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
      updateGoalRef.current?.(goalId);
    }

    function onChangeHandler(text) {
      setSearchedGoal(text);
    }

    // TODO add new goal
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
            ? dataCtx.goals
                .filter((goal) =>
                  goal.title.toLowerCase().includes(searchedGoal.toLowerCase())
                )
                .map((goal) => (
                  <Pressable
                    key={goal.id}
                    onPress={() => updateGoalHandler(goal.id)}
                  >
                    <View>
                      <Text>{capitalizeWords(goal.title)}</Text>
                    </View>
                  </Pressable>
                ))
            : dataCtx.goals.map((goal) => (
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
    case "goals":
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
