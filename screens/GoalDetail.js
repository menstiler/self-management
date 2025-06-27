import { useState, useEffect, useLayoutEffect, useContext } from "react";
import { View, Text } from "react-native";

import { DataContext } from "../store/data-context.js";
import GoalForm from "../components/GoalForm.js";

function GoalDetail({ route, navigation }) {
  const dataCtx = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState();

  const goalId = route.params?.goalId;

  useEffect(() => {
    setLoading(true);
    if (goalId) {
      const goalIndex = dataCtx.goals.findIndex((goal) => goal.id === goalId);
      setGoal(dataCtx.goals[goalIndex]);
      dataCtx.updateEditingGoal(dataCtx.goals[goalIndex]);
    }
    setLoading(false);
  }, [goalId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: goal ? goal.title : "Edit Goal",
    });
  }, [goal]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  function udpateGoal() {
    dataCtx.updateGoal(goalId, dataCtx.editingGoal);
    setGoal(dataCtx.editingGoal);
  }

  function deleteGoal(goalId) {
    dataCtx.deleteGoal(goalId);
  }

  if (!Object.keys(dataCtx.editingGoal).length) return null;

  return (
    <GoalForm
      goal={goal}
      onSave={udpateGoal}
      onCancel={() => {}}
      onDelete={deleteGoal}
    />
  );
}

export default GoalDetail;
