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

function Action({ navigation, route }) {
  const dataCtx = useContext(DataContext);
  const action = route.params?.action;

  function Status() {
    const statuses = ["not started", "in progress", "done"];

    function updateStatusHandler(status) {
      dataCtx.updateEditingTask({
        ...dataCtx.editingTask,
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

  function Goals() {
    const [searchedGoal, setSearchedGoal] = useState("");

    function addGoalHandler(goalId) {
      if (dataCtx.editingTask.goals.includes(goalId)) return;
      dataCtx.updateEditingTask({
        ...dataCtx.editingTask,
        goals: [...dataCtx.editingTask.goals, goalId],
      });
    }

    function removeGoalHandler(goalId) {
      dataCtx.updateEditingTask({
        ...dataCtx.editingTask,
        goals: dataCtx.editingTask.goals.filter((goal) => goal !== goalId),
      });
    }

    function onChangeHandler(text) {
      setSearchedGoal(text);
    }

    // TODO add new goal
    function addNewGoalHandler() {}

    function GoalItem({ goal }) {
      return (
        <View>
          <Pressable
            key={goal.id}
            onPress={() => addGoalHandler(goal.id)}
          >
            <View>
              <Text>{capitalizeWords(goal.title)}</Text>
            </View>
          </Pressable>
          {dataCtx.editingTask &&
            dataCtx.editingTask.goals.includes(goal.id) && (
              <Button
                title="Remove Goal"
                onPress={() => removeGoalHandler(goal.id)}
              />
            )}
        </View>
      );
    }

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
          {dataCtx.goals
            .filter((goal) => {
              if (searchedGoal) {
                return goal.title
                  .toLowerCase()
                  .includes(searchedGoal.toLowerCase());
              } else {
                return goal;
              }
            })
            .map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
              />
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
