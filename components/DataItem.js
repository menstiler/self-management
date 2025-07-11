import { Pressable, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { capitalizeWords } from "../util/task.js";
import CircularProgress from "react-native-circular-progress-indicator";
import { useGoalMeta } from "../hooks/useGoalMeta";

function DataItem({ data, item }) {
  const navigation = useNavigation();

  function selectItemHandler(id) {
    const screen = data === "goal" ? "GoalDetail" : "TaskDetail";
    const screenId = data === "goal" ? "goalId" : "taskId";

    navigation.navigate(screen, {
      [screenId]: id,
    });
  }

  const { progress, status, goalTasks, completedTasks } =
    data === "goal"
      ? useGoalMeta(item)
      : {
          progress: null,
          status: item.status,
          goalTasks: [],
          completedTasks: null,
        };

  return (
    <Pressable onPress={() => selectItemHandler(item.id)}>
      <View style={styles.topRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.goalTitle}>{item.title}</Text>
          <Text style={styles.goalProgressText}>{capitalizeWords(status)}</Text>
          {data === "goal" && (
            <Text>
              {goalTasks.length > 0
                ? `${completedTasks} of ${goalTasks.length} completed.`
                : `No tasks completed`}
            </Text>
          )}
        </View>
        {data === "goal" && (
          <CircularProgress
            value={progress}
            radius={35}
            activeStrokeColor="#4CAF50"
            inActiveStrokeColor="#E0E0E0"
            inActiveStrokeWidth={8}
            activeStrokeWidth={8}
            progressValueColor="#333"
            maxValue={100}
            showProgressValue={false}
            title={`${progress.toFixed(0)}%`}
            titleFontSize={16}
            titleColor="black"
            titleStyle={{ fontWeight: "bold" }}
          />
        )}
      </View>
    </Pressable>
  );
}

export default DataItem;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  titleWrapper: {
    width: "75%",
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  goalProgressText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});
